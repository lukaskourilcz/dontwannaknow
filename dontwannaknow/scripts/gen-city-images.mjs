// Build-time generator for curated period photographs of supported cities.
// It verifies the live Wikimedia Commons metadata, fails closed on licences,
// downloads a bounded thumbnail and commits an optimized same-origin WebP.
// The shipped app never calls Commons and never receives an API key.
//
//   npm run data:city-images
//
// Inputs:
//   src/data/cityImages/scope.json
//   src/data/cityImages/selection.json
//
// Outputs:
//   src/data/cityImages/<city>.json
//   src/data/provenance/cityImages.json
//   public/data/images/<city>/<decade>/<id>.webp

import { execFileSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertAllowedLicence, licenceRequiresAttribution } from "./city-images/licence.mjs";
import {
  CITY_IMAGE_LONGEST_EDGE,
  CITY_IMAGE_MAX_BYTES,
  validateCityImageRecord,
} from "./city-images/validate.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = resolve(ROOT, "src/data/cityImages");
const SELECTION_FILE = resolve(DATA_DIR, "selection.json");
const SCOPE_FILE = resolve(DATA_DIR, "scope.json");
const PROVENANCE_FILE = resolve(ROOT, "src/data/provenance/cityImages.json");
const IMAGE_DIR = resolve(ROOT, "public/data/images");
const USER_AGENT =
  "TehdejsiSvet/1.0 (https://github.com/lukaskourilcz/dontwannaknow; city-image build)";

const cleanText = (value) =>
  String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();

const serialized = (value) => `${JSON.stringify(value, null, 2)}\n`;

function commonsMetadata(titles) {
  if (!titles.length) return new Map();
  const body = execFileSync(
    "curl",
    [
      "-sS",
      "--fail",
      "--http1.1",
      "--retry",
      "4",
      "--retry-delay",
      "4",
      "--max-time",
      "60",
      "-A",
      USER_AGENT,
      "-G",
      "https://commons.wikimedia.org/w/api.php",
      "--data-urlencode",
      "action=query",
      "--data-urlencode",
      `titles=${titles.join("|")}`,
      "--data-urlencode",
      "prop=imageinfo",
      "--data-urlencode",
      "iiprop=url|extmetadata|mime|size",
      "--data-urlencode",
      "iiurlwidth=1200",
      "--data-urlencode",
      "redirects=1",
      "--data-urlencode",
      "format=json",
      "--data-urlencode",
      "formatversion=2",
      "--data-urlencode",
      "maxlag=5",
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const payload = JSON.parse(body);
  const output = new Map();
  for (const page of payload.query?.pages ?? []) {
    const info = page.imageinfo?.[0];
    if (!info || page.missing) continue;
    output.set(page.title, info);
  }
  return output;
}

function licenceFallbackUrl(licence) {
  if (licence === "PDM 1.0") return "https://creativecommons.org/publicdomain/mark/1.0/";
  if (licence === "CC0 1.0") return "https://creativecommons.org/publicdomain/zero/1.0/";
  const bySa = licence.match(/^CC BY-SA ([1-4]\.0)$/);
  if (bySa) return `https://creativecommons.org/licenses/by-sa/${bySa[1]}/`;
  const by = licence.match(/^CC BY ([1-4]\.0)$/);
  if (by) return `https://creativecommons.org/licenses/by/${by[1]}/`;
  return "";
}

function checkedMetadata(selection, info) {
  const metadata = info.extmetadata ?? {};
  const licence = assertAllowedLicence(
    metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value,
    selection.commonsTitle,
  );
  const explicitAttribution = cleanText(metadata.Attribution?.value);
  const rawArtist = cleanText(metadata.Artist?.value);
  const credit = cleanText(metadata.Credit?.value);
  const genericArtist = /^(?:unknown(?: author)?(?: unknown(?: author)?)?|q\d+)$/i.test(rawArtist);
  const artist = cleanText(selection.attributionOverride)
    || explicitAttribution
    || (!genericArtist && rawArtist)
    || (licenceRequiresAttribution(licence) && credit)
    || "Neznámý autor";
  if (licenceRequiresAttribution(licence) && !artist) {
    throw new Error(`${selection.commonsTitle}: licence ${licence} vyžaduje uvedení autora.`);
  }
  const sourceUrl = String(info.descriptionurl ?? "");
  if (!sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) {
    throw new Error(`${selection.commonsTitle}: chybí kanonická stránka souboru.`);
  }
  return {
    licence,
    licenceUrl: String(metadata.LicenseUrl?.value ?? "") || licenceFallbackUrl(licence),
    attribution: artist ? `${artist}, Wikimedia Commons` : "Wikimedia Commons",
    sourceUrl,
    sourceTitle: cleanText(metadata.ObjectName?.value) || selection.commonsTitle.replace(/^File:/, ""),
    publisher: "Wikimedia Commons",
  };
}

function targetDimensions(width, height, longestEdge = CITY_IMAGE_LONGEST_EDGE) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("Zdrojový obrázek nemá platné rozměry.");
  }
  const ratio = Math.min(1, longestEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function makeDerivative(selection, info, temporaryDirectory) {
  const sourceUrl = String(info.thumburl ?? info.url ?? "");
  if (!/^https:\/\//.test(sourceUrl)) {
    throw new Error(`${selection.commonsTitle}: chybí HTTPS obrazový soubor.`);
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(info.mime)) {
    throw new Error(`${selection.commonsTitle}: nepodporovaný typ ${info.mime}.`);
  }
  const suffix = extname(new URL(sourceUrl).pathname) || ".img";
  const sourceFile = resolve(temporaryDirectory, `${selection.id}${suffix}`);
  execFileSync(
    "curl",
    [
      "-sS",
      "--fail",
      "--http1.1",
      "--retry",
      "3",
      "--retry-delay",
      "2",
      "--max-time",
      "90",
      "-A",
      USER_AGENT,
      "-o",
      sourceFile,
      sourceUrl,
    ],
    { stdio: "inherit" },
  );

  const relativeFile = `${selection.city}/${selection.decade}/${selection.id}.webp`;
  const outputFile = resolve(IMAGE_DIR, relativeFile);
  await mkdir(dirname(outputFile), { recursive: true });

  let outputBytes = Number.POSITIVE_INFINITY;
  let selectedDimensions = targetDimensions(
    info.thumbwidth ?? info.width,
    info.thumbheight ?? info.height,
  );
  compression:
  for (const longestEdge of [CITY_IMAGE_LONGEST_EDGE, 850, 700]) {
    const dimensions = targetDimensions(
      info.thumbwidth ?? info.width,
      info.thumbheight ?? info.height,
      longestEdge,
    );
    for (const quality of [78, 66, 54, 42, 32, 26]) {
      execFileSync(
        "cwebp",
        [
          "-quiet",
          "-q",
          String(quality),
          "-metadata",
          "none",
          "-resize",
          String(dimensions.width),
          String(dimensions.height),
          sourceFile,
          "-o",
          outputFile,
        ],
        { stdio: "inherit" },
      );
      outputBytes = (await stat(outputFile)).size;
      selectedDimensions = dimensions;
      if (outputBytes <= CITY_IMAGE_MAX_BYTES) break compression;
    }
  }
  if (outputBytes > CITY_IMAGE_MAX_BYTES) {
    throw new Error(
      `${selection.commonsTitle}: derivát má ${outputBytes} B, limit je ${CITY_IMAGE_MAX_BYTES} B.`,
    );
  }
  return { ...selectedDimensions, file: relativeFile, bytes: outputBytes };
}

const scope = JSON.parse(await readFile(SCOPE_FILE, "utf8"));
const selectionPayload = JSON.parse(await readFile(SELECTION_FILE, "utf8"));
const selections = selectionPayload.records ?? [];
const scopeSlugs = new Set(scope.map((city) => city.slug));
if (scope.length !== 20 || scopeSlugs.size !== 20) {
  throw new Error("cityImages/scope.json musí obsahovat právě dvacet jedinečných měst.");
}
for (const record of selections) {
  if (!scopeSlugs.has(record.city)) throw new Error(`${record.id}: město ${record.city} není v rozsahu P6.`);
}

const metadataByTitle = commonsMetadata([...new Set(selections.map((record) => record.commonsTitle))]);
const rawByCity = new Map(scope.map((city) => [city.slug, []]));
const provenance = [];
const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "tehdejsi-city-images-"));
let totalBytes = 0;

try {
  for (const selection of selections) {
    const info = metadataByTitle.get(selection.commonsTitle);
    if (!info) throw new Error(`${selection.commonsTitle}: Commons API soubor nevrátilo.`);
    const source = checkedMetadata(selection, info);
    const commonRecord = {
      id: selection.id,
      city: selection.city,
      decade: selection.decade,
      yearApprox: selection.yearApprox,
      dateCertainty: selection.dateCertainty,
      alt: selection.alt,
      caption: selection.caption,
      licence: source.licence,
      licenceUrl: source.licenceUrl,
      attribution: source.attribution,
      sourceUrl: source.sourceUrl,
    };
    if (selection.excluded === true) {
      rawByCity.get(selection.city).push({
        ...commonRecord,
        excluded: true,
        exclusionReason: selection.exclusionReason,
      });
    } else {
      const derivative = await makeDerivative(selection, info, temporaryDirectory);
      totalBytes += derivative.bytes;
      const record = {
        ...commonRecord,
        file: derivative.file,
        width: derivative.width,
        height: derivative.height,
      };
      const validationErrors = validateCityImageRecord(record, {
        label: selection.id,
        fileSize: derivative.bytes,
      });
      if (validationErrors.length) throw new Error(validationErrors.join("\n"));
      rawByCity.get(selection.city).push(record);
    }
    provenance.push({
      key: selection.id,
      title: source.sourceTitle,
      publisher: source.publisher,
      url: source.sourceUrl,
      dateAccessed: selectionPayload.dateAccessed,
      licence: source.licence,
      attribution: source.attribution,
    });
    process.stdout.write(
      `  ${selection.excluded ? "×" : "✓"} ${selection.id} · ${source.licence}\n`,
    );
  }

  await Promise.all(
    scope.map(({ slug }) =>
      writeFile(resolve(DATA_DIR, `${slug}.json`), serialized(rawByCity.get(slug)), "utf8")),
  );
  await writeFile(
    PROVENANCE_FILE,
    serialized({
      dataset: "cityImages",
      source: "Wikimedia Commons API",
      dateAccessed: selectionPayload.dateAccessed,
      europeana: process.env.EUROPEANA_KEY
        ? "Klíč byl dostupný; toto kurátorované vydání však používá jen jednotlivě ověřené soubory Commons."
        : "EUROPEANA_KEY nebyl při tomto vydání dostupný.",
      records: provenance,
    }),
    "utf8",
  );
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

process.stdout.write(
  `\nMěstské snímky: ${selections.filter((record) => !record.excluded).length} veřejných derivátů, `
  + `${selections.filter((record) => record.excluded).length} vyřazených, `
  + `${totalBytes.toLocaleString("cs-CZ")} B.\n`,
);

// Build-time generator — Czech and Ukrainian film premieres from Wikidata.
// Run manually and commit the derived JSON; the shipped app never calls WDQS.
//
//   node scripts/gen-films.mjs
//
// Output:
//   src/data/filmPremieres/{cz,ua}.json
//   src/data/provenance/filmPremieres.json
//
// Queries are split by decade to stay below the WDQS timeout. Only structured
// CC0 fields are used: labels, premiere dates, genres, countries, studios and
// sitelink counts. No Wikipedia prose enters the dataset.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { recordKey } from "./relevance/record-key.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(ROOT, "src/data/filmPremieres");
const PROVENANCE_OUT = resolve(ROOT, "src/data/provenance/filmPremieres.json");
const START_YEAR = 1920;
const END_YEAR = new Date().getUTCFullYear();
const PER_YEAR = 8;
const MIN_SITELINKS = 3;
const SOURCE = {
  title: "Wikidata",
  publisher: "Wikidata",
  url: "https://www.wikidata.org/",
  licence: "CC0 1.0",
};
const ALLOWED_LICENCES = new Set(["CC0 1.0"]);
const CZECH_ORIGINS = new Set(["Q33946", "Q213"]);
const UKRAINIAN_ORIGIN = "Q212";
const USSR_ORIGIN = "Q15180";
const UKRAINIAN_STUDIOS = new Set([
  "Q577589", // Dovzhenko Film Studios
  "Q2628487", // Odesa Film Studio
  "Q16852254", // Kyivnaukfilm
  "Q4470719", // Ukrtelefilm
]);
const MOSFILM = "Q141336";
const USER_AGENT =
  "tehdejsi-svet-datagen/1.0 (https://github.com/lukaskourilcz/dontwannaknow)";
const requestedCountry = process.env.FILM_COUNTRY?.toLowerCase();
if (requestedCountry && !["cz", "ua"].includes(requestedCountry)) {
  throw new Error("FILM_COUNTRY musí být „cz“ nebo „ua“.");
}
const requestedYearFrom = process.env.FILM_YEAR_FROM
  ? Number(process.env.FILM_YEAR_FROM)
  : START_YEAR;
const requestedYearTo = process.env.FILM_YEAR_TO
  ? Number(process.env.FILM_YEAR_TO)
  : END_YEAR;
if (
  !Number.isInteger(requestedYearFrom)
  || !Number.isInteger(requestedYearTo)
  || requestedYearFrom < START_YEAR
  || requestedYearTo > END_YEAR
  || requestedYearFrom > requestedYearTo
) {
  throw new Error(`FILM_YEAR_FROM/TO musí ležet v rozsahu ${START_YEAR}–${END_YEAR}.`);
}

if (!ALLOWED_LICENCES.has(SOURCE.licence)) {
  throw new Error(`Licence ${SOURCE.licence} není povolená pro redistribuci.`);
}

const accessed = process.env.DATA_ACCESSED
  ?? new Date().toISOString().slice(0, 10);

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* deterministic one-off generator pause */ }
}

function sparql(query) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const body = execFileSync(
        "curl",
        [
          "-sS", "--http1.1", "--max-time", "90",
          "--retry", "2", "--retry-delay", "2",
          "-H", "Accept: application/sparql-results+json",
          "-H", `User-Agent: ${USER_AGENT}`,
          "-G", "--data-urlencode", `query=${query}`,
          "https://query.wikidata.org/sparql",
        ],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      );
      return JSON.parse(body);
    } catch {
      process.stdout.write(`    WDQS retry ${attempt}/4\n`);
      sleep(attempt * 2000);
    }
  }
  return null;
}

const entityId = (value) => String(value ?? "").split("/").pop();
const packedIds = (value) => String(value ?? "")
  .split("|")
  .map((part) => part.trim())
  .filter((part) => /^Q\d+$/.test(part))
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

function queryFor(country, yearFrom, yearTo) {
  const nextYear = yearTo + 1;
  const originGate = country === "cz"
    ? `?film wdt:P495 ?origin .
      VALUES ?origin { wd:Q33946 wd:Q213 }`
    : `{
        ?film wdt:P495 wd:${UKRAINIAN_ORIGIN} .
        BIND(wd:${UKRAINIAN_ORIGIN} AS ?origin)
      }
      UNION
      {
        ?film wdt:P495 wd:${USSR_ORIGIN} ;
              wdt:P272 ?allowedStudio .
        VALUES ?allowedStudio { ${[...UKRAINIAN_STUDIOS].map((id) => `wd:${id}`).join(" ")} }
        BIND(wd:${USSR_ORIGIN} AS ?origin)
      }`;
  return `SELECT
  ?film
  (SAMPLE(?cs) AS ?csTitle)
  (SAMPLE(?uk) AS ?ukTitle)
  (SAMPLE(?en) AS ?enTitle)
  (MIN(?date) AS ?firstDate)
  (MAX(?sl) AS ?sitelinks)
  (GROUP_CONCAT(DISTINCT REPLACE(STR(?origin), "http://www.wikidata.org/entity/", ""); separator="|") AS ?origins)
  (GROUP_CONCAT(DISTINCT REPLACE(STR(?genre), "http://www.wikidata.org/entity/", ""); separator="|") AS ?genres)
  (GROUP_CONCAT(DISTINCT REPLACE(STR(?studio), "http://www.wikidata.org/entity/", ""); separator="|") AS ?studios)
WHERE {
  ?film wdt:P31 wd:Q11424 ;
        wdt:P577 ?date ;
        wikibase:sitelinks ?sl .
  ${originGate}
  FILTER(
    ?date >= "${yearFrom}-01-01T00:00:00Z"^^xsd:dateTime &&
    ?date < "${nextYear}-01-01T00:00:00Z"^^xsd:dateTime
  )
  FILTER(?sl >= ${MIN_SITELINKS})
  OPTIONAL { ?film rdfs:label ?cs . FILTER(LANG(?cs) = "cs") }
  OPTIONAL { ?film rdfs:label ?uk . FILTER(LANG(?uk) = "uk") }
  OPTIONAL { ?film rdfs:label ?en . FILTER(LANG(?en) = "en") }
  OPTIONAL { ?film wdt:P136 ?genre . }
  OPTIONAL { ?film wdt:P272 ?studio . }
}
GROUP BY ?film
ORDER BY DESC(?sitelinks)
LIMIT 1000`;
}

function readOverrides(country) {
  const file = resolve(OUT_DIR, `overrides.${country}.json`);
  const rows = JSON.parse(readFileSync(file, "utf8"));
  return new Map(rows.map((row) => [row.wikidataId, row]));
}

function originAllowed(country, origins, studios) {
  if (country === "cz") {
    return origins.length > 0 && origins.every((id) => CZECH_ORIGINS.has(id));
  }
  return origins.includes(UKRAINIAN_ORIGIN)
    || (
      origins.includes(USSR_ORIGIN)
      && studios.some((id) => UKRAINIAN_STUDIOS.has(id))
    );
}

function buildRecord(country, binding, override) {
  const wikidataId = entityId(binding.film?.value);
  const originIds = packedIds(binding.origins?.value);
  const studioIds = packedIds(binding.studios?.value);
  const genreIds = packedIds(binding.genres?.value);
  const title = String(override?.title ?? binding.csTitle?.value ?? "").trim();
  const year = Number(String(binding.firstDate?.value ?? "").slice(0, 4));
  const sitelinks = Number(binding.sitelinks?.value);
  const fairyTale = genreIds.includes("Q1957385");
  if (!/^Q\d+$/.test(wikidataId) || !Number.isInteger(year) || !Number.isInteger(sitelinks)) return null;
  if (override?.excluded) return null;
  if (!originAllowed(country, originIds, studioIds)) {
    process.stdout.write(`  ! ${country.toUpperCase()} ${wikidataId}: origin gate\n`);
    return null;
  }
  if (country === "ua" && studioIds.includes(MOSFILM) && !originIds.includes(UKRAINIAN_ORIGIN)
    && !studioIds.some((id) => UKRAINIAN_STUDIOS.has(id))) {
    process.stdout.write(`  ! UA ${wikidataId}: generic Mosfilm title\n`);
    return null;
  }
  if (!title) {
    const fallback = binding.ukTitle?.value ?? binding.enTitle?.value ?? "bez názvu";
    process.stdout.write(`  ! ${country.toUpperCase()} ${wikidataId}: bez českého názvu (${fallback})\n`);
    return null;
  }
  const sentence = String(
    override?.sentence
      ?? `V roce ${year} ${fairyTale ? "přišla do kin filmová pohádka" : "přišel do kin film"} **${title}**.`,
  ).trim();
  const sensitivity = override?.sensitivity ?? "none";
  if (!["none", "mild", "difficult"].includes(sensitivity)) {
    throw new Error(`${wikidataId}: neplatná citlivost ${sensitivity}.`);
  }
  return {
    id: `${country}-${wikidataId.toLowerCase()}-${year}`,
    country,
    wikidataId,
    title,
    year,
    decadeStart: Math.floor(year / 10) * 10,
    originIds,
    studioIds,
    genreIds,
    fairyTale,
    sitelinks,
    sentence,
    sensitivity,
    shareSafe: sensitivity !== "difficult",
    licence: SOURCE.licence,
    curated: Boolean(override?.sentence),
  };
}

const allRecords = [];
for (const country of ["cz", "ua"]) {
  if (requestedCountry && country !== requestedCountry) {
    const existing = JSON.parse(readFileSync(resolve(OUT_DIR, `${country}.json`), "utf8"));
    allRecords.push(...existing);
    process.stdout.write(`  ${country.toUpperCase()}: ponecháno ${existing.length} existujících filmů\n`);
    continue;
  }
  const overrides = readOverrides(country);
  const byId = new Map();
  if (requestedYearFrom !== START_YEAR || requestedYearTo !== END_YEAR) {
    const existing = JSON.parse(readFileSync(resolve(OUT_DIR, `${country}.json`), "utf8"));
    for (const record of existing) {
      if (record.year < requestedYearFrom || record.year > requestedYearTo) {
        byId.set(record.wikidataId, record);
      }
    }
  }
  const querySpan = country === "ua" ? 5 : 10;
  for (let yearFrom = requestedYearFrom; yearFrom <= requestedYearTo; yearFrom += querySpan) {
    const yearTo = Math.min(yearFrom + querySpan - 1, requestedYearTo);
    const json = sparql(queryFor(country, yearFrom, yearTo));
    if (!json) {
      process.stdout.write(`  ${country.toUpperCase()} ${yearFrom}–${yearTo}: SKIPPED (WDQS selhal)\n`);
      sleep(1100);
      continue;
    }
    const rows = json?.results?.bindings ?? [];
    for (const binding of rows) {
      const id = entityId(binding.film?.value);
      const record = buildRecord(country, binding, overrides.get(id));
      if (!record) continue;
      const existing = byId.get(id);
      if (!existing || record.year < existing.year) byId.set(id, record);
    }
    process.stdout.write(`  ${country.toUpperCase()} ${yearFrom}–${yearTo}: ${rows.length} kandidátů\n`);
    sleep(1100);
  }

  const perYear = new Map();
  for (const record of byId.values()) {
    const list = perYear.get(record.year) ?? [];
    list.push(record);
    perYear.set(record.year, list);
  }
  const selected = [...perYear.entries()]
    .sort(([first], [second]) => first - second)
    .flatMap(([, records]) => records
      .sort((first, second) =>
        second.sitelinks - first.sitelinks
        || first.title.localeCompare(second.title, "cs")
        || first.wikidataId.localeCompare(second.wikidataId))
      .slice(0, PER_YEAR));

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUT_DIR, `${country}.json`),
    `${JSON.stringify(selected, null, 2)}\n`,
    "utf8",
  );
  allRecords.push(...selected);
  process.stdout.write(`  ${country.toUpperCase()}: zapsáno ${selected.length} filmů\n`);
}

const provenance = {
  dataset: "filmPremieres",
  records: allRecords
    .map((record) => ({
      key: recordKey("filmPremieres", record),
      title: `${SOURCE.title} — ${record.title}`,
      publisher: SOURCE.publisher,
      url: `https://www.wikidata.org/wiki/${record.wikidataId}`,
      accessed,
      licence: SOURCE.licence,
    }))
    .sort((first, second) => first.key.localeCompare(second.key, "cs")),
};
mkdirSync(dirname(PROVENANCE_OUT), { recursive: true });
writeFileSync(PROVENANCE_OUT, `${JSON.stringify(provenance, null, 2)}\n`, "utf8");
process.stdout.write(`Wrote ${allRecords.length} records and per-record provenance.\n`);

import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { recordKey } from "./relevance/record-key.mjs";
import { AXES, PASSES, PROMPT_VERSION } from "./relevance/prompts.mjs";

const root = new URL("../", import.meta.url);
const dataDirectory = new URL("../src/data/", import.meta.url);
const currentYear = new Date().getFullYear();
const errors = [];
const warnings = [];

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await jsonFiles(path));
    else if (extname(entry.name) === ".json") files.push(path);
  }
  return files;
}

function canonical(record) {
  if (record === null || typeof record !== "object") return JSON.stringify(record);
  if (Array.isArray(record)) return JSON.stringify(record.map(canonical));
  return JSON.stringify(
    Object.fromEntries(Object.keys(record).sort().map((key) => [key, record[key]])),
  );
}

const duplicateStopWords = new Set([
  "a", "i", "v", "ve", "z", "ze", "se", "na", "do", "od", "pro", "s", "u", "o", "k",
  "za", "po", "byl", "byla", "bylo", "byly", "je", "roku", "roce", "let", "letech", "jako",
  "který", "která", "které", "svůj", "své", "tento", "tato",
]);

function semanticTokens(text) {
  return new Set(
    String(text)
      .toLocaleLowerCase("cs")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 2 && !duplicateStopWords.has(token)),
  );
}

function semanticSimilarity(first, second) {
  const overlap = [...first].filter((token) => second.has(token)).length;
  return overlap / (first.size + second.size - overlap || 1);
}

function inspectYears(file, records) {
  if (!Array.isArray(records)) return;
  for (const [index, record] of records.entries()) {
    if (!record || typeof record !== "object") continue;
    for (const key of ["year", "decadeStart", "born", "died", "lastConfirmedYear", "declaredExtinctYear"]) {
      const value = record[key];
      if (value === undefined || value === null) continue;
      if (!Number.isFinite(value)) errors.push(`${file}[${index}].${key} není číslo.`);
      else if (value > currentYear + 2) warnings.push(`${file}[${index}].${key} míří do budoucnosti (${value}).`);
    }
  }
}

const files = await jsonFiles(dataDirectory.pathname);
for (const file of files) {
  const short = relative(root.pathname, file);
  let data;
  try {
    data = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    errors.push(`${short}: neplatný JSON (${error.message}).`);
    continue;
  }
  inspectYears(short, data);
  if (!Array.isArray(data)) continue;
  const seen = new Map();
  for (const [index, record] of data.entries()) {
    const key = canonical(record);
    if (seen.has(key)) warnings.push(`${short}: duplicitní záznamy ${seen.get(key)} a ${index}.`);
    else seen.set(key, index);
  }
}

const editorialRules = JSON.parse(
  await readFile(new URL("../src/data/editorialRules.json", import.meta.url), "utf8"),
);
const dataSources = JSON.parse(
  await readFile(new URL("../src/data/dataSources.json", import.meta.url), "utf8"),
);
const sourceManifest = new Map();
for (const [index, entry] of dataSources.entries()) {
  if (!entry.dataset || sourceManifest.has(entry.dataset)) {
    errors.push(`dataSources[${index}]: chybějící nebo duplicitní název datové sady.`);
  }
  if (!String(entry.source ?? "").trim()) errors.push(`dataSources[${index}]: chybí zdroj.`);
  if (!["verified", "review-needed"].includes(entry.confidence)) {
    errors.push(`dataSources[${index}]: neplatný stav ověření.`);
  }
  sourceManifest.set(entry.dataset, entry);
}

const editorDatasets = [
  "dataSources", "editorialRules", "events", "countryEvents", "history", "monthlyEvents",
  "cosmicEvents", "inventions", "notableDeaths", "famousBirths", "extinctions", "songs",
  "books", "paintings", "sculptures", "plays", "cityFacts", "sports", "countryDecades",
  "famousPeople", "media", "slang", "babyNames", "culture", "education", "writers",
];
for (const dataset of editorDatasets) {
  if (!sourceManifest.has(dataset)) errors.push(`dataSources: chybí záznam pro ${dataset}.`);
}
const publicDatasets = [
  "editorialRules", "events", "countryEvents", "inventions", "cityFacts", "countryDecades",
  "famousPeople", "leaders", "media", "writers", "worldBank", "wikidataPeople", "artByDecade",
  "cityCatalog", "cityCoords", "countries", "stats", "stars", "worldPaths",
  "weatherTemplates", "birthWeather",
];
for (const dataset of publicDatasets) {
  const source = sourceManifest.get(dataset);
  if (!source) errors.push(`dataSources: veřejné sadě ${dataset} chybí zdroj.`);
  else if (source.publicRuntime !== true) errors.push(`dataSources: ${dataset} není označena jako veřejná.`);
}
const ruleIds = new Set();
const allowedMetadata = {
  tone: new Set(["warm", "playful", "neutral", "serious"]),
  sensitivity: new Set(["none", "mild", "difficult"]),
  chapter: new Set(["birth", "early-childhood", "everyday-day", "teenage-years", "different-from-today", "changing-world", "generation-context", "life-numbers"]),
  geographicScope: new Set(["city", "modern-country", "historical-state", "wider-state", "global"]),
  sourceConfidence: new Set(["verified", "review-needed"]),
};
for (const [index, rule] of editorialRules.entries()) {
  if (!rule.id || ruleIds.has(rule.id)) errors.push(`editorialRules[${index}]: chybějící nebo duplicitní id.`);
  ruleIds.add(rule.id);
  try {
    new RegExp(rule.pattern, "i");
  } catch {
    errors.push(`editorialRules[${index}]: neplatný regulární výraz.`);
  }
  if (rule.sensitivity === "difficult" && rule.shareSafe !== false) {
    errors.push(`editorialRules[${index}]: složitý obsah nesmí být bezpečný pro sdílení.`);
  }
  for (const [key, allowed] of Object.entries(allowedMetadata)) {
    if (rule[key] !== undefined && !allowed.has(rule[key])) {
      errors.push(`editorialRules[${index}].${key}: nepovolená hodnota „${rule[key]}“.`);
    }
  }
  for (const key of ["shareSafe", "featured", "reviewRequired"]) {
    if (rule[key] !== undefined && typeof rule[key] !== "boolean") {
      errors.push(`editorialRules[${index}].${key}: očekávána logická hodnota.`);
    }
  }
}

const codeFiles = [
  "src/App.tsx",
  "src/copy.ts",
  "src/components/NewForm.tsx",
  "src/components/Results.tsx",
  "src/components/SharePanel.tsx",
  "src/lib/facts.ts",
  "src/lib/report.ts",
  "src/lib/shareImage.ts",
  "src/lib/lifeNumbers.ts",
  "index.html",
  "README.md",
  "DESIGN.md",
];
const staleBrand = /don['’]?t[ -]?wanna[ -]?know/i;
for (const file of codeFiles) {
  const text = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
  const publicCopy = text.replace(/`[^`]*`/g, "").replace(/\]\([^)]*\)/g, "]");
  if (staleBrand.test(publicCopy)) errors.push(`${file}: obsahuje starou veřejnou značku.`);
  if (/useLang|LangProvider/.test(text)) errors.push(`${file}: obsahuje odstraněnou jazykovou větev.`);
  if (file === "index.html" && /placeholder|replace public\/og-image/i.test(text)) {
    errors.push("index.html: metadata stále popisují hotovou OG kartu jako zástupný obrázek.");
  }
}

const supportedTexture = JSON.parse(
  await readFile(new URL("../src/data/countryDecades.json", import.meta.url), "utf8"),
).filter((record) => record.country === "CZ" || record.country === "UA");
const publicDirectory = new URL("../src/data/public/", import.meta.url);
const publicCities = JSON.parse(await readFile(new URL("cities.json", publicDirectory), "utf8"));
const publicCitySlugs = new Set(publicCities.map((city) => city.slug));
const publicCityCoords = JSON.parse(await readFile(new URL("cityCoords.json", publicDirectory), "utf8"));
for (const city of publicCities) {
  if (!['CZ', 'UA'].includes(city.country)) errors.push(`public/cities.json: nepodporovaná země ${city.country}.`);
}
for (const slug of Object.keys(publicCityCoords)) {
  if (!publicCitySlugs.has(slug)) errors.push(`public/cityCoords.json: neznámé město ${slug}.`);
}
for (const filename of [
  "countryDecades.cz.json", "countryDecades.ua.json",
  "countryEvents.cz.json", "countryEvents.ua.json",
  "famousPeople.cz.json", "famousPeople.ua.json",
  "leaders.cz.json", "leaders.ua.json",
  "wikidataPeople.cz.json", "wikidataPeople.ua.json",
]) {
  const records = JSON.parse(await readFile(new URL(filename, publicDirectory), "utf8"));
  const expected = filename.includes(".cz.") ? "CZ" : "UA";
  for (const record of records) {
    if (String(record.country).toUpperCase() !== expected) {
      errors.push(`public/${filename}: nepatřičná země ${record.country}.`);
    }
  }
}
{
  const cityFactFiles = await readdir(new URL("cityFacts/", publicDirectory));
  for (const filename of cityFactFiles) {
    const slug = filename.replace(/\.json$/, "");
    if (!publicCitySlugs.has(slug)) {
      errors.push(`public/cityFacts/${filename}: neznámé město ${slug}.`);
      continue;
    }
    const cityFacts = JSON.parse(await readFile(new URL(`cityFacts/${filename}`, publicDirectory), "utf8"));
    const byYear = new Map();
    for (const record of cityFacts) {
      if (record.city !== slug) errors.push(`public/cityFacts/${filename}: záznam cizího města ${record.city}.`);
      const group = byYear.get(record.year) ?? [];
      group.push(record);
      byYear.set(record.year, group);
    }
    for (const [year, records] of byYear) {
      for (let first = 0; first < records.length; first += 1) {
        for (let second = first + 1; second < records.length; second += 1) {
          const similarity = semanticSimilarity(
            semanticTokens(records[first].text),
            semanticTokens(records[second].text),
          );
          if (similarity >= 0.4) {
            errors.push(`public/cityFacts/${filename}: možné významové duplicity v roce ${year} (${similarity.toFixed(2)}).`);
          }
        }
      }
    }
  }
  const missingCityFiles = [...publicCitySlugs].filter((slug) => !cityFactFiles.includes(`${slug}.json`));
  for (const slug of missingCityFiles) warnings.push(`public/cityFacts: město ${slug} nemá žádná městská fakta.`);
}
for (const filename of ["worldBank.cz.json", "worldBank.ua.json"]) {
  const publicWorldBank = JSON.parse(await readFile(new URL(filename, publicDirectory), "utf8"));
  for (const country of Object.keys(publicWorldBank)) {
    if (!["CZE", "UKR", "WLD"].includes(country)) errors.push(`public/${filename}: nepodporovaná země ${country}.`);
  }
}
for (const filename of ["cities.ts", "cityCatalog.ts", "cityCoords.ts", "countryDecades.ts", "countryEvents.ts", "famousPeople.ts", "worldBank.ts", "wikidataPeople.ts"]) {
  const moduleText = await readFile(new URL(`../src/data/${filename}`, import.meta.url), "utf8");
  if (!moduleText.includes("./public/")) errors.push(`src/data/${filename}: veřejný modul nepoužívá zúženou datovou vrstvu.`);
}
const archivedTextureCount = JSON.parse(
  await readFile(new URL("../src/data/countryDecades.json", import.meta.url), "utf8"),
).filter((record) => record.country !== "CZ" && record.country !== "UA").length;
if (archivedTextureCount) {
  warnings.push(`${archivedTextureCount} záznamů nepodporovaných zemí zůstává zachováno jen jako archivní obsah.`);
}
const archivedHistory = JSON.parse(
  await readFile(new URL("../src/data/history.json", import.meta.url), "utf8"),
);
const factsModule = await readFile(new URL("../src/lib/facts.ts", import.meta.url), "utf8");
if (/data\/history/.test(factsModule)) {
  errors.push("src/lib/facts.ts: archivní history.json nesmí vstupovat do veřejného generátoru.");
}
warnings.push(`${archivedHistory.length} dlouhých historických rešerší čeká v archivu na jednotlivou redakční kontrolu.`);
// ── Skóre relevance a per-record provenience ────────────────────────────
// Neexistuje lidská revizní fronta: co agent zapíše, to se nasadí. Proto musí
// build spadnout na jakékoli malformované dávce — rozsahy, chybějící
// zdůvodnění, osiřelé klíče, neúplné pokrytí i podezřele „dramatická“ skóre.
const difficultPatterns = editorialRules
  .filter((rule) => rule.sensitivity === "difficult")
  .map((rule) => new RegExp(rule.pattern, "i"));
const relevanceAxes = Object.keys(AXES);
const relevanceDatasets = {
  cityFacts: (await readdir(new URL("cityFacts/", publicDirectory)).catch(() => []))
    .map((filename) => `cityFacts/${filename}`),
  countryEvents: ["countryEvents.cz.json", "countryEvents.ua.json"],
  countryDecades: ["countryDecades.cz.json", "countryDecades.ua.json"],
  famousPeople: ["famousPeople.cz.json", "famousPeople.ua.json"],
  leaders: ["leaders.cz.json", "leaders.ua.json"],
  inventions: ["inventions.json"],
  vitalsBackfill: ["vitals.cz.json", "vitals.ua.json"],
  pricesWages: ["pricesWages.cz.json", "pricesWages.ua.json"],
  weatherTemplates: ["weatherTemplates.json"],
};

// Každá veřejná sada s dobovým textem musí projít skórováním. Sady, které
// text nenesou, patří do výjimek — a to vědomě, s důvodem. Bez tohoto
// pravidla může nová sada nepozorovaně obejít relevanci (přesně tak se do
// zprávy dostaly řádky „ještě běžně nepoužívali: iPad“).
const scoringExempt = {
  "cities.json": "katalog měst, ne dobový záznam",
  "cityCoords.json": "souřadnice středů měst",
  "wikidataPeople.cz.json": "generováno z Wikidat, filtruje se seznamem oborů",
  "wikidataPeople.ua.json": "generováno z Wikidat, filtruje se seznamem oborů",
  "worldBank.cz.json": "číselné řady World Bank",
  "worldBank.ua.json": "číselné řady World Bank",
};
{
  const covered = new Set(Object.values(relevanceDatasets).flat());
  const entries = await readdir(publicDirectory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    const name = entry.name;
    if (covered.has(name) || scoringExempt[name]) continue;
    errors.push(
      `public/${name}: veřejná sada není ve skórování relevance ani ve výjimkách. `
      + `Zaregistrujte ji v relevanceDatasets (a v recordKey/gen-batches), nebo doplňte důvod do scoringExempt.`,
    );
  }
}

for (const [dataset, publicFiles] of Object.entries(relevanceDatasets)) {
  const sidecarUrl = new URL(`../src/data/relevance/${dataset}.json`, import.meta.url);
  const sidecarText = await readFile(sidecarUrl, "utf8").catch(() => null);
  const publicRecords = [];
  for (const filename of publicFiles) {
    const content = await readFile(new URL(`../src/data/public/${filename}`, import.meta.url), "utf8").catch(() => null);
    if (content) publicRecords.push(...JSON.parse(content));
  }
  if (!publicRecords.length && !sidecarText) continue;
  if (!sidecarText) {
    warnings.push(`relevance/${dataset}.json: skórování zatím chybí — záznamy se řadí neutrálně.`);
    continue;
  }
  let sidecar;
  try {
    sidecar = JSON.parse(sidecarText);
  } catch (error) {
    errors.push(`relevance/${dataset}.json: neplatný JSON (${error.message}).`);
    continue;
  }
  if (sidecar.promptVersion !== PROMPT_VERSION) {
    errors.push(`relevance/${dataset}.json: verze promptu „${sidecar.promptVersion}“ neodpovídá aktuální „${PROMPT_VERSION}“.`);
  }
  if (!String(sidecar.model ?? "").trim()) errors.push(`relevance/${dataset}.json: chybí model.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(sidecar.scoredAt ?? ""))) {
    errors.push(`relevance/${dataset}.json: chybí datum skórování (scoredAt).`);
  }
  const publicKeys = new Set(publicRecords.map((record) => recordKey(dataset, record)));
  const sidecarKeys = new Set();
  for (const [index, record] of (sidecar.records ?? []).entries()) {
    const label = `relevance/${dataset}.json[${index}]`;
    if (!record.key || sidecarKeys.has(record.key)) {
      errors.push(`${label}: chybějící nebo duplicitní klíč.`);
      continue;
    }
    sidecarKeys.add(record.key);
    if (!publicKeys.has(record.key)) {
      errors.push(`${label}: osiřelé skóre — klíč neodpovídá žádnému veřejnému záznamu (${record.key.slice(0, 60)}…).`);
      continue;
    }
    for (const axis of relevanceAxes) {
      const value = record.scores?.[axis];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        errors.push(`${label}: osa ${axis} má hodnotu ${value} mimo rozsah 0–5.`);
      }
    }
    for (const pass of Object.keys(PASSES)) {
      if (!String(record.rationales?.[pass] ?? "").trim()) {
        errors.push(`${label}: chybí zdůvodnění průchodu ${pass}.`);
      }
    }
    // „Zajímavé“ nesmí kolabovat do „dramatické“: záznam spadající do obtížné
    // citlivosti nesmí nést plošné maximum, které by ovládlo každé řazení.
    const values = relevanceAxes.map((axis) => record.scores?.[axis]).filter(Number.isInteger);
    const textPart = record.key.split("|").at(-1) ?? "";
    if (difficultPatterns.some((pattern) => pattern.test(textPart)) && values.length && values.every((value) => value === 5)) {
      errors.push(`${label}: obtížný záznam s plošným maximem — podezření na skórování dramatičnosti.`);
    }
  }
  for (const key of publicKeys) {
    if (!sidecarKeys.has(key)) errors.push(`relevance/${dataset}.json: chybí skóre pro veřejný záznam ${key.slice(0, 60)}….`);
  }

  // Kompaktní pole `rel` ve veřejných souborech musí odpovídat smlouvě.
  for (const filename of publicFiles) {
    const content = await readFile(new URL(`../src/data/public/${filename}`, import.meta.url), "utf8").catch(() => null);
    if (!content) continue;
    for (const [index, record] of JSON.parse(content).entries()) {
      if (record.rel !== undefined) {
        if (!Array.isArray(record.rel) || record.rel.length !== relevanceAxes.length ||
          record.rel.some((value) => !Number.isInteger(value) || value < 0 || value > 5)) {
          errors.push(`public/${filename}[${index}]: pole rel neodpovídá šestici celých čísel 0–5.`);
        }
      }
      if (record.src !== undefined && !String(record.src.t ?? "").trim()) {
        errors.push(`public/${filename}[${index}]: zdroj bez titulu.`);
      }
    }
  }

  // Per-record provenience: úplná citace, žádné osiřelé klíče.
  const provenanceText = await readFile(new URL(`../src/data/provenance/${dataset}.json`, import.meta.url), "utf8").catch(() => null);
  if (provenanceText) {
    let provenance;
    try {
      provenance = JSON.parse(provenanceText);
    } catch (error) {
      errors.push(`provenance/${dataset}.json: neplatný JSON (${error.message}).`);
      provenance = null;
    }
    const provenanceKeys = new Set();
    for (const [index, record] of (provenance?.records ?? []).entries()) {
      const label = `provenance/${dataset}.json[${index}]`;
      if (!record.key || provenanceKeys.has(record.key)) errors.push(`${label}: chybějící nebo duplicitní klíč.`);
      provenanceKeys.add(record.key);
      if (record.key && !publicKeys.has(record.key)) {
        errors.push(`${label}: osiřelá citace — klíč neodpovídá žádnému veřejnému záznamu.`);
      }
      for (const field of ["title", "publisher", "url", "accessed", "licence"]) {
        if (!String(record[field] ?? "").trim()) errors.push(`${label}: chybí pole ${field}.`);
      }
      if (record.accessed && !/^\d{4}-\d{2}-\d{2}$/.test(record.accessed)) {
        errors.push(`${label}: datum přístupu není ve tvaru RRRR-MM-DD.`);
      }
      if (record.url && !/^https?:\/\//.test(record.url)) {
        errors.push(`${label}: URL nezačíná http(s).`);
      }
    }
  }
}

// ── P3: meteorologická rekonstrukce narození ──────────────────────────
{
  const templates = JSON.parse(
    await readFile(new URL("../src/data/public/weatherTemplates.json", import.meta.url), "utf8"),
  );
  const expectedClasses = new Set([
    "frost-wave", "tropical", "snow", "rain", "ordinary",
    "cold-winter", "hot-summer", "seasonal",
  ]);
  for (const [index, template] of templates.entries()) {
    const label = `public/weatherTemplates.json[${index}]`;
    if (!template.id || !["day", "year"].includes(template.scope)) {
      errors.push(`${label}: chybí id nebo platný rozsah.`);
    }
    if (!expectedClasses.delete(template.class)) {
      errors.push(`${label}: neznámá nebo duplicitní třída „${template.class}“.`);
    }
    if (!/meteorologické rekonstrukce ERA5/i.test(template.template ?? "")) {
      errors.push(`${label}: věta neoznačuje meteorologickou rekonstrukci ERA5.`);
    }
    if (/naměřen|meteorologové naměřili/i.test(template.template ?? "")) {
      errors.push(`${label}: rekonstrukce se vydává za přímé měření.`);
    }
  }
  if (templates.length !== 8 || expectedClasses.size) {
    errors.push(`weatherTemplates: očekáváno osm tříd, chybí ${[...expectedClasses].join(", ") || "žádná"}.`);
  }
  const templateProvenance = JSON.parse(
    await readFile(new URL("../src/data/provenance/weatherTemplates.json", import.meta.url), "utf8"),
  );
  if ((templateProvenance.records ?? []).some((record) =>
    !/Open-Meteo.*Copernicus C3S ERA5/i.test(record.attribution ?? ""))) {
    errors.push("weatherTemplates: každý CC BY záznam musí nést atribuci Open-Meteo a Copernicus C3S ERA5.");
  }

  const weatherRoot = new URL("../public/data/weather/", import.meta.url);
  const manifest = JSON.parse(
    await readFile(new URL("manifest.json", weatherRoot), "utf8").catch(() => "{}"),
  );
  if (manifest.model !== "ERA5" || manifest.licence !== "CC BY 4.0") {
    errors.push("birthWeather: manifest musí uvádět ERA5 a CC BY 4.0.");
  }
  if (manifest.range?.[0] !== "1940-01-01") {
    errors.push("birthWeather: denní řada musí začínat 1. 1. 1940.");
  }
  if (manifest.scoring?.status !== "exempt" || !/měření modelu/i.test(manifest.scoring?.reason ?? "")) {
    errors.push("birthWeather: manifest musí výslovně zdůvodnit výjimku denních měření ze skórování.");
  }
  if (manifest.cities?.length !== publicCities.length) {
    errors.push(`birthWeather: manifest pokrývá ${manifest.cities?.length ?? 0} z ${publicCities.length} měst.`);
  }
  for (const city of publicCities) {
    const content = await readFile(new URL(`${city.slug}/summary.json`, weatherRoot), "utf8")
      .catch(() => null);
    if (!content) {
      errors.push(`birthWeather: chybí souhrn pro ${city.slug}.`);
      continue;
    }
    const summary = JSON.parse(content);
    if (
      summary.source !== "ERA5 via Open-Meteo" ||
      summary.licence !== "CC BY 4.0" ||
      summary.range?.[0] !== "1940-01-01"
    ) {
      errors.push(`birthWeather/${city.slug}: neplatný zdroj, licence nebo začátek řady.`);
    }
    if ((summary.years ?? []).some((record) => record.y < 1940)) {
      errors.push(`birthWeather/${city.slug}: obsahuje rok před 1940.`);
    }
    if ((summary.years ?? []).some((record) =>
      record.c !== true && (record.cp !== null || record.hp !== null))) {
      errors.push(`birthWeather/${city.slug}: neuzavřený rok nese percentilové tvrzení.`);
    }
  }
}

// ── P2: dobové ceny a mzdy ─────────────────────────────────────────────
{
  const pricesWages = [];
  for (const filename of ["pricesWages.cz.json", "pricesWages.ua.json"]) {
    const text = await readFile(new URL(`../src/data/public/${filename}`, import.meta.url), "utf8").catch(() => null);
    if (text) pricesWages.push(...JSON.parse(text));
  }
  for (const country of ["cz", "ua"]) {
    if (pricesWages.filter((record) => record.country === country).length > 200) {
      errors.push(`pricesWages: země ${country.toUpperCase()} překračuje limit 200 záznamů.`);
    }
  }
  for (const [index, record] of pricesWages.entries()) {
    const label = `public/pricesWages[${index}]`;
    if (!record.id || !["cz", "ua"].includes(record.country)) errors.push(`${label}: chybí id nebo podporovaná země.`);
    if (!["price", "wage", "ratio"].includes(record.kind)) errors.push(`${label}: neznámý druh „${record.kind}“.`);
    if (!Number.isInteger(record.yearFrom) || !Number.isInteger(record.yearTo) || record.yearFrom > record.yearTo) {
      errors.push(`${label}: neplatný rozsah roků.`);
    }
    if (!String(record.sentence ?? "").trim() || !record.values || typeof record.values !== "object") {
      errors.push(`${label}: chybí hotová věta nebo hodnoty.`);
    }
    if (
      record.country === "ua" &&
      ["price", "ratio"].includes(record.kind) &&
      ((record.yearFrom <= 1934 && record.yearTo >= 1932) || (record.yearFrom <= 1947 && record.yearTo >= 1946))
    ) {
      errors.push(`${label}: cenový údaj protíná ukrajinské hladomorové okno.`);
    }
    if (record.country === "cz" && record.yearFrom <= 1953 && record.yearTo >= 1953 && !/měnové reform/i.test(record.note ?? "")) {
      errors.push(`${label}: záznam u roku 1953 neuvádí kontext měnové reformy.`);
    }
  }
}

// ── P1: dlouhé řady životních podmínek ────────────────────────────────
{
  const allowedLicences = new Set(["CC BY 3.0 IGO", "CC BY 4.0"]);
  const allowedUpstreams = new Set(["UN WPP", "HMD", "Gapminder"]);
  const vitals = [];
  for (const filename of ["vitals.cz.json", "vitals.ua.json"]) {
    const content = await readFile(new URL(`../src/data/public/${filename}`, import.meta.url), "utf8").catch(() => null);
    if (content) vitals.push(...JSON.parse(content));
  }
  for (const [index, record] of vitals.entries()) {
    const label = `public/vitals[${index}]`;
    if (!["cz", "ua"].includes(record.country)) errors.push(`${label}: nepodporovaná země.`);
    if (!["lifeExpectancy", "childMortality"].includes(record.series)) {
      errors.push(`${label}: neznámá řada „${record.series}“.`);
    }
    if (!Number.isInteger(record.year) || record.year < 1920 || record.year >= 1960) {
      errors.push(`${label}: rok neleží v rozsahu backfillu 1920–1959.`);
    }
    if (record.country === "ua" && record.year < 1950) {
      errors.push(`${label}: ukrajinská řada nesmí obsahovat hodnotu před rokem 1950.`);
    }
    if (!Number.isFinite(record.value)) errors.push(`${label}: hodnota není číslo.`);
    if (!allowedUpstreams.has(record.upstream)) errors.push(`${label}: upstream není v allowlistu P1.`);
    if (!allowedLicences.has(record.licence)) errors.push(`${label}: licence není v allowlistu P1.`);
  }
}

// ── Lídři: úplnost profilů a datované, zdrojované vnímání ───────────────
{
  const leaders = [];
  for (const filename of ["leaders.cz.json", "leaders.ua.json"]) {
    const text = await readFile(new URL(`../src/data/public/${filename}`, import.meta.url), "utf8").catch(() => null);
    if (text) leaders.push(...JSON.parse(text));
  }
  const leaderIds = new Set();
  for (const [index, leader] of leaders.entries()) {
    const label = `public/leaders[${index}] (${leader.name ?? "?"})`;
    if (!leader.id || leaderIds.has(leader.id)) errors.push(`${label}: chybějící nebo duplicitní id.`);
    leaderIds.add(leader.id);
    if (leader.id && !leader.id.startsWith(`${String(leader.country).toLowerCase()}-`)) {
      errors.push(`${label}: id neodpovídá zemi.`);
    }
    for (const field of ["name", "office"]) {
      if (!String(leader[field] ?? "").trim()) errors.push(`${label}: chybí pole ${field}.`);
    }
    if (!Number.isFinite(leader.termStart)) errors.push(`${label}: chybí termStart.`);
    if (!["none", "mild", "difficult"].includes(leader.sensitivity)) {
      errors.push(`${label}: neplatná citlivost „${leader.sensitivity}“.`);
    }
    if (leader.shareSafe !== false) errors.push(`${label}: politický profil musí mít shareSafe: false.`);
    if (!Array.isArray(leader.sources) || !leader.sources.length) {
      errors.push(`${label}: chybí zdroje záznamu.`);
    }
    for (const source of leader.sources ?? []) {
      for (const field of ["title", "url", "accessed", "licence"]) {
        if (!String(source[field] ?? "").trim()) errors.push(`${label}: zdroj bez pole ${field}.`);
      }
    }
    if (!Array.isArray(leader.reception) || !leader.reception.length) {
      errors.push(`${label}: chybí doložené dobové vnímání.`);
    }
    for (const [noteIndex, note] of [...(leader.reception ?? []), ...(leader.reassessment ?? [])].entries()) {
      if (!String(note.period ?? "").trim()) errors.push(`${label}: vnímání [${noteIndex}] bez datace.`);
      if (!String(note.text ?? "").trim()) errors.push(`${label}: vnímání [${noteIndex}] bez textu.`);
      if (!String(note.source?.title ?? "").trim() || !/^https?:\/\//.test(String(note.source?.url ?? ""))) {
        errors.push(`${label}: vnímání [${noteIndex}] bez úplného zdroje.`);
      }
    }
  }
}

const overclaim = /všichni|každého teenagera|každé rodiny|nikdo neznal|nepochybně|určitě prožil/i;
for (const record of supportedTexture) {
  if (overclaim.test(record.text)) {
    warnings.push(`countryDecades ${record.country} ${record.decadeStart}: možná příliš absolutní formulace.`);
  }
}

const syntheticStyle = /ohromil svět|kultovní|superhvězd|nejvtipnější|obrovskou popularitu|mistrovské dílo|Sinatra Východu|Walt Disney Východu|skutečným bestsellerem|drtivým vítězstvím|hrdinského přivítání|odvážná operace|šťavnaté hlášky|rudá mašina|oslnily zahraniční|ambiciózní podívanou|podmanilo mladé publikum|poslušně potvrdily|nedošlého vůdce|ochromeném městě|líhní/i;
for (const filename of ["history.json", "countryEvents.json", "countryDecades.json", "media.json", "events.json", "famousPeople.json"]) {
  const records = JSON.parse(await readFile(new URL(`../src/data/${filename}`, import.meta.url), "utf8"));
  for (const [index, record] of records.entries()) {
    const country = String(record.country ?? "").toUpperCase();
    if (country && country !== "CZ" && country !== "UA") continue;
    const copy = [record.text, record.note].filter(Boolean).join(" ");
    if (syntheticStyle.test(copy)) {
      errors.push(`${filename}[${index}]: obsahuje nadsazenou nebo syntetickou redakční formulaci.`);
    }
  }
}

console.log(`Auditováno ${files.length} datových souborů a ${codeFiles.length} veřejných souborů.`);
for (const warning of warnings.slice(0, 50)) console.warn(`VAROVÁNÍ: ${warning}`);
if (warnings.length > 50) console.warn(`VAROVÁNÍ: dalších ${warnings.length - 50} položek skryto.`);
if (errors.length) {
  for (const error of errors) console.error(`CHYBA: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Redakční audit prošel (${warnings.length} varování, 0 chyb).`);
}

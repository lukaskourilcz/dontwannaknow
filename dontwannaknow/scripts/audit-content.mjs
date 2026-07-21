import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

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
  "famousPeople", "media", "writers", "worldBank", "wikidataPeople", "artByDecade",
  "cityCatalog", "cityCoords", "countries", "stats", "stars", "worldPaths",
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
for (const filename of ["countryDecades.json", "countryEvents.json", "famousPeople.json", "wikidataPeople.json"]) {
  const records = JSON.parse(await readFile(new URL(filename, publicDirectory), "utf8"));
  for (const record of records) {
    if (!["CZ", "UA"].includes(String(record.country).toUpperCase())) {
      errors.push(`public/${filename}: nepodporovaná země ${record.country}.`);
    }
  }
}
for (const country of ["cz", "ua"]) {
  const cityFacts = JSON.parse(await readFile(new URL(`cityFacts.${country}.json`, publicDirectory), "utf8"));
  const cityYearGroups = new Map();
  for (const record of cityFacts) {
    if (!publicCitySlugs.has(record.city)) errors.push(`public/cityFacts.${country}.json: neznámé město ${record.city}.`);
    const city = publicCities.find((candidate) => candidate.slug === record.city);
    if (city?.country.toLowerCase() !== country) errors.push(`public/cityFacts.${country}.json: město ${record.city} patří do jiné země.`);
    const groupKey = `${record.city}:${record.year}`;
    const group = cityYearGroups.get(groupKey) ?? [];
    group.push(record);
    cityYearGroups.set(groupKey, group);
  }
  for (const [groupKey, records] of cityYearGroups) {
    for (let first = 0; first < records.length; first += 1) {
      for (let second = first + 1; second < records.length; second += 1) {
        const similarity = semanticSimilarity(
          semanticTokens(records[first].text),
          semanticTokens(records[second].text),
        );
        if (similarity >= 0.4) {
          errors.push(`public/cityFacts.${country}.json: možné významové duplicity v ${groupKey} (${similarity.toFixed(2)}).`);
        }
      }
    }
  }
}
const publicWorldBank = JSON.parse(await readFile(new URL("worldBank.json", publicDirectory), "utf8"));
for (const country of Object.keys(publicWorldBank)) {
  if (!["CZE", "UKR", "WLD"].includes(country)) errors.push(`public/worldBank.json: nepodporovaná země ${country}.`);
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

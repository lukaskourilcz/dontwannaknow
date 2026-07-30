import { mkdir, readFile, writeFile } from "node:fs/promises";
import { AXES } from "./relevance/prompts.mjs";
import { recordKey } from "./relevance/record-key.mjs";

const data = new URL("../src/data/", import.meta.url);
const output = new URL("../src/data/public/", import.meta.url);
const supportedCountries = new Set(["CZ", "UA"]);

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, data), "utf8"));

const serialized = (value) => `${JSON.stringify(value, null, 2)}\n`;

// ── Sidecary: skóre relevance a per-record provenience ──────────────────
// Commitnuté sidecary (src/data/relevance/, src/data/provenance/) se do
// veřejných záznamů slévají kompaktně: `rel` je šestice 0–5 v pořadí os,
// `src` nese jen titul/vydavatele/URL. Zdůvodnění a verze promptu zůstávají
// build-side pro audit — čtenáři se neposílají.
const AXES_ORDER = Object.keys(AXES);

async function loadRelevance(dataset) {
  try {
    const sidecar = JSON.parse(await readFile(new URL(`relevance/${dataset}.json`, data), "utf8"));
    return new Map(sidecar.records.map((record) => [
      record.key,
      AXES_ORDER.map((axis) => record.scores[axis]),
    ]));
  } catch {
    return new Map();
  }
}

async function loadProvenance(dataset) {
  try {
    const sidecar = JSON.parse(await readFile(new URL(`provenance/${dataset}.json`, data), "utf8"));
    return new Map(sidecar.records.map((record) => [
      record.key,
      {
        t: record.title,
        ...(record.publisher ? { p: record.publisher } : {}),
        ...(record.url ? { u: record.url } : {}),
      },
    ]));
  } catch {
    return new Map();
  }
}

async function withExtras(records, dataset) {
  const relevance = await loadRelevance(dataset);
  const provenance = await loadProvenance(dataset);
  return records.map((record) => {
    const key = recordKey(dataset, record);
    const rel = relevance.get(key);
    const src = provenance.get(key);
    return { ...record, ...(rel ? { rel } : {}), ...(src ? { src } : {}) };
  });
}

function parseSupportedCities(source) {
  const cities = [];
  for (const match of source.matchAll(/\{\s*slug:\s*"([^"]+)"([^\n]+)\}/g)) {
    const row = match[0];
    const country = row.match(/country:\s*"([^"]+)"/)?.[1];
    const name = row.match(/name:\s*"([^"]+)"/)?.[1];
    if (!country || !name || !supportedCountries.has(country)) continue;
    const optional = (key) => row.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1];
    const aka = optional("aka");
    const region = optional("region");
    cities.push({
      slug: match[1],
      name,
      ...(aka ? { aka } : {}),
      country,
      ...(region ? { region } : {}),
    });
  }
  return cities;
}

function parseSupportedCityCoordinates(source, citySlugs) {
  const coordinates = {};
  for (const match of source.matchAll(/^\s*(?:"([^"]+)"|([a-z][\w-]*)):\s*\[(-?[\d.]+),\s*(-?[\d.]+)\]/gm)) {
    const slug = match[1] ?? match[2];
    if (citySlugs.has(slug)) coordinates[slug] = [Number(match[3]), Number(match[4])];
  }
  return coordinates;
}

const cityCatalogSource = await readFile(new URL("cityCatalogArchive.ts", data), "utf8");
const cities = parseSupportedCities(cityCatalogSource);
const citySlugs = new Set(cities.map((city) => city.slug));
const cityCountries = new Map(cities.map((city) => [city.slug, city.country]));
const cityCoordinateSource = await readFile(new URL("cityCoordsArchive.ts", data), "utf8");
const cityCoordinates = parseSupportedCityCoordinates(cityCoordinateSource, citySlugs);
const cityFacts = (await readJson("cityFacts.json")).filter((record) => citySlugs.has(record.city));
const bySupportedCountry = (records) =>
  records.filter((record) => supportedCountries.has(String(record.country).toUpperCase()));

const scoredCityFacts = await withExtras(cityFacts, "cityFacts");

// ── Dělení na běhové řezy ───────────────────────────────────────────────
// Zpráva načítá jen to, co potřebuje: městská fakta po městech, ostatní
// sady po zemích. První vykreslení tak neplatí za data druhé země.
const perCountry = (records, country) =>
  records.filter((record) => String(record.country).toUpperCase() === country);

const countryDecades = await withExtras(bySupportedCountry(await readJson("countryDecades.json")), "countryDecades");
const countryEvents = await withExtras(bySupportedCountry(await readJson("countryEvents.json")), "countryEvents");
const famousPeople = await withExtras(bySupportedCountry(await readJson("famousPeople.json")), "famousPeople");
const leaders = await withExtras(bySupportedCountry(await readJson("leaders.json")), "leaders");
const wikidataPeople = bySupportedCountry(await readJson("generated/wikidataPeople.json"));
const inventions = await withExtras(await readJson("inventions.json"), "inventions");
const worldBank = Object.fromEntries(
  Object.entries(await readJson("generated/worldBank.json"))
    .filter(([country]) => ["CZE", "UKR", "WLD"].includes(country)),
);

const generated = {
  "cities.json": cities,
  "cityCoords.json": cityCoordinates,
  ...Object.fromEntries([...citySlugs].sort().map((slug) => [
    `cityFacts/${slug}.json`,
    scoredCityFacts.filter((record) => record.city === slug),
  ])),
  "countryDecades.cz.json": perCountry(countryDecades, "CZ"),
  "countryDecades.ua.json": perCountry(countryDecades, "UA"),
  "countryEvents.cz.json": perCountry(countryEvents, "CZ"),
  "countryEvents.ua.json": perCountry(countryEvents, "UA"),
  "famousPeople.cz.json": perCountry(famousPeople, "CZ"),
  "famousPeople.ua.json": perCountry(famousPeople, "UA"),
  "inventions.json": inventions,
  "leaders.cz.json": perCountry(leaders, "CZ"),
  "leaders.ua.json": perCountry(leaders, "UA"),
  "wikidataPeople.cz.json": perCountry(wikidataPeople, "CZ"),
  "wikidataPeople.ua.json": perCountry(wikidataPeople, "UA"),
  "worldBank.cz.json": { CZE: worldBank.CZE, WLD: worldBank.WLD },
  "worldBank.ua.json": { UKR: worldBank.UKR, WLD: worldBank.WLD },
};

if (process.argv.includes("--check")) {
  const stale = [];
  for (const [filename, value] of Object.entries(generated)) {
    const current = await readFile(new URL(filename, output), "utf8").catch(() => "");
    if (current !== serialized(value)) stale.push(filename);
  }
  if (stale.length) throw new Error(`Veřejná data nejsou aktuální: ${stale.join(", ")}. Spusťte npm run data:public.`);
  console.log(`Veřejná datová vrstva je aktuální: ${cities.length} měst, pouze CZ/UA.`);
} else {
  await mkdir(output, { recursive: true });
  await mkdir(new URL("cityFacts/", output), { recursive: true });
  await Promise.all(
    Object.entries(generated).map(([filename, value]) =>
      writeFile(new URL(filename, output), serialized(value)),
    ),
  );
  console.log(`Veřejná datová vrstva připravena: ${cities.length} měst, pouze CZ/UA.`);
}

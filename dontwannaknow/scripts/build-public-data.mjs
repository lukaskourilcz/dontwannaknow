import { mkdir, readFile, writeFile } from "node:fs/promises";

const data = new URL("../src/data/", import.meta.url);
const output = new URL("../src/data/public/", import.meta.url);
const supportedCountries = new Set(["CZ", "UA"]);

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, data), "utf8"));

const serialized = (value) => `${JSON.stringify(value, null, 2)}\n`;

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

const generated = {
  "cities.json": cities,
  "cityCoords.json": cityCoordinates,
  "cityFacts.cz.json": cityFacts.filter((record) => cityCountries.get(record.city) === "CZ"),
  "cityFacts.ua.json": cityFacts.filter((record) => cityCountries.get(record.city) === "UA"),
  "countryDecades.json": bySupportedCountry(await readJson("countryDecades.json")),
  "countryEvents.json": bySupportedCountry(await readJson("countryEvents.json")),
  "famousPeople.json": bySupportedCountry(await readJson("famousPeople.json")),
  "wikidataPeople.json": bySupportedCountry(await readJson("generated/wikidataPeople.json")),
  "worldBank.json": Object.fromEntries(
    Object.entries(await readJson("generated/worldBank.json"))
      .filter(([country]) => ["CZE", "UKR", "WLD"].includes(country)),
  ),
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
  await Promise.all(
    Object.entries(generated).map(([filename, value]) =>
      writeFile(new URL(filename, output), serialized(value)),
    ),
  );
  console.log(`Veřejná datová vrstva připravena: ${cities.length} měst, pouze CZ/UA.`);
}

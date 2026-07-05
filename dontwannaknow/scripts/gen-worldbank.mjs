// Build-time generator — real per-country, per-year economic/demographic data
// from the World Bank Indicators API (free, no key). Run manually and commit
// the output; the shipped app never calls the network.
//
//   node scripts/gen-worldbank.mjs
//
// Output: src/data/generated/worldBank.json
//   { "<ISO3>": { "<year>": { pop, lifeExp, gdpPerCapita, birthRate,
//     deathRate, fertility, infantMortality } }, ... }
//
// Data begins ~1960 for most indicators; the app treats it as an optional
// enrichment and falls back to the curated approximations before then.
//
// HTTP goes through curl (HTTP/1.1) because the session's egress proxy stalls
// HTTP/2 and Node's fetch doesn't read the proxy reliably here.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/generated/worldBank.json");

// The aggregates the app cares about (matches its Country codes + world).
const COUNTRIES = ["CZE", "ESP", "USA", "UKR", "CAN", "MEX", "WLD"];
const INDICATORS = {
  pop: "SP.POP.TOTL", // total population
  lifeExp: "SP.DYN.LE00.IN", // life expectancy at birth, years
  gdpPerCapita: "NY.GDP.PCAP.CD", // GDP per capita, current US$
  birthRate: "SP.DYN.CBRT.IN", // crude birth rate, per 1,000 people
  deathRate: "SP.DYN.CDRT.IN", // crude death rate, per 1,000 people
  fertility: "SP.DYN.TFRT.IN", // total fertility, children per woman
  infantMortality: "SP.DYN.IMRT.IN", // infant deaths per 1,000 live births
};
const FROM = 1960;
const TO = 2023;

function curlJson(url) {
  const body = execFileSync(
    "curl",
    ["-s", "--http1.1", "--max-time", "25", "--retry", "2", "--retry-delay", "2", url],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  return JSON.parse(body);
}

function fetchIndicator(iso3, indicator) {
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?date=${FROM}:${TO}&format=json&per_page=500`;
  const out = {};
  try {
    const json = curlJson(url);
    const rows = Array.isArray(json) ? json[1] : null;
    if (Array.isArray(rows)) {
      for (const r of rows) {
        if (r && r.value != null) out[r.date] = r.value;
      }
    }
  } catch {
    process.stdout.write(`  ! ${iso3} ${indicator} failed, skipping\n`);
  }
  return out;
}

const round = (n) => Math.round(n);
const round1 = (n) => Math.round(n * 10) / 10;

const result = {};
for (const iso3 of COUNTRIES) {
  const byYear = {};
  for (const [key, indicator] of Object.entries(INDICATORS)) {
    const series = fetchIndicator(iso3, indicator);
    for (const [year, value] of Object.entries(series)) {
      (byYear[year] ??= {});
      if (key === "pop" || key === "gdpPerCapita") byYear[year][key] = round(value);
      else byYear[year][key] = round1(value);
    }
    process.stdout.write(`  ${iso3} ${indicator}: ${Object.keys(series).length} years\n`);
  }
  // Keep years sorted ascending for a clean, stable diff.
  result[iso3] = Object.fromEntries(
    Object.keys(byYear)
      .sort((a, b) => Number(a) - Number(b))
      .map((y) => [y, byYear[y]]),
  );
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n", "utf8");
process.stdout.write(`\nWrote ${OUT}\n`);

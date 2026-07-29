// Vygeneruje dávky záznamů pro build-time skórování relevance.
//
// Čte veřejné datové sady (src/data/public/) a rozdělí je do dávek pro tři
// nezávislé skórovací průchody (viz prompts.mjs). Výstup je pracovní adresář
// s dávkami + index.json; výsledky slévá merge-results.mjs do
// src/data/relevance/. Skript je součást repozitáře, aby byl každý běh
// skórování reprodukovatelný a diffovatelný.
//
// Použití: node scripts/relevance/gen-batches.mjs --out <dir> [--only-missing]
// --only-missing vynechá záznamy, které už mají v sidecarech úplné skóre —
// pro delta-skórování nově doplněných dat.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { AXES, PASSES, PROMPT_VERSION } from "./prompts.mjs";
import { recordKey } from "./record-key.mjs";

const outFlag = process.argv.indexOf("--out");
if (outFlag === -1 || !process.argv[outFlag + 1]) {
  console.error("Chybí --out <adresář>.");
  process.exit(1);
}
const outDir = process.argv[outFlag + 1];
const onlyMissing = process.argv.includes("--only-missing");

const publicDir = new URL("../../src/data/public/", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, publicDir), "utf8"));

async function loadRecords() {
  const { readdir } = await import("node:fs/promises");
  const cities = JSON.parse(await readFile(new URL("cities.json", publicDir), "utf8"));
  const countryBySlug = new Map(cities.map((city) => [city.slug, city.country]));
  const cityFactFiles = await readdir(new URL("cityFacts/", publicDir)).catch(() => []);
  const allCityFacts = [];
  for (const file of cityFactFiles) {
    allCityFacts.push(...await readJson(`cityFacts/${file}`));
  }
  const cityCz = allCityFacts.filter((record) => countryBySlug.get(record.city) === "CZ");
  const cityUa = allCityFacts.filter((record) => countryBySlug.get(record.city) === "UA");
  const events = [...await readJson("countryEvents.cz.json"), ...await readJson("countryEvents.ua.json")];
  const decades = [...await readJson("countryDecades.cz.json"), ...await readJson("countryDecades.ua.json")];
  const famous = [...await readJson("famousPeople.cz.json"), ...await readJson("famousPeople.ua.json")];
  const leaders = [...await readJson("leaders.cz.json").catch(() => []), ...await readJson("leaders.ua.json").catch(() => [])];

  const records = [];
  for (const [country, list] of [["CZ", cityCz], ["UA", cityUa]]) {
    for (const r of list) {
      records.push({
        dataset: "cityFacts", key: recordKey("cityFacts", r),
        country, city: r.city, year: r.year, text: r.text,
      });
    }
  }
  for (const r of events) {
    records.push({
      dataset: "countryEvents", key: recordKey("countryEvents", r),
      country: r.country, year: r.year, text: r.text,
    });
  }
  for (const r of decades) {
    records.push({
      dataset: "countryDecades", key: recordKey("countryDecades", r),
      country: r.country, decadeStart: r.decadeStart, bucket: r.bucket, text: r.text,
    });
  }
  for (const r of famous) {
    records.push({
      dataset: "famousPeople", key: recordKey("famousPeople", r),
      country: r.country, decadeStart: r.decadeStart, name: r.name,
      text: `${r.name} — ${r.role}${r.note ? `: ${r.note}` : ""}`,
    });
  }
  for (const r of leaders) {
    records.push({
      dataset: "leaders", key: recordKey("leaders", r),
      country: r.country, year: r.termStart, name: r.name,
      text: `${r.name} — ${r.office}${r.summary ? `: ${r.summary}` : ""}`,
    });
  }
  return records;
}

const BATCH_SIZES = { A: 50, B: 60, C: 100 };

let records = await loadRecords();
if (onlyMissing) {
  const scored = new Set();
  for (const dataset of ["cityFacts", "countryEvents", "countryDecades", "famousPeople", "leaders"]) {
    const sidecar = await readFile(new URL(`../../src/data/relevance/${dataset}.json`, import.meta.url), "utf8")
      .then(JSON.parse)
      .catch(() => null);
    for (const record of sidecar?.records ?? []) {
      if (Object.keys(AXES).every((axis) => Number.isInteger(record.scores?.[axis]))) {
        scored.add(`${dataset}:${record.key}`);
      }
    }
  }
  records = records.filter((record) => !scored.has(`${record.dataset}:${record.key}`));
}
await mkdir(outDir, { recursive: true });
const index = { promptVersion: PROMPT_VERSION, total: records.length, batches: [] };

for (const pass of Object.keys(PASSES)) {
  const size = BATCH_SIZES[pass];
  for (let start = 0; start < records.length; start += size) {
    const slice = records.slice(start, start + size).map((record, i) => ({ id: `r${i}`, ...record }));
    const name = `pass${pass}-${String(index.batches.filter((b) => b.pass === pass).length).padStart(3, "0")}.json`;
    await writeFile(
      `${outDir}/${name}`,
      JSON.stringify({ pass, promptVersion: PROMPT_VERSION, records: slice }, null, 1),
    );
    index.batches.push({ file: name, pass, count: slice.length });
  }
}

await writeFile(`${outDir}/index.json`, JSON.stringify(index, null, 2));
console.log(`Dávky připraveny: ${records.length} záznamů, ${index.batches.length} dávek → ${outDir}`);

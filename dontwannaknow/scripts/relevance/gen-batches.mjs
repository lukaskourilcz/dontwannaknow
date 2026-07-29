// Vygeneruje dávky záznamů pro build-time skórování relevance.
//
// Čte veřejné datové sady (src/data/public/) a rozdělí je do dávek pro tři
// nezávislé skórovací průchody (viz prompts.mjs). Výstup je pracovní adresář
// s dávkami + index.json; výsledky slévá merge-results.mjs do
// src/data/relevance/. Skript je součást repozitáře, aby byl každý běh
// skórování reprodukovatelný a diffovatelný.
//
// Použití: node scripts/relevance/gen-batches.mjs --out <dir>

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { PASSES, PROMPT_VERSION } from "./prompts.mjs";
import { recordKey } from "./record-key.mjs";

const outFlag = process.argv.indexOf("--out");
if (outFlag === -1 || !process.argv[outFlag + 1]) {
  console.error("Chybí --out <adresář>.");
  process.exit(1);
}
const outDir = process.argv[outFlag + 1];

const publicDir = new URL("../../src/data/public/", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, publicDir), "utf8"));

async function loadRecords() {
  const cityCz = await readJson("cityFacts.cz.json");
  const cityUa = await readJson("cityFacts.ua.json");
  const events = await readJson("countryEvents.json");
  const decades = await readJson("countryDecades.json");
  const famous = await readJson("famousPeople.json");
  const leaders = await readJson("leaders.json").catch(() => []);

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

const records = await loadRecords();
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

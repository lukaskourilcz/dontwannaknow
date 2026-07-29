// Sleje výsledky skórovacích průchodů do commitovaných sidecarů
// src/data/relevance/<dataset>.json a tvrdě validuje pokrytí i rozsahy.
// Selže (exit 1), pokud jakémukoli záznamu chybí průchod, skóre je mimo
// rozsah 0–5, chybí zdůvodnění nebo výsledek odkazuje na neznámý záznam.
//
// Použití: node scripts/relevance/merge-results.mjs --batches <dir> --results <dir> [--scored-at YYYY-MM-DD]

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { AXES, PASSES, PROMPT_VERSION } from "./prompts.mjs";

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}
const batchesDir = arg("--batches");
const resultsDir = arg("--results");
const scoredAt = arg("--scored-at") ?? new Date().toISOString().slice(0, 10);
if (!batchesDir || !resultsDir) {
  console.error("Použití: merge-results.mjs --batches <dir> --results <dir>");
  process.exit(1);
}

const errors = [];
const index = JSON.parse(await readFile(`${batchesDir}/index.json`, "utf8"));

// key → { dataset, scores: {axis: n}, rationales: {pass: text}, passes: Set }
const merged = new Map();
const axisByShort = new Map(Object.entries(AXES).map(([name, spec]) => [spec.short, name]));

for (const batch of index.batches) {
  const batchRecords = JSON.parse(await readFile(`${batchesDir}/${batch.file}`, "utf8")).records;
  const byId = new Map(batchRecords.map((r) => [r.id, r]));
  let result;
  try {
    result = JSON.parse(await readFile(`${resultsDir}/${batch.file}`, "utf8"));
  } catch {
    errors.push(`${batch.file}: chybí nebo je nečitelný výsledek.`);
    continue;
  }
  const expectedAxes = PASSES[batch.pass].axes.map((a) => AXES[a].short);
  const seen = new Set();
  for (const row of result.scores ?? []) {
    const record = byId.get(row.id) ?? batchRecords.find((r) => r.key === row.key);
    if (!record) {
      errors.push(`${batch.file}: výsledek pro neznámý záznam ${row.id ?? row.key}.`);
      continue;
    }
    if (seen.has(record.key)) continue;
    seen.add(record.key);
    const entry = merged.get(record.key) ?? {
      dataset: record.dataset, scores: {}, rationales: {}, passes: new Set(),
    };
    for (const short of expectedAxes) {
      const value = row[short];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        errors.push(`${batch.file} ${record.key.slice(0, 60)}: ${short}=${value} mimo rozsah 0–5.`);
        continue;
      }
      entry.scores[axisByShort.get(short)] = value;
    }
    if (!String(row.rationale ?? "").trim()) {
      errors.push(`${batch.file} ${record.key.slice(0, 60)}: chybí zdůvodnění.`);
    } else {
      entry.rationales[batch.pass] = String(row.rationale).trim();
    }
    entry.passes.add(batch.pass);
    merged.set(record.key, entry);
  }
  for (const record of batchRecords) {
    if (!seen.has(record.key)) errors.push(`${batch.file}: záznam ${record.id} (${record.key.slice(0, 60)}…) bez skóre.`);
  }
}

const allAxes = Object.keys(AXES);
const byDataset = new Map();
for (const [key, entry] of merged) {
  const missingAxes = allAxes.filter((axis) => entry.scores[axis] === undefined);
  if (missingAxes.length) {
    errors.push(`${key.slice(0, 60)}: chybí osy ${missingAxes.join(", ")}.`);
    continue;
  }
  const list = byDataset.get(entry.dataset) ?? [];
  list.push({ key, scores: entry.scores, rationales: entry.rationales });
  byDataset.set(entry.dataset, list);
}

if (errors.length) {
  for (const error of errors.slice(0, 40)) console.error(`CHYBA: ${error}`);
  if (errors.length > 40) console.error(`…a dalších ${errors.length - 40} chyb.`);
  console.error(`Sloučení selhalo: ${errors.length} problémů.`);
  process.exit(1);
}

const outDir = new URL("../../src/data/relevance/", import.meta.url);
await mkdir(outDir, { recursive: true });
for (const [dataset, list] of byDataset) {
  list.sort((a, b) => (a.key < b.key ? -1 : 1));
  await writeFile(
    new URL(`${dataset}.json`, outDir),
    `${JSON.stringify({
      promptVersion: PROMPT_VERSION,
      model: "claude-fable-5",
      scoredAt,
      passes: Object.fromEntries(Object.entries(PASSES).map(([id, pass]) => [id, pass.axes])),
      records: list,
    }, null, 1)}\n`,
  );
  console.log(`src/data/relevance/${dataset}.json: ${list.length} záznamů.`);
}
console.log(`Sloučeno ${merged.size} záznamů bez chyb.`);

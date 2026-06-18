// Merge the research-agent batches from scripts/.gen into the real datasets.
// Validates schema, normalises, and de-duplicates against existing entries and
// across batches. Existing entries are always kept; only new, valid, non-dup
// records are appended. Run from the project root: `node scripts/merge-knowledge.mjs`.

import fs from "node:fs";
import path from "node:path";

const DATA = "src/data";
const GEN = "scripts/.gen";

const HISTORY_CATS = new Set([
  "Politics", "Upheaval", "Culture", "Sport", "Science & tech", "People", "Everyday life",
]);

// Diacritics-insensitive, whitespace/punctuation-normalised key for dedup.
const norm = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();

function loadBatches(prefixes) {
  if (!fs.existsSync(GEN)) return [];
  const files = fs.readdirSync(GEN)
    .filter((f) => f.endsWith(".json") && prefixes.some((p) => f.startsWith(p)))
    .sort();
  let all = [];
  for (const f of files) {
    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(path.join(GEN, f), "utf8"));
    } catch (e) {
      console.log(`  ! skip ${f} (invalid JSON: ${e.message})`);
      continue;
    }
    if (!Array.isArray(arr)) {
      console.log(`  ! skip ${f} (not an array)`);
      continue;
    }
    console.log(`  + ${f}: ${arr.length}`);
    all = all.concat(arr);
  }
  return all;
}

function merge({ file, prefixes, countries, validate, build }) {
  const target = `${DATA}/${file}`;
  const existing = JSON.parse(fs.readFileSync(target, "utf8"));
  const seen = new Set(existing.map((r) => `${r.country}|${norm(r.text)}`));
  const out = existing.slice();
  const before = {};
  for (const r of existing) before[r.country] = (before[r.country] || 0) + 1;

  console.log(`\n${file} — batches:`);
  const gen = loadBatches(prefixes);

  let added = 0, dropInvalid = 0, dropDup = 0;
  for (const r of gen) {
    if (!validate(r)) { dropInvalid++; continue; }
    const text = r.text.trim();
    const key = `${r.country}|${norm(text)}`;
    if (seen.has(key)) { dropDup++; continue; }
    seen.add(key);
    out.push(build(r, text));
    added++;
  }

  fs.writeFileSync(target, JSON.stringify(out, null, 2) + "\n");

  const after = {};
  for (const r of out) after[r.country] = (after[r.country] || 0) + 1;
  const pick = (o) => Object.fromEntries(countries.map((c) => [c, o[c] || 0]));
  console.log(`${file}: +${added} added, ${dropDup} dup, ${dropInvalid} invalid`);
  console.log(`  before:`, pick(before), `→ after:`, pick(after));
}

merge({
  file: "history.json",
  prefixes: ["cz-history", "ua-history"],
  countries: ["cz", "ua"],
  validate: (r) =>
    r && (r.country === "cz" || r.country === "ua") &&
    Number.isInteger(r.year) && r.year >= 1900 && r.year <= 2027 &&
    HISTORY_CATS.has(r.category) &&
    typeof r.text === "string" && r.text.trim().length >= 8,
  build: (r, text) => ({ country: r.country, year: r.year, category: r.category, text }),
});

merge({
  file: "countryEvents.json",
  prefixes: ["cz-events", "ua-events"],
  countries: ["CZ", "UA"],
  validate: (r) =>
    r && (r.country === "CZ" || r.country === "UA") &&
    Number.isInteger(r.year) && r.year >= 1900 && r.year <= 2027 &&
    typeof r.text === "string" && r.text.trim().length >= 5,
  build: (r, text) => ({ country: r.country, year: r.year, text }),
});

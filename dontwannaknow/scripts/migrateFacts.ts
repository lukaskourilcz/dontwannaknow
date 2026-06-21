// One-shot migration: move the inline-`.ts` fact datasets to flat JSON (one
// fact per row, so the /dev editor can edit/delete individual facts) and turn
// each `.ts` into a thin wrapper that reassembles the shape the app consumes.
//
// Run: npx esbuild scripts/migrateFacts.ts --bundle --platform=node \
//        --format=esm --outfile=/tmp/migrateFacts.mjs && node /tmp/migrateFacts.mjs
//
// Safe to run once: it asserts every bucketed dataset round-trips exactly
// before writing anything, then rewrites the `.ts` files in place.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { COUNTRY_DECADES } from "../src/data/countryDecades";
import { FAMOUS_PEOPLE } from "../src/data/famousPeople";
import { COUNTRY_MEDIA } from "../src/data/media";
import { SLANG } from "../src/data/slang";
import { BABY_NAMES } from "../src/data/babyNames";
import { CULTURE } from "../src/data/culture";
import { EDUCATION } from "../src/data/education";
import { WRITERS } from "../src/data/writers";
import {
  COUNTRY_DECADE_BUCKETS,
  CULTURE_LIST_FIELDS,
  regroupCountryDecades,
  regroupFamousPeople,
  regroupMedia,
  regroupSlang,
  regroupBabyNames,
  regroupCulture,
  type CountryDecadeRow,
  type FamousPersonRow,
  type MediaRow,
  type SlangRow,
  type BabyNamesRow,
  type CultureRow,
} from "../src/data/_grouped";

// Resolved against the working dir (run this from the project root).
const DATA = resolve(process.cwd(), "src/data");

// ── Flatten (inverse of the regroup helpers) ────────────────────────────
function flattenCountryDecades(): CountryDecadeRow[] {
  const out: CountryDecadeRow[] = [];
  for (const d of COUNTRY_DECADES) {
    for (const bucket of COUNTRY_DECADE_BUCKETS) {
      for (const text of d[bucket]) out.push({ country: d.country, decadeStart: d.decadeStart, bucket, text });
    }
  }
  return out;
}

function flattenFamousPeople(): FamousPersonRow[] {
  const out: FamousPersonRow[] = [];
  for (const d of FAMOUS_PEOPLE) {
    for (const p of d.people) {
      const row: FamousPersonRow = { country: d.country, decadeStart: d.decadeStart, name: p.name, role: p.role };
      if (p.note != null && p.note !== "") row.note = p.note;
      out.push(row);
    }
  }
  return out;
}

function flattenMedia(): MediaRow[] {
  const out: MediaRow[] = [];
  for (const d of COUNTRY_MEDIA) {
    for (const text of d.read) out.push({ country: d.country, decadeStart: d.decadeStart, kind: "read", text });
    for (const text of d.watch) out.push({ country: d.country, decadeStart: d.decadeStart, kind: "watch", text });
  }
  return out;
}

function flattenSlang(): SlangRow[] {
  const out: SlangRow[] = [];
  for (const d of SLANG) {
    for (const e of d.expressions) out.push({ decadeStart: d.decadeStart, phrase: e.phrase, meaning: e.meaning });
  }
  return out;
}

function flattenBabyNames(): BabyNamesRow[] {
  const out: BabyNamesRow[] = [];
  for (const d of BABY_NAMES) {
    for (const name of d.boys) out.push({ country: d.country, decadeStart: d.decadeStart, sex: "boys", name });
    for (const name of d.girls) out.push({ country: d.country, decadeStart: d.decadeStart, sex: "girls", name });
  }
  return out;
}

function flattenCulture(): CultureRow[] {
  const out: CultureRow[] = [];
  for (const d of CULTURE) {
    for (const field of CULTURE_LIST_FIELDS) {
      for (const text of d[field]) out.push({ decadeStart: d.decadeStart, field, text });
    }
    out.push({ decadeStart: d.decadeStart, field: "fashion", text: d.fashion });
    out.push({ decadeStart: d.decadeStart, field: "whatTeensDid", text: d.whatTeensDid });
  }
  return out;
}

// ── Round-trip safety (order-insensitive on object keys) ─────────────────
function stable(v: unknown): string {
  return JSON.stringify(v, (_k, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const o = val as Record<string, unknown>;
      return Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
    }
    return val;
  });
}
function assertRoundtrip(name: string, original: unknown, rebuilt: unknown): void {
  if (stable(original) !== stable(rebuilt)) {
    throw new Error(`Round-trip mismatch for ${name} — refusing to write.`);
  }
}

function writeJson(key: string, data: unknown): void {
  writeFileSync(resolve(DATA, `${key}.json`), JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── Rewrite a `.ts` data file into a JSON-backed wrapper ─────────────────
function rewriteWrapper(key: string, constName: string, imports: string, replacement: string): void {
  const file = resolve(DATA, `${key}.ts`);
  const text = readFileSync(file, "utf8");
  const idxConst = text.indexOf(`export const ${constName}`);
  const idxOpen = text.indexOf("= [", idxConst);
  const idxClose = text.indexOf("\n];", idxOpen);
  if (idxConst < 0 || idxOpen < 0 || idxClose < 0) {
    throw new Error(`Could not locate the data literal in ${key}.ts (already migrated?)`);
  }
  const before = text.slice(0, idxOpen); // up to, not including, "= ["
  const after = text.slice(idxClose + 3); // after "\n];"
  writeFileSync(file, `${imports}\n\n${before}= ${replacement};${after}`, "utf8");
}

// ── Run ──────────────────────────────────────────────────────────────────
const cd = flattenCountryDecades();
const fp = flattenFamousPeople();
const md = flattenMedia();
const sl = flattenSlang();
const bn = flattenBabyNames();
const cu = flattenCulture();

assertRoundtrip("countryDecades", COUNTRY_DECADES, regroupCountryDecades(cd));
assertRoundtrip("famousPeople", FAMOUS_PEOPLE, regroupFamousPeople(fp));
assertRoundtrip("media", COUNTRY_MEDIA, regroupMedia(md));
assertRoundtrip("slang", SLANG, regroupSlang(sl));
assertRoundtrip("babyNames", BABY_NAMES, regroupBabyNames(bn));
assertRoundtrip("culture", CULTURE, regroupCulture(cu));
console.log("All bucketed datasets round-trip exactly ✓");

writeJson("countryDecades", cd);
writeJson("famousPeople", fp);
writeJson("media", md);
writeJson("slang", sl);
writeJson("babyNames", bn);
writeJson("culture", cu);
writeJson("education", EDUCATION);
writeJson("writers", WRITERS);

rewriteWrapper(
  "countryDecades", "COUNTRY_DECADES",
  `import countryDecadesJson from "./countryDecades.json";\nimport { regroupCountryDecades } from "./_grouped";`,
  `regroupCountryDecades(countryDecadesJson) as unknown as CountryDecade[]`,
);
rewriteWrapper(
  "famousPeople", "FAMOUS_PEOPLE",
  `import famousPeopleJson from "./famousPeople.json";\nimport { regroupFamousPeople } from "./_grouped";`,
  `regroupFamousPeople(famousPeopleJson) as unknown as FamousByDecade[]`,
);
rewriteWrapper(
  "media", "COUNTRY_MEDIA",
  `import mediaJson from "./media.json";\nimport { regroupMedia } from "./_grouped";`,
  `regroupMedia(mediaJson) as unknown as CountryMedia[]`,
);
rewriteWrapper(
  "slang", "SLANG",
  `import slangJson from "./slang.json";\nimport { regroupSlang } from "./_grouped";`,
  `regroupSlang(slangJson) as unknown as DecadeSlang[]`,
);
rewriteWrapper(
  "babyNames", "BABY_NAMES",
  `import babyNamesJson from "./babyNames.json";\nimport { regroupBabyNames } from "./_grouped";`,
  `regroupBabyNames(babyNamesJson) as unknown as BabyNames[]`,
);
rewriteWrapper(
  "culture", "CULTURE",
  `import cultureJson from "./culture.json";\nimport { regroupCulture } from "./_grouped";`,
  `regroupCulture(cultureJson) as unknown as CultureSnapshot[]`,
);
rewriteWrapper(
  "education", "EDUCATION",
  `import educationJson from "./education.json";`,
  `educationJson as unknown as EducationSnapshot[]`,
);
rewriteWrapper(
  "writers", "WRITERS",
  `import writersJson from "./writers.json";`,
  `writersJson as unknown as Writer[]`,
);

console.log("Wrappers rewritten ✓");
console.log("Facts extracted:", {
  countryDecades: cd.length, famousPeople: fp.length, media: md.length,
  slang: sl.length, babyNames: bn.length, culture: cu.length,
  education: EDUCATION.length, writers: WRITERS.length,
});

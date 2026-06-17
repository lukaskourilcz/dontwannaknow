// Extract inline dataset arrays from src/data/*.ts into co-located .json
// files and rewrite the .ts modules to re-import them.
//
// For each (tsFile, exportName, jsonPath) target this script:
//   1. Gets the RUNTIME value of the export by bundling the module with
//      esbuild to a temp ESM file and dynamic-importing it.
//   2. Writes that value to jsonPath as `JSON.stringify(value, null, 2) + "\n"`.
//   3. Rewrites the .ts to replace the inline array-literal initializer with
//      `<jsonVar> as <typeAnnotation>` and inserts the matching JSON import,
//      using the TypeScript compiler API to find the exact character range
//      of the initializer (so brackets inside strings never confuse it).
//
// A pre-migration snapshot of every export's runtime value is written to
// scripts/.snapshot/ so verify-content-json.mjs can deep-compare after the
// rewrite. Runtime behaviour must stay byte-for-byte identical.
//
// Usage: node scripts/extract-content-json.mjs

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import esbuild from "esbuild";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// ── TARGETS ────────────────────────────────────────────────────────────
// Each entry: a .ts source file plus the exports within it to extract.
// `exports` is a list so files with multiple target arrays are supported.
// `jsonVar` is the camelCase identifier bound to the JSON import.
const TARGETS = [
  {
    tsFile: "src/data/events.ts",
    exports: [{ name: "EVENTS", json: "src/data/events.json", jsonVar: "eventsJson" }],
  },
  {
    tsFile: "src/data/countryEvents.ts",
    exports: [{ name: "COUNTRY_EVENTS", json: "src/data/countryEvents.json", jsonVar: "countryEventsJson" }],
  },
  {
    tsFile: "src/data/history.ts",
    exports: [{ name: "FACTS", json: "src/data/history.json", jsonVar: "historyJson" }],
  },
  {
    tsFile: "src/data/monthlyEvents.ts",
    exports: [{ name: "MONTHLY_EVENTS", json: "src/data/monthlyEvents.json", jsonVar: "monthlyEventsJson" }],
  },
  {
    tsFile: "src/data/cosmicEvents.ts",
    exports: [{ name: "COSMIC_EVENTS", json: "src/data/cosmicEvents.json", jsonVar: "cosmicEventsJson" }],
  },
  {
    tsFile: "src/data/inventions.ts",
    exports: [{ name: "INVENTIONS", json: "src/data/inventions.json", jsonVar: "inventionsJson" }],
  },
  {
    tsFile: "src/data/notableDeaths.ts",
    exports: [{ name: "NOTABLE_DEATHS", json: "src/data/notableDeaths.json", jsonVar: "notableDeathsJson" }],
  },
  {
    tsFile: "src/data/famousBirths.ts",
    exports: [{ name: "FAMOUS_BIRTHS", json: "src/data/famousBirths.json", jsonVar: "famousBirthsJson" }],
  },
  {
    tsFile: "src/data/extinctions.ts",
    exports: [{ name: "EXTINCTIONS", json: "src/data/extinctions.json", jsonVar: "extinctionsJson" }],
  },
  {
    tsFile: "src/data/culturalWorks.ts",
    exports: [
      { name: "SONGS", json: "src/data/songs.json", jsonVar: "songsJson" },
      { name: "BOOKS", json: "src/data/books.json", jsonVar: "booksJson" },
      { name: "PAINTINGS", json: "src/data/paintings.json", jsonVar: "paintingsJson" },
      { name: "SCULPTURES", json: "src/data/sculptures.json", jsonVar: "sculpturesJson" },
      { name: "PLAYS", json: "src/data/plays.json", jsonVar: "playsJson" },
    ],
  },
  {
    tsFile: "src/data/cities.ts",
    // cities.ts ALSO defines CITIES, the City/CityFact types, and the
    // functions citiesFor/findCity/cityFactsFor — those stay untouched.
    // Only CITY_FACTS becomes a JSON import.
    exports: [{ name: "CITY_FACTS", json: "src/data/cityFacts.json", jsonVar: "cityFactsJson" }],
  },
];

const SNAPSHOT_DIR = path.join(__dirname, ".snapshot");

// Bundle a .ts module to a temp .mjs and dynamic-import it, returning the
// module namespace. bundle:true so relative imports (and, post-rewrite,
// JSON imports) resolve. platform:"node" + format:"esm".
async function importModule(absTsFile) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "dwk-extract-"));
  const tmpOut = path.join(tmpDir, "out.mjs");
  try {
    await esbuild.build({
      entryPoints: [absTsFile],
      bundle: true,
      format: "esm",
      platform: "node",
      outfile: tmpOut,
      logLevel: "silent",
      // Default loaders already map .json -> json; explicit for clarity.
      loader: { ".json": "json" },
    });
    const mod = await import(pathToFileURL(tmpOut).href);
    return mod;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

// Locate the exact [start, end) character range of the array-literal
// initializer for `export const <exportName> = [...]`, plus the type
// annotation text (e.g. "WorldEvent[]").
function findExportInitializer(absFile, src, exportName) {
  const sf = ts.createSourceFile(absFile, src, ts.ScriptTarget.Latest, true);
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== exportName) continue;
      if (!decl.initializer || !ts.isArrayLiteralExpression(decl.initializer)) {
        throw new Error(
          `Export "${exportName}" in ${absFile} is not initialized with an array literal.`,
        );
      }
      if (!decl.type) {
        throw new Error(
          `Export "${exportName}" in ${absFile} has no type annotation.`,
        );
      }
      return {
        start: decl.initializer.getStart(sf),
        end: decl.initializer.getEnd(),
        typeText: decl.type.getText(sf),
      };
    }
  }
  throw new Error(`Export "${exportName}" not found as a top-level const in ${absFile}.`);
}

// Offset of the first top-level statement (AFTER the leading comment block).
function firstStatementStart(absFile, src) {
  const sf = ts.createSourceFile(absFile, src, ts.ScriptTarget.Latest, true);
  if (sf.statements.length === 0) {
    throw new Error(`No statements found in ${absFile}.`);
  }
  return sf.statements[0].getStart(sf);
}

async function main() {
  await fs.rm(SNAPSHOT_DIR, { recursive: true, force: true });
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });

  const summary = [];

  // ── Phase 1: snapshot + extract runtime values (BEFORE any rewrite) ──
  // Capture every target export's runtime value while modules are still
  // inline literals, write the JSON files, and write snapshots for verify.
  for (const target of TARGETS) {
    const absTs = path.join(repoRoot, target.tsFile);
    const mod = await importModule(absTs);
    for (const exp of target.exports) {
      if (!(exp.name in mod)) {
        throw new Error(`Export "${exp.name}" missing from ${target.tsFile} at runtime.`);
      }
      const value = mod[exp.name];
      const json = JSON.stringify(value, null, 2) + "\n";

      // Write the JSON data file.
      const absJson = path.join(repoRoot, exp.json);
      await fs.writeFile(absJson, json, "utf8");

      // Write a pre-migration snapshot for the verification step.
      const snapPath = path.join(SNAPSHOT_DIR, exp.name + ".json");
      await fs.writeFile(snapPath, json, "utf8");

      const count = Array.isArray(value) ? value.length : null;
      summary.push({ name: exp.name, json: exp.json, count });
      console.log(`extracted ${exp.name}: ${count} entries -> ${exp.json}`);
    }
  }

  // ── Phase 2: rewrite each .ts file ──────────────────────────────────
  for (const target of TARGETS) {
    const absTs = path.join(repoRoot, target.tsFile);
    let src = await fs.readFile(absTs, "utf8");

    // Compute all edits against the ORIGINAL source text, then apply them
    // right-to-left (highest offset first) so earlier offsets don't shift.
    const edits = [];

    // One import per export, all inserted at the first-statement offset.
    const insertAt = firstStatementStart(absTs, src);
    const importLines = target.exports
      .map((exp) => {
        const rel = "./" + path.basename(exp.json);
        return `import ${exp.jsonVar} from "${rel}";`;
      })
      .join("\n");
    edits.push({ start: insertAt, end: insertAt, text: importLines + "\n\n" });

    // Replace each array-literal initializer with `<jsonVar> as <type>`.
    for (const exp of target.exports) {
      const { start, end, typeText } = findExportInitializer(absTs, src, exp.name);
      edits.push({ start, end, text: `${exp.jsonVar} as ${typeText}` });
    }

    // Apply right-to-left.
    edits.sort((a, b) => b.start - a.start);
    for (const e of edits) {
      src = src.slice(0, e.start) + e.text + src.slice(e.end);
    }

    await fs.writeFile(absTs, src, "utf8");
    console.log(`rewrote ${target.tsFile}`);
  }

  // ── Phase 3: standalone content files with no .ts counterpart ───────
  const sportsPath = path.join(repoRoot, "src/data/sports.json");
  await fs.writeFile(sportsPath, "[]\n", "utf8");
  summary.push({ name: "(sports)", json: "src/data/sports.json", count: 0 });
  console.log("wrote src/data/sports.json: 0 entries");

  console.log("\n── Summary ──");
  for (const s of summary) {
    console.log(`${String(s.count).padStart(6)}  ${s.json}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

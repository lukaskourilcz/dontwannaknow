// Verify that the JSON extraction preserved every export byte-for-byte.
//
// For each target export it re-bundles the (now rewritten) .ts module,
// reads the runtime value, and compares its `JSON.stringify(v, null, 2)`
// form against the pre-migration snapshot captured by
// extract-content-json.mjs in scripts/.snapshot/.
//
// Exits 0 only if every export matches its snapshot exactly.
//
// Usage: node scripts/verify-content-json.mjs

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const SNAPSHOT_DIR = path.join(__dirname, ".snapshot");

// Same TARGETS shape as the extractor (kept in sync intentionally).
const TARGETS = [
  { tsFile: "src/data/events.ts", exports: ["EVENTS"] },
  { tsFile: "src/data/countryEvents.ts", exports: ["COUNTRY_EVENTS"] },
  { tsFile: "src/data/history.ts", exports: ["FACTS"] },
  { tsFile: "src/data/monthlyEvents.ts", exports: ["MONTHLY_EVENTS"] },
  { tsFile: "src/data/cosmicEvents.ts", exports: ["COSMIC_EVENTS"] },
  { tsFile: "src/data/inventions.ts", exports: ["INVENTIONS"] },
  { tsFile: "src/data/notableDeaths.ts", exports: ["NOTABLE_DEATHS"] },
  { tsFile: "src/data/famousBirths.ts", exports: ["FAMOUS_BIRTHS"] },
  { tsFile: "src/data/extinctions.ts", exports: ["EXTINCTIONS"] },
  {
    tsFile: "src/data/culturalWorks.ts",
    exports: ["SONGS", "BOOKS", "PAINTINGS", "SCULPTURES", "PLAYS"],
  },
  { tsFile: "src/data/cities.ts", exports: ["CITY_FACTS"] },
];

async function importModule(absTsFile) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "dwk-verify-"));
  const tmpOut = path.join(tmpDir, "out.mjs");
  try {
    await esbuild.build({
      entryPoints: [absTsFile],
      bundle: true,
      format: "esm",
      platform: "node",
      outfile: tmpOut,
      logLevel: "silent",
      loader: { ".json": "json" },
    });
    return await import(pathToFileURL(tmpOut).href);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  let failures = 0;
  let checked = 0;

  for (const target of TARGETS) {
    const absTs = path.join(repoRoot, target.tsFile);
    const mod = await importModule(absTs);
    for (const name of target.exports) {
      checked++;
      const snapPath = path.join(SNAPSHOT_DIR, name + ".json");
      let snapshot;
      try {
        snapshot = await fs.readFile(snapPath, "utf8");
      } catch {
        console.error(`MISSING SNAPSHOT for ${name} (${snapPath}). Run extract first.`);
        failures++;
        continue;
      }

      if (!(name in mod)) {
        console.error(`MISMATCH ${name}: export missing from rewritten ${target.tsFile}`);
        failures++;
        continue;
      }

      const current = JSON.stringify(mod[name], null, 2) + "\n";
      if (current === snapshot) {
        const count = Array.isArray(mod[name]) ? mod[name].length : "?";
        console.log(`OK ${name} (${count} entries) — identical to snapshot`);
      } else {
        failures++;
        console.error(`MISMATCH ${name}: rewritten value differs from pre-migration snapshot`);
        // Show first differing line for diagnostics.
        const a = snapshot.split("\n");
        const b = current.split("\n");
        const n = Math.max(a.length, b.length);
        for (let i = 0; i < n; i++) {
          if (a[i] !== b[i]) {
            console.error(`  first diff at line ${i + 1}:`);
            console.error(`    snapshot: ${JSON.stringify(a[i])}`);
            console.error(`    current : ${JSON.stringify(b[i])}`);
            break;
          }
        }
      }
    }
  }

  console.log(`\nChecked ${checked} exports, ${failures} mismatch(es).`);
  if (failures > 0) process.exit(1);
  console.log("All exports verified identical to pre-migration snapshots.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

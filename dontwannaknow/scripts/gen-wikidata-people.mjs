// Build-time generator — notable people born in each decade per country, from
// Wikidata (free, no key), ranked by number of Wikipedia sitelinks (a solid
// fame proxy). Run manually and commit the output; the shipped app never calls
// the network.
//
//   node scripts/gen-wikidata-people.mjs
//
// Output: src/data/generated/wikidataPeople.json
//   [ { country, decadeStart, people: [{ name, role, birthYear, wikidataId }] } ]
//
// Labels prefer Czech, falling back to English. Queries are scoped by
// citizenship + birth-decade so they stay cheap enough for the WDQS 60s limit.
// HTTP via curl (HTTP/1.1) — see gen-worldbank.mjs for why.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/generated/wikidataPeople.json");

// App country code -> Wikidata citizenship QIDs (present + historical states).
const CITIZENSHIP = {
  CZ: ["Q213", "Q33946"], // Czech Republic, Czechoslovakia
  ES: ["Q29"], // Spain
  US: ["Q30"], // United States
  UA: ["Q212", "Q130280"], // Ukraine, Ukrainian SSR
};
const DECADES = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980];
const PER_DECADE = 12;
const UA_HEADER =
  "dontwannaknow-datagen/1.0 (https://github.com/lukaskourilcz/dontwannaknow; kouril.lukas@gmail.com)";

// Deterministic tiny sleep between queries to be a polite WDQS citizen.
function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* busy-wait; fine for a one-off script */ }
}

// WDQS occasionally answers with a 200 body of "upstream request timeout"
// (not JSON) under load. Retry a few times with backoff; return null on
// persistent failure so one bad decade never kills the whole run.
function sparql(query) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const body = execFileSync(
        "curl",
        [
          "-s", "--http1.1", "--max-time", "90",
          "-H", "Accept: application/sparql-results+json",
          "-H", `User-Agent: ${UA_HEADER}`,
          "-G", "--data-urlencode", `query=${query}`,
          "https://query.wikidata.org/sparql",
        ],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      );
      return JSON.parse(body); // throws on the non-JSON timeout body
    } catch {
      process.stdout.write(`    (retry ${attempt} after timeout)\n`);
      sleep(2000 * attempt);
    }
  }
  return null;
}

// Aggregate one occupation per person in an inner subquery so very-famous
// people (who carry many P106 values) don't crowd out the LIMIT via row
// fanout. Labels come from the wikibase:label service on the outside.
function queryFor(qids, lo, hi) {
  const values = qids.map((q) => `wd:${q}`).join(" ");
  return `SELECT ?person ?personLabel ?role ?birthYear ?sl WHERE {
  {
    SELECT ?person (SAMPLE(?ol) AS ?role) (MIN(?y) AS ?birthYear) ?sl WHERE {
      ?person wdt:P31 wd:Q5 ;
              wdt:P27 ?cit ;
              wdt:P569 ?dob ;
              wikibase:sitelinks ?sl .
      VALUES ?cit { ${values} }
      BIND(YEAR(?dob) AS ?y)
      FILTER(?y >= ${lo} && ?y <= ${hi})
      FILTER(?sl >= 8)
      OPTIONAL { ?person wdt:P106 ?occ . ?occ rdfs:label ?ol . FILTER(LANG(?ol) = "cs" || LANG(?ol) = "en") }
    }
    GROUP BY ?person ?sl
    ORDER BY DESC(?sl)
    LIMIT 15
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
}
ORDER BY DESC(?sl)`;
}

const out = [];
for (const [country, qids] of Object.entries(CITIZENSHIP)) {
  for (const decadeStart of DECADES) {
    const json = sparql(queryFor(qids, decadeStart, decadeStart + 9));
    if (!json) {
      process.stdout.write(`  ${country} ${decadeStart}s: SKIPPED (query failed)\n`);
      sleep(1100);
      continue;
    }
    const rows = json?.results?.bindings ?? [];
    // The inner subquery already yields one row per person; dedupe defensively.
    const seen = new Map();
    for (const r of rows) {
      const id = r.person.value.split("/").pop();
      if (seen.has(id)) continue;
      const name = r.personLabel?.value ?? "";
      // Skip rows where the label is just the Q-id (no human-readable label).
      if (!name || /^Q\d+$/.test(name)) continue;
      seen.set(id, {
        name,
        role: r.role?.value ?? "",
        birthYear: Number(r.birthYear?.value) || decadeStart,
        wikidataId: id,
      });
    }
    const people = [...seen.values()].slice(0, PER_DECADE);
    if (people.length) out.push({ country, decadeStart, people });
    process.stdout.write(`  ${country} ${decadeStart}s: ${people.length}\n`);
    sleep(1100);
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
process.stdout.write(`\nWrote ${OUT} (${out.length} country-decades)\n`);

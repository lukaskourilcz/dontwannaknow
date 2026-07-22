# Generated data

These JSON files (and the images under `public/art/`) are produced **at build
time** by the scripts in [`../../../scripts/`](../../../scripts) from free,
no-key public APIs, then **committed**. The shipped app never calls the network
— it reads only these static files, so it stays offline, deterministic, and
private. The production CSP keeps `connect-src` at `'self'`; `img-src` permits
same-origin files plus `data:` and `blob:` URLs required by client exports.

Regenerate any of them by running the matching script and committing the diff:

| File | Script | Source | What it is |
|---|---|---|---|
| `worldBank.json` | `node scripts/gen-worldbank.mjs` | [World Bank Indicators](https://data.worldbank.org) | Real population, life expectancy, GDP/capita, birth & death rates, fertility, and infant mortality per country per year (CZE/ESP/USA/UKR/CAN/MEX/WLD, ~1960→). |
| `wikidataPeople.json` | `node scripts/gen-wikidata-people.mjs` | [Wikidata](https://query.wikidata.org) | Notable people born in each decade per country, ranked by Wikipedia sitelinks (Czech labels preferred). |
| `artByDecade.json` + `public/art/*.jpg` | `node scripts/gen-art.mjs` | [The Met Open Access](https://metmuseum.github.io) | Public-domain (CC0) paintings created in each decade; thumbnails are downloaded and served same-origin. |

Notes:

- All HTTP goes through `curl` (HTTP/1.1) inside the scripts for predictable
  behavior across CLI proxy environments. Regeneration therefore requires
  `curl` in addition to Node.js.
- The generators are **additive**: they never overwrite the hand-curated
  datasets in `../`. Each feeds a clearly-scoped, guarded part of the report
  (real World Bank figures, "famous contemporaries", "art of the era"), so a
  missing or empty file simply hides that part rather than breaking anything.

# Generated data

These JSON files (and the images under `public/art/`) are produced **at build
time** by the scripts in [`../../../scripts/`](../../../scripts) from free,
no-key public APIs, then **committed**. The shipped app never calls the network
— it reads only these static files, so it stays offline, deterministic, and
private (the strict CSP keeps `connect-src`/`img-src` at `'self'`).

Regenerate any of them by running the matching script and committing the diff:

| File | Script | Source | What it is |
|---|---|---|---|
| `worldBank.json` | `node scripts/gen-worldbank.mjs` | [World Bank Indicators](https://data.worldbank.org) | Real population, life expectancy, and GDP/capita per country per year (CZE/ESP/USA/UKR/WLD, ~1960→). |
| `wikidataPeople.json` | `node scripts/gen-wikidata-people.mjs` | [Wikidata](https://query.wikidata.org) | Notable people born in each decade per country, ranked by Wikipedia sitelinks (Czech labels preferred). |
| `artByDecade.json` + `public/art/*.jpg` | `node scripts/gen-art.mjs` | [The Met Open Access](https://metmuseum.github.io) | Public-domain (CC0) paintings created in each decade; thumbnails are downloaded and served same-origin. |

Notes:

- All HTTP goes through `curl` (HTTP/1.1) inside the scripts, because this
  session's egress proxy stalls HTTP/2 and Node's `fetch` doesn't read the proxy
  reliably. On a normal machine the scripts run the same way.
- The generators are **additive**: they never overwrite the hand-curated
  datasets in `../`. Each feeds a clearly-scoped, guarded part of the report
  (real World Bank figures, "famous contemporaries", "art of the era"), so a
  missing or empty file simply hides that part rather than breaking anything.

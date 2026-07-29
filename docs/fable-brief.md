# Brief for Fable — Tehdejší svět

You are being asked to take an existing, working Czech product to the next level.
Read all of this before proposing anything. The goal is **more knowledgeable
discovery per reader, not more facts per page.**

Repo: `lukaskourilcz/dontwannaknow`, branch `main`. App lives in `dontwannaknow/`.

---

## 1. What the product is

**Tehdejší svět** ("The world back then") is a Czech-only, person-centric
publication that reconstructs the *environment* somebody grew up in. The single
question on the landing page is **„Čí svět chcete poznat?"** — *whose world do
you want to know?*

You enter a person's birth year (a full date is optional), their country
(Czechia or Ukraine) and their birth city. The app generates an editorial
"personal edition": eight chapters covering the year they were born, their
childhood, an ordinary day, adolescence, what was different from today, how the
world around them changed, the wider forces shaping their generation, and a
long-view numbers section.

Audience: people trying to understand a parent, grandparent, partner, friend,
themselves, or a Czech–Ukrainian family relationship. It is not a genealogy tool
and not a biography generator.

---

## 2. Hard contract — do not break any of these

These are product invariants, not preferences. A change that violates one of
them is wrong even if it is otherwise excellent.

1. **No runtime AI, and everything ships as JSON.** The shipped app calls no
   model, ever. It is a static Vite build on Vercel with no backend, no
   accounts, no database, no report storage, and no external historical APIs at
   runtime. AI is allowed **only at build time**, and its entire output is
   committed JSON in the repository that the site serves statically. Every fact,
   score, rationale, and source a reader can ever see exists as a JSON record in
   `src/data/` before the build runs. Nothing is fetched, inferred, or generated
   while a reader is on the page. (This is the single most important constraint
   on what you are being asked to build.)
2. **Deterministic output.** The same person always yields the same report. All
   randomness runs through a seeded PRNG (`src/lib/random.ts`, seed derived from
   the person's fields). `Math.random()` is not used anywhere in report
   generation.
3. **Not a biography.** Never invent private experience, memories, routines,
   preferences, family circumstances, quotes, sources, or historical evidence.
   Chapters explicitly say they reconstruct conditions, not a person's life.
4. **Public scope is CZ and UA only.** Archived data for other countries exists
   in the repo but must never enter a public runtime bundle. `npm run
   audit:content` enforces this.
5. **Privacy.** Form values never leave the browser. Name, date, country, city,
   relationship, variant, and report content are never sent to analytics.
   Shared state lives in a URL fragment (`#r=…`) that is not transmitted in the
   HTTP request. Names are excluded from share fragments unless the user
   explicitly opts in.
6. **Czech voice.** Formal `vy / vás / vaše`, sentence case, concrete language,
   honest uncertainty. Never overclaim ("everyone", "certainly experienced") —
   `scripts/audit-content.mjs` greps for exactly these patterns and fails the
   build.
7. **Sensitivity.** Difficult history (war, occupation, persecution, famine,
   death, repression) is flagged, tonally separated, never used as the opening
   or as share content, and never sits in a visual group with light material.
8. **Accessibility.** Works from 320 px with no horizontal scroll, 44 px minimum
   touch targets, visible focus, keyboard operable, `prefers-reduced-motion`
   honoured, WCAG AA contrast, 200 % zoom reflow, accessible text summaries for
   the map/sky/canvas surfaces.
9. **Design system.** Semantic tokens in `src/styles.css`; rules in
   `dontwannaknow/DESIGN.md`. Warm paper background, dark green as structural
   brand colour, coral for the primary action. No random gradients, glass cards,
   glows, sepia, national flags as identity, or decorative "AI shine".

---

## 3. How it works today

Pipeline, in order:

```
src/lib/person.ts            normalize + validate the person, supported year range
src/lib/historicalLocation.ts  city + year → the state that actually existed then
src/lib/facts.ts             gather candidate facts from every dataset
src/lib/report.ts            annotate each fact with editorial metadata, compose chapters
src/components/Results.tsx   render chapters, maps, sky, art, timeline, share, PDF
```

**`historicalLocation.ts`** is a real strength: it resolves a modern city and a
birth date to the political entity that existed at that moment —
Czechoslovakia, Protectorate of Bohemia and Moravia, Czech Socialist Republic,
the federation, the Czech Republic, Ukrainian SSR, USSR, interwar Poland,
Kingdom of Romania — and flags births that land on a transition.

**`report.ts`** annotates every fact with `EditorialMetadata`:
`tone` (warm / playful / neutral / serious), `sensitivity` (none / mild /
difficult), `chapter`, `shareSafe`, `featured`, `geographicScope` (city /
modern-country / historical-state / wider-state / global), `historicalEntityId`,
`sourceConfidence` (verified / review-needed), `reviewRequired`, and an optional
age window. Metadata comes from the fact's category plus regex rules in
`src/data/editorialRules.json` (6 rules today, matching Czech trauma and
political vocabulary).

Chapter composition takes a ranked category list per chapter, filters by
sensitivity and age window, dedupes, and slices to a per-chapter budget (4–8
items). `avoidConsecutiveDifficult()` interleaves so heavy items never stack.

**Chapters:** `birth`, `early-childhood`, `everyday-day`, `teenage-years`,
`different-from-today`, `changing-world`, `generation-context` (collapsed by
default), `life-numbers` (collapsed).

**Other real features:** two-person comparison; a birth-night star chart
computed with `astronomy-engine` for the actual coordinates and date; a world
map of the borders of the time; an art strip from Met/AIC collection data;
life-in-numbers counters; canvas share images at 1200×630 / 1080×1350 /
1080×1920; a client-side jsPDF export; a `/dev` editor that writes JSON through
Vite middleware in development and is read-only/export-based in production.

---

## 4. What data it has today — and the honest state of it

Public runtime bundle (`src/data/public/`, generated by
`scripts/build-public-data.mjs`):

| dataset | records | what it is |
|---|---|---|
| `cityFacts.cz` | 1 096 | dated city events, Czechia |
| `cityFacts.ua` | 1 077 | dated city events, Ukraine |
| `countryEvents` | 529 | dated national events, CZ + UA |
| `countryDecades` | 269 | per-decade texture in 8 buckets: government, clothes, illnesses, dailyLife, food, money, bizarre, beautiful |
| `famousPeople` | 87 | cultural figures by country and decade |
| `cities` / `cityCoords` | 70 + 70 | 50 Czech, 20 Ukrainian cities with period names and coordinates |
| `wikidataPeople` | 18 buckets | contemporaries born the same decade, ranked by Wikipedia sitelinks |
| `worldBank` | 3 series sets | population, life expectancy, GDP/capita, birth rate, death rate, infant mortality, fertility — from ~1960 |

Archive-only (not in the public bundle): `history.json` (10 412 lines of
long-form research awaiting editorial review), `monthlyEvents`, `cosmicEvents`,
`notableDeaths`, `famousBirths`, `songs`, `books`, `paintings`, `sculptures`,
`plays`, `slang`, `babyNames`, `culture`, `education`, `sports`, `extinctions`.

Verified external sources: **World Bank Open Data**, **Wikidata**, **The Met +
Art Institute of Chicago**, **Natural Earth**. Everything else is registered in
`src/data/dataSources.json` as *"Interní kurátorovaná rešerše"* — internal
curated research — with confidence `review-needed`.

**That is the core weakness.** Roughly 80 % of what the reader sees is
unattributed, unverified internal research. There is a read-only workflow
(`/audit-facts`) for sampled web verification, but no per-record provenance.

Other weaknesses worth naming:
- Facts are selected by **category rank and recency of insertion**, not by how
  interesting or consequential they are. A trivial item and a formative one
  compete on equal footing.
- People appear as one-line name-plus-role strings. There is no dataset of
  political leaders, no account of how anyone was regarded, no achievements, no
  controversies.
- `editorialRules.json` is six regexes over Czech keywords. It catches trauma
  reasonably; it does nothing about relevance.
- The Ukrainian side is thinner than the Czech side in every dataset except city
  facts.

---

## 5. What to build — the ask

Three strands. Do them in this order; each depends on the one before.

### Strand A — an editorial relevance system

**The problem to solve, in the product owner's words:** nobody cares when
Facebook launched; everybody wants to know who the president was, how society
regarded them, what they achieved, and what they were accused of.

Build a **scored relevance model** that decides what earns a place in a report.
Score every candidate record on independent axes, store the scores in the data,
and let the runtime selector rank by them.

Proposed axes (refine them, but keep them independent and each individually
defensible):

- **Lived proximity** — did this touch the reader's person where they actually
  were? city > historical state > modern country > global.
- **Everyday consequence** — did it change what people ate, wore, feared, could
  buy, queued for, watched, or were allowed to say? A law that changed shop
  opening hours outranks a distant corporate milestone.
- **Recognition value** — would someone who lived through it say "yes, exactly"?
- **Discovery value** — would they say "I never knew that"? A good chapter needs
  both; score them separately so selection can guarantee a mix.
- **Consequence horizon** — did it still matter a decade later?
- **Explanatory payload** — is there a *story* here, or only a date? Bare
  founding/launch dates with no local consequence score near zero.
- **Age fit** — was the person old enough for this to register? A 1968 invasion
  means something different to a 2-year-old and a 15-year-old, and the existing
  `ageFrom`/`ageTo` metadata already supports this but is barely used.

Three hard requirements on the mechanism:

1. **The agents run at build time only.** Model-assisted curation produces
   committed JSON carrying the scores. The shipped runtime reads numbers and
   sorts. It must remain deterministic, offline, and free of model calls — see
   §2.1. If you propose anything that calls a model from the browser, you have
   misunderstood the product.
2. **Deterministic gates outrank every score.** There is no human review queue:
   the scores an agent writes are what ships. That makes the hard-coded rules
   the only thing between a bad score and a reader, so they must be enforced in
   code and must win unconditionally. A high score must never be able to
   promote a record past the sensitivity classification, the share-safety flag,
   the age window, the CZ/UA scope, or the overclaim vocabulary. Scoring only
   ever reorders what the gates have already allowed.
3. **Scoring is reproducible and auditable after the fact.** Store each score
   with a one-line rationale and the model/prompt version that produced it, so a
   re-run can be diffed against the committed data and a wrong call can be
   traced to its cause. Extend `scripts/audit-content.mjs` with checks over the
   scored fields — range validity, missing rationales, records that pass a gate
   but carry a contradictory score — so the build fails on a malformed batch
   instead of shipping it.

Guard against the obvious failure modes: don't let "interesting" collapse into
"dramatic" (the sensitivity rules exist precisely to stop trauma dominating);
don't score a record by how well it is written; and don't let a single agent
pass be the whole system — score each axis independently so one bad judgement
cannot carry a record on its own.

### Strand B — sources and enrichment

**Per-record provenance.** Every public record should carry: source title,
publisher, URL, date accessed, and licence. Extend
`src/data/dataSources.json` from a per-dataset registry to per-record
attribution. Records that cannot be attributed keep `review-needed` and must
visibly read as less certain in the UI, or not ship.

**New dataset: political leaders and heads of state (CZ + UA, 1918–present).**
This is the product owner's headline example and it is currently missing
entirely. Shape each entry with: office, term, how they took power, documented
contemporary reception, documented later reassessment, concrete achievements,
documented controversies, a `contested` flag where historiography genuinely
disagrees, plus sensitivity and share-safety flags. Reception must be sourced
and dated — *"in 1968 he was widely popular, by 1975 that had changed"* — never
a flat verdict, and never your own opinion of anyone.

**Widen the source base.** Candidates to evaluate, not a list to trust blindly —
verify licence and stability for each before you build on it: the Czech
Statistical Office (ČSÚ) for demography and prices; the Czech National Archive
and regional archives; the Institute for the Study of Totalitarian Regimes;
public-broadcaster programme archives for what was actually on television and
radio; Ukrainian state archives and national statistics; UNESCO and OECD
historical series; existing Wikidata and World Bank pipelines, extended. Follow
the established pattern in `scripts/gen-wikidata-people.mjs` and
`scripts/gen-worldbank.mjs`: fetch at build time, commit the derived data,
never call it at runtime.

**Close the Ukraine gap.** Czech coverage is materially better in every dataset
except city facts. A Ukrainian reader should not get a visibly thinner report.

**Promote the archive.** `history.json` holds 10 412 lines of long-form research
that never reaches a reader because it has not been reviewed record by record.
Scoring and attribution are what unlock it.

### Strand C — modernize the reading experience

Note: the landing page and hero were rebuilt very recently and the design system
is documented and deliberate. Modernize the **report** surface, which is the
older part. Keep the tokens, the typographic scale, and the editorial voice.

- **Depth on demand.** A scored, one-line fact that expands into the fuller
  story with its sources. This is how you give discovery without overload.
- **Hold the budget.** More data must not become more items per chapter. Keep
  chapters at 4–8 items and let scoring decide what survives. If a chapter feels
  thin, that is a data problem, not a licence to widen the budget.
- **Guarantee a mix.** Every chapter should carry at least one high-recognition
  item and one high-discovery item, and never open with a difficult one.
- **Show confidence.** A reader should be able to tell verified from
  review-needed without reading a methodology page.
- **Make people legible.** A leader or cultural figure should render as a small
  profile — term, reception, achievements, controversies — not a name and a
  role.
- **Performance — this is now a hard requirement, not a nice-to-have.** Every
  fact, score, rationale and source ships as JSON (§2.1), so the data will grow
  by a large multiple. The public bundle already approaches 500 kB per country
  today. Split it: chunk by city, by decade, and by country so a report loads
  only the slices it needs, and keep every heavy module lazy. First paint must
  not get slower than it is today. Measure it and say what you measured.

---

## 6. Working rules

- Search before creating. Extend the existing components, utilities, types,
  tokens, and scripts before adding a parallel system.
- Commands, run from `dontwannaknow/`: `npm run dev`, `npm run typecheck`,
  `npm run lint`, `npm test`, `npm run audit:content`, `npm run build`,
  `npm run check`. Run `npm run data:public` only when generator inputs or logic
  changed, then inspect the generated diff.
- `npm run check` must pass. `audit:content` enforces the CZ/UA public scope,
  the source registry, the editorial rules, and the overclaim vocabulary —
  extend it with checks for whatever you add.
- Make coherent incremental commits. Czech commit messages match the repo's
  existing history.
- Anything that renders pixels — canvas, WebGL, generated SVG, share images —
  is not reviewable by reading the diff. Run the app and look at it.

## 7. Done means

- A report for a 1953 Prague birth and a 1991 Kharkiv birth each surfaces
  something a well-read person would not already know, and nothing that reads as
  filler.
- Every public record has a source a reader could check.
- Every score carries a rationale and a version stamp, `audit:content` fails on a
  malformed batch, and the sensitivity, share-safety, age and scope gates
  demonstrably beat a high score in a test.
- The runtime still makes zero model calls and zero network requests for
  historical data, everything a reader sees is a committed JSON record, and the
  same input still produces the same report.
- First paint is no slower than before, with the measurement stated.
- `npm run check` passes; responsive, keyboard, reduced-motion, and contrast
  states have been inspected in a real browser.

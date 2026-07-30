# Fact scoring contract

Authoritative, tool-neutral description of how a record earns its place in a
report. Applies to every agent and every human working in this repo — Claude,
Codex, Cursor, Copilot, or a person with an editor. If a change contradicts
this document, the change is wrong.

## Why scoring exists

Nobody cares when Facebook launched. Readers want to know who was in charge,
how society regarded them, what changed in the shops and on the television.
Selection therefore runs on *editorial relevance*, never on recency, category
rank, or insertion order.

## Never restate the rubric — print it

The axes, their 0–5 anchors, the guardrails and the prompt version live in
code, in `dontwannaknow/scripts/relevance/prompts.mjs`. That module is the
single source of truth. Documentation must not copy the rubric, because a copy
drifts. Get the exact prompt with:

```bash
npm run relevance:prompt -- --versions   # prompt version, axis order, passes
npm run relevance:prompt -- A            # full prompt text for pass A
npm run relevance:prompt -- B --json     # machine-readable
```

Six independent axes, in the contractual order of the compact `rel` array:
`livedProximity`, `everydayConsequence`, `recognition`, `discovery`,
`consequenceHorizon`, `explanatoryPayload`. They are scored in three
independent passes (A context, B reader, C story) so one bad judgement cannot
carry a record on its own.

## Hard rules

1. **Scoring happens at build time only.** The shipped app calls no model,
   ever. Scores are committed JSON; the runtime reads numbers and sorts.
2. **Deterministic gates outrank every score.** There is no human review
   queue, so the gates are the only thing between a bad score and a reader.
   A high score must never promote a record past the sensitivity
   classification, the share-safety flag, the age window, the CZ/UA scope, or
   a dataset-specific gate. Scoring only ever reorders what the gates allowed.
   Gates live in `dontwannaknow/src/lib/report.ts` (`take`, `annotateFact`)
   and are covered by `src/lib/report.gates.test.ts`. Add a test with any new
   gate.
3. **Every score carries a rationale and a version stamp**, so a re-run can be
   diffed against committed data and a wrong call traced to its cause.
4. **Do not score prose quality, and do not let "interesting" collapse into
   "dramatic."** Sensitivity rules exist precisely so trauma cannot dominate.
5. **A bare launch date is not a fact.** A record with no local consequence
   and no period story scores near zero on `explanatoryPayload`, and for some
   datasets is gated out entirely (see `inventions` below).

## Where things live

| What | Path |
|---|---|
| Rubric, prompt version, pass split | `dontwannaknow/scripts/relevance/prompts.mjs` |
| Record identity (content-keyed) | `dontwannaknow/scripts/relevance/record-key.mjs` |
| Committed scores + rationales | `dontwannaknow/src/data/relevance/<dataset>.json` |
| Per-record citations | `dontwannaknow/src/data/provenance/<dataset>.json` |
| Runtime reader / ranking | `dontwannaknow/src/lib/relevance.ts` |
| Compact runtime fields | `rel` (six ints 0–5) and `src` in `src/data/public/**` |

Record keys are derived from content, not array position, so reordering a file
is safe — but **editing a record's text invalidates its score and citation**,
and `npm run audit:content` will report the orphan.

## The pipeline

Run from `dontwannaknow/`:

```bash
npm run relevance:batches -- --out /tmp/batches --only-missing   # prepare work
# score each batch with the printed prompt (see above), writing one result
# file per batch into /tmp/results using the same filenames
npm run relevance:merge -- --batches /tmp/batches --results /tmp/results --keep-existing
npm run data:public          # propagate rel/src into the public layer
npm run audit:content        # must pass with 0 errors
```

`--only-missing` scores just the records that lack a complete score, which is
how new data is added without re-scoring the corpus. `--keep-existing` merges
a delta into the sidecars instead of replacing them.

## Adding a dataset — the checklist that was once missed

The `inventions` dataset shipped reports containing "in your birth year people
did not use iPads yet" because it bypassed all of this. `audit:content` now
fails on any public dataset that is neither registered for scoring nor listed
in `scoringExempt` with a reason. To register a new dataset:

1. Add a case to `recordKey` in `scripts/relevance/record-key.mjs`.
2. Load it in `loadRecords` in `scripts/relevance/gen-batches.mjs`, giving each
   record a `text` that is what a scorer should judge.
3. Emit it through `withExtras(records, "<dataset>")` in
   `scripts/build-public-data.mjs` so `rel`/`src` attach.
4. Register its public filenames in `relevanceDatasets` in
   `scripts/audit-content.mjs`.
5. Read it in the runtime from `src/data/public/`, expand scores with
   `expandRelevance`, and select with `pickRelevant` — never `pickN`.
6. Score it, merge, regenerate, audit.

## Dataset-specific gates

- **`inventions`** — a record ships only if it carries `detail`, a period
  sentence about what people did *instead*, and (where scored) keeps
  `discovery >= 3`. A product name alone is a truism, not a memory. Modern
  products are deliberately left without `detail`, which excludes them by
  construction.
- **`leaders`** — political profiles are always `shareSafe: false`, always land
  in the wider-context chapter, and every reception claim must be dated and
  cited. Two slots in that chapter are reserved for them so a higher-scoring
  event cannot crowd out the reader's main question.
- **`birthWeather`** — packed daily values and seasonal aggregates are model
  measurements, not editorial records, and are explicitly scoring-exempt in
  their manifest. The eight reader-facing `weatherTemplates` are scored in
  full. A weather item is capped at one, cannot open the birth chapter, is
  absent before 1940, and seasonal superlatives require a complete year,
  twenty reference years and the committed percentile threshold.
- **`filmPremieres`** — a record must pass its country-of-origin gate before
  scoring: CZ accepts only Czechoslovakia/Czechia; UA accepts Ukraine, or a
  USSR record tied to one of four allowlisted Ukrainian studios. A generic
  Mosfilm title is never enough. Childhood accepts fairy-tale films only at
  ages 3–9; teenage placement accepts films only at ages 10–17. A Czech title
  is mandatory, and an override that mentions occupation context is difficult
  and not share-safe.

## Changing the rubric

Editing axes, anchors or guardrails means bumping `PROMPT_VERSION` in
`prompts.mjs`, re-scoring affected records, and committing the diff. The audit
fails when a sidecar's `promptVersion` does not match the current version, so a
half-migrated corpus cannot ship.

## What the audit enforces

`npm run audit:content` fails the build on: scores outside 0–5, missing
rationales, a missing model or `scoredAt` stamp, a prompt-version mismatch,
orphaned score or citation keys, incomplete coverage of a registered dataset,
a malformed compact `rel` array, incomplete citations, a difficult record
carrying a flat maximum (drama-scoring), an unregistered public dataset, and
the Czech overclaim vocabulary.

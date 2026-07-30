# AGENTS.md — instructions for any coding agent in this repo

This file is the shared entry point for every assistant: Codex, Cursor,
Copilot, Claude Code, Aider, or a human reading it. Tool-specific files
(`CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`) exist only
to point here, so there is one contract and nothing to drift.

Read this file, then the two documents it names, before changing anything.

## The product in one paragraph

**Tehdejší svět** is a Czech-only, person-centric publication that
reconstructs the environment somebody grew up in. You enter a birth year
(a full date is optional), a country (Czechia or Ukraine) and a birth city, and
it composes an editorial "personal edition" of eight chapters. It is not a
biography and not a genealogy tool. The app lives in `dontwannaknow/`.

## Non-negotiables

Breaking any of these makes a change wrong even if it is otherwise excellent.

1. **No runtime AI, no backend.** The shipped app calls no model and fetches no
   historical data at runtime. It is a static Vite build: no accounts, no
   database, no report storage. AI is allowed **only at build time**, and its
   entire output is committed JSON in the repository.
2. **Deterministic output.** The same person always yields the same report. All
   randomness goes through the seeded PRNG in `src/lib/random.ts`;
   `Math.random()` never appears in report generation.
3. **Not a biography.** Never invent private experience, memories, routines,
   preferences, family circumstances, quotes, sources, or historical evidence.
   Chapters reconstruct conditions, not a person's life.
4. **Public scope is CZ and UA only.** Archived data for other countries stays
   in the repo but must never enter a public runtime bundle.
5. **Privacy.** Form values never leave the browser. Name, date, country, city,
   relationship, variant and report content are never sent to analytics. Shared
   state lives in a URL fragment; names are excluded unless the user opts in.
6. **Czech voice.** Formal `vy / vás / vaše`, sentence case, concrete language,
   honest uncertainty. Never overclaim — the audit greps for the exact
   forbidden vocabulary and fails the build.
7. **Sensitivity.** Difficult history is flagged, tonally separated, never the
   opening item, never share content, never grouped with light material.
8. **Accessibility.** Works from 320 px with no horizontal scroll, 44 px touch
   targets, visible focus, keyboard operable, `prefers-reduced-motion`
   honoured, WCAG AA contrast, 200 % zoom reflow, text alternatives for the
   map/sky/canvas surfaces.
9. **Design system.** Semantic tokens in `src/styles.css`, rules in
   `dontwannaknow/DESIGN.md`. No random gradients, glass cards, glows, sepia,
   national flags as identity, or decorative "AI shine".

## How facts get selected — read this before touching data

Selection runs on scored editorial relevance, and the rubric lives in code, not
in prose. **Do not invent your own scoring scheme and do not copy the rubric
into a prompt from memory.** Print the exact prompt:

```bash
cd dontwannaknow
npm run relevance:prompt -- --versions
npm run relevance:prompt -- A
```

The full contract — axes, gates, record keys, the pipeline, and the checklist
for adding a dataset — is [`docs/fact-scoring.md`](docs/fact-scoring.md). The
one rule to carry in your head: **deterministic gates always outrank scores**,
because there is no human review queue between a bad score and a reader.

## Commands

Run from `dontwannaknow/`. Node 22 is required (`nvm use 22`); on Node 20 the
test runner fails to load.

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run audit:content     # editorial, privacy, scope, scoring and citation gates
npm run build
npm run check             # all of the above, in order — must pass
```

Run `npm run data:public` only when generator inputs or logic changed, then
inspect the generated diff.

## Working rules

- Search before creating. Extend existing components, utilities, types, tokens
  and scripts before adding a parallel system.
- Anything that renders pixels — canvas, WebGL, generated SVG, share images,
  layout — is not reviewable by reading the diff. Run the app and look at it.
- Validate mobile widths, long Czech strings, error/missing/loading/success
  states, keyboard use, visible focus, reduced motion, 200 % zoom and contrast.
- Commit messages are Czech, matching the existing history. Make coherent
  incremental commits; merge to `main` when the work is done and green.
- A change is finished only when `npm run check` passes, exports and public
  flows stay private and deterministic, documentation matches the
  implementation, and the Git scope is intentional.

## Further reading

| Document | What it covers |
|---|---|
| [`docs/fact-scoring.md`](docs/fact-scoring.md) | Scoring contract, gates, pipeline, adding datasets |
| [`dontwannaknow/DESIGN.md`](dontwannaknow/DESIGN.md) | Visual system, layout rules, responsive thresholds |
| [`DOCS.md`](DOCS.md) | Architecture, report pipeline, privacy, performance |
| [`README.md`](README.md) | Product overview and stack |
| [`docs/generated-media.md`](docs/generated-media.md) | Rules for decorative generated assets |
| [`NEEDED.md`](NEEDED.md) | Open tasks, marked by owner |

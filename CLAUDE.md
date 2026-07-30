# Tehdejší svět project control

Tehdejší svět is a Czech-only, person-centric publication that reconstructs the environment in which someone grew up. The main question is **„Čí svět chcete poznat?“** Its core audience is people seeking context for parents, grandparents, partners, friends, themselves, and Czech-Ukrainian family relationships.

**Shared contract:** every assistant in this repo — Claude, Codex, Cursor, Copilot — follows the same rules, kept in [`AGENTS.md`](AGENTS.md). This file adds Claude-specific workflow (skills, agents, commands) on top; it never contradicts `AGENTS.md`. Fact selection is governed by [`docs/fact-scoring.md`](docs/fact-scoring.md): never invent a scoring rubric, print the real one with `npm run relevance:prompt -- A`, and remember that deterministic gates always outrank scores.

## Non-negotiable product contract

- Public scope is Czechia and Ukraine only (`CZ`, `UA`). Preserve archived non-public data, but never ship it in public runtime bundles.
- The report is not a biography. Never invent private experience, memories, routine, preferences, family circumstances, facts, quotes, sources, or historical evidence.
- Keep the application deterministic, client-side, static-hosting friendly, and free of runtime AI, accounts, report storage, or external runtime historical APIs.
- Form values stay in the browser. Never send name, date/year, country, city, relationship, variant, fragments, facts, or chapter content to analytics.
- Names remain out of share fragments by default and are included only after explicit consent.
- Use formal Czech `vy / vás / vaše`, sentence case, concrete language, and honest uncertainty.

## Architecture to preserve

The application is in `dontwannaknow/`. Reuse the existing pipeline:

`src/lib/person.ts` → `src/lib/historicalLocation.ts` → `src/lib/facts.ts` → editorial metadata → `src/lib/report.ts` → report, comparison, sharing, canvas images, and PDF.

Keep the public app and `/dev` lazy surfaces separate. `/dev` writes only through Vite development middleware; production is read-only/export based and is not authenticated administration. Keep PDF and heavy features lazy. Keep real astronomy, maps, art data, source registry, public-data generation, sensitivity rules, share-safe selection, and duplicate protections.

`cityImages` is a separate curated evidence layer. It may show only an exact
city/decade match from the fixed public scope with an allowed licence, visible
attribution and same-origin lazy asset; otherwise it falls back to real art.
Excluded images never enter the public layer. City photographs do not enter
share images or PDF. Curated records, Czech alts, captions and exclusions are
edited through the existing `/dev` source `cityImagesSelection`; regenerate
both city-image derivatives and public data after saving. The full contract is
[`docs/data-city-images.md`](docs/data-city-images.md).

## Working rules

Search before creating. Extend or generalize existing components, utilities, types, styles, skills, agents, and commands before adding another system. Use semantic tokens from `dontwannaknow/src/styles.css`; follow `dontwannaknow/DESIGN.md`. Preserve authentic UI, data, maps, and stars. Generated media may be decorative only and never evidence or fake UI. Before producing a missing media slot, read `docs/generated-media.md` and search current official pricing, licensing, privacy, watermark, and export limits for cheap or free generators. Prefer the least expensive safe option; never add a placeholder, purchase a plan, create an account, or submit personal data without the required authority.

Validate mobile widths, long Czech strings, error/missing/loading/success states, keyboard use, visible focus, reduced motion, 200% zoom/reflow, WCAG AA contrast, and accessible map/sky/canvas summaries. For large autonomous work, make coherent incremental commits and continue automatically after each commit.

## Fact scoring

Records are ranked by six independent, build-time relevance axes committed as JSON in `dontwannaknow/src/data/relevance/`, with per-record citations in `src/data/provenance/`. The rubric lives in `scripts/relevance/prompts.mjs` and must never be restated from memory. `npm run audit:content` fails the build on malformed scores, orphaned keys, incomplete coverage, and on any new public dataset that skips scoring without a declared reason. Full contract and the add-a-dataset checklist: [`docs/fact-scoring.md`](docs/fact-scoring.md).

## Essential paths

- Product UI: `dontwannaknow/src/components/`
- Product and export logic: `dontwannaknow/src/lib/`
- Copy and styles: `dontwannaknow/src/copy.ts`, `dontwannaknow/src/styles.css`
- Public data and editorial rules: `dontwannaknow/src/data/public/`, `editorialRules.json`, `dataSources.json`
- Development editor: `dontwannaknow/src/dev/`
- Generators and audits: `dontwannaknow/scripts/`
- Product/design audit: `docs/experience-overhaul.md`
- Generated-media contract: `docs/generated-media.md`
- Build-time names, slang, and broadcast milestones: `docs/data-formative-reserve.md`
- Build-time city photographs: `docs/data-city-images.md`
- Completed overhaul handoff: `docs/NEXT-AGENT-HANDOFF.md`
- Next-phase brief (relevance scoring, sources, report modernization): `docs/fable-brief.md`
- Architecture and operations: `README.md`, `DOCS.md`, `scaling.md`, `NEEDED.md`

## Commands

Run from `dontwannaknow/` after inspecting `package.json`:

```sh
npm run dev
npm run typecheck
npm run lint
npm test
npm run audit:content
npm run data:city-images
npm run build
npm run check
```

Run `npm run data:public` only when generator inputs or logic changed, then inspect the generated diff. A change is done only when relevant checks actually pass, public and export flows remain private/deterministic, responsive and accessibility states were inspected, documentation matches implementation, and Git scope is intentional.

## Project skills, agents, and commands

Use the focused skills in `.claude/skills/`: `tehdejsi-svet-product`, `tehdejsi-svet-design-system`, `tehdejsi-svet-editorial-integrity`, `tehdejsi-svet-higgsfield`, and `tehdejsi-svet-release-validation`.

Use reviewer definitions in `.claude/agents/` only for their distinct scopes: experience/design, editorial/history, accessibility/visual QA, and Higgsfield art direction. Use the real workflows in `.claude/commands/`: `/tehdejsi-design-audit`, `/tehdejsi-new-screen`, `/tehdejsi-content-review`, `/tehdejsi-visual-qa`, and `/tehdejsi-release-check`.

`/audit-facts` is the separate read-only workflow for sampled web verification of source datasets; it reports findings and never edits historical data automatically.


## Shared skills

Four skills in `.claude/skills/` are vendored verbatim from upstream and kept
identical across every repository. Each carries an `UPSTREAM.md` with its
source, pinned commit, and license — re-vendor rather than hand-editing them.

- **`task-observer`** — invoke at the **start of every task-oriented session**,
  before producing deliverables. It records corrections and workflow friction in
  an observation log so they can become skill improvements later. Its log lives
  outside the repo; `.claude/observations/` is git-ignored.
- **`stop-slop`** — apply to every piece of prose that ships: documentation,
  `NEEDED.md` entries, UI copy, commit bodies, and pull-request descriptions.
- **`ui-ux-pro-max`** — consult before visual or interaction decisions. Query
  the bundled database with
  `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>`
  (domains: `ux`, `style`, `color`, `typography`, `product`, `chart`, `gsap`).
  It is generic advice. **This repository's own design contract always wins**
  where the two disagree — never let a generic recommendation override a
  documented product invariant.
- **`find-skills`** — use when a capability might already exist as an
  installable skill instead of hand-rolling one. Its `npx skills` commands need
  network access; fall back to working directly when that is unavailable.

## Session routine & markdown conventions

This repo follows a shared markdown contract (see the `session-start`,
`session-end`, and `markdown-checkup` skills under `.claude/skills/`):

- **`NEEDED.md`** — owner/agent action items. Each task:
  `- [ ] **Title** — desc. [imp:1-5] [owner:me|ai] [time:30m] [kind:K]`, where
  `[kind:K]` is one of `setup` `deploy` `legal` `content` `decision`.
- **`about-project.md`** — project summary + the tech stack.
- **`scaling.md`** — cost & scaling only (renamed from `stack-and-scaling.md`).
- **`monetization.md`** — how the project could earn (options table).

At session start, check `NEEDED.md` for `[owner:ai]` tasks that can now be done;
at session end, update `NEEDED.md` (finished + newly-needed owner items).

## Git workflow (every session)

- **Commit frequently** in small, coherent steps — never batch a whole session into one commit.
- **At the end of every session, push and merge to `main`** so the change redeploys immediately (this project auto-deploys from `main` on Vercel).
- **Delete the merged / old branch** (local and remote) after merging, to keep the repo clean. Never leave stale branches behind.

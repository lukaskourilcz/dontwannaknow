# Tehdejší svět project control

Tehdejší svět is a Czech-only, person-centric publication that reconstructs the environment in which someone grew up. The main question is **„Čí svět chcete poznat?“** Its core audience is people seeking context for parents, grandparents, partners, friends, themselves, and Czech-Ukrainian family relationships.

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

## Working rules

Search before creating. Extend or generalize existing components, utilities, types, styles, skills, agents, and commands before adding another system. Use semantic tokens from `dontwannaknow/src/styles.css`; follow `dontwannaknow/DESIGN.md`. Preserve authentic UI, data, maps, and stars. Generated media may be decorative only and never evidence or fake UI. Before producing a missing media slot, read `docs/generated-media.md` and search current official pricing, licensing, privacy, watermark, and export limits for cheap or free generators. Prefer the least expensive safe option; never add a placeholder, purchase a plan, create an account, or submit personal data without the required authority.

Validate mobile widths, long Czech strings, error/missing/loading/success states, keyboard use, visible focus, reduced motion, 200% zoom/reflow, WCAG AA contrast, and accessible map/sky/canvas summaries. For large autonomous work, make coherent incremental commits and continue automatically after each commit.

## Essential paths

- Product UI: `dontwannaknow/src/components/`
- Product and export logic: `dontwannaknow/src/lib/`
- Copy and styles: `dontwannaknow/src/copy.ts`, `dontwannaknow/src/styles.css`
- Public data and editorial rules: `dontwannaknow/src/data/public/`, `editorialRules.json`, `dataSources.json`
- Development editor: `dontwannaknow/src/dev/`
- Generators and audits: `dontwannaknow/scripts/`
- Product/design audit: `docs/experience-overhaul.md`
- Generated-media contract: `docs/generated-media.md`
- Completed overhaul handoff: `docs/NEXT-AGENT-HANDOFF.md`
- Architecture and operations: `README.md`, `DOCS.md`, `stack-and-scaling.md`, `NEEDED.md`

## Commands

Run from `dontwannaknow/` after inspecting `package.json`:

```sh
npm run dev
npm run typecheck
npm run lint
npm test
npm run audit:content
npm run build
npm run check
```

Run `npm run data:public` only when generator inputs or logic changed, then inspect the generated diff. A change is done only when relevant checks actually pass, public and export flows remain private/deterministic, responsive and accessibility states were inspected, documentation matches implementation, and Git scope is intentional.

## Project skills, agents, and commands

Use the focused skills in `.claude/skills/`: `tehdejsi-svet-product`, `tehdejsi-svet-design-system`, `tehdejsi-svet-editorial-integrity`, `tehdejsi-svet-higgsfield`, and `tehdejsi-svet-release-validation`.

Use reviewer definitions in `.claude/agents/` only for their distinct scopes: experience/design, editorial/history, accessibility/visual QA, and Higgsfield art direction. Use the real workflows in `.claude/commands/`: `/tehdejsi-design-audit`, `/tehdejsi-new-screen`, `/tehdejsi-content-review`, `/tehdejsi-visual-qa`, and `/tehdejsi-release-check`.

`/audit-facts` is the separate read-only workflow for sampled web verification of source datasets; it reports findings and never edits historical data automatically.


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

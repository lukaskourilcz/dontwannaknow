---
name: tehdejsi-svet-release-validation
description: Validate a Tehdejší svět implementation or release across code quality, content integrity, privacy, public scope, exports, accessibility, responsive layouts, visual quality, assets, documentation, and Git state. Use before commits for major milestones and before final handoff.
---

# Tehdejší svět release validation

## Inspect actual scripts first

Read `dontwannaknow/package.json` and do not invent commands. Run from `dontwannaknow/`. For a full release, run the authoritative aggregate and dependency audit:

```sh
npm run check
npm audit --audit-level=moderate
```

If diagnosing failures, run `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run audit:content`, and `npm run build` separately. Never report a pass unless that exact check completed successfully.

## Exercise critical flows

Validate a Czech and Ukrainian report; full date and year-only; a historical transition; same and different comparison contexts; deterministic alternate selection; shared-fragment restoration; name excluded by default and included only after consent; safe share selection; every share-image size; PDF; missing sky/data; `/dev` development writes and production read-only explanation.

Inspect 320, 375, 390, 768, 1024, 1280, and a wide desktop. Check overflow, long Czech and historical names, keyboard order, focus, labels, errors, disclosures, status announcements, landmarks, contrast, non-color states, touch targets, accessible map/sky/canvas summaries, 200% zoom, landscape, and reduced motion.

## Inspect release integrity

- Inspect production chunks; keep PDF, share generation, public data, art, sky, and `/dev` lazy where practical.
- Search for old branding, public unsupported countries, placeholders, obvious `any` bypasses, unused generated assets, personal analytics parameters, stale documentation, and duplicate competing primitives.
- Validate authentic product UI and confirm generated decoration is neither evidence nor fake UI.
- Run `git diff --check`, review staged scope, and preserve unrelated user changes.
- Use coherent incremental commits. Continue after each commit when autonomous completion was requested.
- Finish with `git status --short`, a commit list, exact validation outcomes, and only unavoidable limitations.

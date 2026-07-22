---
name: tehdejsi-svet-editorial-integrity
description: Review or change Czech historical content, editorial metadata, source confidence, sensitivity, sharing safety, country relevance, and uncertainty language. Use for data, report composition, copy, source registry, content audit, or historical resolver work.
---

# Tehdejší svět editorial integrity

## Establish evidence

Read `CLAUDE.md`, `dontwannaknow/src/data/editorialRules.json`, `dontwannaknow/src/data/dataSources.json`, and the data or composer code in scope. Separate repository evidence, sourced historical fact, editorial inference, and assumption.

Never fabricate facts, quotes, sources, statistics, headlines, documents, photographs, memories, routines, preferences, or biography. Do not fill missing periods with plausible material.

## Apply the editorial model

- Keep political-state resolution separate from cultural and local relevance.
- Preserve historical boundary tests and CZ/UA public scope.
- Preserve editorial metadata for country, city, life stage, tone, sensitivity, confidence, share safety, and historical entity.
- Keep war, occupation, repression, famine, disease, mortality, Crimea, and other difficult material in the deliberately secondary wider-context chapter.
- Never select difficult content as the default share item.
- Keep life-in-numbers reflective and elapsed-time based; never add life-expectancy countdowns, remaining meetings, or novelty physiology.

Use formal Czech address consistently: `vy`, `vás`, `vaše`. Prefer concrete verbs, sentence case, honest uncertainty, and language such as `mohl se setkávat s`, `v této době bylo běžné`, or `lidé stejné generace často`. Remove false personal certainty, forced nostalgia, superlatives, and generic AI marketing language.

## Validate content changes

Run from `dontwannaknow/`:

```sh
npm run audit:content
npm test
```

Also run `npm run data:public` when public generation inputs or generator logic change, inspect the generated diff, and preserve valuable non-public archives. Use `$tehdejsi-svet-release-validation` before completion.

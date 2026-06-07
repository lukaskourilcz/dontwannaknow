---
description: Web-audit a sample of the historical-facts datasets for accuracy and surface errors / suggestions.
---

You're auditing the historical-facts datasets in this repo. Files to inspect:

- `dontwannaknow/src/data/countryEvents.ts`
- `dontwannaknow/src/data/cities.ts`
- `dontwannaknow/src/data/monthlyEvents.ts`
- `dontwannaknow/src/data/notableDeaths.ts`
- `dontwannaknow/src/data/culturalWorks.ts`
- `dontwannaknow/src/data/famousBirths.ts`

## What to do

1. Read the file(s) the user asked about. If they didn't specify a file, pick the largest dataset that hasn't been audited recently (start with `countryEvents.ts`).
2. Sample roughly 40–60 entries spread across the file (different countries, different decades).
3. For each sampled entry, use **WebSearch** and **WebFetch** (Wikipedia is fine; reputable news/encyclopedia sites also fine) to verify:
   - The year is correct (off-by-one is wrong)
   - The fact actually happened
   - The description isn't misleading
4. While you're in the file, scan for **duplicate entries** (same country + same year + same event) and **factual contradictions** (e.g. "Crimea hosted the Olympic sailing in Tallinn" is internally inconsistent — Tallinn isn't in Crimea).
5. Also keep an eye out for **clearly important events missing** from the relevant year range and suggest a couple of additions.

## Output format

Produce a single audit report — **don't edit the source file**. The user (or follow-up agent) will apply the corrections after reviewing.

```
VERDICT
=======
CORRECT: <count>
QUESTIONABLE: <count>
WRONG: <count>
DUPLICATES FOUND: <count>

WRONG ENTRIES (need fixing):
- LINE <linenum>: <existing entry>
  PROBLEM: <one sentence>
  SUGGESTED FIX: <new entry>

QUESTIONABLE ENTRIES (could be improved):
- LINE <linenum>: <existing entry>
  CONCERN: <one sentence>

DUPLICATES:
- LINES <a> and <b>: <both entries>

SUGGESTED ADDITIONS:
- <new entry>
  SOURCE: <url>
```

## Constraints

- **Budget yourself**: up to ~25 web searches. Stop cleanly when you run out and report what you have.
- **Don't edit files** — just produce the report. The user reviews and applies.
- Don't reformat the report; the structure above is what tools downstream may parse.
- If the user passes a specific file name as an argument to `/audit-facts`, focus on that file instead of the default.

## Tone

Terse, factual. No preamble, no congratulations. Hit the report fields, link sources where helpful, end.

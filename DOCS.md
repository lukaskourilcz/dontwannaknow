# dontwannaknow — full documentation

Generational-history web app. Enter a birth date and a place, and the
site reconstructs the world that person lived through — events, faces,
prices, the night sky on the day they were born, what kids said on the
playground that decade. Everything runs in the browser; nothing is
sent anywhere.

The site is Czech-first with an English toggle. It was originally a
"how many times will I see my parents again" calculator
(`dontwannaknow`) — the name stuck even as it grew into a much wider
generational portrait.

Public branch: [`claude/generational-facts-website-OHxvF`](https://github.com/lukaskourilcz/dontwannaknow/tree/claude/generational-facts-website-OHxvF)

---

## Table of contents

1. [What the app does](#what-the-app-does)
2. [Feature tour](#feature-tour)
3. [Privacy and what gets sent where](#privacy-and-what-gets-sent-where)
4. [Tech stack](#tech-stack)
5. [Project layout](#project-layout)
6. [The data model](#the-data-model)
7. [The report pipeline](#the-report-pipeline)
8. [Running locally](#running-locally)
9. [Building and deploying](#building-and-deploying)
10. [Extending the dataset](#extending-the-dataset)
11. [The `/audit-facts` slash command](#the-audit-facts-slash-command)
12. [Accessibility, motion, and print](#accessibility-motion-and-print)
13. [Known limitations](#known-limitations)
14. [Credits and data sources](#credits-and-data-sources)

---

## What the app does

You enter at minimum:

- **A name or label** (you, mum, grandpa, anyone)
- **A birth year** — or a fuller date (`1953`, `1953-04-12`, `12/04/1953`, `04/1953` all work)
- **A country** (Czechia / Spain / USA / Ukraine / Canada / Mexico, or "Anywhere" for global-only)
- *Optionally:* a city (filtered by country), and how often you see that person each year

You can add **multiple people**. When you submit, the site produces
a long, magazine-style report per person plus an optional
side-by-side comparison when two or more people are entered.

Each report contains:

- **Hero stats** — date of birth, days on earth, generation cohort,
  years left vs. country life-expectancy, optionally meetings remaining
- **Life-in-years grid** — one square per year, filled vs. outlined
  (modelled on Tim Urban's *Your Life in Weeks* essay)
- **Night-sky chart** — the actual sky over the birthplace at ~23:00
  local time on the birth date, computed in-browser from real
  ephemerides with stars, planets, the Moon and constellation lines
- **World map** — modern country borders with vanished states
  (USSR, Yugoslavia, Czechoslovakia…) shaded for the birth year
- **Newspaper front page** — a vintage-broadsheet mockup with the
  year's biggest headline pulled from the city/country/world datasets
- **Essay paragraphs** — about 20 short prose blocks covering: who
  was in charge, what people wore / read / sang / fell ill from,
  bizarre facts, beautiful facts, who died and who was born, names
  on the school register, slang on the playground, the cosmic events
  visible in their lifetime, extinct species that were still alive
  when they were born, schooling and the most common jobs, prices
  and wages, plus a final time-capsule prompt
- **Facts view (toggle)** — the same raw facts grouped by category if
  you want the data without the prose
- **PDF download** — guaranteed two-page A4 booklet with the sky chart
  embedded as PNG, plus a fact appendix
- **Shareable link** — base64-encoded form state in a URL hash
- **Shuffle** — re-roll the random subset of facts without re-entering

---

## Feature tour

### Wizard (Typeform-style)

One question per screen, large serif typography, full focus on the
answer. Press **Enter** to advance. Optional fields show an
underlined `skip` link. Country cards auto-advance ~120 ms after
selection. Thin progress bar at the top, **Back** in the top-left.

### Czech / English toggle

Top-right corner. Default language is Czech (per project spec);
selection persists in `localStorage`. UI chrome is fully translated.
Fact body content remains English — translating the ~10,000 fact
strings is a separate effort; a small italic note in Czech mode
explains this.

### Sticky toolbar

Once the report is rendered the results header (with **Essay / Facts**
toggle, **Shuffle**, **Share**, **Start over**) sticks to the
viewport top with a warm backdrop-blur. Always reachable while
scrolling through long reports.

### Hero summary

Right under each person's name, a responsive grid of stat cards. Big
numbers animate up from zero (ease-out cubic over ~950 ms,
locale-formatted thousands separators). The "meetings left" card uses
an accent gradient to draw the eye. If the person is past life
expectancy, the cards switch to *"+X bonus years"* and a softer
message.

### Vintage newspaper

Composes a serif "front page" mock from existing facts data — top
headline from the year's biggest city/country event, two italic
subheads under it, then a two-column *In the wider world / What
things cost* footer. Auto-generated, no external dependencies.

### Local sky chart

Real astronomy. The `astronomy-engine` library computes the alt/az
positions of the Sun, Moon, five visible planets, and 31 brightest
stars (plus the Big Dipper and Orion connection lines) for the
specified time and location, projected stereographically onto a
320 × 320 disc.

### Multi-person comparison

When two or more people are submitted, a `pairReport` builds a side-
by-side comparison paragraph: who's the elder, what overlapping
years they shared, what world events they both lived through.

### PDF export

Lazy-loaded `jsPDF`. Captures the live sky-chart SVG → blob URL →
`<img>` → canvas → PNG → embeds in PDF. Renders title, sky image,
all essay paragraphs with page-wrapping, then a fact appendix to
guarantee at least two pages. Page footer on every page with person
name, year, page number.

### Shareable URLs

The list of people is JSON-stringified (compact one-letter keys),
base64url-encoded, and dropped into the URL hash as `#d=…`. On page
load the app reads the hash and restores the report. The "⇪ Share"
button copies the link to the clipboard.

### `/audit-facts` slash command

Runs a verification subagent that samples 40–60 entries, web-checks
them against Wikipedia and similar, and produces a structured audit
report listing wrong years / questionable claims / duplicates /
suggested additions. Optional: `/audit-facts cities.ts` to target a
specific file.

### Error boundary

Wraps the whole app. Any render-time crash anywhere shows a friendly
recovery card with **Try again** (soft reset) and **Start over**
(hard reload + clear hash) instead of a blank page.

### Print

`@media print` rules strip backgrounds and shadows, hide all
interactive controls, prevent page-breaks inside cards / hero summary
/ essay paragraphs, and add a footer with site name + page number.
Cmd+P / Ctrl+P produces a clean printable page.

---

## Privacy and what gets sent where

**Nothing leaves the browser.** No API calls, no analytics, no
cookies, no fingerprinting, and no third-party requests at all — the
Warm Editorial typefaces (Fraunces, Newsreader, Instrument Sans) are
self-hosted and bundled via Fontsource, so not even the fonts phone home.

Specifically:
- The report is generated entirely client-side from local data files
- The sky chart is computed by `astronomy-engine` in the browser
- The PDF is generated by `jsPDF` in the browser
- The share URL contains the form state, not a server-side ID
- The `/audit-facts` slash command runs in your Claude Code session,
  not at runtime in the deployed app

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript 5.8 (strict) | Type safety on a large dataset |
| Framework | React 19 | Familiar, ecosystem |
| Bundler | Vite 7 | Fast HMR + minimal config |
| Astronomy | `astronomy-engine` 2.1 | MIT-licensed, sub-arc-second accuracy back to ~1700 |
| PDF | `jsPDF` 4.2 | Pure JS, no server roundtrip |
| Linter | ESLint 9 + typescript-eslint 8 | Catch common React/TS pitfalls |
| Hosting | Vercel | Zero-config static deploy |
| CSS | Hand-written design tokens (Warm Editorial) | A small token set drives the whole skin — paper-and-clay palette, dark mode, Fraunces/Newsreader/Instrument Sans |
| Fonts | Fraunces / Newsreader / Instrument Sans via Fontsource | Self-hosted variable fonts; no third-party requests |

### Bundle composition (production)

| Chunk | Raw | Gzipped | Loaded when |
|---|---:|---:|---|
| `index.[hash].js` (main + data) | 839 kB | 275 kB | Page load |
| `Results.[hash].js` | 201 kB | 79 kB | After form submission |
| `jspdf.es.min.[hash].js` | 390 kB | 129 kB | When "↓ PDF" clicked |
| `html2canvas.esm.[hash].js` | 202 kB | 48 kB | With jsPDF |
| `purify.es.[hash].js` | 24 kB | 9 kB | With jsPDF |
| `index.[hash].css` | 19 kB | 5 kB | Page load |

Total initial: ~858 kB / ~280 kB gzipped.

---

## Project layout

```
.
├── .claude/
│   └── commands/
│       └── audit-facts.md          # Manual slash command for fact verification
├── dontwannaknow/                  # The actual Vite project (subfolder)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── TypeformWizard.tsx  # Multi-step form
│   │   │   ├── Results.tsx         # Result page (lazy-loaded)
│   │   │   ├── HeroSummary.tsx     # Big stat cards
│   │   │   ├── LifeGrid.tsx        # Life-in-weeks SVG
│   │   │   ├── SkyMap.tsx          # Star chart SVG
│   │   │   ├── WorldMap.tsx        # World map SVG with vanished countries
│   │   │   ├── Newspaper.tsx       # Vintage front-page mock
│   │   │   └── ErrorBoundary.tsx
│   │   ├── data/                   # Historical datasets (.ts types/selectors + .json records)
│   │   ├── lib/
│   │   │   ├── facts.ts            # Top-level reportFor() generator
│   │   │   ├── essay.ts            # Builds the essay paragraphs
│   │   │   ├── pair.ts             # Two-person comparison essay
│   │   │   ├── pdf.ts              # Lazy-loaded PDF generator
│   │   │   ├── share.ts            # URL-hash encode/decode
│   │   │   ├── money.ts            # USD → CZK/UAH formatting
│   │   │   ├── random.ts           # shuffle / pickN / pickOne
│   │   │   ├── text.ts             # capitalize / joinList
│   │   │   ├── czech.ts            # Czech grammar (plurals, age phrases)
│   │   │   ├── datetime.ts         # Current year + birth-date / elapsed-time helpers
│   │   │   ├── useCountUp.ts       # Count-up animation hook
│   │   │   ├── useCopied.ts        # Clipboard "copied!" feedback hook
│   │   │   └── useAutoFocus.ts     # Focus-on-change hook
│   │   ├── i18n/
│   │   │   ├── translations.ts     # Czech + English UI strings
│   │   │   ├── LangContext.tsx     # Provider
│   │   │   └── useLang.ts          # Hook
│   │   ├── config/
│   │   │   ├── settings.ts         # Editable game settings (defaults + schema)
│   │   │   └── gameSettings.json   # Saved setting overrides (edited from /dev)
│   │   ├── dev/                    # Password-gated /dev console
│   │   │   ├── DevApp.tsx          # Shell: password gate + Content/Settings tabs
│   │   │   ├── ContentEditor.tsx   # Browse / search / add / edit / remove content
│   │   │   ├── SettingsEditor.tsx  # Edit game settings
│   │   │   ├── contentSources.ts   # Which datasets are editable + their schema
│   │   │   ├── contentApi.ts       # Reads/writes the JSON via the dev-server API
│   │   │   └── devAuth.ts          # Password gate
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css              # All CSS — design tokens at the top
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
├── DOCS.md                         # This file
└── README.md
```

---

## Dev console (`/dev`)

A password-gated admin surface for editing the game's content and settings,
kept entirely separate from the public app (it's lazy-loaded only when the path
starts with `/dev`). Open `http://localhost:5173/dev` and enter the password
(`autobus`).

**Content tab** — every editable dataset is loaded into one searchable list,
tagged by category (Countries, Cities, Years, Culture, Sports) and by derived
tags (country code, decade, etc.). Search across everything, filter by category
or dataset, and add / edit / delete entries. Which datasets appear and their
edit fields are declared in `src/dev/contentSources.ts`.

**Settings tab** (`/dev/settings`) — edits the values in `src/config/
gameSettings.json`, which the game merges over `DEFAULT_SETTINGS`: currency
rates, default language, max people to compare, the country picker order,
animation timings, the sky-chart hour, the writers grace window, and more.
Fields are declared in `SETTINGS_SCHEMA` in `src/config/settings.ts`.

### How it syncs ("the JSONs")

The editable datasets live as JSON next to their `.ts` modules (e.g.
`src/data/events.json`, imported by `src/data/events.ts`). A dev-only Vite
middleware in `vite.config.ts` exposes `GET`/`POST /__content/<key>`; during
`npm run dev` the editor reads and writes those JSON files **directly on disk**,
so edits land in the repo and the game picks them up on the next reload. Commit
the changed JSON to keep it.

The per-decade datasets that used to be nested TypeScript literals
(`countryDecades`, `famousPeople`, `media`, `slang`, `babyNames`, `culture`)
are stored **flat — one fact per row** (`{ country, decadeStart, bucket, text }`
and friends), so each individual line is its own searchable, editable, deletable
entry in the console. Their `.ts` wrappers reassemble the grouped shape the app
consumes via the helpers in `src/data/_grouped.ts`; `education` and `writers`
are edited at the record level (list fields one-per-line, nested `works`/`homes`
as raw JSON). The one-shot migration that produced the JSON is preserved in
`scripts/migrateFacts.ts`, and it asserts every dataset round-trips exactly.

In a production build the write endpoint doesn't exist, so the editor falls back
to read-only (JSON bundled at build time) and "Save" downloads the updated file
for you to drop into the repo.

> The password is a client-side convenience gate, not real security — it ships
> in the bundle. Don't put anything sensitive behind it.

---

## The data model

All datasets live in `dontwannaknow/src/data/` as TypeScript modules.
About 8,600 lines total. Every dataset exports a typed `const` plus a
small set of selector functions used by the essay builder.

| File | Records | What it holds |
|---|---:|---|
| `countryDecades.ts` | 36 | Per-country per-decade snapshot of government, clothes, illnesses, daily life, food, money, bizarre/beautiful highlights |
| `countryEvents.ts` | ~370 | Year-anchored events per country (CZ, ES, US, UA, CA, MX) |
| `presidents.ts` | ~90 | Heads of state per country (CZ/US/MX presidents, ES kings & Franco, UA Soviet leaders & presidents, CA prime ministers) with terms — powers the "who was in charge the year you were born" line |
| `cities.ts` | 120 cities + ~1,700 facts | City list with display names + akas, plus year-anchored hometown facts |
| `cityCoords.ts` | 120 | Lat/lon for every city (for sky chart) |
| `famousPeople.ts` | ~250 | Famous figures active per country per decade |
| `famousBirths.ts` | ~290 | Famous people indexed by exact birth year |
| `notableDeaths.ts` | ~390 | Famous deaths year by year |
| `monthlyEvents.ts` | ~310 | World events anchored to a specific month, 1938 onward |
| `culturalWorks.ts` | ~290 | Songs, books, paintings, sculptures, plays anchored to release year |
| `events.ts` | ~50 | Global headline events (the "world" layer) |
| `inventions.ts` | ~40 | When ordinary things first existed (sliced bread 1928, etc.) |
| `extinctions.ts` | 16 | Species that went extinct in living memory |
| `cosmicEvents.ts` | ~30 | Eclipses, comets, supernovae visible from Earth |
| `slang.ts` | 7 decades | Decade-specific slang and catchphrases |
| `babyNames.ts` | 36 | Top-5 baby names per decade per country |
| `education.ts` | 42 | School length, attainment, common jobs, subjects per decade per country |
| `notableDeaths.ts` | ~390 | Famous deaths year by year |
| `countries.ts` | 14 | Vanished states (USSR, Czechoslovakia, etc.) with year ranges |
| `worldPaths.ts` | 177 | Country SVG paths in equirectangular projection |
| `stars.ts` | 31 | Brightest stars with J2000 RA/Dec/magnitudes |
| `stats.ts` | per-decade | World population, US wages, bread/gas prices |
| `culture.ts` | per-decade | Top songs, films, books, fashion summaries |
| `generations.ts` | 8 | Generation cohort labels (Lost / Greatest / Silent / Boomer / Gen X / etc.) |
| `lifeExpectancy.ts` | 6 | Per-country current life expectancy |
| `zodiac.ts` | 12 | Western tropical sun signs |

### Cities

120 cities total: top-50 in Czechia, top-20 each in Ukraine, Spain,
the US, Canada and Mexico. Every city has a `slug` (for URL safety),
display name, optional `aka` for historical/local names (Gablonz,
Lemberg, Zhdanov), the parent country code, and latitude/longitude.

City facts are year-anchored — `{ city: 'prague', year: 1942, text:
'...' }`. The generator filters by `city === slug && year >=
birthYear`.

### Countries supported

`type Country = "CZ" | "ES" | "US" | "UA" | "CA" | "MX" | "INTL"`.
`INTL` ("Anywhere") falls back to global-only data; the others get
their country-specific decade snapshots, year-events, baby names,
education snapshots, and cities.

---

## The report pipeline

When the user submits the form:

```
TypeformWizard.onSubmit(people: Person[])
  ↓
App.handleSubmit
  ↓ for each person:
reportFor(person) → PersonReport       ← src/lib/facts.ts
  ↓ internally calls:
  buildEssay(person)                   ← src/lib/essay.ts
  countryFacts(person)
  cityFactsFor(slug, year)
  goneCountriesAlive(year)
  inventionsBornBefore(year)
  ... etc.
  ↓
<Results reports={…} people={…} />     (lazy-loaded)
  ↓ for each report:
HeroSummary, LifeGrid, SkyMap, WorldMap,
Newspaper, essay paragraphs, facts list
```

`reportFor` is deterministic given (person, current shuffle seed).
The "Shuffle" button re-runs `reportFor` and re-randomises the small
subset that gets surfaced.

### How the essay is built

`buildEssay` returns an array of `{ heading, text }` paragraphs.
Roughly:

1. Generation badge (with zodiac sign if a date is given)
2. Names everyone shared at roll-call
3. School, work, and what you'd study (from `education.ts`)
4. **Opening**: where they were born, world population, bread / gas
   prices, vanished countries, things that didn't exist yet
5. **Life stage paragraphs** (childhood → twenties → middle years →
   later) — each stitches together city, country and world events
   that happened in that age range, with bridges like "the next year,"
   "by the time they were 27,"
6. **Bizarre / beautiful** facts (vanished countries, inventions,
   wage multiples)
7. **The month they arrived** (if a month was provided)
8. **Art and music being made the year they arrived**
9. **What they were reading, listening to, and looking at** during
   teens/twenties
10. **Slang they used as teenagers**
11. **Cosmic events** in their lifetime
12. **Who died the year they entered the world**
13. **Lives that ended while theirs ran**
14. **Animals that walked the earth with them** (extinction timeline)
15. **The texture of daily life** (clothes, food, illnesses, money)
16. **Famous people of the era**
17. **Famous birthday peers** (born ±1 year of them)
18. **Meetings remaining** (only if the visits/yr field was filled)
19. **What they grew up to** (songs, films, books, fashion)
20. **A question worth asking** — time-capsule closer

The essay generator picks a random subset from each bucket so re-runs
produce slightly different text. The full deterministic dataset is
available through the **Facts** view.

---

## Running locally

```bash
cd dontwannaknow
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Useful commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Type-check + production build to dist/
npm run preview   # Serve dist/ on localhost:4173
npm run lint      # ESLint
npx tsc --noEmit  # Standalone type-check
```

---

## Building and deploying

The project is a static Vite app — no server, no API key, no
environment variables. The included `dontwannaknow/vercel.json`
declares framework, build command, output directory and SPA-fallback
rewrites.

### One-time Vercel setup

1. Import the repo at https://vercel.com/new
2. **Root Directory**: `dontwannaknow` (the project lives in a
   subfolder)
3. Framework Preset: Vite (auto-detected)
4. Build Command: `npm run build` (default)
5. Output Directory: `dist` (default)
6. **No environment variables needed.**
7. Click Deploy. First build takes ~60 seconds.

That's it. Every push to the production branch triggers a redeploy.

### Other hosts

Any static host works. Just upload the contents of `dontwannaknow/
dist/` after `npm run build`. SPA routing requires a fallback rewrite
of all paths to `/index.html` (handled by `vercel.json` on Vercel;
for Netlify you'd add `/* /index.html 200` to `_redirects`).

---

## Extending the dataset

### Add a new country

1. Add the two-letter code to the `Country` union in
   `src/data/countryDecades.ts`.
2. Add the human-readable label to `COUNTRY_LABELS`.
3. Add the country to `COUNTRY_ORDER` in `TypeformWizard.tsx` so it
   appears in the country picker.
4. Add entries to the per-country datasets:
   - `countryDecades.ts` — at minimum the decades the person could be
     born in
   - `countryEvents.ts` — year-anchored events
   - `babyNames.ts` — top names per decade
   - `education.ts` — schooling snapshots
   - `lifeExpectancy.ts` — current life expectancy
   - `famousPeople.ts` — people active per decade
5. Optionally add cities:
   - `cities.ts` — add to `CITIES` list with country code
   - `cityCoords.ts` — add lat/lon for each
   - `cities.ts` — add city facts at the bottom of `CITY_FACTS`

### Add city facts

```ts
// In cities.ts, append to the CITY_FACTS array:
{ city: "prague", year: 1953, text: "currency reform on 1 June wiped out savings overnight at a 50-to-1 rate" },
```

The slug must match an existing entry in `CITIES`.

### Verify a fact

Run `/audit-facts` (or `/audit-facts cities.ts`) from a Claude Code
session in this repo. The verifier samples entries, web-checks them
against Wikipedia and similar, and produces a structured audit
report with line numbers and suggested fixes. **It does not edit
files** — you review and apply.

---

## The `/audit-facts` slash command

`.claude/commands/audit-facts.md` defines the prompt. When invoked it
spawns Claude to:

1. Read the target data file (default: `countryEvents.ts`).
2. Sample ~40–60 entries spread across the file.
3. Web-verify each using WebSearch and WebFetch.
4. Scan for duplicates and internal contradictions.
5. Suggest important missing facts.

Output is a structured report:

```
VERDICT
=======
CORRECT: 41
QUESTIONABLE: 5
WRONG: 4

WRONG ENTRIES (need fixing):
- LINE 76: { country: "ES", year: 1980, text: "the toxic-oil scandal began in May…" }
  PROBLEM: The colza-oil syndrome outbreak began May 1981, not 1980.
  SUGGESTED FIX: { country: "ES", year: 1981, text: "the toxic-oil (colza) scandal began in May and would kill over 600 people" }

DUPLICATES:
- LINES 126 and 307: both UA 1942 UPA founding

SUGGESTED ADDITIONS:
- { country: "CZ", year: 1989, text: "the Velvet Revolution toppled the Communist regime…" }
  SOURCE: https://en.wikipedia.org/wiki/Velvet_Revolution
```

The verifier is one-shot — no cron, no daemon. Re-run whenever you
want a fresh audit. The first run found four wrong entries and three
duplicates in the existing 250 records; all were applied in commit
`893bc36`.

---

## Accessibility, motion, and print

- All animations respect `prefers-reduced-motion: reduce`.
- The count-up animation falls back to a static value under reduced
  motion.
- All interactive controls have visible focus rings.
- Form inputs have explicit `aria-label`s and `<label>` text.
- The wizard supports keyboard navigation: Enter advances, click on
  country cards advances; visible skip links for optional fields.
- Print stylesheet strips chrome and adds a page footer with site
  name and page number; cards don't break across pages.
- The error boundary wraps the whole app — no white screens.
- Czech is the default `<html lang>` with English available via the
  top-right toggle.

---

## Known limitations

- **Essay body content is English only.** UI chrome is Czech-first
  with an English toggle, but the fact strings themselves (~10,000)
  are all in English. Translating them is a separate project.
- **The dataset focuses on 1920–2000-ish.** Earlier and later years
  have less coverage. The bulk of effort went into the 20th century
  because that's where most "parents and grandparents" land.
- **Most country coverage is for CZ, ES, US, UA.** Canada and Mexico
  exist as countries with city lists and decade snapshots but with
  shallower per-year event coverage than the main four.
- **Numbers are rounded historical estimates.** Per-decade prices,
  wages, education attainment, and life expectancy are sourced from
  UNESCO yearbooks, OECD historical series, national census archives
  and the like — but treated as orders of magnitude. The site says
  this in its disclaimer.
- **Sky chart accuracy is good for naked-eye purposes**, not
  surveying-grade. The 23:00-local-time choice is a default — if you
  wanted true sunset / midnight precision the wizard would need a
  time input.
- **PDF print quality** depends on the browser's SVG → canvas
  rendering. Sky chart looks fine in Chrome/Edge/Firefox; Safari
  occasionally rasterises with slight aliasing.

---

## Credits and data sources

Built with [Vite](https://vite.dev), [React](https://react.dev),
[astronomy-engine](https://github.com/cosinekitty/astronomy), and
[jsPDF](https://github.com/parallax/jsPDF).

Fonts: [Fraunces](https://github.com/undercasetype/Fraunces),
[Newsreader](https://github.com/productiontype/Newsreader),
[Instrument Sans](https://github.com/Instrument/instrument-sans),
self-hosted via [Fontsource](https://fontsource.org).

Historical data compiled from a wide mix of public reference sources,
including:

- Wikipedia (events, biographies, dates)
- UNESCO Statistical Yearbooks (literacy, education attainment)
- OECD historical series (wages, life expectancy)
- US Census Bureau (educational attainment, demographics)
- US Bureau of Labor Statistics (prices, wages)
- Soviet Goskomstat reprints (USSR economic data)
- Spanish INE históricas (education, economy)
- Czechoslovak Statistical Yearbooks
- StatCan, INEGI Mexico
- Natural Earth (country vector data)
- IUCN Red List, Smithsonian Institution (extinction timeline)
- Pew Research (generational labels)

Numbers are rounded; the site is a generational portrait, not a
statistical report. The on-page disclaimer says: *"Texture and
numbers are rounded historical averages from public datasets and
standard histories. Hit Shuffle to re-roll the mix."*

---

## Licensing

The code is the user's; the historical facts are sourced from public
references and are not original research. No external content
(images, music, video) is bundled or referenced at runtime.

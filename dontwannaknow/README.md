# Don't wanna know

A small site that asks for a birth year and tells you what the world was
doing then — bizarre, beautiful, and everyday details about the era your
parents or grandparents grew up in.

You enter a year (or full date) of birth, a **country**, and a **city**
for yourself, your mom, your grandpa, anyone. Country is one of:
**Czechia / Czechoslovakia**, **Spain**, **United States**, **Ukraine /
Ukrainian SSR**, or "Anywhere" (global facts only). City is filtered to
the top 20 cities of the chosen country.

The site responds with:

- **A world map** — modern country borders, with the territories that
  belonged to vanished states (USSR, Yugoslavia, Czechoslovakia, etc.)
  shaded and labelled for that birth year.
- **Bizarre** — things that didn't exist yet, countries that have since
  vanished from the map, "the average wage today is 30× what it was."
- **Beautiful** — the moments worth remembering: Apollo 11, Mandela
  walking free, the wall coming down.
- **Local events** — year-specific things that happened in the country
  they were born in.
- **Who was in charge** — government / regime at the time.
- **Famous faces of the era** — writers, politicians, actors, artists.
- **What people wore, ate, fell ill from, and paid for things** —
  decade-specific per country.
- **Daily life** — texture of growing up there and then.
- **Everyday life (global)** — bread, gas, wages, world population.
- **Growing up** — the songs, films, books, fashion of their teenage years.

Click **Shuffle facts** to re-roll a different mix from the same dataset.

There is **no AI or API call** — the entire report is generated in the
browser from curated datasets under `src/data/`. That keeps it free,
instant, deterministic, and offline-friendly.

## Stack

- React 19 + TypeScript
- Vite
- Plain CSS (no UI library)

All facts live in `src/data/` and the per-person fact generator is in
`src/lib/facts.ts`. Numbers are rounded historical averages — mostly
US/world figures sourced from public datasets (World Bank, US BLS, US
Census, CPI tables). Treat them as the right order of magnitude.

Country-specific data covers **1920–1980** for **CZ, ES, US, UA**:

- `src/data/countryDecades.ts` — per-decade snapshot per country across
  eight buckets (government, clothes, illnesses, daily life, food, money,
  bizarre, beautiful).
- `src/data/famousPeople.ts` — writers, politicians, actors, musicians,
  scientists active in each country during each decade, with one-line
  context.
- `src/data/countryEvents.ts` — year-specific events anchored to one
  particular year, so the report places them by age.

City-specific data covers the **top 20 cities** in each country
(80 cities total):

- `src/data/cities.ts` — city list + year-anchored hometown facts
  (founding of landmarks, wartime events, industrial milestones,
  famous-figure ties). The generator picks events that happened in the
  person's lifetime and labels each one with the person's age at the
  time.

`src/data/worldPaths.ts` holds 177 country SVG paths in a 1000×500
equirectangular projection. It was generated once from Natural Earth's
110m admin-0 GeoJSON (the script is preserved in the commit history).
`src/data/countries.ts` maps each vanished state to the ISO_A3 codes of
the modern countries that now occupy its territory, so the map can shade
them in.

## Run it

```bash
npm install
npm run dev
```

## Editing content & settings (`/dev`)

With the dev server running, open **`http://localhost:5173/dev`** and enter the
password (`dontwannaknow123`). It's a password-gated admin console with two tabs:

- **Content** — every editable dataset in one searchable, tagged list
  (Countries / Cities / Years / Culture / Sports). Add, edit, or remove entries.
- **Settings** (`/dev/settings`) — game configuration: currency rates, default
  language, max people to compare, the country picker, animation timings, the
  sky-chart hour, and more.

Edits are written straight to the JSON files under `src/data/` (and
`src/config/gameSettings.json`) via a dev-only server endpoint, so they show up
in the game on reload — commit the changed files to keep them. See `DOCS.md` →
"Dev console" for details. The password is a convenience gate, not real
security.

## Build it

```bash
npm run build
npm run preview
```

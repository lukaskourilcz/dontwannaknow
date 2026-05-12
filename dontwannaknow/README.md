# Don't wanna know

A small site that asks for a birth year and tells you what the world was
doing then — bizarre, beautiful, and everyday details about the era your
parents or grandparents grew up in.

You enter a year (or full date) of birth for yourself, your mom, your
grandpa, anyone. The site responds with:

- **A world map** — modern country borders, with the territories that
  belonged to vanished states (USSR, Yugoslavia, Czechoslovakia, etc.)
  shaded and labelled for that birth year.
- **Bizarre** — things that didn't exist yet, countries that have since
  vanished from the map, "the average wage today is 30× what it was."
- **Beautiful** — the moments worth remembering: Apollo 11, Mandela
  walking free, the wall coming down.
- **Everyday life** — bread prices, gas prices, average wage, world
  population in the year they were born.
- **Growing up** — the songs everyone knew, what they wore, what teens
  actually did before the internet.

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

## Build it

```bash
npm run build
npm run preview
```

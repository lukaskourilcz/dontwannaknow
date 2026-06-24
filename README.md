# Don't wanna know

**Enter a birth year and a birthplace, and the site reconstructs the world that person
lived through** — the bizarre, the beautiful, and the everyday details of the era your
parents or grandparents grew up in. Events, faces, prices, the night sky on the day
they were born, and what kids said on the playground that decade.

> Everything runs in your browser. There is **no AI, no API call, and no server** — the
> entire report is computed client-side from curated datasets. That keeps it free,
> instant, deterministic, and offline-friendly. Nothing you type is sent anywhere.

The site is Czech-first with an English toggle.

## Repository layout

The actual app lives in the **[`dontwannaknow/`](./dontwannaknow)** subfolder (this is
also the Vercel **Root Directory**).

```
.
├── dontwannaknow/        # The Vite + React app  ← start here
│   ├── src/              # Components, datasets, report generator, i18n, /dev console
│   ├── vercel.json       # Static deploy config (SPA fallback)
│   └── README.md         # App-level readme
├── DOCS.md               # Full documentation (architecture, data model, pipeline)
├── stack-and-scaling.md  # Tech stack, current costs, and scaling analysis
└── README.md             # This file
```

## What it does

You enter a year (or full date) of birth, a **country**, and a **city** — for yourself,
your mom, your grandpa, anyone. Country is one of **Czechia / Czechoslovakia**,
**Spain**, **United States**, **Ukraine / Ukrainian SSR**, or **"Anywhere"** (global
facts only). The site responds with:

- **A world map** — modern borders, with vanished states (USSR, Yugoslavia,
  Czechoslovakia, …) shaded and labelled for that birth year.
- **Bizarre** — things that didn't exist yet, countries that have since vanished, "the
  average wage today is 30× what it was."
- **Beautiful** — moments worth remembering: Apollo 11, Mandela walking free, the wall
  coming down.
- **Local events**, **who was in charge**, and **famous faces of the era** for the
  chosen country.
- **What people wore, ate, fell ill from, and paid for things** — decade-specific per
  country.
- **Everyday life (global)** — bread, gas, wages, world population.
- **Growing up** — the songs, films, books, and fashion of their teenage years.
- A **birthday star chart**, a **life-in-weeks grid**, and a **vintage front page**.

Click **Shuffle facts** to re-roll a different mix, or **↓ PDF** to export the report.

Country-specific data covers **1920–1980** for CZ, ES, US, and UA; city-specific data
covers the **top 20 cities** in each country (80 cities total). All facts live in
`dontwannaknow/src/data/` and the per-person generator is in
`dontwannaknow/src/lib/facts.ts`.

## Quick start

```bash
cd dontwannaknow
npm install
npm run dev          # http://localhost:5173
```

Build and preview the production output:

```bash
npm run build        # type-check + Vite build to dist/
npm run preview
```

## Editing content & settings (`/dev`)

With the dev server running, open **`http://localhost:5173/dev`** (password: `autobus`)
for a password-gated admin console with two tabs — **Content** (every editable dataset)
and **Settings** (game configuration). In dev, edits are written straight to the JSON
files under `src/data/`; in a production build the editor is read-only and offers a
file download instead. The password is a convenience gate, not real security. See
[`DOCS.md`](./DOCS.md) → "Dev console" for details.

## Tech stack

- **React 19 + TypeScript** (strict) on **Vite 7**
- **astronomy-engine** for the in-browser birthday star chart
- **jsPDF + html2canvas + DOMPurify** for client-side PDF export
- **motion** (Framer Motion) for animations; hand-written CSS design tokens
- Self-hosted variable fonts (Fraunces / Newsreader / Instrument Sans) via Fontsource
- **Hosting:** Vercel (zero-config static deploy)

No database, no backend, no external API. Full details — including bundle composition,
current cost (**$0/month**), and how it scales — are in
[`stack-and-scaling.md`](./stack-and-scaling.md).

## Deployment

Static Vite app deployed on **Vercel** — no server, no API keys, no environment
variables. On Vercel, set **Root Directory** to `dontwannaknow`; the included
`vercel.json` declares the framework, build command, output directory, and SPA-fallback
rewrites. Every push to the production branch triggers a redeploy. Any static host works
— just serve `dontwannaknow/dist/` with a fallback rewrite of all paths to
`/index.html`.

## Documentation

- **[`dontwannaknow/README.md`](./dontwannaknow/README.md)** — app-level readme.
- **[`DOCS.md`](./DOCS.md)** — full documentation: architecture, data model, report
  pipeline, the `/dev` console, and extending the dataset.
- **[`stack-and-scaling.md`](./stack-and-scaling.md)** — tech stack, current monthly
  cost, scaling options per bottleneck, and a concrete analysis at 100 active users.

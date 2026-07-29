# Tehdejší svět

Czech-only, person-centric publication that reconstructs the environment someone
grew up in ("Čí svět chcete poznat?"). Deterministic, client-side, static-hosting
friendly, with no accounts, no report storage, and no runtime AI.

## Tech stack

- **Framework:** Vite + React + TypeScript
- **Execution:** fully client-side and deterministic; form values never leave the browser
- **Fonts:** self-hosted variable fonts (Fraunces, Instrument Sans, Newsreader)
- **Exports:** canvas share images and PDF (lazy-loaded)
- **Testing:** Vitest

## Connected third parties

- **Vercel Analytics** — privacy-light usage metrics; no name, date, or report content sent.

## Key libraries

- `astronomy-engine` — real sky/astronomy computation for the birth date and place.
- `jspdf` — client-side PDF generation of the report.
- `motion` — restrained, reduced-motion-aware animation.

## Data provenance

Public historical/reference data is generated at build time from vetted sources
(e.g. Wikidata, World Bank, museum collections); nothing is fetched at runtime.

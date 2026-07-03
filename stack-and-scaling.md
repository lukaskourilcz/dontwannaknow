# Don't wanna know

Enter a birth year, country and city; the browser reconstructs the era that person grew up in — no server, no API, no AI.

- **Now:** **$0/month** — Vercel Hobby (free static CDN) + GitHub Free, at low personal traffic (well under a few thousand visits/mo).
- **Stack:** React 19 + TypeScript on Vite 7 · all compute client-side (astronomy-engine, jsPDF/html2canvas/DOMPurify) · Vercel static CDN · **no backend, DB, or API**.
- **First ceiling:** Vercel Hobby's **non-commercial ToS clause** — hit long before any capacity limit, since a pure-static SPA scales infinitely at the edge.
- **At 100 users:** **$0/month** — nothing to upgrade (~0.2–0.6% of Hobby's 100 GB / 1M edge requests); only optional add is free analytics (Cloudflare/Vercel).
- **At 1,000 users:** **$0/month** — still a few % of the free tier; no read replica, cache, or queue needed (there's no server) — only split/lazy-load the ~2 MB dataset if it keeps growing.
- **Watch:** CDN bytes served (the one cost that grows with traffic) and the initial bundle shipping the full ~2 MB dataset to every first-time visitor.

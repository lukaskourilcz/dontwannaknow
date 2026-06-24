# Don't wanna know

Enter a birth year, country and city and get an instant, in-browser report on the bizarre, beautiful and everyday world of the era that person grew up in.

> **Defining architectural fact:** this app has **no backend**. There is no server, no
> database, no auth provider, no runtime API, no AI/LLM call, no analytics, and no
> serverless functions. The entire report is computed in the visitor's browser from
> datasets bundled at build time (`src/data/`, ~2 MB of JSON/TS, ~53k records). The
> only thing deployed is static files (`dist/`) on a CDN. This single fact drives the
> entire cost and scaling story below: the app is effectively infinitely
> horizontally scalable at the edge, and the only cost that grows with traffic is
> **bytes served**.

Verified against: `dontwannaknow/package.json`, `vercel.json`, `vite.config.ts`,
`index.html`, all of `src/`, and `DOCS.md`. No `.env` files, no `api/` directory, no
`.github` workflows, no external `fetch`/websocket/CDN calls in `src/`, no
`import.meta.env`/`VITE_*` usage.

## Tech stack & current costs

### Hosting & infrastructure

- **Vercel** — static CDN hosting + build pipeline. Declared in `vercel.json`
  (`framework: vite`, build `npm run build`, output `dist/`, SPA fallback rewrite to
  `/index.html`). Every push to the production branch triggers a redeploy. Root
  directory is the `dontwannaknow/` subfolder.
  - Plan/tier: **Vercel Hobby (Free)** — assumed (no paid-plan markers in the repo; it
    is a single-developer personal project). Confirm in the Vercel dashboard.
  - Monthly cost: **$0**.
  - Limitations (Hobby, approx. current Vercel limits): **100 GB** Fast Data Transfer
    (bandwidth) / month, **~1,000,000** Edge Requests / month, **1** concurrent build,
    ~6,000 build minutes, no uptime SLA, and a **non-commercial-use-only** clause in
    the ToS. No function/cold-start concerns because the app ships zero serverless
    functions. Static assets are hashed and served `immutable`, so returning visitors
    cost almost nothing.

- **GitHub** (`lukaskourilcz/dontwannaknow`) — source of truth; `git push` is what
  triggers Vercel deploys. Content edits (the `/dev` console) are committed here as
  JSON and shipped on the next build.
  - Plan/tier: **GitHub Free**.
  - Monthly cost: **$0**.
  - Limitations: none relevant at this repo size.

- **Domain** — not configured in the repo. The app is reachable on a default
  `*.vercel.app` subdomain.
  - Plan/tier: default Vercel subdomain.
  - Monthly cost: **$0** (or **~$1/mo** amortized, i.e. ~$10–15/yr, *if* a custom
    domain is ever registered).
  - Limitations: none relevant.

### Managed services, databases, external APIs

- **None.** There is no database (Postgres/Supabase/Neon/etc.), no auth service, no
  email/queue/cache service, no payment provider, no third-party API, and no AI/LLM
  API. All "data" is static JSON compiled into the bundle. The README states it
  explicitly: *"There is no AI or API call — the entire report is generated in the
  browser."*
  - Monthly cost: **$0**.

### Application dependencies (all shipped to the browser, all $0)

These are open-source npm packages bundled into the static output — they incur **no
service cost**; their only cost impact is the bytes they add to what Vercel's CDN
serves. Production bundle (from `vite build`, per `DOCS.md`): **~280 kB gzipped
initial** (839 kB raw main+data), plus lazy chunks.

- **React 19 + React DOM** (`react`, `react-dom`) — UI framework. Cost **$0**. Limits:
  none relevant (client library). Part of the ~275 kB gz main chunk.
- **TypeScript 5.8** — language, build-time only (`tsc -b && vite build`). Cost **$0**.
  Limits: none relevant; not shipped to users.
- **Vite 7** — bundler / dev server / build tool. Cost **$0**. Limits: none relevant.
  Also hosts a **dev-only** content-write middleware (`/__content/*` in
  `vite.config.ts`) that exists *only* under `npm run dev` and is **not present in
  production**.
- **astronomy-engine 2.1** — computes the birthday star chart (`SkyMap.tsx`) entirely
  in-browser. Cost **$0**. Limits: none relevant (pure client compute, no API).
- **jsPDF 4.2** (`jspdf`) — client-side PDF export (`lib/pdf.ts`). Cost **$0**.
  Limits: heavy (**~129 kB gz**), so it is **lazy-loaded** only when "↓ PDF" is
  clicked — no server roundtrip.
- **html2canvas 1.4** — rasterizes the DOM to a canvas for the PDF/share image. Cost
  **$0**. Limits: **~48 kB gz**, lazy-loaded with jsPDF.
- **DOMPurify 3.2** (`dompurify`) — sanitizes generated HTML before rendering/export.
  Cost **$0**. Limits: **~9 kB gz**, lazy-loaded with jsPDF.
- **motion 12** (Framer Motion) — UI animations (`App.tsx`). Cost **$0**. Limits: adds
  to the main chunk; none relevant operationally.
- **Fontsource variable fonts** — **Fraunces**, **Newsreader**, **Instrument Sans**,
  self-hosted (imported in `App.tsx`). Cost **$0** (OFL fonts). Limits: adds roughly
  **~0.3 MB of woff2** to a first (cold) visit, served from Vercel's CDN with no
  third-party request; cached immutably afterward.
- **ESLint 9 / typescript-eslint 8** — linting, dev-only. Cost **$0**. Limits: not
  shipped to production.

## Total current cost

**$0 / month.**

Usage assumptions behind that figure: this is a personal project on Vercel Hobby with
low traffic — realistically well under a few thousand visits/month today. Cost math:

- A **cold (first-ever) visit** transfers roughly **0.5–0.7 MB**: ~280 kB gz of JS+CSS
  + ~0.3 MB of variable fonts, plus the ~79 kB gz `Results` chunk after the form is
  submitted. Clicking PDF export adds **~186 kB gz** once (jsPDF + html2canvas +
  DOMPurify). **Returning visits are near-zero** — hashed, `immutable` assets are
  served from browser/CDN cache.
- Vercel Hobby's free ceilings translate to roughly **~120,000–165,000 cold visits /
  month** before any limit bites (100 GB ÷ ~0.6 MB ≈ ~165k on bandwidth; 1M edge
  requests ÷ ~8 asset requests per cold visit ≈ ~125k on requests). Returning
  visitors barely count, so real capacity is higher.

Current traffic is orders of magnitude under that, so the app sits at a tiny fraction
of a percent of the free tier. There are no per-request, database, or compute costs to
add. **Total: $0/month.**

## Scaling — options & costs

Because the app is pure static files, most classic scaling concerns (DB connections,
read replicas, queues, cold starts, autoscaling compute) **do not apply** — there is
nothing server-side to scale. The realistic bottlenecks are below.

### 1. CDN bandwidth & edge requests (the only traffic-scaling axis)

This is the single thing that grows with users. Options, by approximate monthly cost
to serve a given volume of static traffic:

- **Stay on Vercel Hobby** — **$0**, up to ~100 GB / ~1M edge requests (~120k–165k cold
  visits/mo). No action needed until you approach that.
- **Cloudflare Pages (Free)** — **$0** with **unlimited bandwidth and unlimited
  requests** for static assets (limits are on builds: 500/mo, and 20,000 files /
  25 MiB per file — both fine here). For a static SPA this is the cheapest option at
  *any* scale and the natural destination if Vercel's bandwidth or non-commercial
  clause ever bites. Requires repointing deploy + DNS.
- **Vercel Pro** — **$20 / user / month**, includes **1 TB** Fast Data Transfer
  (~1.5M+ cold visits/mo) then **~$0.15/GB**; 10M edge requests then ~$2/1M. Zero
  migration — keeps the exact current workflow; also lifts the non-commercial clause.
- **Netlify** — Free 100 GB/mo; **Pro $19/mo** for 1 TB, then ~$0.55/GB (pricey
  overage).
- **Bunny.net CDN** — ~**$0.01–0.03/GB** + storage; ~**$10–30/mo at 1 TB**. Cheapest
  paid CDN if you want a dedicated provider.
- **AWS S3 + CloudFront** — storage negligible (~$0.05), CloudFront egress ~$0.085/GB →
  **~$85/mo at 1 TB**. Most expensive here; only worth it inside an AWS-native org.

**Recommendation:** $0 until ~100 GB/mo; then **Cloudflare Pages ($0)** for cost, or
**Vercel Pro ($20/mo)** for zero migration.

### 2. Vercel Hobby non-commercial clause (a licensing, not capacity, ceiling)

If the app is ever monetized (ads, paid features, a business), Vercel's ToS requires
leaving Hobby regardless of traffic. Options: **Vercel Pro ($20/mo)** or migrate to
**Cloudflare Pages ($0)** / **Netlify** / **Bunny**.

### 3. Initial bundle & dataset growth (the real *technical* scaling axis)

Every visitor downloads **all** the data — the ~275 kB gz main chunk already contains
the full `src/data/` set (~2 MB raw). This is fine today, but it grows with the data,
not the users: adding countries/cities/years inflates the first load for everyone.
Options:

- **Keep code-splitting** (already done for `Results` and the PDF stack) — **$0**.
- **Split data by country/decade and lazy-load** only the slice a report needs (fetch
  the relevant JSON on demand instead of bundling everything) — **$0**, keeps it
  static; biggest win once the dataset is several × larger.
- **Move data behind an edge KV / config store** (Cloudflare KV, Vercel Edge Config)
  and fetch on demand — **$0** on free tiers (e.g. Cloudflare KV free: 100k reads/day;
  Vercel Edge Config free on Hobby). Adds a thin edge layer but keeps the main bundle
  small.

### 4. Content-editing workflow (operational bottleneck)

The `/dev` console only writes to disk under local `npm run dev`; in production it
falls back to read-only + file download. Production content changes require a **git
commit + redeploy**. To let non-developers edit live content, options:

- **Stay commit-and-redeploy** — **$0** (current).
- **Headless CMS** (Sanity / Contentful / Storyblok free tiers) — **$0** initially,
  ~$20–100+/mo if outgrown.
- **Supabase (Free)** Postgres + a small serverless write API — **$0** (500 MB DB,
  50k MAU, 5 GB egress; pauses after 7 days idle), **$25/mo** (Supabase Pro) when
  outgrown.

### 5. Observability / analytics (you currently can't measure anything)

There is no analytics, so "active users" is literally unmeasurable today. Options:

- **Cloudflare Web Analytics** — **$0**, unlimited, privacy-friendly.
- **Vercel Web Analytics** — free on Hobby (limited events), **~$10/mo** for more.
- **Plausible** — **~$9/mo** for 10k pageviews. **PostHog** — free up to ~1M events/mo.

### 6. Future backend features (only if the product direction changes)

Saved reports, user accounts, server-rendered share/OG images, or live dynamic content
would introduce a backend for the first time: serverless functions (**Vercel
Functions** or **Cloudflare Workers**, free ~100k req/day), a database (**Neon Free**
0.5 GB / **Supabase Free** 500 MB), and object storage (**Cloudflare R2** free 10 GB /
S3). All start at **$0** on free tiers and grow to **~$20–45/mo** at meaningful scale.

## At 100 active users

For this specific app, **100 active users is a non-event** — and being honest and
quantitative is the whole point here.

**Concrete usage.** Take 100 monthly-active users, each visiting ~8 times/month and
generating a couple of reports per visit, with ~20% exporting a PDF:

- **Bandwidth:** worst case, treat every one of the ~800 sessions/month as a fully cold
  ~0.7 MB load → **~0.56 GB/month**. Realistically most assets are cached after the
  first visit (hashed `immutable` files), so the true figure is closer to
  **~0.2 GB/month**. Against Vercel Hobby's **100 GB**, that is **0.2–0.6%
  utilization**.
- **Edge requests:** ~800 sessions × ~8 asset requests ≈ **~6,400/month** against
  ~1,000,000 included — **~0.6%**.
- **Compute / DB:** none exists, so there is nothing to saturate — no connection pools,
  no cold starts, no query latency.

**Which limit you'd hit first:** none on capacity. The first ceiling you'd reach at 100
users is **not technical at all** — it's the **Vercel Hobby non-commercial clause** *if*
those users are monetized in any way (then you must move to **Vercel Pro $20/mo** or
**Cloudflare Pages $0**). On pure traffic, you remain ~150–500× below every Hobby
limit. The genuine capacity ceiling (~120k–165k cold visits/month, i.e. roughly
**15,000–20,000+ active users** at this engagement level) is far beyond 100.

**What would break or slow down:** nothing in serving. Static assets come from a global
CDN, so response time is the same for user #1 and user #100; there is no database to
slow down and no server to overload. The real friction that 100 *engaged* users
surfaces is operational, not infrastructural:

1. **You can't tell you have 100 users** — there is no analytics. *First thing to add:*
   Cloudflare Web Analytics or Vercel Web Analytics — **$0**.
2. **Content corrections don't scale** — 100 users will spot data gaps/errors, and the
   commit-and-redeploy content workflow becomes the bottleneck. *Optional:* move
   content to a CMS or Supabase Free (**$0**) with a small write API.
3. **The bundle still ships all data to everyone** — harmless at 100 users, but this is
   the axis that actually grows (with the dataset, not the audience). Worth splitting
   data once it's several × today's ~2 MB.

**New estimated monthly cost:** **$0/month** (unchanged). It becomes **$20/month** only
if you must leave Hobby for the commercial clause and choose Vercel Pro — or stays
**$0** by moving to Cloudflare Pages. Adding paid analytics (Plausible ~$9/mo) or a CMS
is optional and unrelated to load.

**How the architecture would have to be transformed:** for serving 100 users, **not at
all.** The transformations usually invoked at this point — caching, queues/background
jobs, database read replicas, a CDN, autoscaling — are already moot here: the app is
*already* nothing but CDN-cached static files with no database, no queue, and no
server. Those changes only become relevant under two different triggers, neither of
which is "100 users":

- **Dataset grows ~10×** → split/lazy-load data by country/decade, optionally behind an
  edge KV (Cloudflare KV / Vercel Edge Config, **$0**), to keep the initial bundle
  small.
- **You add backend features** (accounts, saved reports, dynamic content, server-side
  OG images) → introduce serverless functions + a database + object storage, all
  starting on **$0** free tiers (Cloudflare Workers/Neon/Supabase/R2) and scaling to
  **~$20–45/mo** only at much higher volume.

**Bottom line:** at 100 active users this app runs for **$0/month** with no
architectural change. Its scaling ceiling is measured in **tens of thousands of users**,
and when that day comes the cheapest move is a static-host swap to **Cloudflare Pages
($0)**, not a re-architecture.

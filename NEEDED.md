# NEEDED — actions that require your access

Everything in the code is done, merged, and (once the merge lands on the
production branch) auto-deploying. The items below can **only be done by you**,
because they need the Vercel dashboard / your account — I don't have access to
them.

Ordered by importance.

---

## New: public-API data enrichment (build-time, already generated & committed)

Three free, no-key APIs now enrich the report — all fetched **at build time**
and committed as static data, so the shipped app still makes **no runtime API
calls** (CSP stays `connect-src 'self'`). See
[`dontwannaknow/src/data/generated/README.md`](./dontwannaknow/src/data/generated/README.md)
for how to regenerate.

- **World Bank** → real per-country population, life expectancy, and GDP/capita
  (a new fact for births from ~1960 on).
- **Wikidata** → a new "Slavní vrstevníci / Famous contemporaries" section
  (notable people born the same decade + country, ranked by Wikipedia fame).
- **The Met (Open Access, CC0)** → a new "Umění té doby / Art of the era" strip
  of public-domain paintings, desaturated to fit the design.

Two things to be aware of (no action strictly required):

1. **~3.3 MB of art thumbnails** were committed under `dontwannaknow/public/art/`
   and ship with the static deploy. They're lazy-loaded (only ~3 load per
   report), but this is the kind of "CDN bytes" growth your
   `stack-and-scaling.md` flags. Fine at your traffic; just noting it.
2. **Art only covers ~1860–1910** — 20th-century paintings are still under
   copyright, so there's no free CC0 imagery for them (verified against the
   Met). Later-born visitors see the nearest earlier decade's art, with each
   work's real year shown, which fits the "your parents'/grandparents' era"
   theme. To refresh or expand, re-run `node scripts/gen-art.mjs`.

---

## 0. Note: "main" vs `dev`

This repo has **no `main` branch**. Its default **and** production branch is
**`dev`**, and per the README *"every push to the production branch triggers a
redeploy."* So "merge with main and deploy" was carried out by merging into
**`dev`**, which is what actually triggers the Vercel deployment.

If your Vercel project is configured to deploy from a different branch, merge
`dev` into that branch too.

---

## 1. Enable Vercel Web Analytics (required for analytics to collect anything)

The analytics code is wired in (`@vercel/analytics`, cookieless, same-origin),
but the beacon is a **no-op until you switch the feature on** in the dashboard.
Until then you'll see a harmless `GET /_vercel/insights/script.js 404` in the
browser console — that is expected, not a bug.

1. Vercel → your **dontwannaknow** project → **Analytics** tab.
2. Click **Enable** (Web Analytics — the free tier).
3. Redeploy (or just wait for the next deploy).

After that the 404 disappears and aggregate pageviews start showing up. No
cookies, no PII, and share-link person data (`#d=…`) is stripped before send.

Docs: https://vercel.com/docs/analytics/quickstart

---

## 2. Smoke-test the new security headers in production (5 min)

The strict **Content-Security-Policy** and other headers in `vercel.json` only
take effect **on Vercel** — they are NOT active in `npm run preview`, so they
could not be fully tested locally. Once deployed, please verify nothing is
blocked:

1. Open the deployed site, open **DevTools → Console**.
2. Generate a report, hit **Shuffle**, and **export a PDF**.
3. Look for any red **"Refused to … because it violates the Content Security
   Policy"** messages.

Expected result: **no CSP violations.** The policy was written to allow exactly
what the app uses:

| Directive | Why |
|---|---|
| `style-src 'self' 'unsafe-inline'` | Motion sets inline styles during animation |
| `img-src 'self' data: blob:` | jsPDF + html2canvas build the PDF from canvas/blob URLs |
| `connect-src 'self'` | the app makes **no** outbound calls — this is what enforces the "nothing sent anywhere" promise (Vercel Analytics is same-origin, so it's covered) |
| `font-src 'self'` | self-hosted Fontsource fonts |

**If something does break:**
- PDF export throws a CSP error mentioning `eval`/`Function` → add
  `'wasm-unsafe-eval'` (or as a last resort `'unsafe-eval'`) to `script-src`.
- A font or style is blocked → widen that specific directive only.
- Then just tell me the exact violation text and I'll tighten it back up.

To confirm the headers are live, you can also run:
`curl -sI https://<your-domain>/ | grep -i "content-security\|strict-transport"`

---

## 3. (Optional) Perf follow-up — split the big datasets

Not required, just flagged. The build still ships two large single chunks:

- `cityFacts.json` ≈ 592 KB
- `history.json` ≈ 512 KB

Both are sent to every first-time visitor. The `manualChunks` split described
in `stack-and-scaling.md` is the next free performance win (lazy-load per
country/city). Say the word and I'll implement it.

**Measure it first (catalogue tools, no code):** run the deployed URL through
**PageSpeed Insights** (<https://pagespeed.web.dev>) or **DebugBear's** free
tools (<https://www.debugbear.com/tools>, best free LCP breakdown) to see how
much those two chunks actually cost your LCP before spending effort on the
split. The datasets are already emitted as their own chunks
(`history-*.js` ≈ 512 KB, `cityFacts-*.js` ≈ 517 KB) but still load eagerly —
the split makes them load on demand.

---

## 4. NEW — social share image (catalogue: Recraft / Ideogram)

The app declared a `summary_large_image` Twitter/OG card but shipped **no
image**, so link previews rendered blank. Added:

- `public/og-image.png` — a valid 1200×630 **placeholder** (newsprint-ink solid,
  generated by `scripts/gen-og-placeholder.mjs`), plus `og:image` /
  `twitter:image` tags in `index.html`. It's same-origin, so the strict
  `img-src 'self'` CSP and the "nothing leaves your browser" promise are
  untouched (social scrapers read the file; the app never calls out).

**To finish:** generate a real newspaper-style share card with **Recraft**
(<https://recraft.ai>) or **Ideogram** (<https://ideogram.ai> — strong at the
masthead/headline text a card like this wants) and save it over
`public/og-image.png` (keep the name). If a scraper insists on an absolute URL,
add `<meta property="og:url" content="https://<your-domain>/">` and make the
image tags absolute. Regenerate the placeholder anytime with
`node scripts/gen-og-placeholder.mjs`.

## 5. Note — "more art sources" (catalogue: public-apis) isn't the win here

The catalogue suggested more free public-domain art APIs. Worth being explicit:
your `scripts/gen-art.mjs` **already evaluated the Art Institute of Chicago and
rejected it** (its image CDN sits behind a Cloudflare bot-challenge), and the
~1910 boundary is a **copyright limit no source can lift** — 20th-century art
isn't public-domain. So more APIs won't extend the range; they'd only add
*volume* to the existing pre-1910 decades. If you ever want that, **Wikimedia
Commons** is the one additional source that serves plain (non-Cloudflare) PD
images and would fit your existing "download to `public/art/`, keep same-origin"
pattern. I did **not** add it — it duplicates coverage you already have. Say the
word if you want it.

---

## TL;DR

1. **Enable Web Analytics** in the Vercel dashboard (item 1) — the only thing
   blocking analytics.
2. **Glance at the console once** after deploy for CSP violations (item 2) —
   expected to be clean.
3. **(Optional)** Swap `public/og-image.png` for a real Recraft/Ideogram share
   card (item 4) — link previews currently show a plain placeholder.
4. Everything else is live automatically on merge to `dev`.

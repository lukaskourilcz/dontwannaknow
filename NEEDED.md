# NEEDED — actions that require your access

Everything in the code is done, merged, and (once the merge lands on the
production branch) auto-deploying. The items below can **only be done by you**,
because they need the Vercel dashboard / your account — I don't have access to
them.

Ordered by importance.

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

---

## TL;DR

1. **Enable Web Analytics** in the Vercel dashboard (item 1) — the only thing
   blocking analytics.
2. **Glance at the console once** after deploy for CSP violations (item 2) —
   expected to be clean.
3. Everything else is live automatically on merge to `dev`.

// Build-time generator — public-domain paintings created in each decade, from
// the Metropolitan Museum of Art's Open Access API (free, no key). Run manually
// and commit the output.
//
//   node scripts/gen-art.mjs
//
// It DOWNLOADS each public-domain thumbnail into public/art/ and stores a
// *same-origin* path in the JSON — so the shipped app never makes a third-party
// request, the strict CSP stays `img-src 'self'`, and the "nothing leaves your
// browser" promise is fully intact.
//
// (The Art Institute of Chicago API was evaluated too, but its image CDN sits
// behind a Cloudflare bot-challenge that blocks non-browser downloads, so this
// uses the Met, whose image host serves plain JPEGs.)
//
// Output:
//   src/data/generated/artByDecade.json
//     [ { decadeStart, items: [{ title, artist, year, source, image, pageUrl }] } ]
//   public/art/met-<id>.jpg  (the downloaded thumbnails)

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/generated/artByDecade.json");
const ART_DIR = resolve(ROOT, "public/art");

// Public-domain paintings effectively stop after ~1910 (20th-century art is
// still in copyright — verified: 0 genuinely-PD painting hits for the 1930s or
// 1950s at the Met). We generate the decades that actually have CC0 imagery;
// the app falls back to the nearest earlier decade for later births, and each
// work shows its real year, which fits the "your parents'/grandparents' era"
// theme honestly.
const DECADES = [1860, 1870, 1880, 1890, 1900, 1910];
const PER_DECADE = 5;
const SCAN = 24; // objectIDs to inspect per decade

const MET = "https://collectionapi.metmuseum.org/public/collection/v1";

// Polite pause — the Met throttles rapid per-object scans, which silently
// starved the later decades on the first pass.
function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* busy-wait; fine for a one-off script */ }
}

function curlJson(args) {
  const body = execFileSync(
    "curl",
    ["-s", "--http1.1", "--max-time", "30", "--retry", "2", "--retry-delay", "2", ...args],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  return JSON.parse(body);
}

// Download and confirm the bytes are actually a JPEG (magic FF D8 FF). Returns
// true only for a real image; deletes anything else (e.g. an error page).
function downloadJpeg(url, dest) {
  if (existsSync(dest) && isJpeg(dest)) return true;
  try {
    execFileSync(
      "curl",
      ["-s", "--http1.1", "--max-time", "40", "--retry", "2", "-o", dest, url],
      { stdio: "ignore" },
    );
  } catch { /* fall through to validation */ }
  if (existsSync(dest) && isJpeg(dest)) return true;
  if (existsSync(dest)) rmSync(dest);
  return false;
}

function isJpeg(path) {
  try {
    if (statSync(path).size < 2000) return false;
    const buf = readFileSync(path, { length: 3 });
    // readFileSync ignores `length`; slice the first bytes instead.
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  } catch {
    return false;
  }
}

function metForDecade(lo, hi) {
  const search = curlJson([
    "-G", `${MET}/search`,
    "--data-urlencode", `dateBegin=${lo}`,
    "--data-urlencode", `dateEnd=${hi}`,
    "--data-urlencode", "hasImages=true",
    "--data-urlencode", "isPublicDomain=true",
    "--data-urlencode", "medium=Paintings",
    "--data-urlencode", "q=painting",
  ]);
  const ids = Array.isArray(search?.objectIDs) ? search.objectIDs.slice(0, SCAN) : [];
  const out = [];
  for (const id of ids) {
    if (out.length >= PER_DECADE) break;
    try {
      const o = curlJson([`${MET}/objects/${id}`]);
      const src = o.primaryImageSmall || o.primaryImage;
      if (!o.isPublicDomain || !src) continue;
      const name = `met-${id}.jpg`;
      if (!downloadJpeg(src, resolve(ART_DIR, name))) continue;
      out.push({
        title: o.title || "Bez názvu",
        artist: o.artistDisplayName || "Neznámý autor",
        year: Number(o.objectEndDate) || lo,
        source: "met",
        image: `/art/${name}`,
        pageUrl: o.objectURL || `https://www.metmuseum.org/art/collection/search/${id}`,
      });
    } catch { /* skip a bad object */ }
    sleep(200); // stay under the Met's throttle
  }
  return out;
}

mkdirSync(ART_DIR, { recursive: true });
const out = [];
for (const decadeStart of DECADES) {
  const items = metForDecade(decadeStart, decadeStart + 9);
  if (items.length) out.push({ decadeStart, items });
  process.stdout.write(`  ${decadeStart}s: ${items.length}\n`);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
process.stdout.write(`\nWrote ${OUT} (${out.length} decades)\n`);

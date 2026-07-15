// Generate a PLACEHOLDER Open Graph image (public/og-image.png, 1200×630) as a
// valid solid-colour PNG with no external dependencies (pure Node zlib).
//
// Why: the app declares a `summary_large_image` Twitter/OG card but shipped no
// image, so shares rendered blank. This gives a valid same-origin image now
// (keeps CSP `img-src 'self'` and the "nothing leaves your browser" promise
// intact — social scrapers read the file, the app never requests a third party).
// Replace public/og-image.png with a real newspaper-style card from
// Recraft/Ideogram (keep the filename) — see NEEDED.md.
//
// Run:  node scripts/gen-og-placeholder.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/og-image.png");
const INK = [26, 23, 17]; // #1a1711 — newsprint ink, readable as a share card

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function solidPng(w, h, [r, g, b]) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const row = Buffer.alloc(1 + w * 4);
  for (let x = 0; x < w; x++) {
    const o = 1 + x * 4;
    row[o] = r; row[o + 1] = g; row[o + 2] = b; row[o + 3] = 255;
  }
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, solidPng(1200, 630, INK));
process.stdout.write(`Wrote ${OUT} (1200×630 placeholder). Replace with real artwork.\n`);

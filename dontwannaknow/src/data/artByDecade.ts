// Public-domain artworks created in each decade, generated at build time from
// the Met + Art Institute of Chicago (scripts/gen-art.mjs). The thumbnails are
// downloaded into public/art/ and served same-origin, so nothing is fetched
// from a third party at runtime and the strict CSP stays `img-src 'self'`.

import json from "./generated/artByDecade.json";

export type Artwork = {
  title: string;
  artist: string;
  year: number;
  source: "aic" | "met";
  image: string; // same-origin path under /art/
  pageUrl: string; // museum page (opened in a new tab on click)
};

type Entry = { decadeStart: number; items: Artwork[] };
const DATA = (json as Entry[]).slice().sort((a, b) => a.decadeStart - b.decadeStart);

/** How old (in years) the artwork was in the person's birth year. */
export function ageInBirthYear(artwork: Artwork, birthYear: number): number {
  return birthYear - artwork.year;
}

// The conceit: show art that had turned ~this-many years old the year the
// person was born. For births from ~1960 on, `birthYear - 100` lands squarely
// in the public-domain 1860–1910 range we actually have.
const TARGET_AGE = 100;

/**
 * Artworks that were roughly a century old in the person's birth year, closest
 * to exactly {@link TARGET_AGE} first. Targets the decade around
 * `birthYear - 100`, clamped to the decades we have data for, so it always
 * returns something (with each work's true age shown in the UI).
 */
export function artForBirthYear(birthYear: number): Artwork[] {
  if (!DATA.length) return [];
  const decades = DATA.map((d) => d.decadeStart);
  const min = Math.min(...decades);
  const max = Math.max(...decades);

  const targetYear = birthYear - TARGET_AGE;
  const wanted = Math.min(max, Math.max(min, Math.floor(targetYear / 10) * 10));

  const entry =
    DATA.find((d) => d.decadeStart === wanted) ??
    [...DATA].sort(
      (a, b) => Math.abs(a.decadeStart - wanted) - Math.abs(b.decadeStart - wanted),
    )[0];

  const items = entry?.items ?? [];
  // Closest to exactly a century old first.
  return [...items].sort(
    (a, b) =>
      Math.abs(birthYear - a.year - TARGET_AGE) -
      Math.abs(birthYear - b.year - TARGET_AGE),
  );
}

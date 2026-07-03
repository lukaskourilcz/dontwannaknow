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

/**
 * Artworks from the person's birth decade, falling back to the nearest earlier
 * decade that has data (public-domain imagery thins out after ~1930).
 */
export function artForYear(birthYear: number): Artwork[] {
  const decadeStart = Math.floor(birthYear / 10) * 10;
  const exact = DATA.find((d) => d.decadeStart === decadeStart);
  if (exact) return exact.items;
  const earlier = [...DATA].reverse().find((d) => d.decadeStart <= decadeStart);
  return earlier?.items ?? [];
}

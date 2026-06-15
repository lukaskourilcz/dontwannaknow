// Per-country, per-decade media texture: what people most commonly read
// (newspapers, magazines, popular books) and watched (TV channels and famous
// programmes; for the pre-television decades, radio and cinema). Czech-first,
// one full sentence per item so they can be shuffled freely. Covers Czechia/
// Czechoslovakia and Ukraine/Soviet Ukraine, 1940s through the 2020s.

import type { Country } from "./countryDecades";

export type CountryMedia = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  read: string[];   // newspapers, magazines, popular books
  watch: string[];  // TV channels and programmes (radio/cinema before TV)
};

export const COUNTRY_MEDIA: CountryMedia[] = [
  // Filled from research below.
];

const MIN_DECADE = 1940;
const MAX_DECADE = 2020;

/** Media snapshot for the decade containing `year`, clamped to the covered
 *  range. Returns undefined for countries we don't have media data for. */
export function mediaFor(
  country: Country,
  year: number,
): CountryMedia | undefined {
  if (country === "INTL") return undefined;
  let decade = Math.floor(year / 10) * 10;
  if (decade < MIN_DECADE) decade = MIN_DECADE;
  if (decade > MAX_DECADE) decade = MAX_DECADE;
  return COUNTRY_MEDIA.find(
    (m) => m.country === country && m.decadeStart === decade,
  );
}

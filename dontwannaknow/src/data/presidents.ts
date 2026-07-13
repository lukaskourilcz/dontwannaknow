import presidentsJson from "./presidents.json";

import type { Country } from "./countryDecades";
import type { Gender } from "../lib/facts";

// Heads of state (and, where a country had no president, its de-facto leader:
// Spanish kings and Franco, the Soviet leaders who ran Soviet Ukraine, Canadian
// prime ministers) for CZ, US, ES, UA, CA and MX. Ranges are contiguous, so the
// lookup below always resolves to exactly one leader per year. `to: null` marks
// the incumbent. This lets every report answer the simple question: "who was in
// charge of the country you were born in, the year you were born?"

export type President = {
  country: Exclude<Country, "INTL">;
  name: string;
  title: string; // prezident / král / diktátor / premiér / vůdce Sovětského svazu
  gender: Gender;
  from: number;
  to?: number | null; // null / absent = still in office
  note?: string;
};

export const PRESIDENTS: President[] = presidentsJson as President[];

/** The head of state in charge of `country` during `year`. Ranges are
 *  contiguous; on a hand-over year the successor (the one who took office that
 *  year) wins, since they governed the larger part of it. */
export function presidentAt(country: Country, year: number): President | null {
  if (country === "INTL") return null;
  const inOffice = PRESIDENTS.filter(
    (p) => p.country === country && p.from <= year && (p.to == null || p.to > year),
  );
  if (inOffice.length === 0) return null;
  // Latest `from` wins so a transition year resolves to the incoming leader.
  return inOffice.reduce((a, b) => (b.from > a.from ? b : a));
}

/** Every head of state who served at any point between `fromYear` and `toYear`
 *  (inclusive), in chronological order — the succession across a lifetime. */
export function presidentsBetween(
  country: Country,
  fromYear: number,
  toYear: number,
): President[] {
  if (country === "INTL") return [];
  return PRESIDENTS.filter(
    (p) =>
      p.country === country &&
      p.from <= toYear &&
      (p.to == null || p.to > fromYear),
  ).sort((a, b) => a.from - b.from);
}

/** Display form of a term, e.g. "1968–1975" or "2023–dosud". */
export function termLabel(p: President): string {
  return `${p.from}–${p.to == null ? "dosud" : p.to}`;
}

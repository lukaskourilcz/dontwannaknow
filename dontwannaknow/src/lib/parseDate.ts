// Parse a birth date typed however the user likes. Accepts a bare year,
// month+year, or a full date written with any separators — 12. 4. 1953,
// 12/04/1953, 1953-04-12 — or none at all (12041953), since the mobile
// numeric keypad offers no punctuation.
//
// Extracted from the former TypeformWizard so the single-screen NewForm
// (and anything else) can reuse exactly the same lenient parsing.

import { CURRENT_YEAR } from "./datetime";
import { settings } from "../config/settings";

export type ParsedDate = { year: number; month?: number; day?: number };

const MIN_YEAR = settings.minBirthYear;

export function parseDate(input: string): ParsedDate | null {
  const groups = input.trim().match(/\d+/g);
  if (!groups) return null;

  const yearOk = (y: number) => y >= MIN_YEAR && y <= CURRENT_YEAR;
  const monthOk = (m: number) => m >= 1 && m <= 12;
  const dayOk = (y: number, m: number, d: number) =>
    d >= 1 && d <= new Date(Date.UTC(y, m, 0)).getUTCDate();

  const full = (y: number, m: number, d: number): ParsedDate | null =>
    yearOk(y) && monthOk(m) && dayOk(y, m, d) ? { year: y, month: m, day: d } : null;
  const partial = (y: number, m: number): ParsedDate | null =>
    yearOk(y) && monthOk(m) ? { year: y, month: m } : null;

  if (groups.length === 1) {
    const g = groups[0];
    if (g.length === 4) return yearOk(Number(g)) ? { year: Number(g) } : null;
    if (g.length === 6)
      return (
        partial(Number(g.slice(2)), Number(g.slice(0, 2))) ??
        partial(Number(g.slice(0, 4)), Number(g.slice(4)))
      );
    if (g.length === 8)
      return (
        full(Number(g.slice(4)), Number(g.slice(2, 4)), Number(g.slice(0, 2))) ??
        full(Number(g.slice(0, 4)), Number(g.slice(4, 6)), Number(g.slice(6)))
      );
    return null;
  }

  const n = groups.map(Number);
  if (groups.length === 2) {
    if (groups[0].length === 4) return partial(n[0], n[1]);
    return partial(n[1], n[0]);
  }
  if (groups.length === 3) {
    if (groups[0].length === 4) return full(n[0], n[1], n[2]);
    return full(n[2], n[1], n[0]);
  }
  return null;
}

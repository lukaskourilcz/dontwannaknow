// Encode/decode a list of Person records into a URL hash so reports can
// be shared. Compact JSON (one-letter keys), then base64url-encoded.

import type { Person } from "./facts";
import type { Country } from "../data/countryDecades";

type Compact = {
  l: string;
  y: number;
  m?: number;
  d?: number;
  c: Country;
  s?: string;
};

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (input.length % 4)) % 4);
  return atob(padded);
}

export function encodePeopleUrl(people: Person[]): string {
  const compact: Compact[] = people.map((p) => ({
    l: p.label,
    y: p.birthYear,
    m: p.birthMonth,
    d: p.birthDay,
    c: p.country,
    s: p.citySlug,
  }));
  return toBase64Url(JSON.stringify(compact));
}

export function decodePeopleUrl(hash: string): Person[] | null {
  try {
    const json = fromBase64Url(hash);
    const parsed: Compact[] = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed
      .filter((c) => typeof c.l === "string" && typeof c.y === "number" && typeof c.c === "string")
      .map((c) => ({
        label: c.l,
        birthYear: c.y,
        birthMonth: c.m,
        birthDay: c.d,
        country: c.c,
        citySlug: c.s,
      }));
  } catch {
    return null;
  }
}

export function buildShareUrl(people: Person[]): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  return `${base}#d=${encodePeopleUrl(people)}`;
}

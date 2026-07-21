import { isSupportedCountry, type SupportedCountry } from "../data/countryDecades";
import {
  normalizePerson,
  validatePerson,
  type Person,
  type SubjectRelation,
} from "./person";

type CompactPerson = {
  y: number;
  m?: number;
  d?: number;
  c: SupportedCountry;
  s: string;
  r: SubjectRelation;
  v?: number;
  n?: string;
};

type CompactState = {
  z: 1;
  p: CompactPerson[];
};

const RELATIONS = new Set<SubjectRelation>([
  "self",
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "partner",
  "friend",
  "other",
]);

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (input.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeReportState(
  people: Person[],
  options: { includeNames?: boolean } = {},
): string {
  const state: CompactState = {
    z: 1,
    p: people.slice(0, 2).map((person) => ({
      y: person.birthYear,
      m: person.birthMonth,
      d: person.birthDay,
      c: person.country,
      s: person.citySlug,
      r: person.relationship,
      v: person.variant || undefined,
      n: options.includeNames && person.label.trim() ? person.label.trim() : undefined,
    })),
  };
  return toBase64Url(JSON.stringify(state));
}

export function decodeReportState(encoded: string): Person[] | null {
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== "object") return null;
    const state = parsed as Partial<CompactState>;
    if (state.z !== 1 || !Array.isArray(state.p) || state.p.length < 1 || state.p.length > 2) {
      return null;
    }
    const people: Person[] = [];
    for (const raw of state.p) {
      if (
        !raw ||
        typeof raw.y !== "number" ||
        !isSupportedCountry(raw.c) ||
        typeof raw.s !== "string" ||
        !RELATIONS.has(raw.r)
      ) {
        return null;
      }
      const person = normalizePerson({
        relationship: raw.r,
        name: typeof raw.n === "string" ? raw.n.slice(0, 60) : undefined,
        birthYear: raw.y,
        birthMonth: typeof raw.m === "number" ? raw.m : undefined,
        birthDay: typeof raw.d === "number" ? raw.d : undefined,
        country: raw.c,
        citySlug: raw.s,
        variant: typeof raw.v === "number" ? raw.v : 0,
      });
      if (validatePerson(person)) return null;
      people.push(person);
    }
    return people;
  } catch {
    return null;
  }
}

export function buildShareUrl(
  people: Person[],
  options: { includeNames?: boolean } = {},
): string {
  const base = typeof window === "undefined" ? "" : window.location.origin + window.location.pathname;
  return `${base}#r=${encodeReportState(people, options)}`;
}
/** Strip fragment and query payloads before a page URL reaches analytics. */
export function sanitizeAnalyticsUrl(url: string): string {
  return url.split(/[?#]/, 1)[0];
}

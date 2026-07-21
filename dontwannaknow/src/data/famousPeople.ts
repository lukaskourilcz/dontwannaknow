import famousPeopleJson from "./public/famousPeople.json";
import { regroupFamousPeople } from "./_grouped";

// Famous people active in each country during each decade.
// "active" = doing notable work, alive, or dying in that decade.

import type { Country } from "./countryDecades";

export type FamousPerson = {
  name: string;
  role: string; // writer, politician, actor, painter, musician, etc.
  note?: string; // single-line context
};

export type FamousByDecade = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  people: FamousPerson[];
};

export const FAMOUS_PEOPLE: FamousByDecade[] = regroupFamousPeople(famousPeopleJson) as unknown as FamousByDecade[];

export function famousFor(country: Country, year: number): FamousPerson[] {
  if (country === "INTL") return [];
  const start = Math.floor(year / 10) * 10;
  const entry = FAMOUS_PEOPLE.find((f) => f.country === country && f.decadeStart === start);
  return entry?.people ?? [];
}

const CULTURAL_ROLE = /spisov|bás|liter|dramati|here|film|režis|anim|hud|skladatel|zpěv|kapel|dirigent|malíř|fotograf|výtvar|filozof|věd|fyzik|chemik|matematik|lékař|chirurg|konstruktér|architekt|atlet|sport|fotbal|gymnast|tenis|hokej/i;
const DEFAULT_EXCLUSIONS = /zemř|zavražd|popraven|sebevražd|zabit|úmrt|milenk|vězn|teror|nacist|stranick|prezident|vůdce|polit/i;

/** Cultural, scientific and sporting figures suitable for the default report.
 * Political leaders and death-led novelty entries remain in the archive but
 * are reserved for explicit historical context. */
export function culturalFiguresFor(country: Country, year: number): FamousPerson[] {
  return famousFor(country, year).filter((person) =>
    CULTURAL_ROLE.test(person.role) &&
    !DEFAULT_EXCLUSIONS.test(`${person.role} ${person.note ?? ""}`),
  );
}

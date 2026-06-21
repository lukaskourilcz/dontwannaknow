import famousPeopleJson from "./famousPeople.json";
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

import babyNamesJson from "./babyNames.json";
import { regroupBabyNames } from "./_grouped";

// Top baby names per decade and country. Boys and girls listed roughly
// in order of frequency for that decade. US data follows the Social
// Security Administration records; CA tracks closely with US;
// Czech/Spanish/Ukrainian/Mexican names are popular-historical
// approximations from civil-registry summaries.

import type { Country } from "./countryDecades";

export type BabyNames = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  boys: string[];
  girls: string[];
};

export const BABY_NAMES: BabyNames[] = regroupBabyNames(babyNamesJson) as unknown as BabyNames[];

export function namesFor(country: Country, year: number): BabyNames | null {
  if (country === "INTL") return null;
  const decade = Math.floor(year / 10) * 10;
  return BABY_NAMES.find((n) => n.country === country && n.decadeStart === decade) ?? null;
}

// Current overall life expectancy at birth, by country (rounded to nearest
// whole year). Used as a rough yardstick for the "meetings remaining"
// estimate. Sources: UN World Population Prospects 2022; CIA World
// Factbook 2024 round.

import type { Country } from "./countryDecades";

export const LIFE_EXPECTANCY_NOW: Record<Exclude<Country, "INTL">, number> = {
  CZ: 79,
  ES: 83,
  US: 77,
  UA: 71, // war-affected; pre-war was ~72
  CA: 82,
  MX: 75,
};

export function lifeExpectancyFor(country: Country): number {
  if (country === "INTL") return 78;
  return LIFE_EXPECTANCY_NOW[country];
}

export type LifeMath = {
  ageNow: number;
  expectedRemainingYears: number; // never negative; 0 if past life expectancy
  alreadyPastExpectancy: boolean;
};

export function lifeMathFor(birthYear: number, country: Country): LifeMath {
  const ageNow = new Date().getFullYear() - birthYear;
  const exp = lifeExpectancyFor(country);
  const remaining = Math.max(0, exp - ageNow);
  return {
    ageNow,
    expectedRemainingYears: remaining,
    alreadyPastExpectancy: ageNow > exp,
  };
}

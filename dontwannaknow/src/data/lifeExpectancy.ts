// Current life expectancy at birth, by country and sex (rounded to whole
// years). Used to scale the "life in weeks" grid. Sources: UN World
// Population Prospects 2022 / national statistics, ~2023 round.

import type { Country } from "./countryDecades";

// [male, female]
const LIFE_EXPECTANCY: Record<Exclude<Country, "INTL">, [number, number]> = {
  CZ: [76, 82],
  ES: [80, 86],
  US: [75, 80],
  UA: [66, 76], // war-affected
  CA: [80, 84],
  MX: [72, 78],
};

export function lifeExpectancyFor(
  country: Country,
  gender: "m" | "f" = "m",
): number {
  if (country === "INTL") return gender === "f" ? 75 : 70;
  const [m, f] = LIFE_EXPECTANCY[country];
  return gender === "f" ? f : m;
}

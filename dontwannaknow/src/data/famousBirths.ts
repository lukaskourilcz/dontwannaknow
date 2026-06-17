// Famous people indexed by exact birth year. Curated for global
// name-recognition; weighted slightly toward English-language fame but
// includes major figures from elsewhere. Used to surface "you share a
// birth year with…" facts.

import famousBirthsJson from "./famousBirths.json";

export type FamousBirth = {
  year: number;
  name: string;
  role: string;
};

export const FAMOUS_BIRTHS: FamousBirth[] = famousBirthsJson as FamousBirth[];

export function birthsAround(year: number, span = 1): FamousBirth[] {
  return FAMOUS_BIRTHS.filter((b) => Math.abs(b.year - year) <= span);
}

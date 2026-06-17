// Animals declared extinct (or last confirmed alive) at known dates.
// Used to surface "when X was born, the Y still walked the earth — it
// wouldn't be officially gone until Z." All dates are well-documented
// in mainstream conservation sources (IUCN, Smithsonian, etc.).

import extinctionsJson from "./extinctions.json";

export type Extinction = {
  species: string;
  lastConfirmedYear: number;
  declaredExtinctYear: number; // if known; otherwise = lastConfirmedYear
  note: string; // single short clause about the last individual / how it went
};

export const EXTINCTIONS: Extinction[] = extinctionsJson as Extinction[];

// Pick the species that were alive at the time the person was born and
// went extinct later in their lifetime. These are the most poignant.
export function speciesAliveAtBirth(birthYear: number, currentYear: number): Extinction[] {
  return EXTINCTIONS.filter(
    (e) => e.lastConfirmedYear >= birthYear && e.declaredExtinctYear <= currentYear,
  );
}

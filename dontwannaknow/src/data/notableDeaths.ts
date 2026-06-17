// Významná úmrtí podle roku, 1920–2020. Vybráno podle celosvětové
// proslulosti se záměrnou šíří: umělci, vědci, politici, sportovci,
// psanci, králové, diktátoři. Slouží k vykreslení faktů typu
// „za jejich života svět přišel o…“.

import notableDeathsJson from "./notableDeaths.json";

export type NotableDeath = {
  year: number;
  name: string;
  role: string;
  note?: string; // cause / context (one short phrase)
};

export const NOTABLE_DEATHS: NotableDeath[] = notableDeathsJson as NotableDeath[];

export function deathsAround(year: number, span = 1): NotableDeath[] {
  return NOTABLE_DEATHS.filter((d) => Math.abs(d.year - year) <= span);
}

export function deathsInRange(fromYear: number, toYear: number): NotableDeath[] {
  return NOTABLE_DEATHS.filter((d) => d.year >= fromYear && d.year <= toYear);
}

// Notable people born in each decade per country, generated at build time from
// Wikidata (scripts/gen-wikidata-people.mjs) and committed as JSON. Surfaces a
// "famous contemporaries" section — people born in the same decade and country
// as the person in the report. Purely additive to the curated datasets.

import json from "./generated/wikidataPeople.json";
import type { Country } from "./countryDecades";

export type WikidataPerson = {
  name: string;
  role: string; // occupation label (Czech when available, else English)
  birthYear: number;
  wikidataId: string;
};

type Entry = { country: string; decadeStart: number; people: WikidataPerson[] };
const DATA = json as Entry[];

/** Notable people born in the same decade + country as this person. */
export function contemporariesFor(country: Country, birthYear: number): WikidataPerson[] {
  if (country === "INTL") return [];
  const decadeStart = Math.floor(birthYear / 10) * 10;
  const entry = DATA.find((d) => d.country === country && d.decadeStart === decadeStart);
  return entry?.people ?? [];
}

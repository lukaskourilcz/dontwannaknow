// Real per-country, per-year figures from the World Bank Indicators API,
// generated at build time by scripts/gen-worldbank.mjs and committed as JSON.
// Used as an *optional enrichment* — the report falls back to the curated
// decade approximations (stats.ts) when there's no World Bank datum (its
// series generally begin in 1960).

import wbJson from "./generated/worldBank.json";
import type { Country } from "./countryDecades";

export type WorldBankStat = {
  pop?: number; // total population
  lifeExp?: number; // life expectancy at birth, years
  gdpPerCapita?: number; // GDP per capita, current US$
};

type WorldBankData = Record<string, Record<string, WorldBankStat>>;
const WB = wbJson as WorldBankData;

// App country code -> World Bank ISO-3 code (only the four we generate).
const ISO3: Partial<Record<Exclude<Country, "INTL">, string>> = {
  CZ: "CZE",
  ES: "ESP",
  US: "USA",
  UA: "UKR",
};

/** World Bank figures for a country in a given year, or null if none. */
export function worldBankFor(country: Country, year: number): WorldBankStat | null {
  const iso = country === "INTL" ? "WLD" : ISO3[country];
  if (!iso) return null;
  return WB[iso]?.[String(year)] ?? null;
}

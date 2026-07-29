// Real per-country, per-year figures from the World Bank Indicators API,
// generated at build time by scripts/gen-worldbank.mjs and committed as JSON.
// Used as an *optional enrichment* — the report falls back to the curated
// decade approximations (stats.ts) when there's no World Bank datum (its
// series generally begin in 1960).

import type { Country, SupportedCountry } from "./countryDecades";

export type WorldBankStat = {
  pop?: number; // total population
  lifeExp?: number; // life expectancy at birth, years
  gdpPerCapita?: number; // GDP per capita, current US$
  birthRate?: number; // crude birth rate, per 1,000 people
  deathRate?: number; // crude death rate, per 1,000 people
  fertility?: number; // total fertility, children per woman
  infantMortality?: number; // infant deaths per 1,000 live births
};

type WorldBankData = Record<string, Record<string, WorldBankStat>>;
const WB: WorldBankData = {};

// App country code -> World Bank ISO-3 code.
const ISO3: Partial<Record<Exclude<Country, "INTL">, string>> = {
  CZ: "CZE",
  UA: "UKR",
};

/** Líné načtení řad jedné země (včetně světového srovnání WLD). */
export async function loadWorldBank(country: SupportedCountry): Promise<void> {
  const iso = ISO3[country];
  if (iso && WB[iso]) return;
  const module = country === "CZ"
    ? await import("./public/worldBank.cz.json")
    : await import("./public/worldBank.ua.json");
  Object.assign(WB, module.default as WorldBankData);
}

/** World Bank figures for a country in a given year, or null if none. */
export function worldBankFor(country: Country, year: number): WorldBankStat | null {
  const iso = country === "INTL" ? "WLD" : ISO3[country];
  if (!iso) return null;
  return WB[iso]?.[String(year)] ?? null;
}

/**
 * The most recent available value of one indicator for a country — used for
 * the "back then vs. today" comparisons. Series lag differently (fertility
 * often trails GDP by a year), so walk back from the newest year.
 */
export function worldBankLatest(
  country: Country,
  key: keyof WorldBankStat,
): { year: number; value: number } | null {
  const iso = country === "INTL" ? "WLD" : ISO3[country];
  const byYear = iso ? WB[iso] : undefined;
  if (!byYear) return null;
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
  for (const y of years) {
    const v = byYear[y]?.[key];
    if (v != null) return { year: Number(y), value: v };
  }
  return null;
}

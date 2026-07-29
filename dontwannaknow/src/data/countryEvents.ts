// Year-specific events per country (CZ, UA), anchored to a single year so the
// generator can place them by age. Loaded lazily per country — a report never
// pays for the other country's slice.

import type { Country, SupportedCountry } from "./countryDecades";
import type { RecordExtras } from "./_grouped";

export type CountryYearEvent = {
  country: Exclude<Country, "INTL">;
  year: number;
  text: string;
} & RecordExtras;

const cache = new Map<SupportedCountry, CountryYearEvent[]>();

/** Líné načtení řezu jedné země; volá se před sestavením zprávy. */
export async function loadCountryEvents(country: SupportedCountry): Promise<void> {
  if (cache.has(country)) return;
  const module = country === "CZ"
    ? await import("./public/countryEvents.cz.json")
    : await import("./public/countryEvents.ua.json");
  cache.set(country, module.default as CountryYearEvent[]);
}

export function eventsForCountry(country: Country, fromYear: number, toYear: number): CountryYearEvent[] {
  if (country !== "CZ" && country !== "UA") return [];
  return (cache.get(country) ?? []).filter(
    (e) => e.country === country && e.year >= fromYear && e.year <= toYear,
  );
}

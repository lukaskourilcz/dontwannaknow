// Year-specific events per country for CZ, ES, US, UA (1920–1980).
// Anchored to a single year so the generator can place them by age.

import countryEventsJson from "./public/countryEvents.json";

import type { Country } from "./countryDecades";

export type CountryYearEvent = {
  country: Exclude<Country, "INTL">;
  year: number;
  text: string;
};

export const COUNTRY_EVENTS: CountryYearEvent[] = countryEventsJson as CountryYearEvent[];

export function eventsForCountry(country: Country, fromYear: number, toYear: number): CountryYearEvent[] {
  if (country === "INTL") return [];
  return COUNTRY_EVENTS.filter(
    (e) => e.country === country && e.year >= fromYear && e.year <= toYear,
  );
}

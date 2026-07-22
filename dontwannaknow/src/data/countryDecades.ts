import countryDecadesJson from "./public/countryDecades.json";
import { regroupCountryDecades } from "./_grouped";

// Public per-country, per-decade snapshots. Broader source material remains in
// the archive, while this runtime module only exposes the generated CZ/UA layer.
//
// Each entry is one sentence so we can shuffle them freely.

export type Country = "CZ" | "ES" | "US" | "UA" | "CA" | "MX" | "INTL";
export type SupportedCountry = "CZ" | "UA";

export const SUPPORTED_COUNTRIES: readonly SupportedCountry[] = ["CZ", "UA"];

export function isSupportedCountry(value: unknown): value is SupportedCountry {
  return value === "CZ" || value === "UA";
}

export const COUNTRY_LABELS: Record<SupportedCountry, string> = {
  CZ: "Česko",
  UA: "Ukrajina",
};

/** Period-correct country name for a given birth year (someone born in 1960
 *  lived in Československu, someone born in 2000 v Česku). */
export function countryLabelFor(country: SupportedCountry, birthYear: number): string {
  if (country === "CZ") return birthYear < 1993 ? "Československo" : "Česko";
  if (country === "UA") return birthYear < 1991 ? "Sovětská Ukrajina" : "Ukrajina";
  return COUNTRY_LABELS[country];
}

export type CountryDecade = {
  country: SupportedCountry;
  decadeStart: number;
  government: string[];
  clothes: string[];
  illnesses: string[];
  dailyLife: string[];
  food: string[];
  money: string[];
  bizarre: string[];
  beautiful: string[];
};

export const COUNTRY_DECADES: CountryDecade[] = regroupCountryDecades(countryDecadesJson) as unknown as CountryDecade[];

export function decadeFactsFor(country: SupportedCountry, year: number): CountryDecade | null {
  const start = Math.floor(year / 10) * 10;
  return COUNTRY_DECADES.find((d) => d.country === country && d.decadeStart === start) ?? null;
}

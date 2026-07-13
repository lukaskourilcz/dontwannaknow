import countryDecadesJson from "./countryDecades.json";
import { regroupCountryDecades } from "./_grouped";

// Per-country, per-decade snapshots. Six categories of texture (government,
// clothes, illnesses, daily life, food, money) plus a couple of "bizarre" and
// "beautiful" entries. Covers Czechoslovakia/Czech Republic, Spain, the US,
// and Ukraine/Ukrainian SSR for the 1920s through the 1970s.
//
// Each entry is one sentence so we can shuffle them freely.

export type Country = "CZ" | "ES" | "US" | "UA" | "CA" | "MX" | "INTL";

export const COUNTRY_LABELS: Record<Country, string> = {
  CZ: "Česko",
  ES: "Španělsko",
  US: "USA",
  UA: "Ukrajina",
  CA: "Kanada",
  MX: "Mexiko",
  INTL: "Kdekoliv (jen globální fakta)",
};

/** Period-correct country name for a given birth year (someone born in 1960
 *  lived in Československu, someone born in 2000 v Česku). */
export function countryLabelFor(country: Country, birthYear: number): string {
  if (country === "CZ") return birthYear < 1993 ? "Československo" : "Česko";
  if (country === "UA") return birthYear < 1991 ? "Sovětská Ukrajina" : "Ukrajina";
  return COUNTRY_LABELS[country];
}

/** Genitive of the period-correct country name — for phrases like
 *  "v čele Československa" / "v čele Sovětské Ukrajiny". */
export function countryGenitiveFor(country: Country, birthYear: number): string {
  switch (country) {
    case "CZ":
      return birthYear < 1993 ? "Československa" : "Česka";
    case "UA":
      return birthYear < 1991 ? "Sovětské Ukrajiny" : "Ukrajiny";
    case "ES":
      return "Španělska";
    case "US":
      return "USA";
    case "CA":
      return "Kanady";
    case "MX":
      return "Mexika";
    default:
      return COUNTRY_LABELS[country];
  }
}

export type CountryDecade = {
  country: Exclude<Country, "INTL">;
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

export function decadeFactsFor(country: Country, year: number): CountryDecade | null {
  if (country === "INTL") return null;
  const start = Math.floor(year / 10) * 10;
  return COUNTRY_DECADES.find((d) => d.country === country && d.decadeStart === start) ?? null;
}

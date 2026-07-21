import citiesJson from "./public/cities.json";
import type { SupportedCountry } from "./countryDecades";

export type City = {
  slug: string;
  name: string;
  aka?: string;
  country: SupportedCountry;
  region?: string;
};

/** Launch catalog. The broader legacy catalog remains in cityCatalogArchive.ts. */
export const CITIES = citiesJson as City[];

export function citiesFor(country: SupportedCountry): City[] {
  return CITIES.filter((city) => city.country === country);
}

export function findCity(slug: string | null | undefined): City | undefined {
  if (!slug) return undefined;
  return CITIES.find((city) => city.slug === slug);
}

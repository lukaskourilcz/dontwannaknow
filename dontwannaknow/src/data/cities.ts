export { CITIES, citiesFor, findCity, type City } from "./cityCatalog";
import { findCity } from "./cityCatalog";

export type CityFact = {
  city: string;
  year: number;
  text: string;
};

export async function cityFactsFor(
  citySlug: string,
  birthYear: number,
  windowYears = 90,
): Promise<CityFact[]> {
  const city = findCity(citySlug);
  if (!city) return [];
  const module = city.country === "CZ"
    ? await import("./public/cityFacts.cz.json")
    : await import("./public/cityFacts.ua.json");
  const facts = module.default as CityFact[];
  return facts.filter(
    (fact) =>
      fact.city === citySlug &&
      fact.year >= birthYear &&
      fact.year <= birthYear + windowYears,
  ).sort((a, b) => a.year - b.year);
}

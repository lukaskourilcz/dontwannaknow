import { CURRENT_YEAR } from "./datetime";
import type { SupportedCountry } from "../data/countryDecades";
import { findCity } from "../data/cityCatalog";
import { settings } from "../config/settings";

export type Person = {
  label: string;
  birthYear: number;
  country: SupportedCountry;
  citySlug: string;
  birthMonth?: number;
  birthDay?: number;
  variant: number;
};

export function displayName(person: Pick<Person, "label">): string {
  return person.label.trim() || "tento člověk";
}

export function reportTitle(person: Pick<Person, "label" | "birthYear">): string {
  const name = person.label.trim();
  return name
    ? `Tehdejší svět: ${name}`
    : `Tehdejší svět člověka narozeného v roce ${person.birthYear}`;
}

export const SUPPORTED_YEAR_RANGE = {
  min: settings.minBirthYear,
  max: CURRENT_YEAR,
} as const;

export type PersonInput = {
  name?: string;
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  country: SupportedCountry;
  citySlug: string;
  variant?: number;
};

export function normalizePerson(input: PersonInput): Person {
  return {
    label: input.name?.trim() ?? "",
    birthYear: input.birthYear,
    birthMonth: input.birthMonth,
    birthDay: input.birthDay,
    country: input.country,
    citySlug: input.citySlug,
    variant: Math.max(0, Math.floor(input.variant ?? 0)),
  };
}

export function validatePerson(person: Person): string | null {
  if (person.birthYear < SUPPORTED_YEAR_RANGE.min || person.birthYear > SUPPORTED_YEAR_RANGE.max) {
    return `Pro rok ${person.birthYear} zatím nemáme dostatek ověřených dat. Zvolte rok mezi ${SUPPORTED_YEAR_RANGE.min} a ${SUPPORTED_YEAR_RANGE.max}.`;
  }
  const hasMonth = person.birthMonth !== undefined;
  const hasDay = person.birthDay !== undefined;
  if (hasMonth !== hasDay) return "Zadejte buď jen rok, nebo celé datum narození.";
  if (hasMonth && hasDay) {
    const date = new Date(Date.UTC(person.birthYear, person.birthMonth! - 1, person.birthDay!));
    if (
      !Number.isInteger(person.birthMonth) ||
      !Number.isInteger(person.birthDay) ||
      person.birthMonth! < 1 ||
      person.birthMonth! > 12 ||
      person.birthDay! < 1 ||
      date.getUTCFullYear() !== person.birthYear ||
      date.getUTCMonth() !== person.birthMonth! - 1 ||
      date.getUTCDate() !== person.birthDay
    ) {
      return "Zadejte platné datum narození.";
    }
  }
  const city = findCity(person.citySlug);
  if (!city || city.country !== person.country) {
    return "Vyberte město, které odpovídá zvolené zemi.";
  }
  return null;
}

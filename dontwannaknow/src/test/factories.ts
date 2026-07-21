import { normalizePerson, type Person, type PersonInput } from "../lib/person";

export function makePerson(overrides: Partial<PersonInput> = {}): Person {
  return normalizePerson({
    relationship: "mother",
    birthYear: 1953,
    country: "CZ",
    citySlug: "prague",
    ...overrides,
  });
}

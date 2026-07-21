import { describe, expect, it } from "vitest";
import { contemporariesFor } from "./wikidataPeople";

describe("Wikidata role normalization", () => {
  it("exposes only reviewed Czech role fields for supported countries", () => {
    for (const country of ["CZ", "UA"] as const) {
      for (let year = 1920; year <= 2020; year += 10) {
        const people = contemporariesFor(country, year);
        expect(people.every((person) => !/(association|player|coach|scientist|singer|writer|actor|politician|painter|lawyer|teacher|engineer|athlete|historian|mathematician)/i.test(person.role))).toBe(true);
        expect(people.every((person) => !/porn|student/i.test(person.role))).toBe(true);
      }
    }
  });

  it("keeps only culturally relevant people born in the selected year", () => {
    const people = contemporariesFor("UA", 1980);
    expect(people.every((person) => person.birthYear === 1980)).toBe(true);
    expect(people.every((person) => person.role !== "politika")).toBe(true);
  });
});

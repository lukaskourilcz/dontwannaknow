import { describe, expect, it } from "vitest";
import { displayName, normalizePerson, reportTitle, SUPPORTED_YEAR_RANGE, validatePerson } from "./person";
import { makePerson } from "../test/factories";

describe("person model", () => {
  it("keeps the name optional and supplies a relationship-aware fallback", () => {
    const person = makePerson({ relationship: "grandmother", name: "  " });
    expect(displayName(person)).toBe("babička");
    expect(reportTitle(person)).toContain(String(person.birthYear));
  });

  it("normalizes labels and variants", () => {
    expect(normalizePerson({
      relationship: "self",
      name: "  Marie  ",
      birthYear: 1953,
      country: "CZ",
      citySlug: "prague",
      variant: -2.4,
    })).toMatchObject({ label: "Marie", variant: 0 });
  });

  it("rejects unsupported years, mismatched cities and invalid full dates", () => {
    expect(validatePerson(makePerson({ birthYear: SUPPORTED_YEAR_RANGE.min - 1 }))).toMatch(/rok mezi/);
    expect(validatePerson(makePerson({ country: "UA", citySlug: "prague" }))).toMatch(/odpovídá zvolené zemi/);
    expect(validatePerson(makePerson({ birthMonth: 2, birthDay: 30 }))).toBe("Zadejte platné datum narození.");
    expect(validatePerson(makePerson({ birthMonth: 2 }))).toBe("Zadejte buď jen rok, nebo celé datum narození.");
  });
});

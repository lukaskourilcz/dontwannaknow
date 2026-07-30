import { describe, expect, it } from "vitest";
import czPricesWages from "./public/pricesWages.cz.json";
import uaPricesWages from "./public/pricesWages.ua.json";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

describe("prices and wages", () => {
  it("hard-excludes Ukrainian price and ratio records in famine windows", () => {
    const forbidden = uaPricesWages.filter((record) =>
      ["price", "ratio"].includes(record.kind) &&
      (
        (record.yearFrom <= 1934 && record.yearTo >= 1932) ||
        (record.yearFrom <= 1947 && record.yearTo >= 1946)
      ));
    expect(forbidden).toEqual([]);
  });

  it("requires a currency-reform note for every Czech record intersecting 1953", () => {
    const adjacent = czPricesWages.filter((record) =>
      record.yearFrom <= 1953 && record.yearTo >= 1953);
    expect(adjacent.length).toBeGreaterThan(0);
    expect(adjacent.every((record) => record.note?.includes("měnové reformě"))).toBe(true);
  });

  it("surfaces a sourced money fact in the two required smoke reports", async () => {
    for (const person of [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 }),
    ]) {
      const report = await reportFor(person);
      const visible = report.chapters
        .flatMap((chapter) => chapter.items)
        .filter((item) => item.source?.publisher?.includes(
          person.country === "CZ" ? "Český statistický úřad" : "Státní statistická služba Ukrajiny",
        ));
      expect(visible, `${person.country}/${person.citySlug}`).not.toEqual([]);
    }
  });

  it("is deterministic for the same person", async () => {
    const person = makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 });
    const first = await reportFor(person);
    const second = await reportFor(person);
    const money = (report: typeof first) => report.facts
      .filter((fact) => fact.source?.publisher === "Státní statistická služba Ukrajiny")
      .map((fact) => fact.text);
    expect(money(first)).toEqual(money(second));
  });
});

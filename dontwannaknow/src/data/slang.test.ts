import { describe, expect, it } from "vitest";
import czechSlang from "./public/slang.cz.json";
import ukrainianSlang from "./public/slang.ua.json";
import { slangYearFor } from "./slang";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

describe("slang", () => {
  it("keeps the formative age window hard at ages 8 through 25", () => {
    const point = { yearFrom: 2000, yearTo: 2000 };
    expect(slangYearFor(point, 1992)).toBe(2000);
    expect(slangYearFor(point, 1975)).toBe(2000);
    expect(slangYearFor(point, 1993)).toBeNull();
    expect(slangYearFor(point, 1974)).toBeNull();
  });

  it("ships only Czech reader text and published dictionary evidence", () => {
    const records = [...czechSlang, ...ukrainianSlang];
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) =>
      record.evidence === "published-meaning-editorial-period" &&
      record.licence === "CC BY-SA 4.0")).toBe(true);
    expect(records.some((record) => /[\u0400-\u04ff]/u.test(
      `${record.phrase} ${record.sentence}`,
    ))).toBe(false);
    expect(records.some((record) => record.src?.p === "Wiktionary contributors"))
      .toBe(false);
  });

  it("surfaces a sourced expression in both smoke reports", async () => {
    for (const person of [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 }),
    ]) {
      const report = await reportFor(person);
      const visible = report.chapters
        .flatMap((chapter) => chapter.items)
        .filter((item) => item.category === "slang");
      expect(visible, `${person.country}/${person.citySlug}`).not.toEqual([]);
      expect(visible.every((item) => item.source?.licence === "CC BY-SA 4.0")).toBe(true);
    }
  });
});

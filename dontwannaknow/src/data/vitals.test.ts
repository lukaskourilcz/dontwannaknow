import { describe, expect, it } from "vitest";
import czVitals from "./public/vitals.cz.json";
import uaVitals from "./public/vitals.ua.json";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

describe("vitals backfill", () => {
  it("never publishes a Ukrainian vital record before 1950", () => {
    expect(uaVitals.every((record) => record.year >= 1950)).toBe(true);
  });

  it("uses the required territorial wording for pre-1993 Czech values", async () => {
    const report = await reportFor(makePerson({ birthYear: 1953 }));
    const vital = report.facts.find((fact) =>
      fact.source?.title === "World Population Prospects" &&
      fact.text.includes("naděje dožití"));
    expect(vital?.text).toContain("na území dnešního Česka");
  });

  it("builds the same measured sentence for the same fixture", async () => {
    const person = makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1953 });
    const first = await reportFor(person);
    const second = await reportFor(person);
    const vitalTexts = (report: typeof first) => report.facts
      .filter((fact) => fact.source?.title === "World Population Prospects")
      .map((fact) => fact.text);
    expect(vitalTexts(first)).toEqual(vitalTexts(second));
  });

  it("surfaces the backfill in both 1953 smoke reports", async () => {
    for (const person of [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1953 }),
    ]) {
      const report = await reportFor(person);
      const visible = report.chapters
        .flatMap((chapter) => chapter.items)
        .filter((item) => item.source?.title === "World Population Prospects");
      expect(visible, `${person.country}/${person.citySlug}`).toHaveLength(1);
    }
  });

  it("keeps only the supported backfill range and open licences", () => {
    const all = [...czVitals, ...uaVitals];
    expect(all.every((record) => record.year >= 1920 && record.year < 1960)).toBe(true);
    expect(all.every((record) => ["CC BY 3.0 IGO", "CC BY 4.0"].includes(record.licence))).toBe(true);
  });
});

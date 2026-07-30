import { describe, expect, it } from "vitest";
import names from "./public/babyNames.cz.json";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

describe("baby names", () => {
  it("keeps the sentence strength paired with the ČSÚ source basis", () => {
    expect(names.length).toBeGreaterThan(0);
    for (const record of names) {
      expect(record.country).toBe("cz");
      if (record.basis === "hlášení") {
        expect(record.sentence).toMatch(/Ve vašem ročníku.*hlášení/i);
        expect(record.sentence).not.toMatch(/dnes nejčastěji potkáte/i);
      } else {
        expect(record.basis).toBe("registr");
        expect(record.sentence).toMatch(/Mezi lidmi narozenými.*dnes nejčastěji potkáte/i);
        expect(record.sentence).not.toMatch(/dostávaly děti/i);
      }
    }
  });

  it("surfaces an exact covered Czech year with a licensed source", async () => {
    const report = await reportFor(makePerson({ birthYear: 2013 }));
    const item = report.chapters
      .flatMap((chapter) => chapter.items)
      .find((candidate) => candidate.category === "names");
    expect(item?.text).toContain("Jakub");
    expect(item?.source?.publisher).toBe("Český statistický úřad");
    expect(item?.source?.licence).toBe("CC BY 4.0");
  });

  it("omits the feature completely for Ukraine without an empty surface", async () => {
    const report = await reportFor(makePerson({
      country: "UA",
      citySlug: "kharkiv",
      birthYear: 2013,
    }));
    expect(report.facts.some((fact) => fact.category === "names")).toBe(false);
    expect(report.chapters.flatMap((chapter) => chapter.items)
      .some((item) => item.category === "names")).toBe(false);
    expect(report.chapters.find((chapter) => chapter.id === "early-childhood")?.items)
      .not.toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import czechMilestones from "./public/mediaMilestones.cz.json";
import ukrainianMilestones from "./public/mediaMilestones.ua.json";
import { isMediaMilestoneInAgeWindow } from "./mediaMilestones";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

describe("media milestones", () => {
  it("keeps child and everyday placement boundaries hard", () => {
    expect(isMediaMilestoneInAgeWindow(
      { year: 1963, placement: "early-childhood" },
      1960,
    )).toBe(true);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1970, placement: "early-childhood" },
      1960,
    )).toBe(true);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1962, placement: "early-childhood" },
      1960,
    )).toBe(false);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1971, placement: "early-childhood" },
      1960,
    )).toBe(false);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1960, placement: "everyday-day" },
      1960,
    )).toBe(true);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1978, placement: "everyday-day" },
      1960,
    )).toBe(true);
    expect(isMediaMilestoneInAgeWindow(
      { year: 1979, placement: "everyday-day" },
      1960,
    )).toBe(false);
  });

  it("ships 30 cited Czech records for each supported country", () => {
    expect(czechMilestones).toHaveLength(30);
    expect(ukrainianMilestones).toHaveLength(30);
    expect(czechMilestones.every((record) =>
      record.country === "cz" && /^Q\d+$/.test(record.wikidataId))).toBe(true);
    expect(ukrainianMilestones.every((record) =>
      record.country === "ua" && /^Q\d+$/.test(record.wikidataId))).toBe(true);
    expect([...czechMilestones, ...ukrainianMilestones].some((record) =>
      /[\u0400-\u04ff]/u.test(record.sentence))).toBe(false);
  });

  it("surfaces a P5 item in both required smoke reports without expanding budgets", async () => {
    for (const person of [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 }),
    ]) {
      const report = await reportFor(person);
      const p5 = report.chapters
        .flatMap((chapter) => chapter.items)
        .filter((item) => ["media", "slang", "names"].includes(item.category));
      expect(p5, `${person.country}/${person.citySlug}`).not.toEqual([]);
      expect(report.chapters.every((chapter) => chapter.items.length <= 8)).toBe(true);
    }
  });
});

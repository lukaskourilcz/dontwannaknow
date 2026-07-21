import { describe, expect, it } from "vitest";
import { reportFor } from "./facts";
import { makePerson } from "../test/factories";
import { CITIES } from "../data/cityCatalog";
import { COUNTRY_DECADES } from "../data/countryDecades";
import { COUNTRY_EVENTS } from "../data/countryEvents";
import { FAMOUS_PEOPLE } from "../data/famousPeople";
import czechCityFacts from "../data/public/cityFacts.cz.json";
import ukrainianCityFacts from "../data/public/cityFacts.ua.json";

describe("person-centric report composition", () => {
  it("keeps unsupported launch countries out of every public runtime dataset", () => {
    expect(CITIES.every((city) => ["CZ", "UA"].includes(city.country))).toBe(true);
    expect(COUNTRY_DECADES.every((record) => ["CZ", "UA"].includes(record.country))).toBe(true);
    expect(COUNTRY_EVENTS.every((record) => ["CZ", "UA"].includes(record.country))).toBe(true);
    expect(FAMOUS_PEOPLE.every((record) => ["CZ", "UA"].includes(record.country))).toBe(true);
    const slugs = new Set(CITIES.map((city) => city.slug));
    expect([...czechCityFacts, ...ukrainianCityFacts].every((record) => slugs.has(record.city))).toBe(true);
  });

  it("is deterministic, name-independent, and variant-aware", async () => {
    const first = await reportFor(makePerson({ name: "Anna", variant: 0 }));
    const repeat = await reportFor(makePerson({ name: "Marie", variant: 0 }));
    const variant = await reportFor(makePerson({ name: "Anna", variant: 1 }));

    expect(first.facts.map((fact) => fact.text)).toEqual(repeat.facts.map((fact) => fact.text));
    expect(first.facts.map((fact) => fact.text)).not.toEqual(variant.facts.map((fact) => fact.text));
  });

  it("keeps difficult material in the contextual chapter and out of share cards", async () => {
    const report = await reportFor(makePerson({ birthYear: 1953 }));
    const visibleItems = report.chapters.flatMap((chapter) => chapter.items);
    const difficult = visibleItems.filter((item) => item.metadata.sensitivity === "difficult");

    expect(visibleItems.slice(0, 5).every((item) => item.metadata.sensitivity !== "difficult")).toBe(true);
    expect(difficult.every((item) => item.metadata.chapter === "generation-context")).toBe(true);
    expect(report.shareItem?.metadata.shareSafe).toBe(true);

    const context = report.chapters.find((chapter) => chapter.id === "generation-context");
    const sensitivities = context?.items.map((item) => item.metadata.sensitivity) ?? [];
    expect(sensitivities.some((value, index) => value === "difficult" && sensitivities[index + 1] === "difficult"))
      .toBe(false);
  });

  it("uses exact, non-repeating milestone years", async () => {
    const report = await reportFor(makePerson({ birthYear: 1953 }));
    const ids = report.milestones.flatMap((milestone) => milestone.items.map((item) => item.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const milestone of report.milestones) {
      expect(milestone.items.every((item) => item.year === milestone.year)).toBe(true);
    }
  });

  it("keeps birth and teenage material in the correct life stage", async () => {
    const report = await reportFor(makePerson({ birthYear: 1953 }));
    const birth = report.chapters.find((chapter) => chapter.id === "birth");
    const teenage = report.chapters.find((chapter) => chapter.id === "teenage-years");
    const teenageFacts = new Set(report.facts.filter((fact) => fact.stage === "teenage-era").map((fact) => fact.text));
    const birthFacts = new Set(report.facts.filter((fact) => fact.stage === "birth-era").map((fact) => fact.text));

    expect(birth?.items.every((item) => !teenageFacts.has(item.text))).toBe(true);
    expect(teenage?.items.every((item) => !birthFacts.has(item.text))).toBe(true);
  });

  it("limits formative event chapters to birth through age eighteen", async () => {
    const report = await reportFor(makePerson({ birthYear: 1953 }));
    for (const chapterId of ["changing-world", "generation-context"] as const) {
      const chapter = report.chapters.find((candidate) => candidate.id === chapterId);
      expect(chapter?.items.every((item) => item.year === undefined || item.year <= 1971)).toBe(true);
    }
  });

  it("keeps difficult material out of birth and childhood across supported contexts", async () => {
    const profiles = [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1939 }),
      makePerson({ country: "CZ", citySlug: "brno", birthYear: 1953 }),
      makePerson({ country: "CZ", citySlug: "ostrava", birthYear: 1968 }),
      makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1932 }),
      makePerson({ country: "UA", citySlug: "lviv", birthYear: 1950 }),
      makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1980 }),
      makePerson({ country: "UA", citySlug: "odesa", birthYear: 2000 }),
    ];

    for (const profile of profiles) {
      for (const variant of [0, 1, 2]) {
        const report = await reportFor({ ...profile, variant });
        const prominent = report.chapters
          .filter((chapter) => chapter.id === "birth" || chapter.id === "early-childhood")
          .flatMap((chapter) => chapter.items);
        expect(prominent.every((item) => item.metadata.sensitivity !== "difficult")).toBe(true);
        const outsideContext = report.chapters
          .filter((chapter) => chapter.id !== "generation-context")
          .flatMap((chapter) => chapter.items);
        expect(outsideContext.every((item) => item.metadata.sensitivity !== "difficult")).toBe(true);
      }
    }
  });

  it("keeps every default report balanced, impersonal, and locally scoped", async () => {
    const profiles = [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1939 }),
      makePerson({ country: "CZ", citySlug: "brno", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1980 }),
      makePerson({ country: "UA", citySlug: "odesa", birthYear: 2000 }),
    ];
    const personalCertainty = /určitě (zažil|prožil|četl|sledoval)|jeho vlastní vzpomín|její vlastní vzpomín/i;
    const misplacedGlobalCulture = /MySpace|AIM|spring break|prom night/i;

    for (const profile of profiles) {
      for (const variant of [0, 1, 2]) {
        const report = await reportFor({ ...profile, variant });
        const items = report.chapters.flatMap((chapter) => chapter.items);
        const serious = items.filter((item) => item.metadata.tone === "serious");
        expect(serious.length / items.length).toBeLessThan(0.4);
        expect(items.every((item) => !personalCertainty.test(item.text))).toBe(true);
        expect(items.every((item) => !misplacedGlobalCulture.test(item.text))).toBe(true);
        expect(report.chapters.filter((chapter) => chapter.id !== "life-numbers")
          .every((chapter) => chapter.items.length > 0)).toBe(true);
        expect(report.milestones.every((milestone) => milestone.items.every((item) =>
          item.metadata.sensitivity === "none" && item.metadata.tone !== "serious",
        ))).toBe(true);
      }
    }
  });

  it("does not surface hype-driven or synthetic editorial phrasing", async () => {
    const slop = /ohromil svět|kultovní|superhvězd|nejvtipnější|obrovskou popularitu|mistrovské dílo|Sinatra Východu|Walt Disney Východu|skutečným bestsellerem|drtivým vítězstvím|hrdinského přivítání|odvážná operace|šťavnaté hlášky|rudá mašina|oslnily zahraniční|ambiciózní podívanou|podmanilo mladé publikum|poslušně potvrdily|nedošlého vůdce|ochromeném městě|líhní/i;
    for (const country of ["CZ", "UA"] as const) {
      for (let birthYear = 1920; birthYear <= 2020; birthYear += 10) {
        const citySlug = country === "CZ" ? "prague" : "kyiv";
        for (const variant of [0, 1, 2]) {
          const report = await reportFor(makePerson({ country, citySlug, birthYear, variant }));
          const offenders = report.chapters
            .flatMap((chapter) => chapter.items)
            .map((item) => item.text)
            .filter((text) => slop.test(text));
          expect(offenders, `${country} ${birthYear}, varianta ${variant}`).toEqual([]);
        }
      }
    }
  });
});

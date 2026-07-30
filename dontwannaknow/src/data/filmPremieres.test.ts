import { describe, expect, it } from "vitest";
import czFilms from "./public/filmPremieres.cz.json";
import uaFilms from "./public/filmPremieres.ua.json";
import {
  hasAllowedFilmOrigin,
  placementForFilm,
  type FilmPremiere,
} from "./filmPremieres";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

const originFixture = (
  country: "cz" | "ua",
  originIds: string[],
  studioIds: string[],
): Pick<FilmPremiere, "country" | "originIds" | "studioIds"> => ({
  country,
  originIds,
  studioIds,
});

describe("film premieres", () => {
  it("keeps the childhood and teenage age-window boundaries hard", () => {
    expect(placementForFilm({ year: 1956, fairyTale: true }, 1953)).toBe("childhood");
    expect(placementForFilm({ year: 1962, fairyTale: true }, 1953)).toBe("childhood");
    expect(placementForFilm({ year: 1955, fairyTale: true }, 1953)).toBeNull();
    expect(placementForFilm({ year: 1962, fairyTale: false }, 1953)).toBeNull();
    expect(placementForFilm({ year: 1963, fairyTale: false }, 1953)).toBe("teenage");
    expect(placementForFilm({ year: 1970, fairyTale: false }, 1953)).toBe("teenage");
    expect(placementForFilm({ year: 1971, fairyTale: false }, 1953)).toBeNull();
  });

  it("rejects generic Mosfilm while allowing only the declared origins and studios", () => {
    expect(hasAllowedFilmOrigin(originFixture("cz", ["Q33946"], []))).toBe(true);
    expect(hasAllowedFilmOrigin(originFixture("cz", ["Q213", "Q30"], []))).toBe(false);
    expect(hasAllowedFilmOrigin(originFixture("ua", ["Q212"], []))).toBe(true);
    expect(hasAllowedFilmOrigin(originFixture("ua", ["Q15180"], ["Q577589"]))).toBe(true);
    expect(hasAllowedFilmOrigin(originFixture("ua", ["Q15180"], ["Q141336"]))).toBe(false);
  });

  it("ships only records that pass the origin gate and have a Czech reader layer", () => {
    expect(czFilms.every((record) => hasAllowedFilmOrigin({
      country: "cz",
      originIds: record.originIds,
      studioIds: record.studioIds,
    }))).toBe(true);
    expect(uaFilms.every((record) => hasAllowedFilmOrigin({
      country: "ua",
      originIds: record.originIds,
      studioIds: record.studioIds,
    }))).toBe(true);
    expect([...czFilms, ...uaFilms].some((record) => /[\u0400-\u04ff]/u.test(
      `${record.title} ${record.sentence}`,
    ))).toBe(false);
  });

  it("marks an occupation-context override as difficult and not share-safe", () => {
    const occupation = czFilms.find((record) => record.wikidataId === "Q595196");
    expect(occupation?.curated).toBe(true);
    expect(occupation?.sensitivity).toBe("difficult");
    expect(occupation?.shareSafe).toBe(false);
  });

  it("surfaces a sourced film in both smoke reports without exceeding chapter budgets", async () => {
    for (const person of [
      makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }),
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 }),
    ]) {
      const report = await reportFor(person);
      const films = report.chapters
        .flatMap((chapter) => chapter.items)
        .filter((item) => item.category === "film");
      expect(films, `${person.country}/${person.citySlug}`).not.toEqual([]);
      expect(films.every((item) => item.source?.publisher === "Wikidata")).toBe(true);
      expect(report.chapters.every((chapter) => chapter.items.length <= 8)).toBe(true);
    }
  });

  it("does not let difficult film context become default share content", async () => {
    const person = makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 });
    const report = await reportFor(person);
    expect(report.shareItem?.text).not.toContain("Obchod na korze");
    expect(report.chapters.flatMap((chapter) => chapter.items)
      .some((item) => item.text.includes("Obchod na korze"))).toBe(false);
  });

  it("is deterministic for the same person", async () => {
    const person = makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 });
    const first = await reportFor(person);
    const second = await reportFor(person);
    const films = (report: typeof first) => report.facts
      .filter((fact) => fact.category === "film")
      .map((fact) => fact.text);
    expect(films(first)).toEqual(films(second));
  });
});

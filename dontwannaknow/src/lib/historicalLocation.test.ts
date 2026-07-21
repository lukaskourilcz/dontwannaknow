import { describe, expect, it } from "vitest";
import { resolveHistoricalLocation } from "./historicalLocation";
import { makePerson } from "../test/factories";

describe("resolveHistoricalLocation", () => {
  it.each([
    [1938, "czechoslovakia", "Československo"],
    [1942, "protectorate-bohemia-moravia", "Protektorát Čechy a Morava"],
    [1975, "czech-socialist-republic", "Česká socialistická republika"],
    [1992, "czech-republic-federation", "Česká republika"],
    [2000, "czech-republic", "Česká republika"],
  ])("resolves Czech context for %i", (birthYear, entity, label) => {
    const context = resolveHistoricalLocation(makePerson({ birthYear }));
    expect(context.historicalStateId).toBe(entity);
    expect(context.historicalStateLabel).toBe(label);
  });

  it("resolves western Ukrainian border changes and historical city names", () => {
    expect(resolveHistoricalLocation(makePerson({ country: "UA", citySlug: "lviv", birthYear: 1938 })).historicalStateLabel)
      .toBe("Polská republika");
    expect(resolveHistoricalLocation(makePerson({ country: "UA", citySlug: "chernivtsi", birthYear: 1939 })).historicalStateLabel)
      .toBe("Rumunské království");
    expect(resolveHistoricalLocation(makePerson({ country: "UA", citySlug: "dnipro", birthYear: 1953 })).historicalCityLabel)
      .toBe("Dněpropetrovsk");
  });

  it("uses exact dates at Czech historical boundaries", () => {
    const beforeProtectorate = resolveHistoricalLocation(makePerson({ birthYear: 1939, birthMonth: 2, birthDay: 28 }));
    const duringProtectorate = resolveHistoricalLocation(makePerson({ birthYear: 1939, birthMonth: 3, birthDay: 15 }));
    const afterProtectorate = resolveHistoricalLocation(makePerson({ birthYear: 1945, birthMonth: 5, birthDay: 9 }));
    expect(beforeProtectorate.historicalStateId).toBe("czechoslovakia");
    expect(duringProtectorate.historicalStateId).toBe("protectorate-bohemia-moravia");
    expect(afterProtectorate.historicalStateId).toBe("czechoslovakia");
    expect(resolveHistoricalLocation(makePerson({ birthYear: 1939 })).transition).toBe(true);
  });

  it("distinguishes the Ukrainian SSR from independent Ukraine", () => {
    const soviet = resolveHistoricalLocation(makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1980 }));
    expect(soviet.historicalStateLabel).toBe("Ukrajinská SSR");
    expect(soviet.widerStateLabel).toBe("Sovětský svaz");

    const independent = resolveHistoricalLocation(makePerson({
      country: "UA",
      citySlug: "kyiv",
      birthYear: 1991,
      birthMonth: 8,
      birthDay: 24,
    }));
    expect(independent.historicalStateLabel).toBe("Ukrajina");
    expect(independent.widerStateLabel).toBeUndefined();
    expect(resolveHistoricalLocation(makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1991 })).transition)
      .toBe(true);
  });

  it("keeps pre-transfer Crimea in the Russian SFSR context", () => {
    const before = resolveHistoricalLocation(makePerson({
      country: "UA",
      citySlug: "simferopol",
      birthYear: 1954,
      birthMonth: 2,
      birthDay: 18,
    }));
    const after = resolveHistoricalLocation(makePerson({
      country: "UA",
      citySlug: "simferopol",
      birthYear: 1954,
      birthMonth: 2,
      birthDay: 19,
    }));
    expect(before.historicalStateId).toBe("russian-sfsr-ussr");
    expect(after.historicalStateId).toBe("ukrainian-ssr-ussr");
  });
});

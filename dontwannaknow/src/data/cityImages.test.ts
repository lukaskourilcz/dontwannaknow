import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { encodeReportState } from "../lib/share";
import { makePerson } from "../test/factories";
import {
  cityImagesForBirthYear,
  loadCityImages,
  type CityImage,
  type CityImageLoaders,
} from "./cityImages";

const image = (overrides: Partial<CityImage> = {}): CityImage => ({
  id: "prague-1950-test",
  city: "prague",
  decade: 1950,
  yearApprox: "1954",
  dateCertainty: "year",
  file: "prague/1950/prague-1950-test.webp",
  alt: "Černobílá fotografie pražské ulice s tramvají a chodci.",
  caption: "Pražská ulice s běžným provozem v roce 1954.",
  licence: "CC BY-SA 4.0",
  licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: "Autor snímku, Wikimedia Commons",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Test.jpg",
  width: 1_000,
  height: 700,
  ...overrides,
});

describe("cityImages", () => {
  it("vrátí pouze přesné desetiletí a zachová kurátorské pořadí", () => {
    const first = image();
    const second = image({ id: "prague-1950-druhy" });
    const other = image({ id: "prague-1960-jiny", decade: 1960 });
    expect(cityImagesForBirthYear([first, second, other], 1953)).toEqual([first, second]);
    expect(cityImagesForBirthYear([first, other], 1962)).toEqual([other]);
    expect(cityImagesForBirthYear([first, other], 1981)).toEqual([]);
  });

  it("načte jen pražský řez a nepožádá o jiná města", async () => {
    const prague = vi.fn(async () => [image()]);
    const brno = vi.fn(async () => [image({ city: "brno" })]);
    const loaders: CityImageLoaders = { prague, brno };

    await expect(loadCityImages("prague", 1953, loaders)).resolves.toHaveLength(1);
    expect(prague).toHaveBeenCalledOnce();
    expect(brno).not.toHaveBeenCalled();
  });

  it("neznámé nebo nepokryté město tiše přenechá místo uměleckému fallbacku", async () => {
    await expect(loadCityImages("usti-nad-labem", 1950, {})).resolves.toEqual([]);
  });

  it("fotografie nevstupují do fragmentu, sdílecího canvasu ani PDF", async () => {
    const state = encodeReportState([
      makePerson({ citySlug: "prague", country: "CZ", birthYear: 1953 }),
    ]);
    expect(state).not.toMatch(/cityImages|data\/images|webp/i);

    const exportSources = await Promise.all([
      readFile(resolve(process.cwd(), "src/lib/shareImage.ts"), "utf8"),
      readFile(resolve(process.cwd(), "src/lib/pdf.ts"), "utf8"),
    ]);
    expect(exportSources.join("\n")).not.toMatch(/cityImages|\/data\/images\//);
  });
});

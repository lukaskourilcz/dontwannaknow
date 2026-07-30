import { afterEach, describe, expect, it, vi } from "vitest";
import templatesJson from "./public/weatherTemplates.json";
import {
  loadBirthWeather,
  weatherFactForDay,
  weatherFactForYear,
  type PackedWeatherYear,
  type WeatherTemplateRaw,
  type WeatherYearSummary,
} from "./birthWeather";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";

const templates = templatesJson as WeatherTemplateRaw[];

const jsonResponse = (value: unknown) =>
  Promise.resolve(new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("birth weather", () => {
  it("marks every public sentence as an ERA5 reconstruction, never a measurement", () => {
    expect(templates).toHaveLength(8);
    for (const template of templates) {
      expect(template.template).toMatch(/meteorologické rekonstrukce ERA5/i);
      expect(template.template).not.toMatch(/naměřen|meteorologové naměřili/i);
    }
  });

  it("does not request data before 1940 or without a city", async () => {
    const fetcher = vi.fn();
    await expect(loadBirthWeather(
      makePerson({ birthYear: 1935, birthMonth: 1, birthDay: 1 }),
      fetcher,
    )).resolves.toBeUndefined();
    await expect(loadBirthWeather(
      { ...makePerson({ birthYear: 1953 }), citySlug: "" },
      fetcher,
    )).resolves.toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("uses only the selected year file for a full birth date", async () => {
    const fetcher = vi.fn((input: RequestInfo | URL) => {
      expect(input).toBe("/data/weather/prague/1953.json");
      return jsonResponse({
        v: 1,
        from: "1953-01-01",
        t0: [-80],
        t1: [-30],
        p: [0],
        s: [0],
      });
    });
    const fact = await loadBirthWeather(
      makePerson({ birthYear: 1953, birthMonth: 1, birthDay: 1 }),
      fetcher,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith("/data/weather/prague/1953.json");
    expect(fetcher.mock.calls[0][0]).not.toContain("summary");
    expect(fact?.text).toContain("meteorologické rekonstrukce ERA5");
  });

  it("uses only the summary for a year-only report", async () => {
    const fetcher = vi.fn((input: RequestInfo | URL) => {
      expect(input).toBe("/data/weather/kharkiv/summary.json");
      return jsonResponse({
        v: 1,
        years: [{
          y: 1991,
          c: true,
          wi: -20,
          su: 190,
          sd: 20,
          hd: 3,
          wd: 4,
          cp: 40,
          hp: 48,
          n: 25,
        }],
      });
    });
    const fact = await loadBirthWeather(
      makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 }),
      fetcher,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith("/data/weather/kharkiv/summary.json");
    expect(fetcher.mock.calls[0][0]).not.toMatch(/\/1991\.json$/);
    expect(fact?.text).toContain("v roce 1991");
  });

  it("permits a superlative only with a complete year and 20 reference years", () => {
    const summary: WeatherYearSummary = {
      y: 1970,
      c: true,
      wi: -65,
      su: 183,
      sd: 34,
      hd: 1,
      wd: 5,
      cp: 92,
      hp: 36,
      n: 25,
    };
    expect(weatherFactForYear(templates, summary, "Brno")?.text)
      .toContain("k nejchladnější pětině");
    expect(weatherFactForYear(templates, { ...summary, n: 19 }, "Brno")?.text)
      .toContain("průměrnou denní teplotu");
    expect(weatherFactForYear(templates, { ...summary, c: false }, "Brno"))
      .toBeUndefined();
  });

  it("renders the same packed day deterministically", () => {
    const packed: PackedWeatherYear = {
      v: 1,
      from: "1953-01-01",
      t0: [-20],
      t1: [40],
      p: [125],
      s: [0],
    };
    const first = weatherFactForDay(templates, packed, "Praha", 1953, 1, 1);
    const second = weatherFactForDay(templates, packed, "Praha", 1953, 1, 1);
    expect(first).toEqual(second);
    expect(first?.text).toContain("12,5 mm");
  });

  it("shows at most one weather item and never lets it open the birth chapter", async () => {
    vi.stubGlobal("fetch", vi.fn(() => jsonResponse({
      v: 1,
      from: "1953-01-01",
      t0: [-80],
      t1: [-30],
      p: [0],
      s: [0],
    })));
    const report = await reportFor(
      makePerson({ birthYear: 1953, birthMonth: 1, birthDay: 1 }),
    );
    const birth = report.chapters.find((chapter) => chapter.id === "birth");
    const weather = birth?.items.filter((item) => item.category === "weather") ?? [];
    expect(birth?.items.length).toBeLessThanOrEqual(4);
    expect(weather).toHaveLength(1);
    expect(birth?.items[0].category).not.toBe("weather");
    expect(weather[0].metadata.mayOpen).toBe(false);
  });
});

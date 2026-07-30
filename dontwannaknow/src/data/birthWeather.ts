import { findCity } from "./cityCatalog";
import type { Person } from "../lib/person";
import { expandRelevance, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

type WeatherTemplateClass =
  | "frost-wave"
  | "tropical"
  | "snow"
  | "rain"
  | "ordinary"
  | "cold-winter"
  | "hot-summer"
  | "seasonal";

export type WeatherTemplateRaw = {
  id: string;
  scope: "day" | "year";
  class: WeatherTemplateClass;
  template: string;
  rel?: number[];
  src?: { t: string; p?: string; u?: string };
};

export type PackedWeatherYear = {
  v: 1;
  from: string;
  t0: Array<number | null>;
  t1: Array<number | null>;
  p: Array<number | null>;
  s: Array<number | null>;
};

export type WeatherYearSummary = {
  y: number;
  /** Pouze uzavřený kalendářní rok smí nést sezonní tvrzení. */
  c: boolean;
  /** Průměrné teploty a denní součty jsou uložené v desetinách. */
  wi: number | null;
  su: number | null;
  sd: number;
  hd: number;
  wd: number;
  cp: number | null;
  hp: number | null;
  n: number;
};

type WeatherSummaryFile = {
  v: 1;
  years: WeatherYearSummary[];
};

export type BirthWeatherFact = {
  text: string;
  relevance?: RelevanceScores;
  source: FactSource;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const ERA5_SOURCE: FactSource = {
  title: "Historical Weather API · ERA5",
  publisher: "Open-Meteo",
  url: "https://open-meteo.com/en/docs/historical-weather-api",
};

let templatesPromise: Promise<WeatherTemplateRaw[]> | undefined;

async function loadTemplates(): Promise<WeatherTemplateRaw[]> {
  templatesPromise ??= import("./public/weatherTemplates.json")
    .then((module) => module.default as WeatherTemplateRaw[]);
  return templatesPromise;
}

function templateFor(
  templates: WeatherTemplateRaw[],
  scope: WeatherTemplateRaw["scope"],
  templateClass: WeatherTemplateClass,
): WeatherTemplateRaw | undefined {
  return templates.find((template) =>
    template.scope === scope && template.class === templateClass);
}

function sourceFor(template: WeatherTemplateRaw): FactSource {
  return template.src
    ? { title: template.src.t, publisher: template.src.p, url: template.src.u }
    : ERA5_SOURCE;
}

function render(
  template: WeatherTemplateRaw,
  values: Record<string, string | number>,
): BirthWeatherFact {
  const text = Object.entries(values).reduce(
    (sentence, [key, value]) => sentence.replaceAll(`{${key}}`, String(value)),
    template.template,
  );
  return {
    text,
    relevance: expandRelevance(template.rel),
    source: sourceFor(template),
  };
}

function formatTenths(value: number): string {
  return (value / 10).toLocaleString("cs-CZ", {
    minimumFractionDigits: value % 10 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function dayOffset(from: string, year: number, month: number, day: number): number {
  const fromMilliseconds = Date.parse(`${from}T00:00:00Z`);
  const selectedMilliseconds = Date.UTC(year, month - 1, day);
  return Math.round((selectedMilliseconds - fromMilliseconds) / 86_400_000);
}

export function weatherFactForDay(
  templates: WeatherTemplateRaw[],
  packed: PackedWeatherYear,
  city: string,
  year: number,
  month: number,
  day: number,
): BirthWeatherFact | undefined {
  const index = dayOffset(packed.from, year, month, day);
  const minimum = packed.t0[index];
  const maximum = packed.t1[index];
  const precipitation = packed.p[index];
  const snowfall = packed.s[index];
  if (
    index < 0 ||
    minimum == null ||
    maximum == null ||
    precipitation == null ||
    snowfall == null
  ) {
    return undefined;
  }

  const templateClass: WeatherTemplateClass = maximum <= -50
    ? "frost-wave"
    : maximum >= 300
      ? "tropical"
      : snowfall >= 10
        ? "snow"
        : precipitation >= 100
          ? "rain"
          : "ordinary";
  const template = templateFor(templates, "day", templateClass);
  if (!template) return undefined;
  return render(template, {
    city,
    min: formatTenths(minimum),
    max: formatTenths(maximum),
    precipitation: formatTenths(precipitation),
    snow: formatTenths(snowfall),
  });
}

export function weatherFactForYear(
  templates: WeatherTemplateRaw[],
  summary: WeatherYearSummary,
  city: string,
): BirthWeatherFact | undefined {
  if (!summary.c || summary.wi == null || summary.su == null) return undefined;

  const hasReference = summary.n >= 20;
  const cold = hasReference && (summary.cp ?? 0) >= 80;
  const hot = hasReference && (summary.hp ?? 0) >= 80;
  const templateClass: WeatherTemplateClass = cold && hot
    ? (summary.cp! >= summary.hp! ? "cold-winter" : "hot-summer")
    : cold
      ? "cold-winter"
      : hot
        ? "hot-summer"
        : "seasonal";
  const template = templateFor(templates, "year", templateClass);
  if (!template) return undefined;
  return render(template, {
    city,
    year: summary.y,
    winter: formatTenths(summary.wi),
    summer: formatTenths(summary.su),
  });
}

async function fetchJson<T>(fetcher: FetchLike, path: string): Promise<T | undefined> {
  try {
    const response = await fetcher(path);
    if (!response.ok) return undefined;
    return await response.json() as T;
  } catch {
    return undefined;
  }
}

/**
 * Načte právě jeden řez ze statických souborů: celé datum jen svůj roční
 * soubor, samotný rok jen souhrn. Před rokem 1940 a bez města mlčí.
 */
export async function loadBirthWeather(
  person: Pick<Person, "birthYear" | "birthMonth" | "birthDay" | "citySlug">,
  fetcher: FetchLike = fetch,
): Promise<BirthWeatherFact | undefined> {
  if (person.birthYear < 1940) return undefined;
  const city = findCity(person.citySlug);
  if (!city) return undefined;
  const templates = await loadTemplates();
  const base = `/data/weather/${encodeURIComponent(city.slug)}`;

  if (person.birthMonth !== undefined && person.birthDay !== undefined) {
    const packed = await fetchJson<PackedWeatherYear>(
      fetcher,
      `${base}/${person.birthYear}.json`,
    );
    return packed
      ? weatherFactForDay(
        templates,
        packed,
        city.name,
        person.birthYear,
        person.birthMonth,
        person.birthDay,
      )
      : undefined;
  }

  const summary = await fetchJson<WeatherSummaryFile>(fetcher, `${base}/summary.json`);
  const year = summary?.years.find((record) => record.y === person.birthYear);
  return year ? weatherFactForYear(templates, year, city.name) : undefined;
}

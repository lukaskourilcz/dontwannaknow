import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

const CZECH_ORIGINS = new Set(["Q33946", "Q213"]);
const UKRAINIAN_STUDIOS = new Set(["Q577589", "Q2628487", "Q16852254", "Q4470719"]);

export type FilmPlacement = "childhood" | "teenage";

type FilmPremiereRaw = {
  id: string;
  country: "cz" | "ua";
  wikidataId: string;
  title: string;
  year: number;
  decadeStart: number;
  originIds: string[];
  studioIds: string[];
  genreIds: string[];
  fairyTale: boolean;
  sitelinks: number;
  sentence: string;
  sensitivity: "none" | "mild" | "difficult";
  shareSafe: boolean;
  licence: "CC0 1.0";
  curated: boolean;
  rel?: number[];
  src?: { t: string; p?: string; u?: string };
};

export type FilmPremiere = Omit<FilmPremiereRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
};

export type FormativeFilm = FilmPremiere & { placement: FilmPlacement };

const cache: Partial<Record<SupportedCountry, FilmPremiere[]>> = {};

function expand(record: FilmPremiereRaw): FilmPremiere {
  const { rel, src, ...rest } = record;
  return {
    ...rest,
    relevance: expandRelevance(rel),
    source: src ? { title: src.t, publisher: src.p, url: src.u } : undefined,
  };
}

/** Obranná běhová brána kopíruje pravidlo generátoru. Skóre ji nepřebíjí. */
export function hasAllowedFilmOrigin(record: Pick<FilmPremiere, "country" | "originIds" | "studioIds">): boolean {
  if (record.country === "cz") {
    return record.originIds.length > 0
      && record.originIds.every((origin) => CZECH_ORIGINS.has(origin));
  }
  return record.originIds.includes("Q212")
    || (
      record.originIds.includes("Q15180")
      && record.studioIds.some((studio) => UKRAINIAN_STUDIOS.has(studio))
    );
}

/** Dětství připouští jen filmovou pohádku; dospívání libovolný film. */
export function placementForFilm(
  record: Pick<FilmPremiere, "year" | "fairyTale">,
  birthYear: number,
): FilmPlacement | null {
  const age = record.year - birthYear;
  if (record.fairyTale && age >= 3 && age <= 9) return "childhood";
  if (age >= 10 && age <= 17) return "teenage";
  return null;
}

/** Načte pouze národní filmový řez zvoleného člověka. */
export async function loadFilmPremieres(country: SupportedCountry): Promise<void> {
  if (cache[country]) return;
  const module = country === "CZ"
    ? await import("./public/filmPremieres.cz.json")
    : await import("./public/filmPremieres.ua.json");
  cache[country] = (module.default as FilmPremiereRaw[])
    .map(expand)
    .filter(hasAllowedFilmOrigin);
}

export function filmPremieresFor(
  country: SupportedCountry,
  birthYear: number,
): FormativeFilm[] {
  const eligible = (cache[country] ?? []).flatMap((record) => {
    const placement = placementForFilm(record, birthYear);
    return placement ? [{ ...record, placement }] : [];
  });
  const childhood = pickRelevant(
    eligible.filter((record) => record.placement === "childhood"),
    2,
    (record) => record.relevance,
  );
  const teenage = pickRelevant(
    eligible.filter((record) => record.placement === "teenage"),
    3,
    (record) => record.relevance,
  );
  return [...childhood, ...teenage].sort((first, second) => first.year - second.year);
}

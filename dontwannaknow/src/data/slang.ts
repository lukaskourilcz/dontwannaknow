import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

type SlangRaw = {
  id: string;
  country: "cz" | "ua";
  yearFrom: number;
  yearTo: number;
  phrase: string;
  sentence: string;
  evidence: "published-meaning-editorial-period";
  licence: "CC BY-SA 4.0";
  rel?: number[];
  src?: { t: string; p?: string; u?: string; l?: string; a?: string };
};

export type SlangRecord = Omit<SlangRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
  year: number;
};

const cache: Partial<Record<SupportedCountry, Omit<SlangRecord, "year">[]>> = {};

function expand(record: SlangRaw): Omit<SlangRecord, "year"> {
  const { rel, src, ...rest } = record;
  return {
    ...rest,
    relevance: expandRelevance(rel),
    source: src
      ? {
          title: src.t,
          publisher: src.p,
          url: src.u,
          licence: src.l,
          attribution: src.a,
        }
      : undefined,
  };
}

/** Tvrdé věkové okno: výraz smí patřit jen do období věku 8–25 let. */
export function slangYearFor(
  record: Pick<SlangRecord, "yearFrom" | "yearTo">,
  birthYear: number,
): number | null {
  const firstEligibleYear = Math.max(record.yearFrom, birthYear + 8);
  const lastEligibleYear = Math.min(record.yearTo, birthYear + 25);
  return firstEligibleYear <= lastEligibleYear ? firstEligibleYear : null;
}

export async function loadSlang(country: SupportedCountry): Promise<void> {
  if (cache[country]) return;
  const module = country === "CZ"
    ? await import("./public/slang.cz.json")
    : await import("./public/slang.ua.json");
  cache[country] = (module.default as SlangRaw[]).map(expand);
}

export function slangFor(country: SupportedCountry, birthYear: number): SlangRecord[] {
  const eligible = (cache[country] ?? []).flatMap((record) => {
    const year = slangYearFor(record, birthYear);
    return year === null ? [] : [{ ...record, year }];
  });
  return pickRelevant(eligible, 3, (record) => record.relevance);
}

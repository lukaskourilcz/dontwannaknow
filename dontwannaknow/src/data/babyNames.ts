import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

type BabyNameBasis = "registr" | "hlášení";

type BabyNamesRaw = {
  id: string;
  country: "cz";
  year: number;
  basis: BabyNameBasis;
  boys: string[];
  girls: string[];
  sentence: string;
  licence: "CC BY 4.0";
  rel?: number[];
  src?: { t: string; p?: string; u?: string; l?: string; a?: string };
};

export type BabyNamesRecord = Omit<BabyNamesRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
};

let czechRecords: BabyNamesRecord[] | undefined;

function expand(record: BabyNamesRaw): BabyNamesRecord {
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

/** Ukrajinská větev je záměrně prázdná: otevřený kohortní zdroj chybí. */
export async function loadBabyNames(country: SupportedCountry): Promise<void> {
  if (country === "UA" || czechRecords) return;
  const module = await import("./public/babyNames.cz.json");
  czechRecords = (module.default as BabyNamesRaw[]).map(expand);
}

export function babyNamesFor(country: SupportedCountry, birthYear: number): BabyNamesRecord[] {
  if (country !== "CZ") return [];
  return pickRelevant(
    (czechRecords ?? []).filter((record) => record.year === birthYear),
    1,
    (record) => record.relevance,
  );
}

import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

export type VitalSeries = "lifeExpectancy" | "childMortality";

type VitalRecordRaw = {
  country: "cz" | "ua";
  series: VitalSeries;
  year: number;
  value: number;
  upstream: "UN WPP" | "HMD" | "Gapminder";
  licence: "CC BY 3.0 IGO" | "CC BY 4.0";
  rel?: number[];
  src?: { t: string; p?: string; u?: string };
};

export type VitalRecord = Omit<VitalRecordRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
};

const cache: Partial<Record<SupportedCountry, VitalRecord[]>> = {};

function expand(record: VitalRecordRaw): VitalRecord {
  const { rel, src, ...rest } = record;
  return {
    ...rest,
    relevance: expandRelevance(rel),
    source: src ? { title: src.t, publisher: src.p, url: src.u } : undefined,
  };
}

/** Líné načtení před-1960 řad pouze pro zvolenou zemi. */
export async function loadVitals(country: SupportedCountry): Promise<void> {
  if (cache[country]) return;
  const module = country === "CZ"
    ? await import("./public/vitals.cz.json")
    : await import("./public/vitals.ua.json");
  cache[country] = (module.default as VitalRecordRaw[]).map(expand);
}

export function vitalsFor(
  country: SupportedCountry,
  year: number,
): VitalRecord[] {
  const records = (cache[country] ?? []).filter((record) => record.year === year);
  return pickRelevant(records, 2, (record) => record.relevance);
}

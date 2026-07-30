import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource } from "../lib/report";

export type PriceWageKind = "price" | "wage" | "ratio";

type PriceWageRecordRaw = {
  id: string;
  country: "cz" | "ua";
  yearFrom: number;
  yearTo: number;
  kind: PriceWageKind;
  sentence: string;
  values: Record<string, string | number>;
  note?: string;
  rel?: number[];
  src?: { t: string; p?: string; u?: string };
};

export type PriceWageRecord = Omit<PriceWageRecordRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
};

const cache: Partial<Record<SupportedCountry, PriceWageRecord[]>> = {};

function expand(record: PriceWageRecordRaw): PriceWageRecord {
  const { rel, src, ...rest } = record;
  return {
    ...rest,
    relevance: expandRelevance(rel),
    source: src ? { title: src.t, publisher: src.p, url: src.u } : undefined,
  };
}

/** Načte pouze malý peněžní řez pro zvolenou zemi. */
export async function loadPricesWages(country: SupportedCountry): Promise<void> {
  if (cache[country]) return;
  const module = country === "CZ"
    ? await import("./public/pricesWages.cz.json")
    : await import("./public/pricesWages.ua.json");
  cache[country] = (module.default as PriceWageRecordRaw[]).map(expand);
}

/**
 * Vybere nejvýše dva doklady z formativních let. Přímá shoda s rokem narození
 * má přednost; zbytek může doplnit dospívání, nikdy však období po 18. roce.
 */
export function pricesWagesFor(
  country: SupportedCountry,
  birthYear: number,
): PriceWageRecord[] {
  const records = (cache[country] ?? []).filter((record) =>
    record.yearFrom <= birthYear + 18 && record.yearTo >= birthYear);
  const atBirth = records.filter((record) =>
    record.yearFrom <= birthYear && record.yearTo >= birthYear);
  const selected = pickRelevant(atBirth, 1, (record) => record.relevance);
  const selectedIds = new Set(selected.map((record) => record.id));
  const later = pickRelevant(
    records.filter((record) => !selectedIds.has(record.id)),
    1,
    (record) => record.relevance,
  );
  return [...selected, ...later].sort((a, b) => a.yearFrom - b.yearFrom);
}

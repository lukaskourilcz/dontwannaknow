import type { SupportedCountry } from "./countryDecades";
import { expandRelevance, pickRelevant, type RelevanceScores } from "../lib/relevance";
import type { FactSource, ReportChapterId } from "../lib/report";

export type MediaMilestonePlacement = "early-childhood" | "everyday-day";

type MediaMilestoneRaw = {
  id: string;
  country: "cz" | "ua";
  year: number;
  placement: MediaMilestonePlacement;
  wikidataId: string;
  sentence: string;
  licence: "CC0 1.0" | "CC BY-SA 4.0";
  shareSafe: boolean;
  rel?: number[];
  src?: { t: string; p?: string; u?: string; l?: string; a?: string };
};

export type MediaMilestone = Omit<MediaMilestoneRaw, "rel" | "src"> & {
  relevance?: RelevanceScores;
  source?: FactSource;
  chapter: Extract<ReportChapterId, MediaMilestonePlacement>;
};

const cache: Partial<Record<SupportedCountry, Omit<MediaMilestone, "chapter">[]>> = {};

function expand(record: MediaMilestoneRaw): Omit<MediaMilestone, "chapter"> {
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

/** Dětské pořady jsou relevantní ve věku 3–10, ostatní proměny vysílání 0–18. */
export function isMediaMilestoneInAgeWindow(
  record: Pick<MediaMilestone, "year" | "placement">,
  birthYear: number,
): boolean {
  const age = record.year - birthYear;
  return record.placement === "early-childhood"
    ? age >= 3 && age <= 10
    : age >= 0 && age <= 18;
}

export async function loadMediaMilestones(country: SupportedCountry): Promise<void> {
  if (cache[country]) return;
  const module = country === "CZ"
    ? await import("./public/mediaMilestones.cz.json")
    : await import("./public/mediaMilestones.ua.json");
  cache[country] = (module.default as MediaMilestoneRaw[]).map(expand);
}

export function mediaMilestonesFor(
  country: SupportedCountry,
  birthYear: number,
): MediaMilestone[] {
  const eligible = (cache[country] ?? [])
    .filter((record) => isMediaMilestoneInAgeWindow(record, birthYear));
  const early = pickRelevant(
    eligible.filter((record) => record.placement === "early-childhood"),
    2,
    (record) => record.relevance,
  );
  const everyday = pickRelevant(
    eligible.filter((record) => record.placement === "everyday-day"),
    4,
    (record) => record.relevance,
  );
  return [...early, ...everyday].map((record) => ({ ...record, chapter: record.placement }));
}

// Běhové čtení redakčních skóre relevance.
//
// Skóre vznikají výhradně mimo běh aplikace (build-time kurátorský průchod,
// commitnutý JSON v src/data/relevance/ + kompaktní pole `rel` ve veřejných
// datech). Běhové prostředí žádný model nevolá — jen čte čísla a řadí.
// Deterministické brány (citlivost, sdílení, věkové okno, rozsah) skóre nikdy
// nepřebije: výběr podle relevance se volá až po všech filtrech.

import { getActiveRandom, type RandomSource } from "./random";

/** Pořadí os je smluvní — kompaktní pole `rel` ve veřejných datech je v tomto
 * pořadí. Stejné pořadí drží scripts/relevance/prompts.mjs (AXES). */
export const RELEVANCE_AXES = [
  "livedProximity",
  "everydayConsequence",
  "recognition",
  "discovery",
  "consequenceHorizon",
  "explanatoryPayload",
] as const;

export type RelevanceAxis = (typeof RELEVANCE_AXES)[number];
export type RelevanceScores = Record<RelevanceAxis, number>;

/** Kompaktní tvar ve veřejném JSON: šestice celých čísel 0–5. */
export type CompactRelevance = number[];

export function expandRelevance(
  compact: CompactRelevance | undefined,
): RelevanceScores | undefined {
  if (!compact || compact.length !== RELEVANCE_AXES.length) return undefined;
  const scores = {} as RelevanceScores;
  RELEVANCE_AXES.forEach((axis, index) => {
    scores[axis] = compact[index];
  });
  return scores;
}

// Váhy složeného skóre: dopad na všední den a blízkost prožitku vedou,
// horizont důsledků jen podpírá. Vysvětlující náboj drží „příběh“ nad holými
// daty. Váhy jsou záměrně blízko sobě — žádná osa nesmí záznam unést sama.
const WEIGHTS: RelevanceScores = {
  livedProximity: 1.2,
  everydayConsequence: 1.3,
  recognition: 1,
  discovery: 1,
  consequenceHorizon: 0.7,
  explanatoryPayload: 1.1,
};

const WEIGHT_TOTAL = RELEVANCE_AXES.reduce((sum, axis) => sum + WEIGHTS[axis], 0);

/** Neutrální složené skóre pro záznamy bez ohodnocení (kurátorované sady bez
 * skóre se řadí doprostřed — nejsou pohřbené ani zvýhodněné). */
export const NEUTRAL_COMPOSITE = 2.5 * WEIGHT_TOTAL;

export function compositeRelevance(scores: RelevanceScores | undefined): number {
  if (!scores) return NEUTRAL_COMPOSITE;
  return RELEVANCE_AXES.reduce((sum, axis) => sum + (scores[axis] ?? 2.5) * WEIGHTS[axis], 0);
}

/** Seedovaný rozptyl v bodech složeného skóre: jasně silnější záznam vyhraje
 * vždy, blízké případy se mezi osobami (a variantami) střídají. */
export const RELEVANCE_JITTER = 1.5;

/** Deterministický výběr `count` nejrelevantnějších položek. Volá se výhradně
 * na množině, která už prošla branami — skóre jen řadí povolené záznamy. */
export function pickRelevant<T>(
  items: T[],
  count: number,
  relevanceOf: (item: T) => RelevanceScores | undefined,
  random: RandomSource = getActiveRandom(),
): T[] {
  return items
    .map((item) => ({
      item,
      sortKey: compositeRelevance(relevanceOf(item)) + random() * RELEVANCE_JITTER,
    }))
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, count)
    .map((entry) => entry.item);
}

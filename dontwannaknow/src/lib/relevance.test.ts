import { describe, expect, it } from "vitest";
import {
  compositeRelevance,
  expandRelevance,
  NEUTRAL_COMPOSITE,
  pickRelevant,
  RELEVANCE_AXES,
  type RelevanceScores,
} from "./relevance";
import { withSeededRandom } from "./random";

function scores(value: number): RelevanceScores {
  return Object.fromEntries(RELEVANCE_AXES.map((axis) => [axis, value])) as RelevanceScores;
}

describe("relevance scoring runtime", () => {
  it("expands compact score arrays in the contractual axis order", () => {
    const expanded = expandRelevance([5, 4, 3, 2, 1, 0]);
    expect(expanded).toEqual({
      livedProximity: 5,
      everydayConsequence: 4,
      recognition: 3,
      discovery: 2,
      consequenceHorizon: 1,
      explanatoryPayload: 0,
    });
    expect(expandRelevance(undefined)).toBeUndefined();
    expect(expandRelevance([1, 2])).toBeUndefined();
  });

  it("scores unscored records as neutral so they are neither buried nor promoted", () => {
    expect(compositeRelevance(undefined)).toBe(NEUTRAL_COMPOSITE);
    expect(compositeRelevance(scores(0))).toBeLessThan(NEUTRAL_COMPOSITE);
    expect(compositeRelevance(scores(5))).toBeGreaterThan(NEUTRAL_COMPOSITE);
  });

  it("picks clearly stronger records first, deterministically per seed", () => {
    const items = [
      { id: "weak", rel: scores(1) },
      { id: "strong", rel: scores(5) },
      { id: "middle", rel: scores(3) },
    ];
    const first = withSeededRandom("seed-a", () =>
      pickRelevant(items, 2, (item) => item.rel).map((item) => item.id),
    );
    const repeat = withSeededRandom("seed-a", () =>
      pickRelevant(items, 2, (item) => item.rel).map((item) => item.id),
    );
    expect(first).toEqual(repeat);
    expect(first[0]).toBe("strong");
    expect(first).not.toContain("weak");
  });

  it("lets seeded jitter rotate only near-tied records", () => {
    const items = [
      { id: "a", rel: scores(3) },
      { id: "b", rel: scores(3) },
      { id: "c", rel: scores(3) },
    ];
    const winners = new Set(
      ["s1", "s2", "s3", "s4", "s5", "s6"].map((seed) =>
        withSeededRandom(seed, () => pickRelevant(items, 1, (item) => item.rel)[0].id),
      ),
    );
    expect(winners.size).toBeGreaterThan(1);
  });
});

// Deterministické brány musí prokazatelně přebít i maximální skóre relevance.
// Skóre smí jen řadit záznamy, které brány pustily — nikdy je neobcházet.
import { describe, expect, it } from "vitest";
import { annotateFact, composeChapters, selectShareItem, type EditorialMetadata } from "./report";
import type { Fact } from "./facts";
import type { ResolvedHistoricalContext } from "./historicalLocation";
import { RELEVANCE_AXES, type RelevanceScores } from "./relevance";
import { withSeededRandom } from "./random";
import { makePerson } from "../test/factories";

const context: ResolvedHistoricalContext = {
  modernCountry: "CZ",
  modernCountryLabel: "Česko",
  historicalStateId: "czechoslovakia",
  historicalStateLabel: "Československo",
  cityLabel: "Praha",
  historicalCityLabel: "Praha",
  primaryLabel: "Praha, Československo",
  presentDayLabel: "dnešní Česko",
  transition: false,
};

const person = makePerson({ birthYear: 1953 });

function scores(value: number, overrides: Partial<RelevanceScores> = {}): RelevanceScores {
  return {
    ...(Object.fromEntries(RELEVANCE_AXES.map((axis) => [axis, value])) as RelevanceScores),
    ...overrides,
  };
}

function metadata(overrides: Partial<EditorialMetadata> = {}): EditorialMetadata {
  return {
    tone: "neutral",
    sensitivity: "none",
    chapter: "everyday-day",
    shareSafe: true,
    featured: false,
    geographicScope: "modern-country",
    sourceConfidence: "review-needed",
    reviewRequired: false,
    ...overrides,
  };
}

describe("hard gates beat maximum relevance scores", () => {
  it("keeps a difficult record out of safe chapters even with a perfect score", () => {
    const difficult = annotateFact(
      { category: "city", year: 1953, text: "Městem procházela válka a okupace." },
      context,
    );
    difficult.relevance = scores(5);
    const safe = annotateFact(
      { category: "city", year: 1953, text: "Ve městě vyjela nová tramvajová linka." },
      context,
    );
    safe.relevance = scores(0);

    const chapters = withSeededRandom("gate-test", () =>
      composeChapters(person, [difficult, safe], context),
    );
    const birth = chapters.find((chapter) => chapter.id === "birth");
    expect(birth?.items.map((item) => item.text)).toContain(safe.text);
    expect(birth?.items.map((item) => item.text)).not.toContain(difficult.text);
    for (const chapter of chapters) {
      if (chapter.id === "generation-context") continue;
      expect(chapter.items.every((item) => item.metadata.sensitivity !== "difficult")).toBe(true);
    }
  });

  it("never selects a non-share-safe record for sharing, whatever its score", () => {
    const unsafe: Fact = {
      category: "daily",
      text: "Vysoce relevantní, ale nesdílitelný záznam.",
      metadata: metadata({ shareSafe: false }),
      relevance: scores(5),
    };
    const shareable: Fact = {
      category: "daily",
      text: "Méně relevantní, ale sdílitelný záznam.",
      metadata: metadata({ shareSafe: true }),
      relevance: scores(1),
    };
    const chapters = withSeededRandom("share-test", () =>
      composeChapters(person, [unsafe, shareable], context),
    );
    const shareItem = selectShareItem(chapters);
    expect(shareItem?.text).toBe(shareable.text);
    expect(shareItem?.metadata.shareSafe).toBe(true);
  });

  it("keeps a record outside its age window even with a perfect score", () => {
    const tooEarly: Fact = {
      category: "city",
      year: 1955,
      text: "Záznam určený až pro školní věk.",
      metadata: metadata({ chapter: "changing-world", ageFrom: 10 }),
      relevance: scores(5),
    };
    const inWindow: Fact = {
      category: "city",
      year: 1955,
      text: "Běžný městský záznam bez věkového omezení.",
      metadata: metadata({ chapter: "changing-world" }),
      relevance: scores(0),
    };
    const chapters = withSeededRandom("age-test", () =>
      composeChapters(person, [tooEarly, inWindow], context),
    );
    const everyText = chapters.flatMap((chapter) => chapter.items.map((item) => item.text));
    expect(everyText).toContain(inWindow.text);
    expect(everyText).not.toContain(tooEarly.text);
  });

  it("guarantees a recognition item and a discovery item in a scored chapter", () => {
    const mids: Fact[] = Array.from({ length: 6 }, (_, index) => ({
      category: "daily",
      text: `Průměrně relevantní záznam ${index + 1}.`,
      metadata: metadata(),
      relevance: scores(3, { recognition: 2, discovery: 2 }),
    }));
    const recognitionChampion: Fact = {
      category: "daily",
      text: "Záznam, který pamětník okamžitě pozná.",
      metadata: metadata(),
      relevance: scores(1, { recognition: 5 }),
    };
    const discoveryChampion: Fact = {
      category: "daily",
      text: "Záznam, který překvapí i sečtělého čtenáře.",
      metadata: metadata(),
      relevance: scores(1, { discovery: 5 }),
    };
    const chapters = withSeededRandom("mix-test", () =>
      composeChapters(person, [...mids, recognitionChampion, discoveryChampion], context),
    );
    const day = chapters.find((chapter) => chapter.id === "everyday-day");
    expect(day?.items.some((item) => (item.relevance?.recognition ?? 0) >= 4)).toBe(true);
    expect(day?.items.some((item) => (item.relevance?.discovery ?? 0) >= 4)).toBe(true);
  });

  it("never opens the context chapter with a difficult record, whatever its score", () => {
    const difficult = annotateFact(
      { category: "world", year: 1968, text: "Zemi zasáhla invaze a okupace armád." },
      context,
    );
    difficult.relevance = scores(5);
    const calmOne: Fact = {
      category: "government",
      year: 1960,
      text: "Proběhlo sčítání lidu s novým formulářem.",
      metadata: metadata({ chapter: "generation-context", shareSafe: false }),
      relevance: scores(1),
    };
    const calmTwo: Fact = {
      category: "government",
      year: 1962,
      text: "Úřady zavedly nové občanské průkazy.",
      metadata: metadata({ chapter: "generation-context", shareSafe: false }),
      relevance: scores(1),
    };
    const chapters = withSeededRandom("difficult-opener-test", () =>
      composeChapters(person, [difficult, calmOne, calmTwo], context),
    );
    const generationContext = chapters.find((chapter) => chapter.id === "generation-context");
    const texts = generationContext?.items.map((item) => item.text) ?? [];
    expect(texts).toContain(difficult.text);
    expect(generationContext?.items.length).toBeGreaterThan(1);
    expect(generationContext?.items[0]?.metadata.sensitivity).not.toBe("difficult");
  });
});

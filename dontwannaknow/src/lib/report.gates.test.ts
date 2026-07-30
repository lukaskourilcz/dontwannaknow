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

  it("guarantees a money or media item in everyday-day when one passed the gates", () => {
    const daily: Fact[] = Array.from({ length: 7 }, (_, index) => ({
      category: "daily",
      text: `Silný každodenní kandidát ${index + 1}.`,
      metadata: metadata(),
      relevance: scores(4),
    }));
    const money: Fact = {
      category: "money",
      text: "Níže skórovaný, ale doložený cenový kontext.",
      metadata: metadata({ chapter: "different-from-today" }),
      relevance: scores(0),
    };
    const chapters = withSeededRandom("money-media-mix-test", () =>
      composeChapters(person, [...daily, money], context),
    );
    const day = chapters.find((chapter) => chapter.id === "everyday-day");
    expect(day?.items).toHaveLength(6);
    expect(day?.items.some((item) => ["money", "media"].includes(item.category))).toBe(true);
  });

  it("degrades silently when no money or media candidate passed the gates", () => {
    const daily: Fact[] = Array.from({ length: 6 }, (_, index) => ({
      category: "daily",
      text: `Každodenní kandidát bez zvláštního mixu ${index + 1}.`,
      metadata: metadata(),
      relevance: scores(3),
    }));
    const chapters = withSeededRandom("missing-money-media-test", () =>
      composeChapters(person, daily, context),
    );
    const day = chapters.find((chapter) => chapter.id === "everyday-day");
    expect(day?.items).toHaveLength(6);
    expect(day?.items.every((item) => !["money", "media"].includes(item.category))).toBe(true);
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

  it("keeps a 1947 child-mortality item out of sharing and away from index zero", () => {
    const mortality: Fact = {
      category: "illness",
      year: 1947,
      text: "Z dětí narozených v roce 1947 se části nepodařilo dožít pěti let.",
      metadata: metadata({
        chapter: "generation-context",
        sensitivity: "mild",
        tone: "serious",
        shareSafe: false,
        mayOpen: false,
      }),
      relevance: scores(5),
      shareSafe: false,
      sensitivity: "mild",
      mayOpen: false,
    };
    const lead: Fact = {
      category: "government",
      year: 1947,
      text: "První položka širších souvislostí bez citlivého zdravotního údaje.",
      metadata: metadata({ chapter: "generation-context", shareSafe: false }),
      relevance: scores(1),
    };
    const reportPerson = makePerson({ birthYear: 1947 });
    const chapters = withSeededRandom("mortality-gate-test", () =>
      composeChapters(reportPerson, [mortality, lead], context),
    );
    const contextItems = chapters.find((chapter) => chapter.id === "generation-context")?.items ?? [];
    expect(contextItems.map((item) => item.text)).toContain(mortality.text);
    expect(contextItems[0]?.text).not.toBe(mortality.text);
    expect(selectShareItem(chapters)?.text).not.toBe(mortality.text);
  });
});

describe("chapter „Tehdy a dnes“ never ships bare product names", () => {
  it("keeps modern gadget name-drops out of every report", async () => {
    const { reportFor } = await import("./facts");
    const gadget = /\b(iPad|iPhone|iPod|TikTok|Instagram|Spotify|Facebook|YouTube|ChatGPT|Wikipedie)\b/i;
    const bareTemplate = /lidé ještě běžně nepoužívali/i;
    for (const birthYear of [1953, 1968, 1985, 1995, 2000, 2005]) {
      for (const variant of [0, 1, 2]) {
        const report = await reportFor(makePerson({ birthYear, variant }));
        const texts = report.chapters.flatMap((chapter) => chapter.items).map((item) => item.text);
        expect(texts.filter((text) => bareTemplate.test(text)), `${birthYear}/${variant}`).toEqual([]);
        const gadgetLines = texts.filter((text) => gadget.test(text) && /V roce narození/.test(text));
        expect(gadgetLines, `${birthYear}/${variant}`).toEqual([]);
      }
    }
  });
});

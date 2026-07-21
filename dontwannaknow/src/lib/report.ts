import type { Fact, FactCategory } from "./facts";
import type { Person } from "./person";
import type { ResolvedHistoricalContext } from "./historicalLocation";
import { stableHash } from "./random";
import editorialRulesJson from "../data/editorialRules.json";

export type FactTone = "warm" | "playful" | "neutral" | "serious";
export type FactSensitivity = "none" | "mild" | "difficult";
export type ReportChapterId =
  | "birth"
  | "early-childhood"
  | "everyday-day"
  | "teenage-years"
  | "different-from-today"
  | "changing-world"
  | "generation-context"
  | "life-numbers";
export type GeographicScope =
  | "city"
  | "modern-country"
  | "historical-state"
  | "wider-state"
  | "global";

export type EditorialMetadata = {
  tone: FactTone;
  sensitivity: FactSensitivity;
  chapter: ReportChapterId;
  shareSafe: boolean;
  featured: boolean;
  geographicScope: GeographicScope;
  historicalEntityId?: string;
  sourceConfidence: "verified" | "review-needed";
  reviewRequired: boolean;
  ageFrom?: number;
  ageTo?: number;
};

export type ReportItem = {
  id: string;
  text: string;
  category: FactCategory | "context";
  year?: number;
  age?: number;
  metadata: EditorialMetadata;
};

export type LifeMilestone = {
  age: number;
  year: number;
  label: string;
  items: ReportItem[];
};

export type ReportChapter = {
  id: ReportChapterId;
  eyebrow: string;
  title: string;
  introduction?: string;
  items: ReportItem[];
  collapsed?: boolean;
};

type EditorialRule = Partial<EditorialMetadata> & {
  id: string;
  pattern: string;
};

const EDITORIAL_RULES = (editorialRulesJson as EditorialRule[]).flatMap((rule) => {
  try {
    return [{ rule, matcher: new RegExp(rule.pattern, "i") }];
  } catch {
    console.warn(`Neplatný redakční vzor: ${rule.id}`);
    return [];
  }
});

const chapterForCategory: Record<FactCategory, ReportChapterId> = {
  beautiful: "birth",
  everyday: "different-from-today",
  daily: "everyday-day",
  food: "everyday-day",
  clothes: "early-childhood",
  illness: "generation-context",
  money: "different-from-today",
  media: "teenage-years",
  writers: "teenage-years",
  famous: "teenage-years",
  contemporaries: "teenage-years",
  bizarre: "different-from-today",
  city: "changing-world",
  local: "changing-world",
  world: "generation-context",
  government: "generation-context",
};

function scopeForCategory(category: FactCategory): GeographicScope {
  if (category === "city") return "city";
  if (category === "local" || category === "government") return "historical-state";
  if (category === "world" || category === "everyday" || category === "beautiful") return "global";
  return "modern-country";
}

export function annotateFact(
  fact: Pick<Fact, "category" | "text" | "year" | "stage">,
  context: ResolvedHistoricalContext,
): Fact {
  const override = EDITORIAL_RULES.find(({ matcher }) => matcher.test(fact.text))?.rule;
  const difficult = override?.sensitivity === "difficult";
  const mild = override?.sensitivity === "mild";
  const seriousCategory = ["government", "illness", "world"].includes(fact.category);
  const positiveCategory = ["beautiful", "media", "food"].includes(fact.category);
  const metadata: EditorialMetadata = {
    tone: override?.tone ?? (difficult || seriousCategory ? "serious" : positiveCategory ? "warm" : fact.category === "bizarre" ? "playful" : "neutral"),
    sensitivity: override?.sensitivity ?? (difficult ? "difficult" : mild ? "mild" : "none"),
    chapter: override?.chapter ?? chapterForCategory[fact.category],
    shareSafe: override?.shareSafe ?? (!difficult && !["illness", "government", "world"].includes(fact.category)),
    featured: override?.featured ?? ["beautiful", "city", "daily", "food"].includes(fact.category),
    geographicScope: override?.geographicScope ?? scopeForCategory(fact.category),
    historicalEntityId: override?.historicalEntityId ?? (["city", "local", "government"].includes(fact.category)
      ? context.historicalStateId
      : undefined),
    sourceConfidence: override?.sourceConfidence ?? (difficult ? "review-needed" : "verified"),
    reviewRequired: override?.reviewRequired ?? difficult,
    ageFrom: override?.ageFrom,
    ageTo: override?.ageTo,
  };
  return { ...fact, metadata };
}

function toItem(fact: Fact, birthYear: number): ReportItem {
  return {
    id: stableHash(`${fact.category}:${fact.text}`).toString(36),
    text: fact.text,
    category: fact.category,
    year: fact.year,
    age: fact.year === undefined ? undefined : fact.year - birthYear,
    metadata: fact.metadata,
  };
}

function fallback(id: ReportChapterId, text: string): ReportItem {
  return {
    id: `fallback-${id}`,
    text,
    category: "context",
    metadata: {
      tone: "neutral",
      sensitivity: "none",
      chapter: id,
      shareSafe: false,
      featured: false,
      geographicScope: "modern-country",
      sourceConfidence: "verified",
      reviewRequired: false,
    },
  };
}

function unique(items: ReportItem[]): ReportItem[] {
  return Array.from(new Map(items.map((item) => [item.text, item])).values());
}

function take(
  facts: Fact[],
  categories: FactCategory[],
  birthYear: number,
  count: number,
  options: {
    allowDifficult?: boolean;
    safeOnly?: boolean;
    exclude?: Set<string>;
    predicate?: (fact: Fact) => boolean;
    chapter?: ReportChapterId;
  } = {},
): ReportItem[] {
  const rank = new Map(categories.map((category, index) => [category, index]));
  return unique(
    facts
      .filter((fact) => {
        const wasMovedByEditorialRule = fact.metadata.chapter !== chapterForCategory[fact.category];
        return fact.metadata.chapter === options.chapter || (!wasMovedByEditorialRule && rank.has(fact.category));
      })
      .filter((fact) => options.allowDifficult || fact.metadata.sensitivity !== "difficult")
      .filter((fact) => !options.safeOnly || fact.metadata.sensitivity === "none")
      .filter((fact) => !options.exclude?.has(fact.text))
      .filter((fact) => options.predicate?.(fact) ?? true)
      .filter((fact) => {
        if (fact.year === undefined) return true;
        const age = fact.year - birthYear;
        return (
          (fact.metadata.ageFrom === undefined || age >= fact.metadata.ageFrom) &&
          (fact.metadata.ageTo === undefined || age <= fact.metadata.ageTo)
        );
      })
      .sort((a, b) => {
        const category = (rank.get(a.category) ?? 99) - (rank.get(b.category) ?? 99);
        if (category) return category;
        const featured = Number(b.metadata.featured) - Number(a.metadata.featured);
        if (featured) return featured;
        return 0;
      })
      .map((fact) => toItem(fact, birthYear)),
  ).slice(0, count);
}

function avoidConsecutiveDifficult(items: ReportItem[]): ReportItem[] {
  const safe = items.filter((item) => item.metadata.sensitivity !== "difficult");
  const difficult = items
    .filter((item) => item.metadata.sensitivity === "difficult")
    .slice(0, Math.min(3, safe.length + 1));
  const out: ReportItem[] = [];
  if (difficult.length > safe.length) out.push(difficult.shift()!);
  while (safe.length || difficult.length) {
    if (safe.length) out.push(safe.shift()!);
    if (difficult.length) out.push(difficult.shift()!);
  }
  return out;
}

function milestoneLabel(age: number): string {
  if (age === 0) return "V roce narození";
  if (age === 6) return "Když začínalo dětství ve škole";
  return `V ${age} letech`;
}

export function calculateLifeMilestones(person: Person, facts: Fact[]): LifeMilestone[] {
  const milestoneAges = [0, 6, 10, 13, 15, 18];
  const used = new Set<string>();
  const changing = facts.filter((fact) =>
    ["city", "local", "beautiful", "world"].includes(fact.category) &&
      fact.year !== undefined &&
      fact.metadata.sensitivity === "none" &&
      fact.metadata.tone !== "serious",
  );
  return milestoneAges
    .filter((age) => person.birthYear + age <= new Date().getFullYear())
    .map((age) => {
      const year = person.birthYear + age;
      const nearest = changing
        .filter((fact) => !used.has(fact.text))
        .filter((fact) => fact.year === year)
        .sort((a, b) => Math.abs(a.year! - year) - Math.abs(b.year! - year))
        .slice(0, 1)
        .map((fact) => toItem(fact, person.birthYear));
      nearest.forEach((item) => used.add(item.text));
      return { age, year, label: milestoneLabel(age), items: unique(nearest) };
    })
    .filter((milestone) => milestone.items.length > 0);
}

export function composeChapters(
  person: Person,
  facts: Fact[],
  context: ResolvedHistoricalContext,
): ReportChapter[] {
  const used = new Set<string>();
  const choose = (
    chapter: ReportChapterId,
    categories: FactCategory[],
    count: number,
    options: Parameters<typeof take>[4] = {},
  ) => {
    const selected = take(facts, categories, person.birthYear, count, {
      ...options,
      chapter,
      exclude: used,
    });
    selected.forEach((item) => used.add(item.text));
    return selected;
  };

  const birth = choose("birth", ["city", "beautiful", "everyday"], 4, {
    safeOnly: true,
    predicate: (fact) =>
      fact.stage === undefined &&
      (fact.year === undefined || Math.abs(fact.year - person.birthYear) <= 1),
  });
  const early = choose("early-childhood", ["city", "clothes"], 5, {
    safeOnly: true,
    predicate: (fact) =>
      fact.stage !== "teenage-era" &&
      (fact.year === undefined ||
        (fact.year >= person.birthYear && fact.year <= person.birthYear + 10)),
  });
  const day = choose("everyday-day", ["daily", "food", "money", "clothes"], 6, {
    predicate: (fact) => fact.stage !== "teenage-era",
  });
  const teen = [
    ...choose("teenage-years", ["media"], 3, {
      predicate: (fact) => fact.stage !== "birth-era",
    }),
    ...choose("teenage-years", ["famous", "contemporaries", "writers"], 4, {
      predicate: (fact) => fact.stage !== "birth-era",
    }),
  ];
  const different = choose("different-from-today", ["bizarre", "everyday", "money"], 6, {
    predicate: (fact) => fact.stage !== "teenage-era",
  });
  const changing = choose("changing-world", ["city", "local", "beautiful", "world"], 7, {
    predicate: (fact) => fact.year === undefined || (fact.year >= person.birthYear && fact.year <= person.birthYear + 18),
  });
  const contextItems = avoidConsecutiveDifficult(
    choose("generation-context", ["local", "world", "government", "illness"], 8, {
      allowDifficult: true,
      predicate: (fact) => fact.year === undefined || (fact.year >= person.birthYear && fact.year <= person.birthYear + 18),
    }),
  );

  return [
    {
      id: "birth",
      eyebrow: "01 · Začátek příběhu",
      title: "Když tento příběh začal",
      introduction: `${context.primaryLabel}. První kapitola zachycuje dobu a místo narození, nikoli osobní vzpomínky.`,
      items: birth.length ? birth : [fallback("birth", `Rok ${person.birthYear} zasazujeme do kontextu místa ${context.primaryLabel}.`) ],
    },
    {
      id: "early-childhood",
      eyebrow: "02 · Dětství",
      title: "První roky",
      introduction: "Jaké prostředí obklopovalo děti stejného věku — doma, ve městě i před začátkem školy.",
      items: early.length ? early : [fallback("early-childhood", "Pro toto období zatím nemáme dost místních údajů. Další části zprávy zůstávají dostupné.")],
    },
    {
      id: "everyday-day",
      eyebrow: "03 · Každodennost",
      title: "Jak mohl vypadat běžný den",
      introduction: "Dobová rekonstrukce typických podmínek. Nejde o osobní vzpomínku ani přesný životopis.",
      items: day.length ? day : [fallback("everyday-day", "Každodenní rytmus tohoto období zatím nedokážeme doložit v potřebné podrobnosti.")],
    },
    {
      id: "teenage-years",
      eyebrow: "04 · Dospívání",
      title: "Co mohlo provázet dospívání",
      introduction: "Hudba, knihy, obrazovky a styl, se kterými se setkávali lidé stejné generace.",
      items: teen.length ? teen : [fallback("teenage-years", "Pro roky dospívání zatím nemáme dost ověřených kulturních údajů.")],
    },
    {
      id: "different-from-today",
      eyebrow: "05 · Tehdy a dnes",
      title: "Co bylo tehdy úplně jiné",
      introduction: "Srovnání běžných věcí bez posuzování, zda byla jedna doba lepší než druhá.",
      items: different.length ? different : [fallback("different-from-today", "Některá dobová srovnání pro tento rok ještě doplňujeme.")],
    },
    {
      id: "changing-world",
      eyebrow: "06 · Proměny",
      title: "Svět kolem tohoto člověka se měnil",
      introduction: "Vybrané proměny města, země a kultury od narození do dospělosti.",
      items: changing.length ? changing : [fallback("changing-world", "Pro tuto životní etapu zatím nemáme dost časově ukotvených údajů.")],
    },
    {
      id: "generation-context",
      eyebrow: "07 · Širší souvislosti",
      title: "Události, které utvářely tuto generaci",
      introduction: "Složité události nemusely zasáhnout každého stejně, ale ovlivňovaly společnost, ve které lidé této generace vyrůstali.",
      items: contextItems.length ? contextItems : [fallback("generation-context", "Pro tuto dobu zatím nemáme dost ověřených širších souvislostí.")],
      collapsed: true,
    },
    {
      id: "life-numbers",
      eyebrow: "08 · Dlouhý pohled",
      title: "Život v číslech",
      introduction: "Čísla vyjadřují uběhlý čas a proměny, které se během něj odehrály — ne odhad toho, kolik času zbývá.",
      items: [],
      collapsed: true,
    },
  ];
}

export function selectShareItem(chapters: ReportChapter[]): ReportItem | null {
  const preferred = ["birth", "everyday-day", "teenage-years", "different-from-today"];
  for (const id of preferred) {
    const item = chapters
      .find((chapter) => chapter.id === id)
      ?.items.find((candidate) => candidate.metadata.shareSafe);
    if (item) return item;
  }
  return null;
}

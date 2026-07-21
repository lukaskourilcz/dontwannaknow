import { EVENTS, type EventMood } from "../data/events";
import { INVENTIONS } from "../data/inventions";
import { goneCountriesAlive } from "../data/countries";
import { statsForYear } from "../data/stats";
import {
  decadeFactsFor,
  countryLabelFor,
  type CountryDecade,
} from "../data/countryDecades";
import { culturalFiguresFor } from "../data/famousPeople";
import { eventsForCountry } from "../data/countryEvents";
import { cityFactsFor } from "../data/cities";
import { findCity } from "../data/cityCatalog";
import { worldBankFor, worldBankLatest } from "../data/worldBank";
import { contemporariesFor } from "../data/wikidataPeople";
import { mediaFor } from "../data/media";
import { writersAtBirth } from "../data/writers";
import { pickN } from "./random";
import { capitalize } from "./text";
import { czYears, czAgePhrase } from "./czech";
import { CURRENT_YEAR } from "./datetime";
import { settings } from "../config/settings";
import { withSeededRandom } from "./random";
import {
  annotateFact,
  calculateLifeMilestones,
  composeChapters,
  selectShareItem,
  type EditorialMetadata,
  type LifeMilestone,
  type ReportChapter,
  type ReportItem,
} from "./report";
import { resolveHistoricalLocation, type ResolvedHistoricalContext } from "./historicalLocation";
import type { Person } from "./person";

export type { Person } from "./person";

/**
 * Pick the grammatically correct Czech form for a person's gender, e.g.
 * Keeps descriptions of people from the curated writers dataset in one
 * consistent grammatical voice.
 */
const genderForm = (
  gender: "m" | "f",
  masculine: string,
  feminine: string,
): string => (gender === "f" ? feminine : masculine);

export type FactCategory =
    | "bizarre"
    | "beautiful"
    | "everyday"
    | "world"
    | "government"
    | "clothes"
    | "illness"
    | "daily"
    | "food"
    | "money"
    | "famous"
    | "local"
    | "city"
    | "media"
    | "writers"
    | "contemporaries";

export type Fact = {
  category: FactCategory;
  text: string;
  year?: number;
  stage?: "birth-era" | "teenage-era";
  metadata: EditorialMetadata;
};

type RawFact = Pick<Fact, "category" | "text" | "year" | "stage">;

export type PersonReport = {
  person: Person;
  facts: Fact[];
  historicalContext: ResolvedHistoricalContext;
  milestones: LifeMilestone[];
  chapters: ReportChapter[];
  shareItem: ReportItem | null;
};

function ageAt(birthYear: number, year: number): number {
  return year - birthYear;
}

function eventsLivedThrough(birthYear: number): typeof EVENTS {
  return EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= CURRENT_YEAR && e.year - birthYear <= 18,
  );
}

function eventsByMood(birthYear: number, mood: EventMood): typeof EVENTS {
  return eventsLivedThrough(birthYear).filter((e) => e.mood === mood);
}

function pickFormative(birthYear: number, max = 4): typeof EVENTS {
  const lived = eventsLivedThrough(birthYear)
    .slice()
    .sort((a, b) => {
      const ageA = a.year - birthYear;
      const ageB = b.year - birthYear;
      return Math.abs(ageA - 12) - Math.abs(ageB - 12);
    });
  return lived.slice(0, max).sort((a, b) => a.year - b.year);
}

function formativeInventions(birthYear: number) {
  return INVENTIONS.filter((invention) =>
    invention.year > birthYear && invention.year <= birthYear + 18,
  );
}

const FEATURED_INVENTIONS = new Set([
  "penicilin",
  "barevná televize",
  "magnetofonová kazeta",
  "domácí mikrovlnná trouba",
  "bankomat",
  "kapesní kalkulačka",
  "osobní počítač",
  "Sony Walkman",
  "World Wide Web",
  "mobilní telefon pro běžné uživatele",
  "iPhone",
]);

function decadePeriod(decadeStart: number): string {
  return `${decadeStart}–${decadeStart + 9}`;
}

// Build country-specific facts from the per-decade snapshot. We pull from
// both the person's birth decade and their teenage decade so the texture
// covers "when you were born" and "while you were growing up".
function countryFacts(person: Person): RawFact[] {
  const { country, birthYear } = person;
  const birthDecade = decadeFactsFor(country, birthYear);
  const formativeDecade = decadeFactsFor(country, birthYear + 15);

  const facts: RawFact[] = [];
  const decades: { d: CountryDecade | null; when: string; stage: Fact["stage"] }[] = [
    { d: birthDecade, when: `v letech ${decadePeriod(Math.floor(birthYear / 10) * 10)}`, stage: "birth-era" },
  ];
  if (
    formativeDecade &&
    (!birthDecade || formativeDecade.decadeStart !== birthDecade.decadeStart)
  ) {
    decades.push({
      d: formativeDecade,
      when: `v letech ${decadePeriod(formativeDecade.decadeStart)}, během dospívání`,
      stage: "teenage-era",
    });
  }

  for (const { d, when, stage } of decades) {
    if (!d) continue;
    // Pick a couple from each thematic bucket.
    pickN(d.government, 1).forEach((t) =>
      facts.push({ category: "government", text: `${capitalize(when)}: ${t}`, stage }),
    );
    pickN(d.clothes, 1).forEach((t) =>
      facts.push({ category: "clothes", text: t, stage }),
    );
    pickN(d.illnesses, 1).forEach((t) =>
      facts.push({ category: "illness", text: t, stage }),
    );
    pickN(d.dailyLife, 1).forEach((t) =>
      facts.push({ category: "daily", text: t, stage }),
    );
    pickN(d.food, 1).forEach((t) =>
      facts.push({ category: "food", text: t, stage }),
    );
    pickN(d.money, 1).forEach((t) =>
      facts.push({ category: "money", text: t, stage }),
    );
    pickN(d.bizarre, 1).forEach((t) =>
      facts.push({ category: "bizarre", text: t, stage }),
    );
    pickN(d.beautiful, 1).forEach((t) =>
      facts.push({ category: "beautiful", text: t, stage }),
    );
  }

  // What people read and watched — magazines, books and TV channels of the
  // birth decade and the teenage decade. Covers 1940s–2020s (CZ & UA only).
  const mediaSeen = new Set<number>();
  [
    { year: birthYear, stage: "birth-era" as const },
    { year: birthYear + 15, stage: "teenage-era" as const },
  ].forEach(({ year: y, stage }) => {
    const m = mediaFor(country, y);
    if (!m || mediaSeen.has(m.decadeStart)) return;
    mediaSeen.add(m.decadeStart);
    pickN(m.read, 1).forEach((t) => facts.push({ category: "media", text: t, stage }));
    pickN(m.watch, 1).forEach((t) => facts.push({ category: "media", text: t, stage }));
  });

  // Writers who were alive when this person was born, with age, residence and
  // publication context. We do not infer what they were privately writing.
  pickN(writersAtBirth(country, birthYear), 4).forEach((w) => {
    let s = `**${w.name}** (${w.blurb}), ${w.age} ${czYears(w.age)}`;
    const tail: string[] = [];
    if (w.home) tail.push(`${genderForm(w.gender, "žil", "žila")} ${w.home}`);
    if (w.publishedSoonAfter) {
      tail.push(`krátce nato vyšlo dílo ${w.publishedSoonAfter.title} (${w.publishedSoonAfter.year})`);
    } else if (w.recent) {
      tail.push(
        `${genderForm(w.gender, "měl za sebou", "měla za sebou")} ${w.recent.title} (${w.recent.year})`,
      );
    }
    s += tail.length ? ` — ${tail.join(" a ")}.` : ".";
    facts.push({ category: "writers", text: s });
  });

  // Country-specific events from birth through adulthood.
  const countryEvents = eventsForCountry(
    country,
    birthYear,
    Math.min(CURRENT_YEAR, birthYear + 18),
  );
  pickN(countryEvents, 4).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const when = czAgePhrase(age);
    facts.push({
      category: "local",
      year: e.year,
      text: `${capitalize(when)} (${e.year}): ${e.text}.`,
    });
  });

  // Famous people from their birth decade and youth decade.
  const famous = [
    ...culturalFiguresFor(country, birthYear + 15).map((person) => ({ person, stage: "teenage-era" as const })),
    ...culturalFiguresFor(country, birthYear).map((person) => ({ person, stage: "birth-era" as const })),
  ];
  // Dedupe by name.
  const uniqueFamous = Array.from(
    new Map(famous.map((entry) => [entry.person.name, entry])).values(),
  );
  pickN(uniqueFamous, 5).forEach(({ person: p, stage }) => {
    facts.push({
      category: "famous",
      text: `**${p.name}** — ${p.role}${p.note ? `: ${p.note}` : ""}.`,
      stage,
    });
  });

  return facts;
}

function buildReport(person: Person, cityEvents: Awaited<ReturnType<typeof cityFactsFor>>, excludeWorld = false): PersonReport {
  const { birthYear } = person;
  const birthStats = statsForYear(birthYear);
  const countryLabel = countryLabelFor(person.country, birthYear);
  const city = findCity(person.citySlug);

  const facts: RawFact[] = [];

  // ── City-specific events during the formative years ─────────────────
  if (city) {
    const formativeCityEvents = cityEvents.filter((event) => event.year <= birthYear + 18);
    pickN(formativeCityEvents, 10).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const when = czAgePhrase(age);
      facts.push({
        category: "city",
        year: e.year,
        text: `${capitalize(when)} (${e.year}, ${city.name}): ${e.text}.`,
      });
    });
  }

  // ── Everyday contrasts: familiar things that did not exist yet ────────
  const beforeStuff = formativeInventions(birthYear);
  if (beforeStuff.length > 0) {
    const big = beforeStuff.filter((i) =>
      FEATURED_INVENTIONS.has(i.name),
    );
    const pool = big.length >= 2 ? big : beforeStuff;
    pickN(pool, 2).forEach((inv) => {
      facts.push({
        category: "bizarre",
        text: inv.detail
          ? `V roce narození ${inv.detail}.`
          : `V roce narození lidé ještě běžně nepoužívali: ${inv.name}.`,
      });
    });
  }

  // ── Changing borders: states that later disappeared ───────────────────
  const gone = goneCountriesAlive(birthYear).slice(0, 2);
  gone.forEach((c) => {
    const verb = c.becameText ? ` — později ${c.becameText}` : "";
    facts.push({
      category: "bizarre",
      text: `V roce narození na mapě ještě existoval stát ${c.name}${verb}.`,
    });
  });

  // ── Positive formative moments (skipped in a pair — they live
  //    in the shared comparison card) ───────────────────────────────────
  if (!excludeWorld) {
    pickFormative(birthYear).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const ageWord = czAgePhrase(age);
      facts.push({
        category: e.mood === "beautiful" || e.mood === "milestone" ? "beautiful" : "world",
        year: e.year,
        text: `${capitalize(ageWord)}: ${e.text}.`,
      });
    });

    pickN(eventsByMood(birthYear, "beautiful"), 1).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      facts.push({
        category: "beautiful",
        year: e.year,
        text: `${capitalize(czAgePhrase(age))}: ${e.text}.`,
      });
    });
  }

  // ── Everyday life ────────────────────────────────────────────────────
  facts.push({
    category: "everyday",
    text: `V roce narození žilo na světě přibližně ${birthStats.worldPopulationBillions.toLocaleString("cs-CZ")} miliardy lidí — dnes je to zhruba ${settings.currentWorldPopulationText}.`,
  });
  facts.push({
    category: "everyday",
    text: `Průměrná délka života ve světě tehdy činila asi ${birthStats.globalLifeExpectancy} let. Toho roku se na celém světě narodilo přibližně ${birthStats.worldBirthsPerYearMillions} milionů dětí.`,
  });

  // Real, country-specific figures for the birth year, straight from the World
  // Bank (their series start ~1960, so this only fires for later births). This
  // supplements — never replaces — the rounded global approximations above.
  {
    const wb = worldBankFor(person.country, birthYear);
    if (wb && (wb.pop || wb.lifeExp || wb.gdpPerCapita)) {
      // Telegraphic, caption-style line — sidesteps Czech case/verb agreement
      // across the different country labels, and fits the broadsheet register.
      const parts: string[] = [];
      if (wb.pop) parts.push(`přibližně ${wb.pop.toLocaleString("cs-CZ")} obyvatel`);
      if (wb.lifeExp) parts.push(`průměrná délka života ${wb.lifeExp} let`);
      if (wb.gdpPerCapita)
        parts.push(`HDP na obyvatele ${wb.gdpPerCapita.toLocaleString("cs-CZ")} USD`);
      facts.push({
        category: "everyday",
        text: `${countryLabel}, ${birthYear}: ${parts.join(", ")} (data Světové banky).`,
      });
    }
  }

  // Natality & mortality of the birth year, with a "vs. today" contrast —
  // the drop in infant mortality is usually the most striking number in the
  // whole report. World Bank series start ~1960; silently absent before.
  {
    const wb = worldBankFor(person.country, birthYear);
    const cs1 = (n: number) => n.toLocaleString("cs-CZ", { maximumFractionDigits: 1 });
    // Fertility keeps one decimal ("2,0 dítěte") so the genitive always fits.
    const csKid = (n: number) =>
      n.toLocaleString("cs-CZ", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const where = countryLabel;

    if (wb?.birthRate) {
      const nowBr = worldBankLatest(person.country, "birthRate");
      // "narození"/"úmrtí" are case-invariant, so decimals read naturally.
      const bits = [
        `zhruba ${cs1(wb.birthRate)} narození na tisíc obyvatel ročně${nowBr ? ` (dnes ${cs1(nowBr.value)})` : ""}`,
      ];
      if (wb.fertility) {
        const nowFert = worldBankLatest(person.country, "fertility");
        bits.push(
          `na jednu ženu připadalo ${csKid(wb.fertility)} dítěte${nowFert ? ` (dnes ${csKid(nowFert.value)})` : ""}`,
        );
      }
      facts.push({
        category: "everyday",
        text: `Porodnost — ${where}, ${birthYear}: ${bits.join("; ")}.`,
      });
    }

    if (wb?.deathRate) {
      const nowIm = worldBankLatest(person.country, "infantMortality");
      const bits = [
        `${cs1(wb.deathRate)} úmrtí na tisíc obyvatel ročně`,
      ];
      if (wb.infantMortality) {
        bits.push(
          `z tisíce novorozenců se prvních narozenin nedožilo ${cs1(wb.infantMortality)}${nowIm ? ` — dnes ${cs1(nowIm.value)}` : ""}`,
        );
      }
      facts.push({
        category: "illness",
        text: `Úmrtnost — ${where}, ${birthYear}: ${bits.join("; ")}.`,
      });
    }
  }

  // ── Country-specific texture, famous people, and local events ───────
  facts.push(...countryFacts(person));

  // ── Famous contemporaries — notable people born in the same decade and
  //    country (from Wikidata, ranked by Wikipedia sitelinks). Additive. ──
  pickN(contemporariesFor(person.country, birthYear), 6).forEach((c) => {
    facts.push({
      category: "contemporaries",
      text: `Stejný rok narození má také **${c.name}** · obor: ${c.role}.`,
    });
  });

  // Drop accidental duplicates (e.g. the same "…ještě nikdo neznal" line).
  const seenFacts = new Set<string>();
  const uniqueFacts = facts.filter((f) => {
    if (seenFacts.has(f.text)) return false;
    seenFacts.add(f.text);
    return true;
  });

  const historicalContext = resolveHistoricalLocation(person);
  const annotatedFacts = uniqueFacts.map((fact) => annotateFact(fact, historicalContext));
  const chapters = composeChapters(person, annotatedFacts, historicalContext);

  return {
    person,
    facts: annotatedFacts,
    historicalContext,
    milestones: calculateLifeMilestones(person, annotatedFacts),
    chapters,
    shareItem: selectShareItem(chapters),
  };
}

export async function reportFor(person: Person, excludeWorld = false): Promise<PersonReport> {
  const seed = [
    "tehdejsi-svet-v1",
    person.birthYear,
    person.birthMonth ?? 0,
    person.birthDay ?? 0,
    person.country,
    person.citySlug,
    person.relationship,
    person.variant,
    Number(excludeWorld),
  ].join(":");
  const cityEvents = await cityFactsFor(person.citySlug, person.birthYear);
  return withSeededRandom(seed, () => buildReport(person, cityEvents, excludeWorld));
}

import { EVENTS, type EventMood } from "../data/events";
import { INVENTIONS } from "../data/inventions";
import { goneCountriesAlive } from "../data/countries";
import { statsForYear } from "../data/stats";
import {
  decadeFactsFor,
  loadCountryDecades,
  countryLabelFor,
  type CountryDecade,
} from "../data/countryDecades";
import { culturalFiguresFor, loadFamousPeople } from "../data/famousPeople";
import { eventsForCountry, loadCountryEvents } from "../data/countryEvents";
import { cityFactsFor } from "../data/cities";
import { findCity } from "../data/cityCatalog";
import { loadWorldBank, worldBankFor, worldBankLatest } from "../data/worldBank";
import { loadVitals, vitalsFor, type VitalRecord } from "../data/vitals";
import { loadPricesWages, pricesWagesFor } from "../data/pricesWages";
import { contemporariesFor, loadWikidataPeople } from "../data/wikidataPeople";
import { mediaFor } from "../data/media";
import { writersAtBirth } from "../data/writers";
import { pickN } from "./random";
import { expandRelevance, pickRelevant, type RelevanceScores } from "./relevance";
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
  type FactSource,
  type LifeMilestone,
  type ReportChapter,
  type ReportItem,
} from "./report";
import { resolveHistoricalLocation, type ResolvedHistoricalContext } from "./historicalLocation";
import { leadersOverlapping, type Leader } from "../data/leaders";
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
  /** Build-time skóre relevance (commitnutý JSON); běh je jen čte a řadí. */
  relevance?: RelevanceScores;
  /** Doložený zdroj záznamu; bez něj záznam zůstává review-needed. */
  source?: FactSource;
  /** Jistota původu daná datovou sadou (World Bank → verified apod.). */
  sourceConfidence?: "verified" | "review-needed";
  /** Citlivostní podlaha daná daty — pravidla ji mohou jen zvýšit. */
  sensitivity?: "none" | "mild" | "difficult";
  /** Datový zákaz sdílení (false nejde ničím přebít). */
  shareSafe?: boolean;
  /** Datový zákaz otevření kapitoly (např. statistika dětské úmrtnosti). */
  mayOpen?: boolean;
  /** Strukturovaný profil lídra pro „malou vizitku“ ve zprávě. */
  leader?: Leader;
};

type RawFact = Pick<Fact, "category" | "text" | "year" | "stage" | "relevance" | "source" | "sourceConfidence" | "sensitivity" | "shareSafe" | "mayOpen" | "leader">;

/** Převod kompaktních běhových metadat záznamu (rel/src) na tvar Fact. */
function extras(record: { rel?: number[]; src?: { t: string; p?: string; u?: string } }): Pick<Fact, "relevance" | "source"> {
  return {
    relevance: expandRelevance(record.rel),
    source: record.src
      ? { title: record.src.t, publisher: record.src.p, url: record.src.u }
      : undefined,
  };
}

export type PersonReport = {
  person: Person;
  facts: Fact[];
  historicalContext: ResolvedHistoricalContext;
  milestones: LifeMilestone[];
  chapters: ReportChapter[];
  shareItem: ReportItem | null;
};

const WORLD_BANK_SOURCE: FactSource = {
  title: "World Bank Open Data",
  publisher: "Světová banka",
  url: "https://data.worldbank.org/",
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

/** Kapitola „Tehdy a dnes“ žije z toho, co čtenáře ještě dokáže překvapit.
 * Obecně známý moderní produkt („v roce narození se ještě nepoužíval iPad“)
 * není dobová vzpomínka, jen truismus — proto musí záznam mít doloženou
 * hodnotu objevu. Brána je deterministická a skóre ji nepřebije. */
const INVENTION_MIN_DISCOVERY = 3;

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

  // Z každého tematického bloku vybíráme nejrelevantnější položky; skóre jen
  // řadí, seedovaný rozptyl střídá blízké případy mezi osobami. Každodenní
  // bloky dávají po dvou kandidátech, aby kapitola běžného dne nebyla chudá —
  // rozpočty kapitol (4–8 položek) drží výběr, ne šířka kandidátů.
  const decadeRelevance = (fact: { rel?: number[] }) => expandRelevance(fact.rel);
  for (const { d, when, stage } of decades) {
    if (!d) continue;
    pickRelevant(d.government, 1, decadeRelevance).forEach((f) =>
      facts.push({ category: "government", text: `${capitalize(when)}: ${f.text}`, stage, ...extras(f) }),
    );
    pickRelevant(d.clothes, 2, decadeRelevance).forEach((f) =>
      facts.push({ category: "clothes", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.illnesses, 1, decadeRelevance).forEach((f) =>
      facts.push({ category: "illness", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.dailyLife, 2, decadeRelevance).forEach((f) =>
      facts.push({ category: "daily", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.food, 2, decadeRelevance).forEach((f) =>
      facts.push({ category: "food", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.money, 2, decadeRelevance).forEach((f) =>
      facts.push({ category: "money", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.bizarre, 2, decadeRelevance).forEach((f) =>
      facts.push({ category: "bizarre", text: f.text, stage, ...extras(f) }),
    );
    pickRelevant(d.beautiful, 1, decadeRelevance).forEach((f) =>
      facts.push({ category: "beautiful", text: f.text, stage, ...extras(f) }),
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
  pickRelevant(countryEvents, 4, (e) => expandRelevance(e.rel)).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const when = czAgePhrase(age);
    facts.push({
      category: "local",
      year: e.year,
      text: `${capitalize(when)} (${e.year}): ${e.text}.`,
      ...extras(e),
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
  pickRelevant(uniqueFamous, 5, (entry) => expandRelevance(entry.person.rel)).forEach(({ person: p, stage }) => {
    facts.push({
      category: "famous",
      text: `**${p.name}** — ${p.role}${p.note ? `: ${p.note}` : ""}.`,
      stage,
      ...extras(p),
    });
  });

  return facts;
}

/** Kdo stál v čele státu (nebo strany, pod níž se reálně žilo) při narození
 * a v letech dospívání. Profily jdou vždy do kapitoly širších souvislostí —
 * politický obsah je tonálně oddělený a nikdy se nesdílí. */
function leaderFacts(person: Person, leaders: Leader[]): RawFact[] {
  const { birthYear } = person;
  const inOffice = (leader: Leader, year: number) =>
    leader.termStart <= year && (leader.termEnd ?? CURRENT_YEAR) >= year;
  const atBirth = leaders.find((leader) => inOffice(leader, birthYear));
  const teenYear = birthYear + 15;
  const atTeen = teenYear <= CURRENT_YEAR
    ? leaders.find((leader) => leader.id !== atBirth?.id && inOffice(leader, teenYear))
    : undefined;

  return [
    { leader: atBirth, when: "v roce narození" },
    { leader: atTeen, when: "v letech dospívání" },
  ].flatMap(({ leader, when }) => {
    if (!leader) return [];
    const term = `${leader.termStart}–${leader.termEnd ?? "dosud"}`;
    return [{
      category: "government" as const,
      year: Math.max(leader.termStart, birthYear),
      text: `V čele ${when}: **${leader.name}** — ${leader.office} (${term}).`,
      leader,
      sensitivity: leader.sensitivity,
      shareSafe: leader.shareSafe,
      relevance: expandRelevance(leader.rel),
      source: leader.sources?.[0]
        ? { title: leader.sources[0].title, publisher: leader.sources[0].publisher, url: leader.sources[0].url }
        : undefined,
      sourceConfidence: leader.sources?.length ? "verified" as const : "review-needed" as const,
    }];
  });
}

function buildReport(person: Person, cityEvents: Awaited<ReturnType<typeof cityFactsFor>>, leaders: Leader[], excludeWorld = false): PersonReport {
  const { birthYear } = person;
  const birthStats = statsForYear(birthYear);
  const countryLabel = countryLabelFor(person.country, birthYear);
  const city = findCity(person.citySlug);

  const facts: RawFact[] = [];

  const vitalSentence = (record: VitalRecord): RawFact => {
    const territory = person.country === "CZ"
      ? "na území dnešního Česka"
      : "na území dnešní Ukrajiny";
    if (record.series === "childMortality") {
      return {
        category: "illness",
        year: record.year,
        text: `Z dětí narozených v roce ${record.year} ${territory} se podle dlouhodobé demografické řady věku pěti let nedožilo zhruba ${record.value.toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} procenta.`,
        relevance: record.relevance,
        source: record.source,
        sourceConfidence: "verified",
        sensitivity: "mild",
        shareSafe: false,
        mayOpen: false,
      };
    }
    const latest = worldBankLatest(person.country, "lifeExp");
    const comparison = latest
      ? ` Nejnovější dostupná hodnota Světové banky je zhruba ${Math.round(latest.value)} let.`
      : "";
    return {
      category: "local",
      year: record.year,
      text: `V roce ${record.year} byla ${territory} naděje dožití při narození podle tehdejších demografických poměrů zhruba ${Math.round(record.value)} let.${comparison}`,
      relevance: record.relevance,
      source: record.source,
      sourceConfidence: "verified",
      shareSafe: true,
    };
  };

  // ── City-specific events during the formative years ─────────────────
  if (city) {
    const formativeCityEvents = cityEvents.filter((event) => event.year <= birthYear + 18);
    pickRelevant(formativeCityEvents, 10, (e) => expandRelevance(e.rel)).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const when = czAgePhrase(age);
      facts.push({
        category: "city",
        year: e.year,
        text: `${capitalize(when)} (${e.year}, ${city.name}): ${e.text}.`,
        ...extras(e),
      });
    });
  }

  // ── Everyday contrasts: familiar things that did not exist yet ────────
  // Brány: záznam musí nést dobovou větu (co se v běžném životě změnilo)
  // a doloženou hodnotu objevu. Až pak rozhoduje skóre relevance.
  const beforeStuff = formativeInventions(birthYear).filter((invention) => {
    if (!invention.detail) return false;
    const discovery = expandRelevance(invention.rel)?.discovery;
    return discovery === undefined || discovery >= INVENTION_MIN_DISCOVERY;
  });
  pickRelevant(beforeStuff, 2, (invention) => expandRelevance(invention.rel)).forEach((inv) => {
    facts.push({
      category: "bizarre",
      text: `V roce narození ${inv.detail}.`,
      ...extras(inv),
    });
  });

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
        source: WORLD_BANK_SOURCE,
        sourceConfidence: "verified",
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
        source: WORLD_BANK_SOURCE,
        sourceConfidence: "verified",
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
        source: WORLD_BANK_SOURCE,
        sourceConfidence: "verified",
      });
    }
  }

  // ── Country-specific texture, famous people, and local events ───────
  facts.push(...vitalsFor(person.country, birthYear).map(vitalSentence));
  facts.push(...pricesWagesFor(person.country, birthYear).map((record) => ({
    category: "money" as const,
    year: record.yearFrom === record.yearTo ? record.yearFrom : undefined,
    stage: record.yearTo <= birthYear + 7 ? "birth-era" as const : "teenage-era" as const,
    text: record.sentence,
    relevance: record.relevance,
    source: record.source,
    sourceConfidence: "verified" as const,
    shareSafe: true,
  })));
  facts.push(...countryFacts(person));

  // ── Hlavy státu a lídři formativních let (strukturované profily) ─────
  facts.push(...leaderFacts(person, leaders));

  // ── Famous contemporaries — notable people born in the same decade and
  //    country (from Wikidata, ranked by Wikipedia sitelinks). Additive. ──
  pickN(contemporariesFor(person.country, birthYear), 6).forEach((c) => {
    facts.push({
      category: "contemporaries",
      text: `Stejný rok narození má také **${c.name}** · obor: ${c.role}.`,
      source: { title: "Wikidata", url: "https://www.wikidata.org/" },
      sourceConfidence: "verified",
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
  // Načtou se jen řezy dané osoby: fakta jejího města a data její země.
  const [cityEvents, leaders] = await Promise.all([
    cityFactsFor(person.citySlug, person.birthYear),
    leadersOverlapping(person.country, person.birthYear, Math.min(CURRENT_YEAR, person.birthYear + 18)),
    loadCountryDecades(person.country),
    loadCountryEvents(person.country),
    loadFamousPeople(person.country),
    loadWikidataPeople(person.country),
    loadWorldBank(person.country),
    loadVitals(person.country),
    loadPricesWages(person.country),
  ]);
  return withSeededRandom(seed, () => buildReport(person, cityEvents, leaders, excludeWorld));
}

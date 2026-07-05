import { EVENTS, type EventMood } from "../data/events";
import { INVENTIONS } from "../data/inventions";
import { goneCountriesAlive } from "../data/countries";
import { statsForYear, type DecadeStats } from "../data/stats";
import { cultureForDecade, type CultureSnapshot } from "../data/culture";
import {
  decadeFactsFor,
  countryLabelFor,
  type Country,
  type CountryDecade,
} from "../data/countryDecades";
import { fmtMoney, fmtGasPerLitre } from "./money";
import { famousFor } from "../data/famousPeople";
import { eventsForCountry } from "../data/countryEvents";
import { cityFactsFor, findCity } from "../data/cities";
import { worldBankFor, worldBankLatest } from "../data/worldBank";
import { contemporariesFor } from "../data/wikidataPeople";
import { mediaFor } from "../data/media";
import { writersAtBirth } from "../data/writers";
import { FACTS as CURATED_FACTS } from "../data/history";
import { buildEssay, type EssayParagraph } from "./essay";
import { buildPairEssay, type PairSection } from "./pair";
import { pickN } from "./random";
import { capitalize } from "./text";
import { czYears, czAgePhrase } from "./czech";
import { CURRENT_YEAR } from "./datetime";
import { settings } from "../config/settings";

export type Gender = "m" | "f";

/**
 * Pick the grammatically correct Czech form for a person's gender, e.g.
 * `genderForm(p.gender, "narodil", "narodila")`. Keeps generated prose in a
 * single consistent voice.
 */
export const genderForm = (
  gender: Gender,
  masculine: string,
  feminine: string,
): string => (gender === "f" ? feminine : masculine);

export type Person = {
  label: string;
  birthYear: number;
  country: Country;
  gender: Gender;
  citySlug?: string;
  birthMonth?: number;     // 1-12, optional
  birthDay?: number;       // 1-31, optional
};

export type Fact = {
  category:
    | "bizarre"
    | "beautiful"
    | "everyday"
    | "world"
    | "youth"
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
  text: string;
};

export type PersonReport = {
  person: Person;
  ageNow: number;
  birthDecade: number;
  birthStats: DecadeStats;
  youthCulture: CultureSnapshot;
  countryLabel: string;
  cityLabel: string | null;
  facts: Fact[];
  essay: EssayParagraph[];
};

function ageAt(birthYear: number, year: number): number {
  return year - birthYear;
}

function eventsLivedThrough(birthYear: number): typeof EVENTS {
  return EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= CURRENT_YEAR && e.year - birthYear <= 90,
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

function inventionsBornBefore(birthYear: number) {
  return INVENTIONS.filter((i) => i.year > birthYear);
}

function decadeWord(decadeStart: number): string {
  return `${decadeStart}s`;
}

// Build country-specific facts from the per-decade snapshot. We pull from
// both the person's birth decade and their teenage decade so the texture
// covers "when you were born" and "while you were growing up".
function countryFacts(person: Person): Fact[] {
  const { country, birthYear } = person;
  if (country === "INTL") return [];

  const birthDecade = decadeFactsFor(country, birthYear);
  const youthDecade = decadeFactsFor(country, birthYear + 15);

  const facts: Fact[] = [];
  const decades: { d: CountryDecade | null; when: string }[] = [
    { d: birthDecade, when: `v letech ${decadeWord(Math.floor(birthYear / 10) * 10)}` },
  ];
  if (
    youthDecade &&
    (!birthDecade || youthDecade.decadeStart !== birthDecade.decadeStart)
  ) {
    decades.push({
      d: youthDecade,
      when: `v letech ${decadeWord(youthDecade.decadeStart)}, během dospívání`,
    });
  }

  for (const { d, when } of decades) {
    if (!d) continue;
    // Pick a couple from each thematic bucket.
    pickN(d.government, 1).forEach((t) =>
      facts.push({ category: "government", text: `${capitalize(when)}, ${t}` }),
    );
    pickN(d.clothes, 1).forEach((t) =>
      facts.push({ category: "clothes", text: t }),
    );
    pickN(d.illnesses, 1).forEach((t) =>
      facts.push({ category: "illness", text: t }),
    );
    pickN(d.dailyLife, 1).forEach((t) =>
      facts.push({ category: "daily", text: t }),
    );
    pickN(d.food, 1).forEach((t) =>
      facts.push({ category: "food", text: t }),
    );
    pickN(d.money, 1).forEach((t) =>
      facts.push({ category: "money", text: t }),
    );
    pickN(d.bizarre, 1).forEach((t) =>
      facts.push({ category: "bizarre", text: t }),
    );
    pickN(d.beautiful, 1).forEach((t) =>
      facts.push({ category: "beautiful", text: t }),
    );
  }

  // What people read and watched — magazines, books and TV channels of the
  // birth decade and the teenage decade. Covers 1940s–2020s (CZ & UA only).
  const mediaSeen = new Set<number>();
  [birthYear, birthYear + 15].forEach((y) => {
    const m = mediaFor(country, y);
    if (!m || mediaSeen.has(m.decadeStart)) return;
    mediaSeen.add(m.decadeStart);
    pickN(m.read, 1).forEach((t) => facts.push({ category: "media", text: t }));
    pickN(m.watch, 1).forEach((t) => facts.push({ category: "media", text: t }));
  });

  // Writers who were alive (or had recently died) when this person was born,
  // with the writer's age, where they were living, and the book they were
  // probably writing then (a book published in year P was begun ~P-3).
  pickN(writersAtBirth(country, birthYear), 4).forEach((w) => {
    let s: string;
    if (!w.alive && w.yearsSinceDeath !== undefined) {
      s = `**${w.name}** (${w.blurb}) — ${genderForm(w.gender, "zemřel", "zemřela")} ${w.yearsSinceDeath} ${czYears(w.yearsSinceDeath)} před narozením.`;
    } else {
      s = `**${w.name}** (${w.blurb}), ${w.age} ${czYears(w.age)}`;
      const tail: string[] = [];
      if (w.home) tail.push(`${genderForm(w.gender, "žil", "žila")} ${w.home}`);
      if (w.workingOn) {
        tail.push(
          `${genderForm(w.gender, "pracoval", "pracovala")} na díle ${w.workingOn.title} (vyšlo ${w.workingOn.year})`,
        );
      } else if (w.recent) {
        tail.push(
          `${genderForm(w.gender, "měl za sebou", "měla za sebou")} ${w.recent.title} (${w.recent.year})`,
        );
      }
      s += tail.length ? ` — ${tail.join(" a ")}.` : ".";
    }
    facts.push({ category: "writers", text: s });
  });

  // Country-specific events during their lifetime — weight toward
  // birth ± 25 years and pick 4.
  const countryEvents = eventsForCountry(
    country,
    birthYear,
    Math.min(CURRENT_YEAR, birthYear + 90),
  );
  pickN(countryEvents, 4).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const when = czAgePhrase(age);
    facts.push({
      category: "local",
      text: `${capitalize(when)} (${e.year}): ${e.text}.`,
    });
  });

  // Curated, web-grounded long-form events for Czechia & Ukraine — richer
  // editorial detail than the terse one-liners above. Self-contained
  // sentences, so we surface them year-stamped rather than age-framed.
  const curatedCode = country === "CZ" ? "cz" : country === "UA" ? "ua" : null;
  if (curatedCode) {
    const hi = Math.min(CURRENT_YEAR, birthYear + 90);
    const curated = CURATED_FACTS.filter(
      (f) => f.country === curatedCode && f.year >= birthYear && f.year <= hi,
    );
    pickN(curated, 4).forEach((f) => {
      facts.push({ category: "local", text: `${f.year} — ${f.text}` });
    });
  }

  // Famous people from their birth decade and youth decade.
  const famous = [
    ...famousFor(country, birthYear),
    ...famousFor(country, birthYear + 15),
  ];
  // Dedupe by name.
  const uniqueFamous = Array.from(
    new Map(famous.map((p) => [p.name, p])).values(),
  );
  pickN(uniqueFamous, 5).forEach((p) => {
    facts.push({
      category: "famous",
      text: `**${p.name}** — ${p.role}${p.note ? `: ${p.note}` : ""}.`,
    });
  });

  return facts;
}

export function pairReport(a: Person, b: Person): PairSection[] {
  return buildPairEssay(a, b);
}

export function reportFor(person: Person, excludeWorld = false): PersonReport {
  const { birthYear, label } = person;
  const ageNow = CURRENT_YEAR - birthYear;
  const birthDecade = Math.floor(birthYear / 10) * 10;
  const birthStats = statsForYear(birthYear);
  const youthCulture = cultureForDecade(birthYear + 15);
  const countryLabel = countryLabelFor(person.country, birthYear);
  const city = findCity(person.citySlug);
  const cityLabel = city ? city.name : null;

  const facts: Fact[] = [];

  // ── City-specific events during their lifetime (up to 8) ────────────
  if (city) {
    const cityEvents = cityFactsFor(city.slug, birthYear);
    pickN(cityEvents, 8).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const when = czAgePhrase(age);
      facts.push({
        category: "city",
        text: `${capitalize(when)} (${e.year}, ${city.name}): ${e.text}.`,
      });
    });
  }

  // ── Bizarre: "before X existed" — pick 2 at random ───────────────────
  const beforeStuff = inventionsBornBefore(birthYear);
  if (beforeStuff.length > 0) {
    const big = beforeStuff.filter((i) =>
      ["the iPhone", "Google", "the World Wide Web", "television in most homes", "the personal computer", "sliced bread", "color TV", "the home microwave oven", "the Sony Walkman", "Facebook", "ChatGPT"].includes(i.name),
    );
    const pool = big.length >= 2 ? big : beforeStuff;
    pickN(pool, 2).forEach((inv) => {
      const phrase = inv.detail ?? `${inv.name} ještě nikdo neznal`;
      facts.push({
        category: "bizarre",
        text: `Když se ${label.toLowerCase()} ${genderForm(person.gender, "narodil", "narodila")}, ${phrase}.`,
      });
    });
  }

  // ── Bizarre: vanished countries ───────────────────────────────────────
  const gone = goneCountriesAlive(birthYear).slice(0, 2);
  gone.forEach((c) => {
    const verb = c.becameText ? ` — později ${c.becameText}` : "";
    facts.push({
      category: "bizarre",
      text: `${label} ${genderForm(person.gender, "se narodil", "se narodila")} v době, kdy na mapě ještě existoval stát ${c.name}${verb}.`,
    });
  });

  // ── Beautiful: formative world moments (skipped in a pair — they live
  //    in the shared comparison card) ───────────────────────────────────
  if (!excludeWorld) {
    pickFormative(birthYear).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const ageWord = czAgePhrase(age);
      facts.push({
        category: e.mood === "beautiful" || e.mood === "milestone" ? "beautiful" : "world",
        text: `${capitalize(ageWord)}: ${e.text}.`,
      });
    });

    pickN(eventsByMood(birthYear, "beautiful"), 1).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      facts.push({
        category: "beautiful",
        text: `${label} ${genderForm(person.gender, "měl", "měla")} ${age} let, když ${e.text}.`,
      });
    });
  }

  // ── Everyday life ────────────────────────────────────────────────────
  facts.push({
    category: "everyday",
    text: `V roce, kdy se ${label.toLowerCase()} ${genderForm(person.gender, "narodil", "narodila")}, žilo na světě přibližně ${birthStats.worldPopulationBillions} miliard lidí — dnes je to zhruba ${settings.currentWorldPopulationText}.`,
  });
  facts.push({
    category: "everyday",
    text: `Bochník chleba stál ${fmtMoney(birthStats.loafOfBreadUsd, person.country)} a litr benzinu vyšel na ${fmtGasPerLitre(birthStats.gallonOfGasUsd, person.country)}.`,
  });
  facts.push({
    category: "everyday",
    text: `Průměrná roční mzda se pohybovala kolem ${fmtMoney(birthStats.usAverageAnnualWageUsd, person.country)} a běžný dům stál zhruba ${fmtMoney(birthStats.medianUsHouseUsd, person.country)}.`,
  });
  facts.push({
    category: "everyday",
    text: `Průměrná délka života ve světě tehdy činila asi ${birthStats.globalLifeExpectancy} let. Toho roku se na celém světě narodilo přibližně ${birthStats.worldBirthsPerYearMillions} milionů dětí.`,
  });

  // Real, country-specific figures for the birth year, straight from the World
  // Bank (their series start ~1960, so this only fires for later births). This
  // supplements — never replaces — the rounded global approximations above.
  if (person.country !== "INTL") {
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
    const where = person.country === "INTL" ? "Svět" : countryLabel;

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

  // ── Youth: cultural snapshot ──────────────────────────────────────────
  facts.push({
    category: "youth",
    text: `Během dospívání ${label.toLowerCase()} nejspíš ${genderForm(person.gender, "nosil", "nosila")} ${youthCulture.fashion}.`,
  });
  facts.push({
    category: "youth",
    text: `Jako teenager ${label.toLowerCase()} ${youthCulture.whatTeensDid}.`,
  });
  if (youthCulture.topSongs.length) {
    facts.push({
      category: "youth",
      text: `Písničky, které znal každý: ${youthCulture.topSongs.slice(0, 2).map((s) => `**${s}**`).join(" a ")}.`,
    });
  }
  if (youthCulture.popularMovies.length) {
    facts.push({
      category: "youth",
      text: `V kinech dávali ${youthCulture.popularMovies.slice(0, 3).map((m) => `**${m}**`).join(", ")}.`,
    });
  }
  if (youthCulture.popularBooks.length) {
    facts.push({
      category: "youth",
      text: `Všichni četli ${youthCulture.popularBooks.slice(0, 2).map((b) => `**${b}**`).join(" a ")}.`,
    });
  }

  // ── Bizarre: wage comparison ────────────────────────────────────────
  const wageNow = statsForYear(CURRENT_YEAR).usAverageAnnualWageUsd;
  if (birthStats.usAverageAnnualWageUsd > 0) {
    const multiple = Math.round(wageNow / birthStats.usAverageAnnualWageUsd);
    if (multiple >= 2) {
      facts.push({
        category: "bizarre",
        text: `Průměrná mzda je dnes zhruba ${multiple}× vyšší než v době, kdy se ${label.toLowerCase()} ${genderForm(person.gender, "narodil", "narodila")}.`,
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
      text: c.role ? `**${c.name}** — ${c.role}.` : `**${c.name}**.`,
    });
  });

  // Drop accidental duplicates (e.g. the same "…ještě nikdo neznal" line).
  const seenFacts = new Set<string>();
  const uniqueFacts = facts.filter((f) => {
    if (seenFacts.has(f.text)) return false;
    seenFacts.add(f.text);
    return true;
  });

  return {
    person,
    ageNow,
    birthDecade,
    birthStats,
    youthCulture,
    countryLabel,
    cityLabel,
    facts: uniqueFacts,
    essay: buildEssay(person, excludeWorld),
  };
}

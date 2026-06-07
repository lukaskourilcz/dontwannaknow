import { EVENTS, type EventMood } from "../data/events";
import { INVENTIONS } from "../data/inventions";
import { goneCountriesAlive } from "../data/countries";
import { statsForYear, type DecadeStats } from "../data/stats";
import { cultureForDecade, type CultureSnapshot } from "../data/culture";
import {
  decadeFactsFor,
  COUNTRY_LABELS,
  type Country,
  type CountryDecade,
} from "../data/countryDecades";
import { famousFor } from "../data/famousPeople";
import { eventsForCountry } from "../data/countryEvents";
import { cityFactsFor, findCity } from "../data/cities";
import { FACTS as CURATED_FACTS } from "../data/history";
import { buildEssay, type EssayParagraph } from "./essay";
import { buildPairEssay, type PairSection } from "./pair";

export type Gender = "m" | "f";

/** Pick the grammatically correct Czech form for a person's gender, e.g.
 *  g(p.gender, "narodil", "narodila"). Keeps generated prose in one form. */
export const g = (gender: Gender, masculine: string, feminine: string): string =>
  gender === "f" ? feminine : masculine;

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
    | "city";
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

const CURRENT_YEAR = new Date().getFullYear();

function ageAt(birthYear: number, year: number): number {
  return year - birthYear;
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
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

function fmtUsd(n: number): string {
  if (n < 1) return `${Math.round(n * 100)}¢`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
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

  // Country-specific events during their lifetime — weight toward
  // birth ± 25 years and pick 4.
  const countryEvents = eventsForCountry(
    country,
    birthYear,
    Math.min(CURRENT_YEAR, birthYear + 90),
  );
  pickN(countryEvents, 4).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const when =
      age === 0 ? "v roce narození" : age < 0 ? `${-age} let před narozením` : `ve věku ${age} let`;
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
      text: `${p.name} — ${p.role}${p.note ? `: ${p.note}` : ""}.`,
    });
  });

  return facts;
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

export function pairReport(a: Person, b: Person): PairSection[] {
  return buildPairEssay(a, b);
}

export function reportFor(person: Person): PersonReport {
  const { birthYear, label } = person;
  const ageNow = CURRENT_YEAR - birthYear;
  const birthDecade = Math.floor(birthYear / 10) * 10;
  const birthStats = statsForYear(birthYear);
  const youthCulture = cultureForDecade(birthYear + 15);
  const countryLabel = COUNTRY_LABELS[person.country];
  const city = findCity(person.citySlug);
  const cityLabel = city ? city.name : null;

  const facts: Fact[] = [];

  // ── City-specific events during their lifetime (up to 8) ────────────
  if (city) {
    const cityEvents = cityFactsFor(city.slug, birthYear);
    pickN(cityEvents, 8).forEach((e) => {
      const age = ageAt(birthYear, e.year);
      const when =
        age === 0
          ? "v roce narození"
          : age < 0
          ? `${-age} let před narozením`
          : `ve věku ${age} let`;
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
        text: `Když se ${label.toLowerCase()} ${g(person.gender, "narodil", "narodila")}, ${phrase}.`,
      });
    });
  }

  // ── Bizarre: vanished countries ───────────────────────────────────────
  const gone = goneCountriesAlive(birthYear).slice(0, 2);
  gone.forEach((c) => {
    const verb = c.becameText ? ` — později ${c.becameText}` : "";
    facts.push({
      category: "bizarre",
      text: `${label} ${g(person.gender, "se narodil", "se narodila")} v době, kdy na mapě ještě existoval stát ${c.name}${verb}.`,
    });
  });

  // ── Beautiful: formative world moments ───────────────────────────────
  pickFormative(birthYear).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const ageWord = age === 0 ? "v roce narození" : `ve věku ${age} let`;
    facts.push({
      category: e.mood === "beautiful" || e.mood === "milestone" ? "beautiful" : "world",
      text: `${capitalize(ageWord)}: ${e.text}.`,
    });
  });

  pickN(eventsByMood(birthYear, "beautiful"), 1).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    facts.push({
      category: "beautiful",
      text: `${label} ${g(person.gender, "měl", "měla")} ${age} let, když ${e.text}.`,
    });
  });

  // ── Everyday life ────────────────────────────────────────────────────
  facts.push({
    category: "everyday",
    text: `V roce, kdy se ${label.toLowerCase()} ${g(person.gender, "narodil", "narodila")}, žilo na světě přibližně ${birthStats.worldPopulationBillions} miliard lidí — dnes je to zhruba 8,1 miliardy.`,
  });
  facts.push({
    category: "everyday",
    text: `Bochník chleba stál ${fmtUsd(birthStats.loafOfBreadUsd)} a galon benzinu vyšel na ${fmtUsd(birthStats.gallonOfGasUsd)}.`,
  });
  facts.push({
    category: "everyday",
    text: `Průměrný Američan vydělával zhruba ${fmtUsd(birthStats.usAverageAnnualWageUsd)} ročně a běžný dům stál kolem ${fmtUsd(birthStats.medianUsHouseUsd)}.`,
  });
  facts.push({
    category: "everyday",
    text: `Průměrná délka života ve světě tehdy činila asi ${birthStats.globalLifeExpectancy} let. Toho roku se na celém světě narodilo přibližně ${birthStats.worldBirthsPerYearMillions} milionů dětí.`,
  });

  // ── Youth: cultural snapshot ──────────────────────────────────────────
  facts.push({
    category: "youth",
    text: `Během dospívání ${label.toLowerCase()} nejspíš ${g(person.gender, "nosil", "nosila")} ${youthCulture.fashion}.`,
  });
  facts.push({
    category: "youth",
    text: `Jako teenager ${label.toLowerCase()} ${youthCulture.whatTeensDid}.`,
  });
  if (youthCulture.topSongs.length) {
    facts.push({
      category: "youth",
      text: `Písničky, které znal každý: ${youthCulture.topSongs.slice(0, 2).join(" a ")}.`,
    });
  }
  if (youthCulture.popularMovies.length) {
    facts.push({
      category: "youth",
      text: `V kinech dávali ${youthCulture.popularMovies.slice(0, 3).join(", ")}.`,
    });
  }
  if (youthCulture.popularBooks.length) {
    facts.push({
      category: "youth",
      text: `Všichni četli ${youthCulture.popularBooks.slice(0, 2).join(" a ")}.`,
    });
  }

  // ── Bizarre: wage comparison ────────────────────────────────────────
  const wageNow = statsForYear(CURRENT_YEAR).usAverageAnnualWageUsd;
  if (birthStats.usAverageAnnualWageUsd > 0) {
    const multiple = Math.round(wageNow / birthStats.usAverageAnnualWageUsd);
    if (multiple >= 2) {
      facts.push({
        category: "bizarre",
        text: `Průměrná mzda je dnes zhruba ${multiple}× vyšší než v době, kdy se ${label.toLowerCase()} ${g(person.gender, "narodil", "narodila")}.`,
      });
    }
  }

  // ── Country-specific texture, famous people, and local events ───────
  facts.push(...countryFacts(person));

  return {
    person,
    ageNow,
    birthDecade,
    birthStats,
    youthCulture,
    countryLabel,
    cityLabel,
    facts,
    essay: buildEssay(person),
  };
}

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
import { buildEssay, type EssayParagraph } from "./essay";
import { buildPairEssay, type PairSection } from "./pair";

export type Person = {
  label: string;
  birthYear: number;
  country: Country;
  citySlug?: string;
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
    { d: birthDecade, when: `in the ${decadeWord(Math.floor(birthYear / 10) * 10)}` },
  ];
  if (
    youthDecade &&
    (!birthDecade || youthDecade.decadeStart !== birthDecade.decadeStart)
  ) {
    decades.push({
      d: youthDecade,
      when: `by the ${decadeWord(youthDecade.decadeStart)}, growing up`,
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
      age === 0 ? "the year of birth" : age < 0 ? `${-age} years before` : `age ${age}`;
    facts.push({
      category: "local",
      text: `At ${when} (${e.year}), ${e.text}.`,
    });
  });

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
          ? "the year of birth"
          : age < 0
          ? `${-age} years before they were born`
          : `age ${age}`;
      facts.push({
        category: "city",
        text: `At ${when} (${e.year}, in ${city.name}), ${e.text}.`,
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
      const phrase = inv.detail ?? `${inv.name} didn't exist yet`;
      facts.push({
        category: "bizarre",
        text: `When ${label.toLowerCase()} was born, ${phrase}.`,
      });
    });
  }

  // ── Bizarre: vanished countries ───────────────────────────────────────
  const gone = goneCountriesAlive(birthYear).slice(0, 2);
  gone.forEach((c) => {
    const verb = c.becameText ? ` — it later ${c.becameText}` : "";
    facts.push({
      category: "bizarre",
      text: `${label} was born when ${c.name} still existed on the map${verb}.`,
    });
  });

  // ── Beautiful: formative world moments ───────────────────────────────
  pickFormative(birthYear).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    const ageWord = age === 0 ? "the year of birth" : `age ${age}`;
    facts.push({
      category: e.mood === "beautiful" || e.mood === "milestone" ? "beautiful" : "world",
      text: `At ${ageWord}, ${e.text}.`,
    });
  });

  pickN(eventsByMood(birthYear, "beautiful"), 1).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    facts.push({
      category: "beautiful",
      text: `${label} was ${age} when ${e.text}.`,
    });
  });

  // ── Everyday life ────────────────────────────────────────────────────
  facts.push({
    category: "everyday",
    text: `In the year ${label.toLowerCase()} was born, the world held about ${birthStats.worldPopulationBillions} billion people — today it's about 8.1 billion.`,
  });
  facts.push({
    category: "everyday",
    text: `A loaf of bread cost ${fmtUsd(birthStats.loafOfBreadUsd)} and a gallon of gas was ${fmtUsd(birthStats.gallonOfGasUsd)}.`,
  });
  facts.push({
    category: "everyday",
    text: `The average American earned about ${fmtUsd(birthStats.usAverageAnnualWageUsd)} a year, and a typical house went for around ${fmtUsd(birthStats.medianUsHouseUsd)}.`,
  });
  facts.push({
    category: "everyday",
    text: `Global life expectancy at the time was about ${birthStats.globalLifeExpectancy} years. Roughly ${birthStats.worldBirthsPerYearMillions} million babies were born that year worldwide.`,
  });

  // ── Youth: cultural snapshot ──────────────────────────────────────────
  facts.push({
    category: "youth",
    text: `Growing up, ${label.toLowerCase()} probably wore ${youthCulture.fashion}.`,
  });
  facts.push({
    category: "youth",
    text: `As a teenager, ${label.toLowerCase()} ${youthCulture.whatTeensDid}.`,
  });
  if (youthCulture.topSongs.length) {
    facts.push({
      category: "youth",
      text: `The songs everyone knew: ${youthCulture.topSongs.slice(0, 2).join(" and ")}.`,
    });
  }
  if (youthCulture.popularMovies.length) {
    facts.push({
      category: "youth",
      text: `Cinemas were showing ${youthCulture.popularMovies.slice(0, 3).join(", ")}.`,
    });
  }
  if (youthCulture.popularBooks.length) {
    facts.push({
      category: "youth",
      text: `Everyone was reading ${youthCulture.popularBooks.slice(0, 2).join(" and ")}.`,
    });
  }

  // ── Bizarre: wage comparison ────────────────────────────────────────
  const wageNow = statsForYear(CURRENT_YEAR).usAverageAnnualWageUsd;
  if (birthStats.usAverageAnnualWageUsd > 0) {
    const multiple = Math.round(wageNow / birthStats.usAverageAnnualWageUsd);
    if (multiple >= 2) {
      facts.push({
        category: "bizarre",
        text: `The average wage today is roughly ${multiple}× what it was when ${label.toLowerCase()} was born.`,
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

import { EVENTS, type EventMood } from "../data/events";
import { INVENTIONS } from "../data/inventions";
import { GONE_COUNTRIES } from "../data/countries";
import { statsForYear, type DecadeStats } from "../data/stats";
import { cultureForDecade, type CultureSnapshot } from "../data/culture";

export type Person = {
  label: string; // "You", "Mom", "Grandpa", etc.
  birthYear: number;
};

export type Fact = {
  category: "bizarre" | "beautiful" | "everyday" | "world" | "youth";
  text: string;
};

export type PersonReport = {
  person: Person;
  ageNow: number;
  birthDecade: number;
  birthStats: DecadeStats;
  youthCulture: CultureSnapshot;
  facts: Fact[];
};

const CURRENT_YEAR = new Date().getFullYear();

function ageAt(birthYear: number, year: number): number {
  return year - birthYear;
}

// Pick events that happened while this person was alive, weighted toward
// childhood/teen years (ages 5–20) — the years that shape us most.
function eventsLivedThrough(birthYear: number): typeof EVENTS {
  return EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= CURRENT_YEAR && e.year - birthYear <= 90,
  );
}

function eventsByMood(birthYear: number, mood: EventMood): typeof EVENTS {
  return eventsLivedThrough(birthYear).filter((e) => e.mood === mood);
}

function pickFormative(birthYear: number, max = 5): typeof EVENTS {
  const lived = eventsLivedThrough(birthYear).slice().sort((a, b) => {
    const ageA = a.year - birthYear;
    const ageB = b.year - birthYear;
    // Score by how close to age 12; lower score is more formative.
    return Math.abs(ageA - 12) - Math.abs(ageB - 12);
  });
  return lived.slice(0, max).sort((a, b) => a.year - b.year);
}

function inventionsBornBefore(birthYear: number) {
  return INVENTIONS.filter((i) => i.year > birthYear);
}

function countriesAliveAtBirth(birthYear: number) {
  return GONE_COUNTRIES.filter(
    (c) => c.startedYear <= birthYear && c.endedYear >= birthYear,
  );
}

function fmtUsd(n: number): string {
  if (n < 1) return `${Math.round(n * 100)}¢`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export function reportFor(person: Person): PersonReport {
  const { birthYear, label } = person;
  const ageNow = CURRENT_YEAR - birthYear;
  const birthDecade = Math.floor(birthYear / 10) * 10;
  const birthStats = statsForYear(birthYear);
  const youthStats = statsForYear(birthYear + 16);
  const youthCulture = cultureForDecade(birthYear + 15);

  const facts: Fact[] = [];

  // ── Bizarre: "before X existed" ───────────────────────────────────────
  const beforeStuff = inventionsBornBefore(birthYear);
  if (beforeStuff.length > 0) {
    // Cherry-pick a couple of striking ones.
    const big = beforeStuff.filter((i) =>
      ["the iPhone", "Google", "the World Wide Web", "television in most homes", "the personal computer", "sliced bread", "color TV", "the home microwave oven", "the Sony Walkman", "Facebook", "ChatGPT"].includes(i.name),
    );
    const picks = (big.length >= 2 ? big : beforeStuff).slice(0, 3);
    picks.forEach((inv) => {
      const phrase = inv.detail ?? `${inv.name} didn't exist yet`;
      facts.push({
        category: "bizarre",
        text: `When ${label.toLowerCase()} was born, ${phrase}.`,
      });
    });
  }

  // ── Bizarre: vanished countries ───────────────────────────────────────
  const gone = countriesAliveAtBirth(birthYear).slice(0, 3);
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

  // ── Beautiful: explicitly uplifting events ────────────────────────────
  eventsByMood(birthYear, "beautiful").slice(0, 2).forEach((e) => {
    const age = ageAt(birthYear, e.year);
    facts.push({
      category: "beautiful",
      text: `${label} was ${age} when ${e.text}.`,
    });
  });

  // ── Everyday life: prices and population at birth ─────────────────────
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
    text: `Global life expectancy at the time was about ${birthStats.globalLifeExpectancy} years. Roughly ${birthStats.worldBirthsPerYearMillions} million babies were born that year worldwide — one of them was ${label.toLowerCase()}.`,
  });

  // ── Youth: what life looked like growing up ───────────────────────────
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

  // ── Then-vs-now wage comparison (a bit bizarre) ──────────────────────
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

  // Avoid leaving an unused variable warning.
  void youthStats;
  void articleFor;

  return {
    person,
    ageNow,
    birthDecade,
    birthStats,
    youthCulture,
    facts,
  };
}

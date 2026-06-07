import { FACTS, type Country } from "../data/history";
import type { FormValues } from "./schema";

export type Chapter = {
  key: string;
  year: number;
  place: string;
  intro: string;
  facts: string[];
};

export const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1930;

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Period-correct name so the framing matches the year.
export function placeName(country: Country, year: number): string {
  if (country === "ua") return year < 1991 ? "Soviet Ukraine" : "Ukraine";
  return year < 1993 ? "Czechoslovakia" : "the Czech Republic";
}

// Pick `count` fresh facts near a year: exact window first, then the decade, then anything.
function factsAround(
  country: Country,
  year: number,
  count: number,
  used: Set<string>,
): string[] {
  const fresh = (list: typeof FACTS) => list.filter((f) => !used.has(f.text));
  const decade = Math.floor(year / 10) * 10;

  let pool = fresh(
    FACTS.filter((f) => f.country === country && Math.abs(f.year - year) <= 2),
  );
  if (pool.length < count) {
    const inDecade = fresh(
      FACTS.filter(
        (f) => f.country === country && Math.floor(f.year / 10) * 10 === decade,
      ),
    );
    pool = Array.from(new Set([...pool, ...inDecade]));
  }
  if (pool.length < count) {
    const any = fresh(FACTS.filter((f) => f.country === country));
    pool = Array.from(new Set([...pool, ...any]));
  }

  const picked = shuffle(pool).slice(0, count);
  picked.forEach((f) => used.add(f.text));
  return picked.map((f) => f.text);
}

const clampYear = (y: number) => Math.min(CURRENT_YEAR, Math.max(MIN_YEAR, y));

/**
 * Build a randomized set of personalized "chapters" for one person. Calling it
 * again reshuffles which moments and which facts appear, so every load differs.
 */
export function buildStory(p: FormValues): Chapter[] {
  const rel = p.relationship;
  const birthYear = CURRENT_YEAR - p.personAge;
  const userBirthYear = CURRENT_YEAR - p.userAge;
  const used = new Set<string>();
  const candidates: Chapter[] = [];

  const add = (key: string, rawYear: number, intro: string, count: number) => {
    if (rawYear < MIN_YEAR - 1 || rawYear > CURRENT_YEAR) return;
    const year = clampYear(rawYear);
    const facts = factsAround(p.location, year, count, used);
    if (facts.length) {
      candidates.push({ key, year, place: placeName(p.location, year), intro, facts });
    }
  };

  add(
    "birth",
    birthYear,
    `${p.personName} was born in ${birthYear}. The world your ${rel} arrived into:`,
    3,
  );

  const sameAgeYear = birthYear + p.userAge;
  if (p.personAge >= p.userAge && sameAgeYear <= CURRENT_YEAR) {
    add(
      "sameAge",
      sameAgeYear,
      `When your ${rel} ${p.personName} was ${p.userAge} — the age you are now — it was ${sameAgeYear}.`,
      3,
    );
  }

  add("youth", birthYear + 20, `Your ${rel}'s early twenties, around ${clampYear(birthYear + 20)}:`, 2);

  const personAgeWhenUserBorn = userBirthYear - birthYear;
  if (personAgeWhenUserBorn >= 0 && userBirthYear >= MIN_YEAR) {
    add(
      "userBorn",
      userBirthYear,
      `The year you were born, ${userBirthYear}, your ${rel} was ${personAgeWhenUserBorn}.`,
      2,
    );
  }

  add("now", CURRENT_YEAR, `These days, in ${placeName(p.location, CURRENT_YEAR)}:`, 3);

  // One wildcard year drawn from somewhere in their life.
  const lo = Math.max(MIN_YEAR, birthYear);
  const randYear = lo + Math.floor(Math.random() * (CURRENT_YEAR - lo + 1));
  add("wild", randYear, `${randYear}, somewhere in your ${rel}'s life:`, 2);

  // Random subset + random order → a different read every time.
  return shuffle(candidates).slice(0, 4);
}

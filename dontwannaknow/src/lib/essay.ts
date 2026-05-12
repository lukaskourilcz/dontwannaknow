// Compose a life-essay from all the data we have for a person — city
// events, country events, world events, decade texture. Output is an
// array of paragraphs, each with a heading and a single block of prose.

import type { Person } from "./facts";
import { findCity, cityFactsFor } from "../data/cities";
import { eventsForCountry } from "../data/countryEvents";
import { decadeFactsFor, COUNTRY_LABELS } from "../data/countryDecades";
import { famousFor } from "../data/famousPeople";
import { EVENTS } from "../data/events";
import { goneCountriesAlive } from "../data/countries";
import { INVENTIONS } from "../data/inventions";
import { statsForYear } from "../data/stats";
import { cultureForDecade } from "../data/culture";
import { generationFor } from "../data/generations";
import { birthsAround } from "../data/famousBirths";
import { lifeMathFor, lifeExpectancyFor } from "../data/lifeExpectancy";
import { zodiacFor } from "../data/zodiac";
import { namesFor } from "../data/babyNames";

export type EssayParagraph = {
  heading: string;
  text: string;
};

const CURRENT_YEAR = new Date().getFullYear();

type Event = { year: number; text: string; scope: "city" | "country" | "world" };

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

function gatherEvents(person: Person): Event[] {
  const events: Event[] = [];
  const city = findCity(person.citySlug);
  if (city) {
    cityFactsFor(city.slug, person.birthYear).forEach((e) =>
      events.push({ year: e.year, text: e.text, scope: "city" }),
    );
  }
  if (person.country !== "INTL") {
    eventsForCountry(
      person.country,
      person.birthYear,
      Math.min(CURRENT_YEAR, person.birthYear + 90),
    ).forEach((e) =>
      events.push({ year: e.year, text: e.text, scope: "country" }),
    );
  }
  EVENTS.filter(
    (e) =>
      e.year >= person.birthYear &&
      e.year <= CURRENT_YEAR &&
      e.year - person.birthYear <= 90,
  ).forEach((e) =>
    events.push({ year: e.year, text: e.text, scope: "world" }),
  );
  return events.sort((a, b) => a.year - b.year);
}

// Stitch a list of events into prose, keeping age cues.
function stitch(events: Event[], birthYear: number, max = 8): string {
  if (events.length === 0) return "";
  const picked = pickN(events, max).sort((a, b) => a.year - b.year);
  const parts: string[] = [];
  picked.forEach((e, i) => {
    const age = e.year - birthYear;
    let lead: string;
    if (i === 0) {
      lead = age <= 0
        ? `In ${e.year}, the year they arrived,`
        : `At ${age}, in ${e.year},`;
    } else {
      const prevAge = picked[i - 1].year - birthYear;
      if (e.year === picked[i - 1].year) {
        lead = "and that same year";
      } else if (age - prevAge === 1) {
        lead = "the next year";
      } else if (age - prevAge <= 3) {
        lead = `by the time they were ${age},`;
      } else {
        lead = `years later, when they were ${age},`;
      }
    }
    parts.push(`${lead} ${e.text}.`);
  });
  // Capitalize first letter of each sentence and join.
  return parts.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}

function fmtUsd(n: number): string {
  if (n < 1) return `${Math.round(n * 100)}¢`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function pickOne<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

export function buildEssay(person: Person): EssayParagraph[] {
  const { birthYear, label, country, citySlug } = person;
  const city = findCity(citySlug);
  const countryLabel = COUNTRY_LABELS[country];
  const place = city ? `${city.name}, ${countryLabel}` : countryLabel;

  const allEvents = gatherEvents(person);

  // Bucket events by life stage.
  const stages: { name: string; from: number; to: number }[] = [
    { name: "The world they were born into", from: birthYear - 1, to: birthYear + 4 },
    { name: "Childhood", from: birthYear + 5, to: birthYear + 11 },
    { name: "Coming of age", from: birthYear + 12, to: birthYear + 19 },
    { name: "Their twenties", from: birthYear + 20, to: birthYear + 29 },
    { name: "Their middle years", from: birthYear + 30, to: birthYear + 49 },
    { name: "Later in life", from: birthYear + 50, to: birthYear + 90 },
  ];

  const out: EssayParagraph[] = [];

  // ── Generation badge ──────────────────────────────────────────────
  const generation = generationFor(birthYear);
  if (generation) {
    let badgeText = generation.blurb;
    // ── Sun sign (only if exact date provided) ────────────────────
    if (person.birthMonth && person.birthDay) {
      const sign = zodiacFor(person.birthMonth, person.birthDay);
      if (sign) {
        badgeText += ` Born under ${sign.symbol} ${sign.name} (${sign.element}) — ${sign.blurb}.`;
      }
    }
    out.push({
      heading: `${generation.label} (${generation.startYear}–${generation.endYear})`,
      text: badgeText,
    });
  }

  // ── Top baby names of their decade ────────────────────────────────
  const names = namesFor(person.country, birthYear);
  if (names) {
    out.push({
      heading: "Names they grew up hearing in roll call",
      text: `In the ${names.decadeStart}s, the most-given names in ${COUNTRY_LABELS[person.country]} ran: for boys ${joinList(names.boys.slice(0, 5))}; for girls ${joinList(names.girls.slice(0, 5))}.`,
    });
  }

  // ── Opening paragraph ─────────────────────────────────────────────
  const stats = statsForYear(birthYear);
  const gone = goneCountriesAlive(birthYear);
  const beforeStuff = INVENTIONS.filter((i) => i.year > birthYear);
  const bigInventions = beforeStuff
    .filter((i) =>
      ["the iPhone", "Google", "the World Wide Web", "television in most homes", "the personal computer", "sliced bread", "color TV", "the home microwave oven", "the Sony Walkman", "Facebook", "ChatGPT"].includes(i.name),
    );
  const inventionPool = bigInventions.length >= 2 ? bigInventions : beforeStuff;
  const inventionPicks = pickN(inventionPool, 3).map((i) => i.detail ?? `${i.name} didn't yet exist`);
  const openingBits: string[] = [
    `${label} was born in ${birthYear}, in ${place}.`,
    `The world held about ${stats.worldPopulationBillions} billion people — today it holds roughly 8.1 billion.`,
    `A loaf of bread cost ${fmtUsd(stats.loafOfBreadUsd)}, a gallon of gas ${fmtUsd(stats.gallonOfGasUsd)}, and the average American earned around ${fmtUsd(stats.usAverageAnnualWageUsd)} a year.`,
  ];
  if (gone.length > 0) {
    const goneNames = joinList(gone.slice(0, 3).map((g) => g.name));
    openingBits.push(`${goneNames} still existed on the map.`);
  }
  if (inventionPicks.length > 0) {
    openingBits.push(`At the time, ${joinList(inventionPicks)}.`);
  }
  openingBits.push(`Global life expectancy was about ${stats.globalLifeExpectancy} years.`);
  out.push({ heading: "Opening: the year they arrived", text: openingBits.join(" ") });

  // ── Stage paragraphs ─────────────────────────────────────────────
  for (const stage of stages) {
    if (stage.from > CURRENT_YEAR) break;
    const stageEvents = allEvents.filter(
      (e) => e.year >= stage.from && e.year <= stage.to,
    );
    if (stageEvents.length === 0) continue;
    const prose = stitch(stageEvents, birthYear, 10);
    if (prose) out.push({ heading: stage.name, text: prose });
  }

  // ── Texture paragraph (daily life) ────────────────────────────────
  const decadeForBirth = decadeFactsFor(country, birthYear);
  const decadeForYouth = decadeFactsFor(country, birthYear + 15);
  const textureSource = decadeForYouth ?? decadeForBirth;
  if (textureSource) {
    const bits: string[] = [];
    const clothes = pickOne(textureSource.clothes);
    if (clothes) bits.push(clothes);
    const food = pickOne(textureSource.food);
    if (food) bits.push(food);
    const daily = pickOne(textureSource.dailyLife);
    if (daily) bits.push(daily);
    const illness = pickOne(textureSource.illnesses);
    if (illness) bits.push(illness);
    const money = pickOne(textureSource.money);
    if (money) bits.push(money);
    const government = pickOne(textureSource.government);
    if (government) bits.push(government);
    if (bits.length > 0) {
      out.push({
        heading: "The texture of daily life",
        text: bits.join(" "),
      });
    }
  }

  // ── Birthday peers ─────────────────────────────────────────────────
  const peers = birthsAround(birthYear, 1).filter(
    (b) => !b.name.toLowerCase().includes(label.toLowerCase()),
  );
  if (peers.length > 0) {
    const sample = pickN(peers, Math.min(5, peers.length));
    const sameYear = sample.filter((p) => p.year === birthYear);
    const others = sample.filter((p) => p.year !== birthYear);
    const lines: string[] = [];
    if (sameYear.length > 0) {
      lines.push(
        `Born the same year: ${joinList(sameYear.map((p) => `${p.name} (${p.role})`))}.`,
      );
    }
    if (others.length > 0) {
      lines.push(
        `Born a year either side: ${joinList(
          others.map((p) => `${p.name} (${p.role}, ${p.year})`),
        )}.`,
      );
    }
    out.push({ heading: "People who arrived around the same time", text: lines.join(" ") });
  }

  // ── Meetings remaining ─────────────────────────────────────────────
  if (person.meetingsPerYear && person.meetingsPerYear > 0) {
    const life = lifeMathFor(birthYear, person.country);
    const lifeExp = lifeExpectancyFor(person.country);
    if (life.alreadyPastExpectancy) {
      out.push({
        heading: "What's left",
        text: `${label} is ${life.ageNow}, already past the rough country life-expectancy of ${lifeExp}. Every visit is a gift you can't count out.`,
      });
    } else {
      const meetings = Math.round(
        life.expectedRemainingYears * person.meetingsPerYear,
      );
      out.push({
        heading: "What's left",
        text: `If ${label.toLowerCase()} lives to the country's rough life expectancy of ${lifeExp}, that's about ${life.expectedRemainingYears} more years — and if you see them about ${person.meetingsPerYear} time${person.meetingsPerYear === 1 ? "" : "s"} a year, that's roughly ${meetings} more meeting${meetings === 1 ? "" : "s"}. Worth choosing well.`,
      });
    }
  }

  // ── Famous-people paragraph ──────────────────────────────────────
  const famous = [
    ...famousFor(country, birthYear),
    ...famousFor(country, birthYear + 15),
    ...famousFor(country, birthYear + 30),
  ];
  const uniqueFamous = Array.from(new Map(famous.map((p) => [p.name, p])).values());
  if (uniqueFamous.length > 0) {
    const picked = pickN(uniqueFamous, 6);
    const lines = picked.map((p) => `${p.name} — the ${p.role}${p.note ? ` (${p.note})` : ""}`);
    out.push({
      heading: "Names in the air",
      text: `Among the people whose names ${label.toLowerCase()} would have heard growing up: ${joinList(lines)}.`,
    });
  }

  // ── Closing paragraph: youth culture (songs, films, books) ─────────
  const youthCulture = cultureForDecade(birthYear + 15);
  const cultureBits: string[] = [];
  if (youthCulture.fashion) cultureBits.push(`Growing up, they probably wore ${youthCulture.fashion}.`);
  if (youthCulture.whatTeensDid) cultureBits.push(`As a teenager, they ${youthCulture.whatTeensDid}.`);
  if (youthCulture.topSongs.length >= 2) {
    cultureBits.push(`The radio kept playing ${youthCulture.topSongs.slice(0, 2).join(" and ")}.`);
  }
  if (youthCulture.popularMovies.length >= 2) {
    cultureBits.push(`At the cinema, ${joinList(youthCulture.popularMovies.slice(0, 3))} were on the marquee.`);
  }
  if (youthCulture.popularBooks.length >= 1) {
    cultureBits.push(`Bookshops stocked ${joinList(youthCulture.popularBooks.slice(0, 2))}.`);
  }
  if (cultureBits.length > 0) {
    out.push({ heading: "What they grew up to", text: cultureBits.join(" ") });
  }

  // ── Time-capsule prompt (closer) ─────────────────────────────────
  const yearsLived = CURRENT_YEAR - birthYear;
  const prompt = yearsLived > 0
    ? `If you sat down with ${label.toLowerCase()} today, what one story from before you were born would you ask them to tell? They've been on the planet ${yearsLived} ${yearsLived === 1 ? "year" : "years"} — long enough to have seen most of the world above change shape.`
    : `${label.toLowerCase()} is brand new. The world they're arriving in is the only one they'll ever know — and a hundred years from now, this paragraph will read like a love letter.`;
  out.push({ heading: "A question worth asking", text: prompt });

  return out;
}

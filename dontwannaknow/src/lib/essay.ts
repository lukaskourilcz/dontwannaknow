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
import { birthsAround } from "../data/famousBirths";
import { zodiacFor } from "../data/zodiac";
import { namesFor } from "../data/babyNames";
import { cosmicEventsIn } from "../data/cosmicEvents";
import { deathsAround, deathsInRange } from "../data/notableDeaths";
import { speciesAliveAtBirth } from "../data/extinctions";
import { slangFor } from "../data/slang";
import { educationFor } from "../data/education";
import { worksAround, worksInRange } from "../data/culturalWorks";
import { eventsInMonth, eventsInMonthLifetime, eventsAroundMonth } from "../data/monthlyEvents";

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

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
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

  // ── Sun sign (only if exact date provided) ────────────────────────
  if (person.birthMonth && person.birthDay) {
    const sign = zodiacFor(person.birthMonth, person.birthDay);
    if (sign) {
      out.push({
        heading: `${sign.symbol} ${sign.name}`,
        text: `Born under ${sign.symbol} ${sign.name} (${sign.element}) — ${sign.blurb}.`,
      });
    }
  }

  // ── Top baby names of their decade ────────────────────────────────
  const names = namesFor(person.country, birthYear);
  if (names) {
    out.push({
      heading: "Names they grew up hearing in roll call",
      text: `In the ${names.decadeStart}s, the most-given names in ${COUNTRY_LABELS[person.country]} ran: for boys ${joinList(names.boys.slice(0, 5))}; for girls ${joinList(names.girls.slice(0, 5))}.`,
    });
  }

  // ── School, work, and what you'd study (using teen-decade snapshot)
  const schoolYear = birthYear + 12;
  const edu = educationFor(person.country, schoolYear) ?? educationFor(person.country, birthYear);
  if (edu) {
    const decadeWord = `${edu.decadeStart}s`;
    const parts: string[] = [];
    parts.push(
      `School in the ${decadeWord} in ${COUNTRY_LABELS[person.country]}: compulsory until age ${edu.compulsoryEnd}, with the average adult having completed about ${edu.avgYearsSchooling} years of schooling. ${edu.literacyPct}% of adults could read and write.`,
    );
    parts.push(
      `Roughly ${edu.highSchoolGradPct}% of their cohort finished upper secondary; about ${edu.universityPct}% of adults ever earned a university degree.`,
    );
    parts.push(
      `Subjects on the timetable: ${joinList(edu.subjects)}. ${edu.classroom}`,
    );
    parts.push(
      `The most common jobs in those years: ${joinList(edu.commonJobs)}.`,
    );
    if (edu.workNote) parts.push(edu.workNote);
    out.push({
      heading: "School, work, and what you'd study",
      text: parts.join(" "),
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

  // ── Cosmic neighbours (eclipses, comets, supernovae in their lifetime) ─
  const cosmic = cosmicEventsIn(birthYear, CURRENT_YEAR);
  if (cosmic.length > 0) {
    const picks = pickN(cosmic, Math.min(4, cosmic.length)).sort((a, b) => a.year - b.year);
    const lines = picks.map((c) => `In ${c.year}, ${c.text}`);
    out.push({
      heading: "What the sky did while they were here",
      text: lines.join(". ") + ".",
    });
  }

  // ── Who died the year they arrived ─────────────────────────────────
  const deathsAtBirth = deathsAround(birthYear, 0);
  if (deathsAtBirth.length > 0) {
    const sample = pickN(deathsAtBirth, Math.min(5, deathsAtBirth.length));
    const lines = sample.map((d) => `${d.name}, ${d.role}${d.note ? ` (${d.note})` : ""}`);
    out.push({
      heading: "Who left the world the year they entered it",
      text: `${joinList(lines)}. ${label} arrived just as the lights went out on those lives.`,
    });
  }

  // ── Famous deaths during their lifetime (a wider net) ─────────────
  const livedDeaths = deathsInRange(
    Math.max(birthYear + 1, 1900),
    Math.min(CURRENT_YEAR, birthYear + 90),
  );
  if (livedDeaths.length > 0) {
    const sample = pickN(livedDeaths, Math.min(5, livedDeaths.length)).sort(
      (a, b) => a.year - b.year,
    );
    const lines = sample.map((d) => {
      const age = d.year - birthYear;
      return `${age <= 0 ? "before they remembered" : `aged ${age}`}, they were alive when ${d.name} (${d.role}) died in ${d.year}${d.note ? ` — ${d.note}` : ""}`;
    });
    out.push({
      heading: "Lives that ended while theirs ran",
      text: capitalize(lines.join("; ")) + ".",
    });
  }

  // ── Species still walking the earth when they were born ───────────
  const stillAlive = speciesAliveAtBirth(birthYear, CURRENT_YEAR);
  if (stillAlive.length > 0) {
    const picks = pickN(stillAlive, Math.min(3, stillAlive.length));
    const lines = picks.map((s) => {
      const age = s.declaredExtinctYear - birthYear;
      return `the ${s.species} was still alive — it would not be officially gone until ${s.declaredExtinctYear}${age > 0 ? ` (when they were ${age})` : ""}, when ${s.note}`;
    });
    out.push({
      heading: "Animals that walked the earth with them",
      text: capitalize(lines.join("; ")) + ".",
    });
  }

  // ── The month they arrived ───────────────────────────────────────
  if (person.birthMonth) {
    const sameMonth = eventsInMonth(birthYear, person.birthMonth);
    const around = eventsAroundMonth(birthYear, person.birthMonth, 2);
    const monthName = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ][person.birthMonth - 1];
    const lines: string[] = [];
    if (sameMonth.length > 0) {
      lines.push(
        `In ${monthName} ${birthYear}, the same month they arrived: ${joinList(sameMonth.map((e) => e.text))}.`,
      );
    } else if (around.length > 0) {
      const pick = pickN(around, Math.min(3, around.length)).sort(
        (a, b) => a.year * 12 + a.month - (b.year * 12 + b.month),
      );
      lines.push(
        `Around the month they arrived: ${joinList(pick.map((e) => `in ${monthName} ${e.year}, ${e.text}`))}.`,
      );
    }
    // Same-month-throughout-lifetime — the calendar drumbeat.
    const calendarBeats = eventsInMonthLifetime(birthYear, person.birthMonth, CURRENT_YEAR)
      .filter((e) => e.year !== birthYear);
    if (calendarBeats.length > 0) {
      const picks = pickN(calendarBeats, Math.min(4, calendarBeats.length)).sort(
        (a, b) => a.year - b.year,
      );
      lines.push(
        `Other ${monthName}s in their lifetime brought their own headlines: ${joinList(picks.map((e) => `in ${e.year}, ${e.text}`))}.`,
      );
    }
    if (lines.length > 0) {
      out.push({
        heading: `${monthName} ${birthYear} and the months that share its name`,
        text: lines.join(" "),
      });
    }
  }

  // ── What was being made the year they arrived ────────────────────
  const worksAtBirth = worksAround(birthYear, 1);
  const birthPicks: string[] = [];
  if (worksAtBirth.books.length > 0) {
    const b = pickN(worksAtBirth.books, Math.min(2, worksAtBirth.books.length));
    birthPicks.push(`bookshops stocked ${joinList(b.map((w) => `${w.title} by ${w.creator}`))}`);
  }
  if (worksAtBirth.songs.length > 0) {
    const s = pickN(worksAtBirth.songs, Math.min(2, worksAtBirth.songs.length));
    birthPicks.push(`the radio was playing ${joinList(s.map((w) => `"${w.title}" by ${w.creator}`))}`);
  }
  if (worksAtBirth.paintings.length > 0) {
    const p = pickN(worksAtBirth.paintings, Math.min(1, worksAtBirth.paintings.length));
    birthPicks.push(`painters were finishing ${joinList(p.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (worksAtBirth.plays.length > 0) {
    const pl = pickN(worksAtBirth.plays, Math.min(1, worksAtBirth.plays.length));
    birthPicks.push(`the theatre was premiering ${joinList(pl.map((w) => `${w.title} by ${w.creator}`))}`);
  }
  if (worksAtBirth.sculptures.length > 0) {
    const sc = pickN(worksAtBirth.sculptures, Math.min(1, worksAtBirth.sculptures.length));
    birthPicks.push(`sculptors were unveiling ${joinList(sc.map((w) => `${w.title} (${w.creator})`))}`);
  }
  if (birthPicks.length > 0) {
    out.push({
      heading: "Art and music being made the year they arrived",
      text: `In ${birthYear}, ${joinList(birthPicks)}.`,
    });
  }

  // ── Cultural anchors of their teen / young-adult years ───────────
  const teenStart = birthYear + 13;
  const teenEnd = birthYear + 22;
  if (teenStart <= CURRENT_YEAR) {
    const w = worksInRange(teenStart, Math.min(teenEnd, CURRENT_YEAR));
    const teenPicks: string[] = [];
    if (w.songs.length > 0) {
      teenPicks.push(
        `songs that defined them — ${joinList(
          pickN(w.songs, Math.min(3, w.songs.length)).map((s) => `"${s.title}" (${s.creator}, ${s.year})`),
        )}`,
      );
    }
    if (w.books.length > 0) {
      teenPicks.push(
        `books everyone was passing around — ${joinList(
          pickN(w.books, Math.min(3, w.books.length)).map((b) => `${b.title} by ${b.creator} (${b.year})`),
        )}`,
      );
    }
    if (w.plays.length > 0) {
      teenPicks.push(
        `plays opening on stage — ${joinList(
          pickN(w.plays, Math.min(2, w.plays.length)).map((p) => `${p.title} by ${p.creator} (${p.year})`),
        )}`,
      );
    }
    if (w.paintings.length > 0) {
      teenPicks.push(
        `paintings making news — ${joinList(
          pickN(w.paintings, Math.min(2, w.paintings.length)).map((p) => `${p.title} by ${p.creator} (${p.year})`),
        )}`,
      );
    }
    if (teenPicks.length > 0) {
      out.push({
        heading: "What they were reading, listening to, and looking at",
        text: `Through their teens and twenties: ${teenPicks.join("; ")}.`,
      });
    }
  }

  // ── The slang of their teen years ─────────────────────────────────
  const teenDecade = Math.floor((birthYear + 15) / 10) * 10;
  const slang = slangFor(teenDecade);
  if (slang && slang.expressions.length > 0) {
    const picks = pickN(slang.expressions, Math.min(5, slang.expressions.length));
    const lines = picks.map((s) => `"${s.phrase}" (${s.meaning})`);
    out.push({
      heading: `How teenagers actually talked in the ${teenDecade}s`,
      text: `By the time ${label.toLowerCase()} was running with friends, the slang in their mouth ran: ${joinList(lines)}.`,
    });
  }

  // ── Time-capsule prompt (closer) ─────────────────────────────────
  const yearsLived = CURRENT_YEAR - birthYear;
  const prompt = yearsLived > 0
    ? `If you sat down with ${label.toLowerCase()} today, what one story from before you were born would you ask them to tell? They've been on the planet ${yearsLived} ${yearsLived === 1 ? "year" : "years"} — long enough to have seen most of the world above change shape.`
    : `${label.toLowerCase()} is brand new. The world they're arriving in is the only one they'll ever know — and a hundred years from now, this paragraph will read like a love letter.`;
  out.push({ heading: "A question worth asking", text: prompt });

  return out;
}

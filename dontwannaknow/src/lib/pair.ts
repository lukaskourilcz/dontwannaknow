// Build a comparison essay between two people: shared world events,
// geographic distance between their birthplaces, era-appropriate travel
// difficulty, and the cultural touchstones they overlapped on.

import type { Person } from "./facts";
import { findCity } from "../data/cities";
import { CITY_COORDS, distanceKm } from "../data/cityCoords";
import { EVENTS } from "../data/events";
import { COUNTRY_LABELS } from "../data/countryDecades";
import { cultureForDecade } from "../data/culture";

export type PairSection = {
  heading: string;
  text: string;
};

const CURRENT_YEAR = new Date().getFullYear();

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function ordinalDecade(year: number): string {
  return `${Math.floor(year / 10) * 10}s`;
}

// Era-appropriate description of how hard it was to travel between two
// roughly-located places. `year` is the year we're imagining the trip
// in (typically when the younger person came of age).
function travelDescription(
  year: number,
  countryA: string,
  countryB: string,
  km: number | null,
): string {
  if (km === null) return "";
  const sameCountry = countryA === countryB;
  const northAm = (c: string) => c === "US" || c === "CA" || c === "MX";
  const ironCurtain = (c: string) => c === "CZ" || c === "UA";

  if (sameCountry) {
    if (km < 100) {
      return `Across the same country and only about ${Math.round(km)} km apart, the two could meet by train in a few hours.`;
    }
    if (km < 500) {
      return `Within the same country and about ${Math.round(km)} km apart, a day's train ride would have brought them together.`;
    }
    return `Within the same country but about ${Math.round(km)} km apart, the trip would have meant a full overnight train — and in the 1920s, probably two or three days on poorer rolling stock.`;
  }

  if (northAm(countryA) && northAm(countryB)) {
    if (year < 1945) {
      return `Both in North America and about ${Math.round(km)} km apart — by train through Chicago or El Paso, the trip ran several days, and a passport (introduced for routine US travel in 1941) was not yet a fixed requirement.`;
    }
    if (year < 1970) {
      return `By the postwar years a North-American crossing of ${Math.round(km)} km could be done in a couple of days by Greyhound bus or by car on the new interstates; the first commercial jet flights opened up the same trip in hours from 1958.`;
    }
    return `${Math.round(km)} km apart in North America — by the 1970s a routine four-hour jet flight, but visas and border checks were tightening.`;
  }

  if (ironCurtain(countryA) && ironCurtain(countryB)) {
    return `Both behind the Iron Curtain and about ${Math.round(km)} km apart — internal-bloc travel was easier than reaching the West, but still meant exit-visa stamps, currency limits, and Intourist hotels.`;
  }

  if (ironCurtain(countryA) !== ironCurtain(countryB)) {
    if (year < 1990) {
      return `About ${Math.round(km)} km apart — but one of them lived behind the Iron Curtain. A meeting required visas, hard currency, official invitations, and many people simply could not get permission at all.`;
    }
    return `About ${Math.round(km)} km apart, and easier to bridge after 1989 — but before that, the political distance dwarfed the geographic one.`;
  }

  // Trans-Atlantic Europe ↔ Americas, or trans-Pacific
  if (year < 1939) {
    return `About ${Math.round(km)} km apart — a journey by ocean liner of 5–7 days, in steerage if you were poor or first class if you weren't. Transatlantic passenger flight didn't exist yet.`;
  }
  if (year < 1958) {
    return `About ${Math.round(km)} km apart — by Pan Am Clipper or postwar piston airliner, the trip took 18-30 hours with stops, and cost roughly a year's wages.`;
  }
  if (year < 1975) {
    return `About ${Math.round(km)} km apart — by Boeing 707 or DC-8 the crossing was a long single day, but airfare still cost a month's pay for most working families.`;
  }
  return `${Math.round(km)} km apart — a routine eight-hour flight by the late 70s; package tours had finally made the journey affordable for the middle class.`;
}

export function buildPairEssay(a: Person, b: Person): PairSection[] {
  // Order so `older` is the one born first.
  const [older, younger] = a.birthYear <= b.birthYear ? [a, b] : [b, a];
  const cityOlder = findCity(older.citySlug);
  const cityYounger = findCity(younger.citySlug);
  const placeOlder = cityOlder
    ? `${cityOlder.name}, ${COUNTRY_LABELS[older.country]}`
    : COUNTRY_LABELS[older.country];
  const placeYounger = cityYounger
    ? `${cityYounger.name}, ${COUNTRY_LABELS[younger.country]}`
    : COUNTRY_LABELS[younger.country];

  const ageGap = younger.birthYear - older.birthYear;
  const out: PairSection[] = [];

  // ── Intro paragraph ─────────────────────────────────────────────
  const introBits: string[] = [];
  introBits.push(
    `${older.label} was born in ${older.birthYear} in ${placeOlder}; ${younger.label} arrived ${ageGap === 0 ? "the same year" : `${ageGap} ${ageGap === 1 ? "year" : "years"} later`} in ${placeYounger}.`,
  );
  if (ageGap >= 50) {
    introBits.push(
      `Half a century between them — their childhoods were lived in different worlds.`,
    );
  } else if (ageGap >= 25) {
    introBits.push(
      `A full generation between them — they would have grown up to different music, different politics, different prices.`,
    );
  } else if (ageGap >= 10) {
    introBits.push(
      `Roughly a decade apart — the younger one's playground was already different from the elder's school yard.`,
    );
  } else if (ageGap > 0) {
    introBits.push(
      `Close enough in age that they would have known the same songs and the same fads.`,
    );
  } else {
    introBits.push(`Same year — born into the same world headline by headline.`);
  }
  out.push({ heading: "Two lives, set side by side", text: introBits.join(" ") });

  // ── Geography & travel ──────────────────────────────────────────
  const km = distanceKm(
    cityOlder ? CITY_COORDS[cityOlder.slug] : undefined,
    cityYounger ? CITY_COORDS[cityYounger.slug] : undefined,
  );
  if (km !== null) {
    // We describe travel in the year the younger person was around 25,
    // when a visit between them is most likely.
    const travelYear = younger.birthYear + 25;
    const travelText = travelDescription(
      travelYear,
      older.country,
      younger.country,
      km,
    );
    out.push({
      heading: "How far apart they really were",
      text: travelText,
    });
  } else if (older.country !== younger.country) {
    out.push({
      heading: "How far apart they really were",
      text: `One in ${COUNTRY_LABELS[older.country]}, the other in ${COUNTRY_LABELS[younger.country]} — the kind of distance most people of their time would only cross once in a lifetime, if ever.`,
    });
  }

  // ── Shared world events (within both lifespans) ─────────────────
  const sharedFrom = younger.birthYear; // both alive only after younger born
  const sharedTo = Math.min(
    CURRENT_YEAR,
    older.birthYear + 90,
    younger.birthYear + 90,
  );
  const sharedEvents = EVENTS.filter(
    (e) => e.year >= sharedFrom && e.year <= sharedTo,
  )
    .sort((a, b) => Math.abs(a.year - (sharedFrom + 10)) - Math.abs(b.year - (sharedFrom + 10)))
    .slice(0, 6)
    .sort((a, b) => a.year - b.year);

  if (sharedEvents.length > 0) {
    const lines = sharedEvents.map((e) => {
      const ageOlder = e.year - older.birthYear;
      const ageYounger = e.year - younger.birthYear;
      return `In ${e.year}, ${e.text} — ${older.label} was ${ageOlder}, ${younger.label} was ${ageYounger}.`;
    });
    out.push({
      heading: "What they both lived through",
      text: lines.join(" "),
    });
  }

  // ── Shared culture (overlap of teen decades) ────────────────────
  const olderTeen = ordinalDecade(older.birthYear + 15);
  const youngerTeen = ordinalDecade(younger.birthYear + 15);
  if (olderTeen !== youngerTeen) {
    const olderCulture = cultureForDecade(older.birthYear + 15);
    const youngerCulture = cultureForDecade(younger.birthYear + 15);
    const bits: string[] = [];
    bits.push(
      `${older.label} came of age in the ${olderTeen} — ${olderCulture.fashion}, with ${olderCulture.popularMovies.slice(0, 2).join(" and ")} on the marquee.`,
    );
    bits.push(
      `${younger.label} came of age a generation later in the ${youngerTeen} — ${youngerCulture.fashion}, with ${youngerCulture.popularMovies.slice(0, 2).join(" and ")} on the screen.`,
    );
    out.push({ heading: "Same world, different soundtrack", text: bits.join(" ") });
  } else {
    const culture = cultureForDecade(older.birthYear + 15);
    out.push({
      heading: "The same soundtrack",
      text: `They both came of age in the ${olderTeen}. The songs everyone knew: ${joinList(culture.topSongs.slice(0, 3))}. They both probably wore ${culture.fashion}.`,
    });
  }

  return out;
}

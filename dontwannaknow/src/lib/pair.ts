// Build a comparison essay between two people: shared world events,
// geographic distance between their birthplaces, era-appropriate travel
// difficulty, and the cultural touchstones they overlapped on.

import { g, type Person } from "./facts";
import { findCity } from "../data/cities";
import { CITY_COORDS, distanceKm } from "../data/cityCoords";
import { EVENTS } from "../data/events";
import { countryLabelFor } from "../data/countryDecades";
import { cultureForDecade } from "../data/culture";

export type PairSection = {
  heading: string;
  text?: string;
  items?: string[];
};

const CURRENT_YEAR = new Date().getFullYear();

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} a ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} a ${items[items.length - 1]}`;
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
      return `Ve stejné zemi a vzdáleni jen asi ${Math.round(km)} km — ti dva by se vlakem mohli setkat během několika hodin.`;
    }
    if (km < 500) {
      return `Ve stejné zemi a vzdáleni asi ${Math.round(km)} km — k setkání by stačila celodenní cesta vlakem.`;
    }
    return `Ve stejné zemi, ale vzdáleni asi ${Math.round(km)} km — cesta by znamenala celou noc ve vlaku, a ve dvacátých letech nejspíš dva až tři dny na chatrnějších soupravách.`;
  }

  if (northAm(countryA) && northAm(countryB)) {
    if (year < 1945) {
      return `Oba v Severní Americe a vzdáleni asi ${Math.round(km)} km — vlakem přes Chicago nebo El Paso trvala cesta několik dní a pas (pro běžné cestování v USA zaveden v roce 1941) ještě nebyl pevně daným požadavkem.`;
    }
    if (year < 1970) {
      return `V poválečných letech se dala severoamerická cesta dlouhá ${Math.round(km)} km zvládnout za pár dní autobusem Greyhound nebo autem po nových dálnicích; od roku 1958 ji první komerční tryskové lety zkrátily na hodiny.`;
    }
    return `${Math.round(km)} km od sebe v Severní Americe — v sedmdesátých letech běžný čtyřhodinový let tryskáčem, ale víza a hraniční kontroly se zpřísňovaly.`;
  }

  if (ironCurtain(countryA) && ironCurtain(countryB)) {
    return `Oba za železnou oponou a vzdáleni asi ${Math.round(km)} km — cestování v rámci východního bloku bylo snazší než dostat se na Západ, ale stejně znamenalo výjezdní víza, omezení směny valut a hotely Intourist.`;
  }

  if (ironCurtain(countryA) !== ironCurtain(countryB)) {
    if (year < 1990) {
      return `Asi ${Math.round(km)} km od sebe — jenže jeden z nich žil za železnou oponou. Setkání vyžadovalo víza, tvrdou měnu a oficiální pozvání a mnoho lidí povolení vůbec nedostalo.`;
    }
    return `Asi ${Math.round(km)} km od sebe a po roce 1989 snáze překonatelných — předtím ale politická vzdálenost tu zeměpisnou hravě převyšovala.`;
  }

  // Trans-Atlantic Europe ↔ Americas, or trans-Pacific
  if (year < 1939) {
    return `Asi ${Math.round(km)} km od sebe — plavba zaoceánským parníkem trvala 5 až 7 dní, v podpalubí, pokud jste byli chudí, nebo v první třídě, pokud ne. Transatlantická osobní letecká doprava ještě neexistovala.`;
  }
  if (year < 1958) {
    return `Asi ${Math.round(km)} km od sebe — létajícím člunem Pan Am Clipper nebo poválečným pístovým letadlem trvala cesta s mezipřistáními 18 až 30 hodin a stála zhruba roční výplatu.`;
  }
  if (year < 1975) {
    return `Asi ${Math.round(km)} km od sebe — Boeingem 707 nebo DC-8 byla cesta jedním dlouhým dnem, ale letenka pořád stála většinu pracujících rodin měsíční mzdu.`;
  }
  return `${Math.round(km)} km od sebe — koncem sedmdesátých let běžný osmihodinový let; zájezdy konečně cestu zpřístupnily i střední třídě.`;
}

export function buildPairEssay(a: Person, b: Person): PairSection[] {
  // Order so `older` is the one born first.
  const [older, younger] = a.birthYear <= b.birthYear ? [a, b] : [b, a];
  const cityOlder = findCity(older.citySlug);
  const cityYounger = findCity(younger.citySlug);
  const placeOlder = cityOlder
    ? `${cityOlder.name}, ${countryLabelFor(older.country, older.birthYear)}`
    : countryLabelFor(older.country, older.birthYear);
  const placeYounger = cityYounger
    ? `${cityYounger.name}, ${countryLabelFor(younger.country, younger.birthYear)}`
    : countryLabelFor(younger.country, younger.birthYear);

  const ageGap = younger.birthYear - older.birthYear;
  const sameCity = Boolean(
    older.citySlug && younger.citySlug && older.citySlug === younger.citySlug,
  );
  const out: PairSection[] = [];

  // ── Intro paragraph ─────────────────────────────────────────────
  const introBits: string[] = [];
  introBits.push(
    `${older.label} ${g(older.gender, "se narodil", "se narodila")} v roce ${older.birthYear} v místě ${placeOlder}; ${younger.label} ${g(younger.gender, "přišel", "přišla")} na svět ${ageGap === 0 ? "ve stejném roce" : `o ${ageGap} ${ageGap === 1 ? "rok" : ageGap >= 2 && ageGap <= 4 ? "roky" : "let"} později`} v místě ${placeYounger}.`,
  );
  if (ageGap >= 50) {
    introBits.push(
      `Půl století mezi nimi — dětství prožili v naprosto odlišných světech.`,
    );
  } else if (ageGap >= 25) {
    introBits.push(
      `Celá generace mezi nimi — vyrůstali u jiné hudby, jiné politiky, jiných cen.`,
    );
  } else if (ageGap >= 10) {
    introBits.push(
      `Zhruba deset let od sebe — hřiště mladšího z nich už vypadalo jinak než školní dvůr toho staršího.`,
    );
  } else if (ageGap > 0) {
    introBits.push(
      `Věkově si dost blízcí na to, aby znali stejné písničky a stejné módní výstřelky.`,
    );
  } else {
    introBits.push(`Stejný rok — narozeni do téhož světa, titulek za titulkem.`);
  }
  out.push({ heading: "Dva životy vedle sebe", text: introBits.join(" ") });

  // ── Geography & travel ──────────────────────────────────────────
  if (sameCity && cityOlder) {
    out.push({
      heading: "Stejné město",
      text: `Oba z téhož města — ${cityOlder.name}. Vyrůstali ve stejných ulicích, jen každý v jiné době.`,
    });
  } else {
    const km = distanceKm(
      cityOlder ? CITY_COORDS[cityOlder.slug] : undefined,
      cityYounger ? CITY_COORDS[cityYounger.slug] : undefined,
    );
    if (km !== null && km >= 1) {
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
        heading: "Jak daleko od sebe doopravdy byli",
        text: travelText,
      });
    } else if (older.country !== younger.country) {
      out.push({
        heading: "Jak daleko od sebe doopravdy byli",
        text: `Jeden v zemi ${countryLabelFor(older.country, older.birthYear)}, druhý v zemi ${countryLabelFor(younger.country, younger.birthYear)} — taková vzdálenost, kterou většina lidí jejich doby překonala jednou za život, pokud vůbec.`,
      });
    }
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
    .slice(0, 15)
    .sort((a, b) => a.year - b.year);

  if (sharedEvents.length > 0) {
    const items = sharedEvents.map((e) => {
      const ageOlder = e.year - older.birthYear;
      const ageYounger = e.year - younger.birthYear;
      return `${e.year}: ${e.text}\n${older.label} (${ageOlder}) · ${younger.label} (${ageYounger})`;
    });
    out.push({
      heading: "Čím si oba prošli",
      items,
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
      `${older.label} ${g(older.gender, "dospíval", "dospívala")} v období ${olderTeen} — ${olderCulture.fashion}, a na plakátech kin ${olderCulture.popularMovies.slice(0, 2).map((m) => `**${m}**`).join(" a ")}.`,
    );
    bits.push(
      `${younger.label} ${g(younger.gender, "dospíval", "dospívala")} o generaci později v období ${youngerTeen} — ${youngerCulture.fashion}, a na plátnech ${youngerCulture.popularMovies.slice(0, 2).map((m) => `**${m}**`).join(" a ")}.`,
    );
    out.push({ heading: "Stejný svět, jiný soundtrack", text: bits.join(" ") });
  } else {
    const culture = cultureForDecade(older.birthYear + 15);
    out.push({
      heading: "Stejný soundtrack",
      text: `Oba dospívali v období ${olderTeen}. Písničky, které znal každý: ${joinList(culture.topSongs.slice(0, 3).map((s) => `**${s}**`))}. Nejspíš oba nosili ${culture.fashion}.`,
    });
  }

  return out;
}

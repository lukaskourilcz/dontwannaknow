import { findCity } from "../data/cityCatalog";
import type { Person } from "./person";

export type HistoricalEntityId =
  | "czechoslovakia"
  | "protectorate-bohemia-moravia"
  | "czech-socialist-republic"
  | "czech-republic-federation"
  | "czech-republic"
  | "ukrainian-ssr"
  | "ukrainian-ssr-ussr"
  | "russian-sfsr-ussr"
  | "republic-of-poland"
  | "kingdom-of-romania"
  | "historical-transition"
  | "ukraine";

export type ResolvedHistoricalContext = {
  modernCountry: Person["country"];
  modernCountryLabel: "Česko" | "Ukrajina";
  historicalStateId: HistoricalEntityId;
  historicalStateLabel: string;
  widerStateLabel?: string;
  cityLabel: string;
  historicalCityLabel: string;
  primaryLabel: string;
  presentDayLabel: string;
  transition: boolean;
};

type DateInterval = { start: number; end: number };

function dateKey(year: number, month: number, day: number): number {
  return year * 10_000 + month * 100 + day;
}

function birthInterval(person: Person): DateInterval {
  if (!person.birthMonth) {
    return { start: dateKey(person.birthYear, 1, 1), end: dateKey(person.birthYear, 12, 31) };
  }
  if (!person.birthDay) {
    const lastDay = new Date(Date.UTC(person.birthYear, person.birthMonth, 0)).getUTCDate();
    return {
      start: dateKey(person.birthYear, person.birthMonth, 1),
      end: dateKey(person.birthYear, person.birthMonth, lastDay),
    };
  }
  const exact = dateKey(person.birthYear, person.birthMonth, person.birthDay);
  return { start: exact, end: exact };
}

function historicalCityName(slug: string, year: number, modernName: string): string {
  if (slug === "zlin" && year >= 1949 && year <= 1989) return "Gottwaldov";
  if (slug === "dnipro" && year <= 1925) return "Jekatěrinoslav";
  if (slug === "dnipro" && year >= 1926 && year <= 2015) return "Dněpropetrovsk";
  if (slug === "donetsk" && year <= 1923) return "Juzovka";
  if (slug === "donetsk" && year >= 1924 && year <= 1961) return "Stalino";
  if (slug === "zaporizhzhia" && year <= 1921) return "Oleksandrivsk";
  if (slug === "mariupol" && year >= 1948 && year <= 1989) return "Ždanov";
  if (slug === "luhansk" && ((year >= 1935 && year <= 1958) || (year >= 1970 && year <= 1989))) {
    return "Vorošilovgrad";
  }
  if (slug === "khmelnytskyi" && year <= 1953) return "Proskuriv";
  return modernName;
}

export function resolveHistoricalLocation(person: Person): ResolvedHistoricalContext {
  const city = findCity(person.citySlug);
  const cityLabel = city?.name ?? person.citySlug;
  const historicalCityLabel = historicalCityName(person.citySlug, person.birthYear, cityLabel);
  const interval = birthInterval(person);
  const before = (boundary: number) => interval.end < boundary;
  const from = (boundary: number) => interval.start >= boundary;
  const crosses = (boundary: number) => !before(boundary) && !from(boundary);

  if (person.country === "CZ") {
    const protectorateStart = dateKey(1939, 3, 15);
    const czechoslovakiaRestored = dateKey(1945, 5, 9);
    if (before(protectorateStart)) {
      return context("CZ", "Česko", "czechoslovakia", "Československo");
    }
    if (crosses(protectorateStart)) {
      return context("CZ", "Česko", "historical-transition", "Československo / Protektorát Čechy a Morava", undefined, true);
    }
    if (before(czechoslovakiaRestored)) {
      return context("CZ", "Česko", "protectorate-bohemia-moravia", "Protektorát Čechy a Morava");
    }
    if (crosses(czechoslovakiaRestored)) {
      return context("CZ", "Česko", "historical-transition", "Protektorát Čechy a Morava / Československo", undefined, true);
    }
    if (before(dateKey(1969, 1, 1))) {
      return context("CZ", "Česko", "czechoslovakia", "Československo");
    }
    if (before(dateKey(1990, 1, 1))) {
      return context(
        "CZ",
        "Česko",
        "czech-socialist-republic",
        "Česká socialistická republika",
        "Československo",
      );
    }
    if (before(dateKey(1993, 1, 1))) {
      return context(
        "CZ",
        "Česko",
        "czech-republic-federation",
        "Česká republika",
        "Československo",
      );
    }
    return context("CZ", "Česko", "czech-republic", "Česká republika");
  }

  const sovietUnionStart = dateKey(1922, 12, 30);
  const ukrainianIndependence = dateKey(1991, 8, 24);
  if (person.citySlug === "lviv") {
    const sovietOccupation = dateKey(1939, 9, 17);
    if (before(sovietOccupation)) {
      return context("UA", "Ukrajina", "republic-of-poland", "Polská republika");
    }
    if (crosses(sovietOccupation)) {
      return context("UA", "Ukrajina", "historical-transition", "Polská republika / Ukrajinská SSR", undefined, true);
    }
  }
  if (person.citySlug === "chernivtsi") {
    const sovietAnnexation = dateKey(1940, 6, 28);
    if (before(sovietAnnexation)) {
      return context("UA", "Ukrajina", "kingdom-of-romania", "Rumunské království");
    }
    if (crosses(sovietAnnexation)) {
      return context("UA", "Ukrajina", "historical-transition", "Rumunské království / Ukrajinská SSR", undefined, true);
    }
  }
  if (person.citySlug === "sevastopol" || person.citySlug === "simferopol") {
    const crimeaTransfer = dateKey(1954, 2, 19);
    if (before(crimeaTransfer)) {
      return context("UA", "Ukrajina", "russian-sfsr-ussr", "Ruská SFSR", "Sovětský svaz");
    }
    if (crosses(crimeaTransfer)) {
      return context("UA", "Ukrajina", "historical-transition", "Ruská SFSR / Ukrajinská SSR", "Sovětský svaz", true);
    }
  }
  if (before(sovietUnionStart)) {
    return context("UA", "Ukrajina", "ukrainian-ssr", "Ukrajinská SSR");
  }
  if (crosses(sovietUnionStart)) {
    return context("UA", "Ukrajina", "historical-transition", "Ukrajinská SSR; od konce roku součást Sovětského svazu", undefined, true);
  }
  if (before(ukrainianIndependence)) {
    return context("UA", "Ukrajina", "ukrainian-ssr-ussr", "Ukrajinská SSR", "Sovětský svaz");
  }
  if (crosses(ukrainianIndependence)) {
    return context("UA", "Ukrajina", "historical-transition", "Ukrajinská SSR / Ukrajina", undefined, true);
  }
  return context("UA", "Ukrajina", "ukraine", "Ukrajina");

  function context(
    modernCountry: Person["country"],
    modernCountryLabel: "Česko" | "Ukrajina",
    historicalStateId: HistoricalEntityId,
    historicalStateLabel: string,
    widerStateLabel?: string,
    transition = false,
  ): ResolvedHistoricalContext {
    const state = widerStateLabel
      ? `${historicalStateLabel}, ${widerStateLabel}`
      : historicalStateLabel;
    return {
      modernCountry,
      modernCountryLabel,
      historicalStateId,
      historicalStateLabel,
      widerStateLabel,
      cityLabel,
      historicalCityLabel,
      primaryLabel: `${historicalCityLabel}, ${state}`,
      presentDayLabel: `dnešní ${modernCountryLabel}`,
      transition,
    };
  }
}

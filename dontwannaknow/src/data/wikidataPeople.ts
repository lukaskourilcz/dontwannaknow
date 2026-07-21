// Notable people born in each decade per country, generated at build time from
// Wikidata (scripts/gen-wikidata-people.mjs) and committed as JSON. Surfaces a
// "famous contemporaries" section — people born in the same decade and country
// as the person in the report. Purely additive to the curated datasets.

import json from "./public/wikidataPeople.json";
import type { Country } from "./countryDecades";

export type WikidataPerson = {
  name: string;
  role: string; // occupation label (Czech when available, else English)
  birthYear: number;
  wikidataId: string;
};

const ROLE_FIELDS: Record<string, string> = {
  "Catholic priest": "katolické duchovenstvo",
  actor: "herectví",
  herec: "herectví",
  "filmový herec": "filmové herectví",
  "art collector": "sběratelství umění",
  "artistic gymnast": "sportovní gymnastika",
  "association football coach": "fotbalové trenérství",
  "association football player": "fotbal",
  fotbalista: "fotbal",
  astronaut: "kosmonautika",
  astronomer: "astronomie",
  astronom: "astronomie",
  athlete: "atletika",
  atlet: "atletika",
  bishop: "duchovenstvo",
  botanist: "botanika",
  businessperson: "podnikání",
  entrepreneur: "podnikání",
  "chess player": "šachy",
  šachista: "šachy",
  coach: "trenérství",
  composer: "hudební skladatelství",
  "computer scientist": "informatika",
  ecologist: "ekologie",
  engineer: "inženýrství",
  inženýr: "inženýrství",
  "figure skating coach": "trenérství krasobruslení",
  "film producer": "filmová produkce",
  historian: "historie",
  "ice hockey player": "lední hokej",
  lawyer: "právo",
  advokát: "právo",
  lyricist: "textařství",
  mathematician: "matematika",
  metropolitan: "duchovenstvo",
  duchovní: "duchovenstvo",
  "military officer": "vojenství",
  "military personnel": "vojenství",
  "opera singer": "operní zpěv",
  painter: "malířství",
  malíř: "malířství",
  poet: "poezie",
  politician: "politika",
  politik: "politika",
  professor: "akademická činnost",
  "public figure": "veřejná činnost",
  scientist: "věda",
  screenwriter: "scenáristika",
  singer: "zpěv",
  "sports official": "sportovní funkcionářství",
  teacher: "pedagogika",
  tenista: "tenis",
  writer: "literatura",
  spisovatel: "literatura",
};

const EXCLUDED_ROLES = new Set(["pornographic actor", "university student"]);
const PUBLIC_FIELDS = new Set([
  "herectví",
  "filmové herectví",
  "sběratelství umění",
  "sportovní gymnastika",
  "fotbalové trenérství",
  "fotbal",
  "kosmonautika",
  "astronomie",
  "atletika",
  "botanika",
  "šachy",
  "trenérství",
  "hudební skladatelství",
  "informatika",
  "ekologie",
  "inženýrství",
  "trenérství krasobruslení",
  "filmová produkce",
  "historie",
  "lední hokej",
  "textařství",
  "matematika",
  "operní zpěv",
  "malířství",
  "poezie",
  "věda",
  "scenáristika",
  "zpěv",
  "tenis",
  "literatura",
]);

export function czechRoleField(role: string): string | null {
  if (EXCLUDED_ROLES.has(role)) return null;
  return ROLE_FIELDS[role] ?? null;
}

type Entry = { country: string; decadeStart: number; people: WikidataPerson[] };
const DATA = json as Entry[];

/** Culturally relevant people born in the same year and country. */
export function contemporariesFor(country: Country, birthYear: number): WikidataPerson[] {
  if (country === "INTL") return [];
  const decadeStart = Math.floor(birthYear / 10) * 10;
  const entry = DATA.find((d) => d.country === country && d.decadeStart === decadeStart);
  return (entry?.people ?? []).flatMap((person) => {
    const role = czechRoleField(person.role);
    return role && PUBLIC_FIELDS.has(role) && person.birthYear === birthYear
      ? [{ ...person, role }]
      : [];
  });
}

// Top-20 cities per country (by approximate modern population) with
// year-anchored historical facts spanning 1920–1980. Facts are kept to
// reasonably well-documented public-record items: founding dates of
// landmarks, well-known historical events tied to that city, and
// documented industrial/cultural details. When a year is uncertain or
// approximate, the entry is omitted rather than guessed.

import cityFactsJson from "./cityFacts.json";

import type { Country } from "./countryDecades";

export type City = {
  slug: string;
  name: string;          // canonical English name
  aka?: string;          // local or historical name
  country: Exclude<Country, "INTL">;
  region?: string;
};

export type CityFact = {
  city: string;          // matches City.slug
  year: number;
  text: string;
};

// ──────────────────────────── CITIES ──────────────────────────────────

export const CITIES: City[] = [
  // ─── Czechia / Czechoslovakia ──────────────────────────────────────
  { slug: "prague",              name: "Praha",              aka: "Praha",       country: "CZ" },
  { slug: "brno",                name: "Brno",                                    country: "CZ" },
  { slug: "ostrava",             name: "Ostrava",                                 country: "CZ" },
  { slug: "plzen",               name: "Plzeň",               aka: "Pilsen",      country: "CZ" },
  { slug: "liberec",             name: "Liberec",             aka: "Reichenberg", country: "CZ" },
  { slug: "olomouc",             name: "Olomouc",                                 country: "CZ" },
  { slug: "ceske-budejovice",    name: "České Budějovice",    aka: "Budweis",     country: "CZ" },
  { slug: "hradec-kralove",      name: "Hradec Králové",                          country: "CZ" },
  { slug: "pardubice",           name: "Pardubice",                               country: "CZ" },
  { slug: "usti-nad-labem",      name: "Ústí nad Labem",      aka: "Aussig",      country: "CZ" },
  { slug: "zlin",                name: "Zlín",                aka: "Gottwaldov",  country: "CZ" },
  { slug: "havirov",             name: "Havířov",                                 country: "CZ" },
  { slug: "kladno",              name: "Kladno",                                  country: "CZ" },
  { slug: "most",                name: "Most",                aka: "Brüx",        country: "CZ" },
  { slug: "opava",               name: "Opava",               aka: "Troppau",     country: "CZ" },
  { slug: "frydek-mistek",       name: "Frýdek-Místek",                           country: "CZ" },
  { slug: "karvina",             name: "Karviná",                                 country: "CZ" },
  { slug: "jihlava",             name: "Jihlava",             aka: "Iglau",       country: "CZ" },
  { slug: "teplice",             name: "Teplice",             aka: "Teplitz",     country: "CZ" },
  { slug: "decin",               name: "Děčín",               aka: "Tetschen",    country: "CZ" },
  { slug: "chomutov",            name: "Chomutov",            aka: "Komotau",     country: "CZ" },
  { slug: "jablonec",            name: "Jablonec nad Nisou",  aka: "Gablonz",     country: "CZ" },
  { slug: "mlada-boleslav",      name: "Mladá Boleslav",                          country: "CZ" },
  { slug: "prostejov",           name: "Prostějov",                               country: "CZ" },
  { slug: "prerov",              name: "Přerov",                                  country: "CZ" },
  { slug: "ceska-lipa",          name: "Česká Lípa",          aka: "Böhmisch Leipa", country: "CZ" },
  { slug: "trebic",              name: "Třebíč",                                  country: "CZ" },
  { slug: "trutnov",             name: "Trutnov",             aka: "Trautenau",   country: "CZ" },
  { slug: "trinec",              name: "Třinec",                                  country: "CZ" },
  { slug: "tabor",               name: "Tábor",                                   country: "CZ" },
  { slug: "znojmo",              name: "Znojmo",              aka: "Znaim",       country: "CZ" },
  { slug: "pribram",             name: "Příbram",                                 country: "CZ" },
  { slug: "cheb",                name: "Cheb",                aka: "Eger",        country: "CZ" },
  { slug: "kolin",               name: "Kolín",                                   country: "CZ" },
  { slug: "pisek",               name: "Písek",                                   country: "CZ" },
  { slug: "kromeriz",            name: "Kroměříž",            aka: "Kremsier",    country: "CZ" },
  { slug: "sumperk",             name: "Šumperk",             aka: "Mährisch Schönberg", country: "CZ" },
  { slug: "vsetin",              name: "Vsetín",                                  country: "CZ" },
  { slug: "valasske-mezirici",   name: "Valašské Meziříčí",                       country: "CZ" },
  { slug: "litvinov",            name: "Litvínov",                                country: "CZ" },
  { slug: "breclav",             name: "Břeclav",             aka: "Lundenburg",  country: "CZ" },
  { slug: "novy-jicin",          name: "Nový Jičín",          aka: "Neutitschein", country: "CZ" },
  { slug: "krnov",               name: "Krnov",               aka: "Jägerndorf",  country: "CZ" },
  { slug: "uherske-hradiste",    name: "Uherské Hradiště",                        country: "CZ" },
  { slug: "litomerice",          name: "Litoměřice",          aka: "Leitmeritz",  country: "CZ" },
  { slug: "hodonin",             name: "Hodonín",             aka: "Göding",      country: "CZ" },
  { slug: "zdar-nad-sazavou",    name: "Žďár nad Sázavou",                        country: "CZ" },
  { slug: "kutna-hora",          name: "Kutná Hora",          aka: "Kuttenberg",  country: "CZ" },
  { slug: "cesky-tesin",         name: "Český Těšín",         aka: "Teschen",     country: "CZ" },
  { slug: "havlickuv-brod",      name: "Havlíčkův Brod",      aka: "Deutschbrod", country: "CZ" },

  // ─── Ukraine / Ukrainian SSR ───────────────────────────────────────
  { slug: "kyiv",                name: "Kyjev",                aka: "Kiev",                              country: "UA" },
  { slug: "kharkiv",             name: "Charkov",             aka: "Kharkov",                           country: "UA" },
  { slug: "odesa",               name: "Oděsa",               aka: "Odessa",                            country: "UA" },
  { slug: "dnipro",              name: "Dnipro",              aka: "Dnipropetrovsk / Yekaterinoslav",   country: "UA" },
  { slug: "donetsk",             name: "Donetsk",             aka: "Stalino (1924–61)",                 country: "UA" },
  { slug: "zaporizhzhia",        name: "Zaporizhzhia",                                                   country: "UA" },
  { slug: "lviv",                name: "Lvov",                aka: "Lemberg / Lwów",                    country: "UA" },
  { slug: "kryvyi-rih",          name: "Kryvyi Rih",          aka: "Krivoy Rog",                        country: "UA" },
  { slug: "mykolaiv",            name: "Mykolaiv",            aka: "Nikolaev",                          country: "UA" },
  { slug: "mariupol",            name: "Mariupol",            aka: "Zhdanov (1948–89)",                 country: "UA" },
  { slug: "luhansk",             name: "Luhansk",             aka: "Voroshilovgrad (1935–58, 1970–90)", country: "UA" },
  { slug: "vinnytsia",           name: "Vinnytsia",                                                      country: "UA" },
  { slug: "sevastopol",          name: "Sevastopol",                                                     country: "UA", region: "Crimea" },
  { slug: "simferopol",          name: "Simferopol",                                                     country: "UA", region: "Crimea" },
  { slug: "kherson",             name: "Kherson",                                                        country: "UA" },
  { slug: "chernihiv",           name: "Chernihiv",                                                      country: "UA" },
  { slug: "poltava",             name: "Poltava",                                                        country: "UA" },
  { slug: "cherkasy",            name: "Cherkasy",                                                       country: "UA" },
  { slug: "khmelnytskyi",        name: "Khmelnytskyi",        aka: "Proskuriv (until 1954)",            country: "UA" },
  { slug: "chernivtsi",          name: "Chernivtsi",          aka: "Czernowitz / Cernăuți",             country: "UA" },

  // ─── Spain ──────────────────────────────────────────────────────────
  { slug: "madrid",              name: "Madrid",                                                         country: "ES" },
  { slug: "barcelona",           name: "Barcelona",                                                      country: "ES" },
  { slug: "valencia",            name: "Valencia",            aka: "València",                          country: "ES" },
  { slug: "seville",             name: "Sevilla",             aka: "Sevilla",                           country: "ES" },
  { slug: "zaragoza",            name: "Zaragoza",                                                       country: "ES" },
  { slug: "malaga",              name: "Málaga",                                                         country: "ES" },
  { slug: "murcia",              name: "Murcia",                                                         country: "ES" },
  { slug: "palma",               name: "Palma de Mallorca",                                              country: "ES" },
  { slug: "las-palmas",          name: "Las Palmas de Gran Canaria",                                     country: "ES" },
  { slug: "bilbao",              name: "Bilbao",              aka: "Bilbo",                             country: "ES" },
  { slug: "alicante",            name: "Alicante",            aka: "Alacant",                           country: "ES" },
  { slug: "cordoba",             name: "Córdoba",                                                        country: "ES" },
  { slug: "valladolid",          name: "Valladolid",                                                     country: "ES" },
  { slug: "vigo",                name: "Vigo",                                                           country: "ES" },
  { slug: "gijon",               name: "Gijón",               aka: "Xixón",                             country: "ES" },
  { slug: "hospitalet",          name: "L'Hospitalet de Llobregat",                                      country: "ES" },
  { slug: "vitoria",             name: "Vitoria-Gasteiz",                                                country: "ES" },
  { slug: "coruna",              name: "A Coruña",                                                       country: "ES" },
  { slug: "granada",             name: "Granada",                                                        country: "ES" },
  { slug: "elche",               name: "Elche",               aka: "Elx",                               country: "ES" },

  // ─── United States ──────────────────────────────────────────────────
  { slug: "nyc",                 name: "New York",                                                  country: "US" },
  { slug: "la",                  name: "Los Angeles",                                                    country: "US" },
  { slug: "chicago",             name: "Chicago",                                                        country: "US" },
  { slug: "houston",             name: "Houston",                                                        country: "US" },
  { slug: "phoenix",             name: "Phoenix",                                                        country: "US" },
  { slug: "philadelphia",        name: "Philadelphia",                                                   country: "US" },
  { slug: "san-antonio",         name: "San Antonio",                                                    country: "US" },
  { slug: "san-diego",           name: "San Diego",                                                      country: "US" },
  { slug: "dallas",              name: "Dallas",                                                         country: "US" },
  { slug: "san-jose",            name: "San Jose",                                                       country: "US" },
  { slug: "austin",              name: "Austin",                                                         country: "US" },
  { slug: "jacksonville",        name: "Jacksonville",                                                   country: "US" },
  { slug: "fort-worth",          name: "Fort Worth",                                                     country: "US" },
  { slug: "columbus",            name: "Columbus",                                                       country: "US", region: "Ohio" },
  { slug: "charlotte",           name: "Charlotte",                                                      country: "US", region: "North Carolina" },
  { slug: "indianapolis",        name: "Indianapolis",                                                   country: "US" },
  { slug: "san-francisco",       name: "San Francisco",                                                  country: "US" },
  { slug: "seattle",             name: "Seattle",                                                        country: "US" },
  { slug: "denver",              name: "Denver",                                                         country: "US" },
  { slug: "washington-dc",       name: "Washington, D.C.",                                               country: "US" },

  // ─── Canada ─────────────────────────────────────────────────────────
  { slug: "toronto",             name: "Toronto",                                                        country: "CA" },
  { slug: "montreal",            name: "Montreal",            aka: "Montréal",                          country: "CA" },
  { slug: "vancouver",           name: "Vancouver",                                                      country: "CA" },
  { slug: "calgary",             name: "Calgary",                                                        country: "CA" },
  { slug: "edmonton",            name: "Edmonton",                                                       country: "CA" },
  { slug: "ottawa",              name: "Ottawa",                                                         country: "CA" },
  { slug: "winnipeg",            name: "Winnipeg",                                                       country: "CA" },
  { slug: "quebec-city",         name: "Quebec City",         aka: "Québec",                            country: "CA" },
  { slug: "hamilton",            name: "Hamilton",                                                       country: "CA", region: "Ontario" },
  { slug: "kitchener",           name: "Kitchener-Waterloo",                                             country: "CA", region: "Ontario" },
  { slug: "london-on",           name: "London",                                                         country: "CA", region: "Ontario" },
  { slug: "victoria",            name: "Victoria",                                                       country: "CA", region: "British Columbia" },
  { slug: "halifax",             name: "Halifax",                                                        country: "CA" },
  { slug: "oshawa",              name: "Oshawa",                                                         country: "CA", region: "Ontario" },
  { slug: "windsor-on",          name: "Windsor",                                                        country: "CA", region: "Ontario" },
  { slug: "saskatoon",           name: "Saskatoon",                                                      country: "CA" },
  { slug: "regina",              name: "Regina",                                                         country: "CA" },
  { slug: "st-johns",            name: "St. John's",                                                     country: "CA", region: "Newfoundland" },
  { slug: "sherbrooke",          name: "Sherbrooke",                                                     country: "CA", region: "Quebec" },
  { slug: "kelowna",             name: "Kelowna",                                                        country: "CA", region: "British Columbia" },

  // ─── Mexico ─────────────────────────────────────────────────────────
  { slug: "mexico-city",         name: "Mexico City",         aka: "Ciudad de México",                  country: "MX" },
  { slug: "guadalajara",         name: "Guadalajara",                                                    country: "MX" },
  { slug: "monterrey",           name: "Monterrey",                                                      country: "MX" },
  { slug: "puebla",              name: "Puebla",                                                         country: "MX" },
  { slug: "toluca",              name: "Toluca",                                                         country: "MX" },
  { slug: "tijuana",             name: "Tijuana",                                                        country: "MX" },
  { slug: "leon",                name: "León",                                                           country: "MX" },
  { slug: "juarez",              name: "Ciudad Juárez",                                                  country: "MX" },
  { slug: "queretaro",           name: "Querétaro",                                                      country: "MX" },
  { slug: "torreon",             name: "Torreón",                                                        country: "MX" },
  { slug: "san-luis-potosi",     name: "San Luis Potosí",                                                country: "MX" },
  { slug: "merida",              name: "Mérida",                                                         country: "MX" },
  { slug: "mexicali",            name: "Mexicali",                                                       country: "MX" },
  { slug: "aguascalientes",      name: "Aguascalientes",                                                 country: "MX" },
  { slug: "cuernavaca",          name: "Cuernavaca",                                                     country: "MX" },
  { slug: "saltillo",            name: "Saltillo",                                                       country: "MX" },
  { slug: "hermosillo",          name: "Hermosillo",                                                     country: "MX" },
  { slug: "culiacan",            name: "Culiacán",                                                       country: "MX" },
  { slug: "veracruz",            name: "Veracruz",                                                       country: "MX" },
  { slug: "acapulco",            name: "Acapulco",                                                       country: "MX" },
];

export function citiesFor(country: Country): City[] {
  if (country === "INTL") return [];
  return CITIES.filter((c) => c.country === country);
}

export function findCity(slug: string | null | undefined): City | undefined {
  if (!slug) return undefined;
  return CITIES.find((c) => c.slug === slug);
}

// ─────────────────────────── CITY FACTS ───────────────────────────────

export const CITY_FACTS: CityFact[] = cityFactsJson as CityFact[];

// ──────────────────────────── Selectors ───────────────────────────────

export function cityFactsFor(
  citySlug: string,
  birthYear: number,
  windowYears = 90,
): CityFact[] {
  return CITY_FACTS.filter(
    (f) =>
      f.city === citySlug &&
      f.year >= birthYear - 5 && // also include a few "right before they were born"
      f.year <= birthYear + windowYears,
  ).sort((a, b) => a.year - b.year);
}

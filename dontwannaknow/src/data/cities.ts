// Top-20 cities per country (by approximate modern population) with
// year-anchored historical facts spanning 1920–1980. Facts are kept to
// reasonably well-documented public-record items: founding dates of
// landmarks, well-known historical events tied to that city, and
// documented industrial/cultural details. When a year is uncertain or
// approximate, the entry is omitted rather than guessed.

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
  { slug: "prague",              name: "Prague",              aka: "Praha",       country: "CZ" },
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

  // ─── Ukraine / Ukrainian SSR ───────────────────────────────────────
  { slug: "kyiv",                name: "Kyiv",                aka: "Kiev",                              country: "UA" },
  { slug: "kharkiv",             name: "Kharkiv",             aka: "Kharkov",                           country: "UA" },
  { slug: "odesa",               name: "Odesa",               aka: "Odessa",                            country: "UA" },
  { slug: "dnipro",              name: "Dnipro",              aka: "Dnipropetrovsk / Yekaterinoslav",   country: "UA" },
  { slug: "donetsk",             name: "Donetsk",             aka: "Stalino (1924–61)",                 country: "UA" },
  { slug: "zaporizhzhia",        name: "Zaporizhzhia",                                                   country: "UA" },
  { slug: "lviv",                name: "Lviv",                aka: "Lemberg / Lwów",                    country: "UA" },
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
  { slug: "seville",             name: "Seville",             aka: "Sevilla",                           country: "ES" },
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
  { slug: "nyc",                 name: "New York City",                                                  country: "US" },
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

export const CITY_FACTS: CityFact[] = [
  // ─── Prague ──────────────────────────────────────────────────────
  { city: "prague", year: 1921, text: "Karel Čapek premiered R.U.R. at the Vinohrady Theatre, giving the world the word 'robot'" },
  { city: "prague", year: 1924, text: "Franz Kafka was buried in the New Jewish Cemetery in Žižkov after dying in a sanatorium near Vienna" },
  { city: "prague", year: 1929, text: "St. Vitus Cathedral inside Prague Castle was officially finished after almost 600 years of construction" },
  { city: "prague", year: 1939, text: "Nazi tanks rolled into Prague Castle on 15 March and the swastika flew over the Czech lands" },
  { city: "prague", year: 1942, text: "SS chief Reinhard Heydrich was attacked by Czech paratroopers in Libeň and died of his wounds days later" },
  { city: "prague", year: 1945, text: "the Prague Uprising began on 5 May with barricades on every street; the Red Army arrived on 9 May" },
  { city: "prague", year: 1948, text: "Klement Gottwald announced the Communist takeover from a balcony on Old Town Square in February" },
  { city: "prague", year: 1955, text: "a 30-metre stone Stalin monument was unveiled on Letná Hill — the world's largest" },
  { city: "prague", year: 1962, text: "the Stalin monument on Letná was dynamited at dawn after seven years" },
  { city: "prague", year: 1967, text: "Mikhail Bulgakov's banned plays were quietly premiered in Prague theatres during the Thaw" },
  { city: "prague", year: 1968, text: "Soviet tanks rolled into Wenceslas Square on the night of 20–21 August" },
  { city: "prague", year: 1969, text: "philosophy student Jan Palach burned himself to death on Wenceslas Square on 16 January" },
  { city: "prague", year: 1974, text: "Metro Line C opened — the first section of the Prague Metro, from Florenc to Kačerov" },
  { city: "prague", year: 1977, text: "Charter 77 was issued from Václav Havel's flat and signed by 241 dissidents" },

  // ─── Brno ───────────────────────────────────────────────────────
  { city: "brno", year: 1928, text: "the first Brno Trade Fair (Výstaviště) opened — a Central European trade-show showcase" },
  { city: "brno", year: 1930, text: "Villa Tugendhat was completed by Mies van der Rohe — later a UNESCO World Heritage Site" },
  { city: "brno", year: 1939, text: "Nazi occupation began; the Špilberk fortress became a prison and execution site" },
  { city: "brno", year: 1945, text: "the 'Brno Death March' expelled some 27,000 ethnic Germans toward Austria on foot" },
  { city: "brno", year: 1965, text: "the Czechoslovak Grand Prix motor race revived at the Masaryk Circuit on the city outskirts" },
  { city: "brno", year: 1968, text: "Czech New Wave filmmakers used the Brno film studios; some fled abroad after the Soviet invasion" },

  // ─── Ostrava ────────────────────────────────────────────────────
  { city: "ostrava", year: 1923, text: "Vítkovice ironworks expanded; over 20,000 workers — the biggest steelworks in Czechoslovakia" },
  { city: "ostrava", year: 1945, text: "the Ostrava-Opava Offensive ended in late April with Red Army liberation" },
  { city: "ostrava", year: 1951, text: "construction began on Nová Huť (NHKG) — a showcase socialist steel mill" },
  { city: "ostrava", year: 1968, text: "Soviet tanks occupied Vítkovice steelworks; workers went on strike" },
  { city: "ostrava", year: 1970, text: "Ostrava had among Europe's worst air pollution; respiratory disease was endemic" },

  // ─── Plzeň ──────────────────────────────────────────────────────
  { city: "plzen", year: 1928, text: "the Škoda Works employed more than 30,000 workers — armaments, locomotives, and engineering" },
  { city: "plzen", year: 1939, text: "Nazi Germany seized the Škoda Works for the Wehrmacht's war machine" },
  { city: "plzen", year: 1942, text: "the RAF carried out a massive night bombing raid on the Škoda Works" },
  { city: "plzen", year: 1945, text: "Plzeň was liberated by General Patton's US Third Army on 6 May — the only major Czech city freed by Americans" },
  { city: "plzen", year: 1953, text: "the Plzeň Uprising erupted on 1 June; thousands of Škoda workers protested the currency reform" },

  // ─── Liberec ───────────────────────────────────────────────────
  { city: "liberec", year: 1920, text: "the city (then Reichenberg) was about 80% German-speaking" },
  { city: "liberec", year: 1938, text: "annexed to Nazi Germany as the seat of the Reichsgau Sudetenland" },
  { city: "liberec", year: 1945, text: "ethnic Germans were expelled under the Beneš decrees" },
  { city: "liberec", year: 1968, text: "Soviet tanks occupied the central square; nine civilians were shot during demonstrations" },
  { city: "liberec", year: 1973, text: "the Ještěd TV tower-hotel opened — a hyperboloid landmark visible across north Bohemia" },

  // ─── Olomouc ───────────────────────────────────────────────────
  { city: "olomouc", year: 1939, text: "the Olomouc synagogue was burned by Nazi paramilitaries in March" },
  { city: "olomouc", year: 1945, text: "the city was liberated by the Red Army in May" },
  { city: "olomouc", year: 1955, text: "the astronomical clock on the town hall was rebuilt in socialist-realist style after WWII damage" },

  // ─── České Budějovice ─────────────────────────────────────────
  { city: "ceske-budejovice", year: 1937, text: "Budvar brewery was nationalised by the Czechoslovak state" },
  { city: "ceske-budejovice", year: 1945, text: "the city was liberated by the Red Army" },
  { city: "ceske-budejovice", year: 1960, text: "Budvar's decades-long trademark battle with US Budweiser was already well under way" },

  // ─── Hradec Králové ──────────────────────────────────────────
  { city: "hradec-kralove", year: 1925, text: "urban planner Josef Gočár's modernist redesign earned the city the nickname 'Salon of the Republic'" },
  { city: "hradec-kralove", year: 1934, text: "the Petrof piano factory was exporting worldwide; the city's musical-instrument industry was at its peak" },
  { city: "hradec-kralove", year: 1945, text: "liberated by the Red Army at war's end" },
  { city: "hradec-kralove", year: 1976, text: "the new university teaching hospital opened" },

  // ─── Pardubice ────────────────────────────────────────────────
  { city: "pardubice", year: 1924, text: "the Velká Pardubická steeplechase was already a fifty-year-old institution" },
  { city: "pardubice", year: 1964, text: "chemist Stanislav Brebera invented Semtex plastic explosive at the Synthesia plant" },
  { city: "pardubice", year: 1972, text: "Semtex began mass production at Synthesia for export to friendly states" },

  // ─── Ústí nad Labem ────────────────────────────────────────
  { city: "usti-nad-labem", year: 1920, text: "the city (then Aussig) was the chemical-industry hub of north Bohemia, mostly German-speaking" },
  { city: "usti-nad-labem", year: 1938, text: "annexed to Nazi Germany as part of the Sudetenland" },
  { city: "usti-nad-labem", year: 1945, text: "the 'Ústí massacre' of ethnic Germans took place at the Beneš Bridge on 31 July" },
  { city: "usti-nad-labem", year: 1975, text: "coal-fired power plants nearby caused dramatic air pollution across the region" },

  // ─── Zlín ──────────────────────────────────────────────────
  { city: "zlin", year: 1925, text: "Tomáš Baťa expanded his shoe-factory complex into a self-contained company town" },
  { city: "zlin", year: 1932, text: "Tomáš Baťa died in an air crash at Otrokovice airport in poor weather" },
  { city: "zlin", year: 1939, text: "the Baťa company was placed under German management after Nazi occupation" },
  { city: "zlin", year: 1949, text: "the city was renamed Gottwaldov — and stayed that way until 1989" },
  { city: "zlin", year: 1969, text: "Zlín children's film studios continued producing classic Czech animation" },

  // ─── Havířov ───────────────────────────────────────────────
  { city: "havirov", year: 1955, text: "Havířov was founded from scratch as a model socialist new town for Ostrava miners" },
  { city: "havirov", year: 1960, text: "the central avenues went up in 'socialist realism' style with pastel facades" },

  // ─── Kladno ────────────────────────────────────────────────
  { city: "kladno", year: 1920, text: "the POLDI steelworks and surrounding coal mines made Kladno a communist working-class stronghold" },
  { city: "kladno", year: 1945, text: "liberated by the Red Army at war's end" },
  { city: "kladno", year: 1948, text: "Kladno steelworkers were among the first to back the February communist coup" },
  { city: "kladno", year: 1965, text: "the POLDI national enterprise employed tens of thousands across the region" },

  // ─── Most ───────────────────────────────────────────────────
  { city: "most", year: 1938, text: "annexed to Nazi Germany as part of the Sudetenland" },
  { city: "most", year: 1945, text: "returned to Czechoslovakia at the war's end" },
  { city: "most", year: 1964, text: "demolition of the old town began to expand the brown-coal strip mines" },
  { city: "most", year: 1975, text: "the Late-Gothic Church of the Assumption was moved 841 metres on rails to save it from coal mining — a world-famous engineering feat" },

  // ─── Opava ──────────────────────────────────────────────────
  { city: "opava", year: 1938, text: "annexed to Nazi Germany as part of the Sudetenland (then Troppau)" },
  { city: "opava", year: 1945, text: "the Battle of Opava in April involved heavy urban combat between the Red Army and Wehrmacht" },
  { city: "opava", year: 1968, text: "Soviet tanks crossed the Polish border here in the Warsaw Pact invasion" },

  // ─── Frýdek-Místek ────────────────────────────────────────
  { city: "frydek-mistek", year: 1939, text: "Czech soldiers at the Czajanka barracks fired on advancing Wehrmacht troops on 14 March — the only armed resistance to the occupation" },
  { city: "frydek-mistek", year: 1943, text: "Frýdek and Místek were merged into a single city under Nazi administration" },
  { city: "frydek-mistek", year: 1975, text: "vast prefabricated housing estates (paneláky) went up to house steel workers commuting to Ostrava" },

  // ─── Karviná ───────────────────────────────────────────────
  { city: "karvina", year: 1938, text: "briefly annexed by Poland in October during the Munich crisis, then by Germany" },
  { city: "karvina", year: 1945, text: "returned to Czechoslovakia at war's end" },
  { city: "karvina", year: 1972, text: "much of the historic old town was demolished due to mining subsidence" },

  // ─── Jihlava ──────────────────────────────────────────────
  { city: "jihlava", year: 1939, text: "annexed to Nazi Germany; the German-speaking Jihlava-Iglau enclave was redrawn" },
  { city: "jihlava", year: 1945, text: "ethnic Germans were expelled under the Beneš decrees" },
  { city: "jihlava", year: 1971, text: "the Modeta knitwear factory expanded to become a major regional employer" },

  // ─── Teplice ────────────────────────────────────────────────
  { city: "teplice", year: 1920, text: "Teplice was a German-speaking spa town with a long history of visits from Goethe and Beethoven" },
  { city: "teplice", year: 1938, text: "annexed to Nazi Germany as part of the Sudetenland" },
  { city: "teplice", year: 1945, text: "returned to Czechoslovakia at war's end" },
  { city: "teplice", year: 1976, text: "youth concerts here became key gathering points for underground Czech rock" },

  // ─── Děčín ─────────────────────────────────────────────────
  { city: "decin", year: 1920, text: "the Elbe river port (then Tetschen) handled coal, glass, and chemical exports" },
  { city: "decin", year: 1938, text: "annexed to Nazi Germany as part of the Sudetenland" },
  { city: "decin", year: 1945, text: "Czech sovereignty was restored; ethnic Germans were expelled" },
  { city: "decin", year: 1968, text: "Soviet tanks crossed the Elbe near here in the Warsaw Pact invasion" },

  // ─── Kyiv ────────────────────────────────────────────────────
  { city: "kyiv", year: 1920, text: "Kyiv changed hands repeatedly between Reds, Whites, Ukrainians, and Poles during the civil war" },
  { city: "kyiv", year: 1934, text: "the Ukrainian SSR's capital was moved here from Kharkiv" },
  { city: "kyiv", year: 1941, text: "the Babyn Yar ravine massacre — 33,771 Kyiv Jews shot in 36 hours on 29–30 September" },
  { city: "kyiv", year: 1943, text: "the Red Army retook Kyiv in November after a massive crossing of the Dnipro" },
  { city: "kyiv", year: 1949, text: "Khreshchatyk Boulevard reopened after total reconstruction from rubble" },
  { city: "kyiv", year: 1960, text: "Kyiv Metro opened — the first metro system in Ukraine" },
  { city: "kyiv", year: 1965, text: "Sergei Parajanov filmed Shadows of Forgotten Ancestors at the Dovzhenko studios" },
  { city: "kyiv", year: 1975, text: "Dynamo Kyiv won the European Cup Winners' Cup — first Soviet club to win a European trophy" },

  // ─── Kharkiv ────────────────────────────────────────────────
  { city: "kharkiv", year: 1920, text: "Kharkiv became the capital of the Ukrainian SSR — and remained so until 1934" },
  { city: "kharkiv", year: 1928, text: "the Derzhprom (Gosprom) constructivist tower complex was completed on Freedom Square — one of Europe's first" },
  { city: "kharkiv", year: 1933, text: "the Holodomor famine peaked; Kharkiv streets had bodies of starved peasants who'd come for bread" },
  { city: "kharkiv", year: 1937, text: "many leading figures of the Ukrainian 'Executed Renaissance' were arrested and shot in Kharkiv" },
  { city: "kharkiv", year: 1941, text: "the Wehrmacht captured the city in October; civilians were hanged from balconies on Sumska Street" },
  { city: "kharkiv", year: 1943, text: "Kharkiv was liberated for the third and final time in August" },
  { city: "kharkiv", year: 1976, text: "the Kharkiv Metro opened — only the second in Ukraine" },

  // ─── Odesa ──────────────────────────────────────────────────
  { city: "odesa", year: 1920, text: "Soviet forces took the city for good after years of civil-war turnover" },
  { city: "odesa", year: 1925, text: "Sergei Eisenstein filmed Battleship Potemkin, including the Potemkin Steps sequence" },
  { city: "odesa", year: 1941, text: "Odesa held out for 73 days against Romanian and German forces before falling" },
  { city: "odesa", year: 1942, text: "Romanian-occupied Odesa was the site of the Odesa Massacre of Jews" },
  { city: "odesa", year: 1944, text: "the Red Army recaptured the city in April" },
  { city: "odesa", year: 1965, text: "Odesa was awarded 'Hero City' status by the Soviet Union" },

  // ─── Dnipro ─────────────────────────────────────────────────
  { city: "dnipro", year: 1926, text: "the city was renamed Dnipropetrovsk after Bolshevik leader Grigory Petrovsky" },
  { city: "dnipro", year: 1932, text: "the DniproHES hydroelectric dam upstream was opened — a flagship of Soviet industrialisation" },
  { city: "dnipro", year: 1941, text: "Soviet forces blew up the DniproHES dam to slow the German advance; thousands of Soviet civilians downstream drowned" },
  { city: "dnipro", year: 1944, text: "the city was liberated by Soviet forces in October" },
  { city: "dnipro", year: 1954, text: "Mykhail Yangel's design bureau, the Soviet ICBM programme, was set up here — turning Dnipro into a closed city" },

  // ─── Donetsk ────────────────────────────────────────────────
  { city: "donetsk", year: 1924, text: "the city was renamed Stalino — a name it would keep until 1961" },
  { city: "donetsk", year: 1929, text: "coal output exploded under the First Five-Year Plan; the Donbas became the USSR's industrial heart" },
  { city: "donetsk", year: 1941, text: "occupied by Wehrmacht in October; thousands of POWs and Jews were murdered" },
  { city: "donetsk", year: 1943, text: "Stalino was liberated in September after fierce fighting" },
  { city: "donetsk", year: 1961, text: "the city was renamed Donetsk after the Siversky Donets river/region during de-Stalinization" },
  { city: "donetsk", year: 1978, text: "Donbas coal output peaked; Donetsk was one of the wealthiest Soviet cities" },

  // ─── Zaporizhzhia ──────────────────────────────────────────
  { city: "zaporizhzhia", year: 1929, text: "construction began on the DniproHES dam — the largest hydroelectric project in interwar Europe" },
  { city: "zaporizhzhia", year: 1932, text: "the DniproHES dam was inaugurated; its electricity powered the city's new steel plants" },
  { city: "zaporizhzhia", year: 1941, text: "the dam was destroyed by retreating Soviets to slow the German advance" },
  { city: "zaporizhzhia", year: 1947, text: "the DniproHES dam was rebuilt; metallurgy plants resumed full production" },
  { city: "zaporizhzhia", year: 1975, text: "a giant aluminium plant and titanium-magnesium complex made the city a Soviet metallurgy capital" },

  // ─── Lviv ───────────────────────────────────────────────────
  { city: "lviv", year: 1920, text: "Lviv (Lwów) was firmly part of interwar Poland after the Polish-Ukrainian War" },
  { city: "lviv", year: 1939, text: "the Soviet Red Army occupied the city in September after the Molotov-Ribbentrop Pact" },
  { city: "lviv", year: 1941, text: "Nazi forces captured the city; the Lviv pogroms and the Lviv Ghetto followed" },
  { city: "lviv", year: 1943, text: "the Janowska concentration camp on the edge of Lviv was liquidated; tens of thousands had been killed there" },
  { city: "lviv", year: 1944, text: "the Red Army recaptured Lviv in July" },
  { city: "lviv", year: 1946, text: "the city's Polish population was transferred westward; Ukrainians from Polish territory moved in" },
  { city: "lviv", year: 1970, text: "Lviv became a quiet centre of Ukrainian dissident culture and underground samizdat" },

  // ─── Kryvyi Rih ────────────────────────────────────────────
  { city: "kryvyi-rih", year: 1929, text: "the Krivorizhstal iron-ore plant became a flagship of Soviet metallurgy" },
  { city: "kryvyi-rih", year: 1941, text: "occupied by Nazi forces in August" },
  { city: "kryvyi-rih", year: 1944, text: "liberated by the Red Army in February" },
  { city: "kryvyi-rih", year: 1973, text: "the Krivorizhstal complex was producing more steel than several entire European countries" },

  // ─── Mykolaiv ──────────────────────────────────────────────
  { city: "mykolaiv", year: 1920, text: "Mykolaiv shipyards had been a major Imperial Russian naval centre and were quickly back at work for the Soviets" },
  { city: "mykolaiv", year: 1941, text: "the Wehrmacht captured the shipyards in August" },
  { city: "mykolaiv", year: 1944, text: "the Red Army retook the city in March" },
  { city: "mykolaiv", year: 1972, text: "the aircraft carrier Kyiv — first of the Kyiv class — was laid down here" },

  // ─── Mariupol ─────────────────────────────────────────────
  { city: "mariupol", year: 1933, text: "the Azovstal metallurgical plant was opened — one of the USSR's flagship steel mills" },
  { city: "mariupol", year: 1941, text: "occupied by Wehrmacht in October; Jews of Mariupol were murdered at the Agrobaza ravine" },
  { city: "mariupol", year: 1943, text: "liberated by the Red Army in September" },
  { city: "mariupol", year: 1948, text: "the city was renamed Zhdanov after Stalin's lieutenant Andrei Zhdanov" },
  { city: "mariupol", year: 1975, text: "Azovstal and Illich Steel together employed about 50,000 workers" },

  // ─── Luhansk ──────────────────────────────────────────────
  { city: "luhansk", year: 1935, text: "the city was renamed Voroshilovgrad after Marshal Voroshilov" },
  { city: "luhansk", year: 1941, text: "occupied by the Wehrmacht in July 1942 (and liberated in February 1943)" },
  { city: "luhansk", year: 1958, text: "renamed back to Luhansk during de-Stalinization" },
  { city: "luhansk", year: 1970, text: "renamed Voroshilovgrad again under Brezhnev" },
  { city: "luhansk", year: 1956, text: "the city's steam locomotive works was one of the largest in the USSR" },

  // ─── Vinnytsia ────────────────────────────────────────────
  { city: "vinnytsia", year: 1937, text: "NKVD mass executions in nearby Pyatychatky were carried out; the graves would be discovered by the Germans in 1943" },
  { city: "vinnytsia", year: 1941, text: "Hitler's 'Werwolf' Eastern Front headquarters was built in nearby forest" },
  { city: "vinnytsia", year: 1944, text: "the Red Army liberated the city in March" },

  // ─── Sevastopol ───────────────────────────────────────────
  { city: "sevastopol", year: 1941, text: "the second Siege of Sevastopol began; the city defended for 250 days against the Wehrmacht" },
  { city: "sevastopol", year: 1942, text: "Sevastopol fell to German forces in July after the longest urban siege of WWII so far" },
  { city: "sevastopol", year: 1944, text: "the Red Army liberated the city in May" },
  { city: "sevastopol", year: 1954, text: "Sevastopol was transferred from the Russian SFSR to the Ukrainian SSR with Crimea" },
  { city: "sevastopol", year: 1965, text: "Sevastopol was awarded 'Hero City' status" },
  { city: "sevastopol", year: 1978, text: "as the Black Sea Fleet headquarters, Sevastopol was a closed city — foreigners and tourists were barred" },

  // ─── Simferopol ───────────────────────────────────────────
  { city: "simferopol", year: 1941, text: "Wehrmacht captured the city in November; mass killings of Jews and Crimchaks followed" },
  { city: "simferopol", year: 1944, text: "the Red Army liberated the city in April" },
  { city: "simferopol", year: 1944, text: "Stalin deported the entire Crimean Tatar population to Central Asia from Simferopol's rail yards" },
  { city: "simferopol", year: 1954, text: "Simferopol became part of the Ukrainian SSR with the rest of Crimea" },
  { city: "simferopol", year: 1970, text: "Simferopol airport handled millions of Soviet vacationers heading for Crimea every summer" },

  // ─── Kherson ──────────────────────────────────────────────
  { city: "kherson", year: 1941, text: "occupied by Wehrmacht in August" },
  { city: "kherson", year: 1944, text: "Red Army liberation in March" },
  { city: "kherson", year: 1957, text: "the North Crimean Canal began bringing Dnipro water through Kherson region to irrigate Crimea" },

  // ─── Chernihiv ───────────────────────────────────────────
  { city: "chernihiv", year: 1941, text: "Wehrmacht captured the city in September; Kievan-Rus-era churches were damaged" },
  { city: "chernihiv", year: 1943, text: "the Red Army liberated Chernihiv in September" },
  { city: "chernihiv", year: 1975, text: "Chernihiv chemical fibre and synthetic textiles plants were major Soviet employers" },

  // ─── Poltava ─────────────────────────────────────────────
  { city: "poltava", year: 1941, text: "Wehrmacht captured the city in September" },
  { city: "poltava", year: 1943, text: "Poltava liberated by the Red Army in September" },
  { city: "poltava", year: 1944, text: "Poltava airfield hosted the US Eighth Air Force in Operation Frantic" },
  { city: "poltava", year: 1944, text: "a Luftwaffe night raid destroyed 47 B-17 bombers on the ground at Poltava airfield" },

  // ─── Cherkasy ────────────────────────────────────────────
  { city: "cherkasy", year: 1932, text: "the Holodomor devastated Cherkasy region; entire villages emptied" },
  { city: "cherkasy", year: 1944, text: "Cherkasy was liberated by the Red Army after a major encirclement battle" },
  { city: "cherkasy", year: 1962, text: "the Kremenchuk Reservoir flooded historic landscapes near Cherkasy" },

  // ─── Khmelnytskyi ────────────────────────────────────────
  { city: "khmelnytskyi", year: 1919, text: "the Proskuriv pogrom killed an estimated 1,500–1,700 Jews on 15 February" },
  { city: "khmelnytskyi", year: 1941, text: "Wehrmacht captured the city in July; the Jewish population was largely murdered by 1943" },
  { city: "khmelnytskyi", year: 1944, text: "liberated by the Red Army in March" },
  { city: "khmelnytskyi", year: 1954, text: "the city was renamed Khmelnytskyi for the 300th anniversary of the Pereyaslav Agreement" },

  // ─── Chernivtsi ──────────────────────────────────────────
  { city: "chernivtsi", year: 1920, text: "Czernowitz was part of Romania between the wars — a polyglot Jewish-Romanian-Ukrainian-German city" },
  { city: "chernivtsi", year: 1940, text: "the Soviet Union annexed Bukovina; the city became Chernivtsi in the Ukrainian SSR" },
  { city: "chernivtsi", year: 1941, text: "Romanian forces reoccupied the city; a ghetto was established and tens of thousands of Jews were deported to Transnistria" },
  { city: "chernivtsi", year: 1944, text: "Soviet reoccupation; Romanian and German-speaking populations were largely expelled or fled" },

  // ─── Madrid ──────────────────────────────────────────────
  { city: "madrid", year: 1919, text: "the Madrid Metro opened with its first line between Sol and Cuatro Caminos" },
  { city: "madrid", year: 1931, text: "the Second Republic was proclaimed at the Puerta del Sol on 14 April" },
  { city: "madrid", year: 1936, text: "the Civil War began in July; Nationalist troops were stopped at the city's edge in November" },
  { city: "madrid", year: 1937, text: "the city was bombed from the air repeatedly — one of the earliest cities deliberately bombed from above" },
  { city: "madrid", year: 1939, text: "Madrid fell to Franco on 28 March, ending the Civil War" },
  { city: "madrid", year: 1953, text: "the Pact of Madrid with the US brought Torrejón Air Base and US aid to Spain" },
  { city: "madrid", year: 1973, text: "ETA blew Carrero Blanco — Franco's chosen successor — over a five-storey building on Calle de Claudio Coello" },
  { city: "madrid", year: 1977, text: "Madrid voted in the first free elections in 41 years on 15 June" },

  // ─── Barcelona ────────────────────────────────────────────
  { city: "barcelona", year: 1926, text: "Antonio Gaudí was hit by a tram in Barcelona and died days later in a pauper's hospital" },
  { city: "barcelona", year: 1929, text: "the Universal Exposition opened on Montjuïc; Mies van der Rohe's German Pavilion went up" },
  { city: "barcelona", year: 1936, text: "anarchist and Republican militias took control of the city in July" },
  { city: "barcelona", year: 1937, text: "the May Days saw bloody internal fighting between communist and anarchist Republicans" },
  { city: "barcelona", year: 1939, text: "Franco's troops took the city on 26 January after a long offensive down the Ebro" },
  { city: "barcelona", year: 1957, text: "Camp Nou opened — FC Barcelona's iconic stadium" },
  { city: "barcelona", year: 1971, text: "a major cholera outbreak swept the city in late summer" },

  // ─── Valencia ─────────────────────────────────────────────
  { city: "valencia", year: 1936, text: "the Republican government moved its capital from Madrid to Valencia in November" },
  { city: "valencia", year: 1937, text: "Valencia served as Republican capital through most of the year" },
  { city: "valencia", year: 1957, text: "the catastrophic Turia flood inundated the old city on 14 October — over 80 killed" },
  { city: "valencia", year: 1969, text: "the Turia river was permanently diverted south around the city" },

  // ─── Seville ──────────────────────────────────────────────
  { city: "seville", year: 1929, text: "the Ibero-American Exposition opened; the Plaza de España was built for it" },
  { city: "seville", year: 1936, text: "Franco's Army of Africa flew into Seville from Morocco — the start of the Nationalist airlift" },
  { city: "seville", year: 1939, text: "Franco celebrated the war's end with a parade in the Plaza de España" },
  { city: "seville", year: 1971, text: "the first Seville Film Festival was held" },

  // ─── Zaragoza ─────────────────────────────────────────────
  { city: "zaragoza", year: 1936, text: "Zaragoza fell to the Nationalists in the first days of the war and remained a key garrison city" },
  { city: "zaragoza", year: 1937, text: "a Republican counter-offensive (Battle of Belchite) was launched nearby, but Zaragoza never fell" },
  { city: "zaragoza", year: 1976, text: "an ETA bombing at the Hostal Cándido in December killed four civilians" },

  // ─── Málaga ────────────────────────────────────────────────
  { city: "malaga", year: 1936, text: "Málaga remained Republican until February 1937" },
  { city: "malaga", year: 1937, text: "Nationalist troops took Málaga in February; the 'Málaga–Almería road massacre' killed thousands of fleeing refugees" },
  { city: "malaga", year: 1959, text: "the Costa del Sol tourism boom officially began — Torremolinos became the first big resort" },
  { city: "malaga", year: 1973, text: "Pablo Picasso (born in Málaga in 1881) died in Mougins, France" },

  // ─── Murcia ────────────────────────────────────────────────
  { city: "murcia", year: 1920, text: "Murcia's silk industry was at its long decline; lace work remained a regional export" },
  { city: "murcia", year: 1936, text: "Murcia remained Republican; refugees from Madrid and Málaga arrived" },
  { city: "murcia", year: 1973, text: "the University of Murcia expanded onto its modern campus" },

  // ─── Palma de Mallorca ───────────────────────────────────
  { city: "palma", year: 1929, text: "Robert Graves moved to nearby Deià, which would become a literary refuge for decades" },
  { city: "palma", year: 1936, text: "the Nationalist coup succeeded in Palma; Italian Fascist aircraft used the island as a Mediterranean base" },
  { city: "palma", year: 1950, text: "Mallorca's tourist boom began; package holidays from Germany and Britain followed" },
  { city: "palma", year: 1962, text: "the island hit one million tourists per year for the first time" },

  // ─── Las Palmas de Gran Canaria ──────────────────────────
  { city: "las-palmas", year: 1936, text: "Franco was based in the Canary Islands at the moment of the coup on 17–18 July" },
  { city: "las-palmas", year: 1960, text: "the city became a major stop on north-European tourist routes" },
  { city: "las-palmas", year: 1977, text: "the Tenerife airport disaster on a neighbouring island killed 583 — the deadliest aviation accident in history" },

  // ─── Bilbao ────────────────────────────────────────────────
  { city: "bilbao", year: 1937, text: "the Republic's 'Iron Ring' defences were breached and Bilbao fell to the Nationalists on 19 June" },
  { city: "bilbao", year: 1959, text: "ETA was founded by young Basque nationalists in Bilbao" },
  { city: "bilbao", year: 1968, text: "ETA carried out its first political killing — police chief Melitón Manzanas" },
  { city: "bilbao", year: 1975, text: "Bilbao's heavy industry was peaking just as the global recession began to bite" },

  // ─── Alicante ──────────────────────────────────────────────
  { city: "alicante", year: 1939, text: "the British coal ship Stanbrook evacuated 2,638 Republican refugees from Alicante on 28 March — the last to escape" },
  { city: "alicante", year: 1942, text: "José Antonio Primo de Rivera (founder of the Falange) had been executed in Alicante prison in 1936; his anniversary became Franco-era ritual" },
  { city: "alicante", year: 1960, text: "Costa Blanca tourism took off; Benidorm became a British favourite within a decade" },

  // ─── Córdoba ───────────────────────────────────────────────
  { city: "cordoba", year: 1936, text: "Córdoba was taken by Nationalists in the first weeks of the war" },
  { city: "cordoba", year: 1939, text: "the Mosque-Cathedral resumed major Catholic ceremonies under Franco" },

  // ─── Valladolid ────────────────────────────────────────────
  { city: "valladolid", year: 1933, text: "the Falange Española was founded by José Antonio Primo de Rivera at a rally in Valladolid in October" },
  { city: "valladolid", year: 1936, text: "Valladolid was Nationalist from the start of the war" },
  { city: "valladolid", year: 1956, text: "the Seminci film festival was founded — one of Spain's oldest" },
  { city: "valladolid", year: 1972, text: "the Renault factory in Valladolid expanded to produce the R-12" },

  // ─── Vigo ──────────────────────────────────────────────────
  { city: "vigo", year: 1920, text: "Vigo was Galicia's largest Atlantic fishing port; tinned fish was its big export" },
  { city: "vigo", year: 1936, text: "Vigo was Nationalist from the start of the war" },
  { city: "vigo", year: 1958, text: "Citroën opened a major plant in Vigo — for decades Spain's biggest car factory" },
  { city: "vigo", year: 1972, text: "the 'Vigo strikes' of September shut the shipyards and Citroën; three workers were killed by police" },

  // ─── Gijón ─────────────────────────────────────────────────
  { city: "gijon", year: 1934, text: "the Asturian Revolution centred on Gijón and the surrounding coal basin in October — crushed by the Army of Africa" },
  { city: "gijon", year: 1937, text: "Gijón fell to Franco's forces in late October, ending Republican resistance in the north" },
  { city: "gijon", year: 1957, text: "the Ensidesa steelworks at Avilés-Gijón became the heart of Spain's nationalised steel industry" },

  // ─── L'Hospitalet de Llobregat ───────────────────────────
  { city: "hospitalet", year: 1950, text: "L'Hospitalet's population began to swell with migrants from southern Spain seeking work in Barcelona's factories" },
  { city: "hospitalet", year: 1970, text: "the city's population had roughly doubled in twenty years to around 250,000" },

  // ─── Vitoria-Gasteiz ─────────────────────────────────────
  { city: "vitoria", year: 1976, text: "the Vitoria massacre on 3 March — police killed five striking workers in the church of San Francisco" },
  { city: "vitoria", year: 1980, text: "Vitoria became the seat of the new Basque autonomous government" },

  // ─── A Coruña ─────────────────────────────────────────────
  { city: "coruna", year: 1936, text: "A Coruña was Nationalist from the start of the war" },
  { city: "coruna", year: 1959, text: "the Tower of Hercules (Roman-era lighthouse, still active) was already a Galician icon" },
  { city: "coruna", year: 1975, text: "A Coruña was developing as a fish-processing and textile centre — Inditex (Zara) would emerge here a few years later" },

  // ─── Granada ──────────────────────────────────────────────
  { city: "granada", year: 1936, text: "Federico García Lorca was arrested in Granada in August and shot near Víznar; his body has never been found" },
  { city: "granada", year: 1936, text: "Granada was quickly under Nationalist control; the right-wing press celebrated Lorca's death" },
  { city: "granada", year: 1970, text: "Alhambra tourism boomed under the Franco-era Costa del Sol expansion" },

  // ─── Elche ────────────────────────────────────────────────
  { city: "elche", year: 1941, text: "the Lady of Elche bust (looted from Spain in 1897) was returned by France during WWII" },
  { city: "elche", year: 1965, text: "the city's shoe-manufacturing industry took off; by the 70s Elche made one in three pairs of Spanish shoes" },

  // ─── New York City ─────────────────────────────────────────
  { city: "nyc", year: 1920, text: "Prohibition went into effect; speakeasies in Harlem and the Village exploded overnight" },
  { city: "nyc", year: 1925, text: "F. Scott Fitzgerald set The Great Gatsby on Long Island and in Manhattan" },
  { city: "nyc", year: 1927, text: "Babe Ruth hit 60 home runs at Yankee Stadium" },
  { city: "nyc", year: 1929, text: "the Wall Street Crash on Black Tuesday, 29 October, started the Depression" },
  { city: "nyc", year: 1931, text: "the Empire State Building opened on 1 May, reaching 1,250 feet — the world's tallest" },
  { city: "nyc", year: 1939, text: "the New York World's Fair opened at Flushing Meadows; television was demonstrated to the public" },
  { city: "nyc", year: 1947, text: "Jackie Robinson played his first Dodgers home game at Ebbets Field, breaking the colour line" },
  { city: "nyc", year: 1965, text: "the city-wide Northeast Blackout left 25 million people in the dark on 9 November" },
  { city: "nyc", year: 1969, text: "the Stonewall riots in Greenwich Village in late June launched the modern gay-rights movement" },
  { city: "nyc", year: 1973, text: "the World Trade Center towers opened in lower Manhattan" },
  { city: "nyc", year: 1977, text: "the July blackout caused widespread looting; the Yankees won the World Series" },

  // ─── Los Angeles ──────────────────────────────────────────
  { city: "la", year: 1923, text: "the 'Hollywoodland' sign went up over the hills" },
  { city: "la", year: 1932, text: "Los Angeles hosted the Summer Olympics at the Coliseum" },
  { city: "la", year: 1943, text: "the Zoot Suit Riots saw white servicemen attack young Mexican-Americans for ten days" },
  { city: "la", year: 1955, text: "Disneyland opened in Anaheim — created entire new suburbs around it" },
  { city: "la", year: 1965, text: "the Watts riots erupted in August — 34 dead and large parts of the neighbourhood burned" },
  { city: "la", year: 1969, text: "the Manson Family murders in Benedict Canyon and Los Feliz horrified the city" },
  { city: "la", year: 1971, text: "the San Fernando earthquake (M 6.5) killed 65 and damaged thousands of buildings" },
  { city: "la", year: 1977, text: "Star Wars opened at Mann's Chinese Theatre and ran for months" },

  // ─── Chicago ──────────────────────────────────────────────
  { city: "chicago", year: 1925, text: "Al Capone took over the Chicago Outfit and ran bootlegging across the city" },
  { city: "chicago", year: 1929, text: "the St. Valentine's Day Massacre killed seven on the North Side on 14 February" },
  { city: "chicago", year: 1933, text: "the Century of Progress World's Fair opened on the lakefront" },
  { city: "chicago", year: 1942, text: "Chicago Pile-1 at the University of Chicago achieved the first sustained nuclear chain reaction on 2 December" },
  { city: "chicago", year: 1955, text: "Mayor Richard J. Daley took office; he would run the city for the next 21 years" },
  { city: "chicago", year: 1968, text: "the Democratic National Convention saw violent clashes between police and anti-Vietnam protesters" },
  { city: "chicago", year: 1973, text: "the Sears Tower opened and became the world's tallest building" },

  // ─── Houston ──────────────────────────────────────────────
  { city: "houston", year: 1922, text: "the Ship Channel made Houston one of America's largest ports despite being inland" },
  { city: "houston", year: 1961, text: "NASA opened the Manned Spacecraft Center (later Johnson Space Center)" },
  { city: "houston", year: 1965, text: "the Astrodome opened — the first multi-purpose domed sports stadium in the world" },
  { city: "houston", year: 1969, text: "Mission Control in Houston ran the Apollo 11 Moon landing" },
  { city: "houston", year: 1970, text: "'Houston, we have a problem' became famous from Apollo 13" },

  // ─── Phoenix ──────────────────────────────────────────────
  { city: "phoenix", year: 1920, text: "Phoenix was a small farm town of about 30,000 people" },
  { city: "phoenix", year: 1950, text: "the population reached 100,000 as air conditioning made desert living feasible" },
  { city: "phoenix", year: 1957, text: "Frank Lloyd Wright's Grady Gammage Auditorium was designed for Arizona State University" },
  { city: "phoenix", year: 1970, text: "the city had grown into a Sun Belt boomtown of nearly 600,000" },

  // ─── Philadelphia ─────────────────────────────────────────
  { city: "philadelphia", year: 1926, text: "Philadelphia hosted the Sesquicentennial Exposition; the Liberty Bell Pavilion opened" },
  { city: "philadelphia", year: 1946, text: "ENIAC, the first general-purpose electronic computer, was unveiled at the University of Pennsylvania" },
  { city: "philadelphia", year: 1948, text: "Bell Labs began moving research operations into the Philadelphia area" },
  { city: "philadelphia", year: 1976, text: "the Bicentennial celebrations drew millions of visitors" },
  { city: "philadelphia", year: 1976, text: "the first 'Legionnaires' Disease' outbreak struck the Bellevue-Stratford Hotel in July" },

  // ─── San Antonio ──────────────────────────────────────────
  { city: "san-antonio", year: 1931, text: "Randolph Field opened as 'the West Point of the Air' for Army Air Corps cadets" },
  { city: "san-antonio", year: 1968, text: "HemisFair '68 World's Fair opened; the Tower of the Americas was built" },
  { city: "san-antonio", year: 1973, text: "the ABA's Dallas Chaparrals moved to San Antonio and became the Spurs" },

  // ─── San Diego ────────────────────────────────────────────
  { city: "san-diego", year: 1923, text: "the Navy made San Diego the headquarters of the Pacific Fleet" },
  { city: "san-diego", year: 1935, text: "the California Pacific International Exposition opened in Balboa Park" },
  { city: "san-diego", year: 1942, text: "Convair built the B-24 Liberator bomber in vast San Diego plants" },
  { city: "san-diego", year: 1972, text: "SeaWorld San Diego opened" },

  // ─── Dallas ───────────────────────────────────────────────
  { city: "dallas", year: 1936, text: "the Texas Centennial Exposition opened at Fair Park" },
  { city: "dallas", year: 1963, text: "John F. Kennedy was assassinated at Dealey Plaza on 22 November" },
  { city: "dallas", year: 1978, text: "the prime-time soap Dallas premiered on CBS, putting Southfork on the world map" },

  // ─── San Jose ─────────────────────────────────────────────
  { city: "san-jose", year: 1925, text: "the Santa Clara Valley was nicknamed 'the Valley of Heart's Delight' for its orchards" },
  { city: "san-jose", year: 1956, text: "William Shockley founded Shockley Semiconductor in nearby Mountain View — birth of Silicon Valley" },
  { city: "san-jose", year: 1968, text: "the city's population overtook San Francisco's for the first time" },
  { city: "san-jose", year: 1971, text: "the term 'Silicon Valley' was first used in a trade-paper article" },

  // ─── Austin ───────────────────────────────────────────────
  { city: "austin", year: 1937, text: "Lyndon B. Johnson was elected to Congress from the Austin area" },
  { city: "austin", year: 1966, text: "Charles Whitman shot 16 people from the University of Texas tower on 1 August" },
  { city: "austin", year: 1976, text: "Austin City Limits launched on PBS, broadcasting country and Texan music" },
  { city: "austin", year: 1980, text: "Austin's tech sector was emerging around the University of Texas" },

  // ─── Jacksonville ─────────────────────────────────────────
  { city: "jacksonville", year: 1920, text: "Jacksonville was nicknamed 'the Hollywood of the South' for its silent-film studios" },
  { city: "jacksonville", year: 1968, text: "the city consolidated with Duval County, becoming briefly the largest US city by area" },

  // ─── Fort Worth ───────────────────────────────────────────
  { city: "fort-worth", year: 1936, text: "Fort Worth hosted the Texas Frontier Centennial — Billy Rose's Casa Mañana revue brought stars from New York" },
  { city: "fort-worth", year: 1948, text: "Bell Aircraft moved helicopter production to Fort Worth" },
  { city: "fort-worth", year: 1971, text: "ground broke on Dallas/Fort Worth International Airport between the two cities" },

  // ─── Columbus (OH) ────────────────────────────────────────
  { city: "columbus", year: 1922, text: "Ohio Stadium ('the Horseshoe') opened for the Buckeyes football team" },
  { city: "columbus", year: 1944, text: "the Battelle Memorial Institute became a major Cold War R&D contractor" },
  { city: "columbus", year: 1968, text: "the Defense Construction Supply Center expanded into a giant federal employer" },

  // ─── Charlotte (NC) ───────────────────────────────────────
  { city: "charlotte", year: 1920, text: "Charlotte was a textile and cotton-mill town with a tightly segregated 'Brooklyn' Black neighbourhood" },
  { city: "charlotte", year: 1969, text: "the Swann v. Charlotte-Mecklenburg ruling on school busing began in the city; the Supreme Court would affirm it in 1971" },
  { city: "charlotte", year: 1971, text: "NCNB (later Bank of America) made Charlotte one of America's largest banking centres" },

  // ─── Indianapolis ─────────────────────────────────────────
  { city: "indianapolis", year: 1920, text: "the Indianapolis 500 (first run 1911) had become the world's biggest single-day sporting event" },
  { city: "indianapolis", year: 1923, text: "Eli Lilly began commercial production of insulin in Indianapolis — within a year of its discovery" },
  { city: "indianapolis", year: 1968, text: "Robert F. Kennedy delivered his impromptu speech announcing MLK's death from a flatbed truck on 4 April" },

  // ─── San Francisco ────────────────────────────────────────
  { city: "san-francisco", year: 1923, text: "the city's North Beach and Chinatown speakeasies prospered through Prohibition" },
  { city: "san-francisco", year: 1937, text: "the Golden Gate Bridge opened on 27 May" },
  { city: "san-francisco", year: 1945, text: "the United Nations Charter was signed at the War Memorial Opera House on 26 June" },
  { city: "san-francisco", year: 1956, text: "Allen Ginsberg's Howl was published by City Lights in North Beach" },
  { city: "san-francisco", year: 1967, text: "the Summer of Love saw 100,000 young people converge on Haight-Ashbury" },
  { city: "san-francisco", year: 1969, text: "Native American activists occupied Alcatraz Island; the occupation lasted 19 months" },
  { city: "san-francisco", year: 1978, text: "Mayor George Moscone and Supervisor Harvey Milk were assassinated in City Hall on 27 November" },

  // ─── Seattle ──────────────────────────────────────────────
  { city: "seattle", year: 1927, text: "Boeing began moving production into its growing Plant 1 on the Duwamish" },
  { city: "seattle", year: 1939, text: "the Boeing B-17 Flying Fortress began full production in Seattle" },
  { city: "seattle", year: 1962, text: "the Century 21 Exposition (Seattle World's Fair) opened; the Space Needle was built for it" },
  { city: "seattle", year: 1979, text: "Microsoft (founded in Albuquerque in 1975) moved its operations to the Seattle area" },

  // ─── Denver ───────────────────────────────────────────────
  { city: "denver", year: 1920, text: "the Ku Klux Klan exerted dramatic political influence over Denver and Colorado in the 1920s" },
  { city: "denver", year: 1958, text: "the United States Air Force Academy opened nearby in Colorado Springs" },
  { city: "denver", year: 1976, text: "Coloradans voted to refuse the 1976 Winter Olympics they had been awarded" },

  // ─── Washington, D.C. ────────────────────────────────────
  { city: "washington-dc", year: 1920, text: "the 19th Amendment was ratified on 18 August, giving American women the vote" },
  { city: "washington-dc", year: 1932, text: "the Bonus Army of WWI veterans marched on Washington and was driven out by US Army troops" },
  { city: "washington-dc", year: 1939, text: "Marian Anderson sang at the Lincoln Memorial on Easter Sunday to 75,000 — barred from Constitution Hall" },
  { city: "washington-dc", year: 1963, text: "Martin Luther King Jr. delivered 'I Have a Dream' from the Lincoln Memorial steps on 28 August" },
  { city: "washington-dc", year: 1968, text: "riots after MLK's assassination devastated parts of the city for days" },
  { city: "washington-dc", year: 1972, text: "burglars were arrested inside the Democratic National Committee offices in the Watergate complex on 17 June" },
  { city: "washington-dc", year: 1974, text: "Richard Nixon resigned the presidency on 9 August" },
  { city: "washington-dc", year: 1976, text: "the Washington Metro opened its first segment on 27 March" },
];

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

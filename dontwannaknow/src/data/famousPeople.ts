// Famous people active in each country during each decade.
// "active" = doing notable work, alive, or dying in that decade.

import type { Country } from "./countryDecades";

export type FamousPerson = {
  name: string;
  role: string; // writer, politician, actor, painter, musician, etc.
  note?: string; // single-line context
};

export type FamousByDecade = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  people: FamousPerson[];
};

export const FAMOUS_PEOPLE: FamousByDecade[] = [
  // ─────────────────────── Czechoslovakia ───────────────────────
  {
    country: "CZ", decadeStart: 1920, people: [
      { name: "Tomáš Garrigue Masaryk", role: "founding president", note: "philosopher-statesman who built the First Republic" },
      { name: "Franz Kafka", role: "writer", note: "Prague-born; The Trial was published posthumously in 1925" },
      { name: "Karel Čapek", role: "writer", note: "coined the word 'robot' in R.U.R. (1921)" },
      { name: "Leoš Janáček", role: "composer", note: "Káťa Kabanová and The Cunning Little Vixen premiered this decade" },
      { name: "Alfons Mucha", role: "painter", note: "Art Nouveau master, finishing the Slav Epic cycle" },
      { name: "Tomáš Baťa", role: "industrialist", note: "founded the global Baťa shoe empire from Zlín" },
      { name: "Jaroslav Hašek", role: "writer", note: "wrote The Good Soldier Švejk; died in 1923" },
    ],
  },
  {
    country: "CZ", decadeStart: 1930, people: [
      { name: "Edvard Beneš", role: "president", note: "succeeded Masaryk in 1935; led the wartime government-in-exile" },
      { name: "Karel Čapek", role: "writer", note: "wrote War with the Newts (1936) — anti-fascist satire" },
      { name: "Adina Mandlová", role: "actress", note: "biggest Czech film star of the 30s and 40s" },
      { name: "Lída Baarová", role: "actress", note: "Czech screen icon and Joseph Goebbels's mistress" },
      { name: "Bohuslav Martinů", role: "composer", note: "writing in Paris exile" },
      { name: "Jaromír Funke", role: "photographer", note: "central figure of Czech avant-garde photography" },
      { name: "Jan Werich & Jiří Voskovec", role: "actor-playwrights", note: "ran the Liberated Theatre — the wittiest cabaret in Europe" },
    ],
  },
  {
    country: "CZ", decadeStart: 1940, people: [
      { name: "Jan Patočka", role: "philosopher", note: "phenomenologist who later co-wrote Charter 77" },
      { name: "Reinhard Heydrich", role: "Nazi protector", note: "assassinated in Prague, May 1942" },
      { name: "Jiří Trnka", role: "animator", note: "puppet-film master whose work travelled the world" },
      { name: "Vladimír Holan", role: "poet", note: "modernist poet who lived as a virtual recluse" },
      { name: "Rafael Kubelík", role: "conductor", note: "founded the Prague Spring music festival in 1946" },
      { name: "Klement Gottwald", role: "communist leader", note: "led the 1948 coup and became president" },
      { name: "Rudolf Slánský", role: "communist politician", note: "show-trial victim, executed 1952" },
    ],
  },
  {
    country: "CZ", decadeStart: 1950, people: [
      { name: "Emil Zátopek", role: "athlete", note: "three Olympic golds in Helsinki 1952 — long-distance legend" },
      { name: "Otto Wichterle", role: "chemist", note: "invented soft contact lenses" },
      { name: "Bohumil Hrabal", role: "writer", note: "published 'A Pearl on the Bottom' and 'Closely Watched Trains'" },
      { name: "Jaroslav Seifert", role: "poet", note: "future Nobel laureate (1984), publishing through the 50s" },
      { name: "Jiří Trnka", role: "animator", note: "won the Grand Prix at Cannes 1959 for A Midsummer Night's Dream" },
      { name: "Vlasta Burian", role: "comic actor", note: "the 'King of Comedians' of pre-war and post-war Czech cinema" },
    ],
  },
  {
    country: "CZ", decadeStart: 1960, people: [
      { name: "Miloš Forman", role: "film director", note: "Loves of a Blonde (1965), The Firemen's Ball (1967)" },
      { name: "Věra Chytilová", role: "film director", note: "Daisies (1966) — Czech New Wave masterpiece" },
      { name: "Jiří Menzel", role: "film director", note: "Closely Watched Trains won the 1967 Foreign-Film Oscar" },
      { name: "Alexander Dubček", role: "communist reformer", note: "led the Prague Spring of 1968" },
      { name: "Václav Havel", role: "playwright", note: "The Memorandum (1965) made him internationally famous" },
      { name: "Marta Kubišová", role: "singer", note: "her 'Prayer for Marta' became the anthem of 1968" },
      { name: "Věra Čáslavská", role: "gymnast", note: "four golds at Mexico 1968, defied the Soviets on the podium" },
      { name: "Karel Gott", role: "singer", note: "the 'Sinatra of the East' — career spanned six decades" },
    ],
  },
  {
    country: "CZ", decadeStart: 1970, people: [
      { name: "Gustáv Husák", role: "communist leader", note: "ran 'normalization' as general secretary and then president" },
      { name: "Václav Havel", role: "playwright / dissident", note: "co-wrote Charter 77; jailed repeatedly" },
      { name: "Bohumil Hrabal", role: "writer", note: "I Served the King of England (1971) circulated in samizdat" },
      { name: "Milan Kundera", role: "writer", note: "stripped of Czech citizenship, settled in France in 1975" },
      { name: "Pavel Kohout", role: "writer / dissident", note: "co-author of Charter 77, exiled to Vienna" },
      { name: "Jaroslav Seifert", role: "poet", note: "still writing under regime pressure" },
      { name: "Plastic People of the Universe", role: "rock band", note: "tried and jailed in 1976 — sparked Charter 77" },
      { name: "Jiří Suchý & Jiří Šlitr", role: "songwriters", note: "ran the Semafor cabaret" },
    ],
  },

  // ─────────────────────────── Spain ────────────────────────────
  {
    country: "ES", decadeStart: 1920, people: [
      { name: "Antonio Gaudí", role: "architect", note: "still building La Sagrada Família; killed by a tram in 1926" },
      { name: "Federico García Lorca", role: "poet & playwright", note: "Gypsy Ballads (1928) launched him into stardom" },
      { name: "Salvador Dalí", role: "painter", note: "expelled from art school, met Buñuel and Lorca at the Residencia" },
      { name: "Luis Buñuel", role: "film director", note: "co-wrote Un Chien Andalou (1929) with Dalí" },
      { name: "Pablo Picasso", role: "painter", note: "in Paris but a global Spanish icon — in his Neoclassical period" },
      { name: "Miguel de Unamuno", role: "philosopher", note: "exiled by Primo de Rivera in 1924" },
      { name: "Joan Miró", role: "painter", note: "Harlequin's Carnival (1925) defined Catalan surrealism" },
    ],
  },
  {
    country: "ES", decadeStart: 1930, people: [
      { name: "Federico García Lorca", role: "playwright", note: "Blood Wedding (1933); murdered by Nationalists in 1936" },
      { name: "Manuel Azaña", role: "prime minister & president", note: "leader of the Second Republic" },
      { name: "Francisco Franco", role: "general", note: "led the Nationalist rebellion in July 1936" },
      { name: "Dolores Ibárruri 'La Pasionaria'", role: "communist orator", note: "famous for 'No pasarán!'" },
      { name: "Pablo Picasso", role: "painter", note: "painted Guernica in 1937 for the Paris Expo" },
      { name: "Joan Miró", role: "painter", note: "painted The Reaper and Still Life with Old Shoe during the war" },
      { name: "Miguel Hernández", role: "poet", note: "Republican soldier-poet, died in Franco's prisons in 1942" },
      { name: "Rafael Alberti", role: "poet", note: "exiled in Argentina from 1939" },
    ],
  },
  {
    country: "ES", decadeStart: 1940, people: [
      { name: "Francisco Franco", role: "dictator", note: "El Generalísimo, ruling by decree" },
      { name: "Camilo José Cela", role: "novelist", note: "The Family of Pascual Duarte (1942) launched modern Spanish lit; future Nobel" },
      { name: "Carmen Laforet", role: "novelist", note: "Nada (1944) won the first Premio Nadal at age 23" },
      { name: "Antonio Machado", role: "poet", note: "died in French exile in 1939; idolised by the postwar generation" },
      { name: "Pío Baroja", role: "novelist", note: "kept publishing through the dictatorship" },
      { name: "Dolores Ibárruri", role: "communist", note: "Moscow exile, secretary-general of the PCE from 1942" },
      { name: "Lola Flores", role: "singer / actress", note: "queen of copla — her star rose during the 40s" },
    ],
  },
  {
    country: "ES", decadeStart: 1950, people: [
      { name: "Salvador Dalí", role: "painter", note: "his 'Christ of Saint John of the Cross' (1951)" },
      { name: "Luis Buñuel", role: "film director", note: "made Los Olvidados (1950) in Mexican exile, Viridiana (1961) in Spain" },
      { name: "Camilo José Cela", role: "novelist", note: "The Hive (1951) banned in Spain, published in Argentina" },
      { name: "Joan Manuel Serrat", role: "singer-songwriter", note: "his Catalan-language career was about to begin" },
      { name: "Lola Flores", role: "singer / actress", note: "starred in dozens of films through the decade" },
      { name: "Antonio Buero Vallejo", role: "playwright", note: "the leading dramatist of post-war Spain" },
      { name: "Sara Montiel", role: "actress", note: "international film star; El último cuplé (1957)" },
    ],
  },
  {
    country: "ES", decadeStart: 1960, people: [
      { name: "Joan Manuel Serrat", role: "singer-songwriter", note: "withdrew from Eurovision 1968 to sing in Catalan and got banned" },
      { name: "Salvador Dalí", role: "painter", note: "opened the Dalí Theatre-Museum in Figueres in 1974 — designed it through the 60s" },
      { name: "Pablo Picasso", role: "painter", note: "still painting daily in Mougins; died in 1973" },
      { name: "Camilo José Cela", role: "novelist", note: "founded the journal Papeles de Son Armadans" },
      { name: "Massiel", role: "singer", note: "won Eurovision 1968 in London with La, la, la" },
      { name: "Paco de Lucía", role: "flamenco guitarist", note: "his career exploded in the late 60s" },
      { name: "Manuel Fraga", role: "minister", note: "Franco's tourism minister, opened Spain to Europe" },
      { name: "Carmen Sevilla", role: "actress", note: "Spanish cinema queen of the 60s" },
    ],
  },
  {
    country: "ES", decadeStart: 1970, people: [
      { name: "Juan Carlos I", role: "king", note: "crowned in 1975; oversaw the transition to democracy" },
      { name: "Adolfo Suárez", role: "first elected prime minister", note: "led the Transición from 1976" },
      { name: "Camarón de la Isla", role: "flamenco singer", note: "his 1979 album La leyenda del tiempo changed flamenco forever" },
      { name: "Paco de Lucía", role: "flamenco guitarist", note: "Entre dos aguas (1973) became a global hit" },
      { name: "Pedro Almodóvar", role: "filmmaker", note: "shot his first Super-8 shorts in the late 70s in Madrid" },
      { name: "Joan Miró", role: "painter", note: "designed his foundation in Barcelona, opened 1975" },
      { name: "Luis Carrero Blanco", role: "Franco's chosen successor", note: "blown over a five-storey building by ETA in 1973" },
      { name: "Santiago Carrillo", role: "communist leader", note: "returned from exile in 1976; led the PCE during the Transición" },
    ],
  },

  // ─────────────────────── United States ────────────────────────
  {
    country: "US", decadeStart: 1920, people: [
      { name: "F. Scott Fitzgerald", role: "novelist", note: "The Great Gatsby (1925)" },
      { name: "Ernest Hemingway", role: "novelist", note: "The Sun Also Rises (1926)" },
      { name: "Louis Armstrong", role: "trumpeter", note: "Hot Five and Hot Seven recordings reinvented jazz" },
      { name: "Charlie Chaplin", role: "actor / director", note: "The Gold Rush (1925), The Circus (1928)" },
      { name: "Babe Ruth", role: "baseball player", note: "60 home runs in 1927 — a record that stood 34 years" },
      { name: "Calvin Coolidge", role: "president", note: "Silent Cal — laissez-faire icon" },
      { name: "Charles Lindbergh", role: "aviator", note: "first to fly solo across the Atlantic in 1927" },
      { name: "Langston Hughes", role: "poet", note: "central voice of the Harlem Renaissance" },
      { name: "Duke Ellington", role: "composer / bandleader", note: "Cotton Club residency from 1927" },
      { name: "Al Capone", role: "gangster", note: "ran Chicago bootlegging through the decade" },
    ],
  },
  {
    country: "US", decadeStart: 1930, people: [
      { name: "Franklin D. Roosevelt", role: "president", note: "the New Deal, four elections" },
      { name: "John Steinbeck", role: "novelist", note: "The Grapes of Wrath (1939)" },
      { name: "Ernest Hemingway", role: "novelist", note: "covered the Spanish Civil War; For Whom the Bell Tolls (1940)" },
      { name: "Clark Gable", role: "actor", note: "Gone with the Wind (1939)" },
      { name: "Greta Garbo", role: "actress", note: "Anna Karenina (1935); 'I want to be alone'" },
      { name: "Duke Ellington", role: "composer", note: "It Don't Mean a Thing (1932)" },
      { name: "Walt Disney", role: "animator", note: "Snow White (1937) — first feature cartoon" },
      { name: "Eleanor Roosevelt", role: "first lady & activist", note: "reshaped the role of first lady" },
      { name: "Jesse Owens", role: "athlete", note: "four golds at the Berlin 1936 Olympics" },
      { name: "Frank Lloyd Wright", role: "architect", note: "Fallingwater (1935)" },
    ],
  },
  {
    country: "US", decadeStart: 1940, people: [
      { name: "Franklin D. Roosevelt", role: "president", note: "led the country through WWII; died April 1945" },
      { name: "Harry S. Truman", role: "president", note: "ordered the atomic bombings; began the Cold War" },
      { name: "Dwight D. Eisenhower", role: "general", note: "Supreme Allied Commander on D-Day" },
      { name: "Orson Welles", role: "director / actor", note: "Citizen Kane (1941)" },
      { name: "Humphrey Bogart", role: "actor", note: "Casablanca (1942), The Maltese Falcon (1941)" },
      { name: "Ingrid Bergman", role: "actress", note: "Casablanca, For Whom the Bell Tolls" },
      { name: "Frank Sinatra", role: "singer", note: "the original teen idol" },
      { name: "Jackie Robinson", role: "baseball player", note: "broke the colour line in 1947" },
      { name: "Albert Einstein", role: "physicist", note: "American citizen since 1940; warned about the bomb" },
      { name: "Jackson Pollock", role: "painter", note: "drip painting from 1947" },
    ],
  },
  {
    country: "US", decadeStart: 1950, people: [
      { name: "Dwight D. Eisenhower", role: "president", note: "ended the Korean War, built the Interstate Highway System" },
      { name: "Marilyn Monroe", role: "actress", note: "Gentlemen Prefer Blondes (1953), The Seven Year Itch (1955)" },
      { name: "Elvis Presley", role: "singer", note: "Heartbreak Hotel (1956), Jailhouse Rock (1957)" },
      { name: "James Dean", role: "actor", note: "three films, dead at 24 in a car crash, 1955" },
      { name: "Audrey Hepburn", role: "actress", note: "Roman Holiday (1953), Sabrina (1954)" },
      { name: "Jack Kerouac", role: "writer", note: "On the Road (1957)" },
      { name: "Joseph McCarthy", role: "senator", note: "communist witch hunts until his 1954 censure" },
      { name: "Rosa Parks", role: "civil rights activist", note: "refused to give up her seat, December 1955" },
      { name: "Lucille Ball", role: "actress", note: "I Love Lucy ran 1951–1957" },
      { name: "Frank Lloyd Wright", role: "architect", note: "the Guggenheim Museum opened in 1959" },
    ],
  },
  {
    country: "US", decadeStart: 1960, people: [
      { name: "John F. Kennedy", role: "president", note: "youngest elected president; shot in November 1963" },
      { name: "Martin Luther King Jr.", role: "civil rights leader", note: "I Have a Dream (1963); Nobel Peace Prize (1964); shot in 1968" },
      { name: "Lyndon B. Johnson", role: "president", note: "Civil Rights Act, Voting Rights Act, Vietnam escalation" },
      { name: "Bob Dylan", role: "songwriter", note: "Blowin' in the Wind (1962), Like a Rolling Stone (1965)" },
      { name: "Andy Warhol", role: "artist", note: "Campbell's Soup Cans (1962)" },
      { name: "Muhammad Ali", role: "boxer", note: "heavyweight champion; refused Vietnam draft 1967" },
      { name: "Aretha Franklin", role: "singer", note: "Respect (1967)" },
      { name: "Jimi Hendrix", role: "guitarist", note: "Are You Experienced (1967); Woodstock 1969" },
      { name: "Marilyn Monroe", role: "actress", note: "died in August 1962, age 36" },
      { name: "Neil Armstrong", role: "astronaut", note: "first human to walk on the Moon, July 1969" },
      { name: "Malcolm X", role: "civil rights activist", note: "assassinated in February 1965" },
      { name: "Truman Capote", role: "writer", note: "In Cold Blood (1966)" },
    ],
  },
  {
    country: "US", decadeStart: 1970, people: [
      { name: "Richard Nixon", role: "president", note: "Watergate; resigned August 1974" },
      { name: "Jimmy Carter", role: "president", note: "won in 1976; Camp David Accords 1978" },
      { name: "Stephen King", role: "novelist", note: "Carrie (1974), The Shining (1977)" },
      { name: "John Lennon", role: "musician", note: "Imagine (1971); shot in NYC December 1980" },
      { name: "Stevie Wonder", role: "musician", note: "Songs in the Key of Life (1976)" },
      { name: "Robert De Niro", role: "actor", note: "Taxi Driver (1976), The Godfather Part II (1974)" },
      { name: "Al Pacino", role: "actor", note: "The Godfather (1972), Dog Day Afternoon (1975)" },
      { name: "Steven Spielberg", role: "director", note: "Jaws (1975), Close Encounters (1977)" },
      { name: "George Lucas", role: "director", note: "Star Wars (1977)" },
      { name: "Toni Morrison", role: "novelist", note: "Song of Solomon (1977)" },
      { name: "Hunter S. Thompson", role: "journalist", note: "Fear and Loathing in Las Vegas (1971)" },
      { name: "Jane Fonda", role: "actress / activist", note: "Klute (1971); anti-Vietnam War protests" },
      { name: "Billie Jean King", role: "tennis player", note: "Battle of the Sexes (1973)" },
    ],
  },

  // ─────────────────── Ukraine / Ukrainian SSR ──────────────────
  {
    country: "UA", decadeStart: 1920, people: [
      { name: "Les Kurbas", role: "theatre director", note: "founder of Berezil Theatre; the Ukrainian Meyerhold" },
      { name: "Mykola Khvylovy", role: "writer", note: "leading voice of the Executed Renaissance; suicide 1933" },
      { name: "Oleksandr Dovzhenko", role: "filmmaker", note: "Zvenyhora (1928) and Earth (1930) made him a Soviet master" },
      { name: "Mykhailo Hrushevsky", role: "historian & politician", note: "first head of the Ukrainian People's Republic; returned to Soviet Ukraine 1924" },
      { name: "Pavlo Tychyna", role: "poet", note: "Sun's Clarinets (1918) — the most original Ukrainian modernist" },
      { name: "Volodymyr Sosiura", role: "poet", note: "his lyrical 'Love Ukraine' would later be denounced" },
      { name: "Mykola Skrypnyk", role: "politician", note: "ran Ukrainization policy; suicide 1933" },
    ],
  },
  {
    country: "UA", decadeStart: 1930, people: [
      { name: "Stalin", role: "Soviet leader", note: "imposed the Holodomor and the Great Terror on Ukraine" },
      { name: "Pavlo Postyshev", role: "party boss", note: "Stalin's enforcer in Ukraine; ran the terror" },
      { name: "Oleksandr Dovzhenko", role: "filmmaker", note: "made Aerograd (1935) and Shchors (1939) under pressure" },
      { name: "Maksym Rylsky", role: "poet", note: "Neoclassicist who survived by recanting" },
      { name: "Les Kurbas", role: "theatre director", note: "executed at Sandarmokh, 1937" },
      { name: "Mykola Kulish", role: "playwright", note: "shot in 1937" },
      { name: "Mykhailo Boychuk", role: "painter", note: "monumentalist; executed 1937 with most of his students" },
    ],
  },
  {
    country: "UA", decadeStart: 1940, people: [
      { name: "Nikita Khrushchev", role: "party boss", note: "ran Ukrainian SSR 1938–47, postwar reconstruction" },
      { name: "Stepan Bandera", role: "nationalist leader", note: "OUN-B leader; jailed by both Nazis and Soviets" },
      { name: "Roman Shukhevych", role: "UPA commander", note: "led the Ukrainian Insurgent Army until killed 1950" },
      { name: "Oleksandr Dovzhenko", role: "filmmaker", note: "war documentaries; his Ukraine in Flames was banned by Stalin" },
      { name: "Pavlo Tychyna", role: "poet", note: "became Minister of Education of the Ukrainian SSR 1943" },
      { name: "Yuriy Yanovsky", role: "novelist", note: "wartime novels about Ukrainian partisans" },
      { name: "Mykhailo Stelmakh", role: "writer", note: "war novels that won Stalin and State Prizes" },
    ],
  },
  {
    country: "UA", decadeStart: 1950, people: [
      { name: "Nikita Khrushchev", role: "Soviet leader", note: "the Ukrainian-raised first secretary" },
      { name: "Oleksandr Dovzhenko", role: "filmmaker", note: "died 1956; Poem of the Sea published posthumously" },
      { name: "Lev Landau", role: "physicist", note: "Soviet Nobel laureate (1962) — taught at Kharkiv in the 30s, still influential" },
      { name: "Mykola Amosov", role: "heart surgeon", note: "pioneered open-heart surgery in Kyiv" },
      { name: "Sofia Rotaru", role: "singer", note: "born 1947 in Chernivtsi region — would dominate Soviet pop later" },
      { name: "Oles Honchar", role: "writer", note: "his trilogy 'The Standard-Bearers' won the Stalin Prize" },
    ],
  },
  {
    country: "UA", decadeStart: 1960, people: [
      { name: "Leonid Brezhnev", role: "Soviet leader", note: "born in Kamianske, Ukraine; took power in 1964" },
      { name: "Sergei Parajanov", role: "filmmaker", note: "Shadows of Forgotten Ancestors (1965) — masterpiece" },
      { name: "Lina Kostenko", role: "poet", note: "leading voice of the Shistdesiatnyky" },
      { name: "Vasyl Symonenko", role: "poet", note: "Lebedi materynstva — died young in 1963" },
      { name: "Vyacheslav Chornovil", role: "journalist / dissident", note: "compiled the samizdat 'Ukrainian Herald'" },
      { name: "Ivan Drach", role: "poet", note: "another Shistdesiatnyky leader" },
      { name: "Yuri Ilyenko", role: "cinematographer / director", note: "filmed Shadows of Forgotten Ancestors; A Spring for the Thirsty (1965)" },
      { name: "Oleg Antonov", role: "aircraft designer", note: "built the giant An-22 in Kyiv (1965)" },
    ],
  },
  {
    country: "UA", decadeStart: 1970, people: [
      { name: "Volodymyr Shcherbytsky", role: "party leader", note: "ran the Ukrainian SSR from 1972 — pure Brezhnev loyalty" },
      { name: "Sergei Parajanov", role: "filmmaker", note: "imprisoned in 1973 for 'parasitism' and homosexuality" },
      { name: "Vyacheslav Chornovil", role: "dissident", note: "in and out of prison through the decade" },
      { name: "Mykola Rudenko", role: "writer / dissident", note: "founded the Ukrainian Helsinki Group in 1976; jailed" },
      { name: "Sofia Rotaru", role: "singer", note: "Lavanda and Melnitsa made her a Soviet superstar" },
      { name: "Volodymyr Ivasyuk", role: "songwriter", note: "wrote Chervona Ruta; died under suspicious circumstances 1979" },
      { name: "Valeriy Lobanovskyi", role: "football coach", note: "made Dynamo Kyiv European champions in 1975" },
      { name: "Oleg Blokhin", role: "footballer", note: "won the Ballon d'Or 1975" },
      { name: "Lina Kostenko", role: "poet", note: "barred from publishing for 16 years until 1977" },
    ],
  },
];

export function famousFor(country: Country, year: number): FamousPerson[] {
  if (country === "INTL") return [];
  const start = Math.floor(year / 10) * 10;
  const entry = FAMOUS_PEOPLE.find((f) => f.country === country && f.decadeStart === start);
  return entry?.people ?? [];
}

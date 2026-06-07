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
      { name: "Tomáš Garrigue Masaryk", role: "zakladatel a první prezident", note: "filozof a státník, který vybudoval první republiku" },
      { name: "Franz Kafka", role: "spisovatel", note: "rodák z Prahy; Proces vyšel posmrtně v roce 1925" },
      { name: "Karel Čapek", role: "spisovatel", note: "ve hře R.U.R. (1921) zavedl slovo „robot“" },
      { name: "Leoš Janáček", role: "skladatel", note: "v tomto desetiletí měly premiéru Káťa Kabanová a Příhody lišky Bystroušky" },
      { name: "Alfons Mucha", role: "malíř", note: "mistr secese, dokončoval cyklus Slovanská epopej" },
      { name: "Tomáš Baťa", role: "průmyslník", note: "ze Zlína vybudoval celosvětovou obuvnickou říši Baťa" },
      { name: "Jaroslav Hašek", role: "spisovatel", note: "napsal Osudy dobrého vojáka Švejka; zemřel v roce 1923" },
    ],
  },
  {
    country: "CZ", decadeStart: 1930, people: [
      { name: "Edvard Beneš", role: "prezident", note: "v roce 1935 nahradil Masaryka; za války vedl exilovou vládu" },
      { name: "Karel Čapek", role: "spisovatel", note: "napsal Válku s mloky (1936) — protifašistickou satiru" },
      { name: "Adina Mandlová", role: "herečka", note: "největší česká filmová hvězda 30. a 40. let" },
      { name: "Lída Baarová", role: "herečka", note: "ikona českého filmu a milenka Josepha Goebbelse" },
      { name: "Bohuslav Martinů", role: "skladatel", note: "tvořil v pařížském exilu" },
      { name: "Jaromír Funke", role: "fotograf", note: "ústřední postava české avantgardní fotografie" },
      { name: "Jan Werich & Jiří Voskovec", role: "herci a dramatici", note: "vedli Osvobozené divadlo — nejvtipnější kabaret v Evropě" },
    ],
  },
  {
    country: "CZ", decadeStart: 1940, people: [
      { name: "Jan Patočka", role: "filozof", note: "fenomenolog, který se později podílel na Chartě 77" },
      { name: "Reinhard Heydrich", role: "nacistický protektor", note: "zavražděn v Praze v květnu 1942" },
      { name: "Jiří Trnka", role: "animátor", note: "mistr loutkového filmu, jehož dílo obletělo svět" },
      { name: "Vladimír Holan", role: "básník", note: "modernistický básník, který žil takřka v ústraní" },
      { name: "Rafael Kubelík", role: "dirigent", note: "v roce 1946 založil hudební festival Pražské jaro" },
      { name: "Klement Gottwald", role: "komunistický vůdce", note: "vedl převrat v roce 1948 a stal se prezidentem" },
      { name: "Rudolf Slánský", role: "komunistický politik", note: "oběť zinscenovaného procesu, popraven v roce 1952" },
    ],
  },
  {
    country: "CZ", decadeStart: 1950, people: [
      { name: "Emil Zátopek", role: "atlet", note: "tři olympijská zlata v Helsinkách 1952 — legenda vytrvalostního běhu" },
      { name: "Otto Wichterle", role: "chemik", note: "vynálezce měkkých kontaktních čoček" },
      { name: "Bohumil Hrabal", role: "spisovatel", note: "vydal Perličku na dně a Ostře sledované vlaky" },
      { name: "Jaroslav Seifert", role: "básník", note: "budoucí nositel Nobelovy ceny (1984), publikoval po celá 50. léta" },
      { name: "Jiří Trnka", role: "animátor", note: "v Cannes 1959 získal Grand Prix za Sen noci svatojánské" },
      { name: "Vlasta Burian", role: "komik", note: "„král komiků“ předválečného i poválečného českého filmu" },
    ],
  },
  {
    country: "CZ", decadeStart: 1960, people: [
      { name: "Miloš Forman", role: "filmový režisér", note: "Lásky jedné plavovlásky (1965), Hoří, má panenko (1967)" },
      { name: "Věra Chytilová", role: "filmová režisérka", note: "Sedmikrásky (1966) — vrcholné dílo československé nové vlny" },
      { name: "Jiří Menzel", role: "filmový režisér", note: "Ostře sledované vlaky získaly v roce 1967 Oscara za zahraniční film" },
      { name: "Alexander Dubček", role: "komunistický reformátor", note: "vedl Pražské jaro roku 1968" },
      { name: "Václav Havel", role: "dramatik", note: "Vyrozumění (1965) ho proslavilo po celém světě" },
      { name: "Marta Kubišová", role: "zpěvačka", note: "její Modlitba pro Martu se stala hymnou roku 1968" },
      { name: "Věra Čáslavská", role: "gymnastka", note: "čtyři zlata v Mexiku 1968, na stupních vítězů vzdorovala Sovětům" },
      { name: "Karel Gott", role: "zpěvák", note: "„Sinatra Východu“ — jeho kariéra trvala šest desetiletí" },
    ],
  },
  {
    country: "CZ", decadeStart: 1970, people: [
      { name: "Gustáv Husák", role: "komunistický vůdce", note: "jako generální tajemník a později prezident řídil „normalizaci“" },
      { name: "Václav Havel", role: "dramatik a disident", note: "spoluautor Charty 77; opakovaně vězněn" },
      { name: "Bohumil Hrabal", role: "spisovatel", note: "Obsluhoval jsem anglického krále (1971) koloval v samizdatu" },
      { name: "Milan Kundera", role: "spisovatel", note: "zbaven československého občanství, v roce 1975 se usadil ve Francii" },
      { name: "Pavel Kohout", role: "spisovatel a disident", note: "spoluautor Charty 77, vyhoštěn do Vídně" },
      { name: "Jaroslav Seifert", role: "básník", note: "stále tvořil pod tlakem režimu" },
      { name: "Plastic People of the Universe", role: "rocková kapela", note: "souzeni a uvězněni v roce 1976 — podnět ke vzniku Charty 77" },
      { name: "Jiří Suchý & Jiří Šlitr", role: "textaři a skladatelé", note: "vedli divadlo Semafor" },
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
      { name: "Les Kurbas", role: "divadelní režisér", note: "zakladatel divadla Berezil; ukrajinský Mejerchold" },
      { name: "Mykola Khvylovy", role: "spisovatel", note: "přední hlas Popraveného obrození; sebevražda v roce 1933" },
      { name: "Oleksandr Dovzhenko", role: "filmař", note: "Zvenyhora (1928) a Země (1930) z něj udělaly sovětského mistra" },
      { name: "Mykhailo Hrushevsky", role: "historik a politik", note: "první předseda Ukrajinské lidové republiky; v roce 1924 se vrátil do sovětské Ukrajiny" },
      { name: "Pavlo Tychyna", role: "básník", note: "Sluneční klarinety (1918) — nejoriginálnější ukrajinský modernista" },
      { name: "Volodymyr Sosiura", role: "básník", note: "jeho lyrická báseň „Miluj Ukrajinu“ byla později odsouzena" },
      { name: "Mykola Skrypnyk", role: "politik", note: "vedl politiku ukrajinizace; sebevražda v roce 1933" },
    ],
  },
  {
    country: "UA", decadeStart: 1930, people: [
      { name: "Stalin", role: "sovětský vůdce", note: "uvalil na Ukrajinu hladomor a Velký teror" },
      { name: "Pavlo Postyshev", role: "stranický šéf", note: "Stalinův vykonavatel na Ukrajině; řídil teror" },
      { name: "Oleksandr Dovzhenko", role: "filmař", note: "pod nátlakem natočil Aerograd (1935) a Ščorse (1939)" },
      { name: "Maksym Rylsky", role: "básník", note: "neoklasicista, který přežil díky odvolání svých postojů" },
      { name: "Les Kurbas", role: "divadelní režisér", note: "popraven v Sandarmochu v roce 1937" },
      { name: "Mykola Kulish", role: "dramatik", note: "zastřelen v roce 1937" },
      { name: "Mykhailo Boychuk", role: "malíř", note: "monumentalista; popraven v roce 1937 s většinou svých žáků" },
    ],
  },
  {
    country: "UA", decadeStart: 1940, people: [
      { name: "Nikita Khrushchev", role: "stranický šéf", note: "v letech 1938–47 řídil ukrajinskou SSR a poválečnou obnovu" },
      { name: "Stepan Bandera", role: "nacionalistický vůdce", note: "vůdce OUN-B; vězněn nacisty i Sověty" },
      { name: "Roman Shukhevych", role: "velitel UPA", note: "vedl Ukrajinskou povstaleckou armádu, dokud nebyl v roce 1950 zabit" },
      { name: "Oleksandr Dovzhenko", role: "filmař", note: "válečné dokumenty; jeho Ukrajina v plamenech byla Stalinem zakázána" },
      { name: "Pavlo Tychyna", role: "básník", note: "v roce 1943 se stal ministrem školství ukrajinské SSR" },
      { name: "Yuriy Yanovsky", role: "prozaik", note: "válečné romány o ukrajinských partyzánech" },
      { name: "Mykhailo Stelmakh", role: "spisovatel", note: "válečné romány oceněné Stalinovou a Státní cenou" },
    ],
  },
  {
    country: "UA", decadeStart: 1950, people: [
      { name: "Nikita Khrushchev", role: "sovětský vůdce", note: "první tajemník, který vyrůstal na Ukrajině" },
      { name: "Oleksandr Dovzhenko", role: "filmař", note: "zemřel v roce 1956; Poema o moři vyšla posmrtně" },
      { name: "Lev Landau", role: "fyzik", note: "sovětský nositel Nobelovy ceny (1962) — ve 30. letech učil v Charkově, stále vlivný" },
      { name: "Mykola Amosov", role: "kardiochirurg", note: "průkopník operací na otevřeném srdci v Kyjevě" },
      { name: "Sofia Rotaru", role: "zpěvačka", note: "narozena v roce 1947 v Černovické oblasti — později ovládla sovětský pop" },
      { name: "Oles Honchar", role: "spisovatel", note: "jeho trilogie „Praporečníci“ získala Stalinovu cenu" },
    ],
  },
  {
    country: "UA", decadeStart: 1960, people: [
      { name: "Leonid Brezhnev", role: "sovětský vůdce", note: "narozen v Kamjanském na Ukrajině; moci se ujal v roce 1964" },
      { name: "Sergei Parajanov", role: "filmař", note: "Stíny zapomenutých předků (1965) — mistrovské dílo" },
      { name: "Lina Kostenko", role: "básnířka", note: "přední hlas šedesátníků (šistdesjatnyky)" },
      { name: "Vasyl Symonenko", role: "básník", note: "Lebedi materynstva — zemřel mladý v roce 1963" },
      { name: "Vyacheslav Chornovil", role: "novinář a disident", note: "sestavoval samizdatový „Ukrajinský věstník“" },
      { name: "Ivan Drach", role: "básník", note: "další z vůdců šedesátníků (šistdesjatnyky)" },
      { name: "Yuri Ilyenko", role: "kameraman a režisér", note: "natáčel Stíny zapomenutých předků; Studánka pro žíznivé (1965)" },
      { name: "Oleg Antonov", role: "konstruktér letadel", note: "v Kyjevě postavil obří An-22 (1965)" },
    ],
  },
  {
    country: "UA", decadeStart: 1970, people: [
      { name: "Volodymyr Shcherbytsky", role: "stranický vůdce", note: "od roku 1972 řídil ukrajinskou SSR — naprosto věrný Brežněvovi" },
      { name: "Sergei Parajanov", role: "filmař", note: "v roce 1973 uvězněn za „příživnictví“ a homosexualitu" },
      { name: "Vyacheslav Chornovil", role: "disident", note: "po celé desetiletí střídavě ve vězení a na svobodě" },
      { name: "Mykola Rudenko", role: "spisovatel a disident", note: "v roce 1976 založil Ukrajinskou helsinskou skupinu; uvězněn" },
      { name: "Sofia Rotaru", role: "zpěvačka", note: "písněmi Lavanda a Melnycja se stala sovětskou superhvězdou" },
      { name: "Volodymyr Ivasyuk", role: "skladatel", note: "napsal Červonu rutu; v roce 1979 zemřel za podezřelých okolností" },
      { name: "Valeriy Lobanovskyi", role: "fotbalový trenér", note: "v roce 1975 přivedl Dynamo Kyjev k titulu evropského šampiona" },
      { name: "Oleg Blokhin", role: "fotbalista", note: "v roce 1975 získal Zlatý míč" },
      { name: "Lina Kostenko", role: "básnířka", note: "16 let měla zákaz publikování, až do roku 1977" },
    ],
  },

  // ─────────────────────────── Canada ────────────────────────────
  {
    country: "CA", decadeStart: 1920, people: [
      { name: "William Lyon Mackenzie King", role: "prime minister", note: "Liberal PM almost the entire interwar period" },
      { name: "Frederick Banting", role: "scientist", note: "co-discovered insulin in Toronto, 1921" },
      { name: "Lucy Maud Montgomery", role: "novelist", note: "kept writing Anne of Green Gables sequels and Emily of New Moon" },
      { name: "Tom Thomson (legacy)", role: "painter", note: "his death in 1917 inspired the Group of Seven who formed officially in 1920" },
      { name: "A. Y. Jackson", role: "painter", note: "core member of the Group of Seven painting the Shield" },
      { name: "Stephen Leacock", role: "humorist", note: "Canada's most popular English-language writer at the time" },
      { name: "Nellie McClung", role: "suffragette & writer", note: "led the campaign for women's vote and rights" },
      { name: "Wilder Penfield", role: "neurosurgeon", note: "founded the Montreal Neurological Institute in 1934" },
    ],
  },
  {
    country: "CA", decadeStart: 1930, people: [
      { name: "R. B. Bennett", role: "prime minister", note: "Conservative PM during the Depression" },
      { name: "Mackenzie King", role: "prime minister", note: "returned in 1935 and led Canada through the war" },
      { name: "Emily Carr", role: "painter / writer", note: "painted the BC coast forests; won Governor General's Award for prose 1941" },
      { name: "Norman Bethune", role: "surgeon", note: "Communist doctor who served in Spain and Mao's China" },
      { name: "Lucy Maud Montgomery", role: "novelist", note: "kept publishing through the decade; died 1942" },
      { name: "Foster Hewitt", role: "broadcaster", note: "'He shoots, he scores' from Maple Leaf Gardens every Saturday" },
      { name: "Frederick Banting", role: "scientist", note: "killed in a plane crash off Newfoundland in 1941" },
      { name: "John Diefenbaker", role: "politician", note: "began his ascent as a Saskatchewan MP" },
    ],
  },
  {
    country: "CA", decadeStart: 1940, people: [
      { name: "Mackenzie King", role: "prime minister", note: "led Canada through WWII" },
      { name: "Louis St. Laurent", role: "prime minister", note: "took over from King in 1948" },
      { name: "Maurice Richard", role: "hockey player", note: "first NHL 50-goals-in-50-games season, 1944-45" },
      { name: "Glenn Gould", role: "pianist", note: "a child prodigy in Toronto" },
      { name: "Hugh MacLennan", role: "novelist", note: "Two Solitudes (1945) defined English-French Canada" },
      { name: "Northrop Frye", role: "literary critic", note: "Fearful Symmetry (1947)" },
      { name: "Gabrielle Roy", role: "novelist", note: "Bonheur d'occasion (1945) — modern Quebec fiction" },
      { name: "Tommy Douglas", role: "premier of Saskatchewan", note: "elected 1944, pioneering medicare" },
    ],
  },
  {
    country: "CA", decadeStart: 1950, people: [
      { name: "Louis St. Laurent", role: "prime minister", note: "Liberal PM through most of the decade" },
      { name: "John Diefenbaker", role: "prime minister", note: "won landslide 1958 election" },
      { name: "Lester Pearson", role: "diplomat / politician", note: "Nobel Peace Prize 1957 for UN peacekeeping" },
      { name: "Glenn Gould", role: "pianist", note: "1955 Goldberg Variations recording made him a global star" },
      { name: "Marshall McLuhan", role: "media theorist", note: "The Mechanical Bride (1951)" },
      { name: "Maurice Richard", role: "hockey player", note: "the 1955 Richard Riot in Montreal" },
      { name: "Northrop Frye", role: "critic", note: "Anatomy of Criticism (1957)" },
      { name: "Mordecai Richler", role: "novelist", note: "Son of a Smaller Hero (1955)" },
    ],
  },
  {
    country: "CA", decadeStart: 1960, people: [
      { name: "Pierre Trudeau", role: "prime minister", note: "elected 1968 with Trudeaumania" },
      { name: "Lester Pearson", role: "prime minister", note: "Liberal PM 1963-68; created medicare and the flag" },
      { name: "Tommy Douglas", role: "NDP leader", note: "first federal NDP leader from 1961" },
      { name: "Marshall McLuhan", role: "media theorist", note: "Understanding Media (1964)" },
      { name: "Leonard Cohen", role: "songwriter / novelist", note: "Beautiful Losers (1966); first album 1967" },
      { name: "Joni Mitchell", role: "singer-songwriter", note: "moved to LA but stayed Canadian to her core" },
      { name: "Neil Young", role: "singer-songwriter", note: "in Buffalo Springfield then CSNY" },
      { name: "Gordon Lightfoot", role: "singer-songwriter", note: "If You Could Read My Mind" },
      { name: "Margaret Laurence", role: "novelist", note: "The Stone Angel (1964)" },
      { name: "Bobby Orr", role: "hockey player", note: "Boston Bruins from 1966, redefining defense" },
      { name: "Glenn Gould", role: "pianist", note: "famously retired from concert performance in 1964" },
    ],
  },
  {
    country: "CA", decadeStart: 1970, people: [
      { name: "Pierre Trudeau", role: "prime minister", note: "ruled most of the decade, invoking the War Measures Act in 1970" },
      { name: "René Lévesque", role: "Quebec premier", note: "Parti Québécois leader from founding; premier from 1976" },
      { name: "Margaret Atwood", role: "novelist", note: "Surfacing (1972), Survival (1972)" },
      { name: "Robertson Davies", role: "novelist", note: "Deptford Trilogy completed 1975" },
      { name: "Northrop Frye", role: "critic", note: "the most cited critic in English at the time" },
      { name: "Mordecai Richler", role: "novelist", note: "St. Urbain's Horseman (1971)" },
      { name: "Leonard Cohen", role: "songwriter", note: "New Skin for the Old Ceremony (1974)" },
      { name: "Joni Mitchell", role: "musician", note: "Court and Spark (1974), Hejira (1976)" },
      { name: "Wayne Gretzky", role: "hockey player", note: "first NHL season with the Edmonton Oilers, 1979-80" },
      { name: "Terry Fox", role: "athlete", note: "started his Marathon of Hope in St. John's, April 1980" },
    ],
  },

  // ─────────────────────────── Mexico ────────────────────────────
  {
    country: "MX", decadeStart: 1920, people: [
      { name: "Álvaro Obregón", role: "president", note: "consolidated the Revolution; assassinated in 1928" },
      { name: "Plutarco Elías Calles", role: "president", note: "ignited the Cristero War in 1926" },
      { name: "Diego Rivera", role: "muralist", note: "painted the Secretaría de Educación murals 1923-28" },
      { name: "José Clemente Orozco", role: "muralist", note: "began the great mural cycles" },
      { name: "David Alfaro Siqueiros", role: "muralist", note: "co-founded the muralist movement" },
      { name: "Frida Kahlo", role: "painter", note: "a teenager when a 1925 tram accident shaped her life" },
      { name: "Pancho Villa", role: "revolutionary general", note: "assassinated in his car in 1923" },
      { name: "José Vasconcelos", role: "writer / minister", note: "Education Minister who launched the literacy campaigns" },
    ],
  },
  {
    country: "MX", decadeStart: 1930, people: [
      { name: "Lázaro Cárdenas", role: "president", note: "nationalised oil in 1938, redistributed land" },
      { name: "Diego Rivera", role: "muralist", note: "Detroit Industry, Rockefeller Center scandal, Palacio de Bellas Artes mural" },
      { name: "Frida Kahlo", role: "painter", note: "Self-Portrait with Monkey, the Two Fridas in 1939" },
      { name: "David Alfaro Siqueiros", role: "muralist", note: "led the failed attack on Trotsky's home in 1940" },
      { name: "Leon Trotsky", role: "revolutionary", note: "lived in Coyoacán from 1937; assassinated 1940" },
      { name: "Cantinflas (Mario Moreno)", role: "comic actor", note: "debuted in carpa shows, then film" },
      { name: "Dolores del Río", role: "actress", note: "Hollywood star returning to Mexican cinema" },
    ],
  },
  {
    country: "MX", decadeStart: 1940, people: [
      { name: "Manuel Ávila Camacho", role: "president", note: "led Mexico into the war and the Bracero Program" },
      { name: "Miguel Alemán", role: "president", note: "the 'Milagro Mexicano' under his rule" },
      { name: "Pedro Infante", role: "singer / actor", note: "the icon of Mexican ranchera cinema" },
      { name: "Jorge Negrete", role: "singer / actor", note: "the other great charro singer of the era" },
      { name: "María Félix", role: "actress", note: "the imperious queen of Mexican cinema" },
      { name: "Cantinflas", role: "comedian", note: "Ahí está el detalle (1940) made him a national star" },
      { name: "Frida Kahlo", role: "painter", note: "What the Water Gave Me (1938), The Broken Column (1944)" },
      { name: "Diego Rivera", role: "muralist", note: "Sueño de una tarde dominical en la Alameda Central (1947)" },
    ],
  },
  {
    country: "MX", decadeStart: 1950, people: [
      { name: "Adolfo Ruiz Cortines", role: "president", note: "extended the federal vote to women in 1953" },
      { name: "Adolfo López Mateos", role: "president", note: "nationalised the electric industry" },
      { name: "Pedro Infante", role: "singer / actor", note: "died in a plane crash in 1957 — national mourning" },
      { name: "Frida Kahlo", role: "painter", note: "died in 1954 at the Casa Azul in Coyoacán" },
      { name: "Diego Rivera", role: "muralist", note: "died in 1957" },
      { name: "Octavio Paz", role: "poet / essayist", note: "El laberinto de la soledad (1950)" },
      { name: "Juan Rulfo", role: "novelist", note: "Pedro Páramo (1955) — Latin America's most influential novel" },
      { name: "Cantinflas", role: "actor", note: "Around the World in 80 Days (1956) won an Oscar for the film" },
      { name: "María Félix", role: "actress", note: "still the biggest Spanish-language star alive" },
    ],
  },
  {
    country: "MX", decadeStart: 1960, people: [
      { name: "Gustavo Díaz Ordaz", role: "president", note: "ordered the Tlatelolco massacre of 1968" },
      { name: "Adolfo López Mateos", role: "president", note: "presided over the Mexican Miracle's peak" },
      { name: "Carlos Fuentes", role: "novelist", note: "La región más transparente (1958), La muerte de Artemio Cruz (1962)" },
      { name: "Octavio Paz", role: "poet", note: "ambassador to India until resigning over Tlatelolco" },
      { name: "Juan Rulfo", role: "novelist", note: "still influential though he had stopped publishing fiction" },
      { name: "José Emilio Pacheco", role: "poet", note: "Los elementos de la noche (1963)" },
      { name: "Carlos Monsiváis", role: "essayist", note: "Días de guardar (1970) closed the decade" },
      { name: "Mario Moreno (Cantinflas)", role: "actor", note: "kept making films through the decade" },
      { name: "Luis Buñuel", role: "filmmaker", note: "made many of his masterworks in Mexico" },
    ],
  },
  {
    country: "MX", decadeStart: 1970, people: [
      { name: "Luis Echeverría", role: "president", note: "pursued shared development; ran the Dirty War" },
      { name: "José López Portillo", role: "president", note: "rode the oil boom; the 1976 devaluation hit hard" },
      { name: "Octavio Paz", role: "poet", note: "El mono gramático (1974); founded Vuelta in 1976" },
      { name: "Carlos Fuentes", role: "novelist", note: "Terra Nostra (1975)" },
      { name: "Carlos Monsiváis", role: "essayist", note: "the moral conscience of Mexico City" },
      { name: "Elena Poniatowska", role: "journalist / novelist", note: "La noche de Tlatelolco (1971) on the 1968 massacre" },
      { name: "Vicente Fernández", role: "singer", note: "rose to ranchera superstardom in the 70s" },
      { name: "Hugo Sánchez", role: "footballer", note: "started his career at UNAM Pumas" },
    ],
  },
];

export function famousFor(country: Country, year: number): FamousPerson[] {
  if (country === "INTL") return [];
  const start = Math.floor(year / 10) * 10;
  const entry = FAMOUS_PEOPLE.find((f) => f.country === country && f.decadeStart === start);
  return entry?.people ?? [];
}

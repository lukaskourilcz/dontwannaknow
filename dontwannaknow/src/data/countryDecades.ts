// Per-country, per-decade snapshots. Six categories of texture (government,
// clothes, illnesses, daily life, food, money) plus a couple of "bizarre" and
// "beautiful" entries. Covers Czechoslovakia/Czech Republic, Spain, the US,
// and Ukraine/Ukrainian SSR for the 1920s through the 1970s.
//
// Each entry is one sentence so we can shuffle them freely.

export type Country = "CZ" | "ES" | "US" | "UA" | "CA" | "MX" | "INTL";

export const COUNTRY_LABELS: Record<Country, string> = {
  CZ: "Czechia / Czechoslovakia",
  ES: "Spain",
  US: "United States",
  UA: "Ukraine / Ukrainian SSR",
  CA: "Canada",
  MX: "Mexico",
  INTL: "Anywhere (global facts only)",
};

export type CountryDecade = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  government: string[];
  clothes: string[];
  illnesses: string[];
  dailyLife: string[];
  food: string[];
  money: string[];
  bizarre: string[];
  beautiful: string[];
};

export const COUNTRY_DECADES: CountryDecade[] = [
  // ─────────────────────────── Czechoslovakia ──────────────────────────
  {
    country: "CZ", decadeStart: 1920,
    government: [
      "Czechoslovakia was a young democracy under philosopher-president T.G. Masaryk.",
      "Parliament met in Prague and the koruna was pegged to gold by Alois Rašín.",
      "Universal suffrage included women — rare in Europe at the time.",
    ],
    clothes: [
      "City women cut their hair into bobs and wore drop-waisted flapper dresses.",
      "Men in Prague wore three-piece suits with a homburg or a soft felt klobouk.",
      "In Moravia and Slovakia, embroidered kroj folk costume was still everyday wear at church.",
      "Baťa in Zlín was making affordable leather shoes that everyone wanted.",
    ],
    illnesses: [
      "Tuberculosis was the great killer; whole sanatoriums dotted the Tatras and Krkonoše.",
      "Diphtheria still took small children; antitoxin was scarce in villages.",
      "The Spanish flu had only just passed and left a generation of widows.",
    ],
    dailyLife: [
      "Prague cafés like the Slavia were full of writers and journalists; Kafka was still alive until 1924.",
      "Trams clanged through Wenceslas Square and a coffee cost a few haléř.",
      "Sunday afternoons meant a walk in the park and a brass-band concert.",
    ],
    food: [
      "Sunday meant pork, dumplings and sauerkraut — the eternal vepřo-knedlo-zelo.",
      "Pilsner Urquell was already being exported around the world.",
      "Coffee was often a chicory blend called cikorka in poorer homes.",
    ],
    money: [
      "An industrial worker in Prague earned around 250 koruna a week.",
      "A loaf of dark bread cost about 2 koruna.",
      "A Baťa pair of leather shoes ran 60 koruna — a serious purchase.",
    ],
    bizarre: [
      "Robots got their name here — Karel Čapek's play R.U.R. premiered in 1921.",
      "The world's first contact lens was being prototyped by Czech doctors.",
    ],
    beautiful: [
      "Czechoslovakia was one of the ten most industrialized countries on earth.",
      "Janáček's operas were premiering in Brno and travelling the world.",
    ],
  },
  {
    country: "CZ", decadeStart: 1930,
    government: [
      "Masaryk handed the presidency to Edvard Beneš in 1935; the Republic looked west to France.",
      "The Munich Agreement in 1938 forced the country to give up the Sudetenland.",
      "By March 1939 the rest of Bohemia and Moravia was a Nazi Protectorate.",
    ],
    clothes: [
      "Bias-cut dresses and fox stoles for women going to the cinema.",
      "Men paired tweed jackets with knickerbockers for the country.",
      "Baťa factories turned out millions of canvas summer shoes a year.",
      "Sudeten German women wore dirndls; Czech women turned to plainer styles.",
    ],
    illnesses: [
      "Tuberculosis still killed thousands a year despite new BCG vaccinations.",
      "Polio outbreaks paralysed children every summer.",
      "Pneumonia was a serious diagnosis — no antibiotics yet.",
    ],
    dailyLife: [
      "Škoda cars rolled off the line in Mladá Boleslav and ČKD locomotives left Prague.",
      "Radios were in middle-class homes; whole families gathered for evening broadcasts.",
      "The Lucerna Palace in Prague hosted swing dances every Saturday.",
    ],
    food: [
      "Open-face chlebíčky sandwiches were invented in this decade by Jan Paukert.",
      "Plzeň breweries kept producing through the Depression — beer stayed cheap.",
      "Pork lard on bread with onion was the village afternoon snack.",
    ],
    money: [
      "The Depression hit hard — by 1933, almost a million Czechoslovaks were unemployed.",
      "A monthly salary for a Prague clerk was around 1,200 koruna.",
      "After Munich the koruna was devalued and rationing began.",
    ],
    bizarre: [
      "Czechoslovaks invented sugar cubes — and the parachute (Štefan Banič).",
      "An aluminium pylon called the Petřín 'mini-Eiffel' watched over Prague.",
    ],
    beautiful: [
      "Czech New Wave architecture and functionalism made Brno one of the world's design capitals.",
      "Czech Olympic skiers and gymnasts brought home medals at every Games.",
    ],
  },
  {
    country: "CZ", decadeStart: 1940,
    government: [
      "Bohemia and Moravia were ruled as a Nazi Protectorate; Reinhard Heydrich was assassinated in Prague in 1942.",
      "In retribution, the village of Lidice was wiped off the map in June 1942.",
      "Liberation in 1945 came partly from the Red Army, partly from Patton's troops.",
      "The Communist Party took full power in the February 1948 coup.",
    ],
    clothes: [
      "Wartime clothing was rationed by Kleiderkarte; people unpicked old curtains for fabric.",
      "Parachute silk made wedding dresses for the lucky few after the war.",
      "Postwar Communist style favoured plain wool dresses and shapeless suits.",
    ],
    illnesses: [
      "Concentration-camp survivors brought typhus and starvation disease home.",
      "Penicillin only reached Prague hospitals at the very end of the war.",
      "Polio epidemics through 1948 paralysed thousands of Czech children.",
    ],
    dailyLife: [
      "Curfews, blackouts and the Gestapo defined daily life from 1939 to 1945.",
      "After the war, ethnic Germans were expelled and whole border villages emptied.",
      "By 1948 you could go to prison for listening to Radio Free Europe.",
    ],
    food: [
      "Wartime ersatz coffee was roasted chicory; real coffee was a black-market luxury.",
      "Potato dumplings replaced flour ones during ration years.",
      "After the war, UNRRA shipments of American tinned milk fed the cities.",
    ],
    money: [
      "Currency reform in 1953 wiped out savings overnight at a 50-to-1 rate.",
      "Industrial nationalisation seized factories from owners without compensation.",
      "Black-market dollars traded at five times the official rate.",
    ],
    bizarre: [
      "Czech-trained paratroopers from Britain killed the third-highest Nazi in Prague.",
      "The 'Czechoslovak miracle' — being on both fronts — left the country oddly intact.",
    ],
    beautiful: [
      "Liberation by the Red Army in Prague in May 1945 brought flowers and tank rides.",
      "Antonín Dvořák's New World Symphony played in newly reopened concert halls.",
    ],
  },
  {
    country: "CZ", decadeStart: 1950,
    government: [
      "Stalinist Czechoslovakia held show trials — Rudolf Slánský and ten others were hanged in 1952.",
      "President Klement Gottwald died nine days after attending Stalin's funeral.",
      "The economy was planned in five-year increments by Gosplan-style ministries.",
    ],
    clothes: [
      "Communist factories turned out interchangeable cotton dresses in three colours.",
      "Pioneers (Pionýr) wore red neckerchiefs to school.",
      "Smuggled blue jeans from West Germany were traded for two weeks' salary.",
      "Spartakiáda mass-gymnastics costumes — white shorts and tops — filled stadiums every five years.",
    ],
    illnesses: [
      "Universal vaccination wiped out diphtheria; polio outbreaks finally ended in 1960.",
      "The first heart surgeries in Brno saved lives that would have been lost ten years earlier.",
      "Air pollution from north-Bohemian coal plants caused chronic lung disease.",
    ],
    dailyLife: [
      "Bread queues formed at 5 a.m.; a chata cottage was every family's weekend dream.",
      "May Day parades, factory choirs and forced 'voluntary' Saturday work were normal.",
      "Letters from relatives in the West were opened and read by the secret police.",
    ],
    food: [
      "Tatranky wafers and Kofola — the Communist Coca-Cola — were children's treats.",
      "Beef was rationed; pork knee with mustard was the Sunday standby.",
      "Mléko (milk) was delivered in glass bottles by 6 a.m.",
    ],
    money: [
      "A worker's monthly wage was around 1,400 Kčs; a Škoda 1000 MB cost 44,000 Kčs.",
      "A loaf of bread cost 2 Kčs and stayed there for decades.",
      "There was no real unemployment — and no real career mobility either.",
    ],
    bizarre: [
      "A 30-metre stone Stalin towered over Prague from 1955 until it was dynamited in 1962.",
      "Czechoslovakia briefly tried to grow cotton and oranges in collectives.",
    ],
    beautiful: [
      "Emil Zátopek won three gold medals at the Helsinki Olympics in 1952.",
      "The Laterna Magika multimedia theatre debuted at Expo 58 in Brussels.",
    ],
  },
  {
    country: "CZ", decadeStart: 1960,
    government: [
      "Alexander Dubček launched 'socialism with a human face' — the Prague Spring of 1968.",
      "On August 21, 1968, Warsaw Pact tanks rolled in and crushed the reforms.",
      "The country was renamed the Czechoslovak Socialist Republic in 1960.",
    ],
    clothes: [
      "Miniskirts arrived in Prague in 1966 — boutiques on Wenceslas Square sold their first ones.",
      "Smuggled Levi's became the most prized possession of any Czech teenager.",
      "Long hair on men got you beaten up by police in the early 60s, fashionable by the end.",
    ],
    illnesses: [
      "Smoking was endemic — over 40% of adult Czechs smoked, even pregnant women.",
      "Heart disease overtook tuberculosis as the leading cause of death.",
      "Mental hospitals were used to detain dissidents from 1968 onward.",
    ],
    dailyLife: [
      "Czech New Wave cinema — Forman, Menzel, Chytilová — won Oscars and shocked audiences.",
      "Jan Palach burned himself to death in Wenceslas Square in January 1969.",
      "Saturday mornings were 'voluntary brigades'; Sunday was for the chata cottage.",
    ],
    food: [
      "Beer remained cheaper than soda, even for under-18s.",
      "Bramboráky — potato pancakes — were every cottage weekend's lunch.",
      "Imported oranges from Cuba arrived once a year, before Christmas.",
    ],
    money: [
      "Average wage hit around 1,500 Kčs a month; a Škoda 100 cost 35,000 Kčs.",
      "Black-market dollars traded at 30 Kčs vs. the official 14 Kčs.",
      "A weekend in the Tatras at a union hotel cost 80 Kčs all in.",
    ],
    bizarre: [
      "Soft contact lenses were invented in Prague by Otto Wichterle in 1961, using a Meccano set.",
      "The Czechs designed and built their own Tatra 603 V8 luxury car — only for party officials.",
    ],
    beautiful: [
      "Czechoslovakia won the silver at the 1968 Mexico Olympics in artistic gymnastics — Věra Čáslavská became a national hero.",
      "The Semafor theatre and Voskovec & Werich-style cabaret returned briefly to Prague.",
    ],
  },
  {
    country: "CZ", decadeStart: 1970,
    government: [
      "Gustáv Husák ran the 'Normalization' — purging anyone who'd supported Prague Spring.",
      "Charter 77, signed by Václav Havel and 240 others, demanded human rights and got people jailed.",
      "Every workplace had a Communist Party cell and informers (StB) everywhere.",
    ],
    clothes: [
      "Polyester ruled — non-iron shirts, flared trousers, brown and orange everything.",
      "Tuzex shops sold Western goods for special currency (bony) you had to buy at the bank.",
      "Adidas track suits were the ultimate status symbol of any Czech teenager.",
    ],
    illnesses: [
      "Coronary disease and lung cancer became the great killers — Czechoslovak life expectancy fell behind the West.",
      "Air pollution in north Bohemia caused widespread respiratory illness.",
      "Alcoholism — vodka, beer and slivovice — was a national health crisis.",
    ],
    dailyLife: [
      "The underground band Plastic People of the Universe were tried and jailed in 1976.",
      "Saturdays were spent at the chata; Sundays meant a packed train back to Prague.",
      "Vacations were at union hotels in Bulgaria or East Germany — and once a decade, maybe Yugoslavia.",
    ],
    food: [
      "Tatranky and Horalky wafers, Kofola from a tap, Pribiňáček quark cups.",
      "Bananas appeared in shops twice a year and queues stretched for blocks.",
      "Sunday lunch was svíčková with bread dumplings, every single week.",
    ],
    money: [
      "Average wage was around 2,400 Kčs/month; a Škoda 105 cost 60,000 Kčs and had a 5-year waiting list.",
      "A new flat (panelák apartment) was assigned by the state — no buying, no choosing.",
      "Pensions were 1,000–1,500 Kčs/month and people lived on them.",
    ],
    bizarre: [
      "Czechoslovak rock fans had to listen to Western music on Radio Luxembourg under blankets.",
      "Children's TV show Večerníček began in 1965 and still airs every evening today.",
    ],
    beautiful: [
      "Czechoslovakia won the Ice Hockey World Championship in 1972, 1976 and 1977 — beating the USSR.",
      "Olga Havlová ran samizdat circles that kept Czech literature alive underground.",
    ],
  },

  // ───────────────────────────── Spain ─────────────────────────────────
  {
    country: "ES", decadeStart: 1920,
    government: [
      "King Alfonso XIII reigned; from 1923 General Miguel Primo de Rivera ran a soft dictatorship.",
      "Anarchist labour unions (CNT) and the Catholic Church fought over Spain's soul.",
      "Universal male suffrage existed, but elections were managed through caciquismo (rural bosses).",
    ],
    clothes: [
      "Andalusian women wore long black dresses and mantillas to Mass.",
      "Men in Madrid wore tight trousers and a flat boina cap.",
      "Alpargatas — rope-soled espadrilles — were on every farmworker's feet.",
      "Bullfighters in their traje de luces were national celebrities.",
    ],
    illnesses: [
      "Tuberculosis was endemic; sanatoriums in the Sierra de Guadarrama filled up.",
      "Trachoma blinded thousands in poor rural areas.",
      "Spanish flu (named in Spain, but not from there) had only just finished its work.",
    ],
    dailyLife: [
      "Madrid's metro opened in 1919 — only Line 1 — and reached just four stops in the 20s.",
      "Bullfights were the biggest spectacle outside football.",
      "Tertulias — café political debates — went late every night in cities.",
    ],
    food: [
      "Olive oil, bread and lentils were the eternal staples.",
      "Chocolate con churros was already breakfast in Madrid cafés.",
      "Sherry from Jerez and Rioja wine were exported across Europe.",
    ],
    money: [
      "A peón (day labourer) earned 4–5 pesetas a day.",
      "A bullfighter could earn 10,000 pesetas a fight — outrageous money.",
      "A loaf of bread cost about 0.50 pesetas.",
    ],
    bizarre: [
      "Spain stayed neutral in WWI and got rich — only to be hammered by the postwar slump.",
      "The first transatlantic flight from Spain landed in Buenos Aires in 1926.",
    ],
    beautiful: [
      "The Generation of '27 — Lorca, Dalí, Buñuel, Alberti — were redefining Spanish art.",
      "Gaudí was still building La Sagrada Família when he was hit by a tram in 1926.",
    ],
  },
  {
    country: "ES", decadeStart: 1930,
    government: [
      "The Second Republic was declared in April 1931 — the king fled to Rome.",
      "From July 1936 to April 1939, Spain was torn apart by Civil War.",
      "Franco's Nationalists won, backed by Hitler and Mussolini; the Republic had only the Soviets and idealistic volunteers.",
    ],
    clothes: [
      "Republican women wore trousers in public for the first time in Spanish history.",
      "Civil War militias wore blue overalls (mono azul) as a uniform.",
      "Falangist boys wore blue shirts; the children of the right wore black armbands.",
      "Postwar dressmaking meant remaking your mother's clothes — fabric was rationed.",
    ],
    illnesses: [
      "Civil War brought typhus from trenches and infected wounds without antibiotics.",
      "Famine hit Madrid during the siege; rickets and tuberculosis surged.",
      "Refugees in French camps died of dysentery by the thousand.",
    ],
    dailyLife: [
      "Lorca was murdered in Granada in August 1936 — his body has never been found.",
      "Picasso painted Guernica in Paris in 1937 after the bombing.",
      "The International Brigades brought 35,000 volunteers from 53 countries.",
    ],
    food: [
      "The Republic gave women the vote in 1931 and rationed bread in 1937.",
      "Lentils were nicknamed 'Dr. Negrín's pills' after the wartime prime minister.",
      "Boniato (sweet potato) replaced bread when wheat ran out.",
    ],
    money: [
      "Hyperinflation under the Republic — by 1939 the peseta had collapsed.",
      "Postwar wages were below 1936 levels until well into the 1950s.",
      "Black market estraperlo controlled half of all food trade.",
    ],
    bizarre: [
      "Two pesetas existed — Republican and Nationalist — and they hated each other.",
      "Hemingway and Orwell both fought, or reported on, the same war.",
    ],
    beautiful: [
      "Spanish women voted for the first time in 1933.",
      "Buñuel and Dalí made the still-shocking Un Chien Andalou.",
    ],
  },
  {
    country: "ES", decadeStart: 1940,
    government: [
      "Franco's regime ruled by decree; the Falange and the Church were the two pillars.",
      "Spain stayed officially neutral in WWII but sent the Blue Division to fight for Hitler in Russia.",
      "International isolation through the 1940s — only Portugal and Argentina were friendly.",
    ],
    clothes: [
      "Women wore black for years for fathers, brothers and husbands lost in the war.",
      "Boys in the Frente de Juventudes wore Falange uniforms to school.",
      "Mantillas at Mass were enforced by neighbourhood priests.",
      "Stockings were rationed; women painted seams up the backs of their legs.",
    ],
    illnesses: [
      "The 'years of hunger' (años del hambre) brought rickets, scurvy and infant mortality back.",
      "Tuberculosis surged; sanatoriums reopened across the meseta.",
      "Lice-borne typhus epidemic in 1941–43 killed thousands.",
    ],
    dailyLife: [
      "Cartillas de racionamiento (ration books) lasted until 1952.",
      "Nights at the cinema were the only entertainment — every village had a sala.",
      "Spanish radio played 'Cara al Sol' before every newscast.",
    ],
    food: [
      "Cocido madrileño and lentil stews were Sunday luxuries.",
      "Bread was made of barley flour mixed with anything available.",
      "Chocolate appeared once a year, at Christmas.",
    ],
    money: [
      "A worker earned 5 pesetas a day; black-market bread cost 6.",
      "The peseta lost over half its value in the 1940s.",
      "Emigrants to Latin America sent home dollars that kept families alive.",
    ],
    bizarre: [
      "Spain's only newspaper of record was state-owned ABC and a handful of approved Falange dailies.",
      "Penicillin had to be smuggled in from Tangier or Lisbon.",
    ],
    beautiful: [
      "Children played in the streets in the evenings — kicking rag balls and singing rhymes that still survive.",
      "Federico García Lorca's plays were performed again, banned, then performed again.",
    ],
  },
  {
    country: "ES", decadeStart: 1950,
    government: [
      "The US signed the Pact of Madrid in 1953, putting air bases in Spain and ending Franco's isolation.",
      "Spain joined the UN in 1955 and the IMF in 1958.",
      "The Catholic Church and Falange ruled morality, school and family.",
    ],
    clothes: [
      "Mantillas, missals and white-glove gloves for women going to church.",
      "Men wore dark suits, even on the beach in the early 50s.",
      "Bikinis were banned on most Spanish beaches until 1959 — and then only in Benidorm.",
    ],
    illnesses: [
      "Polio vaccination drives didn't reach Spanish villages until the end of the decade.",
      "Tuberculosis still killed; antibiotics arrived for the rich first.",
      "Infant mortality was 60 per 1,000 — far above France or Italy.",
    ],
    dailyLife: [
      "Real Madrid won the first five European Cups (1956–1960).",
      "Eurovision Song Contest entries began in 1961, but radio was state-controlled.",
      "Sunday Mass, Sunday paella, Sunday paseo — the rhythm of life.",
    ],
    food: [
      "Paella valenciana was already Spain's signature dish abroad.",
      "Margarine arrived; olive oil dropped in price.",
      "Bocadillos de calamares cost 5 pesetas at any Madrid bar.",
    ],
    money: [
      "Average industrial wage was around 1,500 pesetas/month.",
      "The first Seat 600 car cost 65,000 pesetas in 1957 — the working family's dream.",
      "Migrants to Germany sent home Deutschmarks worth 17 pesetas each.",
    ],
    bizarre: [
      "Catholic censors clipped scenes from Hollywood films and dubbed in different dialogue.",
      "The Eurovision Song Contest's first Spanish entry came in 1961 — Conchita Bautista.",
    ],
    beautiful: [
      "Spanish guitarists Andrés Segovia and Paco de Lucía built international careers.",
      "Pueblo squares filled with kids playing every summer evening.",
    ],
  },
  {
    country: "ES", decadeStart: 1960,
    government: [
      "Late Franco — the dictator ageing, but the regime tightening at the edges.",
      "Technocrats from Opus Dei ran the economy and produced the 'Spanish Miracle'.",
      "ETA (Basque separatists) was founded in 1959 and began killing in the 60s.",
    ],
    clothes: [
      "Miniskirts arrived in Madrid by 1966 — and were denounced from pulpits.",
      "Twiggy-style ye-yé pop girls in white go-go boots filled TVE shows.",
      "Beach tourists from Sweden and Germany scandalised village priests with bikinis.",
    ],
    illnesses: [
      "Tobacco was everywhere — Ducados and Bisontes cost 5 pesetas a packet.",
      "Polio vaccine finally reached every Spanish child by 1964.",
      "Hepatitis A from contaminated shellfish was a common holiday illness.",
    ],
    dailyLife: [
      "Tourist boom — Costa Brava and Costa del Sol filled with Brits and Germans.",
      "The first FM radio stations and TVE's second channel went on air.",
      "Spanish workers emigrated by the hundred thousand to Germany, France and Switzerland.",
    ],
    food: [
      "The first McDonald's wouldn't arrive until 1981 — but Coca-Cola was now everywhere.",
      "Sangria became a tourist drink and a national embarrassment to wine purists.",
      "Bocadillo de tortilla was the workman's lunch on every Madrid construction site.",
    ],
    money: [
      "Spain's GDP grew 7% a year through the 60s.",
      "The Seat 850 cost 78,000 pesetas; the 124 cost 132,000.",
      "Apartments in Madrid's new barrios cost 250,000–500,000 pesetas.",
    ],
    bizarre: [
      "An American B-52 dropped four hydrogen bombs near Palomares, Almería, in 1966 — one was never properly found for months.",
      "Massiel won Eurovision 1968 in London with 'La, la, la', allegedly rigging votes through Franco.",
    ],
    beautiful: [
      "Andalusian flamenco singer Camarón de la Isla broke onto the scene as a teenager.",
      "Joan Manuel Serrat sang in Catalan on TV for the first time in years.",
    ],
  },
  {
    country: "ES", decadeStart: 1970,
    government: [
      "Franco died on 20 November 1975 — Spain held its breath.",
      "King Juan Carlos I oversaw the transition to democracy.",
      "The 1978 Constitution legalised political parties and gave the regions autonomy.",
    ],
    clothes: [
      "Bell-bottoms, flowery shirts, sideburns, platforms — Spain finally caught up with the rest of the West.",
      "La Movida Madrileña was about to explode at the end of the decade with punk hair and leather.",
      "Topless beaches became legal in 1978.",
    ],
    illnesses: [
      "Toxic colza-oil syndrome of 1981 was looming; cholera outbreaks in Barcelona in 1971.",
      "Heroin epidemic began with the transition — Spain became Europe's heroin gateway.",
      "Tuberculosis was finally a rare disease.",
    ],
    dailyLife: [
      "Camilo José Cela and other dissident writers came home.",
      "TVE 'Estudio 1' aired Lorca and Beckett — once banned, now mainstream.",
      "Family planning was legalised in 1978; divorce in 1981.",
    ],
    food: [
      "Tapas culture, hours-long lunches, and a 4 p.m. siesta were national institutions.",
      "First sushi restaurants appeared in Madrid in 1978 — and confused everyone.",
      "Wine in restaurants came in carafes from the cellar; bottled wine was a luxury.",
    ],
    money: [
      "Inflation hit 24% in 1977 — the worst year economically.",
      "Average industrial wage was 25,000 pesetas/month by decade's end.",
      "A Seat 127 cost 175,000 pesetas in 1972.",
    ],
    bizarre: [
      "Carrero Blanco, Franco's chosen successor, was blown over a five-storey building by ETA in 1973.",
      "Spain held its first elections in 41 years in June 1977.",
    ],
    beautiful: [
      "The Eagles of Death Metal — sorry, the Spanish edition of the Beatles — was Los Pajaros Locos.",
      "Spaniards voted overwhelmingly for democracy in the 1978 constitutional referendum.",
    ],
  },

  // ───────────────────────────── United States ──────────────────────────
  {
    country: "US", decadeStart: 1920,
    government: [
      "Three Republican presidents: Warren Harding, Calvin Coolidge, Herbert Hoover.",
      "Prohibition (1920–1933) outlawed alcohol nationwide — speakeasies thrived.",
      "Women gained the vote with the 19th Amendment, ratified in August 1920.",
    ],
    clothes: [
      "Flappers bobbed their hair, raised their hemlines and danced the Charleston.",
      "Men wore straw boaters in summer and three-piece suits with watch fobs.",
      "Raccoon coats were the must-have college look.",
      "Pearls, long strands of beads and beaded handbags — the Gatsby look.",
    ],
    illnesses: [
      "Tuberculosis sanatoriums in Saranac Lake and the Adirondacks were full year-round.",
      "Polio paralysed thousands of children every summer.",
      "The 1918 flu had killed 675,000 Americans — the country was still recovering.",
    ],
    dailyLife: [
      "Radio in every home, jazz on every station, Babe Ruth in every newspaper.",
      "Henry Ford's Model T dropped to $260 — a working man's car.",
      "The Harlem Renaissance turned New York into the world's literary capital.",
    ],
    food: [
      "Wonder Bread arrived sliced in 1928 — and was a revelation.",
      "Soda fountains served egg creams, malted milks and phosphates.",
      "Hostess Twinkies (1930) and Eskimo Pies (1921) were new.",
    ],
    money: [
      "Stock market boom — by 1929 the Dow had tripled in five years.",
      "Average factory wage was $1,300/year.",
      "A new Ford Model T cost $260 in 1925; a gallon of gas was 25¢.",
    ],
    bizarre: [
      "Charles Lindbergh flew solo across the Atlantic in 1927 in 33½ hours.",
      "A live circus elephant called Topsy was electrocuted to prove the dangers of AC current — slightly before this decade, but the urban legend ran.",
    ],
    beautiful: [
      "Louis Armstrong's Hot Five and Hot Seven recordings invented modern jazz.",
      "The Brooklyn Bridge was lit up at night for the first time in 1924.",
    ],
  },
  {
    country: "US", decadeStart: 1930,
    government: [
      "FDR's New Deal — Social Security, the WPA, the CCC, the SEC — reshaped America.",
      "Prohibition was repealed in 1933 by the 21st Amendment.",
      "Isolationism dominated foreign policy until Pearl Harbor in 1941.",
    ],
    clothes: [
      "Padded shoulders for women by the late 30s; bias-cut satin gowns for evening.",
      "Men's wide-legged trousers, fedoras, and double-breasted suits.",
      "Dust Bowl families wore flour-sack dresses — manufacturers printed them in florals.",
    ],
    illnesses: [
      "Polio hit FDR himself in 1921; he kept his wheelchair out of every press photo.",
      "Pellagra killed thousands of poor Southerners until niacin was added to bread.",
      "Tuberculosis still ranked among the top three causes of death.",
    ],
    dailyLife: [
      "One in four Americans was unemployed at the depths of the Depression.",
      "Dust Bowl storms blackened the sky from Texas to Kansas.",
      "Hoovervilles — shanty towns of the homeless — appeared in every city.",
    ],
    food: [
      "Spam arrived in 1937; Kraft Macaroni & Cheese in 1937; chocolate chip cookies invented in 1938.",
      "Soup kitchens fed millions; Hoover stew was beans and hot dogs.",
      "Coca-Cola was 5¢ a bottle and stayed there for decades.",
    ],
    money: [
      "GDP fell by 30%; unemployment hit 25%.",
      "Average factory wage dropped to $1,370/year.",
      "A new Ford was around $500.",
    ],
    bizarre: [
      "The Hindenburg burned at Lakehurst, NJ in 1937 — captured live on radio.",
      "Orson Welles's 1938 'War of the Worlds' broadcast made listeners think aliens had landed.",
    ],
    beautiful: [
      "Jesse Owens won four golds at the 1936 Berlin Olympics — in front of Hitler.",
      "The Empire State Building opened in 1931 and was the world's tallest building.",
    ],
  },
  {
    country: "US", decadeStart: 1940,
    government: [
      "FDR won an unprecedented fourth term; died in office in 1945.",
      "Truman ordered atomic bombs dropped on Hiroshima and Nagasaki.",
      "The GI Bill sent millions of veterans to college and helped them buy homes.",
    ],
    clothes: [
      "Rosie the Riveter overalls and bandanas for women in factories.",
      "Stockings were rationed — leg makeup with painted seams replaced silk.",
      "Zoot suits became a fashion and a riot in Los Angeles in 1943.",
    ],
    illnesses: [
      "Penicillin became widely available in 1944 — and changed medicine forever.",
      "Polio epidemics worsened — 1949 had 42,000 cases.",
      "Combat PTSD was called 'shell shock' and 'battle fatigue'.",
    ],
    dailyLife: [
      "Pearl Harbor on December 7, 1941 changed everything.",
      "16 million Americans served in the military; 405,000 didn't come home.",
      "Television started in 1948 — by 1950 there were 4 million sets in homes.",
    ],
    food: [
      "Ration stamps for meat, sugar, butter and coffee.",
      "Victory gardens grew 40% of American produce by 1944.",
      "M&Ms (1941) were invented so soldiers could carry chocolate in the desert.",
    ],
    money: [
      "GDP doubled during the war.",
      "Average factory wage was $1,900/year, rising to $3,000 postwar.",
      "A new Levittown house in 1948 cost $7,990 — $58 a month.",
    ],
    bizarre: [
      "The Manhattan Project employed 130,000 people and most of them didn't know what they were building.",
      "Coca-Cola promised every American GI a Coke for 5¢ wherever they were stationed.",
    ],
    beautiful: [
      "Jackie Robinson broke baseball's colour line with the Dodgers in 1947.",
      "Returning soldiers met their toddler children at train stations for the first time.",
    ],
  },
  {
    country: "US", decadeStart: 1950,
    government: [
      "Eisenhower (Republican) won 1952 and 1956 — a calm, golfing father figure.",
      "McCarthy's HUAC hearings hunted Communists in Hollywood and the State Department.",
      "Brown v. Board of Education in 1954 outlawed segregated schools — in theory.",
    ],
    clothes: [
      "Poodle skirts, saddle shoes, white gloves, pearls.",
      "Greasers in leather jackets, ducktails and white T-shirts — Brando and Dean.",
      "Suburban dads in cardigans, button-downs, and ties at dinner.",
    ],
    illnesses: [
      "The 1952 polio epidemic was the worst in American history — 57,000 cases.",
      "Jonas Salk's polio vaccine arrived in 1955 to nationwide relief.",
      "Smoking was promoted by doctors in cigarette ads.",
    ],
    dailyLife: [
      "Suburbs exploded — Levittowns sold houses for $7,990.",
      "Drive-in movies, drive-in burgers, drive-in everything.",
      "Sock hops, soda fountains, and rock 'n' roll dropped from heaven in 1955.",
    ],
    food: [
      "Swanson's TV dinners arrived in 1953 — instant glamour.",
      "Jell-O salads, casseroles, and pineapple upside-down cake on every table.",
      "McDonald's franchised in 1955; KFC in 1952.",
    ],
    money: [
      "Average wage hit $3,300 in 1950, $5,300 by 1960.",
      "A new Chevy Bel Air in 1957 cost $2,000.",
      "A loaf of bread was 14¢; a gallon of gas 27¢.",
    ],
    bizarre: [
      "Schools held 'duck and cover' drills in case of atomic attack.",
      "Hula hoops sold 25 million in four months in 1958.",
    ],
    beautiful: [
      "Disneyland opened in Anaheim in July 1955.",
      "Elvis appeared on Ed Sullivan in 1956 — and TV would never be the same.",
    ],
  },
  {
    country: "US", decadeStart: 1960,
    government: [
      "JFK (1961–63) → LBJ → Nixon — three presidents in less than a decade.",
      "Civil Rights Act 1964 and Voting Rights Act 1965 finally outlawed segregation.",
      "Vietnam War escalated; the draft sent young men to fight.",
    ],
    clothes: [
      "Mod, hippies, mini-skirts, bell-bottoms, fringe, tie-dye, the works.",
      "First Lady Jackie Kennedy made pillbox hats and Chanel suits a national style.",
      "Long hair on men — and the moustache — was a political statement.",
    ],
    illnesses: [
      "The Surgeon General's 1964 report officially linked smoking to lung cancer.",
      "Measles vaccine (1963) and rubella vaccine (1969) wiped out childhood illnesses.",
      "LSD and other psychedelics created a whole new field of psychiatric concern.",
    ],
    dailyLife: [
      "Apollo 11 landed on the Moon on July 20, 1969 — 600 million people watched.",
      "Civil rights marches, anti-war protests, and Woodstock defined the decade.",
      "Kennedy was shot in November 1963; MLK and RFK in 1968.",
    ],
    food: [
      "Pop-Tarts (1964), Diet Pepsi (1964), Doritos (1966) — packaged-food gold rush.",
      "TV dinners and microwaves entered suburban kitchens.",
      "Julia Child made the French kitchen mainstream on PBS.",
    ],
    money: [
      "Average wage was $5,600 in 1960, $9,400 by 1970.",
      "A new Ford Mustang in 1964 cost $2,368.",
      "First-class postage went from 4¢ to 6¢ across the decade.",
    ],
    bizarre: [
      "The Cuban Missile Crisis in October 1962 brought the world 13 days from nuclear war.",
      "Star Trek aired for only three seasons (1966–69) and inspired millions.",
    ],
    beautiful: [
      "MLK delivered 'I Have a Dream' on August 28, 1963 to 250,000 people.",
      "The Beatles played Shea Stadium on August 15, 1965 — 55,600 fans, 30 minutes.",
    ],
  },
  {
    country: "US", decadeStart: 1970,
    government: [
      "Nixon resigned in 1974 — the only US president ever to do so.",
      "Ford pardoned Nixon; Carter won 1976 promising he'd 'never lie to you'.",
      "The Vietnam draft ended in 1973; Saigon fell in 1975.",
    ],
    clothes: [
      "Disco era — sequins, polyester, platform shoes, leisure suits.",
      "Bell-bottoms, peasant blouses, and feathered hair like Farrah Fawcett.",
      "Punk in CBGB and the Mudd Club at the end of the decade.",
    ],
    illnesses: [
      "First AIDS cases later identified retrospectively from the late 1970s.",
      "Smoking was finally banned on domestic flights in 1973.",
      "Heart disease became America's number one killer.",
    ],
    dailyLife: [
      "Energy crisis — gas lines stretched for hours in 1973 and 1979.",
      "CB radio and the trucker craze swept the country.",
      "Disco at Studio 54; punk at CBGB; Saturday Night Fever in 1977.",
    ],
    food: [
      "Slurpees, Hamburger Helper, Pop-Tarts and TV dinners — the height of convenience food.",
      "McDonald's introduced the Big Mac in 1968; Egg McMuffin in 1972; Happy Meal in 1979.",
      "Tofu and granola crossed into the mainstream from California communes.",
    ],
    money: [
      "Average wage was $9,400 in 1970, $19,500 by 1980.",
      "A new VW Beetle cost $1,780 in 1972.",
      "Inflation hit 13.5% in 1980 and ruined household budgets.",
    ],
    bizarre: [
      "Pet Rocks sold 1.5 million units in Christmas 1975.",
      "Apollo 17 was the last manned Moon mission — December 1972.",
    ],
    beautiful: [
      "Title IX in 1972 opened school sports to girls.",
      "Star Wars opened May 25, 1977 and made $776 million.",
    ],
  },

  // ──────────────────────── Ukraine / Ukrainian SSR ────────────────────
  {
    country: "UA", decadeStart: 1920,
    government: [
      "After a bloody civil war, Ukraine was incorporated into the new USSR in December 1922.",
      "The early 20s saw the NEP (New Economic Policy) — brief market relaxation, peasants could keep grain.",
      "Korenizatsiya policy briefly promoted Ukrainian language and culture in schools.",
    ],
    clothes: [
      "Vyshyvanka embroidered shirts were everyday folk wear in villages.",
      "City workers wore plain cotton blouses and pleated skirts.",
      "Sheepskin coats (kozhukh) and felt boots (valenki) for winter.",
      "Headscarves universal for married women.",
    ],
    illnesses: [
      "Civil war typhus and cholera devastated Kyiv and Kharkiv.",
      "Famine of 1921–22 killed hundreds of thousands in southern Ukraine.",
      "Tuberculosis was endemic in the cities.",
    ],
    dailyLife: [
      "Ukrainian-language theatres opened in Kharkiv (the capital until 1934) and Kyiv.",
      "Writers like Mykola Khvylovy began the 'Executed Renaissance' — most would not survive the 30s.",
      "Electrification reached major cities; villages still used kerosene lamps.",
    ],
    food: [
      "Borscht with sour cream, salo (cured pork fat) on rye bread, varenyky.",
      "Bread was rationed in the famine years.",
      "Vodka and kvass were the everyday drinks.",
    ],
    money: [
      "After the chervonets reform in 1922, the rouble briefly stabilised.",
      "Peasants paid taxes in grain quotas, not money.",
      "Workers in Donbas mines earned 30–40 roubles a month.",
    ],
    bizarre: [
      "Kharkiv was the capital of Soviet Ukraine, not Kyiv, from 1919 to 1934.",
      "Ukrainian futurist poets wrote in Esperanto — and got published.",
    ],
    beautiful: [
      "The Berezil Theatre under Les Kurbas reinvented Ukrainian drama.",
      "Vyshyvanka design was being collected in folk museums and patterns codified.",
    ],
  },
  {
    country: "UA", decadeStart: 1930,
    government: [
      "Stalin imposed forced collectivization; millions of peasants were dispossessed.",
      "The Holodomor (1932–33) — the man-made famine — killed an estimated 3–7 million Ukrainians.",
      "The Great Terror (1937–38) executed Ukrainian intellectuals, party officials, writers, priests.",
    ],
    clothes: [
      "Padded jackets (telogreika or vatnik) for workers and prisoners.",
      "Plain dark dresses with white collars for women.",
      "Felt boots (valenki) in winter; rubber boots (kirzovye) in mud.",
      "Vyshyvanka was tolerated as 'folk costume' but discouraged as everyday wear.",
    ],
    illnesses: [
      "Holodomor caused famine diseases — pellagra, starvation, dystrophy, child diphtheria.",
      "Typhus epidemics swept the Gulag camps and rural villages.",
      "Tuberculosis claimed those weakened by hunger.",
    ],
    dailyLife: [
      "Villagers buried grain in the ground to hide it from grain-requisition brigades.",
      "Cannibalism was documented in dozens of Ukrainian villages in 1933.",
      "Show trials and disappearances — every family knew someone arrested.",
    ],
    food: [
      "In 1933, villagers boiled bark, weeds, and leather belts for soup.",
      "Bread ration cards in cities — but Ukraine, the breadbasket, had no bread.",
      "Salo and pickles kept hidden in cellars saved families through winter.",
    ],
    money: [
      "Collective-farm workers were paid in trudodni (work-days), often redeemable for nothing.",
      "City workers earned 100–150 roubles a month.",
      "A black-market loaf of bread cost a worker's daily wage in 1933.",
    ],
    bizarre: [
      "Ukrainian was officially the language of administration through 1938 — even as its writers were being shot.",
      "Walter Duranty of the New York Times denied the famine and won a Pulitzer.",
    ],
    beautiful: [
      "Ukrainian poets like Pavlo Tychyna wrote verses that survived in samizdat for decades.",
      "Ukrainian football clubs — Dynamo Kyiv among them — were founded in the 30s.",
    ],
  },
  {
    country: "UA", decadeStart: 1940,
    government: [
      "Nazi Germany invaded in June 1941; Ukraine was under occupation from 1941 to 1944.",
      "Babyn Yar massacre — 33,771 Jews murdered in 36 hours, September 1941, in Kyiv.",
      "Soviet reconquest by 1944; mass deportations of Crimean Tatars and others followed.",
    ],
    clothes: [
      "Wartime: military surplus, padded jackets, anything that could be patched.",
      "Postwar village women still wore long dark skirts and head scarves.",
      "Soviet rayon dresses replaced the linen vyshyvanka for everyday wear.",
    ],
    illnesses: [
      "Wartime typhus, dysentery, frostbite gangrene — every Ukrainian family knew them.",
      "Postwar tuberculosis surged among returning soldiers and refugees.",
      "Famine of 1946–47 killed another 1 million in the southeast.",
    ],
    dailyLife: [
      "Kyiv was 85% destroyed by 1944; Khreshchatyk had to be rebuilt from rubble.",
      "Partisans (UPA, in western Ukraine) fought Soviets into the early 1950s.",
      "Communal apartments (kommunalki) became the standard urban living arrangement.",
    ],
    food: [
      "Rationing through 1947.",
      "Salo on rye bread and beet borscht stayed the backbone of village meals.",
      "Bread queues lasted hours, even years after the war ended.",
    ],
    money: [
      "Currency reform in 1947 wiped out savings at 10:1.",
      "Collective-farm peasants still earned in trudodni, paid in grain at harvest.",
      "Soldiers' pensions and war-widow benefits were the only steady cash for millions.",
    ],
    bizarre: [
      "Stepan Bandera's followers fought Nazis, then Soviets, into the 1950s.",
      "The Red Army crossed the Dnipro under fire in October 1943 — a Stalingrad-scale battle.",
    ],
    beautiful: [
      "Olha Kobylianska and other women writers were rediscovered in the postwar years.",
      "Kyiv's Khreshchatyk reopened in 1949 — wide boulevards and pastel facades.",
    ],
  },
  {
    country: "UA", decadeStart: 1950,
    government: [
      "Nikita Khrushchev — who'd been Ukraine's party boss in the 30s and 40s — led the USSR.",
      "Crimea was transferred from the Russian SFSR to the Ukrainian SSR in 1954.",
      "Khrushchev's 'Secret Speech' of 1956 denounced Stalin and brought brief liberalisation.",
    ],
    clothes: [
      "Cotton dresses with floral prints, headscarves, knee socks — the Soviet housewife look.",
      "Boys in school uniforms with red Pioneer neckerchiefs.",
      "Padded jackets and rubber boots in collective farms.",
    ],
    illnesses: [
      "Mass vaccination campaigns ended diphtheria, polio, and smallpox in Ukraine by 1960.",
      "Tuberculosis still common in rural Western Ukraine.",
      "Industrial pollution in the Donbas began causing chronic respiratory disease.",
    ],
    dailyLife: [
      "Khrushchyovkas — five-storey concrete apartment blocks — went up everywhere from 1956.",
      "Communal kitchens still standard; private bathrooms a luxury.",
      "Black-and-white television arrived in apartments by the late 50s.",
    ],
    food: [
      "Borscht, kasha, salo, varenyky — unchanged.",
      "Ice cream (morozhene) was a Soviet success story — 10 kopecks for a vanilla cup.",
      "Kvass kiosks on every street corner in summer.",
    ],
    money: [
      "1961 currency reform exchanged 10 old roubles for 1 new — but real prices stayed the same.",
      "Average worker earned 80–100 roubles a month.",
      "Bread was 16 kopecks a loaf and stayed so for 30 years.",
    ],
    bizarre: [
      "Khrushchev's son-in-law edited Pravda; nepotism was real, just not called that.",
      "The 1957 Kyshtym nuclear disaster was kept secret for decades — same with later ones.",
    ],
    beautiful: [
      "Dynamo Kyiv began their decades-long run as Soviet football champions.",
      "Ukrainian poet Vasyl Symonenko and the 'Shistdesiatnyky' generation emerged.",
    ],
  },
  {
    country: "UA", decadeStart: 1960,
    government: [
      "Leonid Brezhnev — born in Kamianske, Ukraine — became Soviet leader in 1964.",
      "Russification policies intensified — Ukrainian schools converted to Russian.",
      "The first dissident trials of Ukrainian intellectuals took place in 1965–66.",
    ],
    clothes: [
      "Soviet mini-skirts arrived late, by 1968, and only in cities.",
      "Boys wore school uniform with brass buttons and a side cap.",
      "Embroidered vyshyvanka had a folk revival among 'Shistdesiatnyky' youth.",
    ],
    illnesses: [
      "Soviet healthcare guaranteed everyone a doctor; the doctors were paid 70 roubles a month.",
      "Smoking — Belomorkanal papirosy — was endemic.",
      "Tuberculosis was finally declining; alcohol-related disease rising.",
    ],
    dailyLife: [
      "The 'Khrushchev Thaw' allowed Ukrainian-language books for a decade — banned again under Brezhnev.",
      "Dnipro Hydroelectric Station was rebuilt and Ukraine generated power for half the USSR.",
      "Pioneer summer camps in the Carpathians and Crimea.",
    ],
    food: [
      "Soviet-issue cookbooks promoted the same dozen dishes across all 15 republics.",
      "Sausage was scarce — Ukrainians went to Moscow on the train to buy it.",
      "Crimean wines and Soviet champagne for special occasions.",
    ],
    money: [
      "Average worker earned around 120 roubles a month.",
      "A 'Volga' GAZ-21 car cost 5,500 roubles — five years of savings.",
      "An apartment was assigned by the state; you could not buy or sell it.",
    ],
    bizarre: [
      "An Antonov AN-22, the world's largest plane at the time, was built in Kyiv in 1965.",
      "Ukrainian dissident Vyacheslav Chornovil compiled the first samizdat 'Ukrainian Herald'.",
    ],
    beautiful: [
      "Sergei Parajanov's 'Shadows of Forgotten Ancestors' (1965) became a global cinema landmark.",
      "Borys Olijnyk and Lina Kostenko revived Ukrainian poetry.",
    ],
  },
  {
    country: "UA", decadeStart: 1970,
    government: [
      "Volodymyr Shcherbytsky ran the Ukrainian SSR from 1972 — pure Brezhnev loyalist.",
      "The Ukrainian Helsinki Group was founded in 1976 — every member was eventually jailed.",
      "Russification deepened; Ukrainian-language schools shrank.",
    ],
    clothes: [
      "Polyester everything, brown and orange, bell-bottoms by mid-decade.",
      "Adidas track suits, when you could get them, were status symbols.",
      "Soviet jeans (Tver) attempted to copy Levi's and never quite succeeded.",
    ],
    illnesses: [
      "Alcoholism was a national health crisis — average male life expectancy dropped.",
      "Industrial accidents in the Donbas mines were never reported in the press.",
      "Soviet healthcare was free, but you tipped doctors with cognac and chocolate.",
    ],
    dailyLife: [
      "Two-week summer holidays at Crimean sanatoriums, paid for by the trade union.",
      "Empty shelves in shops; everything good came through blat (connections).",
      "Black market for Western jeans, records, and books was huge in Kyiv and Odesa.",
    ],
    food: [
      "Soviet shops had bread, vodka, and tinned fish; everything else was scarce.",
      "Babushkas ran 'cooperative' farms and sold extra produce at the kolkhoz market.",
      "Coffee was a luxury; tea with lemon was the national drink.",
    ],
    money: [
      "Average wage was around 150 roubles a month in 1975.",
      "A Lada VAZ-2101 cost 5,500 roubles and had a six-year waiting list.",
      "A black-market pair of Levi's cost a full month's salary.",
    ],
    bizarre: [
      "The Antonov An-225 — the world's largest plane ever built — was designed in Kyiv at this time (built in 1988).",
      "Ukrainian dissidents in the Gulag wrote poems on bars of soap.",
    ],
    beautiful: [
      "Dynamo Kyiv won the Cup Winners' Cup in 1975 — the first Soviet club to win a European trophy.",
      "Ukrainian singer Sofia Rotaru became one of the biggest stars in the Soviet bloc.",
    ],
  },

  // ───────────────────────────── Canada ────────────────────────────────
  {
    country: "CA", decadeStart: 1920,
    government: [
      "Mackenzie King's Liberals dominated federal politics for most of the decade.",
      "Canada signed the 1923 Halibut Treaty alone — its first independent foreign-affairs act.",
      "The Statute of Westminster was still a few years off; the British Privy Council was the final court of appeal.",
    ],
    clothes: [
      "Flapper dresses, cloche hats and bobbed hair appeared in Toronto and Montreal.",
      "Lumberjack plaid and Mackinaw coats remained everyday wear in the bush and prairie towns.",
      "Eaton's mail-order catalogue dressed half the country, especially out west.",
    ],
    illnesses: [
      "Frederick Banting and Charles Best isolated insulin in Toronto in 1921, transforming diabetes.",
      "Tuberculosis sanatoriums in the Laurentians and the Rockies filled with patients.",
      "The 1918 flu had killed more Canadians than the Great War — every village had its dead.",
    ],
    dailyLife: [
      "The Group of Seven painted the Canadian Shield and Algonquin Park into the national imagination.",
      "Sunday meant church and a roast; Saturday meant hockey on frozen ponds.",
      "L. M. Montgomery's Anne of Green Gables sequels were the country's most read books.",
    ],
    food: [
      "Tea, white bread and butter were the prairie meal; pork and beans on the lumber camps.",
      "Sunday roast beef with Yorkshire pudding remained the urban Anglo-Canadian default.",
      "Tourtière pies and pea soup defined Québécois winter kitchens.",
    ],
    money: [
      "The average Canadian factory wage was about $1,100 a year.",
      "Wheat prices boomed mid-decade; the Prairies built grain elevators in every village.",
      "A Model T cost about $395 in 1924 and a brand-new house under $4,000.",
    ],
    bizarre: [
      "Prohibition ended in most provinces by 1924 — but Canada kept exporting whisky to thirsty Americans.",
      "The Bluenose schooner, launched in 1921 in Nova Scotia, swept international fishing races.",
    ],
    beautiful: [
      "Banting and Macleod won the 1923 Nobel Prize in Medicine for insulin.",
      "Emily Carr was painting the rainforests of the Pacific coast in Victoria.",
    ],
  },
  {
    country: "CA", decadeStart: 1930,
    government: [
      "R. B. Bennett's Conservatives ruled until 1935; Mackenzie King returned in October.",
      "The Statute of Westminster in 1931 gave Canada legislative independence.",
      "Quebec's Premier Maurice Duplessis took office in 1936 with the new Union Nationale.",
    ],
    clothes: [
      "Made-over clothing, flour-sack dresses and patched men's suits were the prairie norm.",
      "Slick city men still wore fedoras and double-breasted suits to the office.",
      "RCMP red serge remained the most photographed uniform in Canada.",
    ],
    illnesses: [
      "Polio outbreaks swept eastern Canada each summer in the late 30s.",
      "Tuberculosis hit Indigenous and Inuit communities catastrophically.",
      "Diphtheria toxoid vaccination drives reached most provincial schools by 1932.",
    ],
    dailyLife: [
      "Prairie 'Dust Bowl' years drove families east to relief camps and Bennett buggies — cars towed by horses to save fuel.",
      "Foster Hewitt called the Saturday Night Hockey games on CBC radio from Maple Leaf Gardens.",
      "The On-to-Ottawa Trek of 1935 ended in the Regina Riot.",
    ],
    food: [
      "Relief rations were potatoes, beans and bread; tea with milk and sugar got people through.",
      "Bannock and dried meat sustained northern and Indigenous communities.",
      "Quebec's pâté chinois and tourtière reigned in working-class neighbourhoods.",
    ],
    money: [
      "Unemployment hit 30% at the low point of the Depression in 1933.",
      "Wheat fell to under 40¢ a bushel from over $2 in the 1920s.",
      "Relief payments averaged $20–25 a month for a family of five.",
    ],
    bizarre: [
      "The Dionne quintuplets were born in Callander, Ontario, in 1934 and put on public display.",
      "Premier Aberhart's Social Credit Alberta tried to print 'Prosperity Certificates' as money.",
    ],
    beautiful: [
      "The CCF (later NDP) was founded in Regina in 1933 with the Regina Manifesto.",
      "Glenn Gould was born in Toronto in 1932; Joni Mitchell, Leonard Cohen and Pierre Berton were already small children somewhere in the country.",
    ],
  },
  {
    country: "CA", decadeStart: 1940,
    government: [
      "Canada declared war on Germany on 10 September 1939 — independently, a week after Britain.",
      "The 1942 plebiscite on conscription split English and French Canada bitterly.",
      "Louis St. Laurent succeeded Mackenzie King in 1948.",
    ],
    clothes: [
      "Wartime ration coupons covered shoes and clothing; women painted seams up the backs of their legs.",
      "RCAF blue and army khaki were everywhere in the cities.",
      "Postwar 'New Look' dresses arrived from Paris and Montreal couture houses.",
    ],
    illnesses: [
      "Penicillin reached Canadian field hospitals by 1944 and transformed wartime medicine.",
      "Polio epidemics worsened, peaking in 1953.",
      "Iron lungs were a familiar sight in pediatric wards.",
    ],
    dailyLife: [
      "Halifax was the Atlantic convoy port; tens of thousands of soldiers and sailors moved through.",
      "Japanese Canadians on the BC coast were interned and dispossessed in 1942.",
      "The CBC's Saturday Night Hockey reached every home with a radio.",
    ],
    food: [
      "Butter, sugar, tea, coffee and meat were all rationed; victory gardens grew in backyards.",
      "Spam, bully beef, and powdered milk were wartime staples.",
      "Postwar, Kraft Dinner (launched 1937) became the student's stove staple.",
    ],
    money: [
      "Average annual wage rose from $1,300 (1940) to about $2,600 by 1950.",
      "Victory Bonds raised billions across nine campaigns.",
      "The first family allowance ('baby bonus') went out in 1945 — $5–8 a month per child.",
    ],
    bizarre: [
      "The 1947 Leduc oil strike in Alberta turned the Prairies into oil country overnight.",
      "Canada was one of three countries to invade Normandy on D-Day, taking Juno Beach.",
    ],
    beautiful: [
      "Canadian troops liberated much of the Netherlands in spring 1945 — and the Dutch royal family sent tulips every year afterwards.",
      "The CBC launched its national network in 1944.",
    ],
  },
  {
    country: "CA", decadeStart: 1950,
    government: [
      "Louis St. Laurent (1948-57) then John Diefenbaker (1957-63) led Canada through the early Cold War.",
      "The Avro Arrow CF-105 first flew in 1958 — and was cancelled in 1959.",
      "Newfoundland joined Confederation in 1949 as Canada's 10th province.",
    ],
    clothes: [
      "Crinolines, poodle skirts and pillbox hats arrived from American TV shows.",
      "Men wore grey flannel suits and felt hats to the office in the new postwar suburbs.",
      "Teenagers in Don Mills and the new ring suburbs adopted blue jeans and white T-shirts.",
    ],
    illnesses: [
      "Salk's polio vaccine reached Canadian schoolchildren by 1955.",
      "Saskatchewan introduced North America's first universal hospital insurance in 1947 — copied across Canada in the 1950s.",
      "Tuberculosis hospitals in the North remained full of Indigenous patients.",
    ],
    dailyLife: [
      "Tim Hortons hadn't been invented yet but Hot Stove League hockey talk dominated Saturday nights.",
      "The St. Lawrence Seaway opened in 1959, bringing ocean shipping to the Great Lakes.",
      "CBC Television began regular broadcasts in 1952; The Plouffe Family was the bilingual hit.",
    ],
    food: [
      "Jell-O salads, butter tarts and Nanaimo bars dominated the church-basement potluck.",
      "First Canadian fast food was the A&W root beer drive-in.",
      "Five Roses flour from Quebec and Carnation evaporated milk were every cupboard's staples.",
    ],
    money: [
      "Average wage hit $3,200 in 1950 and $5,300 by 1960.",
      "A Chevy in 1955 went for about $2,200.",
      "Tim Horton was still playing for the Maple Leafs.",
    ],
    bizarre: [
      "Frank Schuster and Johnny Wayne (Wayne and Shuster) became regular guests on Ed Sullivan.",
      "The CN Tower wasn't yet built, but Toronto's Bank of Commerce was the tallest in the Commonwealth.",
    ],
    beautiful: [
      "Lester Pearson won the 1957 Nobel Peace Prize for creating UN peacekeeping.",
      "Glenn Gould's 1955 Goldberg Variations recording made him a global star.",
    ],
  },
  {
    country: "CA", decadeStart: 1960,
    government: [
      "Lester Pearson's minority Liberals (1963-68) brought in medicare, the maple-leaf flag and the CPP.",
      "Pierre Trudeau took over in 1968 with full Trudeaumania.",
      "The Front de Libération du Québec began bombing mailboxes in 1963.",
    ],
    clothes: [
      "Miniskirts, bell-bottoms and beads arrived in Yorkville and the Plateau.",
      "RCMP red serge featured at Expo 67 and on every souvenir postcard.",
      "Canadian Tire's plaid-clad mascot and red-cap toques were ubiquitous.",
    ],
    illnesses: [
      "Saskatchewan's medicare battle (1962 doctors' strike) led to national medicare by 1968.",
      "Thalidomide victims born in the early 60s became a lifelong public reminder.",
      "The first lung-cancer warnings on cigarette packs were debated through the decade.",
    ],
    dailyLife: [
      "Expo 67 brought the world to Montreal — 50 million visitors in six months.",
      "The maple-leaf flag was adopted on 15 February 1965, replacing the Red Ensign.",
      "Hockey Night in Canada in colour from 1966; The Forum, Maple Leaf Gardens and the Old Pacific Coliseum were the Saturday cathedrals.",
    ],
    food: [
      "Poutine emerged from Drummondville and other Quebec roadside chip stands in the late 50s and early 60s.",
      "Habitat 67 chefs in Montreal introduced French cuisine to the suburbs.",
      "Tim Hortons opened its first store in Hamilton in 1964.",
    ],
    money: [
      "Average annual wage grew from $5,600 to $9,000 across the decade.",
      "The Trans-Canada Highway opened in 1962.",
      "A new Mustang in 1965 cost about $2,400 in Canada.",
    ],
    bizarre: [
      "Trudeau famously remarked 'the state has no business in the bedrooms of the nation' in 1967.",
      "The Beatles played Maple Leaf Gardens in 1964 — twice in one day.",
    ],
    beautiful: [
      "Centennial Year 1967 was a national love-in: Expo, the train, Bobby Gimby's 'Ca-na-da' song.",
      "Joni Mitchell, Neil Young, Leonard Cohen, Gordon Lightfoot, Robbie Robertson — Canadian songwriters conquered the continent.",
    ],
  },
  {
    country: "CA", decadeStart: 1970,
    government: [
      "Pierre Trudeau ruled almost the entire decade with a brief Joe Clark interlude in 1979.",
      "The October Crisis of 1970 saw the War Measures Act invoked after the FLQ kidnappings.",
      "The Parti Québécois won Quebec in 1976 under René Lévesque.",
    ],
    clothes: [
      "Polyester everything; flared jeans, platform shoes and disco glitter at Toronto's Studio 54-style clubs.",
      "Down vests, lumberjack shirts and Cowichan sweaters defined west-coast cool.",
      "The 'Trudeau scarf' — long, flowing — was imitated by men across the country.",
    ],
    illnesses: [
      "Medicare expanded to cover every province by 1972.",
      "Smoking declined sharply after the Surgeon General-style warnings.",
      "Alcohol drinking ages were lowered to 18 or 19 in most provinces.",
    ],
    dailyLife: [
      "Henderson scored — Paul Henderson's goal won the 1972 Summit Series against the Soviets.",
      "Montreal hosted the 1976 Summer Olympics — over budget, over time.",
      "The CN Tower opened in 1976, the world's tallest free-standing structure for 30 years.",
    ],
    food: [
      "President's Choice and Loblaws began the modern grocery wars in the late 70s.",
      "BeaverTails were invented in Killaloe, Ontario in 1978.",
      "Habitant pea soup and Vachon cakes from Quebec went national.",
    ],
    money: [
      "Average wage hit $14,000 by 1980; inflation around 11% squeezed budgets.",
      "Petro-Canada was created in 1975 as the state oil company.",
      "Mortgage rates approached 20% by the end of the decade.",
    ],
    bizarre: [
      "Terry Fox started his Marathon of Hope in St. John's on 12 April 1980.",
      "The Anik A satellites in 1972 made Canada the first nation with domestic satellite TV.",
    ],
    beautiful: [
      "Wayne Gretzky played his first NHL season with the Edmonton Oilers in 1979-80.",
      "Margaret Atwood's Surfacing and The Handmaid's Tale ideas were brewing; Robertson Davies's Deptford Trilogy was finishing up.",
    ],
  },

  // ───────────────────────────── Mexico ────────────────────────────────
  {
    country: "MX", decadeStart: 1920,
    government: [
      "Álvaro Obregón consolidated the Revolution's gains as president from 1920.",
      "Plutarco Elías Calles ruled from 1924 and ignited the Cristero War in 1926.",
      "Obregón was assassinated in 1928 right after winning a second term.",
    ],
    clothes: [
      "Charro suits, sombreros and china poblana dresses became national symbols.",
      "Urban women in Mexico City adopted Parisian flapper styles.",
      "Indigenous huipiles and rebozos remained everyday wear across the south.",
    ],
    illnesses: [
      "The 1918 flu had killed an estimated 400,000 Mexicans.",
      "Malaria, hookworm and tuberculosis were endemic in the countryside.",
      "Tequila and pulque were doctors' prescriptions for everything from cholera to childbirth.",
    ],
    dailyLife: [
      "Diego Rivera and Orozco painted the new public murals on the walls of the Secretaría de Educación.",
      "Trams clanged through Mexico City; the Zócalo hosted nightly band concerts.",
      "Frida Kahlo was a teenager riding the new buses to school when one of them collided with a tram in 1925.",
    ],
    food: [
      "Tacos al pastor were still decades away; corn tortillas, beans, chile and pulque defined the rural meal.",
      "Cantinas in Mexico City served tequila and botanas while women sat in the women-only side.",
      "Pan dulce filled the panaderías every afternoon.",
    ],
    money: [
      "Average urban wage was around 1.50 pesos a day.",
      "The peso traded at about 2 to the US dollar through most of the decade.",
      "Land redistribution under the new ejido system gave villagers communal title.",
    ],
    bizarre: [
      "The Cristero War (1926-29) saw Catholic peasants fight a war against the secular state across central Mexico.",
      "Pancho Villa was assassinated in his car in Hidalgo del Parral in July 1923.",
    ],
    beautiful: [
      "José Vasconcelos's massive literacy campaign reached the countryside.",
      "Mexican muralism — Rivera, Orozco, Siqueiros — became the world's first state-sponsored modern public art.",
    ],
  },
  {
    country: "MX", decadeStart: 1930,
    government: [
      "Calles ran Mexico from behind the scenes as the Jefe Máximo through the early 30s.",
      "Lázaro Cárdenas took office in 1934 and broke with Calles, redistributing land and nationalising oil in 1938.",
      "The PRM (later PRI) was founded in 1938 and would rule until 2000.",
    ],
    clothes: [
      "Cárdenas wore work shirts and refused to live in Chapultepec Castle.",
      "Frida Kahlo invented her now-iconic Tehuana style of long skirts and braided hair.",
      "Charreada dressage outfits became formal wear for rural elites.",
    ],
    illnesses: [
      "Mass smallpox vaccination drives reached most of the country.",
      "The first national clinics were established by the new Secretariat of Public Assistance.",
      "Malaria remained the great killer of the tropical lowlands.",
    ],
    dailyLife: [
      "Trotsky lived in the Casa Azul in Coyoacán from 1937 until his murder in 1940.",
      "Rivera and Frida moved between Detroit, New York and Mexico City; their San Ángel double-house opened in 1932.",
      "Cantinflas debuted in carpa tent theatres in Tacuba in 1936.",
    ],
    food: [
      "Pulque was at the height of its popularity; pulquerías filled every working-class barrio.",
      "Corn-tortilla mills (molinos de nixtamal) industrialised the staple in the 30s.",
      "Mole poblano, chiles en nogada and pozole anchored the national table.",
    ],
    money: [
      "Cárdenas's oil expropriation in March 1938 created PEMEX and unified the nation.",
      "The peso stabilised around 3.50 to the dollar by decade's end.",
      "Land reform redistributed about 18 million hectares to communal ejidos.",
    ],
    bizarre: [
      "Mexico took in tens of thousands of Spanish Civil War refugees from 1937 onward — the 'Niños de Morelia' alone numbered 456.",
      "Cárdenas hosted Leon Trotsky in 1937 over Stalin's furious protests.",
    ],
    beautiful: [
      "Mexico City became the cultural capital of Latin America, the 'Spanish exile' generation flourishing in publishing and academia.",
      "The Ballet Folklórico de México began assembling its first regional dance repertoire.",
    ],
  },
  {
    country: "MX", decadeStart: 1940,
    government: [
      "Manuel Ávila Camacho (1940-46) and Miguel Alemán (1946-52) led the country into the 'Mexican Miracle'.",
      "The PRI consolidated its one-party hold on every level of government.",
      "Mexico declared war on the Axis in 1942 after German U-boats sank Mexican tankers.",
    ],
    clothes: [
      "Postwar Mexico City women adopted New Look full skirts and tight waists from Paris.",
      "Mariachi charro suits with silver-buttoned trousers became the national costume on screen.",
      "Pachuco zoot-suit style from the US border barrios drew working-class youth.",
    ],
    illnesses: [
      "The new IMSS social-security medical system was founded in 1943.",
      "DDT spraying knocked back malaria across the lowlands by the late 40s.",
      "Infant mortality remained near 100 per 1,000 live births.",
    ],
    dailyLife: [
      "The Bracero Program from 1942 sent millions of Mexican farm workers north to US fields.",
      "The 'Golden Age' of Mexican cinema (Cantinflas, Pedro Infante, María Félix, Jorge Negrete) dominated all of Latin America.",
      "Mexico City's UNAM and the new Ciudad Universitaria were planned through the decade.",
    ],
    food: [
      "Bimbo bread launched in 1945, beginning the country's processed-food revolution.",
      "Coca-Cola became the unofficial second national drink.",
      "Tortillas were still made on the metate at home in most villages.",
    ],
    money: [
      "Industrial output doubled between 1940 and 1950.",
      "The peso was devalued from 4.85 to 8.65 to the dollar in 1948-49.",
      "Average urban wage was around 6 pesos a day at the start of the decade.",
    ],
    bizarre: [
      "Mexican Squadron 201 fought in the Philippines under US command in 1945.",
      "Trotsky was assassinated with an ice axe in his Coyoacán study on 20 August 1940.",
    ],
    beautiful: [
      "Diego Rivera and Frida Kahlo's marriage went through its tempestuous middle years; she kept painting through chronic pain.",
      "Octavio Paz published El Laberinto de la Soledad in 1950, defining modern Mexican thought.",
    ],
  },
  {
    country: "MX", decadeStart: 1950,
    government: [
      "Adolfo Ruiz Cortines (1952-58) gave women the federal vote in 1953.",
      "Adolfo López Mateos (1958-64) nationalised the electric industry in 1960.",
      "The PRI machine ran every state legislature and the federal congress.",
    ],
    clothes: [
      "Hollywood-style glamour for Mexico City women, with mantillas at Mass on Sundays.",
      "Pedro Infante's mariachi charro suit became the male formal outfit on screen and in life.",
      "Rural farmworkers wore white cotton shirts, pants and huaraches.",
    ],
    illnesses: [
      "Polio vaccine drives reached most cities by the late 50s.",
      "Cardiovascular disease replaced tuberculosis as the leading cause of urban death.",
      "ISSSTE was founded in 1959 for government workers' health care.",
    ],
    dailyLife: [
      "Pedro Infante died in a plane crash in 1957 — three days of national mourning followed.",
      "TV broadcasts began with XHTV (1950) and grew into Telesistema Mexicano under Emilio Azcárraga.",
      "Mexico hosted the 1955 Pan American Games at the new University Stadium.",
    ],
    food: [
      "Sanborns 'Casa de los Azulejos' on Madero Street remained Mexico City's most famous café.",
      "Pemex's gas stations brought Coca-Cola, chiclets and chicharrones to every highway.",
      "Cuates and tortas grew in the streets while restaurants in Polanco served Spanish exiles' Catalan dishes.",
    ],
    money: [
      "The peso was devalued again in 1954 from 8.65 to 12.50 to the dollar — and held there until 1976.",
      "Industrial workers in Monterrey earned 2 pesos an hour; campesinos still survived on subsistence.",
      "PEMEX gasoline cost about 0.40 pesos a litre.",
    ],
    bizarre: [
      "Cantinflas became the highest-paid actor in the world in 1956 after Around the World in 80 Days.",
      "Juan Rulfo published Pedro Páramo in 1955 — a 124-page novel that reshaped Spanish-language literature.",
    ],
    beautiful: [
      "Frida Kahlo died in 1954; Diego Rivera in 1957.",
      "Octavio Paz served in the Mexican diplomatic service and kept writing.",
    ],
  },
  {
    country: "MX", decadeStart: 1960,
    government: [
      "Gustavo Díaz Ordaz (1964-70) was responsible for the Tlatelolco massacre of 1968.",
      "Luis Echeverría succeeded him in 1970 and pursued 'shared development'.",
      "The PRI continued to win every presidential election by enormous margins.",
    ],
    clothes: [
      "Miniskirts and beehive hair filled Mexico City clubs by 1965.",
      "Ranchera singers in sequined charro suits filled Plaza Garibaldi.",
      "Indigenous textiles from Oaxaca and Chiapas became fashionable in city boutiques.",
    ],
    illnesses: [
      "Smallpox was officially eliminated by 1951 but vaccination drives continued.",
      "Cardiovascular disease and diabetes climbed with urbanisation.",
      "The new IMSS hospitals trained a generation of doctors.",
    ],
    dailyLife: [
      "Mexico hosted the 1968 Summer Olympics — the first in Latin America.",
      "Mexico hosted the 1970 FIFA World Cup; Pelé led Brazil to a third title at Estadio Azteca.",
      "On 2 October 1968 the army opened fire on student protesters in Tlatelolco, killing hundreds.",
    ],
    food: [
      "Tacos al pastor, perfected by Lebanese immigrants in Puebla, conquered Mexico City lunch carts.",
      "Maggi seasoning became ubiquitous in middle-class kitchens.",
      "The first Sanborns and VIPS chains spread across the country.",
    ],
    money: [
      "GDP grew about 6.7% a year through most of the 1960s — the 'Mexican Miracle' continuing.",
      "The peso held at 12.50 to the dollar through the entire decade.",
      "Volkswagen opened the Puebla plant in 1967.",
    ],
    bizarre: [
      "The 1968 Olympic 'Black Power' salute by Tommie Smith and John Carlos happened on the Mexico City medal podium.",
      "Estadio Azteca, opened 1966, hosted two World Cup finals (1970 and 1986).",
    ],
    beautiful: [
      "Carlos Fuentes published La muerte de Artemio Cruz (1962) and consolidated the Latin American 'Boom'.",
      "Mariachi Vargas de Tecalitlán took the genre worldwide via film and radio.",
    ],
  },
  {
    country: "MX", decadeStart: 1970,
    government: [
      "Luis Echeverría (1970-76) presided over the 'Dirty War' against the left in Guerrero.",
      "José López Portillo (1976-82) rode the oil boom and crashed it with the 1982 default.",
      "The 1976 peso devaluation ended a 22-year fixed parity.",
    ],
    clothes: [
      "Disco glitter and platform shoes filled Mexico City's Plaza Loreto and Insurgentes clubs.",
      "Bell-bottoms, long hair and Indigenous embroidery defined a generation of university students.",
      "Northern Mexican vaquero style — cowboy hats and tooled belts — held strong in Monterrey and Sinaloa.",
    ],
    illnesses: [
      "Family-planning programs expanded sharply under Echeverría; fertility began to fall.",
      "Pollution-related lung disease climbed in Mexico City's basin.",
      "Diabetes overtook stroke as a leading cause of death by the end of the decade.",
    ],
    dailyLife: [
      "Octavio Paz returned from his ambassadorship in India and edited the journal Plural.",
      "Televisa was created by merger in 1973 and ran almost every Spanish-language broadcast in the Americas.",
      "Mexico City hosted the 1970 World Cup final at the Azteca and the 1968 Olympics' lingering venues.",
    ],
    food: [
      "Maíz Industrializado de la Conasupo (Maseca) commercial corn flour rolled out across the country.",
      "Tortas, tacos al pastor, and quesadillas dominated street food.",
      "Coca-Cola became Mexico's largest single soft-drink consumer per capita.",
    ],
    money: [
      "Cantarell oil field came on-stream in 1979 — one of the largest in the world.",
      "The peso went from 12.5 to 22 to the dollar in the 1976 devaluation.",
      "Average urban wage was about 1,200 pesos a month in 1975.",
    ],
    bizarre: [
      "The 'Halcones' paramilitaries massacred student protesters on Corpus Christi 1971 in Mexico City.",
      "Mexico received the second-largest Chilean refugee community after the Allende coup in 1973.",
    ],
    beautiful: [
      "Carlos Fuentes, Octavio Paz, Juan Rulfo, José Emilio Pacheco — Mexican letters were at a peak.",
      "Mexico became the world's leader in oil production for several years on the strength of Cantarell.",
    ],
  },
];

export function decadeFactsFor(country: Country, year: number): CountryDecade | null {
  if (country === "INTL") return null;
  const start = Math.floor(year / 10) * 10;
  return COUNTRY_DECADES.find((d) => d.country === country && d.decadeStart === start) ?? null;
}

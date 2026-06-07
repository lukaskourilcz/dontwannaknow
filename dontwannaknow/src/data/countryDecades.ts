// Per-country, per-decade snapshots. Six categories of texture (government,
// clothes, illnesses, daily life, food, money) plus a couple of "bizarre" and
// "beautiful" entries. Covers Czechoslovakia/Czech Republic, Spain, the US,
// and Ukraine/Ukrainian SSR for the 1920s through the 1970s.
//
// Each entry is one sentence so we can shuffle them freely.

export type Country = "CZ" | "ES" | "US" | "UA" | "CA" | "MX" | "INTL";

export const COUNTRY_LABELS: Record<Country, string> = {
  CZ: "Česko",
  ES: "Španělsko",
  US: "USA",
  UA: "Ukrajina",
  CA: "Kanada",
  MX: "Mexiko",
  INTL: "Kdekoliv (jen globální fakta)",
};

/** Period-correct country name for a given birth year (someone born in 1960
 *  lived in Československu, someone born in 2000 v Česku). */
export function countryLabelFor(country: Country, birthYear: number): string {
  if (country === "CZ") return birthYear < 1993 ? "Československo" : "Česko";
  if (country === "UA") return birthYear < 1991 ? "Sovětská Ukrajina" : "Ukrajina";
  return COUNTRY_LABELS[country];
}

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
      "Československo bylo mladou demokracií v čele s prezidentem-filozofem T. G. Masarykem.",
      "Parlament zasedal v Praze a Alois Rašín navázal korunu na zlato.",
      "Všeobecné volební právo zahrnovalo i ženy — v tehdejší Evropě vzácnost.",
    ],
    clothes: [
      "Ženy ve městech si nechávaly stříhat vlasy na mikádo a nosily flapper šaty se sníženým pasem.",
      "Muži v Praze nosili třídílné obleky s homburgem nebo měkkým plstěným kloboukem.",
      "Na Moravě a Slovensku se vyšívaný kroj stále nosil běžně do kostela.",
      "Baťa ve Zlíně vyráběl dostupné kožené boty, po kterých toužil každý.",
    ],
    illnesses: [
      "Tuberkulóza byla velkým zabijákem; celá sanatoria byla rozeseta po Tatrách i Krkonoších.",
      "Záškrt si stále bral malé děti; na vesnicích bylo antitoxinu málo.",
      "Španělská chřipka právě odezněla a zanechala po sobě celou generaci vdov.",
    ],
    dailyLife: [
      "Pražské kavárny jako Slavia byly plné spisovatelů a novinářů; Kafka byl naživu až do roku 1924.",
      "Václavským náměstím rachotily tramvaje a káva stála pár haléřů.",
      "Nedělní odpoledne znamenala procházku v parku a koncert dechovky.",
    ],
    food: [
      "Neděle znamenala vepřové, knedlíky a zelí — věčné vepřo-knedlo-zelo.",
      "Plzeňský Prazdroj se už vyvážel do celého světa.",
      "V chudších domácnostech byla káva často cikorková směs zvaná cikorka.",
    ],
    money: [
      "Průmyslový dělník v Praze vydělával kolem 250 korun týdně.",
      "Bochník tmavého chleba stál asi 2 koruny.",
      "Pár kožených bot od Bati přišel na 60 korun — pořádný výdaj.",
    ],
    bizarre: [
      "Roboti dostali jméno právě tady — hra Karla Čapka R.U.R. měla premiéru v roce 1921.",
      "Čeští lékaři tehdy vyvíjeli prototyp vůbec první kontaktní čočky na světě.",
    ],
    beautiful: [
      "Československo patřilo k deseti nejprůmyslovějším zemím na světě.",
      "Janáčkovy opery měly premiéry v Brně a putovaly do celého světa.",
    ],
  },
  {
    country: "CZ", decadeStart: 1930,
    government: [
      "Masaryk předal prezidentský úřad Edvardu Benešovi v roce 1935; republika se orientovala na západ, na Francii.",
      "Mnichovská dohoda v roce 1938 přinutila zemi vzdát se Sudet.",
      "Do března 1939 se zbytek Čech a Moravy stal nacistickým protektorátem.",
    ],
    clothes: [
      "Šaty střižené do šíře a liščí kožešiny pro ženy do kina.",
      "Muži kombinovali tvídová saka s pumpkami na výlety za město.",
      "Baťovy továrny vyrobily ročně miliony plátěných letních bot.",
      "Sudetské Němky nosily dirndly; Češky sázely na prostší střihy.",
    ],
    illnesses: [
      "Tuberkulóza i přes nové očkování BCG stále zabíjela tisíce lidí ročně.",
      "Epidemie obrny ochromovaly děti každé léto.",
      "Zápal plic byl vážnou diagnózou — antibiotika ještě neexistovala.",
    ],
    dailyLife: [
      "Z linky v Mladé Boleslavi sjížděla auta Škoda a z Prahy vyjížděly lokomotivy ČKD.",
      "Rádia měly měšťanské domácnosti; celé rodiny se scházely u večerního vysílání.",
      "Pražská Lucerna pořádala každou sobotu swingové taneční večery.",
    ],
    food: [
      "Obložené chlebíčky vymyslel v tomto desetiletí Jan Paukert.",
      "Plzeňské pivovary vařily i během krize — pivo zůstávalo levné.",
      "Sádlo na chlebu s cibulí bylo vesnickou odpolední svačinou.",
    ],
    money: [
      "Hospodářská krize udeřila tvrdě — v roce 1933 byl bez práce skoro milion Čechoslováků.",
      "Měsíční plat pražského úředníka činil kolem 1 200 korun.",
      "Po Mnichovu byla koruna devalvována a začalo se přidělovat na lístky.",
    ],
    bizarre: [
      "Čechoslováci vynalezli kostkový cukr — a padák (Štefan Banič).",
      "Nad Prahou bděla hliníková rozhledna, petřínská „mini-Eiffelovka“.",
    ],
    beautiful: [
      "Architektura a funkcionalismus udělaly z Brna jednu ze světových metropolí designu.",
      "Českoslovenští lyžaři a gymnasté přiváželi z každých her medaile.",
    ],
  },
  {
    country: "CZ", decadeStart: 1940,
    government: [
      "Čechy a Morava byly spravovány jako nacistický protektorát; Reinhard Heydrich byl roku 1942 v Praze zavražděn.",
      "Za odplatu byla v červnu 1942 z mapy vymazána obec Lidice.",
      "Osvobození v roce 1945 přišlo zčásti od Rudé armády, zčásti od Pattonových vojáků.",
      "Komunistická strana převzala plnou moc únorovým převratem roku 1948.",
    ],
    clothes: [
      "Za války se na šaty přidělovaly lístky (Kleiderkarte); lidé párali staré závěsy, aby získali látku.",
      "Z padákového hedvábí si pár šťastlivců po válce ušilo svatební šaty.",
      "Poválečný komunistický styl upřednostňoval prosté vlněné šaty a beztvaré obleky.",
    ],
    illnesses: [
      "Lidé, kteří přežili koncentrační tábory, si domů přinášeli tyfus a nemoci z hladovění.",
      "Penicilin se do pražských nemocnic dostal až úplně na konci války.",
      "Epidemie obrny ochromily až do roku 1948 tisíce českých dětí.",
    ],
    dailyLife: [
      "Zákazy vycházení, zatemnění a gestapo určovaly všední den od roku 1939 do roku 1945.",
      "Po válce byli vysídleni etničtí Němci a celé pohraniční vesnice se vylidnily.",
      "V roce 1948 jste mohli jít do vězení za poslech Rádia Svobodná Evropa.",
    ],
    food: [
      "Válečnou kávovou náhražkou byla pražená cikorka; pravá káva byla luxusem z černého trhu.",
      "V dobách přídělů nahradily moučné knedlíky ty bramborové.",
      "Po válce sytily města zásilky amerického konzervovaného mléka od UNRRA.",
    ],
    money: [
      "Měnová reforma v roce 1953 přes noc smetla úspory v poměru 50 ku 1.",
      "Znárodnění průmyslu zabavilo majitelům továrny bez náhrady.",
      "Dolary na černém trhu se obchodovaly za pětinásobek oficiálního kurzu.",
    ],
    bizarre: [
      "Výsadkáři vycvičení v Británii zabili v Praze třetího nejvýše postaveného nacistu.",
      "„Československý zázrak“ — být na obou frontách — nechal zemi kupodivu nedotčenou.",
    ],
    beautiful: [
      "Osvobození Prahy Rudou armádou v květnu 1945 přineslo květiny a svezení na tancích.",
      "V nově otevřených koncertních sálech zněla Novosvětská symfonie Antonína Dvořáka.",
    ],
  },
  {
    country: "CZ", decadeStart: 1950,
    government: [
      "Stalinistické Československo pořádalo zinscenované procesy — Rudolf Slánský a deset dalších byli v roce 1952 oběšeni.",
      "Prezident Klement Gottwald zemřel devět dní poté, co se zúčastnil Stalinova pohřbu.",
      "Hospodářství plánovala v pětiletkách ministerstva po vzoru Gosplanu.",
    ],
    clothes: [
      "Komunistické továrny chrlily zaměnitelné bavlněné šaty ve třech barvách.",
      "Pionýři nosili do školy rudé šátky.",
      "Pašované džíny ze západního Německa se vyměňovaly za dvoutýdenní plat.",
      "Spartakiádní úbory pro hromadná cvičení — bílé trenýrky a trička — plnily každých pět let stadiony.",
    ],
    illnesses: [
      "Plošné očkování vymýtilo záškrt; epidemie obrny definitivně skončily v roce 1960.",
      "První operace srdce v Brně zachraňovaly životy, které by se před deseti lety ztratily.",
      "Znečištěné ovzduší ze severočeských uhelných elektráren způsobovalo chronická plicní onemocnění.",
    ],
    dailyLife: [
      "Fronty na chleba se tvořily už v 5 ráno; víkendovým snem každé rodiny byla chata.",
      "Prvomájové průvody, závodní sbory a nucené „dobrovolné“ sobotní brigády byly běžné.",
      "Dopisy od příbuzných ze Západu otevírala a četla tajná policie.",
    ],
    food: [
      "Tatranky a Kofola — komunistická Coca-Cola — byly dětskými dobrotami.",
      "Hovězí bylo na příděl; vepřové koleno s hořčicí byla nedělní jistota.",
      "Mléko se ve skleněných lahvích rozváželo už v 6 ráno.",
    ],
    money: [
      "Měsíční mzda dělníka byla kolem 1 400 Kčs; Škoda 1000 MB stála 44 000 Kčs.",
      "Bochník chleba stál 2 Kčs a držel se na té ceně desítky let.",
      "Skutečná nezaměstnanost neexistovala — stejně jako skutečný kariérní postup.",
    ],
    bizarre: [
      "Třicetimetrový kamenný Stalin se tyčil nad Prahou od roku 1955, než byl v roce 1962 odstřelen.",
      "Československo se krátce pokoušelo pěstovat v družstvech bavlnu a pomeranče.",
    ],
    beautiful: [
      "Emil Zátopek vybojoval na olympiádě v Helsinkách v roce 1952 tři zlaté medaile.",
      "Multimediální divadlo Laterna magika debutovalo na Expu 58 v Bruselu.",
    ],
  },
  {
    country: "CZ", decadeStart: 1960,
    government: [
      "Alexander Dubček zahájil „socialismus s lidskou tváří“ — pražské jaro roku 1968.",
      "21. srpna 1968 vjely tanky Varšavské smlouvy a reformy rozdrtily.",
      "Země byla v roce 1960 přejmenována na Československou socialistickou republiku.",
    ],
    clothes: [
      "Minisukně dorazily do Prahy v roce 1966 — butiky na Václavském náměstí prodaly první kusy.",
      "Pašované Levi's se staly nejcennějším majetkem každého českého teenagera.",
      "Za dlouhé vlasy vás na začátku 60. let zmlátila policie, na jejich konci už byly v módě.",
    ],
    illnesses: [
      "Kouření bylo všudypřítomné — kouřilo přes 40 % dospělých Čechů, i těhotné ženy.",
      "Srdeční choroby předstihly tuberkulózu jako nejčastější příčinu úmrtí.",
      "Psychiatrické léčebny se od roku 1968 využívaly k zadržování disidentů.",
    ],
    dailyLife: [
      "Československá nová vlna — Forman, Menzel, Chytilová — získávala Oscary a šokovala diváky.",
      "Jan Palach se v lednu 1969 na Václavském náměstí upálil.",
      "Sobotní dopoledne patřila „dobrovolným brigádám“; neděle chatě.",
    ],
    food: [
      "Pivo bylo i nadále levnější než limonáda, i pro nezletilé.",
      "Bramboráky byly obědem na každém chatovém víkendu.",
      "Dovážené pomeranče z Kuby přišly jednou ročně, před Vánoci.",
    ],
    money: [
      "Průměrná mzda dosáhla kolem 1 500 Kčs měsíčně; Škoda 100 stála 35 000 Kčs.",
      "Dolary na černém trhu se obchodovaly za 30 Kčs oproti oficiálním 14 Kčs.",
      "Víkend v Tatrách v odborářském hotelu stál se vším všudy 80 Kčs.",
    ],
    bizarre: [
      "Měkké kontaktní čočky vynalezl v Praze v roce 1961 Otto Wichterle pomocí stavebnice Merkur.",
      "Češi navrhli a postavili vlastní luxusní vůz Tatra 603 s motorem V8 — jen pro stranické funkcionáře.",
    ],
    beautiful: [
      "Československo získalo na olympiádě v Mexiku v roce 1968 stříbro ve sportovní gymnastice — Věra Čáslavská se stala národní hrdinkou.",
      "Do Prahy se nakrátko vrátilo divadlo Semafor a kabaret ve stylu Voskovce a Wericha.",
    ],
  },
  {
    country: "CZ", decadeStart: 1970,
    government: [
      "Gustáv Husák řídil „normalizaci“ — čistky proti každému, kdo podpořil pražské jaro.",
      "Charta 77, kterou podepsal Václav Havel a 240 dalších, požadovala lidská práva a posílala lidi do vězení.",
      "Každé pracoviště mělo buňku komunistické strany a všude byli udavači (StB).",
    ],
    clothes: [
      "Vládl polyester — nežehlivé košile, kalhoty do zvonu, všechno v hnědé a oranžové.",
      "Prodejny Tuzexu prodávaly západní zboží za zvláštní měnu (bony), kterou jste si museli koupit v bance.",
      "Tepláková souprava Adidas byla naprostým symbolem statusu každého českého teenagera.",
    ],
    illnesses: [
      "Velkými zabijáky se staly choroby srdce a rakovina plic — délka života v Československu zaostala za Západem.",
      "Znečištěné ovzduší v severních Čechách způsobovalo rozsáhlá onemocnění dýchacích cest.",
      "Alkoholismus — vodka, pivo a slivovice — byl národní zdravotní krizí.",
    ],
    dailyLife: [
      "Undergroundová kapela The Plastic People of the Universe byla v roce 1976 souzena a uvězněna.",
      "Soboty se trávily na chatě; neděle znamenaly nacpaný vlak zpátky do Prahy.",
      "Dovolené se trávily v odborářských hotelech v Bulharsku nebo NDR — a jednou za deset let možná v Jugoslávii.",
    ],
    food: [
      "Tatranky a Horalky, Kofola z pípy, kelímky Pribiňáčku.",
      "Banány se v obchodech objevily dvakrát ročně a fronty se táhly přes několik bloků.",
      "Nedělním obědem byla svíčková s houskovými knedlíky, každý jednotlivý týden.",
    ],
    money: [
      "Průměrná mzda byla kolem 2 400 Kčs měsíčně; Škoda 105 stála 60 000 Kčs a měla pětiletou čekací dobu.",
      "Nový byt (panelák) přiděloval stát — žádné kupování, žádné vybírání.",
      "Důchody činily 1 000–1 500 Kčs měsíčně a lidé z nich žili.",
    ],
    bizarre: [
      "Českoslovenští fanoušci rocku museli poslouchat západní hudbu na Rádiu Luxembourg pod dekou.",
      "Dětský televizní pořad Večerníček začal v roce 1965 a vysílá se dodnes každý večer.",
    ],
    beautiful: [
      "Československo vyhrálo mistrovství světa v ledním hokeji v letech 1972, 1976 a 1977 — a porazilo SSSR.",
      "Olga Havlová vedla samizdatové kruhy, které udržovaly českou literaturu naživu v ilegalitě.",
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
      "Po krvavé občanské válce byla Ukrajina v prosinci 1922 začleněna do nově vzniklého SSSR.",
      "Začátek 20. let přinesl NEP (Novou ekonomickou politiku) — krátké uvolnění trhu, sedláci si směli ponechat obilí.",
      "Politika korenizace nakrátko podporovala ukrajinský jazyk a kulturu ve školách.",
    ],
    clothes: [
      "Vyšívané košile (vyšyvanky) byly na vesnicích každodenním lidovým oděvem.",
      "Dělnice ve městech nosily prosté bavlněné halenky a skládané sukně.",
      "Na zimu kožichy (kožuch) a plstěné boty (valenky).",
      "Vdané ženy nosily všeobecně šátky.",
    ],
    illnesses: [
      "Tyfus a cholera z občanské války zpustošily Kyjev a Charkov.",
      "Hladomor v letech 1921–22 zabil na jihu Ukrajiny statisíce lidí.",
      "Ve městech byla endemická tuberkulóza.",
    ],
    dailyLife: [
      "V Charkově (hlavním městě do roku 1934) a v Kyjevě se otevírala divadla hrající v ukrajinštině.",
      "Spisovatelé jako Mykola Chvyljovyj zahájili „popravenou renesanci“ — většina z nich 30. léta nepřežila.",
      "Elektrifikace dosáhla velkých měst; vesnice stále používaly petrolejové lampy.",
    ],
    food: [
      "Boršč se zakysanou smetanou, salo (naložené vepřové sádlo) na žitném chlebu, vareniky.",
      "V letech hladomoru se chleba přiděloval na lístky.",
      "Vodka a kvas byly každodenními nápoji.",
    ],
    money: [
      "Po reformě a zavedení červonce v roce 1922 se rubl nakrátko stabilizoval.",
      "Sedláci platili daně v podobě obilních kvót, ne penězi.",
      "Dělníci v donbaských dolech vydělávali 30–40 rublů měsíčně.",
    ],
    bizarre: [
      "Hlavním městem sovětské Ukrajiny byl od roku 1919 do roku 1934 Charkov, nikoli Kyjev.",
      "Ukrajinští futurističtí básníci psali v esperantu — a vycházeli tiskem.",
    ],
    beautiful: [
      "Divadlo Berezil pod vedením Lese Kurbase znovuobjevilo ukrajinské drama.",
      "Vzory vyšyvanek se sbíraly v národopisných muzeích a kodifikovaly.",
    ],
  },
  {
    country: "UA", decadeStart: 1930,
    government: [
      "Stalin prosadil násilnou kolektivizaci; miliony sedláků přišly o majetek.",
      "Hladomor (1932–33) — uměle vyvolaný hladomor — zabil odhadem 3–7 milionů Ukrajinců.",
      "Velký teror (1937–38) popravil ukrajinské intelektuály, stranické funkcionáře, spisovatele i kněze.",
    ],
    clothes: [
      "Prošívané kabáty (telogrejka neboli vaťák) pro dělníky a vězně.",
      "Prosté tmavé šaty s bílými límečky pro ženy.",
      "V zimě plstěné boty (valenky); v blátě gumové holínky (kirzy).",
      "Vyšyvanka byla tolerována jako „lidový kroj“, ale jako každodenní oděv se nedoporučovala.",
    ],
    illnesses: [
      "Hladomor způsoboval nemoci z hladu — pelagru, vyhladovění, dystrofii, dětský záškrt.",
      "Tábory gulagu i venkovské vesnice zachvátily epidemie tyfu.",
      "Tuberkulóza si brala ty, koho oslabil hlad.",
    ],
    dailyLife: [
      "Vesničané zakopávali obilí do země, aby ho ukryli před brigádami rekvírujícími obilí.",
      "V desítkách ukrajinských vesnic byl v roce 1933 zdokumentován kanibalismus.",
      "Zinscenované procesy a mizení lidí — každá rodina znala někoho zatčeného.",
    ],
    food: [
      "V roce 1933 vesničané vařili polévku z kůry, plevele a kožených opasků.",
      "Ve městech přídělové lístky na chleba — ale Ukrajina, obilnice, žádný chleba neměla.",
      "Salo a nakládaná zelenina ukrytá ve sklepích zachránily rodiny přes zimu.",
    ],
    money: [
      "Pracovníci kolchozů byli placeni v trudodních (pracovních dnech), za které často nešlo dostat nic.",
      "Dělníci ve městech vydělávali 100–150 rublů měsíčně.",
      "Bochník chleba z černého trhu stál v roce 1933 dělníkovu denní mzdu.",
    ],
    bizarre: [
      "Ukrajinština byla až do roku 1938 oficiálním jazykem správy — i když její spisovatele zrovna stříleli.",
      "Walter Duranty z New York Times hladomor popíral a získal Pulitzerovu cenu.",
    ],
    beautiful: [
      "Ukrajinští básníci jako Pavlo Tyčyna psali verše, které přežily v samizdatu desítky let.",
      "Ve 30. letech vznikly ukrajinské fotbalové kluby — mezi nimi Dynamo Kyjev.",
    ],
  },
  {
    country: "UA", decadeStart: 1940,
    government: [
      "Nacistické Německo zaútočilo v červnu 1941; Ukrajina byla okupována od roku 1941 do roku 1944.",
      "Masakr v Babím Jaru — 33 771 Židů zavražděných za 36 hodin v září 1941 v Kyjevě.",
      "Do roku 1944 sovětské znovudobytí; následovaly hromadné deportace krymských Tatarů a dalších.",
    ],
    clothes: [
      "Za války: armádní přebytky, prošívané kabáty, cokoli, co se dalo zalátat.",
      "Vesnické ženy nosily i po válce dlouhé tmavé sukně a šátky.",
      "Sovětské šaty z umělého hedvábí nahradily lněnou vyšyvanku jako každodenní oděv.",
    ],
    illnesses: [
      "Válečný tyfus, úplavice, sněť z omrzlin — znala je každá ukrajinská rodina.",
      "Po válce vzrostla tuberkulóza mezi navrátivšími se vojáky a uprchlíky.",
      "Hladomor v letech 1946–47 zabil na jihovýchodě další milion lidí.",
    ],
    dailyLife: [
      "Kyjev byl do roku 1944 z 85 % zničený; Chreščatyk se musel postavit z trosek znovu.",
      "Partyzáni (UPA na západní Ukrajině) bojovali se Sověty až do počátku 50. let.",
      "Standardním způsobem městského bydlení se staly komunální byty (komunálky).",
    ],
    food: [
      "Přidělování na lístky trvalo až do roku 1947.",
      "Salo na žitném chlebu a řepný boršč zůstaly základem vesnických jídel.",
      "Fronty na chleba trvaly hodiny ještě roky po skončení války.",
    ],
    money: [
      "Měnová reforma v roce 1947 smetla úspory v poměru 10:1.",
      "Sedláci v kolchozech stále vydělávali v trudodních, vyplácených v obilí po žních.",
      "Vojenské penze a podpory válečným vdovám byly pro miliony lidí jedinou stálou hotovostí.",
    ],
    bizarre: [
      "Stoupenci Stepana Bandery bojovali proti nacistům, pak proti Sovětům, až do 50. let.",
      "Rudá armáda překročila v říjnu 1943 pod palbou Dněpr — bitva o rozsahu Stalingradu.",
    ],
    beautiful: [
      "Olha Kobyljanská a další spisovatelky byly v poválečných letech znovu objeveny.",
      "Kyjevský Chreščatyk se znovu otevřel v roce 1949 — široké bulváry a pastelové fasády.",
    ],
  },
  {
    country: "UA", decadeStart: 1950,
    government: [
      "Nikita Chruščov — který byl ve 30. a 40. letech ukrajinským stranickým bossem — stál v čele SSSR.",
      "Krym byl v roce 1954 převeden z Ruské SFSR do Ukrajinské SSR.",
      "Chruščovův „tajný projev“ z roku 1956 odsoudil Stalina a přinesl krátké uvolnění.",
    ],
    clothes: [
      "Bavlněné šaty s květinovými vzory, šátky, podkolenky — vzhled sovětské hospodyně.",
      "Chlapci ve školních uniformách s rudými pionýrskými šátky.",
      "V kolchozech prošívané kabáty a gumové holínky.",
    ],
    illnesses: [
      "Hromadné očkovací kampaně do roku 1960 ukončily na Ukrajině záškrt, obrnu a neštovice.",
      "Na venkově západní Ukrajiny byla stále běžná tuberkulóza.",
      "Průmyslové znečištění v Donbasu začalo způsobovat chronická onemocnění dýchacích cest.",
    ],
    dailyLife: [
      "Chruščovky — pětipatrové panelové domy — od roku 1956 rostly všude.",
      "Společné kuchyně byly stále standardem; vlastní koupelna byla luxusem.",
      "Černobílá televize dorazila do bytů na konci 50. let.",
    ],
    food: [
      "Boršč, kaše, salo, vareniky — beze změny.",
      "Zmrzlina (moroženoje) byla sovětským úspěchem — 10 kopějek za vanilkový kelímek.",
      "V létě stánky s kvasem na každém rohu.",
    ],
    money: [
      "Měnová reforma z roku 1961 vyměnila 10 starých rublů za 1 nový — ale reálné ceny zůstaly stejné.",
      "Průměrný dělník vydělával 80–100 rublů měsíčně.",
      "Bochník chleba stál 16 kopějek a tak to zůstalo 30 let.",
    ],
    bizarre: [
      "Chruščovův zeť šéfoval redakci Pravdy; nepotismus byl skutečný, jen se tak neříkal.",
      "Jaderná havárie v Kyštymu z roku 1957 byla po desetiletí utajována — stejně jako ty pozdější.",
    ],
    beautiful: [
      "Dynamo Kyjev zahájilo svou desítky let trvající éru sovětských fotbalových mistrů.",
      "Vynořil se ukrajinský básník Vasyl Symonenko a generace „šedesátníků“.",
    ],
  },
  {
    country: "UA", decadeStart: 1960,
    government: [
      "Leonid Brežněv — narozený v Kamjanském na Ukrajině — se stal v roce 1964 sovětským vůdcem.",
      "Zesílila politika rusifikace — ukrajinské školy přecházely na ruštinu.",
      "První procesy s ukrajinskými disidenty z řad intelektuálů se konaly v letech 1965–66.",
    ],
    clothes: [
      "Sovětské minisukně dorazily pozdě, až v roce 1968, a jen do měst.",
      "Chlapci nosili školní uniformu s mosaznými knoflíky a brigadýrku.",
      "Vyšívaná vyšyvanka zažila lidové oživení mezi mládeží „šedesátníků“.",
    ],
    illnesses: [
      "Sovětské zdravotnictví zaručovalo každému lékaře; lékaři brali 70 rublů měsíčně.",
      "Kouření — papirosy Bělomorkanal — bylo všudypřítomné.",
      "Tuberkulóza konečně ustupovala; nemoci spojené s alkoholem přibývaly.",
    ],
    dailyLife: [
      "„Chruščovovo tání“ povolilo na deset let knihy v ukrajinštině — za Brežněva byly opět zakázány.",
      "Dněperská vodní elektrárna byla obnovena a Ukrajina vyráběla elektřinu pro polovinu SSSR.",
      "Pionýrské letní tábory v Karpatech a na Krymu.",
    ],
    food: [
      "Sovětské kuchařky propagovaly stejných pár tuctů jídel ve všech 15 republikách.",
      "Uzeniny byly nedostatkové — Ukrajinci jezdili vlakem do Moskvy, aby je sehnali.",
      "Krymská vína a sovětské šampaňské na zvláštní příležitosti.",
    ],
    money: [
      "Průměrný dělník vydělával kolem 120 rublů měsíčně.",
      "Vůz „Volha“ GAZ-21 stál 5 500 rublů — pět let úspor.",
      "Byt přiděloval stát; nemohli jste ho koupit ani prodat.",
    ],
    bizarre: [
      "Antonov An-22, tehdy největší letadlo na světě, byl postaven v Kyjevě v roce 1965.",
      "Ukrajinský disident Vjačeslav Čornovil sestavil první samizdatový „Ukrajinský věstník“.",
    ],
    beautiful: [
      "Snímek Serhije Paradžanova „Stíny zapomenutých předků“ (1965) se stal milníkem světové kinematografie.",
      "Borys Olijnyk a Lina Kostenková oživili ukrajinskou poezii.",
    ],
  },
  {
    country: "UA", decadeStart: 1970,
    government: [
      "Volodymyr Ščerbyckyj řídil Ukrajinskou SSR od roku 1972 — ryzí Brežněvův věrný.",
      "Ukrajinská helsinská skupina byla založena v roce 1976 — každý její člen byl nakonec uvězněn.",
      "Rusifikace se prohlubovala; škol s výukou v ukrajinštině ubývalo.",
    ],
    clothes: [
      "Všechno z polyesteru, hnědá a oranžová, od poloviny desetiletí kalhoty do zvonu.",
      "Tepláky Adidas, když jste je sehnali, byly symbolem statusu.",
      "Sovětské džíny (Tver) se snažily kopírovat Levi's a nikdy se jim to úplně nepodařilo.",
    ],
    illnesses: [
      "Alkoholismus byl národní zdravotní krizí — průměrná délka života mužů klesla.",
      "Průmyslové nehody v donbaských dolech tisk nikdy neuvedl.",
      "Sovětské zdravotnictví bylo zdarma, ale lékařům jste dávali spropitné koňakem a čokoládou.",
    ],
    dailyLife: [
      "Dvoutýdenní letní dovolené v krymských sanatoriích, placené odbory.",
      "Prázdné regály v obchodech; všechno dobré se sehnalo přes blat (známosti).",
      "Černý trh se západními džínami, deskami a knihami byl v Kyjevě a Oděse obrovský.",
    ],
    food: [
      "Sovětské obchody měly chleba, vodku a rybí konzervy; všeho ostatního byl nedostatek.",
      "Babušky vedly „družstevní“ hospodářství a přebytky prodávaly na kolchozním trhu.",
      "Káva byla luxusem; národním nápojem byl čaj s citronem.",
    ],
    money: [
      "Průměrná mzda byla v roce 1975 kolem 150 rublů měsíčně.",
      "Lada VAZ-2101 stála 5 500 rublů a měla šestiletou čekací dobu.",
      "Pár Levi's z černého trhu stál celý měsíční plat.",
    ],
    bizarre: [
      "Antonov An-225 — největší letadlo, jaké kdy bylo postaveno — bylo v této době navrženo v Kyjevě (postaveno v roce 1988).",
      "Ukrajinští disidenti v gulagu psali básně na kostky mýdla.",
    ],
    beautiful: [
      "Dynamo Kyjev vyhrálo v roce 1975 Pohár vítězů pohárů — první sovětský klub, který získal evropskou trofej.",
      "Ukrajinská zpěvačka Sofija Rotaru se stala jednou z největších hvězd sovětského bloku.",
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

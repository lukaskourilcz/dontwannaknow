// Per-country, per-decade media texture: what people most commonly read
// (newspapers, magazines, popular books) and watched (TV channels and famous
// programmes; for the pre-television decades, radio and cinema). Czech-first,
// one full sentence per item so they can be shuffled freely. Covers Czechia/
// Czechoslovakia and Ukraine/Soviet Ukraine, 1940s through the 2020s.

import type { Country } from "./countryDecades";

export type CountryMedia = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  read: string[];   // newspapers, magazines, popular books
  watch: string[];  // TV channels and programmes (radio/cinema before TV)
};

export const COUNTRY_MEDIA: CountryMedia[] = [
  // ── Česko / Československo ──────────────────────────────────────────
{ country: "CZ", decadeStart: 1940, read: [
      "Za Protektorátu Čechy a Morava procházel veškerý tisk přísnou německou cenzurou a sloužil hlavně jako nástroj propagandy, přičemž do roku 1940 zůstalo z předválečné nabídky zachováno už jen kolem tří desítek deníků.",
      "K nejrozšířenějším novinám patřily list Národní politika přezdívaný „čubička“, bulvární Polední list či A-Zet a oficiózní České slovo, zatímco po osvobození roku 1945 vznikly nové tituly jako Mladá fronta a Svobodné slovo.",
      "Z časopisů si lidé kupovali rodinné a obrázkové týdeníky jako Pestrý týden, List paní a dívek nebo Hvězdu, které nabízely únik od válečné reality k románům na pokračování a módě.",
      "Z knih se hojně četl humor Jaroslava Haška a jeho Osudy dobrého vojáka Švejka, dobrodružství Jaroslava Foglara (Hoši od Bobří řeky, Rychlé šípy) i klasická Babička Boženy Němcové, k níž se lidé utíkali jako k symbolu češství.",
    ], watch: [
      "Televize ve čtyřicátých letech ještě neexistovala, a tak hlavním zdrojem zpráv i zábavy byl Český rozhlas, jehož vysílání ovšem nacisté přísně kontrolovali a zneužívali k hlášení a propagandě.",
      "Velkou roli hrálo kino, kam diváci chodili na české veselohry a melodramata a kde každé představení uváděl povinný filmový týdeník Aktualita přinášející sestříhané, propagandisticky laděné zpravodajství.",
      "Veškerou filmovou výrobu Němci soustředili do dvou firem, Lucernafilmu a Nationalfilmu, a v ateliérech na Barrandově vznikaly i prestižní snímky pod přísným dohledem okupační správy.",
    ] },
  { country: "CZ", decadeStart: 1950, read: [
      "Po komunistickém převratu roku 1948 ovládl tisk jediný povolený výklad světa a nejčtenějším a nejmocnějším deníkem se stalo stranické Rudé právo, doplněné o Mladou frontu (1945) pro mládež, odborářskou Práci a Svobodné slovo.",
      "Mezi oblíbené časopisy patřil satirický týdeník Dikobraz (1945), ženský list Vlasta (1947) a obrázkové Květy, zatímco nejmenším dětem byla od roku 1945 určena Mateřídouška.",
      "V literatuře vládl direktivně nařízený socialistický realismus s budovatelskými romány oslavujícími dělníky a stranu, jak je psali například Marie Pujmanová či Václav Řezáč.",
      "Vedle povinné ideologické tvorby se lidé utíkali ke klasikům a ke knihám pro mládež, ovšem dílo Jaroslava Foglara bylo režimem zakázáno a kolovalo jen mezi pamětníky a v opisech.",
      "Velkou událostí desetiletí bylo spuštění Československé televize, která zahájila zkušební vysílání 1. května 1953 z pražského studia v Měšťanské besedě a postupně se z luxusu stávala běžnou součástí domácností.",
    ], watch: [
      "Padesátá léta jsou počátkem televizní éry, ale po většinu desetiletí zůstával nejdůležitějším médiem rozhlas, který přinášel zprávy, rozhlasové hry, estrády i přímé přenosy a byl plně podřízen stranickému vedení.",
      "Lidé i nadále houfně chodili do kina, kde se před hlavním filmem promítal Československý filmový týdeník a kde vedle ideologických snímků bodovaly i pohádky a komedie.",
      "Televizní vysílání Československé televize bylo zpočátku jen několikahodinové a černobílé, dostupné menšině diváků, a teprve postupně začalo nabízet pravidelné zpravodajství a první zábavné pořady.",
    ] },
  { country: "CZ", decadeStart: 1960, read: [
      "Šedesátá léta přinesla v rámci uvolnění politických poměrů rozkvět kultury a do popředí se dostaly literární časopisy jako Literární noviny, Host do domu, Tvář a Světová literatura, které otevíraly okno do světa.",
      "Pro mladé se kultovním týdeníkem stal Mladý svět (1959) a obrovskou popularitu měl populárně-naučný časopis ABC mladých techniků a přírodovědců (1957) se svými vystřihovánkami.",
      "Komiksová klasika se zrodila 15. května 1969, kdy v nakladatelství Orbis vyšlo první číslo Čtyřlístku autorů Jaroslava Němečka a Ljuby Štíplové, jež se brzy stalo nedostatkovým zbožím.",
      "V literatuře nastoupila silná generace prozaiků a do dějin vstoupili Bohumil Hrabal, Milan Kundera i Josef Škvorecký, jejichž knihy konečně mohly vyjít a slavily úspěch u čtenářů.",
    ], watch: [
      "Televize se v šedesátých letech stala masovým médiem v každé domácnosti a roku 1965 začal vysílat Večerníček, jehož znělka patří k nejstarším televizním znělkám v Evropě a uspává děti dodnes.",
      "Na obrazovkách se objevovaly živé estrády, zábavné pořady, divadelní inscenace a první populární seriály a televize těžila z uvolněné atmosféry takzvané zlaté éry.",
      "Diváci stále milovali i kino, kde tehdy vznikala oceňovaná díla československé nové vlny režisérů jako Miloš Forman nebo Věra Chytilová.",
    ] },
  { country: "CZ", decadeStart: 1970, read: [
      "Po srpnu 1968 a nástupu normalizace se tisk opět sevřel pod stranickou kontrolu a vůdčím deníkem zůstávalo Rudé právo, zatímco lidé četli i Mladou frontu, Svobodné slovo a sportovní Stadión.",
      "Mezi nejoblíbenější časopisy patřily Vlasta pro ženy, satirický Dikobraz a pro děti Mateřídouška, Sluníčko, Ohníček a stále nedostatkový komiksový Čtyřlístek.",
      "Oficiální literatura byla prošpikována ideologií, a tak skutečnou hodnotu nesly knihy kolující v zakázaném samizdatu, především v Edici Petlice (1972–1989) Ludvíka Vaculíka, jež vydala přes čtyři sta svazků.",
      "Doma i v exilu psali zakázaní autoři jako Bohumil Hrabal, Milan Kundera, Josef Škvorecký či Václav Havel, jejichž díla se k běžnému čtenáři dostávala jen v opisech nebo z propašovaných výtisků.",
    ], watch: [
      "Televize se stala hlavní zábavou národa a normalizační režim do ní vkládal propagandu prostřednictvím seriálů, z nichž největší slávu sklidila Nemocnice na kraji města (1977) z pera Jaroslava Dietla.",
      "Milionové sledovanosti dosáhla i Žena za pultem, jejíž první díl se vysílal 10. prosince 1977 s Jiřinou Švorcovou v hlavní roli, a propagandistický kriminální seriál Třicet případů majora Zemana.",
      "Technickým mezníkem bylo zavedení druhého programu a barevného vysílání mezi roky 1970 a 1973, díky čemuž mohli diváci poprvé sledovat sport i estrády v barvě.",
    ] },
  { country: "CZ", decadeStart: 1980, read: [
      "Osmdesátá léta byla obdobím pozdní normalizace a tisku stále dominovalo stranické Rudé právo, vedle nějž si lidé kupovali Mladou frontu, Svobodné slovo a sportovní Stadión.",
      "Kultovní zůstával týdeník Mladý svět a populárně-naučné ABC, zatímco děti hltaly časopisy Sluníčko, Ohníček, Mateřídoušku a komiks Čtyřlístek, na nějž se v trafikách stály fronty.",
      "Pod povrchem oficiální kultury kvetl samizdat a Edice Petlice i Expedice dál šířily zakázané texty disidentů, které kolovaly z ruky do ruky přepisované na psacích strojích.",
      "Vedle ideologicky prověřené produkce se četli klasici a oblíbená dobrodružná i detektivní literatura, přičemž skutečné novinky západního světa zůstávaly pro většinu nedostupné.",
    ], watch: [
      "Televize byla centrem rodinného života a vedle zpravodajství plného ideologie nabízela populární seriály, zábavné pořady a nedělní dětský magazín Studio Kamarád, který bavil celé generace dětí.",
      "Diváci milovali televizní pohádky, silvestrovské estrády a inscenace a stále jim každý večer před spaním běžel Večerníček s oblíbenými postavičkami jako Krteček nebo Bob a Bobek.",
      "Koncem desetiletí pronikaly do domácností první videorekordéry a s nimi i kopie zahraničních filmů, což začínalo nahlodávat dosavadní monopol dvou televizních programů.",
    ] },
  { country: "CZ", decadeStart: 1990, read: [
      "Sametová revoluce přinesla svobodu tisku a nebývalý boom titulů, přičemž z Mladé fronty vznikla nezávislá Mladá fronta DNES (1990) a velkou popularitu získal společenský týdeník Reflex (1990).",
      "Trh ovládl bulvár, který od roku 1992 reprezentoval barevný deník Blesk, a na pultech se objevily nové lifestylové a ženské magazíny jako Cosmopolitan i Story.",
      "Mladí lidé hltali plakáty a klepy z hudebního časopisu Bravo, zatímco se konečně směly volně vydávat dříve zakázané knihy a vrátil se i kult Jaroslava Foglara.",
      "Knihkupectví zaplavily překladové bestsellery západních autorů a do té doby nedostupná díla, takže si čtenáři doháněli, co jim komunistický režim po desetiletí upíral.",
    ], watch: [
      "Devadesátá léta zlomila monopol státní televize, která se rozdělila na veřejnoprávní ČT1 a ČT2, a vstoupila do éry komerční konkurence a barevné zábavy.",
      "Roku 1993 začala vysílat soukromá Prima a v roce 1994 přibyla TV Nova, jež se svým americkým stylem a tvářemi jako Vladimír Železný okamžitě stala nejsledovanější stanicí v zemi.",
      "Diváci se bavili u zahraničních seriálů, telenovel a soutěží, na obrazovky se vrátily i dříve zakázané filmy a komerční stanice nasadily laťku populární zábavy velmi vysoko.",
    ] },
  { country: "CZ", decadeStart: 2000, read: [
      "V novém tisíciletí zůstal nejprodávanějším a nejčtenějším deníkem bulvární Blesk, který od roku 2002 vedl žebříčky čtenosti, následovaný seriózněji laděnou Mladou frontou DNES a Právem.",
      "Lidé hojně kupovali společenské a celebritní časopisy jako Story a řadu ženských a lifestylových magazínů, zatímco klasické zpravodajské tituly začaly cítit první tlak internetu.",
      "Mezi knižními trháky vládla zahraniční fantasy a thrillery, fenoménem se stal Harry Potter i Pán prstenů a sílila obliba českých autorů detektivek a humoristické literatury.",
      "Stále důležitější roli získávaly internetové zpravodajské servery jako Seznam, iDNES či Novinky, které postupně přebíraly část čtenářů tradičního tisku.",
    ], watch: [
      "Televizní zábavě nadále dominovala komerční TV Nova spolu s Primou a veřejnoprávní ČT a celou dekádu odstartoval boom reality show.",
      "Národ rozdělila souběžně vysílaná klání Big Brother a VyVolení v roce 2005, která přilepila diváky k obrazovkám a plnila stránky bulváru.",
      "Velkou popularitu si získaly i domácí nekonečné seriály, především Ordinace v růžové zahradě uváděná od roku 2005, na niž se pravidelně dívaly miliony lidí.",
    ] },
  { country: "CZ", decadeStart: 2010, read: [
      "V desátých letech zrychlil úpadek tištěných novin a čtenáři se přesouvali na internet a sociální sítě, byť nejprodávanějším deníkem stále zůstával bulvární Blesk před Mladou frontou DNES a regionálním Deníkem.",
      "Lidé četli zprávy hlavně na mobilech přes servery Seznam Zprávy, iDNES.cz nebo Novinky.cz a část publika začala informace čerpat především z Facebooku, což zvyšovalo i šíření dezinformací.",
      "Klasické časopisy slábly, ale dál vycházely lifestylové a celebritní tituly, zatímco knižnímu trhu vévodily zahraniční bestsellery i sílící vlna českých detektivek a thrillerů.",
      "Velkým fenoménem se stala audiokniha a elektronické čtečky, díky nimž si lidé oblíbili nový způsob, jak knihy konzumovat za jízdy i při práci.",
    ], watch: [
      "Televizní trh i nadále ovládala nejsledovanější TV Nova spolu s Primou a veřejnoprávní Českou televizí, k tradičnímu vysílání se však začal přidávat fenomén streamování.",
      "Roku 2016 vstoupil do Česka Netflix a spolu s HBO přinesl divákům knihovny seriálů na vyžádání, čímž odstartoval postupný odklon od pevného televizního programu.",
      "Domácí seriálovou tvorbu pozvedla na světovou úroveň zejména HBO se svou oceňovanou minisérií Pustina (2016), kterou kritici označili za jeden z nejlepších českých seriálů vůbec.",
    ] },
  { country: "CZ", decadeStart: 2020, read: [
      "Ve dvacátých letech pokračoval propad nákladů tištěných novin a hlavním zdrojem zpráv se staly internetové servery a sociální sítě, přičemž z papírových deníků si vedení i přes klesající prodeje držel bulvární Blesk.",
      "Většina lidí čte zprávy zdarma na mobilu přes Seznam Zprávy, iDNES.cz či Novinky.cz, zatímco roste obliba placených zpravodajských webů a podcastů jako alternativy k bulváru a dezinformacím.",
      "Knižnímu trhu vládnou domácí i překladové detektivky, fantasy a populárně-naučné tituly a obrovský boom zažívají audioknihy, jež si lidé pouštějí přes streamovací aplikace.",
      "Sociální sítě jako Instagram, TikTok a YouTube se staly samostatným médiem, v němž čeští influenceři a tvůrci konkurují klasickým časopisům o pozornost mladé generace.",
    ], watch: [
      "Klasické televizní vysílání TV Nova, Primy a České televize sice stále sleduje velká část diváků, ale o jejich čas se čím dál víc dělí streamovací služby s vlastní původní tvorbou.",
      "Trh ovládla čtveřice platforem Netflix, HBO Max (od roku 2022), domácí Voyo a Disney+, díky nimž lidé sledují seriály a filmy kdykoli a kdekoli na vyžádání.",
      "Tvůrčí žezlo v původních českých seriálech převzala zejména Voyo s úspěšnými tituly jako Iveta nebo Případ Roubal, zatímco HBO svou výrobu místních seriálů utlumilo.",
    ] },

  // ── Ukrajina / sovětská Ukrajina ────────────────────────────────────
{ country: "UA", decadeStart: 1940, read: [
      "Nejrozšířenějšími novinami sovětské Ukrajiny byly stranické deníky Pravda Ukrajiny (Правда України) a Radjanska Ukrajina (Радянська Україна, od roku 1943), které byly hlásnou troubou Komunistické strany Ukrajiny a šířily válečnou a poté poválečnou stalinskou propagandu.",
      "Mimořádně oblíbený byl satirický týdeník Perec (Перець), založený roku 1941, který během války vycházel až do roku 1942 v Moskvě a teprve poté se vrátil do Kyjeva.",
      "Národní klasikou, již lidé znali z domova i ze školy, zůstával Kobzar Tarase Ševčenka, jenž platil za symbol ukrajinského jazyka a identity.",
      "Z dobové prózy vynikl válečný román Praporonostci (Прапороносці) Olese Hončara, oceněný Stalinovou cenou roku 1948 a vydávaný v obrovských nákladech jako vzor socialistického realismu.",
      "Pro děti od roku 1945 znovu vycházel ilustrovaný měsíčník Barvinok (Барвінок), zatímco veškerý tisk podléhal přísné cenzuře.",
    ], watch: [
      "Televize v tomto desetiletí ještě neexistovala — hlavními médii zábavy a zpravodajství byly rozhlas a kino.",
      "Z amplionů a domácích přijímačů zněl sovětský rozhlas, který přinášel zprávy z fronty, projevy vůdců, sovětské písně a propagandistické pořady.",
      "Lidé houfně chodili do kina, kde se promítaly válečné kroniky a sovětské filmy; kyjevské filmové studio (pozdější Dovženkovo studio) bylo roku 1941 evakuováno do Taškentu.",
      "Klíčovou osobností ukrajinského filmu byl režisér Oleksandr Dovženko, jehož scénář Ukrajina v plamenech byl však roku 1943 odsouzen jako „buržoazní nacionalismus“.",
    ] },
  { country: "UA", decadeStart: 1950, read: [
      "Dominovaly stranické deníky Pravda Ukrajiny a Radjanska Ukrajina, jejichž náklady šplhaly do statisíců výtisků a které určovaly oficiální obraz světa.",
      "Satirický týdeník Perec se roku 1951 znovu sjednotil do jediné edice a stal se s náklady přesahujícími statisíce kusů jedním z nejčtenějších časopisů republiky.",
      "Roku 1958 byl zásluhou básníka Maksyma Rylského obnoven literární měsíčník Vsesvit (Всесвіт), který Ukrajincům zprostředkovával překlady světové literatury.",
      "Po Stalinově smrti a chruščovovském „tání“ oživil literaturu Dovženkův autobiografický text Začarovaná Desna (1957) a první sbírky mladé básnířky Liny Kostenko (1957, 1958).",
      "Pro nejmladší čtenáře vycházel oblíbený dětský měsíčník Barvinok, od roku 1950 také v ruské mutaci.",
    ], watch: [
      "Televizní vysílání teprve začínalo — 6. listopadu 1951 zahájil provoz kyjevský telecentr, což se dodnes pokládá za den narození ukrajinské televize, přijímačů však bylo zatím poskrovnu.",
      "Naprostá většina lidí proto stále poslouchala rozhlas, kde běžely zprávy, koncerty a pořady jako pionýrský „Pioner Ukrajiny“.",
      "Kino zůstávalo nejmasovější zábavou; po Stalinově smrti se na plátnech objevovaly i lyričtější filmy období „tání“.",
    ] },
  { country: "UA", decadeStart: 1960, read: [
      "Páteří tisku zůstávaly stranické deníky Pravda Ukrajiny a Radjanska Ukrajina spolu s komsomolskou Molodí Ukrajiny (Молодь України), kterou četla studující mládež.",
      "Satirický Perec dál vycházel v statisícových nákladech a literární scéně vévodily měsíčníky Vsesvit, Dnipro (Дніпро) a Vitčyzna (Вітчизна).",
      "Šedesátá léta patřila generaci „šistdesjatnyků“ — Lině Kostenko, Ivanu Dračovi, Vasylu Stusovi a dalším, kteří obnovovali ukrajinské básnictví navzdory cenzuře.",
      "Velký ohlas i potíže s režimem vyvolal roku 1968 román Olese Hončara Sobor (Собор), jenž byl brzy fakticky zakázán; mezi dětmi byly populární knihy Vsevoloda Nestajka.",
      "Pro nejmenší začal roku 1960 vycházet barevný měsíčník Maljatko (Малятко), doplněný oblíbeným Barvinkem a pionýrskou Pionerií.",
    ], watch: [
      "Dne 20. ledna 1965 začal pravidelně vysílat první celostátní kanál Ukrajinská televize UT-1 (dnešní Peršyj), čímž se televize stala masovým médiem.",
      "Vedle ukrajinského programu sledovali diváci sovětskou Centrální televizi z Moskvy a od roku 1968 její hlavní zpravodajskou relaci Vremja (Время).",
      "Mimořádnou oblibu si získala satirická soutěž důvtipu KVN (КВН, od roku 1961) a hudebně-zábavné pořady jako novoroční „Goluboj ogoňok“.",
    ] },
  { country: "UA", decadeStart: 1970, read: [
      "Tiskovému trhu nadále vládly stranické deníky Pravda Ukrajiny (s nákladem přes půl milionu výtisků) a Radjanska Ukrajina, doplněné komsomolskou Molodí Ukrajiny.",
      "Satirický Perec dosáhl na konci desetiletí astronomického nákladu kolem 3,3 milionu výtisků a patřil k nejčtenějším titulům vůbec.",
      "Literaturu reprezentovaly měsíčníky Vsesvit, Dnipro a Vitčyzna, oficiálně se však prosazoval hlavně socialistický realismus, zatímco mnozí „šistdesjatnyci“ byli umlčeni.",
      "Knižně se vydávaly klasici jako Ševčenkův Kobzar i prověření sovětští autoři; pro děti zůstávaly oporou časopisy Barvinok a Maljatko.",
    ], watch: [
      "Ukrajinci sledovali republikový kanál UT-1 a od roku 1972 také druhý program UT-2, vedle nichž stála všudypřítomná sovětská Centrální televize.",
      "Hlavním zdrojem zpráv byla moskevská relace Vremja, kterou večer sledovala drtivá většina rodin s televizorem.",
      "Diváckými hity se staly špionážní seriál Sedmnáct zastavení jara (1973), filmový magazín Kinopanorama i zábavné pořady a estrády Centrální televize.",
    ] },
  { country: "UA", decadeStart: 1980, read: [
      "Až do konce sovětské éry vycházely jako hlavní deníky Pravda Ukrajiny, Radjanska Ukrajina a komsomolská Molodí Ukrajiny, jejichž tón v době perestrojky postupně otevřeněji kritizoval poměry.",
      "Hlavními literárními časopisy byly Vitčyzna, Vsesvit, Kyjiv (Київ) a Dnipro, v nichž se začaly objevovat dříve zakázané texty.",
      "Nesmírně populární zůstával satirický týdeník Perec s milionovými náklady a pro děti vycházely Barvinok, Maljatko a pionýrská Pionerija.",
      "S nástupem „glasnosti“ se ke čtenářům vraceli umlčovaní autoři a velké oblibě se těšila poezie Liny Kostenko, zejména její historický román ve verších Maruzja Čuraj.",
    ], watch: [
      "Diváci sledovali ukrajinské kanály UT-1 a UT-2 i sovětskou Centrální televizi s hlavní zpravodajskou relací Vremja.",
      "V roce 1986 se v atmosféře perestrojky vrátila na obrazovky kdysi zakázaná soutěž KVN, která se opět stala televizním fenoménem.",
      "Glasnosť přinesla otevřenější publicistiku a diskusní pořady, jež poprvé nahlas mluvily o dosud tabuizovaných tématech sovětské společnosti.",
    ] },
  { country: "UA", decadeStart: 1990, read: [
      "Po vyhlášení nezávislosti roku 1991 se tisk osvobodil od stranické cenzury a vznikla pestrá škála nových novin a časopisů v ukrajinštině i ruštině.",
      "Literatura přestala podléhat ideologii a hvězdami se staly autoři postmoderní generace, zejména Jurij Andruchovyč a básnické sdružení Bu-Ba-Bu.",
      "Skutečným bestsellerem desetiletí se stal provokativní román Oksany Zabužko Polní výzkum ukrajinského sexu (1996), který se držel na špici žebříčků prodejnosti.",
      "Vedle nové ukrajinské tvorby a překladů zůstávala čtenářskou jistotou národní klasika v čele s Ševčenkovým Kobzarem.",
    ], watch: [
      "Televizní trh se budoval prakticky od nuly a rychle vznikla síť nových komerčních kanálů — ICTV (1992), Ukrajina (1993), 1+1 (1995), Inter (1996), STB (1997) a Novyj kanal (1998).",
      "Nejsledovanějšími a nejvlivnějšími stanicemi se staly 1+1 a Inter, které ovládli mocní oligarchové a které určovaly veřejné mínění.",
      "Diváci sledovali první vlnu západních filmů, telenovel a zábavných pořadů, jež nahradily někdejší sovětský program.",
    ] },
  { country: "UA", decadeStart: 2000, read: [
      "Klíčovou událostí bylo založení internetového deníku Ukrajinska pravda (Українська правда) 16. dubna 2000 novinářem Heorhijem Gongadzem, jehož vražda otřásla zemí a stala se symbolem boje za svobodu slova.",
      "Internet začal proměňovat čtenářské návyky a zpravodajství se postupně přesouvalo na web, byť tištěné noviny a bulvár stále vycházely ve velkých nákladech.",
      "V literatuře pokračovali úspěšní Jurij Andruchovyč a Oksana Zabužko a sílila moderní ukrajinská próza i populární žánry.",
      "Trh zaplavily lifestylové a společenské časopisy a překlady zahraničních bestsellerů, k nimž patřily i knihy o Harrym Potterovi.",
    ], watch: [
      "Televizi vévodily komerční stanice 1+1, Inter, ICTV, STB a Novyj kanal a roku 2003 přibyl populární kanál Ukrajina.",
      "V roce 2003 vznikl zpravodajský 5 kanal, který sehrál klíčovou roli během oranžové revoluce roku 2004, kdy přinášel necenzurované záběry z Majdanu.",
      "Diváky bavily reality show a talentové soutěže, mezi nimi taneční Tanci z zirkamy (od roku 2006), jehož první řadu vyhrál Volodymyr Zelenskyj.",
      "Velký úspěch slavily komediální produkce studia Kvartal 95, například seriál Svaty (Tchánové).",
    ] },
  { country: "UA", decadeStart: 2010, read: [
      "Lidé stále častěji četli zprávy online — vedle Ukrajinské pravdy rostly weby jako Korespondent či hromadske.ua a stěžejní roli začaly hrát sociální sítě.",
      "Po Euromajdanu (2013–2014) výrazně zesílil zájem o ukrajinštinu, vlastní dějiny a domácí literaturu.",
      "K nejčtenějším autorům patřili Serhij Žadan, Jurij Andruchovyč a Oksana Zabužko, jejíž rozsáhlý román Muzeum opuštěných tajemství získal mezinárodní ohlas.",
      "Tištěná periodika ustupovala internetu, sílila však kvalitní knižní produkce a překladová literatura, podporovaná i knižním veletrhem ve Lvově.",
    ], watch: [
      "Nejsledovanějšími kanály zůstávaly 1+1, Ukrajina, STB, ICTV, Inter a Novyj kanal, jejichž obrazovkám vévodily reality show, telenovely a talentové soutěže jako Holos krajiny.",
      "Skutečným fenoménem se stal satirický seriál Sluha národa (2015) studia Kvartal 95, v němž hrál prezidenta Volodymyr Zelenskyj, jenž se roku 2019 stal skutečnou hlavou státu.",
      "V roce 2017 vznikl z bývalé státní televize veřejnoprávní vysílatel Suspilne (Суспільне), který si postupně získal pověst nejdůvěryhodnějšího zdroje zpráv.",
    ] },
  { country: "UA", decadeStart: 2020, read: [
      "Hlavním zdrojem informací se definitivně stal internet — zpravodajské weby jako Ukrajinska pravda, sociální sítě, YouTube a kanály na Telegramu, jejichž význam po ruské invazi roku 2022 ještě vzrostl.",
      "Válka prudce posílila zájem o ukrajinskou literaturu, paměti a reportáže a do popředí se dostal básník a spisovatel Serhij Žadan.",
      "Mezinárodně rezonovaly i knihy Oksany Zabužko a Andreje Kurkova a stoupala poptávka po knihách v ukrajinštině na úkor ruskojazyčné produkce.",
      "Tištěná média dál slábla, zato sílila audioknižní a digitální čtenářská kultura.",
    ], watch: [
      "Od začátku ruské plné invaze v únoru 2022 spojily hlavní televize své vysílání do společného nepřetržitého zpravodajského maratonu „Jedyni novyny“ (Єдині новини).",
      "Veřejnoprávní Suspilne se stalo jedním z nejdůvěryhodnějších médií, část diváků se však za války obrátila k nezávislým youtuberům a online zpravodajství.",
      "Stále populárnější byly streamovací služby a sledování obsahu na YouTube, zatímco klasické komerční kanály 1+1, Inter či ICTV ztrácely někdejší dominanci.",
    ] },
];

const MIN_DECADE = 1940;
const MAX_DECADE = 2020;

/** Media snapshot for the decade containing `year`, clamped to the covered
 *  range. Returns undefined for countries we don't have media data for. */
export function mediaFor(
  country: Country,
  year: number,
): CountryMedia | undefined {
  if (country === "INTL") return undefined;
  let decade = Math.floor(year / 10) * 10;
  if (decade < MIN_DECADE) decade = MIN_DECADE;
  if (decade > MAX_DECADE) decade = MAX_DECADE;
  return COUNTRY_MEDIA.find(
    (m) => m.country === country && m.decadeStart === decade,
  );
}

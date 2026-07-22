# Tehdejší svět — audit a teze zážitku

Stav auditu: 22. července 2026. Tento dokument je řídicí podklad pro redesign veřejné aplikace, exportů a redakčního rozhraní. Popisuje skutečný stav repozitáře, nikoli zamýšlenou náhradu fungující person-centric implementace.

## Produktové porozumění

Tehdejší svět skládá z ověřených dobových dat soukromý obraz prostředí, ve kterém konkrétní člověk vyrůstal. Člověk je vždy subjektem; rok, město, politický stát, každodennost, kultura, mapa a obloha jsou kontext. Výsledek není životopis a nesmí předstírat znalost osobních vzpomínek, rodinných poměrů ani rutiny.

Primární publikum tvoří česky mluvící lidé, kteří chtějí lépe porozumět rodičům, prarodičům, partnerům, přátelům nebo vlastnímu dětství. Zvlášť důležitá je zkušenost česko-ukrajinských rodin a párů. Hlavní okamžik hodnoty nastává, když zpráva nabídne konkrétní, poctivě formulovanou souvislost, na kterou se uživatel chce blízkého člověka zeptat nebo ji s ním sdílet.

Neměnné hranice produktu:

- veřejné rozhraní pouze česky a ve formálním oslovení „vy“;
- veřejná data pouze pro Česko a Ukrajinu;
- výpočet v prohlížeči, bez účtů, databáze profilů a runtime AI;
- stabilní, na jménu nezávislý seed a deterministické varianty;
- jméno mimo sdílený fragment, dokud ho uživatel výslovně nepovolí;
- žádné domýšlení chybějících období ani osobních prožitků;
- obtížný obsah pouze v oddělené kontextové kapitole a nikdy jako výchozí sdílený detail.

## Inventář a hlavní cesty

Skutečný tok zprávy odpovídá dokumentaci: `normalizePerson` → `resolveHistoricalLocation` → `reportFor` → redakční metadata → `composeChapters` → vykreslení, porovnání a klientské exporty. Veřejná vrstva lazy-loaduje zprávu a vizuální moduly; PDF se načítá až po vyžádání. `/dev` je samostatný lazy-loaded povrch s dev-only zápisem přes Vite middleware a produkčním exportním fallbackem.

Hlavní cesty:

1. Jeden člověk: vztah, volitelné jméno, datum nebo rok, dnešní země a podporované město.
2. Dva lidé: stejný model pro druhého člověka, deduplikované společné souvislosti, žádné soutěžení.
3. Zpráva: obálka, sedm obsahových kapitol, sekundární širší kontext a život v číslech.
4. Uchování: fragmentový odkaz, volitelné zahrnutí jména, tři formáty obrázku a klientské PDF.
5. Redakce: filtry nad zdroji a metadaty, explicitní stav jen pro čtení v produkci.

## Zjištěný designový dluh

- Stávající paleta, lokální písma a jednoduchý T-mark jsou silný základ, ale tokeny pokrývají jen část stavů; chyby, obtížný obsah, informační stavy a fokus používají místy přímé barvy.
- Landing má správné pořadí obsahu, ale chybí mu jeden zapamatovatelný, produktově vlastní archivní motiv a klidná souhrnná věta o rozsahu CZ/UA.
- Formulář používá mnoho kapslí a velkou zaoblenou plochu; vztah je dobře přístupný, ale působí více jako sada filtrů než jako úvod osobní publikace.
- Obálka má vysokou emoční hodnotu a autentickou oblohu, ale rok bez úplného data je jen velký kruh. Chybí ediční číslo, jasnější časový rozsah a typografická vazba věk–místo–období.
- Navigace kapitol je mřížka podobně důležitých tlačítek. Na mobilu zabírá příliš mnoho prostoru a nevyjadřuje pořadí ani stav sbalených kapitol.
- Většina faktů je vykreslena stejnou zaoblenou kartou. Metadata přitom umožňují udržovatelnou variaci podle tónu, citlivosti, místního rozsahu a kapitoly.
- Čtení má příliš pravidelný rytmus „nadpis + mřížka karet“. Nejvyšší hodnotu mají už existující autentické kotvy: vypočtená obloha, mapa, umění, milníky a čísla.
- Sdílení je funkční, ale volby exportu nemají náhled struktury, skupinové popisky ani dost výraznou hierarchii ochrany jména.
- Web, share canvas a PDF sdílejí barvy jen přibližně. Chybí jeden exportní brand kontrakt pro logo, typografické role, mezery a názvy souborů.
- `/dev` má vlastní paralelní tokeny, tmavý režim a zřetelnější stíny než veřejná aplikace. Je použitelný a přístupný, ale potřebuje společnou sémantiku stavů a hustší, méně dekorativní řádky.
- Testy dobře chrání produktovou integritu. Výchozí `npm run check` však na auditním stroji selhal časovým limitem dvou testů; 44 z 46 testů prošlo a nešlo o tvrzení ani funkční regresi. Při redesignu je nutné zkrátit/izolovat UI testy nebo upravit legitimní globální limit bez maskování chyb.

## Co se znovu použije

Zůstávají všechny produktové vrstvy, datové typy a exportní mechanismy. `NewForm`, `Results`, `ChapterFrame`, `ChapterItems`, `SharePanel`, `WorldMap`, `SkyMap`, `ArtStrip`, `LifeGrid`, `LifeNumbers`, `shareImage` a `pdf` se rozšíří nebo refaktorují na místě. Nevznikne paralelní formulářový, kartový, navigační ani reportový systém.

Nové primitivy mají vzniknout pouze tam, kde zpřesňují existující kontrakt: vektorový brand lockup, archivní dekorativní motiv sestavený z CSS/SVG bez tvrzení o historické autenticitě, sémantická podoba reportové položky a společné exportní brand konstanty.

## Designová teze

Tehdejší svět bude působit jako současné osobní vydání sestavené z archivních stop, mapových linií, hvězd, věkových značek a pečlivě editovaného textu. Z rodinného alba přebírá intimitu, nikoli scrapbookovou dekoraci; z časopisu rytmus a hierarchii, nikoli titulní senzaci; z kulturního archivu přesnost popisků, nikoli institucionální chlad.

Výsledný směr je „osobní edice na živém papíře“:

- teplý papír a vyvýšený světlý list bez skleněných efektů;
- hluboká lesní zelená jako inkoust, korálová jako omezená redakční značka;
- Fraunces pro osobní a kapitolové momenty, Newsreader pro čtení, Instrument Sans pro ovládání;
- jemné linky, rejstříkové značky, mapové kontury a souřadnicová mřížka místo stínů a velkých zaoblených karet;
- velké letopočty jen tam, kde nesou význam; kompaktní typografie na mobilu;
- nerovnoměrný rytmus: klidný začátek kapitoly, hutnější kontext, jedna autentická vizuální kotva;
- obtížný obsah v tlumené minerální ploše s textovým označením, bez výstražné dramatizace;
- pohyb pouze jako přechod mezi stavem formuláře, vznikem vydání a otevřením kapitoly.

## Cílený výzkum referencí

Výzkum byl omezen na problémy, které aplikace skutečně řeší. Refero bylo dostupné. Collect UI se nepodařilo načíst přes vyhledávání ani přímé otevření; tato nedostupnost je zaznamenána a žádná reference z něj není domyšlená.

| Zdroj a kategorie | Problém a přenositelný princip | Adaptace pro Tehdejší svět | Co nepřebírat | Přístupnost a responzivita |
| --- | --- | --- | --- | --- |
| Refero, Editorial Website Design Examples | Dlouhý obsah potřebuje střídání hustoty a typograficky řízené tempo místo řady stejných sekcí. | Každá kapitola dostane číslovanou značku, čitelný sloupec a jen jednu výraznou kotvu. | Cizí kompozice, copy ani výraznou mediální identitu. | Nadpisy se zmenší bez ztráty hierarchie; čtenářský sloupec zůstane pod ~70 znaky. |
| Refero, Onboarding Design Prompts | Formulář má směřovat k první hodnotě, mít jasné povinné/volitelné vstupy a obnovovací stavy. | „Vytvořit osobní vydání“ bude jediná primární akce; porovnání zůstane sekundární a vysvětlené. | Umělý vícekrokový wizard nebo nepravdivý progress bar. | Skutečné fieldset/radiogroup, popsané chyby, 44px cíle a jedno sloupcové řazení na mobilu. |
| Refero, Sociotype | Typografie, hairline pravidla a přesné popisky mohou vytvořit archivní charakter bez karet a stínů. | Metadata, roky a popisky převezmou roli rejstříku; text faktu zůstane velký a klidný. | Čistě černobílou identitu, extrémní display velikosti a nečitelný 11px body text. | Malé písmo jen pro metadata; význam nikdy pouze barvou. |
| Refero, Flatfile | Teplá základní plocha + několik blízkých papírových vrstev vytváří hloubku bez elevace. | Papír, zvýšený list, wash a sunk surface budou sémantické tokeny sdílené webem a `/dev`. | SaaS dashboardové bloky a marketingové komponenty. | Povrchy musí držet AA kontrast a nesmějí ztratit hranice při 200% zoomu. |
| Refero, V–A–C / kulturní katalog | Rejstříkové značky a captions proměňují mřížku obsahu v editovaný katalog. | Umění, mapa a zdroje dostanou přesné captions; kapitoly použijí pořadové číslo a letopočty. | Extrémní prázdno, nulovou barvu a navigaci závislou na layoutu. | Katalogové mřížky se skládají do logického DOM pořadí bez horizontálního scrollu. |
| Refero, Nofilter.space | Hairline struktura a textové štítky omezují potřebu plovoucích karet. | Report itemy se stanou řádky/editorial notes s několika významovými variantami. | Brutalistní nulové odsazení, malé ovládání a checkboxy použité jen jako metafora. | Focus, stav a typ položky budou explicitní textem i tvarem. |
| Collect UI, onboarding/form/timeline/share/admin | Plánované kategorie: vztahový výběr, datum a místo, časová osa, porovnání, export, provozní editor. | Nedostupné; rozhodnutí vycházejí z aktuálního produktu a dostupných Refero principů. | Žádné obrazovky ani vzory nejsou citovány nebo kopírovány. | Omezení zdroje bude zachováno v dokumentaci pro pozdější doplnění. |

## Vizuální příležitosti a odložená generativní média

Bezpečné, vysokohodnotné příležitosti jsou: obecná hero kompozice s text-safe zónou, obecná OG kompozice, lehká rodina kapitolových motivů a pozadí sdílených karet. Potenciálně užitečný je pouze krátký hero loop se statickým fallbackem. Zbytečné jsou ilustrace ke každému faktu, městu nebo zemi. Nepřípustné jsou falešné fotografie, dokumenty, mapy, hvězdy, UI, osobní příběhy, válečné obrazy a kulturní stereotypy.

Higgsfield MCP v této relaci není dostupný a práce s ním je podle zadání výslovně odložená. Nebudou vytvořeny náhrady jinou AI službou ani placeholder soubory. Produkční layout musí fungovat bez těchto médií; integrační sloty a pravidla budou popsány v `docs/generated-media.md`.

## Implementační mapa

1. Doplnit sémantické tokeny, typografické role, šířky sloupců, tvary, stavy a motion kontrakt.
2. Zpřesnit wordmark, favicon a obecný exportní brand pomocí čistého SVG/CSS, nikoli generované rasterové identity.
3. Přestavět landing a formulář na nízkou kognitivní zátěž s jasnou důvěrou a CZ/UA rozsahem.
4. Proměnit obálku, kapitoly, itemy, navigaci, milníky a autentické moduly v jedno osobní vydání.
5. Sjednotit porovnání, sdílení, canvas obrázky a PDF.
6. Převést `/dev` na společnou sémantiku při zachování vyšší hustoty a produkčního read-only vysvětlení.
7. Dokončit mobil, klávesnici, fokus, reduced motion, zoom a chybové/missing states.
8. Zakódovat projektové znalosti do stručných skills, reviewer agentů, příkazů a `CLAUDE.md`.

## Ověřovací strategie

- Logika: strict typecheck, ESLint, Vitest, veřejná data a obsahový audit.
- Produkce: Vite build, chunk report a kontrola, že `/dev`, PDF a velká data zůstávají lazy-loaded.
- Toky: jeden CZ/UA člověk, celý datum/rok, přechodový rok, porovnání, fragment bez jména/s výslovným jménem, tři obrázky a PDF.
- Layout: 320, 375, 390, 768, 1024, 1280 a široký desktop; dlouhá města, zoom, landscape a žádný horizontální overflow.
- Přístupnost: landmarky, nadpisy, popisky, chyby, radiogroup, disclosure, fokus, klávesnice, live status, reduced motion, popisy mapy/oblohy/canvasu.
- Git: koherentní malé milníky, selektivní staging, žádné přepisování historie a závěrečný čistý stav.

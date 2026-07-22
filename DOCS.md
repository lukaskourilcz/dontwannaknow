# Tehdejší svět — technická dokumentace

## Produkt a hranice

Subjektem zprávy je konkrétní člověk, nikoli samotný historický rok. Formulář začíná vztahem, přijímá volitelné křestní jméno, datum nebo rok narození a podporované město v Česku či na Ukrajině. Výsledek opatrně rekonstruuje prostředí; netvrdí, že zná osobní vzpomínky nebo životopis.

Veřejné rozhraní je pouze česky. Podporovaný rozsah je od roku 1920 do aktuálního roku a aplikace poctivě zobrazuje náhradní vysvětlení, když pro dílčí kapitolu chybějí podklady. Data jiných zemí nebyla smazána, ale jsou nepodporovaný archiv a veřejné typy i dekodér je odmítnou.

## Tok zprávy

1. `normalizePerson` vytvoří stabilní profil bez odvozování výběru faktů ze jména.
2. `resolveHistoricalLocation` přiřadí dobový název města, tehdejší stát a případný širší celek.
3. `reportFor` načte lokální, zemské, kulturní a společné kandidáty pod stabilním seedem.
4. `annotateFact` doplní kapitolu, tón, citlivost, geografický rozsah, důvěru zdroje a bezpečnost pro sdílení.
5. `composeChapters` vytvoří chronologickou cestu: začátek příběhu, první roky, běžný den, dospívání, rozdíly oproti dnešku, proměny, širší kontext a život v číslech.
6. Složitý obsah se nevyskytuje v prvních položkách, není za sebou, zůstává v samostatné sbalené kapitole a nesmí být výchozí sdílenou kartou.
7. Varianta zprávy je součástí seedu i sdíleného stavu, takže „Ukázat jiný výběr“ zůstává reprodukovatelné.

## Historický kontext

Uživatel vždy vybírá dnešní zemi a město. Resolver rozlišuje Československo, Protektorát Čechy a Morava, Českou socialistickou republiku, českou republiku ve federaci a dnešní Českou republiku. Pro Ukrajinu rozlišuje pohraniční města před válkou, Ukrajinskou SSR, Sovětský svaz a samostatnou Ukrajinu; dobově mění také názvy měst jako Zlín, Dnipro, Doněck, Mariupol a Luhansk.

Politická příslušnost je oddělena od kulturní relevance. Ukrajinská kulturní data mají přednost před širším sovětským kontextem; širší celek se používá jen tam, kde je věcně významný.

## Zachované moduly

- `WorldMap` vysvětluje tehdejší hranice a zaniklé státy.
- `SkyMap` dál počítá skutečnou oblohu pomocí `astronomy-engine`; bez celého data se místo odhadu zobrazí poctivá výzva.
- `ArtStrip` používá místní statická díla a dostupné alternativní texty.
- `LifeGrid` a `LifeNumbers` jsou přesunuty na konec, sbalené a obsahují jen uběhlý čas (roky, období, dny, týdny, měsíční cykly a desetiletí), bez fyziologických nebo behaviorálních odhadů. Obsah sbalených kapitol se připojí až po otevření a týdenní mřížka slučuje buňky do tří SVG vrstev místo tisíců DOM prvků.
- `jsPDF` vytváří české A4 památeční vydání s vloženým fontem podporujícím diakritiku.
- `useCopied`, datové selektory, české tvaroslovné utility, mapové cesty, astronomická data a vývojový editor zůstaly znovu použity.

## Soukromí a sdílení

Profil se zpracovává jen klientsky. Fragment `#r=…` obsahuje nejvýše dva kompaktní profily a variantu; server jej v HTTP požadavku nedostane. Volitelné jméno je vynecháno, dokud uživatel nezapne explicitní volbu. Dekodér odmítá chybnou verzi, nepodporovanou zemi, neznámý vztah, město mimo zemi a rok mimo rozsah.

Vercel Analytics nedostává vlastní události s profilem a `beforeSend` odstraňuje query i fragment z URL. Statický OG obrázek je obecný; osobní obálka, dobový detail, obloha, kultura dospívání, kontrast s dneškem a porovnání vznikají klientsky v rozměrech 1200×630, 1080×1350 a 1080×1920.

## Výkon

Formulář načte samostatný malý katalog měst, ne velký městský archiv. Veřejné moduly používají generovanou `src/data/public` vrstvu s městy, souřadnicemi, městskými fakty a zemskými daty pouze pro CZ/UA; úplné zdroje zůstávají archivované mimo produkční graf. `Results`, mapa, obloha, umění a číselné vizualizace jsou lazy-loaded; velké faktové datasety přicházejí až při vytvoření zprávy a PDF stack až při exportu. Produkční build vypisuje aktuální velikosti chunků, které je třeba sledovat při rozšiřování dat.

## Redakční data a `/dev`

Datové zdroje jsou v `dontwannaknow/src/data`. `editorialRules.json` obsahuje ručně kontrolovatelná regex pravidla pro citlivý obsah a `dataSources.json` eviduje původ i stav ověření sad. V `/dev` lze obojí upravovat a filtrovat podle země, města, kapitoly, tónu, citlivosti a auditního problému. `history.json` je označený archiv dlouhých rešerší a není součástí veřejného výběru, dokud záznamy neprojdou jednotlivou redakční kontrolou. Konzole zapisuje přes dev-only middleware ve `vite.config.ts`; její heslo je pohodlnostní zámek, nikoli autentizace.

Starší globální `culture.json` a další nepodporované mezinárodní zdroje zůstávají zachované pro případnou budoucí redakční migraci, ale veřejná zpráva je nepoužívá: obsahovaly převážně americké návyky, které nebylo poctivé vydávat za českou nebo ukrajinskou zkušenost.

`npm run audit:content` kontroluje aktuálnost a CZ/UA hranice veřejné datové vrstvy, evidenci zdrojů, syntaxi JSON, přesné duplicity, roky v budoucnosti, identifikátory a datové typy redakčních pravidel, bezpečnost složitého obsahu, starou veřejnou značku a podezřele absolutní formulace. `npm run fix:duplicates` provede pouze mechanickou deduplikaci identických JSON záznamů; významové duplicity vyžadují redakční kontrolu.

## Ověření

`npm run check` postupně spouští strict typecheck, ESLint, Vitest, redakční audit a produkční build. Testy pokrývají historický resolver, stabilní seed, obtížný obsah, milníky, soukromí fragmentu a formulářovou validaci. Vizuální kontrola musí navíc projít šířky 320, 375, 390, tablet a desktop, plné datum i pouze rok, český i ukrajinský historický kontext, porovnání, export obrázku a vykreslené PDF.

Projektové znalosti a pracovní postupy jsou v kořenovém `CLAUDE.md`, pěti skills v `.claude/skills`, čtyřech oddělených review agentech a příkazech `/tehdejsi-*`. Velká autonomní změna používá koherentní průběžné commity; žádný commit není důvodem práci přerušit.

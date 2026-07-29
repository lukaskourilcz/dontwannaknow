# Tehdejší svět — technická dokumentace

## Produkt a hranice

Subjektem zprávy je konkrétní člověk, nikoli samotný historický rok. Formulář začíná vztahem, přijímá volitelné křestní jméno, datum nebo rok narození a podporované město v Česku či na Ukrajině. Výsledek opatrně rekonstruuje prostředí; netvrdí, že zná osobní vzpomínky nebo životopis.

Veřejné rozhraní je pouze česky. Podporovaný rozsah je od roku 1920 do aktuálního roku a aplikace poctivě zobrazuje náhradní vysvětlení, když pro dílčí kapitolu chybějí podklady. Data jiných zemí nebyla smazána, ale jsou nepodporovaný archiv a veřejné typy i dekodér je odmítnou.

## Tok zprávy

1. `normalizePerson` vytvoří stabilní profil bez odvozování výběru faktů ze jména.
2. `resolveHistoricalLocation` přiřadí dobový název města, tehdejší stát a případný širší celek.
3. `reportFor` načte jen řezy dané osoby (město, země) a kandidáty vybírá pod stabilním seedem.
4. `annotateFact` doplní kapitolu, tón, citlivost, geografický rozsah, důvěru zdroje a bezpečnost pro sdílení; citlivost daná daty funguje jako podlaha a datový zákaz sdílení nejde přebít.
5. Výběr řadí build-time skóre relevance (`src/lib/relevance.ts`): šest nezávislých os vzniklých kurátorskými průchody mimo běh aplikace, commitnutých v `src/data/relevance/` a propsaných do veřejných dat jako kompaktní pole `rel`. Deterministické brány skóre vždy přebijí — skóre jen řadí, co brány pustily; seedovaný rozptyl střídá blízké případy mezi osobami.
6. `composeChapters` vytvoří chronologickou cestu: začátek příběhu, první roky, běžný den, dospívání, rozdíly oproti dnešku, proměny, širší kontext a život v číslech. Každá kapitola nese záruku mixu (aspoň jedna položka s vysokým rozpoznáním a jedna s vysokým objevem, pokud je brány pustily).
7. Složitý obsah se nevyskytuje v prvních položkách, není za sebou, zůstává v samostatné sbalené kapitole a nesmí být výchozí sdílenou kartou.
8. Varianta zprávy je součástí seedu i sdíleného stavu, takže „Ukázat jiný výběr“ zůstává reprodukovatelné.
9. Lídři formativních let (`src/data/leaders.json`) se zobrazují jako strukturovaná vizitka s datovaným, citovaným dobovým vnímáním; politické profily se nikdy nesdílejí.

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

Formulář načte samostatný malý katalog měst, ne velký městský archiv. Veřejné moduly používají generovanou `src/data/public` vrstvu pouze pro CZ/UA, dělenou na běhové řezy: městská fakta po městech (`public/cityFacts/<město>.json`) a národní sady po zemích (`<sada>.cz|ua.json`). Zpráva tak načítá jen řezy dané osoby — datový chunk zprávy je ~25 kB místo dřívějších ~135 kB a vstupní chunk prvního vykreslení data neobsahuje vůbec. `Results`, mapa, obloha, umění a číselné vizualizace jsou lazy-loaded; PDF stack až při exportu. Produkční build vypisuje aktuální velikosti chunků, které je třeba sledovat při rozšiřování dat.

## Redakční data a `/dev`

Datové zdroje jsou v `dontwannaknow/src/data`. `editorialRules.json` obsahuje ručně kontrolovatelná regex pravidla pro citlivý obsah a `dataSources.json` eviduje původ i stav ověření sad. V `/dev` lze obojí upravovat a filtrovat podle země, města, kapitoly, tónu, citlivosti a auditního problému. `history.json` je označený archiv dlouhých rešerší a není součástí veřejného výběru, dokud záznamy neprojdou jednotlivou redakční kontrolou. Konzole zapisuje přes dev-only middleware ve `vite.config.ts`; její heslo je pohodlnostní zámek, nikoli autentizace.

Starší globální `culture.json` a další nepodporované mezinárodní zdroje zůstávají zachované pro případnou budoucí redakční migraci, ale veřejná zpráva je nepoužívá: obsahovaly převážně americké návyky, které nebylo poctivé vydávat za českou nebo ukrajinskou zkušenost.

Skóre relevance vzniká reprodukovatelnou pipeline v `scripts/relevance/`: `prompts.mjs` je jediný zdroj pravdy os i verze promptu, `gen-batches.mjs` připraví dávky (s `--only-missing` pro delta-skórování nových záznamů), `merge-results.mjs` slije výsledky do sidecarů `src/data/relevance/` se zdůvodněními a verzí. Per-record citace žijí v `src/data/provenance/<sada>.json` (title, publisher, url, accessed, licence, klíčované obsahem záznamu) a build je propisuje do veřejných dat jako kompaktní `src`. Jistota původu je věcí datové a auditní vrstvy — do čtenářské plochy se zdrojové značky nevykreslují; citace se zobrazují jen uvnitř vizitky lídra.

`npm run audit:content` kontroluje aktuálnost a CZ/UA hranice veřejné datové vrstvy, evidenci zdrojů, syntaxi JSON, přesné duplicity, roky v budoucnosti, identifikátory a datové typy redakčních pravidel, bezpečnost složitého obsahu, starou veřejnou značku a podezřele absolutní formulace. Nad skóre a citacemi vynucuje rozsahy 0–5, úplné pokrytí, zdůvodnění a verzi promptu, žádné osiřelé klíče, úplnost citací a strukturu profilů lídrů (datované a zdrojované vnímání, `shareSafe: false`). `npm run fix:duplicates` provede pouze mechanickou deduplikaci identických JSON záznamů; významové duplicity vyžadují redakční kontrolu.

## Ověření

`npm run check` postupně spouští strict typecheck, ESLint, Vitest, redakční audit a produkční build. Testy pokrývají historický resolver, stabilní seed, obtížný obsah, milníky, soukromí fragmentu a formulářovou validaci. Vizuální kontrola musí navíc projít šířky 320, 375, 390, tablet a desktop, plné datum i pouze rok, český i ukrajinský historický kontext, porovnání, export obrázku a vykreslené PDF.

Projektové znalosti a pracovní postupy jsou v kořenovém `CLAUDE.md`, pěti skills v `.claude/skills`, čtyřech oddělených review agentech a příkazech `/tehdejsi-*`. Velká autonomní změna používá koherentní průběžné commity; žádný commit není důvodem práci přerušit.

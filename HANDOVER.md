# HANDOVER — modernizace a obohacení Tehdejšího světa (fable-brief)

Stav k 2026-07-29, větev `redesign/ux-modernization`. Zadání je
`~/Downloads/fablebrief.md` (tři pilíře: A skórování relevance, B zdroje a
obohacení, C modernizace čtení). Tento dokument říká, co je hotové, co je
rozpracované v `dontwannaknow/curation-wip/`, a přesné kroky dokončení.

## Hotovo a commitnuto

1. **Pilíř A — mechanismus skórování** (`feat: redakční skórování relevance…`)
   - 6 nezávislých os v `src/lib/relevance.ts` (pořadí je smluvní:
     livedProximity, everydayConsequence, recognition, discovery,
     consequenceHorizon, explanatoryPayload; kompaktní pole `rel` ve
     veřejných datech).
   - Výběr ve zprávě: brány (citlivost, sdílení, věkové okno, rozsah) →
     řazení podle složeného skóre se seedovaným rozptylem → záruka mixu
     (≥1 vysoké rozpoznání, ≥1 vysoký objev, kapitola nezačíná obtížným).
   - Testy bran: `src/lib/report.gates.test.ts` — maximální skóre
     prokazatelně nepřebije žádnou bránu.
   - Pipeline: `scripts/relevance/` (prompts.mjs = jediný zdroj pravdy včetně
     PROMPT_VERSION `relevance-v1`; gen-batches.mjs `--only-missing`;
     merge-results.mjs s více páry `--batches/--results` a `--keep-existing`).
   - `scripts/audit-content.mjs` padá na malformovaných dávkách: rozsahy
     0–5, chybějící zdůvodnění/verze, osiřelé klíče, neúplné pokrytí,
     „obtížný záznam s plošným maximem“, neúplné citace provenience,
     strukturální kontrola lídrů.

2. **Pilíř B — lídři** (`feat: zdrojovaný dataset politických lídrů…`)
   - `src/data/leaders.json`: 26 profilů CZ+UA 1918–současnost, datované a
     citované vnímání, contested příznaky, shareSafe: false všude.
   - Runtime: `src/data/leaders.ts`, výběr lídra při narození + v dospívání
     v `src/lib/facts.ts` (`leaderFacts`), vizitka
     `src/components/LeaderProfile.tsx` v kapitole širších souvislostí.

3. **Pilíř C — čtení a výkon** (`feat: profily lídrů, hloubka na vyžádání a
   dělení dat na běhové řezy`)
   - Rozbalitelné zdroje u záznamů (ItemDepth), viditelné rozlišení
     „Doloženo“ × „K ověření“, vizitky lídrů.
   - Veřejná data dělená na řezy: `public/cityFacts/<město>.json`,
     `<sada>.cz|ua.json`. Datový chunk zprávy 134,6 kB → **25,2 kB**;
     vstupní chunk prvního vykreslení beze změny (194,85 kB / 61,41 kB gzip;
     `index.html` načítá jen `index-*.js` + App CSS).
   - Poctivost původu: `sourceConfidence` se odvozuje z per-record zdroje
     (doložený zdroj → verified; jinak review-needed); World Bank a Wikidata
     fakta nesou citaci přímo.

4. **Pilíř A — skóre dat: HOTOVO.** Všech 3058 veřejných záznamů (cityFacts,
   countryEvents, countryDecades, famousPeople) je oskórováno ve 3 nezávislých
   průchodech (144 dávek, 0 selhání), slito do commitnutých sidecarů
   `src/data/relevance/*.json` (se zdůvodněními a verzí promptu) a
   propsáno do veřejných dat jako pole `rel`. Audit prochází s 0 chybami,
   62 testů zelených. Ukázka řazení: 1968 invaze a 1938 mobilizace vedou,
   Mnichov má poctivě nulový „objev“.

## Rozpracováno — `dontwannaknow/curation-wip/` (commitnuto jako předávka)

- `relevance-batches/` + `relevance-results/`: kompletní auditní stopa
  skórování (144/144 dávek). Po nezávislé kontrole lze adresář smazat —
  kanonická data jsou v `src/data/relevance/`.
- `leaders/`: syrové výzkumné dávky lídrů po ověřovacím průchodu (slité do
  `src/data/leaders.json`; ponecháno pro audit).
- `decades/`: prázdné — workflow výzkumu dekád 1980–2020 byl zastaven kvůli
  kreditům. `decades-instructions.md` obsahuje kompletní zadání.
- `passA/B/C-prompt.md`, `leaders-instructions.md`, `decades-instructions.md`:
  přesné prompty pro reprodukci.

## Přesné další kroky (v pořadí)

1. **Doskórovat lídry (delta).**
   ```sh
   node scripts/relevance/gen-batches.mjs --out /tmp/delta-batches --only-missing
   ```
   → vyjde ~26 záznamů (lídři). Skórovat stejnými prompty, výsledky do
   `/tmp/delta-results`, pak merge s `--keep-existing` a oběma páry, nebo jen
   deltou: `--batches /tmp/delta-batches --results /tmp/delta-results --keep-existing`.

2. **Dekády 1980–2020 (CZ+UA).** Spusťte znovu výzkum podle
   `curation-wip/decades-instructions.md`: 10 dávek (CZ/UA × 1980…2020),
   výstupy `<cc>-<dekáda>.json`, poté ověřovací průchod. Slití: přidat
   `rows` jako ploché řádky do `src/data/countryDecades.json`
   ({country, decadeStart, bucket, text}) a `famous` do
   `src/data/famousPeople.json` ({country, decadeStart, name, role, note});
   zdroje zapsat do `src/data/provenance/countryDecades.json` a
   `provenance/famousPeople.json` ve tvaru
   `{"records":[{"key":"<country>|<decadeStart>|<bucket>|<text>", "title","publisher","url","accessed","licence"}]}`
   (klíč pro famousPeople: `<country>|<decadeStart>|<name>`). Pak
   `npm run data:public`, delta-skórování (krok 2 postup) a audit.
   Bez tohoto kroku dostane ročník 1980+ prázdnou dekádovou texturu —
   akceptační případ „Charkov 1991“ ze zadání na tom závisí.

3. **Provenience countryEvents (tranše).** Po slití skóre atribuovat
   web-rešerší aspoň nejrelevantnější záznamy `countryEvents` (řazeno podle
   složeného skóre) do `src/data/provenance/countryEvents.json` — stejný
   klíčový tvar (`<country>|<year>|<text>`). UI i audit už per-record zdroje
   umí; neatribuované záznamy poctivě zůstávají „K ověření“.

4. **Vizuální QA + finální kontrola.** `npm run check` (POZOR: testy chtějí
   Node 22 — `nvm use 22`; na Node 20 padá jsdom na ERR_REQUIRE_ESM).
   Projít v prohlížeči: zpráva 1953 Praha a 1991 Charkov, mobil 320 px,
   klávesnice, reduced motion, rozbalené vizitky lídrů, PDF a sdílení.
   Změřit build (`npm run build`) a potvrdit, že vstupní chunk nepřerostl
   194,85 kB. Po dokončení smazat `curation-wip/` a tento soubor.

## Zrádnosti

- `merge-results.mjs` validuje pokrytí jen vůči dávkám; úplnost vůči
  veřejným datům vynucuje `audit:content` (spadne, dokud nebude 100 %).
- Klíče záznamů jsou obsahové (`record-key.mjs`) — změna textu záznamu
  zneplatní jeho skóre i provenienci (audit to nahlásí jako osiřelé/chybějící).
- Skórovací agenti vracejí krátká `id` (r0…rN) — bez původního adresáře
  dávek jsou výsledky nečitelné.
- Ve `facts.ts` se řezy načítají v `reportFor` (`loadCountryDecades` atd.);
  každý nový dataset musí dodržet vzor „async load → sync accessor“.
- Commity pište česky (viz poslední čtyři v historii).

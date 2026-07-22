# Tehdejší svět — předání rozpracovaného overhaul session

Stav k 22. červenci 2026. Tento soubor vznikl na výslovnou žádost uživatele před restartem Codex CLI. Nejde o závěrečný release report: produktový overhaul je podstatně implementovaný, ale finální úplná validace a několik navazujících QA kroků ještě zbývá dokončit.

## Kde navázat

- Git repozitář: `/Users/lukasbarsinbars/Developer/dontwannaknow/dontwannaknow`
- Aplikace a `package.json`: `/Users/lukasbarsinbars/Developer/dontwannaknow/dontwannaknow/dontwannaknow`
- Větev: `dev`
- Remote: `origin` → `https://github.com/lukaskourilcz/dontwannaknow.git`
- Tento dokument je součástí posledního checkpoint commitu; jeho hash zjistěte pomocí `git log -1 --oneline`.

Po restartu nejprve spusťte `git status --short`, `git log --oneline -n 12` a přečtěte `CLAUDE.md`, `docs/experience-overhaul.md` a tento soubor. Zachovejte existující práci a pokračujte autonomně na stejné větvi.

## Neměnné produktové hranice

- Hlavní otázka zůstává „Čí svět chcete poznat?“ a člověk, nikoli rok, je subjektem.
- Veřejné rozhraní je pouze česky, ve formálním oslovení, a podporuje jen Česko a Ukrajinu.
- Produkt zůstává klientský, deterministický a bez runtime AI, backendového profilu či odesílání osobních vstupů.
- Jméno se do sdíleného fragmentu nedostane bez výslovného souhlasu.
- Obtížný obsah patří pouze do odděleného širšího kontextu a nesmí být výchozím sdíleným detailem.
- Skutečné mapy, astronomický výpočet, dobová data a autentické UI se nesmějí nahrazovat generovanými vizuály.

## Co bylo dokončeno

### 1. Audit, výzkum a směr

- Zmapována skutečná architektura, hlavní cesty, designový dluh, reuse strategie, designová teze a validační plán.
- Výsledky jsou v `docs/experience-overhaul.md`.
- Refero bylo cíleně použito pro editorial, onboarding, kulturní katalog, vrstvy povrchů a dlouhé čtení. Collect UI nebylo dostupné; omezení je poctivě zaznamenáno bez domýšlení referencí.
- V `docs/generated-media.md` je audit vizuálních příležitostí a deferred integrační kontrakt.

### 2. Vizuální a značkový základ

- Rozšířeny sémantické CSS tokeny pro papír, inkoust, stavové barvy, fokus, typografii, mezery, layout, radii a motion.
- Zachovány Fraunces, Newsreader a Instrument Sans i hluboká zelená, korál a teplý papír.
- Refaktorován wordmark a jednoduchý vektorový motiv bez falešného archivního materiálu.
- Sjednoceny focus, hover, disabled, error a status stavy; korálové primární akce mají bezpečnější kontrast.

### 3. Landing, formulář a shell

- Landing má jasnou person-centric hierarchii, stručný CZ/UA rozsah a jednu primární akci.
- Formulář zachovává stávající validaci, flexibilní datum/rok, vztah, volitelné jméno, město a sekundární porovnání.
- Vylepšeny přístupné popisky, skupiny voleb, privacy messaging, loading/error stavy a mobilní skládání.

### 4. Jedno osobní vydání

- Obálka působí jako osobní editorial volume a zobrazuje historické místo, dnešní stát, datum/rok, formativní období, metodiku a skutečně vypočtenou oblohu.
- Kapitoly používají sdílenou pořadovou navigaci, redakční rytmus a metadata-driven varianty položek.
- Sbalené kapitoly obsah nemountují, dokud je uživatel neotevře; obtížný kontext tak není skrytý pouze CSS.
- Opraveno duplicitní číslování eyebrow textů pocházejících už z dat.
- `LifeGrid` už nevytváří přibližně 5 200 samostatných SVG uzlů; používá dvě path vrstvy a jeden aktuální týden.

### 5. Porovnání, sdílení a PDF

- `Dva tehdejší světy` má kompaktní chapter navigation, společné souvislosti, osobní sloupce a responzivní skládání bez dvou kompletních reportů vedle sebe.
- Širší a citlivý srovnávací kontext je nyní skutečný zavřený disclosure s lazy mountem.
- Share panel má jasnější ochranu jména, skupiny druhu/formátu, preview hierarchii a stavovou zpětnou vazbu.
- Klientské share canvas výstupy a PDF byly vizuálně srovnány s webem; dynamický text zůstává vykreslený kódem a PDF zůstává klientské.

### 6. `/dev`, dokumentace a agentní infrastruktura

- Redakční povrch byl sjednocen přes sémantické tokeny, ale zůstal hustý, provozní a explicitně odlišuje dev zápis od produkčního read-only/export režimu.
- Vznikly projektové skills, review agents a reálné workflow commands pod `.claude/`.
- `CLAUDE.md`, `README.md`, `DOCS.md`, `DESIGN.md`, `NEEDED.md` a aplikační README byly průběžně reconciled.
- Všechny nové skills prošly rychlým strukturálním validátorem; v systému chyběl PyYAML, proto byl validátor spuštěn s dočasnou instalací mimo repozitář.

## Commity vytvořené během session

1. `7d472df docs: define experience overhaul direction`
2. `4a06da8 feat: establish semantic visual foundations`
3. `5e13958 feat: redesign onboarding and application shell`
4. `d6e1f23 feat: reshape the report as a personal edition`
5. `5068dac feat: align comparison sharing and keepsakes`
6. `f738e5e feat: align the editorial console with product states`
7. `5032255 docs: encode project-specific agent workflows`
8. Poslední checkpoint obsahuje responsive/accessibility/performance refinement, nové regresní testy, dokumentační reconciliation a tento handoff; hash zjistěte z historie.

## Poslední checkpoint — hlavní soubory

- `dontwannaknow/src/App.tsx`: reset share chyby před novým generováním a nulové motion transition při reduced motion.
- `dontwannaknow/src/components/Results.tsx`: jednotná navigace kapitol, lazy disclosures, comparison disclosures a normalizace eyebrow labelů.
- `dontwannaknow/src/components/LifeGrid.tsx`: výrazně menší SVG DOM.
- `dontwannaknow/src/styles.css`: on-dark/on-accent tokeny, kontrast CTA, safe-area padding a srovnávací/disclosure styly.
- `dontwannaknow/src/components/Results.test.tsx`: navigace, disclosure, chybějící obloha, porovnání a duplicitní eyebrow regresní pokrytí.
- `dontwannaknow/src/components/LifeGrid.test.tsx`: kompaktní SVG kontrakt.
- `dontwannaknow/src/components/SharePanel.test.tsx`: výchozí privacy stav jména.
- `dontwannaknow/src/test/setup.ts`, `dontwannaknow/vitest.config.ts`: stabilnější jsdom/rAF a sekvenční běh UI testů.

## Skutečně provedená validace

### Úspěšné kontroly

- Cílený ESLint posledního checkpointu skončil s kódem 0 pro `App.tsx`, `Results.tsx`, `Results.test.tsx`, `LifeGrid.tsx`, `LifeGrid.test.tsx` a `SharePanel.test.tsx`.
- `git diff --check` opakovaně prošel bez whitespace chyb.
- Před redesignem/na prvním integračním bodě prošly v `npm run check` typecheck a lint; testy tehdy dokončily 44 z 46 scénářů a dva UI testy skončily timeoutem.
- Strukturální validace všech pěti `.claude/skills/*/SKILL.md` prošla.

### Browser QA provedené na skutečné aplikaci

- Landing zkontrolován v šířkách 320, 375, 390, 768, 1024, 1280 a 1440 px bez horizontálního overflow.
- Ověřena jediná hlavní otázka, labely, radiogroup semantics, trust copy a praktické dotykové cíle.
- Vygenerován český exact-date report (Praha, 12. 4. 1953) a ukrajinský year-only transition report (Kyjev, 1991).
- Ukrajinský report správně ukázal historický přechod „Ukrajinská SSR / Ukrajina“ a poctivý missing-sky fallback.
- Obtížný obsah nebyl mimo kontextovou kapitolu; sbalené kapitoly nebyly v DOM.
- Porovnání Praha 1953 vs. Brno 1960 fungovalo na mobilu, mělo sedm strukturovaných kapitol a společný kontext.
- Po opravě byl citlivý comparison context zavřený `<details>` a jeho obsah nebyl mountnutý.
- U landscape share image aplikace oznámila úspěšné uložení bez console error; automatické zachycení downloadu browser nástrojem timeoutovalo, proto to není kompletní validační důkaz souboru.

### Neuzavřené kontroly

- Poslední cílený Vitest běh byl kvůli restartu CLI ukončen. `missing birthday-sky fallback` a `stable comparison columns` prošly; dva náročné `Results` scénáře (`visible report text one home` a `chapter navigation`) narazily na 60s timeout. Nešlo o zachycený assertion failure, ale suite není zelená.
- Finální `npm run check`, produkční build a `npm audit --audit-level=moderate` po posledním checkpointu ještě nebyly úspěšně dokončeny.
- Host byl výrazně přetížený rendererem desktopové aplikace; i cílené testy trvaly desítky sekund. Timeouty je třeba po restartu znovu ověřit, ne pouze zvyšovat naslepo.

## Co má další agent udělat

1. Zkontrolovat poslední commit a čistotu pracovního stromu; neměnit ani zahazovat cizí práci.
2. V `dontwannaknow/` nejprve zopakovat cílené testy `Results.test.tsx`, `LifeGrid.test.tsx` a `SharePanel.test.tsx`. Pokud timeouty přetrvají i na klidném hostu, profilovat setup/render a zrychlit testy bez oslabení assertion kontraktů.
3. Spustit `npm run check`, poté samostatně `npm run build` pro kontrolu chunků a `npm audit --audit-level=moderate`. Opravit všechny proveditelné regresní chyby.
4. Dokončit browser QA: všechny tři share-image rozměry, single i comparison variantu, explicitní name-on/name-off, fragment restore, PDF, `/dev`, keyboard, 200% zoom, reduced motion a dlouhé historické názvy.
5. Projít build output a zapsat významné změny do `stack-and-scaling.md`, pokud se skutečný chunk/asset profil změnil.
6. Vyhledat starý veřejný brand, placeholder copy, zjevné `any` bypassy, nepoužité assety, stale dokumentaci a duplicitní komponenty; opravovat jen reálné nálezy.
7. Udělat samostatný finální QA/docs commit a až potom připravit závěrečný implementační report požadovaný původní specifikací.

## Higgsfield AI — výslovně odloženo

Higgsfield MCP v této session nebylo dostupné a uživatel výslovně zakázal výzkum, čekání, náhradní generátor i placeholder assety. Nebyl tedy vygenerován žádný AI vizuál. Kód a layouty zůstaly připravené pro pozdější dekorativní integraci bez runtime závislosti.

Přesný seznam budoucích assetů, jejich umístění, účel, bezpečnostní omezení a integrační kontrakt je v `docs/generated-media.md`. Další agent je nesmí generovat, dokud uživatel neřekne, že je Higgsfield MCP skutečně dostupné. Všechen factual text, mapy, hvězdy, data a screenshoty UI musí i potom zůstat autentické a deterministické.

## Definice pokračování

Nezačínejte redesign znovu. Rozšiřujte existující komponenty a tokeny, zachovejte deterministický report pipeline a postupujte přes koherentní commit checkpointy. Původní úkol má být po restartu dokončen autonomně; obyčejné type, lint, test, build, CSS nebo integrační chyby nejsou důvodem zastavit.

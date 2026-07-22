# Tehdejší svět — dokončené předání overhaul session

Stav k 22. červenci 2026. Soubor původně vznikl před restartem Codex CLI a navazující relace podle něj dokončila testy, exportní QA, browser kontrolu, výkonovou dokumentaci i závěrečné opravy. Nezbývá žádný známý bezpečně proveditelný úkol mimo výslovně odloženou produkci Higgsfield médií.

## Kde navázat

- Git repozitář: `/Users/lukasbarsinbars/Developer/dontwannaknow/dontwannaknow`
- Aplikace a `package.json`: `/Users/lukasbarsinbars/Developer/dontwannaknow/dontwannaknow/dontwannaknow`
- Větev: `dev`
- Remote: `origin` → `https://github.com/lukaskourilcz/dontwannaknow.git`
- Tento dokument je součástí posledního checkpoint commitu; jeho hash zjistěte pomocí `git log -1 --oneline`.

Při budoucím navázání nejprve spusťte `git status --short`, přečtěte `CLAUDE.md`, `docs/experience-overhaul.md` a tento soubor a zachovejte existující deterministickou architekturu.

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
- Titul se jménem používá gramaticky bezpečný zápis „Tehdejší svět: Šárka“ místo předstírání českého skloňování.
- Popisky skutečně vypočtené oblohy mají jednoduchou kolizní ochranu, která dává přednost planetám a zachovává čitelnost webu, obrázku i PDF.

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
- Veřejný country-label kontrakt už na runtime nevystavuje nepoužívané názvy archivních zemí; archivní data a `/dev` audit přitom zůstaly zachované.

## Hlavní commity overhaul implementace

1. `7d472df docs: define experience overhaul direction`
2. `4a06da8 feat: establish semantic visual foundations`
3. `5e13958 feat: redesign onboarding and application shell`
4. `d6e1f23 feat: reshape the report as a personal edition`
5. `5068dac feat: align comparison sharing and keepsakes`
6. `f738e5e feat: align the editorial console with product states`
7. `5032255 docs: encode project-specific agent workflows`
8. `3b2dd90 feat: refine report accessibility and performance`
9. `54da87b fix: close release QA findings`

Pozdější čistě dokumentační kontroly mohou být v historii nad tímto seznamem; aktuální revizi vždy ověřte pomocí `git log -1 --oneline`.

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

### Automatické kontroly

- Autoritativní `npm run check` dokončil typecheck, kompletní ESLint, Vitest, veřejný datový/content audit a produkční Vite build s kódem 0.
- Finální sada obsahuje 14 testovacích souborů a 52 testů; dřívější timeouty po restartu zmizely a regresní privacy test byl opraven tak, aby respektoval změnu názvu tlačítka po zkopírování.
- Content audit ověřil 38 zdrojových a 12 veřejných souborů, 70 měst a jen CZ/UA; skončil s 0 chybami a dvěma očekávanými archivními varováními.
- `npm audit --audit-level=moderate` našel 0 zranitelností.
- Produkční build má 8,1 MB na disku; veřejný shell 145 kB / 49 kB gzip, report 32 kB / 11 kB gzip, mapa 128 kB / 49 kB gzip a obloha 57 kB / 25 kB gzip. PDF i `/dev` zůstávají lazy.
- Strukturální validace všech pěti `.claude/skills/*/SKILL.md` prošla.
- Vyhledávání nenašlo starý veřejný brand, placeholder copy ani zjevné `any`/TypeScript bypassy. Veřejný App chunk už neobsahuje nepoužívané labely nepodporovaných zemí.
- Následný audit prošel všech 26 repozitářových Markdown souborů, ověřil všechny lokální odkazy, opravil zastaralé datové cesty a srovnal `NEEDED.md` i nákladový model s aktuálním GitHub/Vercel stavem.

### Browser, přístupnost a responzivita

- Landing a report byly kontrolovány v šířkách 320, 375, 390, 768, 1024, 1280 a 1440 px bez horizontálního overflow; 320px reflow současně pokrývá layout ekvivalentní 200% zoomu širokého viewportu.
- Ověřena jediná hlavní otázka, landmarky, nadpisy, radiogroup semantics, trust copy, focus ring, skip-link kontrakt, 44px klikací obal privacy checkboxu a přirozené formulářové pořadí.
- Prázdný submit přenesl fokus na datum a nastavil `aria-invalid` i `aria-describedby` pro datum a město.
- Kontrast hlavního textu je 14,9:1, primárního CTA 4,78:1 a chybového textu proti formulářovému papíru 7,18:1.
- Reduced-motion větev je pokryta `useReducedMotion`, nulovým Motion transition a CSS media queries ve veřejném i `/dev` povrchu; na kontrolním browseru nebyla preference aktivní.
- Vygenerován český exact-date report (Praha, 12. 4. 1953) a ukrajinský year-only transition report (Kyjev, 1991). Ukrajinský report správně ukázal „Ukrajinská SSR / Ukrajina“ a poctivý missing-sky fallback.
- Obtížný obsah nebyl mimo kontextovou kapitolu; sbalené kapitoly nebyly v DOM. Porovnání Praha 1953 vs. Brno 1960 fungovalo na mobilu a citlivý comparison context zůstal zavřený a nemountnutý.
- Všechna kontrolovaná browser okna skončila bez console warning/error.

### Sdílení, média, PDF a `/dev`

- Soukromý fragment otevřený v novém panelu obnovil report bez jména; explicitní varianta obnovila „Šárka“.
- Skutečně stažené PNG soubory měly přesně 1200×630, 1080×1350 a 1080×1920 px. Vizuální kontrola potvrdila čitelné zalomení, konzistentní brand a žádný ořez či artefakt; name-on varianta byla kontrolována samostatně.
- Klientský PDF export vytvořil 4stránkové A4 o velikosti přibližně 192 kB. Všechny stránky byly vyrenderovány do PNG a zkontrolovány; titul, diakritika, page breaks, patičky, citlivý kontext i obloha jsou čitelné.
- Kolizní kontrola skutečného SVG po opravě našla 0 překryvů mezi zobrazenými hvězdnými a planetárními popisky.
- `/dev` v development režimu načetl 9 480 položek, auditní filtry a nastavení; produkční preview výslovně oznámilo režim jen pro čtení a JSON download fallback bez předstírání autentizované administrace.

## Stav pro dalšího agenta

Produktový overhaul je uzavřený. Další běžná práce má začínat novým konkrétním zadáním, nikoli opakováním redesignu nebo validace. Jediný předem známý navazující blok je Higgsfield produkce popsaná níže, která zůstává neaktivní, dokud uživatel nepotvrdí dostupnost MCP.

## Higgsfield AI — výslovně odloženo

Higgsfield MCP v této session nebylo dostupné a uživatel výslovně zakázal výzkum, čekání, náhradní generátor i placeholder assety. Nebyl tedy vygenerován žádný AI vizuál. Kód a layouty zůstaly připravené pro pozdější dekorativní integraci bez runtime závislosti.

Přesný seznam budoucích assetů, jejich umístění, účel, bezpečnostní omezení a integrační kontrakt je v `docs/generated-media.md`. Další agent je nesmí generovat, dokud uživatel neřekne, že je Higgsfield MCP skutečně dostupné. Všechen factual text, mapy, hvězdy, data a screenshoty UI musí i potom zůstat autentické a deterministické.

## Definice pokračování

Nezačínejte redesign znovu. Rozšiřujte existující komponenty a tokeny, zachovejte deterministický report pipeline a postupujte přes koherentní commit checkpointy. Původní úkol má být po restartu dokončen autonomně; obyčejné type, lint, test, build, CSS nebo integrační chyby nejsou důvodem zastavit.

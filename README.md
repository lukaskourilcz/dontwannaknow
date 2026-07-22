# Tehdejší svět

![Tehdejší svět — osobní obraz dětství a dospívání](./dontwannaknow/public/og-image.png)

Tehdejší svět pomáhá poznat prostředí, ve kterém vyrůstal člověk, na kterém vám záleží. Z kurátorovaných dat o každodenním životě, kultuře, městech a historických událostech skládá osobní obraz dětství a dospívání — soukromě, přímo v prohlížeči.

Nejde o životopis ani AI-generovaný příběh. Výsledek je deterministicky sestavený z místních dat a poctivě rozlišuje mezi doloženým dobovým kontextem a tím, co o soukromém životě člověka aplikace neví.

## Co aplikace umí

- Vytvoří zprávu pro člověka narozeného od roku 1920 do současnosti v podporovaném městě v Česku nebo na Ukrajině.
- Přijme celý den narození i samotný rok; jméno je nepovinné.
- Rozliší dnešní místo od tehdejšího města, státu a širšího politického celku.
- Vypráví chronologicky o narození, prvních letech, každodennosti, dospívání, rozdílech oproti dnešku, proměnách a událostech formujících generaci.
- Ukáže věkové milníky, změny hranic, dobové umění a při celém datu narození skutečně vypočtenou oblohu.
- Porovná dva tehdejší světy vedle sebe bez soutěžního hodnocení.
- Nabídne jiný, ale stále reprodukovatelný výběr faktů.
- Vytvoří památeční PDF a osobní obrázky pro krajinu, příspěvek i příběh přímo v prohlížeči.
- Obnoví zprávu ze sdíleného odkazu; jméno do něj zahrne jen po výslovném souhlasu.
- Poskytuje vývojovou konzoli `/dev` pro audit zdrojů, citlivosti, zemí, měst, kapitol a redakčního stavu dat.

Veřejné rozhraní je pouze česky a veřejná datová vrstva podporuje pouze Česko a Ukrajinu. Starší výzkumné datasety jiných zemí zůstávají archivované pro budoucí redakční práci, ale nejsou součástí generátoru veřejné zprávy.

## Soukromí a důvěryhodnost

- Profil se zpracovává na zařízení uživatele; aplikace nemá backend, účet ani databázi osobních profilů.
- Sdílený stav je v URL fragmentu `#r=…`, který se neposílá serveru v HTTP požadavku.
- Jméno se ve výchozím stavu nesdílí.
- Vercel Analytics dostává URL bez query a fragmentu; aplikace nevytváří vlastní události obsahující profil nebo text zprávy.
- Runtime nepoužívá AI ani externí historické API.
- Citlivý obsah je označený, redakčně omezený, nezačíná jím zpráva a není výchozím obsahem sdíleného obrázku.

## Technický stack

| Oblast | Technologie |
| --- | --- |
| UI | React 19, strict TypeScript 5.8 |
| Build a vývoj | Vite 7, Node.js 22 |
| Styling | vlastní responzivní CSS, lokálně hostované Fraunces, Newsreader a Instrument Sans |
| Pohyb | Motion 12 s podporou `prefers-reduced-motion` |
| Astronomie | `astronomy-engine` |
| PDF a obrázky | `jsPDF`, SVG a Canvas API v prohlížeči |
| Testy | Vitest, Testing Library, jsdom |
| Kvalita | ESLint, TypeScript, datový a redakční audit |
| Hosting | statický Vite build na Vercelu, Vercel Web Analytics |

V produkci neběží žádná funkce, databáze, fronta, úložiště generovaných souborů ani AI služba. Náklady proto závisejí hlavně na CDN přenosu a počtu požadavků, nikoli na serverovém výpočtu.

## Jak je aplikace uspořádaná

```text
dontwannaknow/
├── public/                 statické umění, favicon a OG karta
├── scripts/                generování veřejných dat a obsahové audity
├── src/components/         formulář, zpráva, mapy, obloha a export
├── src/data/               zdrojová, archivní a odvozená veřejná data
├── src/dev/                redakční konzole
├── src/lib/                osoba, historický resolver, fakta, zpráva, sdílení a PDF
├── src/test/               společné testovací pomocné funkce
└── vercel.json             SPA routing a bezpečnostní hlavičky
```

Tok zprávy je rozdělený do samostatných vrstev: normalizace osoby → historický kontext → výběr kandidátních faktů → redakční anotace → složení kapitol → vykreslení a export. Jméno není součástí seedu, takže nemění výběr faktů.

Velká data a vizuální moduly se načítají až po vytvoření zprávy. Městské fakty jsou rozdělené podle země a PDF knihovna se stáhne až při exportu. Archivní datasety jsou dostupné redakční konzoli, ale nevstupují do veřejného generátoru.

## Lokální vývoj

Požadavkem je Node.js 22.

```bash
cd dontwannaknow
npm install
npm run dev
```

Kompletní kontrola repozitáře:

```bash
npm run check
```

Příkaz postupně spustí strict typecheck, ESLint, testy, kontrolu vygenerované veřejné datové vrstvy, redakční audit a produkční build. Užitečné dílčí příkazy:

```bash
npm run typecheck
npm run lint
npm test
npm run audit:content
npm run data:public
npm run build
npm run preview
```

`npm run data:public` znovu vytvoří CZ/UA-only runtime data. `npm run fix:duplicates` mechanicky odstraní přesné JSON duplicity; významové duplicity a citlivý obsah stále vyžadují redakční kontrolu.

## Nasazení

Vercel musí používat:

- Root Directory: `dontwannaknow/`
- Production Branch: `main`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: `22.x`

Soubor `vercel.json` zajišťuje SPA přesměrování a bezpečnostní hlavičky. Obecná OG karta je statická; individuální náhled odkazu není u čistě statické aplikace s daty ve fragmentu technicky možný bez serverové vrstvy.

## Dokumentace

- [Technická dokumentace](./DOCS.md)
- [Aplikační README](./dontwannaknow/README.md)
- [Vizuální systém](./dontwannaknow/DESIGN.md)
- [Audit zážitku, výzkum a designová teze](./docs/experience-overhaul.md)
- [Kontrakt budoucích generovaných médií](./docs/generated-media.md)
- [Dokončené předání overhaul session](./docs/NEXT-AGENT-HANDOFF.md)
- [Řídicí dokument pro vývojové agenty](./CLAUDE.md)
- [Aktuální stack, kapacita a náklady](./stack-and-scaling.md)
- [Kroky vyžadující zásah vlastníka](./NEEDED.md)

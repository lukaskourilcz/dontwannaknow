# Tehdejší svět

Tehdejší svět vytváří osobní, časově řazený portrét prostředí, ve kterém člověk vyrůstal. Uživatel zvolí vztah, volitelné křestní jméno, datum nebo rok narození a podporované město v Česku či na Ukrajině. Výsledek propojí každodennost, kulturu, místní dění, proměny hranic, narozeninovou oblohu a širší historické souvislosti.

Nejde o životopis ani o generovaný příběh. Zpráva vzniká deterministicky v prohlížeči z kurátorovaných statických dat. Formulářové údaje se neposílají na server a aplikace nepoužívá runtime AI, účet ani databázi osobních profilů.

## Vývoj

Požadavkem je Node.js 22.

```bash
npm install
npm run dev
```

Hlavní kontrolní příkaz spustí strict TypeScript, ESLint, Vitest, redakční audit i produkční sestavení:

```bash
npm run check
```

Samostatně jsou dostupné `npm run typecheck`, `npm run lint`, `npm test`, `npm run audit:content` a `npm run build`. `npm run data:public` z archivních zdrojů znovu vytvoří CZ/UA-only vrstvu v `src/data/public`; audit ověřuje, že je aktuální a neobsahuje nepodporované země. Přesné duplicity v JSON datech lze před ruční kontrolou odstranit pomocí `npm run fix:duplicates`.

## Architektura

- `src/App.tsx` drží pouze stav cesty, obnovu fragmentu a lazy-loading výsledku.
- `src/components/NewForm.tsx` obsluhuje jeden nebo dva profily a klientskou validaci.
- `src/lib/person.ts` je zdroj typu osoby, vztahů, normalizace a podporovaného rozsahu.
- `src/lib/historicalLocation.ts` převádí moderní město a rok na tehdejší politický kontext.
- `src/lib/facts.ts` vybírá kandidátní data; `src/lib/report.ts` je skládá do kapitol a vynucuje redakční pravidla.
- `src/components/Results.tsx` vykresluje osobní cestu od narození po dospívání a znovu používá mapu, oblohu, umění i vizualizace času.
- `src/lib/share.ts`, `src/lib/shareImage.ts` a `src/lib/pdf.ts` zajišťují soukromé sdílení, obrázky a památeční PDF přímo v prohlížeči.
- `src/data/editorialRules.json` obsahuje ručně kontrolovatelná pravidla citlivosti a zařazení.
- `src/data/dataSources.json` eviduje původ, stav ověření a veřejné použití každé editovatelné sady.

Veřejný výběr je záměrně omezen na Česko a Ukrajinu. Starší data jiných zemí zůstávají v kořenových datových souborech a archivních katalozích, ale produkční moduly importují jen odvozenou CZ/UA vrstvu v `src/data/public`. Veřejný formulář, stav URL a generátor nepodporované země nepřijmou. Dlouhý korpus v `history.json` je také archivní rešerše: veřejná zpráva ho nepoužívá, dokud jeho záznamy neprojdou jednotlivou redakční kontrolou. Těžké datové a vizuální moduly se načítají až po vytvoření zprávy; PDF knihovna až při exportu.

## Sdílení a soukromí

Sdílený stav používá fragment `#r=…`, který se neposílá v HTTP požadavku. Jméno se standardně vynechává a přidá se pouze po výslovném zaškrtnutí. Kód analytiky před odesláním odstraňuje fragment a nevytváří události s profilem ani obsahem zprávy.

Statický web nemůže bez serveru vytvořit osobní náhled odkazu pro sociální sítě. Proto používá obecnou značkovou kartu `public/og-image.png`; osobní obálka, dobová souvislost, narozeninová obloha, kultura dospívání, kontrast s dneškem a porovnání se stahují klientsky ve třech rozměrech.

## Redakční konzole

Na `/dev` je vývojová konzole pro procházení a úpravu JSON dat včetně redakčních pravidel a evidence zdrojů. Auditní filtry pokrývají zemi, město, kapitolu, tón, citlivost, chybějící metadata a zdroje, stav kontroly, bezpečnost sdílení i nepodporované země. Heslo je pouze lokální pojistka rozhraní, ne skutečné zabezpečení. Zápis na disk poskytuje jen middleware vývojového serveru; v produkci se změny stahují jako soubor.

## Nasazení

Aplikace je statický Vite projekt. Na Vercelu nastavte Root Directory na tuto složku (`dontwannaknow/`), build command `npm run build` a output `dist/`. Pro jiný statický hosting je nutné směrovat neznámé cesty na `index.html`.

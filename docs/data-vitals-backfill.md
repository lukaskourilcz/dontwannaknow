# `vitalsBackfill`: demografický kontext před rokem 1960

## Účel

Sada doplňuje zprávy narozené před začátkem řad Světové banky o národní
demografický kontext. Nejde o odhad délky života konkrétního člověka.
Zobrazená „naděje dožití při narození“ je dobový periodický ukazatel:
shrnuje demografické poměry daného roku.

## Generování a veřejné řezy

```bash
cd dontwannaknow
npm run data:vitals
npm run data:public
```

`scripts/gen-vitals.mjs` stahuje CSV z OWID Grapheru, veřejná metadata
ukazatele i bodovou mapu původních zdrojů. Odvozená data zapisuje do
`src/data/vitals/{cz,ua}.json`, úplné citace do
`src/data/provenance/vitalsBackfill.json` a veřejný build do
`src/data/public/vitals.{cz,ua}.json`. Aplikace načte pouze řez zvolené země.

Generátor propustí jen tyto upstreamy:

- UN World Population Prospects — CC BY 3.0 IGO,
- Human Mortality Database — CC BY 4.0,
- Gapminder Child Mortality v7 — CC BY 4.0.

Licence se při každém běhu kontroluje proti plným metadatům OWID. Bod s jiným
upstreamem se nezveřejní a důvod se vypíše. Veřejný audit navíc kontroluje
rozsah, zemi, řadu, číselnou hodnotu, upstream, licenci, relevanci a
per-record citaci.

## Současné poctivé omezení zdroje

K 30. červenci 2026 obsahuje ověřený výstup 20 hodnot naděje dožití pro roky
1950–1959, deset pro každou podporovanou zemi. OWID u dvou starších českých
bodů uvádí Zijdeman et al.; tento upstream není v allowlistu P1, a proto body
nejsou součástí produktu. Ukrajinské body před rokem 1950 jsou zakázané
bez ohledu na licenci.

Aktuální bodová mapa řady dětské úmrtnosti připisuje české hodnoty 1949–1959
UN IGME, jehož metadata uvádějí standardní copyright UNICEF, nikoli
redistribuovatelnou licenci z allowlistu. Generátor těchto 11 bodů správně
vyřazuje. Datový model, tónová brána, zákaz sdílení a test zákazu otevření
kapitoly jsou připravené pro budoucí hodnoty z povoleného Gapminder v7
upstreamu; neexistující otevřený bod se však nenahrazuje odhadem.

## Redakční a běhové brány

- Česká hodnota před rokem 1993 vždy používá formulaci „na území dnešního
  Česka“.
- Ukrajinský veřejný soubor nesmí obsahovat rok před 1950.
- Dětská úmrtnost je `shareSafe: false`, má mírnou citlivost, patří do
  odděleného kontextu a nesmí otevřít kapitolu.
- Naděje dožití vstupuje do kapitoly proměn a porovnává se jen s nejnovější
  dostupnou hodnotou Světové banky.
- Výběr používá commitnuté skóre relevance a seedovaný runtime; síť se v
  prohlížeči nevolá.

## Ověření

Testy pokrývají ukrajinský cutoff, českou územní formulaci, determinismus,
viditelný výstup pro Prahu i Charkov v roce 1953, allowlist licencí a zákaz
sdílení i otevření kapitoly u dětské úmrtnosti.

# Filmové premiéry — Wikidata

Datová sada `filmPremieres` přidává do kapitol o dětství a dospívání české
a ukrajinské filmy podle roku premiéry. Nejde o přehled kinematografie:
skórování a věkové brány z omezeného počtu kandidátů vybírají dobový kulturní
dotek, který může čtenáři přiblížit formativní roky.

## Zdroj a licence

Generátor `dontwannaknow/scripts/gen-films.mjs` čte při ručním build-time běhu
strukturovaná data z Wikidata Query Service. Používá jen identifikátor,
premiérové datum, český název, zemi původu, žánr, studio a počet sitelinků.
Text Wikipedie ani jiná cizí próza do sady nevstupují.

Strukturovaná data Wikidat jsou dostupná pod licencí CC0 1.0. Generátor tuto
licenci kontroluje proti uzavřenému allowlistu a ke každému filmu zapisuje
citaci do `src/data/provenance/filmPremieres.json`. Veřejná věta vzniká z
české šablony nebo z ručně napsané kurátorské úpravy.

## Původové a jazykové brány

- Česká větev připouští jen původ Československo (`Q33946`) nebo Česko
  (`Q213`). Smíšený záznam s jinou zemí neprojde.
- Ukrajinská větev připouští původ Ukrajina (`Q212`), případně původ Sovětský
  svaz (`Q15180`) jen s jedním z výslovně povolených studií: Dovženkovo filmové
  studio, Oděské filmové studio, Kyivnaukfilm nebo Ukrtelefilm.
- Samotný sovětský původ nestačí. Obecný titul Mosfilmu se za ukrajinský
  nevydává.
- Záznam bez českého názvu po aplikaci `overrides.cz.json` nebo
  `overrides.ua.json` je vyřazen. Ve veřejném názvu ani větě nesmí zůstat
  cyrilice.
- Pro každý rok a zemi se ponechá nejvýše osm filmů; pořadí kandidátů určuje
  počet sitelinků. Tenké období se ničím nedoplňuje.

Stejné původové kontroly jsou v generátoru, obsahovém auditu i běhovém loaderu.
Build-time skóre je nikdy nemůže obejít.

## Česká redakční vrstva

Výchozí věta pouze poctivě sděluje, že daný film v roce premiéry přišel do kin.
Kurátorské výjimky v `src/data/filmPremieres/overrides.*.json` mohou dodat
český titul a dobový kontext. Změna titulku nebo věty mění obsahový
`recordKey`, a proto zneplatní staré skóre i citaci.

Připomene-li kurátorská věta okupaci, deportace nebo podobný obtížný kontext,
musí nést `sensitivity: "difficult"` a `shareSafe: false`. Takový film se
nesmí stát výchozím obsahem pro sdílení ani lehkým kulturním detailem.

## Výběr do zprávy

Loader `src/data/filmPremieres.ts` dynamicky stáhne jen soubor zvolené země.
Věk je tvrdá brána:

- mezi 3 a 9 lety se připouští pouze filmová pohádka,
- mezi 10 a 17 lety se připouští film bez žánrového omezení,
- mimo tato okna se film ve zprávě neobjeví.

Z kandidátů se pomocí `pickRelevant` vybírají nejvýše dva dětské a tři
dospívající tituly. Složení kapitol jejich přidáním nezvětšuje rozpočty.
Stejný profil a varianta vždy vytvoří stejný výběr.

## Regenerace

Spouštějte z aplikační složky na Node.js 22:

```bash
npm run data:films
npm run relevance:batches -- --dataset filmPremieres --out /tmp/film-batches --only-missing
# Každou dávku ohodnoťte přesnými vytištěnými prompty A, B a C.
npm run relevance:merge -- --batches /tmp/film-batches --results /tmp/film-results --keep-existing
npm run data:public
npm run audit:content
npm run check
```

Pro kontrolovanou částečnou regeneraci lze nastavit `FILM_COUNTRY=cz|ua`,
`FILM_YEAR_FROM`, `FILM_YEAR_TO` a reprodukovatelné datum citace
`DATA_ACCESSED=YYYY-MM-DD`. Generátor ponechá záznamy mimo zadaný rozsah.

Výstupy, které se commitují:

- `src/data/filmPremieres/{cz,ua}.json`,
- `src/data/provenance/filmPremieres.json`,
- `src/data/relevance/filmPremieres.json`,
- `src/data/public/filmPremieres.{cz,ua}.json`.

## Známé hranice

Přesnost premiérových dat před rokem 1960 je na Wikidatech nerovnoměrná;
rok bez přesného dne je pro tuto funkci dostačující. Řazení podle sitelinků
zvýhodňuje mezinárodně známé filmy, proto důležité domácí tituly dostávají
ručně kontrolovanou větu v overrides. Ukrajinská data jsou řidší než česká;
aplikace raději zobrazí méně filmů než kulturně nepřesnou výplň.

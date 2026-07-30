# Jména, řeč generace a milníky vysílání

Fáze P5 zpřístupňuje tři malé sady s vysokou hodnotou rozpoznání, aniž by
vracela do běhu původní globální archivy. Všechny čtenářské věty, skóre i
citace jsou commitnuté před buildem. Běh aplikace nevolá síť ani model.

## Dětská jména

`babyNames` je záměrně pouze česká sada. Obsahuje ročníky 2010–2019 z
lednových hlášení narození a rok 2023 ze základního registru obyvatel podle
prezentace ČSÚ „Statistika dětských jmen“ z 30. května 2024.

Každý záznam nese `basis: "hlášení" | "registr"`. Věta z hlášení mluví o
jménech zachycených v lednovém hlášení daného ročníku. Věta z registru
popisuje, která jména dnes nejčastěji potkáme mezi registrovanými lidmi
narozenými v daném roce; nepředstírá pořadí při narození. Audit párování
metody a věty vynucuje.

Pro Ukrajinu se žádný soubor ani prázdná čtenářská plocha nevytváří, protože
se nepodařilo doložit otevřený kohortní zdroj s odpovídající přesností.

Zdroj je ČSÚ, licence CC BY 4.0. Atribuce se zobrazuje přímo u položky.

## Řeč generace

Původní kořenový `slang.json` je archiv americké angličtiny a veřejná zpráva
jej nepoužívá. Nové řezy `slang/cz.json` a `slang/ua.json` obsahují jen
výrazy s dohledatelným heslem ve Wikislovníku nebo Wiktionary pod CC BY-SA
4.0. Ukrajinské výrazy jsou pro českého čtenáře přepsané latinkou; veřejný
JSON neobsahuje cyrilici.

Pole `evidence: "published-meaning-editorial-period"` odděluje publikovaný
slovníkový význam od redakčně určeného časového okna. Časové okno se nevydává
za údaj slovníku. Tvrdá běhová brána připustí výraz jen tehdy, když se jeho
okno protne s věkem člověka 8–25 let.

## Milníky vysílání

`mediaMilestones` obsahuje třicet ručně vybraných českých a třicet
ukrajinských záznamů. Každá věta spojuje rok spuštění s konkrétní změnou
domácího sledování: první televizní program, společnou síť, dětský blok,
tematický kanál nebo průběžné zpravodajství.

Strukturované datum a identita jsou kontrolované přes Wikidata (CC0).
Historické technické přelomy, které Wikidata nenese dost podrobně, odkazují na
otevřeně licencovanou encyklopedickou stránku (CC BY-SA 4.0). Archivy ČT a
ČRo byly záměrně odmítnuty jako hromadný zdroj; jejich práva nejsou vhodná
pro odvozenou veřejnou datovou sadu.

Dětský pořad může vstoupit do `early-childhood` jen ve věku 3–10 let.
Ostatní milník může vstoupit do `everyday-day` jen ve věku 0–18 let.
Kapitola běžného dne drží původní rozpočet šesti položek a, pokud kandidáti
prošli všemi branami, rezervuje alespoň jedno místo pro cenu/mzdu nebo
mediální milník. Bez takového kandidáta se skládá tiše jako dříve.

## Soubory a regenerace

- zdrojová data: `dontwannaknow/src/data/{babyNames,slang,mediaMilestones}/`;
- běhové loadery: `dontwannaknow/src/data/{babyNames,slang,mediaMilestones}.ts`;
- citace: `dontwannaknow/src/data/provenance/{babyNames,slang,mediaMilestones}.json`;
- skóre: `dontwannaknow/src/data/relevance/{babyNames,slang,mediaMilestones}.json`;
- veřejné řezy: `dontwannaknow/src/data/public/<sada>.<země>.json`;
- kontrola citací: `dontwannaknow/scripts/gen-p5-provenance.mjs`;
- skládání a brány: `dontwannaknow/src/lib/facts.ts`, `dontwannaknow/src/lib/report.ts`.

Postup z adresáře aplikace:

```sh
npm run data:p5-provenance
npm run data:public
npm run relevance:prompt -- A
npm run relevance:prompt -- B
npm run relevance:prompt -- C
npm run relevance:batches -- --out /tmp/formative-reserve --only-missing
# Výsledky tří doslovně vytištěných průchodů sloučit přes relevance:merge.
npm run audit:content
npm run check
```

Při změně věty, rozsahu, metody nebo kontrolního bodu se změní obsahový
`recordKey`; staré skóre i citace se tím stanou osiřelé a audit build zastaví.

## Odložené pokračování

- Ukrajinská jména čekají na otevřený kohortní zdroj.
- Původní americký slang a interní mediální archiv zůstávají jen v `/dev`.
- Fotografie měst (`cityImages`, P6) byly dokončeny jako samostatná licenčně
  kontrolovaná pipeline. Její rozsah, regeneraci a skutečnou velikost popisuje
  [`data-city-images.md`](./data-city-images.md).

# P6 — dobové snímky měst

P6 nahrazuje původní výtvarný pás přesným dobovým snímkem města, pokud je pro
město a desetiletí narození dostupný bezpečný licencovaný podklad. Nadpis
zůstává „Město těch let“ a rozvržení používá původní `ArtStrip`. Když vhodný
snímek chybí, aplikace dál zobrazí původní století staré umění. Fotografie
nejsou kapitolou zprávy, nejsou historickým tvrzením o soukromém životě a
nevstupují do sdílecích obrázků ani PDF.

## Veřejný rozsah

Rozsah je pevně uložený v
`dontwannaknow/src/data/cityImages/scope.json`:

| Česko | Ukrajina |
| --- | --- |
| Praha | Kyjev |
| Brno | Charkov |
| Ostrava | Oděsa |
| Plzeň | Dnipro |
| Liberec | Doněck |
| Olomouc | Záporoží |
| České Budějovice | Lvov |
| Hradec Králové | Kryvyj Rih |
| Pardubice | Mykolajiv |
| Ústí nad Labem | Mariupol |

Veřejná sada obsahuje 19 snímků. Ústí nad Labem nemá bezpečný přesný snímek,
proto používá výtvarný fallback. U Lvova je navíc uložený vyřazený záznam
poválečných trosek; generátor jej nestahuje ani nepropíše do veřejné vrstvy.

## Zdroje a licence

Aktuální sada pochází z Wikimedia Commons. Generátor při každém spuštění čte
živá pole `imageinfo` a `extmetadata` z oficiálního MediaWiki API. Povolené
jsou pouze:

- public domain a Public Domain Mark,
- CC0,
- CC BY,
- CC BY-SA.

Zakázané jsou mimo jiné CC BY-NC, CC BY-ND, fair use, neznámá licence a
záznam bez zdrojové stránky. U každého veřejného snímku zůstává viditelná
atribuce, odkaz na licenci a odkaz na zdroj.

Europeana byla při implementaci prověřena jako možný druhý katalog, ale v
prostředí nebyl `EUROPEANA_KEY`. Sada proto neuvádí žádný obraz jako převzatý
z Europeany. Budoucí doplnění musí ověřit práva konkrétního objektu, ne pouze
licenci metadat API.

Kurátorský výběr je v
`dontwannaknow/src/data/cityImages/selection.json`. Normalizovaná metadata jsou
po generování v `src/data/cityImages/`, veřejné řezy v
`src/data/public/cityImages/`, provenance v
`src/data/provenance/cityImages.json` a odvozené WebP soubory v
`public/data/images/`.

Kurátorský vstup lze upravit také v `/dev` přes sadu „Dobové snímky měst“.
Editor zpřístupňuje název zdrojového souboru, český alternativní text a
popisek, přesnost data i explicitní vyřazení. Vývojový server zapisuje zpět do
`src/data/cityImages/selection.json` a zachová jeho `dateAccessed`; produkční
read-only režim stáhne celou obálku jako `city-images-selection.json`. Po
úpravě je vždy nutné znovu spustit `npm run data:city-images` a
`npm run data:public`, protože editor nemění odvozené WebP ani veřejné řezy
za běhu.

## Generování

Požadavkem je Node.js 22, `curl` a `cwebp`.

```bash
cd dontwannaknow
npm run data:city-images
npm run data:public
npm run audit:content
```

`npm run data:city-images`:

1. načte kurátorský výběr,
2. ověří aktuální metadata zdroje,
3. odmítne nepovolenou licenci nebo chybějící atribuci,
4. stáhne pouze nezařazené a nevyloučené položky,
5. vytvoří WebP s nejdelší hranou nejvýše 1 000 px,
6. adaptivně sníží rozměr a kvalitu tak, aby každý soubor měl nejvýše 80 KiB,
7. zapíše rozměry, velikost a provenance.

Generátor nepoužívá osobní data ani běhovou síťovou komunikaci. Datum přístupu
je součástí kurátorského vstupu, aby regenerace nedělala bezobsažné rozdíly.

## Běh aplikace a výkon

`src/data/cityImages.ts` obsahuje výslovnou mapu 20 dynamických importů. Po
vytvoření zprávy se načte pouze JSON vybraného města; z něj se použije jen
přesné desetiletí narození. Samotný obrázek je ze stejného originu a má
`loading="lazy"`, vlastní rozměry a rezervovaný prostor.

Produkční sada z 30. července 2026 má 19 WebP souborů a celkem 1 221 744 B.
Fotografie jsou záměrně vyňaté ze skóre faktů: nemění výběr textu, nepatří do
kapitol a mají vlastní licenční, citlivostní a velikostní brány.
Produkční build navíc automaticky selže, pokud vstupní JavaScript překročí
194 853 B nebo 61 373 B po gzip kompresi.

## Auditní brány

`npm run audit:content` selže při:

- změně pevného rozsahu 10 českých a 10 ukrajinských měst,
- zastaralém veřejném řezu,
- zveřejnění vyřazeného nebo obtížného snímku,
- licenci mimo allowlist,
- chybějící atribuci, licenci, zdroj, český alt nebo popisek,
- souboru nad 80 KiB nebo hraně nad 1 000 px,
- chybějícím nebo nepoužitým odvozeném souboru,
- nezdůvodněném vynechání skóre relevance.

Node testy navíc používají syntetické záznamy CC BY-NC, CC BY-ND a fair use,
aby zákaz nebyl závislý pouze na současných datech. Komponentové testy ověřují
lazy načtení Prahy pro rok 1953, viditelnou licenci a fallback bez síťového
požadavku.

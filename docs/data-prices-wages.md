# P2 — dobové ceny a mzdy

Datová sada `pricesWages` přidává do zprávy konkrétní měřítko každodenní
ekonomiky. Každý záznam je hotová česká věta, nikoli runtime šablona, a nese
strojově čitelné nominální hodnoty, úplnou citaci a commitnuté skóre relevance.

## Pokrytí

- Česko: čtyři kurátorované historické mzdové body (1955, 1970, 1989, 1999),
  šest mzdových bodů z DataStatu (2000–2025 po pěti letech) a jeden poměr ceny
  chleba ke mzdě za rok 2025.
- Ukrajina: sedm mzdových bodů z oficiálního Statistického ročníku Ukrajiny
  2018, včetně hodnoty pro rok 1991.
- Veřejný runtime načte jen soubor zvolené země a vybere nejvýše dva záznamy
  z období od narození do 18 let.

Malý počet záznamů je záměrný. Zařazují se pouze hodnoty, u nichž lze doložit
význam, jednotku, území a měnový kontext; mezery se nedopočítávají.

## Zdroje a licence

- [ČSÚ DataStat](https://csu.gov.cz/zakladni-informace-pro-pouziti-api-datastatu)
  pro novější průměrné hrubé mzdy a spotřebitelské ceny.
- [Historická mzdová řada ČSÚ](https://statistikaamy.csu.gov.cz/od-roku-2000-se-prumerna-mzda-temer-zdvojnasobila)
  pro kurátorované starší body.
- [Statistický ročník Ukrajiny 2018](https://www.ukrstat.gov.ua/druk/publicat/kat_u/2019/zb/11/zb_yearbook_2018.pdf),
  tabulky 3.24–3.25, pro ukrajinské mzdy.

Weby ČSÚ i Státní statistické služby Ukrajiny publikují obsah pod CC BY 4.0,
není-li u konkrétní položky uvedeno jinak. Každý záznam má vlastní položku v
`src/data/provenance/pricesWages.json`.

## Měnový a redakční kontext

- České záznamy protínající rok 1953 musí mít v poli `note` výslovné
  upozornění na měnovou reformu. Hodnota z roku 1955 se nepředstírá jako
  přesná částka z roku narození a předreformní peníze se s ní neporovnávají.
- Ukrajinské sovětské hodnoty používají vysvětlení, že ročenka uvádí rubl jako
  karbovanec. Statistický přepočet roku 1995 do hřiven neznamená, že byly
  hřivnové bankovky v oběhu už v roce 1995.
- Ukrajinské záznamy `price` a `ratio` se nesmějí překrývat s roky 1932–1934
  ani 1946–1947. Audit tuto podmínku vynucuje jako chybu sestavení.
- Věty používají „zhruba“, „kolem“ a „v průměru“. Z nominálních hodnot se
  nevyvozuje životní úroveň bez doloženého poměru.

## Aktualizace

```bash
npm run data:prices
npm run relevance:batches -- --out /tmp/tehdejsi-prices --dataset pricesWages
npm run data:public
npm run audit:content
```

Generátor načítá dvě zveřejněné tabulky DataStatu, znovu vytvoří kurátorované
řezy a provenienční sidecar. Po změně veřejných záznamů je nutné provést tři
průchody relevance A/B/C podle `docs/fact-scoring.md` a výsledky sloučit.

## Ověření

Testy kontrolují:

- tvrdé vyloučení ukrajinských cenových údajů z hladomorových oken,
- povinnou poznámku u českého období roku 1953,
- viditelný nový peněžní kontext ve zprávách Praha 1953 a Charkov 1991,
- deterministický výběr a shodné věty pro stejný profil.

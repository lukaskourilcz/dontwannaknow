# Tehdejší svět — stack, kapacita a náklady

Stav, oficiální ceníky a regionální rozpětí ověřeny 22. července 2026. Částky jsou v USD bez DPH a bez kurzového přepočtu. Vercel používá regionální ceny a Pro kredit, proto je pro skutečnou fakturu vždy rozhodující dashboard.

## Současná architektura

Tehdejší svět je statická React 19 aplikace ve strict TypeScriptu na Vite 7. V prohlížeči probíhá historické skládání zprávy, výpočet oblohy (`astronomy-engine`), Canvas obrázky i PDF (`jsPDF`). Produkce nemá aplikační server, Vercel Function, databázi, objektové úložiště, frontu, e-mailovou službu ani runtime AI.

Produkční build ověřený 22. července 2026 má 8,1 MB všech souborů dohromady. To není velikost jedné návštěvy: moduly zprávy, mapy, oblohy, umění, redakční konzole a PDF jsou rozdělené a načítají se podle potřeby. Podle gzip velikostí buildu je rozumný plánovací odhad:

- první návštěva formuláře: přibližně 0,4 MB;
- první vytvořená zpráva včetně vybraného umění: přibližně 0,7–1,5 MB navíc;
- PDF export: přibližně 0,5 MB knihovny a fontů navíc;
- opakovaná návštěva bývá levnější díky hashovaným souborům, CDN cache a ETagům.

Dva největší datové chunky mají 509 kB (`history`) a 502 kB (`cityFacts`) před gzipem a patří archivům redakčního `/dev` rozhraní. Nejsou součástí běžné veřejné cesty, ale stále jsou v nasazeném statickém balíčku a stáhnou se při otevření příslušných dat v `/dev`. Veřejný shell má 145 kB / 49 kB gzip, samostatný report 32 kB / 11 kB gzip, mapa 128 kB / 49 kB gzip a obloha 57 kB / 25 kB gzip. `jsPDF` (386 kB / 125 kB gzip) i jeho pomocné moduly zůstávají mimo počáteční cestu a načtou se až při exportu.

## Co stojí projekt dnes

Repozitář nedokáže zjistit váš skutečný Vercel tarif, cenu domény ani daňový režim. Při současné statické architektuře ale platí tento ověřitelný model:

| Položka | Současná technická potřeba | Cena |
| --- | --- | ---: |
| GitHub veřejný repozitář | zdrojový kód a standardní public Actions | $0/měsíc |
| Vercel Hobby | osobní, nekomerční provoz | $0/měsíc |
| Vercel Pro | profesionální nebo komerční provoz | $20/měsíc za vývojářské místo |
| Vercel Web Analytics | Hobby: prvních 50 000 událostí; Pro: průběžně účtované události | Hobby zdarma v limitu; Pro $3 / 100 000 událostí (poměrně) |
| Backend, databáze, storage, runtime AI | současná aplikace je nepoužívá | $0/měsíc |
| Doména | závisí na TLD a registrátorovi | doplnit skutečnou roční cenu ÷ 12 |

Pokud je projekt na Hobby, je osobní a zůstává pod limity, známý infrastrukturní náklad je tedy **$0 měsíčně plus doména**. Pokud je nebo bude komerční, list-price rozpočet začíná na **$20 měsíčně plus doména a $3 za každých 100 000 Web Analytics událostí**. Pro platform fee současně obsahuje $20 měsíčního usage creditu, který se podle aktuální dokumentace použije na způsobilou průběžnou spotřebu; skutečná faktura proto může zůstat na základních $20 i při menším objemu analytiky.

Zdroje: [Vercel Pricing](https://vercel.com/pricing), [Vercel Hobby limits](https://vercel.com/docs/plans/hobby), [Vercel Pro plan](https://vercel.com/docs/plans/pro-plan), [Vercel Web Analytics pricing](https://vercel.com/docs/analytics/limits-and-pricing), [Vercel regional pricing](https://vercel.com/docs/pricing/regional-pricing), [GitHub pricing](https://github.com/pricing) a [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Limity relevantní pro tuto aplikaci

Statická aplikace spotřebovává především Fast Data Transfer, Edge Requests a Web Analytics events. Serverové CPU a paměť jsou dnes nulové.

| Metrika | Hobby | Pro | Pro nad limit |
| --- | ---: | ---: | ---: |
| Fast Data Transfer | 100 GB/měsíc | 1 TB/měsíc | od $0,15/GB |
| Edge Requests | 1 milion/měsíc | 10 milionů/měsíc | od $2/milion |
| Web Analytics | 50 000 událostí/měsíc, poté se sběr pozastaví | $3 / 100 000 událostí od první události (poměrně) | stejná průběžná sazba |
| Základní tarif | $0 | $20/měsíc | Pro obsahuje $20 usage credit |

Hobby nepovoluje dokoupit nadlimitní provoz; po překročení se některá funkce omezí do obnovení limitu. Pro umožňuje průběžně účtovaný provoz. Vercel uvádí, že statické odpovědi spotřebují Edge Request i Fast Data Transfer bez ohledu na CDN cache, přesto ETagy a cache snižují opakované stahování dat uživatelem.

## Plánovací scénáře růstu

Následující tabulka není předpověď faktury. Používá konzervativní model jedné návštěvy s vytvořenou zprávou: **1 MB přenosu, 20 edge požadavků a 1 analytická událost**. Skutečná spotřeba závisí na podílu vytvořených zpráv, obrázcích, PDF, cache, robotech a počtu otevřených stránek.

| Návštěvy za měsíc | Přenos | Edge Requests | Analytics | Orientační list-price před Pro kreditem |
| ---: | ---: | ---: | ---: | --- |
| 10 000 | 10 GB | 0,2 mil. | 10 tis. | Hobby s velkou rezervou: $0 + doména |
| 40 000 | 40 GB | 0,8 mil. | 40 tis. | Hobby blízko request/analytics limitu |
| 100 000 | 100 GB | 2 mil. | 100 tis. | Přibližně $23: $20 tarif + $3 analytics + doména; kredit může spotřebu pokrýt |
| 500 000 | 500 GB | 10 mil. | 500 tis. | Přibližně $35: $20 tarif + $15 analytics + doména; kredit může spotřebu pokrýt |
| 1 000 000 | 1 TB | 20 mil. | 1 mil. | Přibližně $70 před Pro kreditem: $20 tarif + $20 requests + $30 analytics |
| 2 000 000 | 2 TB | 40 mil. | 2 mil. | Přibližně $290 před Pro kreditem: $20 + $150 transfer + $60 requests + $60 analytics |

Pro rychlý vlastní přepočet list-price před použitím Pro kreditu:

```text
měsíční cena ≈ $20
  + max(0, přenos_GB − 1000) × $0,15
  + max(0, edge_requests − 10 000 000) / 1 000 000 × $2
  + analytics_events / 100 000 × $3
```

Od způsobilé průběžné spotřeby může Vercel odečíst zahrnutý usage credit. Regionální sazby, daně, útoky a volitelné doplňky mohou cenu zvýšit. Při průměrné návštěvě 1,5 MB místo 1 MB vznikne u jednoho milionu návštěv přibližně dalších 500 GB přenosu, tedy nejméně asi $75 list-price navíc.

## Kdy změnit tarif nebo architekturu

### Přechod z Hobby na Pro

Přejděte před komerčním spuštěním nebo když se některá z metrik dva týdny po sobě dostane nad 70 % Hobby limitu. Pro tuto aplikaci bude prvním limitem pravděpodobně 50 000 analytických událostí nebo 1 milion edge požadavků, nikoli výpočet.

### Optimalizace před přidáním backendu

1. Změřit skutečný přenos formuláře, české a ukrajinské zprávy, porovnání a exportu.
2. Převést velké JPG umění na kvalitní WebP/AVIF varianty a používat rozměrové thumbnail soubory.
3. Dále rozdělit faktová data podle země a období, pokud jeden chunk překročí zhruba 200–250 kB gzip.
4. Oddělit produkční `/dev` od veřejného buildu, pokud archivní data začnou výrazně zvětšovat nasazení.
5. Zachovat dlouhé cache hlavičky pro hashované assety a sledovat LCP, INP a chybovost exportu na slabších mobilech.

Backend nesnižuje cenu současného statického provozu. Přidává smysl až pro účty, uložené zprávy, týmovou editaci dat, synchronizaci mezi zařízeními nebo individuální serverové OG obrázky.

### Pokud přibude serverová vrstva

Na Pro jsou podle aktuálního regionálního ceníku Vercel Functions účtované od $0,128 za aktivní CPU hodinu, $0,0106 za GB-hodinu paměti a po zahrnutém milionu invokací od $0,60 za další milion. Vercel Blob začíná po zahrnutém objemu na $0,023/GB úložiště a přenos od $0,05/GB. Databáze, e-mail, zálohy a moderace by byly další samostatné položky; jejich cenu je vhodné spočítat až nad konkrétní funkcí a retenčním modelem.

## Co sledovat každý měsíc

- skutečný Vercel tarif, fakturu a usage credit;
- návštěvy, Web Analytics events a podíl botů;
- Fast Data Transfer a Edge Requests podle cesty;
- velikost počátečního JS/CSS a fontů;
- CZ/UA faktové chunky, mapu a `/dev` archivní chunky;
- přenos dobových obrázků a frekvenci PDF exportů;
- LCP, INP, chyby JavaScriptu a dobu prvního vytvoření PDF na mobilu;
- cenu a datum obnovy domény.

Analytika nesmí obsahovat jméno, datum, rok, město, vztah, variantu, query, fragment ani text zobrazených faktů. Nákladový model tuto ochranu soukromí nemění.

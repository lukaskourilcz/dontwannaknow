# Tehdejší svět — stack, kapacita a náklady

Stav a ceníky ověřeny 21. července 2026. Částky jsou v USD bez DPH a bez kurzového přepočtu. Vercel může používat regionální ceny a kredity, proto je pro skutečnou fakturu vždy rozhodující dashboard.

## Současná architektura

Tehdejší svět je statická React 19 aplikace ve strict TypeScriptu na Vite 7. V prohlížeči probíhá historické skládání zprávy, výpočet oblohy (`astronomy-engine`), Canvas obrázky i PDF (`jsPDF`). Produkce nemá aplikační server, Vercel Function, databázi, objektové úložiště, frontu, e-mailovou službu ani runtime AI.

Aktuální produkční build má přibližně 7,4 MB všech souborů dohromady. To není velikost jedné návštěvy: moduly zprávy, mapy, oblohy, umění, redakční konzole a PDF jsou rozdělené a načítají se podle potřeby. Podle gzip velikostí buildu je rozumný plánovací odhad:

- první návštěva formuláře: přibližně 0,4 MB;
- první vytvořená zpráva včetně vybraného umění: přibližně 0,7–1,5 MB navíc;
- PDF export: přibližně 0,5 MB knihovny a fontů navíc;
- opakovaná návštěva bývá levnější díky hashovaným souborům, CDN cache a ETagům.

Dva největší datové chunky kolem 0,5 MB patří archivům redakčního `/dev` rozhraní. Nejsou součástí běžné veřejné cesty, ale stále jsou v nasazeném statickém balíčku a stáhnou se při otevření příslušných dat v `/dev`.

## Co stojí projekt dnes

Repozitář nedokáže zjistit váš skutečný Vercel tarif, cenu domény ani daňový režim. Při současné statické architektuře ale platí tento ověřitelný model:

| Položka | Současná technická potřeba | Cena |
| --- | --- | ---: |
| GitHub veřejný repozitář | zdrojový kód a standardní public Actions | $0/měsíc |
| Vercel Hobby | osobní, nekomerční provoz | $0/měsíc |
| Vercel Pro | profesionální nebo komerční provoz | $20/měsíc za vývojářské místo |
| Vercel Web Analytics | Hobby do 50 000 událostí/měsíc; Pro do 100 000 | zahrnuto v limitu |
| Backend, databáze, storage, runtime AI | současná aplikace je nepoužívá | $0/měsíc |
| Doména | závisí na TLD a registrátorovi | doplnit skutečnou roční cenu ÷ 12 |

Pokud je projekt na Hobby, je osobní a zůstává pod limity, známý infrastrukturní náklad je tedy **$0 měsíčně plus doména**. Pokud je nebo bude komerční, bezpečný současný rozpočet začíná na **$20 měsíčně plus doména**.

Zdroje: [Vercel Pricing](https://vercel.com/pricing), [Vercel Hobby limits](https://vercel.com/docs/plans/hobby), [Vercel Web Analytics](https://vercel.com/docs/analytics), [GitHub pricing](https://github.com/pricing) a [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Limity relevantní pro tuto aplikaci

Statická aplikace spotřebovává především Fast Data Transfer, Edge Requests a Web Analytics events. Serverové CPU a paměť jsou dnes nulové.

| Metrika | Hobby | Pro | Pro nad limit |
| --- | ---: | ---: | ---: |
| Fast Data Transfer | 100 GB/měsíc | 1 TB/měsíc | od $0,15/GB |
| Edge Requests | 1 milion/měsíc | 10 milionů/měsíc | od $2/milion |
| Web Analytics | 50 000 událostí/měsíc | 100 000 událostí/měsíc | $3/100 000 událostí |
| Základní tarif | $0 | $20/měsíc | Pro obsahuje $20 usage credit |

Hobby nepovoluje dokoupit nadlimitní provoz; po překročení se některá funkce omezí do obnovení limitu. Pro umožňuje průběžně účtovaný provoz. Vercel uvádí, že statické odpovědi spotřebují Edge Request i Fast Data Transfer bez ohledu na CDN cache, přesto ETagy a cache snižují opakované stahování dat uživatelem.

## Plánovací scénáře růstu

Následující tabulka není předpověď faktury. Používá konzervativní model jedné návštěvy s vytvořenou zprávou: **1 MB přenosu, 20 edge požadavků a 1 analytická událost**. Skutečná spotřeba závisí na podílu vytvořených zpráv, obrázcích, PDF, cache, robotech a počtu otevřených stránek.

| Návštěvy za měsíc | Přenos | Edge Requests | Analytics | Orientační stav |
| ---: | ---: | ---: | ---: | --- |
| 10 000 | 10 GB | 0,2 mil. | 10 tis. | Hobby s velkou rezervou: $0 + doména |
| 40 000 | 40 GB | 0,8 mil. | 40 tis. | Hobby blízko request/analytics limitu |
| 100 000 | 100 GB | 2 mil. | 100 tis. | Pro: základ přibližně $20 + doména |
| 500 000 | 500 GB | 10 mil. | 500 tis. | Pro: $20 základ; analytics list-price navíc asi $12 před kredity |
| 1 000 000 | 1 TB | 20 mil. | 1 mil. | Přibližně $67 před kredity: $20 tarif + $20 requests + $27 analytics |
| 2 000 000 | 2 TB | 40 mil. | 2 mil. | Přibližně $287 před kredity: $20 + $150 transfer + $60 requests + $57 analytics |

Pro rychlý vlastní přepočet na Pro:

```text
měsíční cena ≈ $20
  + max(0, přenos_GB − 1000) × $0,15
  + max(0, edge_requests − 10 000 000) / 1 000 000 × $2
  + max(0, analytics_events − 100 000) / 100 000 × $3
```

Od výsledku může Vercel odečíst zahrnutý usage credit; regionální sazby, daně, útoky a volitelné doplňky jej mohou zvýšit. Při průměrné návštěvě 1,5 MB místo 1 MB vznikne u jednoho milionu návštěv přibližně dalších 500 GB přenosu, tedy asi $75 list-price navíc.

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

Na Pro jsou podle aktuálního ceníku po zahrnutém objemu Vercel Functions účtované od $0,128 za aktivní CPU hodinu, $0,0106 za GB-hodinu paměti a $0,60 za milion invokací. Vercel Blob začíná po zahrnutém objemu na $0,023/GB úložiště a přenos od $0,05/GB. Databáze, e-mail, zálohy a moderace by byly další samostatné položky; jejich cenu je vhodné spočítat až nad konkrétní funkcí a retenčním modelem.

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

# Tehdejší svět — stack a škálování

Tehdejší svět je statická React 19 aplikace ve strict TypeScriptu na Vite 7. Výpočet oblohy (`astronomy-engine`), skládání zprávy, sdílené obrázky i PDF (`jsPDF`) probíhají v prohlížeči. Neexistuje backend, databáze, fronta ani runtime historické či AI API.

Hlavní škálovací náklad jsou CDN přenosy statických dat a obrázků, ne serverový výpočet. Formulář a katalog měst jsou oddělené od velkých faktových souborů; výsledková cesta, vizuální moduly a PDF jsou lazy-loaded. Při dalším růstu dat je prvním krokem country/module-level splitting a měření LCP, nikoli zavádění aplikačního serveru.

Pro malý nekomerční provoz může projekt fungovat na bezplatném statickém hostingu. Konkrétní limity, ceny a obchodní podmínky hostingu je nutné ověřit v aktuální dokumentaci poskytovatele před komerčním spuštěním; nejsou stabilní součástí architektury.

Sledovat je vhodné zejména:

- velikost počátečního JS/CSS a fontů;
- country facts, `cityFacts` a mapový chunk po vytvoření zprávy;
- přenos dobových obrázků;
- dobu prvního vytvoření PDF na slabším mobilu;
- cache hit rate a reálné Core Web Vitals po nasazení.

Soukromí má přednost před podrobnou produktovou telemetrií: analytika nesmí obsahovat datum, rok, jméno, město, vztah, variantu, fragment ani text zobrazených faktů.

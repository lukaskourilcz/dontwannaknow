# Tehdejší svět — co je potřeba z vaší strany

V repozitáři jsou dokončené všechny proveditelné body rebrandingu a produktové reimplementace. Tento seznam obsahuje jen kroky, které vyžadují přístup k vašim účtům, znalost finální domény, právní rozhodnutí nebo test na skutečném zařízení. Značky `[imp:1–5]` určují prioritu pro OwnDashboard; všechny položky záměrně patří vlastníkovi.

## Před veřejným spuštěním

- [ ] **Připojit produkční doménu** — Vybrat finální adresu a doplnit absolutní `og:url`, `og:image` a canonical metadata. [imp:5] [owner:me] [time:1h] [kind:content]

## Značka a externí účty

- [ ] **Přejmenovat GitHub repozitář** — Změnit `dontwannaknow` na `tehdejsi-svet`, ověřit automatické přesměrování clone URL a případně upravit lokální remote. [imp:3] [owner:me] [time:1h] [kind:deploy]
- [ ] **Přejmenovat Vercel projekt** — Změnit název na `tehdejsi-svet` a ověřit doménu i Git integraci. [imp:3] [owner:me] [time:1h] [kind:deploy]
- [ ] **Ověřit statickou OG kartu** — Po nasazení absolutních URL zkontrolovat Facebook Sharing Debugger, LinkedIn Post Inspector a náhled X. [imp:3] [owner:me] [time:1h] [kind:content]


## Produkční ověření

- [ ] **Ověřit hero na starším telefonu** — Zkontrolovat plynulost, teplotu zařízení a spotřebu baterie; emulátor ani SwiftShader je neukážou. Když bude scéna těžká, snížit `SHEET_COUNT` v `dontwannaknow/src/components/HeroScene.tsx`. [imp:3] [owner:me] [time:30m] [kind:decision]
- [ ] **Ověřit omezení pohybu na zařízení** — Zapnout systémovou volbu a zkontrolovat, že hero rám ukáže jediný statický snímek bez animace. [imp:2] [owner:me] [time:30m] [kind:decision]

## Portfolio a náhledy

- [ ] **Obnovit animovaný náhled projektu** — Nahrát `media/preview.webm`, `preview.mp4` a `preview-poster.png`; současný záznam ukazuje landing bez hero scény. Spustit `preview-video` skill. [imp:2] [owner:ai] [time:30m] [kind:content]

## Volitelné datové rozšíření

Městské fotografie P6 byly schváleny a nasazeny v úsporné podobě: 19
licenčně ověřených WebP pro 20 měst zabírá celkem 1 221 744 B. Podrobnosti
jsou v [`docs/data-city-images.md`](./docs/data-city-images.md).

- [ ] **Získat volitelný klíč Europeana** — Použít jej jen pro budoucí rozšíření kurátorského katalogu. Současná sada je úplná bez něj a používá pouze Wikimedia Commons; klíč neposílat do repozitáře. [imp:1] [owner:me] [time:30m] [kind:setup]

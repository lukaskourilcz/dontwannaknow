# Tehdejší svět — co je potřeba z vaší strany

V repozitáři jsou dokončené všechny proveditelné body rebrandingu a produktové reimplementace. Tento seznam obsahuje jen kroky, které vyžadují přístup k vašim účtům, znalost finální domény, právní rozhodnutí nebo test na skutečném zařízení. Značky `[imp:1–5]` určují prioritu pro OwnDashboard; všechny položky záměrně patří vlastníkovi.

## Před veřejným spuštěním

- [ ] Vybrat a připojit finální produkční doménu. Poslat její přesnou adresu k doplnění absolutních `og:url`, `og:image` a canonical metadat. `[imp:5]` `[owner:me]` `[time:1h]` `[kind:content]`

## Značka a externí účty

- [ ] Přejmenovat GitHub repozitář z `dontwannaknow` na `tehdejsi-svet`; po změně ověřit automatické přesměrování clone URL a případně upravit lokální remote. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Přejmenovat Vercel projekt na `tehdejsi-svet` a zkontrolovat, že změna neodpojila doménu ani Git integraci. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Ověřit finální statickou OG kartu ve Facebook Sharing Debuggeru, LinkedIn Post Inspectoru a náhledu X až po nasazení absolutních URL. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:content]`

## Portfolio (27. 7. 2026)

Položka v portfoliu se přejmenovala z „Don't Wanna Know“ na Tehdejší svět v obou
jazycích a animovaný náhled byl nahraný znovu z aktuálního designu.


## Produkční ověření

- [ ] Otevřít landing na skutečném starším telefonu a ověřit hero scénu v three.js: plynulost, teplotu zařízení a spotřebu baterie. Emulátor ani SwiftShader tohle neukážou. Když bude scéna těžká, snížit `SHEET_COUNT` v `dontwannaknow/src/components/HeroScene.tsx`. `[imp:3]` `[owner:me]` `[time:30m]` `[kind:decision]`
- [ ] Zapnout si v systému „omezit pohyb“ a zkontrolovat, že hero rám ukáže jediný statický snímek bez animace. `[imp:2]` `[owner:me]` `[time:30m]` `[kind:decision]`

## Portfolio a náhledy

- [ ] Nahrát animovaný náhled projektu znovu (`media/preview.webm`, `preview.mp4`, `preview-poster.png`) — současný záznam ukazuje landing bez hero scény. Spustit `preview-video` skill. `[imp:2]` `[owner:ai]` `[time:30m]` `[kind:content]`

## Právní a redakční rozhodnutí

- [ ] **Rozhodnout o městských fotografiích P6** — Potvrdit nebo odmítnout commitnutí odvozených fotografií pro zhruba 20 měst; horní odhad je 32 MB. Bez výslovného souhlasu se P6 nespouští. `[imp:3]` `[owner:me]` `[time:30m]` `[kind:decision]`

## Volitelné po získání reálného provozu


Aktuální cenový a kapacitní model je v [`scaling.md`](./scaling.md). Částky jsou odhady, dokud v něm nedoplníte skutečný Vercel tarif, cenu domény a produkční spotřebu.

## Vývojářské nástroje


```sh
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
rtk init --global
```

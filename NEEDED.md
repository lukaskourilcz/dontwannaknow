# Tehdejší svět — co je potřeba z vaší strany

V repozitáři jsou dokončené všechny proveditelné body rebrandingu a produktové reimplementace. Tento seznam obsahuje jen kroky, které vyžadují přístup k vašim účtům, znalost finální domény, právní rozhodnutí nebo test na skutečném zařízení. Značky `[imp:1–5]` určují prioritu pro OwnDashboard; všechny položky záměrně patří vlastníkovi.

## Před veřejným spuštěním

- [ ] Výchozí větev GitHub repozitáře už je `main`; nastavit pro ni ochranu a vyžadovat úspěšný Vercel/CI check před sloučením. GitHub API 22. července 2026 potvrdilo, že ochrana zatím zapnutá není. `[imp:5]` `[owner:me]` `[time:2h]` `[kind:legal]`
- [ ] Rozhodnout, zda je provoz osobní a nekomerční. Vercel Hobby je určený jen pro takové použití; před komerčním spuštěním přejít na Pro nebo jiný hosting s odpovídajícími podmínkami. `[imp:5]` `[owner:me]` `[time:2h]` `[kind:legal]`
- [ ] Vybrat a připojit finální produkční doménu. Poslat její přesnou adresu k doplnění absolutních `og:url`, `og:image` a canonical metadat. `[imp:5]` `[owner:me]` `[time:1h]` `[kind:content]`
- [ ] Ve Vercelu nastavit upozornění na 50 %, 75 % a 90 % limitů a pro placený plán také pevný měsíční strop. `[imp:4]` `[owner:me]` `[time:20m]` `[kind:setup]`

## Značka a externí účty

- [ ] Přejmenovat GitHub repozitář z `dontwannaknow` na `tehdejsi-svet`; po změně ověřit automatické přesměrování clone URL a případně upravit lokální remote. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Přejmenovat Vercel projekt na `tehdejsi-svet` a zkontrolovat, že změna neodpojila doménu ani Git integraci. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Aktualizovat název, doménu a obrázek ve vyhledávačích, Search Console, analytice a případných sociálních profilech. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Ověřit finální statickou OG kartu ve Facebook Sharing Debuggeru, LinkedIn Post Inspectoru a náhledu X až po nasazení absolutních URL. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:content]`
- [ ] Hero média jsou nasazená. Pro zbývající OG, kapitolové a share podklady nejprve vyhledat aktuální levné nebo bezplatné generátory a ověřit jejich cenu, licenci, soukromí, watermark a exportní rozlišení podle [`docs/generated-media.md`](./docs/generated-media.md). Bez dalšího výstupu ponechat funkční CSS/SVG fallbacky; nevytvářet placeholdery. `[imp:2]` `[owner:ai]` `[time:2h]` `[kind:legal]`

## Produkční ověření

- [ ] Na produkční doméně vytvořit českou i ukrajinskou zprávu, porovnání dvou lidí a zprávu obnovenou ze sdíleného odkazu. Ověřit, že odkaz standardně neobsahuje jméno. `[imp:5]` `[owner:me]` `[time:1h]` `[kind:content]`
- [ ] Na produkci stáhnout všechny tři formáty obrázku a památeční PDF; zkontrolovat českou diakritiku, oblohu a zalomení dlouhých názvů. `[imp:4]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Ručně otestovat Mobile Safari, Mobile Chrome a Firefox na reálných zařízeních, včetně šířky 320 px, zvětšení textu a orientace na šířku. `[imp:4]` `[owner:me]` `[time:20m]` `[kind:setup]`
- [ ] Provést klávesnicový a screen-reader smoke test formuláře, sbalených kapitol, sdílení a `/dev` dialogu. `[imp:4]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Ověřit v produkci CSP a další hlavičky pomocí DevTools nebo securityheaders.com; zejména že se načte Vercel Analytics a neodchází query ani fragment. `[imp:3]` `[owner:me]` `[time:1h]` `[kind:deploy]`

## Právní a redakční rozhodnutí

- [ ] Potvrdit, zda pro váš způsob nasazení potřebujete zásady ochrany soukromí nebo informační text k Vercel Web Analytics. Aplikace nepoužívá vlastní profilovou telemetrii, ale právní posouzení závisí na provozovateli a jurisdikci. `[imp:4]` `[owner:me]` `[time:2h]` `[kind:legal]`
- [ ] Před komerční propagací doložit licence použitých dat, fontů a lokálních kopií uměleckých děl; repozitář eviduje zdroje, nenahrazuje však právní kontrolu. `[imp:4]` `[owner:me]` `[time:2h]` `[kind:legal]`
- [ ] Pokud budete chtít zveřejnit archivní `history.json` nebo přidat další země, zajistit jednotlivou redakční a zdrojovou kontrolu těchto záznamů. Archiv nyní není součástí veřejné zprávy. `[imp:2]` `[owner:me]` `[time:20m]` `[kind:setup]`

## Volitelné po získání reálného provozu

- [ ] Po prvním měsíci zapsat do `stack-and-scaling.md` skutečný tarif, cenu domény, měsíční návštěvy, Fast Data Transfer, Edge Requests a Web Analytics events. `[imp:2]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] Rozhodnout podle reálných dat, zda potřebujete Web Analytics Plus, Speed Insights nebo vlastní anonymní produktové události. Žádná událost nesmí obsahovat jméno, datum, rok, město, vztah, variantu, fragment ani text faktu. `[imp:2]` `[owner:me]` `[time:1h]` `[kind:content]`
- [ ] Zvažovat backend teprve tehdy, pokud vznikne potvrzený požadavek na účty, uložené zprávy, týmovou redakci nebo individuální serverové OG náhledy. `[imp:1]` `[owner:me]` `[time:1h]` `[kind:content]`

Aktuální cenový a kapacitní model je v [`stack-and-scaling.md`](./stack-and-scaling.md). Částky jsou odhady, dokud v něm nedoplníte skutečný Vercel tarif, cenu domény a produkční spotřebu.

## Vývojářské nástroje

- [ ] **Nainstalovat a inicializovat RTK (`rtk-ai/rtk`)** — RTK nešlo nastavit z webové relace Claude Code, protože jeho GitHub host pro stahování je mimo síťový allowlist relace (`github.com/rtk-ai/rtk` i jeho release binárky vrací HTTP 403). Nastavte ho lokálně doma příkazy níže a poté ho povolte pro tento repozitář podle `rtk --help` / dokumentace RTK (přesný příkaz pro jednotlivý repozitář zde není uveden, protože se nástroj v sandboxu nenainstaloval). `[imp:2]` `[owner:me]` `[time:1h]` `[kind:deploy]`
- [ ] **Zapnout Vercel Web Analytics pro tento projekt** — v projektu na Vercelu zapni Web Analytics, aby OwnDashboard v přehledu projektu ukazoval návštěvníky a zobrazení stránek (načítá je přes Vercel API podle tohoto repozitáře). `[imp:2]` `[owner:me]` `[time:15m]` `[kind:setup]`

```sh
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
rtk init --global
```

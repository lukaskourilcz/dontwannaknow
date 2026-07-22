# Generovaná média — integrační kontrakt

Tento soubor je produkční brief a manifest pro statická dekorativní média. Higgsfield MCP byl 22. července 2026 připojen a jeho modely, rozpočet i generační schéma byly ověřeny. Samotné generování však účet nepovolil: aktivní Plus trial měl `trial_credits: 0` a text-to-image endpointy odmítly job ještě před vytvořením výstupu. Nejsou zde proto placeholder assety ani náhrady z jiné generativní služby.

## Stav produkčního pokusu

- `balance` hlásil 10 webových kreditů a plán Plus; MCP billing následně potvrdil vyčerpané trial MCP kredity.
- `recraft_v4_1` i `z_image` úspěšně vrátily cenový preflight, ale produkční volání skončilo `only_website_usage_on_trial_is_available`.
- `soul_location` dvakrát selhal před založením jobu obecnou chybou.
- Request ID pro podporu: Recraft `62d3f1f1-57e0-44ad-8e75-51c56d858ac7`, `5dc94c6a-cb61-4f79-b95e-e3b5df301f39`, `22f74d8f-ef1b-948c2f9006b2`; Z Image `cbc5755f-a2d7-4437-9704-7f3a65be1674`, `4d71ed16-afc8-4969-98b3-ad09e05f310d`, `24d07916-b6a5-4481-8f2f-0ea60af19265`; Soul Location `4ec3bee3-3d05-4233-b10b-6d6b80a2ce70`, `c01eae26-5c7e-40eb-baeb-3acaa77a22d1`.
- Webová generace byla zkusmo otevřena ve stejném prostředí, ale jediný dostupný in-app browser se ani po opakování nepřipojil k webview. Nebyla použita jiná služba ani browser workaround.
- V repozitáři nevznikl žádný generovaný soubor. Stávající CSS/SVG fallbacky zůstávají produkčním stavem.

## Neměnná art direction

Současná archivní koláž: teplý nepovrchově zestárlý papír, lesní zelená, tlumená korálová, uhlový inkoust, drobný modrošedý geografický akcent a světlý minerální tón. Ploché vrstvy, jemné mapové kontury, souhvězdnicové linky, kalendářní značky, silný negativní prostor a mělká 2.5D hloubka. Bez lidí nebo pouze neurčité ruce/siluety bez tváří. Bez textu, log, UI, vlajek, falešných dokumentů, fotografií, map, hvězd a historických artefaktů.

Produkční asset nesmí být vydáván za historický doklad. Veškerý text, data, mapa, hvězdy a UI zůstávají vykreslené kódem.

## Připravené integrační sloty

| Asset ID | Budoucí umístění | Poměr a text-safe zóna | Účel a fallback |
| --- | --- | --- | --- |
| `hero-editorial` | landing, dekorativní media slot vedle/za tezí | desktop 4:5 a mobile 4:3; horní levá třetina prázdná | Zprostředkovat místo, čas, kulturu, mapu a oblohu. Bez assetu layout používá čistý CSS archivní motiv. |
| `og-foundation` | `public/media/og-foundation.*`, podklad `og-image-source.svg` | 1200×630; bezpečný střed a levá textová třetina | Obecný sociální náhled bez osobních dat. Text a logo budou přidány deterministicky. |
| `chapter-birth` | volitelný background motif obálky/začátku | 16:9 + 4:5 crop, pravá polovina bezpečná | Abstraktní kalendář a souhvězdí; fallback tvoří skutečný SkyMap nebo typografický rok. |
| `chapter-everyday` | dělicí pás běžného dne | 3:1 + 1:1 crop | Neidentifikující fragmenty běžných materiálů; fallback je hairline/editorial rhythm. |
| `chapter-culture` | dospívání a kultura | 3:1 + 1:1 crop | Abstraktní tiskové vrstvy bez děl, obalů a osob; fallback je reálný ArtStrip. |
| `chapter-borders` | proměny států | 3:1 + 1:1 crop | Nefaktické abstraktní kontury; fallback je skutečný WorldMap. |
| `comparison-divider` | Dva tehdejší světy | 3:1 + 1:1 crop | Dvě proplétající se časové osy bez národních systémů; fallback je typografická dvojice. |
| `share-paper` | canvas share cards | bezešvá/velká 2400×1800 textura | Velmi jemná textura pod kódovým textem. Bez assetu canvas používá plnou papírovou barvu a kódové linky. |
| `hero-loop` | volitelná landing motion vrstva | max. 3 s, WebM + MP4 + poster | Pomalé kreslení kontur/pohyb vrstev. Vypnuto pro reduced motion; statický poster povinný. |

## Produkční brief a negativa

Každý asset musí mít před generováním potvrzené umístění, poměr, mobilní crop, bezpečnou zónu a statický fallback. Základ negativního promptu: žádný text, watermark, UI, logo, čitelný dokument, mapa vydávaná za geografii, hvězdná mapa, státní symbol, vlajka, vojenský motiv, propaganda, válka, hladomor, okupace, fotografie rodiny, lidská tvář, stereotypní český nebo ukrajinský předmět, neon, glow, sparkle, 3D floating object, film grain, špína, poškozený papír, sepia.

Pro každou významnou kompozici se mají vytvořit nejméně tři odlišné směry. Zamítnout generovaný text, loga, rozbité vrstvy, nemožné přehyby, národní symboly, kulturní stereotypy, fake UI a nejasnou hranici mezi dekorací a důkazem.

### Připravené hero směry

Všechny tři směry používají text-safe zónu v horní levé třetině a společný negativní prompt níže. Po odemknutí MCP kreditů je generovat odděleně, aby nešlo jen o náhodné varianty jednoho layoutu.

1. **Editorial folio:** top-down zátiší z nepotištěných vrstev papíru; vertikální zelené folio, minerální list a malá korálová registrační značka; abstraktní nefaktické kontury a řídké bodové spojnice; vizuální váha vpravo dole.
2. **Folded place and time:** jeden výrazný abstraktní přehyb přes zelenou plochu, minerální papírová vrstva, dvě korálové crop značky a několik nefaktických tras; velká nepřerušená levá textová plocha.
3. **Index geometry:** současný systém posunutých nepotištěných karet, jeden seříznutý roh, zelený oblouk, krátká korálová linka a jemné spojnice času; přesná asymetrická sazba bez retro stylizace.

Společný negativní prompt: žádný čitelný text, písmena, číslice, watermark, UI, logo, screenshot, noviny, historický dokument, fotografie, portrét, tvář, ruce, faktická mapa, rozpoznatelná geografie, skutečná hvězdná mapa, státní symbol, vlajka, armáda, propaganda, válka, hladomor, okupace, politická osobnost, rodinná fotografie, národní kroj, český nebo ukrajinský stereotyp, cizí značka, neon, glow, sparkle, floating 3D, hodiny, přesýpací hodiny, magická kniha, kufr, rodokmen, portál, film grain, špína, škrábance, poškozený papír, sepia ani scrapbook clutter.

## Manifest po odemknutí produkce

Každý vybraný soubor doplnit o: nástroj a verzi, prompt, negativní prompt, reference, variantu, poznámky k zamítnutým variantám, rozměry, formát, velikost, responzivní varianty, motion fallback, alt klasifikaci, omezení použití a přesný postup regenerace. Statické obrázky exportovat do AVIF/WebP, motion do WebM/MP4 s posterem, rozměry uvést v HTML a mimo hero načítat lazy. Čistě dekorativní média mají prázdný `alt`.

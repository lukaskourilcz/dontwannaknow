# Generovaná média — integrační kontrakt

Tento soubor připravuje budoucí Higgsfield produkci. V aktuální relaci nebyl Higgsfield MCP dostupný a práce je záměrně odložená. Nejsou zde placeholder assety ani náhrady z jiné generativní služby.

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

## Manifest po budoucí produkci

Každý vybraný soubor doplnit o: nástroj a verzi, prompt, negativní prompt, reference, variantu, poznámky k zamítnutým variantám, rozměry, formát, velikost, responzivní varianty, motion fallback, alt klasifikaci, omezení použití a přesný postup regenerace. Statické obrázky exportovat do AVIF/WebP, motion do WebM/MP4 s posterem, rozměry uvést v HTML a mimo hero načítat lazy. Čistě dekorativní média mají prázdný `alt`.

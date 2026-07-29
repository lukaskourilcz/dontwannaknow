# Tehdejší svět — vizuální systém

Zdroj pravdy je `src/styles.css`. Rozhraní má působit jako současná osobní publikace: klidné, lidské a redakční, bez sepia filtru, muzejní strohosti nebo šablonovitého „AI“ lesku.

## Základní tokeny

```yaml
brand: Tehdejší svět
mood: [warm, human, editorial, calm, personal]
color:
  paper: "#f7f2e8"
  surface: "#fffdf9"
  raised: "#fffefa"
  sunk: "#ece5d8"
  ink: "#18201d"
  muted: "#4d5f59"
  rule: "#d5cdbf"
  green: "#1e3f39"
  coral: "#d9684f"
type:
  display: "Fraunces Variable"
  editorial: "Newsreader Variable"
  interface: "Instrument Sans Variable"
radius:
  control: "0.4rem"
  editorial-surface: "0.75rem"
  dialog: "1rem"
motion:
  easing: "cubic-bezier(.22, 1, .36, 1)"
  fast: "120ms"
  standard: "220ms"
  reveal: "480ms"
```

Všechny fonty jsou samostatně hostované v produkčním balíčku. Fraunces patří hlavním otázkám a obálce, Newsreader delším redakčním pasážím a Instrument Sans ovládacím prvkům a metadatům.

Mezery používají stupnici `0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5, 7rem`. Sémantické šířky jsou 39rem pro formulář, 43rem pro čtení, 72rem pro zprávu a 80rem pro široký shell. Stavy info, úspěch, varování, chyba, obtížný kontext, review, ověřeno a chybějící data mají vlastní barvu i textový nebo tvarový signál.

## Kompozice

- Teplé papírové pozadí drží celý produkt pohromadě; karty používají lehčí povrch, jemnou linku a prostor, nikoli generické gradienty a množství stínů.
- Tmavě zelená je strukturální barva značky, korálová zvýrazňuje hlavní akci, zaostření a drobné navigační body.
- Obálka je výrazná, ale ne překryvná. Navigace ani nástroje výsledku nejsou sticky, aby na malých displejích nezakrývaly obsah.
- Kapitoly jsou odlišeny číslováním, nadpisem a rytmem. Typ obsahu nesmí být rozpoznatelný jen barvou.
- Na desktopu nese kapitolu redakční sloupec: číslo, název a úvod vlevo (ukotvené při čtení), záznamy ve dvou měřených sloupcích vpravo. Vodorovný prostor patří struktuře, nikoli roztaženému textu.
- Dobový záznam je běžně jedna až dvě věty, proto se nikdy nesází přes celou šířku zprávy. Míra řádku zůstává v rozsahu ~45–55 znaků; zdůraznění nese typografie a zelená linka, ne šířka. Přes obě kolonky jdou jen citlivá vsuvka, poznámka o chybějících datech a osamocený záznam kapitoly — a i u nich text drží měřenou míru a metadata visí u pravého okraje, aby byla linka ukotvená obsahem na obou koncích.
- Citlivý historický kontext je sbalený, jasně pojmenovaný a nikdy nesdílí vizuální skupinu s odlehčenou kartou.
- Dobový detail, místní souvislost, kultura, kontrast, zvýraznění, obtížný kontext a chybějící data jsou varianty jednoho metadata-driven reportového prvku, ne samostatné konkurenční karty.
- Tmavé plochy používají explicitní `on-dark` role. Korálové primární tlačítko používá tmavý inkoust, aby běžný text splnil AA kontrast.

## Responzivní pravidla

Rozložení musí fungovat od 320 px bez vodorovného posuvu. Na desktopu se úvodní obrazovka skládá tak, aby se od výšky okna 900 px vešla do prvního pohledu celá: hero rám zabírá celou šířku levého sloupce, jeho výška je odvozená od výšky okna a poměr 5:3 je jen spodní hranice, pod kterou se scéna nesmí zploštit. Landing nese jednu otázku, jednu větu pozice, hero rám, jeden odstavec a formulář — žádný samostatný blok slibů, poznámku o soukromí ani patičku s tvrzeními. Redakční sloupec kapitoly a zavěšená metadata jsou výhradně desktopové: pod prahem 68 rem nese hlavičku celá šířka a pod 681 px se vše skládá do jednoho sloupce, takže při 200% zoomu se rozvržení rozpadne samo a text nikdy neztratí čitelnou míru. Ovládací prvky si přitom drží minimální výšku 44 px — hustota se nikdy nezvyšuje na jejich úkor. Mřížky se skládají do jednoho sloupce, dlouhé české názvy se mohou zalomit, SVG respektují kontejner a všechny interaktivní prvky mají minimální výšku 44 px. Mobilní obsah nesmí záviset na hoveru. Respektuje se `prefers-reduced-motion` a tisková pravidla skrývají ovládací prvky bez změny významu zprávy.

Generativní dekorace nejsou podmínkou layoutu. Hero rám vykresluje kód: pomalu se otáčející šroubovice papírových listů v three.js, která zastupuje rozsah ročníků a při zadaném roku narození sjede na příslušnou vrstvu a označí ji korálovou záložkou. Nese jen procedurální linky, nikdy čitelný text ani údaj. Pod scénou zůstávají dva kontrolované WebP výřezy jako poster i jako trvalý fallback pro prohlížeč bez WebGL, režim úspory dat a ztracený GL kontext. Při `prefers-reduced-motion` se vykreslí jediný statický snímek scény bez smyčky; smyčka se zastaví i mimo obrazovku a na skryté záložce. Celý rám je dekorativní a `aria-hidden`, takže na rozdíl od mapy, oblohy a share canvasu nemá textové shrnutí — nenese žádnou informaci. Zbývající sloty, bezpečné zóny, provenance, povinný průzkum levných či bezplatných generátorů a autentické-UI pravidlo jsou v `../docs/generated-media.md`. Bez schváleného výstupu nevznikají placeholder assety.

## Nepoužívat

- žlutý starý papír přes celou stránku, dominantní hnědou nebo vojenskou zelenou;
- národní vlajky jako hlavní vizuální identitu;
- náhodné gradienty, skleněné karty, dekorativní záře a nadbytečné pilulky;
- tragédii jako hero obsah nebo senzacechtivý titulek;
- text uvnitř obrázků, který nemá dostupnou textovou alternativu;
- malé ovládání, horizontální karusely nebo informace dostupné jen po najetí.

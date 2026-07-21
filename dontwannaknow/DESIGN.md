# Tehdejší svět — vizuální systém

Zdroj pravdy je `src/styles.css`. Rozhraní má působit jako současná osobní publikace: klidné, lidské a redakční, bez sepia filtru, muzejní strohosti nebo šablonovitého „AI“ lesku.

## Základní tokeny

```yaml
brand: Tehdejší svět
mood: [warm, human, editorial, calm, personal]
color:
  paper: "#f7f2e8"
  surface: "#fffdf8"
  ink: "#18201d"
  muted: "#52645f"
  rule: "#d7d0c3"
  green: "#1e3f39"
  coral: "#d9684f"
type:
  display: "Fraunces Variable"
  editorial: "Newsreader Variable"
  interface: "Instrument Sans Variable"
radius:
  control: "0.7rem"
  card: "1rem"
motion:
  easing: "cubic-bezier(.22, 1, .36, 1)"
```

Všechny fonty jsou samostatně hostované v produkčním balíčku. Fraunces patří hlavním otázkám a obálce, Newsreader delším redakčním pasážím a Instrument Sans ovládacím prvkům a metadatům.

## Kompozice

- Teplé papírové pozadí drží celý produkt pohromadě; karty používají lehčí povrch, jemnou linku a prostor, nikoli generické gradienty a množství stínů.
- Tmavě zelená je strukturální barva značky, korálová zvýrazňuje hlavní akci, zaostření a drobné navigační body.
- Obálka je výrazná, ale ne překryvná. Navigace ani nástroje výsledku nejsou sticky, aby na malých displejích nezakrývaly obsah.
- Kapitoly jsou odlišeny číslováním, nadpisem a rytmem. Typ obsahu nesmí být rozpoznatelný jen barvou.
- Citlivý historický kontext je sbalený, jasně pojmenovaný a nikdy nesdílí vizuální skupinu s odlehčenou kartou.

## Responzivní pravidla

Rozložení musí fungovat od 320 px bez vodorovného posuvu. Mřížky se skládají do jednoho sloupce, dlouhé české názvy se mohou zalomit, SVG respektují kontejner a všechny interaktivní prvky mají minimální výšku 44 px. Mobilní obsah nesmí záviset na hoveru. Respektuje se `prefers-reduced-motion` a tisková pravidla skrývají ovládací prvky bez změny významu zprávy.

## Nepoužívat

- žlutý starý papír přes celou stránku, dominantní hnědou nebo vojenskou zelenou;
- národní vlajky jako hlavní vizuální identitu;
- náhodné gradienty, skleněné karty, dekorativní záře a nadbytečné pilulky;
- tragédii jako hero obsah nebo senzacechtivý titulek;
- text uvnitř obrázků, který nemá dostupnou textovou alternativu;
- malé ovládání, horizontální karusely nebo informace dostupné jen po najetí.

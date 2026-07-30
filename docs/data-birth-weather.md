# P3 — počasí v době narození

Datová sada `birthWeather` přidává fyzický kontext začátku příběhu. U celého
data zobrazí rekonstruované počasí daného dne v mřížkovém bodě města; u
samotného roku stručně popíše charakter zimy a léta. Nejde o záznam konkrétní
stanice ani o osobní vzpomínku.

## Zdroj, přesnost a licence

Generátor používá [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)
s modelem Copernicus C3S ERA5. ERA5 má prostorové rozlišení 0,25°, přibližně
25 km, a v tomto produktu začíná 1. ledna 1940. Data Open-Meteo jsou
[poskytována pod CC BY 4.0](https://open-meteo.com/en/licence).

Každá čtenářská věta proto výslovně říká „podle meteorologické rekonstrukce
ERA5“. Produkt nepoužívá slova „naměřeno“ ani netvrdí, že popisuje konkrétní
ulici. U roku před 1940 nevytvoří položku ani omluvnou výplň.

## Build-time generování a runtime řezy

```bash
cd dontwannaknow
npm run data:weather
npm run data:public
```

`scripts/gen-weather.mjs` čte veřejný katalog 70 měst a jejich souřadnice,
z API je kvůli hodinovému limitu stahuje v malých dávkách a pro každé město
zapíše:

- `public/data/weather/<město>/<rok>.json` — denní minima, maxima, srážky a
  sněžení jako kompaktní pole celých desetin;
- `public/data/weather/<město>/summary.json` — sezonní průměry a percentily
  proti nejvýše 25 předchozím rokům;
- `public/data/weather/manifest.json` — rozsah, model, licenci, atribuci,
  objem a výslovné zdůvodnění výjimky číselných měření ze skórování.

Generátor je šetrný k limitu veřejného API, respektuje `Retry-After`, ve
výchozím nastavení sdružuje dvě města do jednoho podporovaného
vícesouřadnicového požadavku a lze jej po přerušení obnovit:

```bash
WEATHER_CONCURRENCY=1 npm run data:weather -- --resume
```

V prohlížeči se nevolá Open-Meteo. Celé datum načte z vlastního originu právě
soubor zvoleného města a roku; rok bez dne načte pouze `summary.json`. Bez
města se nenačítá nic. Formulářová data tak neopouštějí prohlížeč a vstupní
JavaScript nenese denní řady.

## Redakční šablony a brány

Číselné denní řady a agregace jsou měření modelu, nikoli redakční záznamy,
proto jsou výslovnou výjimkou ze skórování. Osm vět v
`src/data/weatherTemplates.json` však prochází běžnými průchody A/B/C,
proveniencí a veřejným `rel`/`src` kontraktem.

Pevné prahy:

- mrazivý den: denní maximum nejvýše −5 °C;
- tropický den: denní maximum alespoň 30 °C;
- sněžení: alespoň 1 cm;
- deštivý den: alespoň 10 mm srážek;
- sezonní superlativ: nejméně 20 referenčních roků a percentil alespoň 80.

Superlativ se nikdy nepoužije u neuzavřeného kalendářního roku. Položka je
nejvýše jedna, má městský rozsah a `mayOpen: false`, takže nemůže otevřít
kapitolu narození. Viditelná atribuce Open-Meteo je přímo u položky.

## Ověření a známé omezení

Testy kontrolují období před 1940, nulové načítání bez města, odlišné cesty
pro celé datum a samotný rok, podmínky superlativu, determinismus, limit jedné
položky a zákaz otevření kapitoly. Obsahový audit kontroluje všech osm
šablon, rekonstrukční formulaci, licenci, model, úplnost měst a neúplné roky.

V2 může zpřesnit česká města staničními daty ČHMÚ (1961–2023) a doplnit
Klementinum před rokem 1940. V P3 se tyto zdroje záměrně nekombinují:
jednotná ERA5 metodika je srozumitelnější a nepředstírá nestejnou přesnost
mezi Českem a Ukrajinou.

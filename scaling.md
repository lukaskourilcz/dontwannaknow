# Tehdejší svět — náklady a škálování

Statická Vite/React aplikace na Vercelu, bez backendu. Stack je v
`about-project.md`; ceny byly ověřeny 30. 7. 2026 na oficiálním
[ceníku Vercelu](https://vercel.com/pricing) a v
[ceníku Web Analytics](https://vercel.com/docs/analytics/limits-and-pricing).

## Co to stojí

- **Teď:** $0/měsíc + doména (Vercel Hobby, osobní nekomerční provoz; bez DB a runtime AI).
- **Komerční provoz:** od $20/měsíc + doména (Vercel Pro) a $3 / 100 000 událostí Web Analytics.

## Kdy škálovat

- Přejít na Vercel Pro při komerčním provozu — licenční pravidlo, ne limit návštěvnosti.
- Backend nebo databázi zvažovat až při potvrzené potřebě (účty, uložené zprávy, serverové OG náhledy).

## Jak držet náklady

Zůstat na Hobby, dokud je provoz osobní; nastavit rozpočtová upozornění ve Vercelu.

Historická data se generují před buildem a posílají se jako malé lazy řezy
podle země, města nebo roku. P5 nepřidává databázi, API ani běhový výpočet:
česká jména, slang a mediální milníky jsou statické JSON chunky a původní
interní `media.json` se z veřejného vstupního balíku odstranil.

P6 přidává 19 licenčně ověřených WebP pro pevný rozsah 20 měst. Deriváty mají
celkem 1 221 744 B, každý nejvýše 80 KiB a 1 000 px na delší hraně. JSON se
načítá po jednom městě a samotný obraz až lazy ze stejného originu. P6 proto
nepřidává databázi, běhové API ani externí síťový požadavek; dopad je pouze na
velikost repozitáře a CDN přenos konkrétního zobrazeného obrazu.

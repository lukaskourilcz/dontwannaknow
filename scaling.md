# Tehdejší svět — náklady a škálování

Statická Vite/React aplikace na Vercelu, bez backendu. Stack je v `about-project.md`; ceny ověřeny 22. 7. 2026.

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

P6 s fotografiemi měst je záměrně blokovaný rozhodnutím vlastníka. Varianta
pro 20 měst může přidat až přibližně 32 MB commitnutých a CDN obsluhovaných
derivátů; náklad i velikost repozitáře je nutné schválit před generováním.

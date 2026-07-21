# Tehdejší svět — externí kroky

Následující kroky nelze poctivě dokončit pouze změnou repozitáře:

- [ ] Přejmenovat GitHub repozitář z historického názvu na `tehdejsi-svet` a zkontrolovat automatické přesměrování clone URL. `[imp:3]` `[owner:me]`
- [ ] Přejmenovat projekt ve Vercelu a ověřit, že Root Directory zůstává `dontwannaknow/`, dokud se nezmění struktura repozitáře. `[imp:4]` `[owner:me]`
- [ ] Nastavit produkční doménu a trvalá přesměrování ze staré domény. `[imp:5]` `[owner:me]`
- [ ] Aktualizovat názvy v Search Console, analytickém projektu a případných sociálních profilech. `[imp:3]` `[owner:me]`
- [ ] Zapnout nebo ověřit Vercel Web Analytics; aplikace již odstraňuje URL fragment a neposílá vlastní profilové události. `[imp:2]` `[owner:me]`
- [ ] Po nasazení provést smoke test CSP hlaviček, obnovení sdíleného odkazu, obrázku a PDF v produkci. `[imp:4]` `[owner:me]`
- [ ] Ověřit finální nasazovací větev a zkontrolovat náhled statické OG karty ve Facebook/LinkedIn/X debuggeru. `[imp:3]` `[owner:me]`
- [ ] Ručně otestovat Mobile Safari, Mobile Chrome, Firefox, čtečku obrazovky a klávesnicovou navigaci na reálných zařízeních. `[imp:4]` `[owner:me]`

Statická karta `dontwannaknow/public/og-image.png` je hotová. Individuální OG náhledy nejsou u čistě statické aplikace s daty ve fragmentu možné bez serverové vrstvy; osobní obrázky proto uživatel vytváří přímo v prohlížeči.

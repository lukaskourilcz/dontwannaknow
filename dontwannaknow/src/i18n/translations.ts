// Czech/English strings for the shared UI chrome — the hero, the result-page
// controls, form validation errors, and the footer. These are the only
// strings routed through `t()`.
//
// The generated report itself (facts, essays, the newspaper) is written
// directly in Czech in the data/ and lib/ layers, so it does not live here.
// Czech is the default language.

export type Lang = "cs" | "en";

type StringSet = Record<string, string>;

const STRINGS: Record<Lang, StringSet> = {
  cs: {
    "hero.eyebrow":   "Stojí za to vědět · o lidech, které máš rád",
    "hero.title":     "Svět, kterým jsme procházeli spolu.",
    "form.err.date":  "Nepodařilo se rozluštit datum pro \"{label}\". Zkus třeba 1953, 12/04/1953 nebo 04/1953.",
    "form.err.empty": "Přidej alespoň jednu osobu s rokem narození.",
    "results.heading": "Jejich svět",
    "results.essay":   "Esej",
    "results.facts":   "Fakta",
    "results.shuffle": "↻ Promíchat",
    "results.share":   "⇪ Sdílet",
    "results.share.copied": "✓ Odkaz zkopírován",
    "results.reset":   "Začít znovu",
    "results.pdf":     "↓ PDF",
    "results.disclaimer": "Textury a čísla jsou zaokrouhlené historické průměry z veřejných datových sad a standardních historiografií. „Promíchat\" zamíchá výběr znovu.",
    "person.yearsOnPlanet": "let na této planetě",
    "footer":          "Vytvořeno se zvědavostí. Fakta sestavena z veřejných historických dat.",
  },
  en: {
    "hero.eyebrow":   "Worth knowing · about the people you love",
    "hero.title":     "The world we walked through together.",
    "form.err.date":  "Couldn't read a date for \"{label}\". Try 1953, 12/04/1953 or 04/1953.",
    "form.err.empty": "Add at least one person with a birth year to see the facts.",
    "results.heading": "Their world",
    "results.essay":   "Essay",
    "results.facts":   "Facts",
    "results.shuffle": "↻ Shuffle",
    "results.share":   "⇪ Share",
    "results.share.copied": "✓ Link copied",
    "results.reset":   "Start over",
    "results.pdf":     "↓ PDF",
    "results.disclaimer": "Texture and numbers are rounded historical averages from public datasets and standard histories. Hit 'Shuffle' to re-roll the mix.",
    "person.yearsOnPlanet": "years on this planet",
    "footer":          "Made with curiosity. Facts compiled from public historical data.",
  },
};

export function t(lang: Lang, key: string, vars?: Record<string, string>): string {
  let s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), v);
    }
  }
  return s;
}

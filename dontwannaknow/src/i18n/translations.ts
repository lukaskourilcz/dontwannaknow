// Lightweight Czech/English UI strings. Czech is the default. The essay
// body content (fact strings themselves) remains English — translating
// thousands of historical fact strings is a separate effort. UI chrome,
// form labels, and result headings are translated here.

export type Lang = "cs" | "en";

type StringSet = Record<string, string>;

const STRINGS: Record<Lang, StringSet> = {
  cs: {
    "hero.eyebrow":   "Nechci to vědět · ale měl bys",
    "hero.title":     "Svět, kterým procházeli tví blízcí",
    "hero.lede":      "Zadej rok narození a místo pro sebe, své rodiče, prarodiče — a podívej se na bizarní, krásné i všední detaily světa, do kterého se narodili.",
    "form.intro":     "Zadej rok narození (nebo celé datum — např. 1953-04-12, 12/04/1953, nebo 04/1953), zemi a město pro každou osobu. Celé datum odemkne mapu hvězd v noci jejich narození.",
    "form.note.english": "Zatímco rozhraní je v češtině, samotný text eseje je prozatím v angličtině. Pracujeme na něm.",
    "form.you":       "Ty",
    "form.parent":    "Máma / Táta",
    "form.grandparent": "Babi / Děda",
    "form.another":   "Někdo další",
    "form.label":     "Kdo",
    "form.year":      "např. 1953",
    "form.year.help": "Rok nebo celé datum",
    "form.country":   "Země narození",
    "form.city":      "Město",
    "form.city.any":  "Kdekoliv v zemi",
    "form.city.none": "(žádná města)",
    "form.add":       "+ Přidat osobu",
    "form.submit":    "Ukaž mi jejich svět",
    "form.remove":    "Odebrat",
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
    "person.bornIn":   "Narozen/a",
    "person.bornInWord": "v",
    "person.yearsOnPlanet": "let na této planetě",
    "lang.cs":         "Čeština",
    "lang.en":         "English",
    "footer":          "Vytvořeno se zvědavostí. Fakta sestavena z veřejných historických dat.",
  },
  en: {
    "hero.eyebrow":   "Don't wanna know · but you should",
    "hero.title":     "The world your people lived through",
    "hero.lede":      "Enter a birth year and birthplace for yourself, your parents, your grandparents — and see the bizarre, the beautiful, and the everyday details of the world they were born into.",
    "form.intro":     "Enter a birth year (or full date — e.g. 1953-04-12, 12/04/1953, or 04/1953), country, and city for each person. Adding a full date unlocks a sky chart of the night they were born.",
    "form.note.english": "",
    "form.you":       "You",
    "form.parent":    "Mom / Dad",
    "form.grandparent": "Grandma / Grandpa",
    "form.another":   "Another person",
    "form.label":     "Who",
    "form.year":      "e.g. 1953",
    "form.year.help": "Year or full date",
    "form.country":   "Born in (country)",
    "form.city":      "City",
    "form.city.any":  "Anywhere in the country",
    "form.city.none": "(no cities)",
    "form.add":       "+ Add someone",
    "form.submit":    "Show me their world",
    "form.remove":    "Remove",
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
    "person.bornIn":   "Born",
    "person.bornInWord": "in",
    "person.yearsOnPlanet": "years on this planet",
    "lang.cs":         "Čeština",
    "lang.en":         "English",
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

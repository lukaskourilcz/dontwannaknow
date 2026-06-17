// Historický korpus pro české země ("cz") a Ukrajinu ("ua"), 1930–dnešek.
// Vytvořeno na základě webově podloženého, fakticky ověřeného výzkumu (519 faktů).
// Aplikace z něj náhodně čerpá, takže každá návštěva ukáže jiná fakta.
// Pro regeneraci znovu spusťte workflow dwk-history-research.

import historyJson from "./history.json";

export type Country = "cz" | "ua";

export type Fact = {
  country: Country;
  year: number;
  category: string;
  text: string;
};

export const FACTS: Fact[] = historyJson as Fact[];

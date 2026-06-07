// Western tropical sun-sign lookup. Boundaries follow the standard
// astrological convention (not the IAU astronomical ones).

export type ZodiacSign = {
  name: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  blurb: string;
};

const SIGNS: { from: [number, number]; to: [number, number]; sign: ZodiacSign }[] = [
  { from: [1, 1],   to: [1, 19],  sign: { name: "Kozoroh",   symbol: "♑", element: "Earth", blurb: "horolezec — trpělivý, disciplinovaný, se suchým humorem" } },
  { from: [1, 20],  to: [2, 18],  sign: { name: "Vodnář",    symbol: "♒", element: "Air",   blurb: "rebel — nezávislý, idealistický, vždy o krok stranou" } },
  { from: [2, 19],  to: [3, 20],  sign: { name: "Ryby",      symbol: "♓", element: "Water", blurb: "snílek — empatický, intuitivní, těžko uchopitelný" } },
  { from: [3, 21],  to: [4, 19],  sign: { name: "Beran",       symbol: "♈", element: "Fire",  blurb: "jiskra — přímý, netrpělivý, vždy první do všeho" } },
  { from: [4, 20],  to: [5, 20],  sign: { name: "Býk",      symbol: "♉", element: "Earth", blurb: "pevně ukotvený — smyslný, tvrdohlavý, pomalu vznětlivý" } },
  { from: [5, 21],  to: [6, 20],  sign: { name: "Blíženci",      symbol: "♊", element: "Air",   blurb: "řečník — rychlý, zvědavý, dvě mysli najednou" } },
  { from: [6, 21],  to: [7, 22],  sign: { name: "Rak",      symbol: "♋", element: "Water", blurb: "ochránce — sentimentální, oddaný rodině, měkká schránka kolem tvrdého jádra" } },
  { from: [7, 23],  to: [8, 22],  sign: { name: "Lev",         symbol: "♌", element: "Fire",  blurb: "showman — vřelý, hrdý, magnet na každé párty" } },
  { from: [8, 23],  to: [9, 22],  sign: { name: "Panna",       symbol: "♍", element: "Earth", blurb: "analytik — precizní, ochotný, alergický na nepořádek" } },
  { from: [9, 23],  to: [10, 22], sign: { name: "Váhy",       symbol: "♎", element: "Air",   blurb: "diplomat — okouzlující, nerozhodný, alergický na ošklivost" } },
  { from: [10, 23], to: [11, 21], sign: { name: "Štír",     symbol: "♏", element: "Water", blurb: "hlubinná nálož — intenzivní, uzavřený, všechno nebo nic" } },
  { from: [11, 22], to: [12, 21], sign: { name: "Střelec", symbol: "♐", element: "Fire",  blurb: "cestovatel — neposedný, optimistický, trochu netaktní" } },
  { from: [12, 22], to: [12, 31], sign: { name: "Kozoroh",   symbol: "♑", element: "Earth", blurb: "horolezec — trpělivý, disciplinovaný, se suchým humorem" } },
];

export function zodiacFor(month: number, day: number): ZodiacSign | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  for (const { from, to, sign } of SIGNS) {
    const after = month > from[0] || (month === from[0] && day >= from[1]);
    const before = month < to[0] || (month === to[0] && day <= to[1]);
    if (after && before) return sign;
  }
  return null;
}

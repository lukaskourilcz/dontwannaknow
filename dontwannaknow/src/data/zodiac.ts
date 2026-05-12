// Western tropical sun-sign lookup. Boundaries follow the standard
// astrological convention (not the IAU astronomical ones).

export type ZodiacSign = {
  name: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  blurb: string;
};

const SIGNS: { from: [number, number]; to: [number, number]; sign: ZodiacSign }[] = [
  { from: [1, 1],   to: [1, 19],  sign: { name: "Capricorn",   symbol: "♑", element: "Earth", blurb: "the climber — patient, disciplined, dryly funny" } },
  { from: [1, 20],  to: [2, 18],  sign: { name: "Aquarius",    symbol: "♒", element: "Air",   blurb: "the contrarian — independent, idealistic, a step sideways" } },
  { from: [2, 19],  to: [3, 20],  sign: { name: "Pisces",      symbol: "♓", element: "Water", blurb: "the dreamer — empathetic, intuitive, hard to pin down" } },
  { from: [3, 21],  to: [4, 19],  sign: { name: "Aries",       symbol: "♈", element: "Fire",  blurb: "the spark — direct, impatient, first into everything" } },
  { from: [4, 20],  to: [5, 20],  sign: { name: "Taurus",      symbol: "♉", element: "Earth", blurb: "the grounded one — sensual, stubborn, slow to anger" } },
  { from: [5, 21],  to: [6, 20],  sign: { name: "Gemini",      symbol: "♊", element: "Air",   blurb: "the talker — quick, curious, two minds at once" } },
  { from: [6, 21],  to: [7, 22],  sign: { name: "Cancer",      symbol: "♋", element: "Water", blurb: "the protector — sentimental, family-anchored, soft shell over a hard core" } },
  { from: [7, 23],  to: [8, 22],  sign: { name: "Leo",         symbol: "♌", element: "Fire",  blurb: "the performer — warm, proud, a magnet at any party" } },
  { from: [8, 23],  to: [9, 22],  sign: { name: "Virgo",       symbol: "♍", element: "Earth", blurb: "the analyst — precise, helpful, allergic to mess" } },
  { from: [9, 23],  to: [10, 22], sign: { name: "Libra",       symbol: "♎", element: "Air",   blurb: "the diplomat — charming, indecisive, allergic to ugliness" } },
  { from: [10, 23], to: [11, 21], sign: { name: "Scorpio",     symbol: "♏", element: "Water", blurb: "the depth-charge — intense, private, all or nothing" } },
  { from: [11, 22], to: [12, 21], sign: { name: "Sagittarius", symbol: "♐", element: "Fire",  blurb: "the traveller — restless, optimistic, slightly tactless" } },
  { from: [12, 22], to: [12, 31], sign: { name: "Capricorn",   symbol: "♑", element: "Earth", blurb: "the climber — patient, disciplined, dryly funny" } },
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

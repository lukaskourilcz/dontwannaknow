// Common Western generational labels. Boundaries are the Pew Research
// definitions where available; older cohorts (GI, Lost) are the standard
// social-history ranges.

export type Generation = {
  label: string;
  startYear: number;
  endYear: number;
  blurb: string;
};

export const GENERATIONS: Generation[] = [
  {
    label: "Lost Generation",
    startYear: 1883,
    endYear: 1900,
    blurb: "Came of age in the First World War; Fitzgerald, Hemingway, the cafés of Paris.",
  },
  {
    label: "Greatest Generation",
    startYear: 1901,
    endYear: 1927,
    blurb: "Lived through the Depression and the Second World War as adults.",
  },
  {
    label: "Silent Generation",
    startYear: 1928,
    endYear: 1945,
    blurb: "Children of the war; the cautious, hard-working postwar adults.",
  },
  {
    label: "Baby Boomers",
    startYear: 1946,
    endYear: 1964,
    blurb: "Born into the postwar boom; came of age in the 1960s and 70s.",
  },
  {
    label: "Generation X",
    startYear: 1965,
    endYear: 1980,
    blurb: "Latchkey kids; came of age between MTV and the end of the Cold War.",
  },
  {
    label: "Millennials",
    startYear: 1981,
    endYear: 1996,
    blurb: "Came of age around the dot-com boom and 9/11.",
  },
  {
    label: "Generation Z",
    startYear: 1997,
    endYear: 2012,
    blurb: "Digital natives who barely remember a pre-smartphone world.",
  },
  {
    label: "Generation Alpha",
    startYear: 2013,
    endYear: 2025,
    blurb: "Born into the age of TikTok, climate strikes and ChatGPT.",
  },
];

export function generationFor(year: number): Generation | null {
  return GENERATIONS.find((g) => year >= g.startYear && year <= g.endYear) ?? null;
}

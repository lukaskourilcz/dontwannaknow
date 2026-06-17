// Things and the year they became part of everyday life.
// Used to surface "born before X existed" facts.

import inventionsJson from "./inventions.json";

export type Invention = {
  year: number;
  name: string;
  // Optional flavor text to use instead of the default phrasing.
  detail?: string;
};

export const INVENTIONS: Invention[] = inventionsJson as Invention[];

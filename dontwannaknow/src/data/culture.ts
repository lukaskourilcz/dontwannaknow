import cultureJson from "./culture.json";
import { regroupCulture } from "./_grouped";

// Cultural snapshots by decade — songs, shows, books, fashions, prices people quote.

export type CultureSnapshot = {
  decadeStart: number;
  topSongs: string[];
  popularMovies: string[];
  popularBooks: string[];
  fashion: string;
  whatTeensDid: string;
};

export const CULTURE: CultureSnapshot[] = regroupCulture(cultureJson) as unknown as CultureSnapshot[];

export function cultureForDecade(year: number): CultureSnapshot {
  const start = Math.floor(year / 10) * 10;
  return (
    CULTURE.find((c) => c.decadeStart === start) ??
    CULTURE[Math.max(0, Math.min(CULTURE.length - 1, Math.floor((start - 1930) / 10)))]
  );
}

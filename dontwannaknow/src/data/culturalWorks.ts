// Year-anchored cultural works: songs, books, paintings, sculptures,
// theatre plays. Used by the essay to surface what people were
// reading / listening to / watching during the person's lifetime.

import songsJson from "./songs.json";
import booksJson from "./books.json";
import paintingsJson from "./paintings.json";
import sculpturesJson from "./sculptures.json";
import playsJson from "./plays.json";

export type Work = {
  year: number;
  title: string;
  creator: string;
};

// ── Songs ─────────────────────────────────────────────────────────
// Famous songs released or topping charts in each year.

export const SONGS: Work[] = songsJson as Work[];

// ── Books ────────────────────────────────────────────────────────

export const BOOKS: Work[] = booksJson as Work[];

// ── Paintings ──────────────────────────────────────────────────────

export const PAINTINGS: Work[] = paintingsJson as Work[];

// ── Sculptures ────────────────────────────────────────────────────

export const SCULPTURES: Work[] = sculpturesJson as Work[];

// ── Theatre plays ─────────────────────────────────────────────────

export const PLAYS: Work[] = playsJson as Work[];

// ── Selectors ─────────────────────────────────────────────────────

function near(arr: Work[], year: number, span: number): Work[] {
  return arr.filter((w) => Math.abs(w.year - year) <= span);
}

export function worksAround(year: number, span = 1) {
  return {
    songs: near(SONGS, year, span),
    books: near(BOOKS, year, span),
    paintings: near(PAINTINGS, year, span),
    sculptures: near(SCULPTURES, year, span),
    plays: near(PLAYS, year, span),
  };
}

export function worksInRange(fromYear: number, toYear: number) {
  return {
    songs: SONGS.filter((w) => w.year >= fromYear && w.year <= toYear),
    books: BOOKS.filter((w) => w.year >= fromYear && w.year <= toYear),
    paintings: PAINTINGS.filter((w) => w.year >= fromYear && w.year <= toYear),
    sculptures: SCULPTURES.filter((w) => w.year >= fromYear && w.year <= toYear),
    plays: PLAYS.filter((w) => w.year >= fromYear && w.year <= toYear),
  };
}

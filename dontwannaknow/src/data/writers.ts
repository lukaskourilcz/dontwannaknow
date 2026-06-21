import writersJson from "./writers.json";

// The ten best-known writers of Czechia and Ukraine whose lives overlap the
// app's era (1940 onward), with their major works (and exact publication
// years) and a rough residence timeline. From these we compute, for any
// birth year, how old each writer was, where they were living, and which
// book they were most likely working on at the time — assuming a book that
// appeared in year P was being written in roughly the three years before P.

import { settings } from "../config/settings";

export type WriterWork = { title: string; year: number };
export type WriterHome = { from: number; place: string }; // `place` is a ready locative phrase, e.g. "v Praze"

export type Writer = {
  name: string;
  country: "CZ" | "UA";
  gender: "m" | "f";
  born: number;
  died?: number;        // omit if still alive
  bornPlace?: string;
  blurb: string;        // role + signature work, no trailing period
  works: WriterWork[];  // major works, ascending by year
  homes?: WriterHome[]; // residence timeline, ascending by `from`
};

export const WRITERS: Writer[] = writersJson as unknown as Writer[];

export type WriterAtBirth = {
  name: string;
  gender: "m" | "f";
  blurb: string;
  born: number;
  died?: number;
  age: number;
  alive: boolean;
  yearsSinceDeath?: number;   // set when the writer had died before the birth year
  home?: string;              // locative phrase, e.g. "v Praze"
  workingOn?: WriterWork;     // a book published within [birthYear, birthYear+3]
  recent?: WriterWork;        // most recent work already published by the birth year
};

// Also surface writers who died up to this many years before the birth.
const DEAD_GRACE = settings.writersDeadGraceYears;

/** Writers of `country` who were alive when someone was born in `birthYear`
 *  (plus a few who had recently died), each with computed age, residence and
 *  the book they were probably writing then. */
export function writersAtBirth(
  country: string,
  birthYear: number,
): WriterAtBirth[] {
  const out: WriterAtBirth[] = [];
  for (const w of WRITERS) {
    if (w.country !== country) continue;
    if (w.born > birthYear) continue; // not born yet
    const diedBefore = w.died !== undefined && w.died < birthYear;
    if (diedBefore && birthYear - (w.died as number) > DEAD_GRACE) continue;

    const deathCap = w.died ?? 9999;
    const workingOn = w.works
      .filter((k) => k.year >= birthYear && k.year <= birthYear + 3 && k.year <= deathCap)
      .sort((a, b) => a.year - b.year)[0];
    const recent = w.works
      .filter((k) => k.year <= birthYear)
      .sort((a, b) => b.year - a.year)[0];

    // Skip living writers who hadn't published anything yet (too early in life).
    if (!diedBefore && !workingOn && !recent) continue;

    const home = w.homes
      ? [...w.homes]
          .filter((h) => h.from <= birthYear)
          .sort((a, b) => b.from - a.from)[0]?.place
      : undefined;

    out.push({
      name: w.name,
      gender: w.gender,
      blurb: w.blurb,
      born: w.born,
      died: w.died,
      age: birthYear - w.born,
      alive: !diedBefore,
      yearsSinceDeath: diedBefore ? birthYear - (w.died as number) : undefined,
      home,
      workingOn,
      recent,
    });
  }
  return out;
}

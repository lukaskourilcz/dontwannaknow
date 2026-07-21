import writersJson from "./writers.json";

// The ten best-known writers of Czechia and Ukraine whose lives overlap the
// app's era (1940 onward), with major works, publication years and a rough
// residence timeline. The report only states publication facts present in the
// data; it does not infer what a writer was privately working on.

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
  home?: string;              // locative phrase, e.g. "v Praze"
  publishedSoonAfter?: WriterWork; // work published within [birthYear, birthYear+3]
  recent?: WriterWork;        // most recent work already published by the birth year
};

/** Writers of `country` who were alive when someone was born in `birthYear`,
 *  with computed age, residence and nearby publication context. */
export function writersAtBirth(
  country: string,
  birthYear: number,
): WriterAtBirth[] {
  const out: WriterAtBirth[] = [];
  for (const w of WRITERS) {
    if (w.country !== country) continue;
    if (w.born > birthYear) continue; // not born yet
    const diedBefore = w.died !== undefined && w.died < birthYear;
    if (diedBefore) continue;

    const deathCap = w.died ?? 9999;
    const publishedSoonAfter = w.works
      .filter((k) => k.year >= birthYear && k.year <= birthYear + 3 && k.year <= deathCap)
      .sort((a, b) => a.year - b.year)[0];
    const recent = w.works
      .filter((k) => k.year <= birthYear)
      .sort((a, b) => b.year - a.year)[0];

    // Skip writers who had no publication close enough to give useful context.
    if (!publishedSoonAfter && !recent) continue;

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
      home,
      publishedSoonAfter,
      recent,
    });
  }
  return out;
}

// Flat fact-row → grouped-shape helpers, shared by the JSON-backed data
// wrappers and the /dev content editor.
//
// The on-disk JSON for these datasets is a *flat* list — one fact per row — so
// the editor can search, add, edit and delete individual facts. At import time
// the matching wrapper reassembles the grouped structure the rest of the app
// expects. Keeping this transformation in one module avoids parallel grouping
// implementations in the runtime and the editor.

export type CountryDecadeRow = { country: string; decadeStart: number; bucket: string; text: string };
export type FamousPersonRow = { country: string; decadeStart: number; name: string; role: string; note?: string };
export type MediaRow = { country: string; decadeStart: number; kind: string; text: string };
export type SlangRow = { decadeStart: number; phrase: string; meaning: string };
export type BabyNamesRow = { country: string; decadeStart: number; sex: string; name: string };
export type CultureRow = { decadeStart: number; field: string; text: string };

/** Group rows by a key, preserving the order in which keys first appear. */
function groupOrdered<R>(rows: R[], keyOf: (r: R) => string): R[][] {
  const map = new Map<string, R[]>();
  const order: string[] = [];
  for (const r of rows) {
    const k = keyOf(r);
    const bucket = map.get(k);
    if (bucket) bucket.push(r);
    else {
      map.set(k, [r]);
      order.push(k);
    }
  }
  return order.map((k) => map.get(k)!);
}

// ── countryDecades ──────────────────────────────────────────────────────
export const COUNTRY_DECADE_BUCKETS = [
  "government", "clothes", "illnesses", "dailyLife",
  "food", "money", "bizarre", "beautiful",
] as const;
type Bucket = (typeof COUNTRY_DECADE_BUCKETS)[number];

export type CountryDecadeShape = { country: string; decadeStart: number } & Record<Bucket, string[]>;

export function regroupCountryDecades(rows: CountryDecadeRow[]): CountryDecadeShape[] {
  return groupOrdered(rows, (r) => `${r.country}|${r.decadeStart}`).map((group) => {
    const rec: CountryDecadeShape = {
      country: group[0].country, decadeStart: group[0].decadeStart,
      government: [], clothes: [], illnesses: [], dailyLife: [],
      food: [], money: [], bizarre: [], beautiful: [],
    };
    for (const r of group) {
      if ((COUNTRY_DECADE_BUCKETS as readonly string[]).includes(r.bucket)) {
        rec[r.bucket as Bucket].push(r.text);
      }
    }
    return rec;
  });
}

// ── famousPeople ────────────────────────────────────────────────────────
export type FamousByDecadeShape = {
  country: string;
  decadeStart: number;
  people: { name: string; role: string; note?: string }[];
};

export function regroupFamousPeople(rows: FamousPersonRow[]): FamousByDecadeShape[] {
  return groupOrdered(rows, (r) => `${r.country}|${r.decadeStart}`).map((group) => ({
    country: group[0].country,
    decadeStart: group[0].decadeStart,
    people: group.map((r) => {
      const person: { name: string; role: string; note?: string } = { name: r.name, role: r.role };
      if (r.note != null && r.note !== "") person.note = r.note;
      return person;
    }),
  }));
}

// ── media ───────────────────────────────────────────────────────────────
export type MediaShape = { country: string; decadeStart: number; read: string[]; watch: string[] };

export function regroupMedia(rows: MediaRow[]): MediaShape[] {
  return groupOrdered(rows, (r) => `${r.country}|${r.decadeStart}`).map((group) => {
    const rec: MediaShape = { country: group[0].country, decadeStart: group[0].decadeStart, read: [], watch: [] };
    for (const r of group) {
      if (r.kind === "read") rec.read.push(r.text);
      else if (r.kind === "watch") rec.watch.push(r.text);
    }
    return rec;
  });
}

// ── slang ───────────────────────────────────────────────────────────────
export type SlangShape = { decadeStart: number; expressions: { phrase: string; meaning: string }[] };

export function regroupSlang(rows: SlangRow[]): SlangShape[] {
  return groupOrdered(rows, (r) => String(r.decadeStart)).map((group) => ({
    decadeStart: group[0].decadeStart,
    expressions: group.map((r) => ({ phrase: r.phrase, meaning: r.meaning })),
  }));
}

// ── babyNames ───────────────────────────────────────────────────────────
export type BabyNamesShape = { country: string; decadeStart: number; boys: string[]; girls: string[] };

export function regroupBabyNames(rows: BabyNamesRow[]): BabyNamesShape[] {
  return groupOrdered(rows, (r) => `${r.country}|${r.decadeStart}`).map((group) => {
    const rec: BabyNamesShape = { country: group[0].country, decadeStart: group[0].decadeStart, boys: [], girls: [] };
    for (const r of group) {
      if (r.sex === "boys") rec.boys.push(r.name);
      else if (r.sex === "girls") rec.girls.push(r.name);
    }
    return rec;
  });
}

// ── culture ─────────────────────────────────────────────────────────────
export const CULTURE_LIST_FIELDS = ["topSongs", "popularMovies", "popularBooks"] as const;
type CultureList = (typeof CULTURE_LIST_FIELDS)[number];

export type CultureShape = {
  decadeStart: number;
  topSongs: string[];
  popularMovies: string[];
  popularBooks: string[];
  fashion: string;
  whatTeensDid: string;
};

export function regroupCulture(rows: CultureRow[]): CultureShape[] {
  return groupOrdered(rows, (r) => String(r.decadeStart)).map((group) => {
    const rec: CultureShape = {
      decadeStart: group[0].decadeStart,
      topSongs: [], popularMovies: [], popularBooks: [],
      fashion: "", whatTeensDid: "",
    };
    for (const r of group) {
      if ((CULTURE_LIST_FIELDS as readonly string[]).includes(r.field)) {
        rec[r.field as CultureList].push(r.text);
      } else if (r.field === "fashion") rec.fashion = r.text;
      else if (r.field === "whatTeensDid") rec.whatTeensDid = r.text;
    }
    return rec;
  });
}

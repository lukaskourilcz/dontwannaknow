// Describes every editable dataset for the /dev content editor: which JSON file
// it maps to, the category it belongs to, the fields to edit, and how to build
// a one-line summary and search tags for each record. Adding a new dataset to
// the editor is just a matter of adding an entry here.

import { CURRENT_YEAR } from "../lib/datetime";
import { COUNTRY_DECADE_BUCKETS, CULTURE_LIST_FIELDS } from "../data/_grouped";

// "list"  → a string[] edited one item per line.
// "json"  → an arbitrary nested value edited as raw JSON (objects/arrays).
export type FieldKind = "text" | "textarea" | "number" | "select" | "list" | "json";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  /** Render full-width (textareas) vs. side-by-side (short fields). */
  full?: boolean;
  /** Optional fields are dropped from the saved record when left empty. */
  optional?: boolean;
};

export type Category = "countries" | "cities" | "years" | "culture" | "sports";

export const CATEGORY_LABELS: Record<Category, string> = {
  countries: "Countries",
  cities: "Cities",
  years: "Years",
  culture: "Culture",
  sports: "Sports",
};

export type ContentRecord = Record<string, unknown>;

export type ContentSource = {
  /** Matches the JSON filename stem and the dev-API key. */
  key: string;
  label: string;
  category: Category;
  fields: Field[];
  /** One-line summary shown in the list. */
  summary: (r: ContentRecord) => string;
  /** Extra search tags (the category is always added automatically). */
  tags: (r: ContentRecord) => string[];
  /** A blank record for "Add new". */
  blank: () => ContentRecord;
};

const num = (v: unknown): number => Number(v) || 0;
const str = (v: unknown): string => (v == null ? "" : String(v));
const decadeTag = (year: unknown): string => `${Math.floor(num(year) / 10) * 10}s`;

// CZ/ES/US/UA/CA/MX are the codes used by countryEvents (Country minus INTL).
const COUNTRY_CODES = ["CZ", "ES", "US", "UA", "CA", "MX"];
const MOODS = ["beautiful", "bizarre", "heavy", "milestone"];
// Select options for the migrated per-decade datasets (kept in sync with the
// grouping helpers the wrappers use).
const DECADE_BUCKETS = [...COUNTRY_DECADE_BUCKETS];
const CULTURE_FIELDS = [...CULTURE_LIST_FIELDS, "fashion", "whatTeensDid"];
const WRITER_COUNTRIES = ["CZ", "UA"];

// Songs / books / paintings / sculptures / plays all share the Work shape.
function workSource(
  key: string,
  label: string,
  extraTags: string[],
): ContentSource {
  return {
    key,
    label,
    category: "culture",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "title", label: "Title", kind: "text", full: true },
      { key: "creator", label: "Creator", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.title)} · ${str(r.creator)}`,
    tags: (r) => [...extraTags, decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, title: "", creator: "" }),
  };
}

export const CONTENT_SOURCES: ContentSource[] = [
  {
    key: "events",
    label: "World events",
    category: "years",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "mood", label: "Mood", kind: "select", options: MOODS },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.text)}`,
    tags: (r) => ["world", str(r.mood), decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, text: "", mood: "milestone" }),
  },
  {
    key: "countryEvents",
    label: "Country events",
    category: "countries",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "year", label: "Year", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), decadeTag(r.year)],
    blank: () => ({ country: "CZ", year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "history",
    label: "Curated history (CZ/UA)",
    category: "countries",
    fields: [
      { key: "country", label: "Country", kind: "select", options: ["cz", "ua"] },
      { key: "year", label: "Year", kind: "number" },
      { key: "category", label: "Category", kind: "text" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), str(r.category), decadeTag(r.year)],
    blank: () => ({ country: "cz", year: CURRENT_YEAR, category: "", text: "" }),
  },
  {
    key: "monthlyEvents",
    label: "Monthly events",
    category: "years",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "month", label: "Month (1–12)", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)}/${num(r.month)} — ${str(r.text)}`,
    tags: (r) => ["month", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, month: 1, text: "" }),
  },
  {
    key: "cosmicEvents",
    label: "Cosmic events",
    category: "years",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.text)}`,
    tags: (r) => ["science", "sky", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "inventions",
    label: "Inventions",
    category: "years",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "name", label: "Name", kind: "text", full: true },
      { key: "detail", label: "Detail (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)}`,
    tags: (r) => ["tech", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "" }),
  },
  {
    key: "notableDeaths",
    label: "Notable deaths",
    category: "culture",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "name", label: "Name", kind: "text", full: true },
      { key: "role", label: "Role", kind: "text", full: true },
      { key: "note", label: "Note (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)} (${str(r.role)})`,
    tags: (r) => ["people", "death", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "", role: "" }),
  },
  {
    key: "famousBirths",
    label: "Famous births",
    category: "culture",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "name", label: "Name", kind: "text", full: true },
      { key: "role", label: "Role", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)} (${str(r.role)})`,
    tags: (r) => ["people", "birth", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "", role: "" }),
  },
  {
    key: "extinctions",
    label: "Extinctions",
    category: "years",
    fields: [
      { key: "species", label: "Species", kind: "text", full: true },
      { key: "lastConfirmedYear", label: "Last confirmed year", kind: "number" },
      { key: "declaredExtinctYear", label: "Declared extinct year", kind: "number" },
      { key: "note", label: "Note", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.species)} — extinct ${num(r.declaredExtinctYear)}`,
    tags: (r) => ["nature", "science", decadeTag(r.declaredExtinctYear)],
    blank: () => ({
      species: "",
      lastConfirmedYear: CURRENT_YEAR,
      declaredExtinctYear: CURRENT_YEAR,
      note: "",
    }),
  },
  workSource("songs", "Songs", ["music"]),
  workSource("books", "Books", ["literature"]),
  workSource("paintings", "Paintings", ["art", "painting"]),
  workSource("sculptures", "Sculptures", ["art", "sculpture"]),
  workSource("plays", "Plays", ["theatre"]),
  {
    key: "cityFacts",
    label: "City facts",
    category: "cities",
    fields: [
      { key: "city", label: "City slug", kind: "text" },
      { key: "year", label: "Year", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.city)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.city), decadeTag(r.year)],
    blank: () => ({ city: "", year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "sports",
    label: "Sports",
    category: "sports",
    fields: [
      { key: "year", label: "Year", kind: "number" },
      { key: "country", label: "Country (optional)", kind: "text", optional: true },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.text)}`,
    tags: (r) => ["sports", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, text: "" }),
  },

  // ── Per-decade life texture & people (flat JSON, reassembled by wrappers) ──
  {
    key: "countryDecades",
    label: "Per-decade texture",
    category: "countries",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "bucket", label: "Category", kind: "select", options: DECADE_BUCKETS },
      { key: "text", label: "Fact", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.bucket)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), str(r.bucket), decadeTag(r.decadeStart)],
    blank: () => ({ country: "CZ", decadeStart: 1950, bucket: "government", text: "" }),
  },
  {
    key: "famousPeople",
    label: "Famous people",
    category: "culture",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "name", label: "Name", kind: "text", full: true },
      { key: "role", label: "Role", kind: "text", full: true },
      { key: "note", label: "Note (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s — ${str(r.name)} (${str(r.role)})`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), "people"],
    blank: () => ({ country: "CZ", decadeStart: 1950, name: "", role: "" }),
  },
  {
    key: "media",
    label: "Media (read & watch)",
    category: "culture",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "kind", label: "Kind", kind: "select", options: ["read", "watch"] },
      { key: "text", label: "Title / outlet", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.kind)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), str(r.kind), "media"],
    blank: () => ({ country: "CZ", decadeStart: 1950, kind: "read", text: "" }),
  },
  {
    key: "slang",
    label: "Slang",
    category: "culture",
    fields: [
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "phrase", label: "Phrase", kind: "text", full: true },
      { key: "meaning", label: "Meaning", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.decadeStart)}s — “${str(r.phrase)}”: ${str(r.meaning)}`,
    tags: (r) => [decadeTag(r.decadeStart), "slang"],
    blank: () => ({ decadeStart: 1950, phrase: "", meaning: "" }),
  },
  {
    key: "babyNames",
    label: "Baby names",
    category: "culture",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "sex", label: "Sex", kind: "select", options: ["boys", "girls"] },
      { key: "name", label: "Name", kind: "text", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.sex)} — ${str(r.name)}`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), "names", str(r.sex)],
    blank: () => ({ country: "US", decadeStart: 1950, sex: "boys", name: "" }),
  },
  {
    key: "culture",
    label: "Culture (songs / films / books)",
    category: "culture",
    fields: [
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "field", label: "Field", kind: "select", options: CULTURE_FIELDS },
      { key: "text", label: "Value", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.decadeStart)}s · ${str(r.field)} — ${str(r.text)}`,
    tags: (r) => [decadeTag(r.decadeStart), str(r.field)],
    blank: () => ({ decadeStart: 1950, field: "topSongs", text: "" }),
  },
  {
    key: "education",
    label: "Education snapshot",
    category: "countries",
    fields: [
      { key: "country", label: "Country", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "compulsoryEnd", label: "Compulsory school end age", kind: "number" },
      { key: "avgYearsSchooling", label: "Avg years schooling", kind: "number" },
      { key: "highSchoolGradPct", label: "High-school grad %", kind: "number" },
      { key: "universityPct", label: "University %", kind: "number" },
      { key: "literacyPct", label: "Literacy %", kind: "number" },
      { key: "commonJobs", label: "Common jobs (one per line)", kind: "list", full: true },
      { key: "subjects", label: "School subjects (one per line)", kind: "list", full: true },
      { key: "classroom", label: "Classroom note", kind: "textarea", full: true },
      { key: "workNote", label: "Work note (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s — školství · gramotnost ${num(r.literacyPct)} %`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), "education"],
    blank: () => ({
      country: "CZ", decadeStart: 1950, compulsoryEnd: 15, avgYearsSchooling: 8,
      highSchoolGradPct: 0, universityPct: 0, literacyPct: 99,
      commonJobs: [], subjects: [], classroom: "",
    }),
  },
  {
    key: "writers",
    label: "Writers",
    category: "culture",
    fields: [
      { key: "name", label: "Name", kind: "text", full: true },
      { key: "country", label: "Country", kind: "select", options: WRITER_COUNTRIES },
      { key: "gender", label: "Gender", kind: "select", options: ["m", "f"] },
      { key: "born", label: "Born", kind: "number" },
      { key: "died", label: "Died (optional)", kind: "number", optional: true },
      { key: "bornPlace", label: "Birthplace (optional)", kind: "text", full: true, optional: true },
      { key: "blurb", label: "Blurb", kind: "textarea", full: true },
      { key: "works", label: 'Works — [{ "title", "year" }]', kind: "json", full: true },
      { key: "homes", label: 'Homes — [{ "from", "place" }] (optional)', kind: "json", full: true, optional: true },
    ],
    summary: (r) => `${str(r.name)} (${str(r.country)}, ${num(r.born)}${r.died ? `–${num(r.died)}` : ""})`,
    tags: (r) => [str(r.country), "writers", decadeTag(r.born)],
    blank: () => ({ name: "", country: "CZ", gender: "m", born: 1900, blurb: "", works: [] }),
  },
];

export function sourceByKey(key: string): ContentSource | undefined {
  return CONTENT_SOURCES.find((s) => s.key === key);
}

/** Lower-cased haystack of a record's values + derived tags, for searching. */
export function searchHaystack(source: ContentSource, r: ContentRecord): string {
  const values = Object.values(r).map((v) => str(v));
  return [...values, source.category, source.label, ...source.tags(r)]
    .join(" ")
    .toLowerCase();
}

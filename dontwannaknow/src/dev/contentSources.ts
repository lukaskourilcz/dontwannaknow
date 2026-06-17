// Describes every editable dataset for the /dev content editor: which JSON file
// it maps to, the category it belongs to, the fields to edit, and how to build
// a one-line summary and search tags for each record. Adding a new dataset to
// the editor is just a matter of adding an entry here.

import { CURRENT_YEAR } from "../lib/datetime";

export type FieldKind = "text" | "textarea" | "number" | "select";

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

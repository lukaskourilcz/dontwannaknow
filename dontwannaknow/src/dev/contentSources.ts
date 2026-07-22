// Describes every editable dataset for the /dev content editor: which JSON file
// it maps to, the category it belongs to, the fields to edit, and how to build
// a one-line summary and search tags for each record. Adding a new dataset to
// the editor is just a matter of adding an entry here.

import { CURRENT_YEAR } from "../lib/datetime";
import { COUNTRY_DECADE_BUCKETS, CULTURE_LIST_FIELDS } from "../data/_grouped";

// "list"  → a string[] edited one item per line.
// "json"  → an arbitrary nested value edited as raw JSON (objects/arrays).
export type FieldKind = "text" | "textarea" | "number" | "boolean" | "select" | "list" | "json";

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

export type Category = "editorial" | "countries" | "cities" | "years" | "culture" | "sports";

export const CATEGORY_LABELS: Record<Category, string> = {
  editorial: "Redakční pravidla",
  countries: "Země",
  cities: "Města",
  years: "Roky",
  culture: "Kultura",
  sports: "Sport",
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
      { key: "year", label: "Rok", kind: "number" },
      { key: "title", label: "Název", kind: "text", full: true },
      { key: "creator", label: "Autor", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.title)} · ${str(r.creator)}`,
    tags: (r) => [...extraTags, decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, title: "", creator: "" }),
  };
}

export const CONTENT_SOURCES: ContentSource[] = [
  {
    key: "dataSources",
    label: "Zdroje a stav dat",
    category: "editorial",
    fields: [
      { key: "dataset", label: "Datová sada", kind: "text" },
      { key: "source", label: "Zdroj", kind: "text", full: true },
      { key: "url", label: "Odkaz na zdroj", kind: "text", full: true, optional: true },
      { key: "confidence", label: "Stav ověření", kind: "select", options: ["verified", "review-needed"] },
      { key: "publicRuntime", label: "Používá veřejná zpráva", kind: "boolean" },
      { key: "notes", label: "Poznámka", kind: "textarea", full: true, optional: true },
    ],
    summary: (record) => `${str(record.dataset)} · ${str(record.source)}`,
    tags: (record) => [str(record.confidence), record.publicRuntime ? "public" : "archive"],
    blank: () => ({ dataset: "", source: "", confidence: "review-needed", publicRuntime: false }),
  },
  {
    key: "editorialRules",
    label: "Tón, citlivost a sdílení",
    category: "editorial",
    fields: [
      { key: "id", label: "Stálý identifikátor", kind: "text", full: true },
      { key: "pattern", label: "Textový vzor (regulární výraz)", kind: "textarea", full: true },
      { key: "chapter", label: "Kapitola (nepovinné)", kind: "select", optional: true, options: ["birth", "early-childhood", "everyday-day", "teenage-years", "different-from-today", "changing-world", "generation-context", "life-numbers"] },
      { key: "tone", label: "Tón", kind: "select", options: ["warm", "playful", "neutral", "serious"] },
      { key: "sensitivity", label: "Citlivost", kind: "select", options: ["none", "mild", "difficult"] },
      { key: "shareSafe", label: "Bezpečné pro sdílení", kind: "boolean" },
      { key: "featured", label: "Doporučené", kind: "boolean", optional: true },
      { key: "geographicScope", label: "Geografický rozsah", kind: "select", optional: true, options: ["city", "modern-country", "historical-state", "wider-state", "global"] },
      { key: "historicalEntityId", label: "Historická entita", kind: "text", optional: true },
      { key: "ageFrom", label: "Minimální věk", kind: "number", optional: true },
      { key: "ageTo", label: "Maximální věk", kind: "number", optional: true },
      { key: "sourceConfidence", label: "Důvěra ve zdroj", kind: "select", options: ["verified", "review-needed"] },
      { key: "reviewRequired", label: "Vyžaduje kontrolu", kind: "boolean" },
    ],
    summary: (record) => `${str(record.id)} · ${str(record.sensitivity)} · ${str(record.pattern)}`,
    tags: (record) => [
      str(record.tone),
      str(record.sensitivity),
      str(record.chapter),
      str(record.sourceConfidence),
      record.reviewRequired ? "review-required" : "verified",
      record.shareSafe ? "share-safe" : "share-unsafe",
    ],
    blank: () => ({
      id: "new-rule",
      pattern: "",
      tone: "neutral",
      sensitivity: "none",
      shareSafe: true,
      sourceConfidence: "review-needed",
      reviewRequired: true,
    }),
  },
  {
    key: "events",
    label: "Světové události",
    category: "years",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "mood", label: "Nálada", kind: "select", options: MOODS },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.text)}`,
    tags: (r) => ["world", str(r.mood), decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, text: "", mood: "milestone" }),
  },
  {
    key: "countryEvents",
    label: "Události podle země",
    category: "countries",
    fields: [
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "year", label: "Rok", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), decadeTag(r.year)],
    blank: () => ({ country: "CZ", year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "history",
    label: "Archiv historie · vyžaduje kontrolu",
    category: "countries",
    fields: [
      { key: "country", label: "Země", kind: "select", options: ["cz", "ua"] },
      { key: "year", label: "Rok", kind: "number" },
      { key: "category", label: "Kategorie", kind: "text" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), str(r.category), decadeTag(r.year)],
    blank: () => ({ country: "cz", year: CURRENT_YEAR, category: "", text: "" }),
  },
  {
    key: "monthlyEvents",
    label: "Události podle měsíců",
    category: "years",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "month", label: "Month (1–12)", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)}/${num(r.month)} — ${str(r.text)}`,
    tags: (r) => ["month", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, month: 1, text: "" }),
  },
  {
    key: "cosmicEvents",
    label: "Vesmírné události",
    category: "years",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.text)}`,
    tags: (r) => ["science", "sky", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "inventions",
    label: "Vynálezy",
    category: "years",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "name", label: "Název", kind: "text", full: true },
      { key: "detail", label: "Detail (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)}`,
    tags: (r) => ["tech", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "" }),
  },
  {
    key: "notableDeaths",
    label: "Úmrtí známých osobností",
    category: "culture",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "name", label: "Jméno", kind: "text", full: true },
      { key: "role", label: "Obor", kind: "text", full: true },
      { key: "note", label: "Note (optional)", kind: "textarea", full: true, optional: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)} (${str(r.role)})`,
    tags: (r) => ["people", "death", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "", role: "" }),
  },
  {
    key: "famousBirths",
    label: "Narození známých osobností",
    category: "culture",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "name", label: "Jméno", kind: "text", full: true },
      { key: "role", label: "Obor", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.year)} — ${str(r.name)} (${str(r.role)})`,
    tags: (r) => ["people", "birth", decadeTag(r.year)],
    blank: () => ({ year: CURRENT_YEAR, name: "", role: "" }),
  },
  {
    key: "extinctions",
    label: "Vyhynulé druhy",
    category: "years",
    fields: [
      { key: "species", label: "Druh", kind: "text", full: true },
      { key: "lastConfirmedYear", label: "Rok posledního potvrzeného výskytu", kind: "number" },
      { key: "declaredExtinctYear", label: "Rok prohlášení za vyhynulý", kind: "number" },
      { key: "note", label: "Poznámka", kind: "textarea", full: true },
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
    label: "Městské souvislosti",
    category: "cities",
    fields: [
      { key: "city", label: "Identifikátor města", kind: "text" },
      { key: "year", label: "Rok", kind: "number" },
      { key: "text", label: "Text", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.city)} ${num(r.year)} — ${str(r.text)}`,
    tags: (r) => [str(r.city), decadeTag(r.year)],
    blank: () => ({ city: "", year: CURRENT_YEAR, text: "" }),
  },
  {
    key: "sports",
    label: "Sportovní události",
    category: "sports",
    fields: [
      { key: "year", label: "Rok", kind: "number" },
      { key: "country", label: "Země (nepovinné)", kind: "text", optional: true },
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
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "bucket", label: "Kategorie", kind: "select", options: DECADE_BUCKETS },
      { key: "text", label: "Souvislost", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.bucket)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), str(r.bucket), decadeTag(r.decadeStart)],
    blank: () => ({ country: "CZ", decadeStart: 1950, bucket: "government", text: "" }),
  },
  {
    key: "famousPeople",
    label: "Známé osobnosti",
    category: "culture",
    fields: [
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "name", label: "Jméno", kind: "text", full: true },
      { key: "role", label: "Obor", kind: "text", full: true },
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
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "kind", label: "Druh", kind: "select", options: ["read", "watch"] },
      { key: "text", label: "Název nebo médium", kind: "textarea", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.kind)} — ${str(r.text)}`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), str(r.kind), "media"],
    blank: () => ({ country: "CZ", decadeStart: 1950, kind: "read", text: "" }),
  },
  {
    key: "slang",
    label: "Dobový slang",
    category: "culture",
    fields: [
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "phrase", label: "Výraz", kind: "text", full: true },
      { key: "meaning", label: "Význam", kind: "text", full: true },
    ],
    summary: (r) => `${num(r.decadeStart)}s — “${str(r.phrase)}”: ${str(r.meaning)}`,
    tags: (r) => [decadeTag(r.decadeStart), "slang"],
    blank: () => ({ decadeStart: 1950, phrase: "", meaning: "" }),
  },
  {
    key: "babyNames",
    label: "Dětská jména",
    category: "culture",
    fields: [
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "sex", label: "Pohlaví", kind: "select", options: ["boys", "girls"] },
      { key: "name", label: "Jméno", kind: "text", full: true },
    ],
    summary: (r) => `${str(r.country)} ${num(r.decadeStart)}s · ${str(r.sex)} — ${str(r.name)}`,
    tags: (r) => [str(r.country), decadeTag(r.decadeStart), "names", str(r.sex)],
    blank: () => ({ country: "US", decadeStart: 1950, sex: "boys", name: "" }),
  },
  {
    key: "culture",
    label: "Kultura (písně, filmy a knihy)",
    category: "culture",
    fields: [
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "field", label: "Pole", kind: "select", options: CULTURE_FIELDS },
      { key: "text", label: "Hodnota", kind: "textarea", full: true },
    ],
    summary: (r) => `${num(r.decadeStart)}s · ${str(r.field)} — ${str(r.text)}`,
    tags: (r) => [decadeTag(r.decadeStart), str(r.field)],
    blank: () => ({ decadeStart: 1950, field: "topSongs", text: "" }),
  },
  {
    key: "education",
    label: "Dobové vzdělávání",
    category: "countries",
    fields: [
      { key: "country", label: "Země", kind: "select", options: COUNTRY_CODES },
      { key: "decadeStart", label: "Decade (e.g. 1950)", kind: "number" },
      { key: "compulsoryEnd", label: "Věk ukončení povinné školní docházky", kind: "number" },
      { key: "avgYearsSchooling", label: "Průměrná délka vzdělávání", kind: "number" },
      { key: "highSchoolGradPct", label: "High-school grad %", kind: "number" },
      { key: "universityPct", label: "University %", kind: "number" },
      { key: "literacyPct", label: "Literacy %", kind: "number" },
      { key: "commonJobs", label: "Common jobs (one per line)", kind: "list", full: true },
      { key: "subjects", label: "School subjects (one per line)", kind: "list", full: true },
      { key: "classroom", label: "Poznámka ke škole", kind: "textarea", full: true },
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
    label: "Spisovatelé",
    category: "culture",
    fields: [
      { key: "name", label: "Jméno", kind: "text", full: true },
      { key: "country", label: "Země", kind: "select", options: WRITER_COUNTRIES },
      { key: "gender", label: "Rod", kind: "select", options: ["m", "f"] },
      { key: "born", label: "Rok narození", kind: "number" },
      { key: "died", label: "Died (optional)", kind: "number", optional: true },
      { key: "bornPlace", label: "Birthplace (optional)", kind: "text", full: true, optional: true },
      { key: "blurb", label: "Popis", kind: "textarea", full: true },
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

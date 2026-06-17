// Central, UI-editable game configuration.
//
// `DEFAULT_SETTINGS` holds the values that used to be hard-coded around the
// codebase. `gameSettings.json` (edited from /dev/settings) holds the saved
// settings, which we merge over the defaults — so a partial or a full file both
// work. Because the JSON is imported at build time, changes take effect on the
// next reload, no backend required.

import type { Country } from "../data/countryDecades";
import overrides from "./gameSettings.json";

export type Lang = "cs" | "en";

export type GameSettings = {
  /** Language the UI starts in before the user picks one. */
  defaultLang: Lang;

  /** Exchange rates used to show historical USD prices in local money. */
  usdToCzk: number;
  usdToUah: number;

  /** Most people that can be compared at once in the wizard. */
  maxPeople: number;
  /** Earliest birth year the wizard will accept. */
  minBirthYear: number;
  /** Order (and which) countries appear in the wizard's country picker. */
  countryOrder: Country[];
  /** Pre-filled names for the 1st, 2nd, … person in the wizard. */
  defaultLabels: string[];

  /** Duration of the stat count-up animation, in milliseconds. */
  countUpDurationMs: number;
  /** How long the "Link copied" confirmation stays up, in milliseconds. */
  shareCopiedResetMs: number;

  /** Writers who died up to this many years before a birth are still shown. */
  writersDeadGraceYears: number;
  /** Today's world population, as it should read in the generated prose. */
  currentWorldPopulationText: string;

  /** Local hour (0–23) the birth-night sky chart is drawn for. */
  skyViewingHour: number;
};

export const DEFAULT_SETTINGS: GameSettings = {
  defaultLang: "cs",
  usdToCzk: 23,
  usdToUah: 41,
  maxPeople: 2,
  minBirthYear: 1900,
  countryOrder: ["CZ", "US", "ES", "UA", "CA", "MX", "INTL"],
  defaultLabels: ["Já", "Máma"],
  countUpDurationMs: 950,
  shareCopiedResetMs: 1800,
  writersDeadGraceYears: 40,
  currentWorldPopulationText: "8,1 miliardy",
  skyViewingHour: 23,
};

/** Every country code the picker can contain, for the settings editor. */
export const ALL_COUNTRIES: Country[] = [
  "CZ",
  "US",
  "ES",
  "UA",
  "CA",
  "MX",
  "INTL",
];

/** Describes each setting so /dev/settings can render an editor generically. */
export type SettingField = {
  key: keyof GameSettings;
  label: string;
  help?: string;
  group: string;
  kind: "number" | "text" | "select" | "stringList" | "countryList";
  options?: string[];
};

export const SETTINGS_SCHEMA: SettingField[] = [
  { key: "defaultLang", label: "Default language", group: "Language", kind: "select", options: ["cs", "en"] },
  { key: "usdToCzk", label: "USD → CZK rate", group: "Money", kind: "number", help: "Historical prices are stored in USD and shown in CZK." },
  { key: "usdToUah", label: "USD → UAH rate", group: "Money", kind: "number", help: "Used for Ukrainian subjects." },
  { key: "maxPeople", label: "Max people to compare", group: "Wizard", kind: "number" },
  { key: "minBirthYear", label: "Earliest birth year", group: "Wizard", kind: "number" },
  { key: "countryOrder", label: "Country picker order", group: "Wizard", kind: "countryList", help: "Which countries appear, and in what order." },
  { key: "defaultLabels", label: "Default person names", group: "Wizard", kind: "stringList", help: "Pre-filled name for the 1st, 2nd, … person." },
  { key: "countUpDurationMs", label: "Count-up animation (ms)", group: "Animation", kind: "number" },
  { key: "shareCopiedResetMs", label: "'Link copied' duration (ms)", group: "Animation", kind: "number" },
  { key: "writersDeadGraceYears", label: "Writers 'recently died' window (yrs)", group: "Content", kind: "number" },
  { key: "currentWorldPopulationText", label: "Current world population text", group: "Content", kind: "text" },
  { key: "skyViewingHour", label: "Sky chart hour (0–23)", group: "Sky", kind: "number" },
];

/** The effective settings: defaults with the saved overrides applied on top. */
export const settings: GameSettings = {
  ...DEFAULT_SETTINGS,
  ...(overrides as Partial<GameSettings>),
};

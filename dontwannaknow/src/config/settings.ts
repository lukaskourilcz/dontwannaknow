// Central, UI-editable product configuration.
//
// `DEFAULT_SETTINGS` holds the values that used to be hard-coded around the
// codebase. `productSettings.json` (edited from /dev/settings) holds the saved
// settings, which we merge over the defaults — so a partial or a full file both
// work. Because the JSON is imported at build time, changes take effect on the
// next reload, no backend required.

import overrides from "./productSettings.json";

export type ProductSettings = {
  /** Earliest birth year the form will accept. */
  minBirthYear: number;

  /** Duration of the stat count-up animation, in milliseconds. */
  countUpDurationMs: number;
  /** How long the "Link copied" confirmation stays up, in milliseconds. */
  shareCopiedResetMs: number;

  /** Today's world population, as it should read in the generated prose. */
  currentWorldPopulationText: string;

  /** Local hour (0–23) the birth-night sky chart is drawn for. */
  skyViewingHour: number;
};

export const DEFAULT_SETTINGS: ProductSettings = {
  minBirthYear: 1920,
  countUpDurationMs: 950,
  shareCopiedResetMs: 1800,
  currentWorldPopulationText: "8,1 miliardy",
  skyViewingHour: 23,
};

/** Describes each setting so /dev/settings can render an editor generically. */
export type SettingField = {
  key: keyof ProductSettings;
  label: string;
  help?: string;
  group: string;
  kind: "number" | "text";
};

export const SETTINGS_SCHEMA: SettingField[] = [
  { key: "minBirthYear", label: "Nejstarší podporovaný rok", group: "Formulář", kind: "number" },
  { key: "countUpDurationMs", label: "Délka animace čísel (ms)", group: "Pohyb", kind: "number" },
  { key: "shareCopiedResetMs", label: "Délka potvrzení kopie (ms)", group: "Pohyb", kind: "number" },
  { key: "currentWorldPopulationText", label: "Text dnešní světové populace", group: "Obsah", kind: "text" },
  { key: "skyViewingHour", label: "Hodina zobrazení oblohy (0–23)", group: "Obloha", kind: "number" },
];

/** The effective settings: defaults with the saved overrides applied on top. */
export const settings: ProductSettings = {
  ...DEFAULT_SETTINGS,
  ...(overrides as Partial<ProductSettings>),
};

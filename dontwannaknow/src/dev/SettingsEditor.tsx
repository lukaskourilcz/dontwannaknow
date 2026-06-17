import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SETTINGS_SCHEMA,
  ALL_COUNTRIES,
  type GameSettings,
  type SettingField,
} from "../config/settings";
import type { Country } from "../data/countryDecades";
import { loadContent, saveContent, isLiveApiAvailable } from "./contentApi";

type Form = Record<string, string>;

const splitList = (s: string): string[] =>
  s.split(",").map((t) => t.trim()).filter(Boolean);

function toForm(s: GameSettings): Form {
  const form: Form = {};
  for (const field of SETTINGS_SCHEMA) {
    const value = s[field.key];
    form[field.key] = Array.isArray(value) ? value.join(", ") : String(value);
  }
  return form;
}

function fromForm(form: Form): GameSettings {
  const n = (k: keyof GameSettings, fallback: number) => Number(form[k]) || fallback;
  const countries = splitList(form.countryOrder)
    .map((c) => c.toUpperCase())
    .filter((c): c is Country => (ALL_COUNTRIES as string[]).includes(c));
  const labels = splitList(form.defaultLabels);
  return {
    defaultLang: form.defaultLang === "en" ? "en" : "cs",
    usdToCzk: n("usdToCzk", DEFAULT_SETTINGS.usdToCzk),
    usdToUah: n("usdToUah", DEFAULT_SETTINGS.usdToUah),
    maxPeople: Math.max(1, n("maxPeople", DEFAULT_SETTINGS.maxPeople)),
    minBirthYear: n("minBirthYear", DEFAULT_SETTINGS.minBirthYear),
    countryOrder: countries.length ? countries : DEFAULT_SETTINGS.countryOrder,
    defaultLabels: labels.length ? labels : DEFAULT_SETTINGS.defaultLabels,
    countUpDurationMs: n("countUpDurationMs", DEFAULT_SETTINGS.countUpDurationMs),
    shareCopiedResetMs: n("shareCopiedResetMs", DEFAULT_SETTINGS.shareCopiedResetMs),
    writersDeadGraceYears: n("writersDeadGraceYears", DEFAULT_SETTINGS.writersDeadGraceYears),
    currentWorldPopulationText:
      form.currentWorldPopulationText || DEFAULT_SETTINGS.currentWorldPopulationText,
    skyViewingHour: Math.min(23, Math.max(0, n("skyViewingHour", DEFAULT_SETTINGS.skyViewingHour))),
  };
}

const GROUPS = [...new Set(SETTINGS_SCHEMA.map((f) => f.group))];

export default function SettingsEditor() {
  const [form, setForm] = useState<Form | null>(null);
  const [live, setLive] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLive(await isLiveApiAvailable());
      const overrides = (await loadContent<Partial<GameSettings>>("settings")) ?? {};
      if (alive) setForm(toForm({ ...DEFAULT_SETTINGS, ...overrides }));
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!form) return <p className="dev-loading">Loading settings…</p>;

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  async function save() {
    if (!form) return;
    const res = await saveContent("settings", fromForm(form));
    if (res.persisted) setStatus("Saved · reload the game to see the change.");
    else if (res.ok) setStatus("Downloaded gameSettings.json — drop it into src/config to keep it.");
    else setStatus(`Save failed: ${res.error ?? "unknown"}`);
  }

  function resetAll() {
    if (!confirm("Reset all settings to their defaults?")) return;
    setForm(toForm(DEFAULT_SETTINGS));
    setStatus("Defaults restored in the form — press Save to apply.");
  }

  return (
    <div className="dev-settings">
      {!live && (
        <p className="dev-banner">
          Read-only: the dev server API isn't reachable. Saving will download
          <code> gameSettings.json</code> instead of writing it.
        </p>
      )}
      <p className="dev-meta">
        These control the live game. Defaults are restored for any field left blank.
        {status && <span className="dev-status"> · {status}</span>}
      </p>

      {GROUPS.map((group) => (
        <fieldset key={group} className="dev-group">
          <legend>{group}</legend>
          <div className="dev-fields">
            {SETTINGS_SCHEMA.filter((f) => f.group === group).map((field) => (
              <SettingInput key={field.key} field={field} value={form[field.key]} onChange={set} />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="dev-modal-actions">
        <button className="dev-btn dev-btn-danger" type="button" onClick={resetAll}>
          Reset to defaults
        </button>
        <button className="dev-btn dev-btn-primary" type="button" onClick={save}>
          Save settings
        </button>
      </div>
    </div>
  );
}

function SettingInput({
  field,
  value,
  onChange,
}: {
  field: SettingField;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const full = field.kind === "stringList" || field.kind === "countryList" || field.kind === "text";
  return (
    <label className={`dev-field${full ? " dev-field-full" : ""}`}>
      <span>{field.label}</span>
      {field.kind === "select" ? (
        <select className="dev-input" value={value} onChange={(e) => onChange(field.key, e.target.value)}>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="dev-input"
          type={field.kind === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
      {field.help && <small className="dev-help">{field.help}</small>}
      {field.kind === "countryList" && (
        <small className="dev-help">Comma-separated codes: {ALL_COUNTRIES.join(", ")}</small>
      )}
    </label>
  );
}

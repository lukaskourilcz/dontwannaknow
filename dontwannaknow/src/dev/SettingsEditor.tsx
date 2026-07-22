import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SETTINGS_SCHEMA,
  type ProductSettings,
  type SettingField,
} from "../config/settings";
import { loadContent, saveContent, isLiveApiAvailable } from "./contentApi";

type Form = Record<string, string>;

function toForm(s: ProductSettings): Form {
  const form: Form = {};
  for (const field of SETTINGS_SCHEMA) {
    const value = s[field.key];
    form[field.key] = Array.isArray(value) ? value.join(", ") : String(value);
  }
  return form;
}

function fromForm(form: Form): ProductSettings {
  const n = (k: keyof ProductSettings, fallback: number) => Number(form[k]) || fallback;
  return {
    minBirthYear: n("minBirthYear", DEFAULT_SETTINGS.minBirthYear),
    countUpDurationMs: n("countUpDurationMs", DEFAULT_SETTINGS.countUpDurationMs),
    shareCopiedResetMs: n("shareCopiedResetMs", DEFAULT_SETTINGS.shareCopiedResetMs),
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
      const overrides = (await loadContent<Partial<ProductSettings>>("settings")) ?? {};
      if (alive) setForm(toForm({ ...DEFAULT_SETTINGS, ...overrides }));
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!form) return <p className="dev-loading">Načítáme nastavení…</p>;

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  async function save() {
    if (!form) return;
    const res = await saveContent("settings", fromForm(form));
    if (res.persisted) setStatus("Uloženo · změny se projeví po obnovení stránky.");
    else if (res.ok) setStatus("Soubor productSettings.json byl stažen. Pro trvalou změnu ho vložte do src/config.");
    else setStatus(`Uložení selhalo: ${res.error ?? "neznámá chyba"}`);
  }

  function resetAll() {
    if (!confirm("Vrátit všechna nastavení na výchozí hodnoty?")) return;
    setForm(toForm(DEFAULT_SETTINGS));
    setStatus("Výchozí hodnoty jsou připravené. Potvrďte je tlačítkem Uložit.");
  }

  return (
    <div className="dev-settings">
      <div className="dev-page-head">
        <h2>Nastavení produktu</h2>
        <p>Prázdná pole se při uložení nahradí výchozími hodnotami.</p>
      </div>

      {!live && (
        <p className="dev-banner">
          Režim pouze pro čtení: vývojové API není dostupné. Uložení místo zápisu
          stáhne soubor <code>productSettings.json</code>.
        </p>
      )}
      {status && (
        <p className="dev-meta" role="status" aria-live="polite">
          <span className="dev-status">{status}</span>
        </p>
      )}

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
          Vrátit výchozí
        </button>
        <button className="dev-btn dev-btn-primary" type="button" onClick={save}>
          Uložit nastavení
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
  const full = field.kind === "text";
  return (
    <label className={`dev-field${full ? " dev-field-full" : ""}`}>
      <span>{field.label}</span>
      <input
        className="dev-input"
        type={field.kind === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {field.help && <small className="dev-help">{field.help}</small>}
    </label>
  );
}

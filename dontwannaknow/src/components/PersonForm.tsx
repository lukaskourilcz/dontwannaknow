import { useState } from "react";
import type { Person } from "../lib/facts";
import { COUNTRY_LABELS, type Country } from "../data/countryDecades";
import { citiesFor } from "../data/cities";
import { useLang } from "../i18n/useLang";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

type Row = {
  id: string;
  label: string;
  year: string;
  country: Country;
  citySlug: string;     // "" means "anywhere in this country"
  meetings: string;     // optional, "see them X times a year"
};

type Props = {
  onSubmit: (people: Person[]) => void;
};

const COUNTRY_ORDER: Country[] = ["US", "CZ", "ES", "UA", "INTL"];

const DEFAULT_ROWS: Row[] = [
  { id: "you",         label: "You",                year: "", country: "US", citySlug: "", meetings: "" },
  { id: "parent",      label: "Mom / Dad",          year: "", country: "US", citySlug: "", meetings: "" },
  { id: "grandparent", label: "Grandma / Grandpa",  year: "", country: "US", citySlug: "", meetings: "" },
];

type ParsedDate = { year: number; month?: number; day?: number };

function parseDate(input: string): ParsedDate | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // ISO: 1953-04-12
  const iso = trimmed.match(/\b(18|19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])\b/);
  if (iso) {
    const year = Number(iso[1] + iso[0].slice(2, 4));
    const fullYear = Number(iso[0].slice(0, 4));
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (fullYear < MIN_YEAR || fullYear > CURRENT_YEAR) return null;
    void year;
    return { year: fullYear, month, day };
  }
  // DD/MM/YYYY or MM/DD/YYYY — assume DD/MM/YYYY (international common).
  const slash = trimmed.match(/\b(0?[1-9]|[12]\d|3[01])[./](0?[1-9]|1[0-2])[./]((?:18|19|20)\d{2})\b/);
  if (slash) {
    const day = Number(slash[1]);
    const month = Number(slash[2]);
    const year = Number(slash[3]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month, day };
  }
  // MM/YYYY or M/YYYY (month + year, no day).
  const monthYear = trimmed.match(/^(0?[1-9]|1[0-2])[./-]((?:18|19|20)\d{2})$/);
  if (monthYear) {
    const month = Number(monthYear[1]);
    const year = Number(monthYear[2]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month };
  }
  // YYYY-MM (ISO without day).
  const yearMonth = trimmed.match(/^((?:18|19|20)\d{2})-(0?[1-9]|1[0-2])$/);
  if (yearMonth) {
    const year = Number(yearMonth[1]);
    const month = Number(yearMonth[2]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month };
  }
  // Year only.
  const yearOnly = trimmed.match(/\b(18|19|20)\d{2}\b/);
  if (yearOnly) {
    const year = Number(yearOnly[0]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year };
  }
  return null;
}

export default function PersonForm({ onSubmit }: Props) {
  const { t } = useLang();
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [error, setError] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        // If the country changed, drop any city selection that doesn't belong.
        if (patch.country && patch.country !== r.country) next.citySlug = "";
        return next;
      }),
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `extra-${prev.length}-${Date.now()}`,
        label: "Another person",
        year: "",
        country: "US",
        citySlug: "",
        meetings: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const people: Person[] = [];
    for (const r of rows) {
      if (!r.year.trim()) continue;
      const parsed = parseDate(r.year);
      if (parsed === null) {
        setError(t("form.err.date", { label: r.label }));
        return;
      }
      const meetingsPerYear = r.meetings.trim()
        ? Number(r.meetings.trim())
        : undefined;
      people.push({
        label: r.label.trim() || "Someone",
        birthYear: parsed.year,
        birthMonth: parsed.month,
        birthDay: parsed.day,
        country: r.country,
        citySlug: r.citySlug || undefined,
        meetingsPerYear:
          meetingsPerYear !== undefined && !Number.isNaN(meetingsPerYear) && meetingsPerYear > 0
            ? meetingsPerYear
            : undefined,
      });
    }
    if (people.length === 0) {
      setError(t("form.err.empty"));
      return;
    }
    setError(null);
    onSubmit(people);
  };

  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <p className="form-intro">{t("form.intro")}</p>
      {t("form.note.english") && (
        <p className="form-note">{t("form.note.english")}</p>
      )}
      <div className="rows">
        {rows.map((r) => {
          const cityOptions = citiesFor(r.country);
          return (
            <div key={r.id} className="row">
              <input
                className="label-input"
                type="text"
                value={r.label}
                onChange={(e) => update(r.id, { label: e.target.value })}
                aria-label={t("form.label")}
              />
              <input
                className="year-input"
                type="text"
                inputMode="numeric"
                placeholder={t("form.year")}
                value={r.year}
                onChange={(e) => update(r.id, { year: e.target.value })}
                aria-label={t("form.year.help")}
              />
              <select
                className="country-input"
                value={r.country}
                onChange={(e) =>
                  update(r.id, { country: e.target.value as Country })
                }
                aria-label={t("form.country")}
              >
                {COUNTRY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {COUNTRY_LABELS[c]}
                  </option>
                ))}
              </select>
              <input
                className="meetings-input"
                type="number"
                min={0}
                max={365}
                placeholder={t("form.meetings")}
                value={r.meetings}
                onChange={(e) => update(r.id, { meetings: e.target.value })}
                aria-label={t("form.meetings.help")}
                title={t("form.meetings.help")}
              />
              <select
                className="city-input"
                value={r.citySlug}
                onChange={(e) => update(r.id, { citySlug: e.target.value })}
                aria-label={t("form.city")}
                disabled={cityOptions.length === 0}
              >
                <option value="">
                  {cityOptions.length ? t("form.city.any") : t("form.city.none")}
                </option>
                {cityOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                    {c.aka ? ` (${c.aka})` : ""}
                  </option>
                ))}
              </select>
              {rows.length > 1 && (
                <button
                  type="button"
                  className="remove"
                  onClick={() => removeRow(r.id)}
                  aria-label={`${t("form.remove")} ${r.label}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="form-actions">
        <button type="button" className="secondary" onClick={addRow}>
          {t("form.add")}
        </button>
        <button type="submit" className="primary">
          {t("form.submit")}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

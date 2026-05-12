import { useState } from "react";
import type { Person } from "../lib/facts";
import { COUNTRY_LABELS, type Country } from "../data/countryDecades";
import { citiesFor } from "../data/cities";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

type Row = {
  id: string;
  label: string;
  year: string;
  country: Country;
  citySlug: string; // "" means "anywhere in this country"
};

type Props = {
  onSubmit: (people: Person[]) => void;
};

const COUNTRY_ORDER: Country[] = ["US", "CZ", "ES", "UA", "INTL"];

const DEFAULT_ROWS: Row[] = [
  { id: "you",         label: "You",                year: "", country: "US", citySlug: "" },
  { id: "parent",      label: "Mom / Dad",          year: "", country: "US", citySlug: "" },
  { id: "grandparent", label: "Grandma / Grandpa",  year: "", country: "US", citySlug: "" },
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
        setError(
          `Couldn't read a date for "${r.label}". Try something like 1953 or 12/03/1953.`,
        );
        return;
      }
      people.push({
        label: r.label.trim() || "Someone",
        birthYear: parsed.year,
        birthMonth: parsed.month,
        birthDay: parsed.day,
        country: r.country,
        citySlug: r.citySlug || undefined,
      });
    }
    if (people.length === 0) {
      setError("Add at least one person with a birth year to see the facts.");
      return;
    }
    setError(null);
    onSubmit(people);
  };

  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <p className="form-intro">
        Enter a birth year (or full date — e.g. 1953-04-12 or 12/04/1953),
        country, and city for each person. Adding a full date unlocks a
        sky chart of the night they were born. Coverage is the top 20
        cities each of Czechia, Spain, Ukraine, the US, Canada and Mexico,
        1920–1980.
      </p>
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
                aria-label="Who"
              />
              <input
                className="year-input"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 1953"
                value={r.year}
                onChange={(e) => update(r.id, { year: e.target.value })}
                aria-label="Year of birth"
              />
              <select
                className="country-input"
                value={r.country}
                onChange={(e) =>
                  update(r.id, { country: e.target.value as Country })
                }
                aria-label="Born in (country)"
              >
                {COUNTRY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {COUNTRY_LABELS[c]}
                  </option>
                ))}
              </select>
              <select
                className="city-input"
                value={r.citySlug}
                onChange={(e) => update(r.id, { citySlug: e.target.value })}
                aria-label="City"
                disabled={cityOptions.length === 0}
              >
                <option value="">
                  {cityOptions.length
                    ? "Anywhere in the country"
                    : "(no cities)"}
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
                  aria-label={`Remove ${r.label}`}
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
          + Add someone
        </button>
        <button type="submit" className="primary">
          Show me their world
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

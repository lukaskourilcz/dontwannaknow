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

function parseYear(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/\b(18|19|20)\d{2}\b/);
  if (!match) return null;
  const year = Number(match[0]);
  if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
  return year;
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
      const y = parseYear(r.year);
      if (y === null) {
        setError(
          `Couldn't read a year for "${r.label}". Try something like 1953 or 12/03/1953.`,
        );
        return;
      }
      people.push({
        label: r.label.trim() || "Someone",
        birthYear: y,
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
        Enter a birth year (or full date), country, and city for each person —
        you, your mom, your grandfather, anyone. City-specific facts cover the
        top 20 cities of Czechia, Spain, Ukraine and the United States,
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

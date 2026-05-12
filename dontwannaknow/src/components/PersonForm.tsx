import { useState } from "react";
import type { Person } from "../lib/facts";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

type Row = {
  id: string;
  label: string;
  year: string;
};

type Props = {
  onSubmit: (people: Person[]) => void;
};

const DEFAULT_ROWS: Row[] = [
  { id: "you", label: "You", year: "" },
  { id: "parent", label: "Mom / Dad", year: "" },
  { id: "grandparent", label: "Grandma / Grandpa", year: "" },
];

function parseYear(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Accept "1953", "12/03/1953", "1953-04-12", etc. — take any 4-digit run.
  const match = trimmed.match(/\b(18|19|20)\d{2}\b/);
  if (!match) return null;
  const year = Number(match[0]);
  if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
  return year;
}

export default function PersonForm({ onSubmit }: Props) {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [error, setError] = useState<string | null>(null);

  const update = (id: string, label: string, year: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, label, year } : r)),
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `extra-${prev.length}`, label: "Another person", year: "" },
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
      people.push({ label: r.label.trim() || "Someone", birthYear: y });
    }
    if (people.length === 0) {
      setError("Add at least one birth year to see the facts.");
      return;
    }
    setError(null);
    onSubmit(people);
  };

  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <p className="form-intro">
        Enter the birth year (or full date of birth) for yourself and the people
        you'd like to learn about.
      </p>
      <div className="rows">
        {rows.map((r) => (
          <div key={r.id} className="row">
            <input
              className="label-input"
              type="text"
              value={r.label}
              onChange={(e) => update(r.id, e.target.value, r.year)}
              aria-label="Who"
            />
            <input
              className="year-input"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1953"
              value={r.year}
              onChange={(e) => update(r.id, r.label, e.target.value)}
              aria-label="Year of birth"
            />
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
        ))}
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

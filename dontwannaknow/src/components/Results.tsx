import type { PersonReport, Fact } from "../lib/facts";
import WorldMap from "./WorldMap";

type Props = {
  reports: PersonReport[];
  onReset: () => void;
  onRegenerate: () => void;
};

const SECTION_ORDER: { key: Fact["category"]; title: string; tone: string }[] = [
  { key: "city", title: "In their hometown", tone: "Year by year, on the streets they grew up on" },
  { key: "bizarre", title: "Bizarre", tone: "Strange-but-true" },
  { key: "beautiful", title: "Beautiful", tone: "The good and the great" },
  { key: "local", title: "Across the country", tone: "" },
  { key: "government", title: "Who was in charge", tone: "Politics & power" },
  { key: "famous", title: "Famous faces of the era", tone: "Writers, artists, leaders" },
  { key: "clothes", title: "What people wore", tone: "" },
  { key: "illness", title: "What people fell ill from", tone: "" },
  { key: "daily", title: "Daily life", tone: "" },
  { key: "food", title: "What was on the table", tone: "" },
  { key: "money", title: "What things cost", tone: "" },
  { key: "world", title: "What the world was doing", tone: "" },
  { key: "everyday", title: "The wider world", tone: "Prices, wages, people" },
  { key: "youth", title: "Growing up", tone: "Songs, screens, fashion" },
];

function groupByCategory(facts: Fact[]) {
  const map = new Map<Fact["category"], string[]>();
  for (const f of facts) {
    const list = map.get(f.category) ?? [];
    list.push(f.text);
    map.set(f.category, list);
  }
  return map;
}

export default function Results({ reports, onReset, onRegenerate }: Props) {
  return (
    <div className="results">
      <div className="results-header">
        <h2>Their world</h2>
        <div className="results-actions">
          <button className="secondary" type="button" onClick={onRegenerate}>
            ↻ Shuffle facts
          </button>
          <button className="secondary" type="button" onClick={onReset}>
            Start over
          </button>
        </div>
      </div>
      {reports.map((r) => {
        const grouped = groupByCategory(r.facts);
        return (
          <article
            key={`${r.person.label}-${r.person.birthYear}-${r.person.country}-${r.person.citySlug ?? "x"}`}
            className="person-card"
          >
            <header className="person-header">
              <h3>{r.person.label}</h3>
              <p className="person-sub">
                Born {r.person.birthYear} in{" "}
                {r.cityLabel ? `${r.cityLabel}, ${r.countryLabel}` : r.countryLabel}
                {" · "}
                {r.ageNow} years on this planet
              </p>
            </header>
            <WorldMap birthYear={r.person.birthYear} />
            {SECTION_ORDER.map(({ key, title, tone }) => {
              const items = grouped.get(key);
              if (!items || items.length === 0) return null;
              return (
                <section key={key} className={`facts facts-${key}`}>
                  <h4>
                    {title}
                    {tone && <span className="tone"> · {tone}</span>}
                  </h4>
                  <ul>
                    {items.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </article>
        );
      })}
      <p className="disclaimer">
        Numbers and texture are rounded historical averages, drawn from
        public datasets and standard histories. Pick "Shuffle facts" to see
        a different mix.
      </p>
    </div>
  );
}

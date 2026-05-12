import type { PersonReport, Fact } from "../lib/facts";

type Props = {
  reports: PersonReport[];
  onReset: () => void;
};

const SECTION_ORDER: { key: Fact["category"]; title: string; tone: string }[] = [
  { key: "bizarre", title: "Bizarre", tone: "Strange-but-true" },
  { key: "beautiful", title: "Beautiful", tone: "The good and the great" },
  { key: "world", title: "What the world was doing", tone: "" },
  { key: "everyday", title: "Everyday life", tone: "Prices, wages, people" },
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

export default function Results({ reports, onReset }: Props) {
  return (
    <div className="results">
      <div className="results-header">
        <h2>Their world</h2>
        <button className="secondary" type="button" onClick={onReset}>
          Start over
        </button>
      </div>
      {reports.map((r) => {
        const grouped = groupByCategory(r.facts);
        return (
          <article key={`${r.person.label}-${r.person.birthYear}`} className="person-card">
            <header className="person-header">
              <h3>{r.person.label}</h3>
              <p className="person-sub">
                Born in {r.person.birthYear} · {r.ageNow} years on this planet
              </p>
            </header>
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
        Numbers are rounded historical averages — mostly US/world figures from
        public datasets. Treat them as the right order of magnitude, not the
        exact penny.
      </p>
    </div>
  );
}

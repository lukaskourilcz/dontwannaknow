// Compact "year brief" for the hero/overview: the year-specific events and
// what things cost that year. Distilled from the same data the old front-page
// (Newspaper) used, now folded into the hero next to the life-in-weeks map.

import type { Person } from "../lib/facts";
import { CITY_FACTS } from "../data/cities";
import { COUNTRY_EVENTS } from "../data/countryEvents";
import { EVENTS } from "../data/events";
import { statsForYear } from "../data/stats";
import { fmtMoney, fmtGasPerLitre } from "../lib/money";
import { capitalize } from "../lib/text";
import { useLang } from "../i18n/useLang";

type Props = {
  person: Person;
};

function toHeadline(text: string): string {
  let h = text.trim();
  if (h.endsWith(".")) h = h.slice(0, -1);
  return capitalize(h);
}

export default function HeroBrief({ person }: Props) {
  const { lang } = useLang();
  const birthYear = person.birthYear;

  const cityFacts = person.citySlug
    ? CITY_FACTS.filter((f) => f.city === person.citySlug && f.year === birthYear)
    : [];
  const countryFacts = COUNTRY_EVENTS.filter(
    (e) => e.country === person.country && e.year === birthYear,
  );
  const worldFacts = EVENTS.filter((e) => e.year === birthYear);

  // Prefer local → country → world, and cap the list so the hero stays tight.
  const events = [
    ...cityFacts.map((f) => f.text),
    ...countryFacts.map((e) => e.text),
    ...worldFacts.map((e) => e.text),
  ].slice(0, 4);

  const stats = statsForYear(birthYear);

  return (
    <div className="year-brief">
      {events.length > 0 && (
        <section className="year-events">
          <h4 className="brief-label">
            {lang === "cs" ? `V roce ${birthYear}` : `In ${birthYear}`}
          </h4>
          <ul>
            {events.map((text, i) => (
              <li key={i}>{toHeadline(text)}.</li>
            ))}
          </ul>
        </section>
      )}

      <section className="year-prices">
        <h4 className="brief-label">{lang === "cs" ? "Co co stálo" : "What it cost"}</h4>
        {lang === "cs" ? (
          <p>
            Chléb {fmtMoney(stats.loafOfBreadUsd, person.country)} za bochník,
            litr benzinu {fmtGasPerLitre(stats.gallonOfGasUsd, person.country)}.
            Průměrná roční mzda kolem{" "}
            {fmtMoney(stats.usAverageAnnualWageUsd, person.country)}.
          </p>
        ) : (
          <p>
            Bread {fmtMoney(stats.loafOfBreadUsd, person.country)} a loaf, a litre
            of petrol {fmtGasPerLitre(stats.gallonOfGasUsd, person.country)}. The
            average annual wage was around{" "}
            {fmtMoney(stats.usAverageAnnualWageUsd, person.country)}.
          </p>
        )}
      </section>
    </div>
  );
}

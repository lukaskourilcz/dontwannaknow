// Compact "year brief" for the hero/overview: the year-specific events and
// what things cost that year. Distilled from the same data the old front-page
// (Newspaper) used, now folded into the hero next to the life-in-weeks map.

import type { Person } from "../lib/facts";
import { CITY_FACTS } from "../data/cities";
import { COUNTRY_EVENTS } from "../data/countryEvents";
import { EVENTS } from "../data/events";
import { economyFor, fmtPrice } from "../data/localEconomy";
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

  const eco = economyFor(person.country, birthYear);

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
            Chléb {fmtPrice(eco.breadLoaf, eco.currency)} za bochník,
            litr benzinu {fmtPrice(eco.petrolLitre, eco.currency)}.
            Průměrná měsíční mzda kolem {fmtPrice(eco.monthlyWage, eco.currency)}.
          </p>
        ) : (
          <p>
            Bread {fmtPrice(eco.breadLoaf, eco.currency)} a loaf, a litre of
            petrol {fmtPrice(eco.petrolLitre, eco.currency)}. The average monthly
            wage was around {fmtPrice(eco.monthlyWage, eco.currency)}.
          </p>
        )}
      </section>
    </div>
  );
}

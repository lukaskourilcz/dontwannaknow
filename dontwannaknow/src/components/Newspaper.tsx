// Vintage front-page mockup for a person's birth year. Built from
// existing facts data — picks the most dramatic local-and-country
// headline of that year and stacks supporting items beneath.

import type { Person } from "../lib/facts";
import { CITY_FACTS, findCity } from "../data/cities";
import { COUNTRY_EVENTS } from "../data/countryEvents";
import { EVENTS } from "../data/events";
import { statsForYear } from "../data/stats";
import { countryLabelFor } from "../data/countryDecades";
import { fmtMoney, fmtGasPerLitre } from "../lib/money";
import { capitalize } from "../lib/text";

type Props = {
  person: Person;
};

function masthead(person: Person): string {
  const city = findCity(person.citySlug);
  if (city) {
    return `${city.name.toUpperCase()} KRONIKA`;
  }
  return `${countryLabelFor(person.country, person.birthYear).toUpperCase()} KRONIKA`;
}

const MONTHS = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];

function formatDate(p: Person): string {
  if (p.birthMonth && p.birthDay) {
    return `${p.birthDay}. ${MONTHS[p.birthMonth - 1]} ${p.birthYear}`;
  }
  return `V roce ${p.birthYear}`;
}

function toHeadline(text: string): string {
  // Strip leading "the" and punctuation, capitalize.
  let h = text.trim();
  if (h.endsWith(".")) h = h.slice(0, -1);
  return capitalize(h);
}

export default function Newspaper({ person }: Props) {
  const birthYear = person.birthYear;
  const cityFacts = person.citySlug
    ? CITY_FACTS.filter((f) => f.city === person.citySlug && f.year === birthYear)
    : [];
  const countryFacts = COUNTRY_EVENTS.filter(
    (e) => e.country === person.country && e.year === birthYear,
  );
  const worldFacts = EVENTS.filter((e) => e.year === birthYear);

  // Promote: pick a top headline. Prefer city → country → world.
  const pool = [...cityFacts, ...countryFacts, ...worldFacts.map((e) => ({ city: "", year: e.year, text: e.text }))];
  if (pool.length === 0) {
    // No data for this year — render a minimal stub.
    return (
      <section className="newspaper">
        <div className="newspaper-masthead">{masthead(person)}</div>
        <div className="newspaper-date">{formatDate(person)}</div>
        <hr />
        <p className="newspaper-stub">
          Historie si o tomto konkrétním dni zde nevedla podrobné
          záznamy, ale život šel dál — trhy se otevíraly, pekl se
          chléb, děti chodily do školy.
        </p>
      </section>
    );
  }

  const top = pool[0];
  const secondary = pool.slice(1, 4);
  const stats = statsForYear(birthYear);

  // Pick one supporting world fact if we haven't already used world stuff.
  const worldOther = EVENTS.filter(
    (e) => e.year === birthYear && e.text !== top.text,
  ).slice(0, 1);

  return (
    <section className="newspaper" aria-label="Titulní strana dobových novin">
      <div className="newspaper-masthead">{masthead(person)}</div>
      <div className="newspaper-date">
        {formatDate(person)} &nbsp;·&nbsp; Ročník {Math.max(1, birthYear - 1849)}{" "}
        č. {((birthYear * 7) % 365) + 1} &nbsp;·&nbsp; Dva haléře
      </div>
      <hr />
      <h2 className="newspaper-headline">{toHeadline(top.text)}.</h2>
      {secondary.length > 0 && (
        <ul className="newspaper-subheads">
          {secondary.map((s, i) => (
            <li key={i}>{toHeadline(s.text)}.</li>
          ))}
        </ul>
      )}
      <hr />
      <div className="newspaper-columns">
        <div>
          <h3>Ve světě kolem nás</h3>
          <p>
            {worldOther.length > 0
              ? capitalize(worldOther[0].text) + "."
              : "Nový rok — a jako každý jiný plný všedních vítězství i všedních ztrát."}
          </p>
        </div>
        <div>
          <h3>Co co stálo</h3>
          <p>
            Chléb {fmtMoney(stats.loafOfBreadUsd, person.country)} za bochník,
            litr benzinu {fmtGasPerLitre(stats.gallonOfGasUsd, person.country)}.
            Průměrná roční mzda kolem{" "}
            {fmtMoney(stats.usAverageAnnualWageUsd, person.country)}.
          </p>
        </div>
      </div>
    </section>
  );
}

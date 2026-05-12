import type { PersonReport } from "../lib/facts";
import { generationFor } from "../data/generations";
import { lifeExpectancyFor } from "../data/lifeExpectancy";
import { useLang } from "../i18n/useLang";

type Props = {
  report: PersonReport;
};

const MONTHS_CS = [
  "leden", "únor", "březen", "duben", "květen", "červen",
  "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Compact, high-impact stat row that sits at the top of every person card.
 * Surfaces the most emotional numbers: days lived, generation, and (if
 * meetings/year is set) remaining meetings.
 */
export default function HeroSummary({ report }: Props) {
  const { lang } = useLang();
  const { person, ageNow } = report;
  const months = lang === "cs" ? MONTHS_CS : MONTHS_EN;

  const yearsRemainingRaw = lifeExpectancyFor(person.country) - ageNow;
  const yearsRemaining = Math.max(0, yearsRemainingRaw);
  const past = Math.max(0, -yearsRemainingRaw);

  // Days lived — using birth date if known, else 1 July as midpoint.
  const birthDate = new Date(
    Date.UTC(
      person.birthYear,
      (person.birthMonth ?? 7) - 1,
      person.birthDay ?? 1,
    ),
  );
  const daysLived = Math.max(
    0,
    Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const generation = generationFor(person.birthYear);

  const dateStr = (() => {
    if (person.birthMonth && person.birthDay) {
      return `${person.birthDay} ${months[person.birthMonth - 1]} ${person.birthYear}`;
    }
    if (person.birthMonth) {
      return `${months[person.birthMonth - 1]} ${person.birthYear}`;
    }
    return String(person.birthYear);
  })();

  const T = {
    cs: {
      bornOn: "Narozen/a",
      daysLived: "Dnů na zemi",
      generation: "Generace",
      yearsLeft: "Pravděpodobně zbývá",
      yearsPast: "Za průměrnou délkou života",
      meetingsLeft: "Setkání zbývá",
      meetingsHint: (n: number) => `při ${n}× ročně`,
      meetingsBonus: "Každá návštěva je bonus.",
      bonusYears: "let bonusu",
      years: (n: number) => (n === 1 ? "rok" : n < 5 ? "roky" : "let"),
    },
    en: {
      bornOn: "Born",
      daysLived: "Days on earth",
      generation: "Generation",
      yearsLeft: "Years likely left",
      yearsPast: "Past life expectancy",
      meetingsLeft: "Meetings left",
      meetingsHint: (n: number) => `at ${n}× a year`,
      meetingsBonus: "Every visit is a bonus.",
      bonusYears: "bonus years",
      years: (n: number) => (n === 1 ? "year" : "years"),
    },
  } as const;

  const t = T[lang];

  // Decide which 3-4 cards to show.
  const cards: Array<{
    label: string;
    value: string;
    unit?: string;
    detail?: string;
    accent?: boolean;
  }> = [];

  cards.push({
    label: t.bornOn,
    value: dateStr,
    detail: report.cityLabel
      ? `${report.cityLabel}, ${report.countryLabel}`
      : report.countryLabel,
  });

  cards.push({
    label: t.daysLived,
    value: daysLived.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US"),
  });

  if (generation) {
    cards.push({
      label: t.generation,
      value: generation.label,
      detail: `${generation.startYear}–${generation.endYear}`,
    });
  }

  if (past > 0) {
    cards.push({
      label: t.yearsPast,
      value: `+${past}`,
      unit: t.bonusYears,
      detail: t.meetingsBonus,
      accent: true,
    });
  } else {
    cards.push({
      label: t.yearsLeft,
      value: String(yearsRemaining),
      unit: `~ ${t.years(yearsRemaining)}`,
      accent: false,
    });
  }

  if (person.meetingsPerYear && person.meetingsPerYear > 0 && past === 0) {
    const meetings = Math.round(yearsRemaining * person.meetingsPerYear);
    cards.push({
      label: t.meetingsLeft,
      value: String(meetings),
      detail: t.meetingsHint(person.meetingsPerYear),
      accent: true,
    });
  }

  return (
    <div className="hero-summary" aria-label="Summary">
      {cards.map((c, i) => (
        <div key={i} className={`hero-stat${c.accent ? " accent" : ""}`}>
          <span className="hero-stat-label">{c.label}</span>
          <span className="hero-stat-value">
            {c.value}
            {c.unit && <span className="unit"> {c.unit}</span>}
          </span>
          {c.detail && <span className="hero-stat-detail">{c.detail}</span>}
        </div>
      ))}
    </div>
  );
}

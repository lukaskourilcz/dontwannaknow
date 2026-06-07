import { g, type PersonReport } from "../lib/facts";
import { useLang } from "../i18n/useLang";
import { useCountUp } from "../lib/useCountUp";

/**
 * Renders a stat-card value with a tasteful count-up animation when the
 * value parses as a number. Non-numeric strings (dates, generation
 * names) render as-is.
 */
function StatValue({ value, locale }: { value: string; locale: string }) {
  const raw = value.replace(/[,\s+~]/g, "");
  const asNumber = Number(raw);
  const isNumber = !Number.isNaN(asNumber) && /^\+?\d/.test(value.trim());
  const animated = useCountUp(isNumber ? asNumber : value, 950);

  if (!isNumber || typeof animated !== "number") return <>{value}</>;
  const prefix = value.trim().startsWith("+") ? "+" : "";
  return <>{prefix}{animated.toLocaleString(locale)}</>;
}

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
 * Surfaces the most resonant numbers: date of birth, days lived, and the
 * rough years remaining (or bonus years past life expectancy).
 */
export default function HeroSummary({ report }: Props) {
  const { lang } = useLang();
  const { person, ageNow } = report;
  const months = lang === "cs" ? MONTHS_CS : MONTHS_EN;

  const yearsRemainingRaw = 100 - ageNow;
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
      daysLived: "Dnů na zemi",
      yearsLeft: "Do stovky zbývá",
      yearsPast: "Přes sto let",
      bonusNote: "Každý den navíc je dar.",
      bonusYears: "let bonusu",
      years: (n: number) => (n === 1 ? "rok" : n < 5 ? "roky" : "let"),
    },
    en: {
      daysLived: "Days on earth",
      yearsLeft: "Years to 100",
      yearsPast: "Past 100",
      bonusNote: "Every day past it is a gift.",
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
    label: lang === "cs" ? g(person.gender, "Narozen", "Narozena") : "Born",
    value: dateStr,
    detail: report.cityLabel
      ? `${report.cityLabel}, ${report.countryLabel}`
      : report.countryLabel,
  });

  cards.push({
    label: t.daysLived,
    value: daysLived.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US"),
  });

  if (past > 0) {
    cards.push({
      label: t.yearsPast,
      value: `+${past}`,
      unit: t.bonusYears,
      detail: t.bonusNote,
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

  const locale = lang === "cs" ? "cs-CZ" : "en-US";

  return (
    <div className="hero-summary" aria-label="Summary">
      {cards.map((c, i) => (
        <div key={i} className={`hero-stat${c.accent ? " accent" : ""}`}>
          <span className="hero-stat-label">{c.label}</span>
          <span className="hero-stat-value">
            <StatValue value={c.value} locale={locale} />
            {c.unit && <span className="unit"> {c.unit}</span>}
          </span>
          {c.detail && <span className="hero-stat-detail">{c.detail}</span>}
        </div>
      ))}
    </div>
  );
}

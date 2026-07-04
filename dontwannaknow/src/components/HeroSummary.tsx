import { genderForm, type PersonReport } from "../lib/facts";
import { useLang } from "../i18n/useLang";
import { useCountUp } from "../lib/useCountUp";
import { birthDateUTC, daysSince } from "../lib/datetime";
import { settings } from "../config/settings";

/**
 * Renders a stat-card value with a tasteful count-up animation when the
 * value parses as a number. Non-numeric strings (dates, generation
 * names) render as-is.
 */
function StatValue({ value, locale }: { value: string; locale: string }) {
  const raw = value.replace(/[,\s+~]/g, "");
  const asNumber = Number(raw);
  const isNumber = !Number.isNaN(asNumber) && /^\+?\d/.test(value.trim());
  const animated = useCountUp(isNumber ? asNumber : value, settings.countUpDurationMs);

  if (!isNumber || typeof animated !== "number") return <>{value}</>;
  const prefix = value.trim().startsWith("+") ? "+" : "";
  return <>{prefix}{animated.toLocaleString(locale)}</>;
}

type Props = {
  report: PersonReport;
};

/**
 * Compact, high-impact stat row that sits at the top of every person card.
 * Surfaces the most resonant numbers: date of birth, days lived, and the
 * rough years remaining (or bonus years past life expectancy).
 */
export default function HeroSummary({ report }: Props) {
  const { lang } = useLang();
  const { person, ageNow } = report;

  const yearsRemainingRaw = 100 - ageNow;
  const yearsRemaining = Math.max(0, yearsRemainingRaw);
  const past = Math.max(0, -yearsRemainingRaw);

  const daysLived = daysSince(
    birthDateUTC(person.birthYear, person.birthMonth, person.birthDay),
  );

  // The day of the week they were born — a tiny fact almost nobody knows
  // about themselves. Only shown when we have the full date.
  const WEEKDAYS = {
    cs: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  } as const;
  const weekday =
    person.birthMonth && person.birthDay
      ? WEEKDAYS[lang][
          birthDateUTC(person.birthYear, person.birthMonth, person.birthDay).getUTCDay()
        ]
      : null;

  const dateStr = (() => {
    if (person.birthMonth && person.birthDay) {
      return `${person.birthDay}. ${person.birthMonth}. ${person.birthYear}`;
    }
    if (person.birthMonth) {
      return `${person.birthMonth}. ${person.birthYear}`;
    }
    return String(person.birthYear);
  })();

  // Localised copy for this component's stat labels. (UI chrome elsewhere
  // goes through the i18n `t()`; these stay inline because they pair with
  // the numbers computed right here.)
  const COPY = {
    cs: {
      daysLived: "Dnů na zemi",
      yearsLeft: "Do stovky zbývá",
      yearsPast: "Přes sto let",
      bonusNote: "Každý den navíc je dar.",
      bonusYears: "let bonusu",
    },
    en: {
      daysLived: "Days on earth",
      yearsLeft: "Years to 100",
      yearsPast: "Past 100",
      bonusNote: "Every day past it is a gift.",
      bonusYears: "bonus years",
    },
  } as const;

  const copy = COPY[lang];

  // Decide which 3-4 cards to show.
  const cards: Array<{
    label: string;
    value: string;
    unit?: string;
    detail?: string;
    accent?: boolean;
  }> = [];

  const place = report.cityLabel
    ? `${report.cityLabel}, ${report.countryLabel}`
    : report.countryLabel;

  cards.push({
    label: lang === "cs" ? genderForm(person.gender, "Narozen", "Narozena") : "Born",
    value: dateStr,
    detail: weekday ? `${weekday} · ${place}` : place,
  });

  cards.push({
    label: copy.daysLived,
    value: daysLived.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US"),
  });

  if (past > 0) {
    cards.push({
      label: copy.yearsPast,
      value: `+${past}`,
      unit: copy.bonusYears,
      detail: copy.bonusNote,
      accent: true,
    });
  } else {
    cards.push({
      label: copy.yearsLeft,
      value: String(yearsRemaining),
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

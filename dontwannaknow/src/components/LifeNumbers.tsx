import { useLang } from "../i18n/useLang";
import { useCountUp } from "../lib/useCountUp";
import { lifeNumbers } from "../lib/lifeNumbers";
import { settings } from "../config/settings";

/**
 * A single figure with the same tasteful count-up the hero stats use. Kept
 * local so each card owns exactly one useCountUp hook (a hook can't run in a
 * loop), mirroring HeroSummary's StatValue.
 */
function Figure({ value, locale }: { value: number; locale: string }) {
  const animated = useCountUp(value, settings.countUpDurationMs);
  const n = typeof animated === "number" ? animated : value;
  return <>{n.toLocaleString(locale)}</>;
}

/**
 * "Život v číslech" — a straight-faced broadsheet grid reporting the
 * lifetime totals (heartbeats, full moons overhead, laps around the Sun…)
 * computed from nothing but how long the person has been alive. The register
 * stays NewForm-monochrome on purpose: the deadpan framing is the charm.
 */
export default function LifeNumbers({ daysLived }: { daysLived: number }) {
  const { lang } = useLang();
  const locale = lang === "cs" ? "cs-CZ" : "en-US";
  const items = lifeNumbers(daysLived, lang);

  return (
    <div className="life-numbers" aria-label={lang === "cs" ? "Život v číslech" : "Life in numbers"}>
      {items.map((it) => (
        <div key={it.key} className={`hero-stat life-stat${it.accent ? " accent" : ""}`}>
          <span className="hero-stat-label">{it.label}</span>
          <span className="hero-stat-value">
            <Figure value={it.value} locale={locale} />
            {it.unit && <span className="unit"> {it.unit}</span>}
          </span>
          {it.detail && <span className="hero-stat-detail">{it.detail}</span>}
        </div>
      ))}
    </div>
  );
}

import { useCountUp } from "../lib/useCountUp";
import { lifeNumbers } from "../lib/lifeNumbers";
import { settings } from "../config/settings";

/**
 * A single figure with the shared count-up behavior. Kept local so each card
 * owns exactly one hook; hooks cannot run inside the item loop.
 */
function Figure({ value, locale }: { value: number; locale: string }) {
  const animated = useCountUp(value, settings.countUpDurationMs);
  const n = typeof animated === "number" ? animated : value;
  return <>{n.toLocaleString(locale)}</>;
}

/** A calm broadsheet summary of elapsed time, with no behavioural estimates. */
export default function LifeNumbers({ daysLived }: { daysLived: number }) {
  const items = lifeNumbers(daysLived);

  return (
    <div className="life-numbers" aria-label="Život v číslech">
      {items.map((it) => (
        <div key={it.key} className={`hero-stat life-stat${it.accent ? " accent" : ""}`}>
          <span className="hero-stat-label">{it.label}</span>
          <span className="hero-stat-value">
            <Figure value={it.value} locale="cs-CZ" />
            {it.unit && <span className="unit"> {it.unit}</span>}
          </span>
          {it.detail && <span className="hero-stat-detail">{it.detail}</span>}
        </div>
      ))}
    </div>
  );
}

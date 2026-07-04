// "Život v týdnech" — a 52-column grid where each square is one week of
// life, scaled to the average life expectancy for the person's sex and
// country. Someone who has already outlived that average gets the grid
// extended to a round century, with a warmer note. After Tim Urban.
// Rows are grouped into decade bands so the block reads as chapters of a
// life rather than one solid slab; the current week is marked in ink.

type Props = {
  weeksLived: number;
  ageNow: number;
  label: string;
  lifeExpectancyYears: number;
};

const COLS = 52; // one square per week of the year
const SIZE = 6;
const GAP = 2;
const DECADE_GAP = 7; // extra air after every 10 rows
const PADDING = 14;
const ROW_LABEL_GAP = 28;

export default function LifeGrid({
  weeksLived,
  ageNow,
  label,
  lifeExpectancyYears,
}: Props) {
  const overExpectancy = ageNow > lifeExpectancyYears;
  const rows = overExpectancy ? 100 : Math.max(1, Math.ceil(lifeExpectancyYears));
  const total = COLS * rows;
  const lived = Math.max(0, Math.min(weeksLived, total));
  const remaining = Math.max(0, total - lived);
  const rowY = (row: number) =>
    PADDING + row * (SIZE + GAP) + Math.floor(row / 10) * DECADE_GAP;
  const width = PADDING * 2 + ROW_LABEL_GAP + COLS * (SIZE + GAP) - GAP;
  const height = rowY(rows - 1) + SIZE + PADDING;

  const cells: { x: number; y: number; i: number; cls: string }[] = [];
  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const cls =
      i === lived - 1 && !overExpectancy
        ? "life-grid-now"
        : i < lived
          ? "life-grid-lived"
          : "life-grid-future";
    cells.push({
      x: PADDING + ROW_LABEL_GAP + col * (SIZE + GAP),
      y: rowY(row),
      i,
      cls,
    });
  }

  const rowLabels: { label: string; y: number }[] = [];
  for (let yr = 0; yr < rows; yr += 10) {
    rowLabels.push({
      label: String(yr),
      y: rowY(yr) + SIZE / 2 + 3,
    });
  }

  const formatCount = (n: number) => n.toLocaleString("cs-CZ");

  return (
    <figure className="life-grid">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Život v týdnech pro ${label}: prožito ${lived} týdnů z ${total}`}
      >
        {rowLabels.map((rl, idx) => (
          <text key={idx} x={PADDING} y={rl.y} className="life-grid-row-label">
            {rl.label}
          </text>
        ))}
        {cells.map((c) => (
          <rect
            key={c.i}
            x={c.x}
            y={c.y}
            width={SIZE}
            height={SIZE}
            rx={1.5}
            ry={1.5}
            className={`life-grid-cell ${c.cls}`}
          />
        ))}
      </svg>
      <figcaption>
        {overExpectancy ? (
          <>
            <strong>{label}</strong> — průměrný věk dožití už s úsměvem na tváři
            přeskočil a žije dál až do stovky.
          </>
        ) : (
          <>
            Každý čtvereček je jeden týden života. Při průměrném dožití kolem{" "}
            <strong>{lifeExpectancyYears}</strong> let má {label}{" "}
            <strong>{formatCount(lived)}</strong> týdnů za sebou a ještě zhruba{" "}
            {formatCount(remaining)} před sebou. Tmavý čtvereček je tenhle
            týden.
          </>
        )}
      </figcaption>
    </figure>
  );
}

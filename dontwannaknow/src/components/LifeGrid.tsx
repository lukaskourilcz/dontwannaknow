// "Život v týdnech" — a 52×100 grid where each square is one week of life.
// Weeks already lived are filled; the rest, up to a round century, are
// outlined. Inspired by Tim Urban's "Your Life in Weeks" essay.

type Props = {
  weeksLived: number;
  ageNow: number;
  label: string;
};

const COLS = 52; // one square per week of the year
const ROWS = 100; // years, up to a round century
const TOTAL = COLS * ROWS;
const SIZE = 6;
const GAP = 2;
const PADDING = 14;
const ROW_LABEL_GAP = 28;

export default function LifeGrid({ weeksLived, label }: Props) {
  const lived = Math.max(0, Math.min(weeksLived, TOTAL));
  const remaining = Math.max(0, TOTAL - lived);
  const width = PADDING * 2 + ROW_LABEL_GAP + COLS * (SIZE + GAP) - GAP;
  const height = PADDING * 2 + ROWS * (SIZE + GAP) - GAP;

  const cells: { x: number; y: number; i: number; lived: boolean }[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    cells.push({
      x: PADDING + ROW_LABEL_GAP + col * (SIZE + GAP),
      y: PADDING + row * (SIZE + GAP),
      i,
      lived: i < lived,
    });
  }

  // Decade labels down the left edge.
  const rowLabels: { label: string; y: number }[] = [];
  for (let yr = 0; yr <= ROWS; yr += 10) {
    rowLabels.push({
      label: String(yr),
      y: PADDING + yr * (SIZE + GAP) + SIZE / 2 + 3,
    });
  }

  const nf = (n: number) => n.toLocaleString("cs-CZ");

  return (
    <figure className="life-grid">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Život v týdnech pro ${label}: prožito ${lived} týdnů z ${TOTAL} do sta let`}
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
            className={`life-grid-cell life-grid-${c.lived ? "lived" : "future"}`}
          />
        ))}
      </svg>
      <figcaption>
        Každý čtvereček je jeden týden života. Z přibližně{" "}
        <strong>{nf(TOTAL)}</strong> týdnů do stovky má {label}{" "}
        <strong>{nf(lived)}</strong> za sebou a ještě zhruba {nf(remaining)} před
        sebou.
      </figcaption>
    </figure>
  );
}

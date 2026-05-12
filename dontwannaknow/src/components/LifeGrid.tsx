// A "life in years" visualization — a 10×N grid of squares where each
// square is one year of life. Years lived are filled in; years up to
// the country's life expectancy are outlined; beyond is empty.
// Inspired by Tim Urban's "Your Life in Weeks" essay.

type Props = {
  ageNow: number;
  lifeExpectancy: number;
  label: string;
};

const COLS = 10;
const SIZE = 14;
const GAP = 4;
const PADDING = 16;
const ROW_LABEL_GAP = 26;

export default function LifeGrid({ ageNow, lifeExpectancy, label }: Props) {
  // We show up to max(lifeExpectancy, ageNow) years, rounded up to next 10.
  const horizon = Math.max(lifeExpectancy, ageNow);
  const rows = Math.ceil(horizon / COLS);
  const width = PADDING * 2 + ROW_LABEL_GAP + COLS * (SIZE + GAP) - GAP;
  const height = PADDING * 2 + rows * (SIZE + GAP) - GAP;

  const cells: { x: number; y: number; year: number; state: "lived" | "future" | "beyond" }[] = [];
  for (let year = 0; year < rows * COLS; year++) {
    const row = Math.floor(year / COLS);
    const col = year % COLS;
    const x = PADDING + ROW_LABEL_GAP + col * (SIZE + GAP);
    const y = PADDING + row * (SIZE + GAP);
    let state: "lived" | "future" | "beyond";
    if (year < ageNow) state = "lived";
    else if (year < lifeExpectancy) state = "future";
    else state = "beyond";
    cells.push({ x, y, year, state });
  }

  // Decade labels down the left side.
  const rowLabels = Array.from({ length: rows }, (_, i) => ({
    label: `${i * COLS}`,
    y: PADDING + i * (SIZE + GAP) + SIZE / 2 + 4,
  }));

  const livedCount = Math.min(ageNow, horizon);
  const remaining = Math.max(0, lifeExpectancy - ageNow);

  return (
    <figure className="life-grid">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Life-in-years grid for ${label}: ${livedCount} years lived, about ${remaining} likely remaining`}
      >
        {rowLabels.map((rl, i) => (
          <text
            key={i}
            x={PADDING}
            y={rl.y}
            className="life-grid-row-label"
          >
            {rl.label}
          </text>
        ))}
        {cells.map((c) => (
          <rect
            key={c.year}
            x={c.x}
            y={c.y}
            width={SIZE}
            height={SIZE}
            rx={2.5}
            ry={2.5}
            className={`life-grid-cell life-grid-${c.state}`}
          >
            <title>Year {c.year + 1}</title>
          </rect>
        ))}
      </svg>
      <figcaption>
        Each square is one year. {label} has lived {livedCount}{" "}
        {livedCount === 1 ? "year" : "years"} — about{" "}
        <strong>
          {remaining} {remaining === 1 ? "year" : "years"}
        </strong>{" "}
        likely remaining if they reach the country's average life expectancy of {lifeExpectancy}.
      </figcaption>
    </figure>
  );
}

// "Život v týdnech" — a 52-column grid where each square is one week of
// life, shown against a fixed hundred-year scale. The scale is deliberately
// descriptive rather than predictive: it never estimates time remaining.
// Rows are grouped into decade bands so the block reads as chapters of a
// life rather than one solid slab; the current week is marked in ink.

type Props = {
  weeksLived: number;
  label: string;
};

const COLS = 52; // one square per week of the year
const SIZE = 6;
const GAP = 2;
const DECADE_GAP = 7; // extra air after every 10 rows
const PADDING = 14;
const ROW_LABEL_GAP = 28;

export default function LifeGrid({ weeksLived, label }: Props) {
  const rows = 100;
  const total = COLS * rows;
  const lived = Math.max(0, Math.min(weeksLived, total));
  const rowY = (row: number) =>
    PADDING + row * (SIZE + GAP) + Math.floor(row / 10) * DECADE_GAP;
  const width = PADDING * 2 + ROW_LABEL_GAP + COLS * (SIZE + GAP) - GAP;
  const height = rowY(rows - 1) + SIZE + PADDING;

  const pathForRange = (start: number, end: number) => {
    let path = "";
    for (let i = start; i < end; i++) {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const x = PADDING + ROW_LABEL_GAP + col * (SIZE + GAP);
      const y = rowY(row);
      path += `M${x} ${y}h${SIZE}v${SIZE}h-${SIZE}z`;
    }
    return path;
  };

  const currentIndex = lived > 0 ? lived - 1 : -1;
  const livedPath = pathForRange(0, Math.max(0, currentIndex));
  const futurePath = pathForRange(lived, total);
  const currentCell = currentIndex >= 0 ? (() => {
    const i = currentIndex;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    return {
      x: PADDING + ROW_LABEL_GAP + col * (SIZE + GAP),
      y: rowY(row),
    };
  })() : null;

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
        aria-label={`Čas v týdnech pro ${label}: od narození uplynulo přibližně ${lived} týdnů`}
      >
        {rowLabels.map((rl, idx) => (
          <text key={idx} x={PADDING} y={rl.y} className="life-grid-row-label">
            {rl.label}
          </text>
        ))}
        {livedPath && <path d={livedPath} className="life-grid-cell life-grid-lived" />}
        {futurePath && <path d={futurePath} className="life-grid-cell life-grid-future" />}
        {currentCell && (
          <rect
            x={currentCell.x}
            y={currentCell.y}
            width={SIZE}
            height={SIZE}
            rx={1.5}
            ry={1.5}
            className="life-grid-cell life-grid-now"
          />
        )}
      </svg>
      <figcaption>
        Každý čtvereček je jeden týden. Od narození {label} jich uplynulo přibližně{" "}
        <strong>{formatCount(lived)}</strong>. Mřížka sahá ke stovce pouze jako společné
        měřítko času; neříká nic o tom, kolik času zbývá.
      </figcaption>
    </figure>
  );
}

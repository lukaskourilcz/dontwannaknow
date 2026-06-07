import { useMemo } from "react";
import { COUNTRIES, WORLD_VIEWBOX } from "../data/worldPaths";
import { goneCountriesAlive, type GoneCountry } from "../data/countries";

type Props = {
  birthYear: number;
};

// A handful of colours to distinguish overlapping former states on the map.
const PALETTE = [
  "#b45a32",
  "#3f6d4e",
  "#7a4b8a",
  "#c98b1e",
  "#2f6b8f",
  "#a23a3a",
  "#5d6f1c",
  "#8b5a2b",
  "#4a4e8a",
  "#9b3f6a",
  "#3f8a6b",
  "#7a5a2b",
];

export default function WorldMap({ birthYear }: Props) {
  const gone = useMemo(() => goneCountriesAlive(birthYear), [birthYear]);

  // For each modern ISO code, assign the first matching gone country (others
  // are noted in the legend).
  const isoToGone = useMemo(() => {
    const map = new Map<string, GoneCountry>();
    gone.forEach((g) => {
      g.modernIso.forEach((iso) => {
        if (!map.has(iso)) map.set(iso, g);
      });
    });
    return map;
  }, [gone]);

  const colorFor = (g: GoneCountry) =>
    PALETTE[gone.indexOf(g) % PALETTE.length];

  const entries = Object.entries(COUNTRIES);

  return (
    <figure className="world-map">
      <svg
        viewBox={WORLD_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`World map showing countries that no longer exist as of ${birthYear}`}
      >
        <rect x="0" y="0" width="1000" height="500" fill="#eadfc7" />
        <g>
          {entries.map(([iso, c]) => {
            const g = isoToGone.get(iso);
            const fill = g ? colorFor(g) : "#cdbf9f";
            return (
              <path
                key={iso}
                d={c.d}
                fill={fill}
                stroke="#fbf6ec"
                strokeWidth={0.5}
                strokeLinejoin="round"
              >
                <title>
                  {c.name}
                  {g ? ` — was part of ${g.name}` : ""}
                </title>
              </path>
            );
          })}
        </g>
      </svg>
      {gone.length > 0 ? (
        <figcaption>
          <p className="map-caption">
            In {birthYear}, this is roughly how the world looked. The shaded
            regions were part of states that no longer exist today.
          </p>
          <ul className="legend">
            {gone.map((g) => (
              <li key={g.name}>
                <span
                  className="legend-swatch"
                  style={{ background: colorFor(g) }}
                  aria-hidden="true"
                />
                <span>
                  <strong>{g.name}</strong>
                  {g.becameText ? ` — později ${g.becameText}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </figcaption>
      ) : (
        <figcaption>
          <p className="map-caption">
            By {birthYear}, the world map looked much like it does today — no
            major former states were still on it.
          </p>
        </figcaption>
      )}
    </figure>
  );
}

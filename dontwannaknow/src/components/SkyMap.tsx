import { useMemo } from "react";
import {
  Body,
  Equator,
  Horizon,
  Observer,
  MoonPhase,
} from "astronomy-engine";
import { STARS, BIG_DIPPER_LINES, ORION_LINES, type Star } from "../data/stars";

type Props = {
  birthDate: Date; // any time; we'll evaluate at local ~23:00
  lat: number;
  lon: number;
  cityName: string;
  svgRef?: React.Ref<SVGSVGElement>;
};

const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;
const RADIUS = SVG_SIZE / 2 - 10;

// Stereographic projection from zenith. alt in degrees (0 = horizon, 90 = zenith).
// az in degrees measured clockwise from north.
function projectAltAz(alt: number, az: number): { x: number; y: number } | null {
  if (alt <= 0) return null;
  const zenithAngle = 90 - alt;
  // Stereographic radius. tan(z/2) already maps the horizon (z=90°) to
  // exactly RADIUS and the zenith (z=0°) to the centre — no extra scaling.
  const r = RADIUS * Math.tan((zenithAngle * Math.PI) / 360);
  const azRad = (az * Math.PI) / 180;
  // SVG y grows down; north should be up.
  return {
    x: CENTER + r * Math.sin(azRad),
    y: CENTER - r * Math.cos(azRad),
  };
}

// Pick a sensible viewing moment: local ~23:00 on the given date.
function localNightUTC(date: Date, lon: number): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  // Want local 23:00. local hour = UTC hour + lon/15.
  // → UTC hour at local 23:00 = 23 - lon/15
  const utcHour = 23 - lon / 15;
  return new Date(Date.UTC(y, m, d) + utcHour * 3600 * 1000);
}

function magToRadius(mag: number): number {
  // Brighter = bigger. Mag -1.5 → ~3.4 px, mag 3 → ~1 px.
  return Math.max(0.7, 3.4 - 0.6 * (mag + 1.5));
}

function altAzFor(
  body: Body,
  time: Date,
  observer: Observer,
): { alt: number; az: number } | null {
  try {
    const eq = Equator(body, time, observer, true, true);
    const h = Horizon(time, observer, eq.ra, eq.dec, "normal");
    return { alt: h.altitude, az: h.azimuth };
  } catch {
    return null;
  }
}

function altAzForStar(
  star: Star,
  time: Date,
  observer: Observer,
): { alt: number; az: number } | null {
  try {
    const h = Horizon(time, observer, star.ra, star.dec, "normal");
    return { alt: h.altitude, az: h.azimuth };
  } catch {
    return null;
  }
}

const PLANETS: { body: Body; name: string; color: string }[] = [
  { body: Body.Mercury, name: "Merkur",  color: "#b89878" },
  { body: Body.Venus,   name: "Venuše",  color: "#f0e3c2" },
  { body: Body.Mars,    name: "Mars",    color: "#c84032" },
  { body: Body.Jupiter, name: "Jupiter", color: "#d8b070" },
  { body: Body.Saturn,  name: "Saturn",  color: "#c9b682" },
];

function moonPhaseLabel(angle: number): string {
  // Phase angle 0 = new moon, 90 = first quarter, 180 = full, 270 = third quarter.
  if (angle < 22.5 || angle >= 337.5) return "nov";
  if (angle < 67.5) return "dorůstající srpek";
  if (angle < 112.5) return "první čtvrť";
  if (angle < 157.5) return "dorůstající měsíc";
  if (angle < 202.5) return "úplněk";
  if (angle < 247.5) return "couvající měsíc";
  if (angle < 292.5) return "poslední čtvrť";
  return "couvající srpek";
}

export default function SkyMap({ birthDate, lat, lon, cityName, svgRef }: Props) {
  const { stars, planets, sun, moon, moonPhaseText, viewTimeLocal } = useMemo(() => {
    const time = localNightUTC(birthDate, lon);
    const observer = new Observer(lat, lon, 0);

    const starsP = STARS.map((s) => ({ star: s, pos: altAzForStar(s, time, observer) }));
    const planetsP = PLANETS.map((p) => ({
      ...p,
      pos: altAzFor(p.body, time, observer),
    }));
    const sunP = altAzFor(Body.Sun, time, observer);
    const moonP = altAzFor(Body.Moon, time, observer);
    let phase = 0;
    try {
      phase = MoonPhase(time);
    } catch { /* ignore */ }

    return {
      stars: starsP,
      planets: planetsP,
      sun: sunP,
      moon: moonP,
      moonPhaseText: moonPhaseLabel(phase),
      viewTimeLocal: "23:00",
    };
  }, [birthDate, lat, lon]);

  const project = (p: { alt: number; az: number } | null) =>
    p ? projectAltAz(p.alt, p.az) : null;

  const starProjections = stars
    .map((s) => ({ ...s, xy: project(s.pos) }))
    .filter((s) => s.xy !== null) as { star: Star; xy: { x: number; y: number } }[];

  const findStarXY = (name: string) =>
    starProjections.find((s) => s.star.name === name)?.xy;

  const dipperLines = BIG_DIPPER_LINES.map(([a, b]) => {
    const pa = findStarXY(a);
    const pb = findStarXY(b);
    if (!pa || !pb) return null;
    return { a: pa, b: pb };
  }).filter(Boolean) as { a: { x: number; y: number }; b: { x: number; y: number } }[];

  const orionLines = ORION_LINES.map(([a, b]) => {
    const pa = findStarXY(a);
    const pb = findStarXY(b);
    if (!pa || !pb) return null;
    return { a: pa, b: pb };
  }).filter(Boolean) as { a: { x: number; y: number }; b: { x: number; y: number } }[];

  const dateStr = `${birthDate.getUTCDate()}. ${birthDate.getUTCMonth() + 1}. ${birthDate.getUTCFullYear()}`;

  return (
    <figure className="sky-map">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width={SVG_SIZE}
        height={SVG_SIZE}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Noční obloha nad ${cityName} dne ${dateStr} kolem ${viewTimeLocal} místního času`}
      >
        {/* Sky disc — twilight gradient */}
        <defs>
          <radialGradient id="sky-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d1a3a" />
            <stop offset="80%" stopColor="#1a2750" />
            <stop offset="100%" stopColor="#2a3870" />
          </radialGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#sky-grad)" stroke="#7a6f56" />

        {/* Cardinal labels — S/V/J/Z (sever, východ, jih, západ) */}
        <text x={CENTER} y={10} textAnchor="middle" className="card-label">S</text>
        <text x={SVG_SIZE - 4} y={CENTER + 4} textAnchor="end" className="card-label">V</text>
        <text x={CENTER} y={SVG_SIZE - 2} textAnchor="middle" className="card-label">J</text>
        <text x={4} y={CENTER + 4} textAnchor="start" className="card-label">Z</text>

        {/* Constellation lines */}
        {dipperLines.map((l, i) => (
          <line key={`d${i}`} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke="#5d6f9a" strokeWidth={0.6} opacity={0.5} />
        ))}
        {orionLines.map((l, i) => (
          <line key={`o${i}`} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke="#5d6f9a" strokeWidth={0.6} opacity={0.5} />
        ))}

        {/* Stars */}
        {starProjections.map((sp) => (
          <g key={sp.star.name}>
            <circle cx={sp.xy.x} cy={sp.xy.y} r={magToRadius(sp.star.mag)} fill="#f4f0d8" />
            {sp.star.mag <= 1.5 && (
              <text x={sp.xy.x + 5} y={sp.xy.y - 4} className="star-label">{sp.star.name}</text>
            )}
          </g>
        ))}

        {/* Planets */}
        {planets.map((p) => {
          const xy = project(p.pos);
          if (!xy) return null;
          return (
            <g key={p.name}>
              <circle cx={xy.x} cy={xy.y} r={3.5} fill={p.color} stroke="#fff" strokeWidth={0.5} />
              <text x={xy.x + 6} y={xy.y + 4} className="planet-label">{p.name}</text>
            </g>
          );
        })}

        {/* Moon */}
        {moon && project(moon) && (
          <g>
            <circle cx={project(moon)!.x} cy={project(moon)!.y} r={6} fill="#e8e4cc" stroke="#fff" strokeWidth={0.5} />
            <text x={project(moon)!.x + 8} y={project(moon)!.y + 4} className="planet-label">Měsíc</text>
          </g>
        )}

        {/* Sun (only if somehow above horizon; usually below at 23:00) */}
        {sun && sun.alt > 0 && project(sun) && (
          <g>
            <circle cx={project(sun)!.x} cy={project(sun)!.y} r={7} fill="#f4c042" />
            <text x={project(sun)!.x + 9} y={project(sun)!.y + 4} className="planet-label">Slunce</text>
          </g>
        )}
      </svg>
      <figcaption>
        Obloha nad <strong>{cityName}</strong> kolem 23:00 místního času dne{" "}
        <strong>{dateStr}</strong>. Měsíc: {moonPhaseText}.
        {sun && sun.alt < -18 && " Slunce bylo hluboko pod obzorem — astronomická noc."}
        {sun && sun.alt >= -18 && sun.alt < 0 && " Slunce bylo těsně pod obzorem — pozdní soumrak."}
      </figcaption>
    </figure>
  );
}

// "Life in numbers" — a batch of gloriously stupid lifetime totals derived from
// nothing but how long a person has been alive. Every figure is days-lived ×
// a rough daily average, so it stays deterministic, offline, and honestly
// approximate. The daily rates below are commonly cited human averages; treat
// them as order-of-magnitude, which is the whole joke.
//
// Kept language-aware but gender-neutral: these are one-line stat cards, not
// prose, so we sidestep the Czech masculine/feminine verb dance entirely.

import type { Lang } from "../i18n/translations";

export type LifeNumber = {
  key: string;
  label: string;   // localized card label (uppercase in the UI)
  value: number;   // the big animated figure
  unit?: string;   // localized short unit (litres, kg, years…) — omitted for pure counts
  detail?: string; // localized vivid comparison line
  accent?: boolean; // highlight (green top-border) — reserved for the crude ones
};

// Daily human averages (per day, unless noted).
const PER_DAY = {
  pees: 7,               // urinations
  urineLitres: 1.5,      // litres of urine
  poops: 1,              // bowel movements
  poopKg: 0.128,         // kg of stool (~128 g)
  farts: 15,             // flatulence events
  fartLitres: 0.7,       // litres of gas passed
  heartbeats: 100_000,   // ~70 bpm
  breaths: 20_000,       // ~14 breaths/min
  blinks: 19_200,        // ~16/min over ~16 waking hours
  stepsCount: 5_000,     // steps
  bloodLitres: 7_570,    // litres the heart pumps
  foodKg: 1.7,           // kg of food eaten
} as const;

// Reference magnitudes for the comparison lines.
const BATHTUB_L = 150;
const OLYMPIC_POOL_L = 2_500_000;
const ADULT_KG = 70;
const CAR_TONNES = 1.5;
const PARTY_BALLOON_L = 5;
const STEP_METRES = 0.762;
const EQUATOR_KM = 40_075;
const EARTH_ORBIT_KM_PER_DAY = 2_573_000; // Earth carries us ~107,226 km/h around the Sun
const DAYS_PER_YEAR = 365.25;

const round = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;

// Format an embedded number inside a detail sentence with locale grouping,
// so "256" reads "256" but "12345" reads "12 345" / "12,345".
function fmt(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US");
}

/**
 * Build the full list of life-in-numbers cards for a person who has been alive
 * `daysLived` days. Language switches both the labels and the comparison copy.
 */
export function lifeNumbers(daysLived: number, lang: Lang): LifeNumber[] {
  const d = Math.max(0, daysLived);
  const years = d / DAYS_PER_YEAR;
  const cs = lang === "cs";

  const bathtubs = round(d * PER_DAY.urineLitres / BATHTUB_L);
  const poopAdults = round(d * PER_DAY.poopKg / ADULT_KG);
  const balloons = round(d * PER_DAY.fartLitres / PARTY_BALLOON_L);
  const eyesShutDays = round(d * PER_DAY.blinks * 0.3 / 86_400); // ~0.3 s per blink
  const sleepYears = round1(d * (8 / 24) / DAYS_PER_YEAR);
  const stepKm = d * PER_DAY.stepsCount * STEP_METRES / 1000;
  const equatorLaps = round1(stepKm / EQUATOR_KM);
  const pools = round(d * PER_DAY.bloodLitres / OLYMPIC_POOL_L);
  const foodTonnes = round(d * PER_DAY.foodKg / 1000);
  const foodCars = round(d * PER_DAY.foodKg / (CAR_TONNES * 1000));
  const sunLaps = round(years);
  const sunBnKm = round(d * EARTH_ORBIT_KM_PER_DAY / 1_000_000_000);

  return [
    {
      key: "pee",
      label: cs ? "Na záchod čůrat" : "Trips to pee",
      value: round(d * PER_DAY.pees),
      detail: cs ? "Sedmkrát denně, den co den." : "Seven times a day, every single day.",
      accent: true,
    },
    {
      key: "urine",
      label: cs ? "Vyčůráno" : "Peed out",
      value: round(d * PER_DAY.urineLitres),
      unit: cs ? "litrů" : "litres",
      detail: cs
        ? `Naplnilo by to ${fmt(bathtubs, lang)} plných van.`
        : `Enough to fill ${fmt(bathtubs, lang)} full bathtubs.`,
    },
    {
      key: "poop",
      label: cs ? "Velká na záchod" : "Number twos",
      value: round(d * PER_DAY.poops),
      detail: cs ? "Jednou denně, bez výmluv." : "Once a day, no excuses.",
      accent: true,
    },
    {
      key: "poopweight",
      label: cs ? "Naděláno" : "Deposited",
      value: round(d * PER_DAY.poopKg),
      unit: "kg",
      detail: cs
        ? `Na váze jako ${fmt(poopAdults, lang)} dospělých lidí.`
        : `The weight of ${fmt(poopAdults, lang)} grown adults.`,
      accent: true,
    },
    {
      key: "farts",
      label: cs ? "Prdů" : "Farts",
      value: round(d * PER_DAY.farts),
      detail: cs
        ? `Dost plynu na ${fmt(balloons, lang)} nafouknutých balónků.`
        : `Enough gas for ${fmt(balloons, lang)} party balloons.`,
      accent: true,
    },
    {
      key: "heartbeats",
      label: cs ? "Úderů srdce" : "Heartbeats",
      value: round(d * PER_DAY.heartbeats),
      detail: cs ? "Sto tisíc úderů každý den." : "A hundred thousand a day.",
    },
    {
      key: "breaths",
      label: cs ? "Nádechů" : "Breaths",
      value: round(d * PER_DAY.breaths),
      detail: cs ? "Dvacet tisíc denně, bez přemýšlení." : "Twenty thousand a day, without a thought.",
    },
    {
      key: "blinks",
      label: cs ? "Mrknutí" : "Blinks",
      value: round(d * PER_DAY.blinks),
      detail: cs
        ? `Oči zavřené celkem asi ${fmt(eyesShutDays, lang)} dní.`
        : `Eyes shut for about ${fmt(eyesShutDays, lang)} days in total.`,
    },
    {
      key: "sleep",
      label: cs ? "Prospáno" : "Slept away",
      value: sleepYears,
      unit: cs ? "let" : "years",
      detail: cs ? "Skoro třetina života se zavřenýma očima." : "Almost a third of life, gone to sleep.",
    },
    {
      key: "steps",
      label: cs ? "Kroků" : "Steps",
      value: round(d * PER_DAY.stepsCount),
      detail: cs
        ? `Tolik co ${fmt(equatorLaps, lang)}× kolem rovníku.`
        : `That's ${fmt(equatorLaps, lang)} times around the equator.`,
    },
    {
      key: "blood",
      label: cs ? "Přečerpáno krve" : "Blood pumped",
      value: round(d * PER_DAY.bloodLitres),
      unit: cs ? "litrů" : "litres",
      detail: cs
        ? `Naplnilo by to ${fmt(pools, lang)} olympijských bazénů.`
        : `Enough to fill ${fmt(pools, lang)} Olympic pools.`,
    },
    {
      key: "food",
      label: cs ? "Snědeno" : "Food eaten",
      value: foodTonnes,
      unit: cs ? "tun" : "tonnes",
      detail: cs
        ? `Na váze jako ${fmt(foodCars, lang)} osobních aut.`
        : `The weight of ${fmt(foodCars, lang)} cars.`,
    },
    {
      key: "sun",
      label: cs ? "Kolem Slunce" : "Around the Sun",
      value: sunBnKm,
      unit: cs ? "mld. km" : "bn km",
      detail: cs
        ? `Na palubě Země ${fmt(sunLaps, lang)}× kolem Slunce.`
        : `${fmt(sunLaps, lang)} laps around the Sun aboard planet Earth.`,
    },
  ];
}

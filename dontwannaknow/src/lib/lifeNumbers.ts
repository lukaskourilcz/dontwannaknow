// A restrained long view of elapsed time. Every figure is derived from the
// same days-lived value; there are no guesses about health, habits or private
// experience.

export type LifeNumber = {
  key: string;
  label: string;
  value: number;
  unit?: string;
  detail: string;
  accent?: boolean;
};

const DAYS_PER_YEAR = 365.2425;
const DAYS_PER_SYNODIC_MONTH = 29.53059;
const HOURS_PER_DAY = 24;

export function lifeNumbers(daysLived: number): LifeNumber[] {
  const days = Math.max(0, Math.floor(daysLived));
  const wholeYears = Math.floor(days / DAYS_PER_YEAR);

  return [
    {
      key: "years",
      label: "Celých let",
      value: wholeYears,
      detail: "Tolik výročí narození už v kalendáři uplynulo.",
      accent: true,
    },
    {
      key: "seasons",
      label: "Ročních období",
      value: wholeYears * 4,
      detail: "Přibližný počet jar, lét, podzimů a zim dohromady.",
    },
    {
      key: "days",
      label: "Dní",
      value: days,
      detail: "Počítáno od zadaného dne narození; při neznámém datu od poloviny roku.",
      accent: true,
    },
    {
      key: "weeks",
      label: "Celých týdnů",
      value: Math.floor(days / 7),
      detail: "Sedmidenní rytmus, který propojil celé generace.",
    },
    {
      key: "hours",
      label: "Hodin",
      value: days * HOURS_PER_DAY,
      detail: "Čistý přepočet uběhlého času, bez odhadů osobních návyků.",
    },
    {
      key: "fullmoons",
      label: "Měsíčních cyklů",
      value: Math.floor(days / DAYS_PER_SYNODIC_MONTH),
      detail: "Úplněk se vrací přibližně jednou za 29 a půl dne.",
    },
    {
      key: "sun",
      label: "Okruhů kolem Slunce",
      value: wholeYears,
      detail: "Tolik celých oběhů absolvovala Země od roku narození.",
    },
    {
      key: "decades",
      label: "Celých desetiletí",
      value: Math.floor(wholeYears / 10),
      detail: "Dlouhé kapitoly, během kterých se měnila technika, kultura i hranice.",
    },
  ];
}

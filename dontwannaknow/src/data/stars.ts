// The 25 brightest stars + the seven stars of the Big Dipper, with
// approximate J2000 equatorial coordinates and apparent magnitudes.
// RA in hours (0–24), Dec in degrees (-90 to +90), mag is V magnitude.

export type Star = {
  name: string;
  bayer?: string; // e.g. "α CMa"
  ra: number;
  dec: number;
  mag: number;
};

export const STARS: Star[] = [
  { name: "Sirius",      bayer: "α CMa", ra:  6.7525, dec: -16.7161, mag: -1.46 },
  { name: "Canopus",     bayer: "α Car", ra:  6.3992, dec: -52.6957, mag: -0.74 },
  { name: "Arcturus",    bayer: "α Boö", ra: 14.2610, dec:  19.1825, mag: -0.05 },
  { name: "Vega",        bayer: "α Lyr", ra: 18.6157, dec:  38.7837, mag:  0.03 },
  { name: "Capella",     bayer: "α Aur", ra:  5.2782, dec:  45.9981, mag:  0.08 },
  { name: "Rigel",       bayer: "β Ori", ra:  5.2422, dec:  -8.2017, mag:  0.13 },
  { name: "Procyon",     bayer: "α CMi", ra:  7.6551, dec:   5.2250, mag:  0.34 },
  { name: "Achernar",    bayer: "α Eri", ra:  1.6286, dec: -57.2367, mag:  0.46 },
  { name: "Betelgeuse",  bayer: "α Ori", ra:  5.9195, dec:   7.4071, mag:  0.45 },
  { name: "Hadar",       bayer: "β Cen", ra: 14.0637, dec: -60.3729, mag:  0.61 },
  { name: "Altair",      bayer: "α Aql", ra: 19.8464, dec:   8.8683, mag:  0.77 },
  { name: "Aldebaran",   bayer: "α Tau", ra:  4.5987, dec:  16.5093, mag:  0.85 },
  { name: "Antares",     bayer: "α Sco", ra: 16.4901, dec: -26.4319, mag:  1.09 },
  { name: "Spica",       bayer: "α Vir", ra: 13.4199, dec: -11.1614, mag:  1.04 },
  { name: "Pollux",      bayer: "β Gem", ra:  7.7553, dec:  28.0262, mag:  1.14 },
  { name: "Fomalhaut",   bayer: "α PsA", ra: 22.9608, dec: -29.6222, mag:  1.16 },
  { name: "Deneb",       bayer: "α Cyg", ra: 20.6905, dec:  45.2803, mag:  1.25 },
  { name: "Mimosa",      bayer: "β Cru", ra: 12.7953, dec: -59.6889, mag:  1.25 },
  { name: "Regulus",     bayer: "α Leo", ra: 10.1395, dec:  11.9672, mag:  1.35 },
  { name: "Adhara",      bayer: "ε CMa", ra:  6.9770, dec: -28.9722, mag:  1.50 },
  { name: "Castor",      bayer: "α Gem", ra:  7.5766, dec:  31.8884, mag:  1.58 },
  { name: "Bellatrix",   bayer: "γ Ori", ra:  5.4188, dec:   6.3497, mag:  1.64 },
  { name: "Polaris",     bayer: "α UMi", ra:  2.5303, dec:  89.2641, mag:  1.97 },
  { name: "Alphard",     bayer: "α Hya", ra:  9.4598, dec:  -8.6586, mag:  1.99 },

  // Big Dipper (Ursa Major)
  { name: "Dubhe",       bayer: "α UMa", ra: 11.0621, dec:  61.7510, mag:  1.79 },
  { name: "Merak",       bayer: "β UMa", ra: 11.0307, dec:  56.3824, mag:  2.37 },
  { name: "Phecda",      bayer: "γ UMa", ra: 11.8972, dec:  53.6948, mag:  2.44 },
  { name: "Megrez",      bayer: "δ UMa", ra: 12.2571, dec:  57.0326, mag:  3.32 },
  { name: "Alioth",      bayer: "ε UMa", ra: 12.9004, dec:  55.9598, mag:  1.77 },
  { name: "Mizar",       bayer: "ζ UMa", ra: 13.3988, dec:  54.9254, mag:  2.27 },
  { name: "Alkaid",      bayer: "η UMa", ra: 13.7923, dec:  49.3133, mag:  1.86 },
];

// The Big Dipper line — pairs of star names to draw a line between.
export const BIG_DIPPER_LINES: [string, string][] = [
  ["Dubhe", "Merak"],
  ["Merak", "Phecda"],
  ["Phecda", "Megrez"],
  ["Megrez", "Dubhe"],
  ["Megrez", "Alioth"],
  ["Alioth", "Mizar"],
  ["Mizar", "Alkaid"],
];

// Orion's belt + sword
export const ORION_LINES: [string, string][] = [
  ["Betelgeuse", "Bellatrix"],
  ["Bellatrix", "Rigel"],
  ["Betelgeuse", "Rigel"],
];

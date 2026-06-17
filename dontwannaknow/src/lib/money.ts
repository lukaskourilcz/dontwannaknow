// Prices in the reader's currency. The underlying historical figures are in
// USD; we convert to Czech crowns by default (the app is Czech-first) and to
// Ukrainian hryvnia for Ukrainian subjects. The conversion rates are
// configurable from /dev/settings.
import type { Country } from "../data/countryDecades";
import { settings } from "../config/settings";

function fmtCzk(czk: number): string {
  if (czk < 10) return `${czk.toFixed(1).replace(".", ",")} Kč`;
  return `${Math.round(czk).toLocaleString("cs-CZ")} Kč`;
}

function fmtUah(uah: number): string {
  if (uah < 10) return `${uah.toFixed(1).replace(".", ",")} ₴`;
  return `${Math.round(uah).toLocaleString("cs-CZ")} ₴`;
}

/** Format a USD figure in the currency that fits the subject's country. */
export function fmtMoney(usd: number, country: Country): string {
  if (country === "UA") return fmtUah(usd * settings.usdToUah);
  return fmtCzk(usd * settings.usdToCzk);
}

const LITRES_PER_US_GALLON = 3.785;

/**
 * Historical fuel prices are stored per US gallon, but the prose quotes a
 * price per litre. Convert and format in one step.
 */
export function fmtGasPerLitre(usdPerGallon: number, country: Country): string {
  return fmtMoney(usdPerGallon / LITRES_PER_US_GALLON, country);
}

// Real, local-currency economic snapshots per country and decade — the price of
// a loaf of bread, a litre of petrol, and the average GROSS MONTHLY wage.
//
// Why this exists: the rest of the app stores prices in USD and converts them to
// the reader's currency at a *modern* exchange rate (see lib/money.ts). That is
// fine for rough global figures, but it produces nonsense for historical local
// reality — e.g. a 1990s US wage of $24,000 shown as "552,000 Kč", or US bread
// prices shown in crowns. For the hero "what it cost" line we want figures that
// actually match the country and era, so those are stored here directly.
//
// Czech/Czechoslovak figures are anchored to ČSÚ wage series and retail-price
// tables (avg monthly wage 1,073 Kčs in 1960, 2,600 in 1980, 3,300 in 1990,
// 5,226 Kč in 1993; rye-wheat bread ~2.60 Kčs through the socialist era; petrol
// 3.60 Kčs in 1981 → 7 Kčs in 1989 → ~16 Kč in 1993). Other countries fall back
// to the US/global figures shown in USD rather than a misleading conversion.
// All numbers are rounded, decade-representative approximations.

import type { Country } from "./countryDecades";
import { DECADES } from "./stats";

export type Currency = "CZK" | "USD";

export type Economy = {
  currency: Currency;
  breadLoaf: number; // a ~1 kg loaf
  petrolLitre: number; // one litre of petrol
  monthlyWage: number; // average gross monthly wage
};

// Czechoslovakia → Czech Republic, in crowns (Kčs/Kč). Decade-representative.
const CZ_BY_DECADE: Record<number, Economy> = {
  1920: { currency: "CZK", breadLoaf: 2.6, petrolLitre: 3.5, monthlyWage: 700 },
  1930: { currency: "CZK", breadLoaf: 2.4, petrolLitre: 3.5, monthlyWage: 750 },
  1940: { currency: "CZK", breadLoaf: 3.0, petrolLitre: 5.0, monthlyWage: 1100 },
  1950: { currency: "CZK", breadLoaf: 2.6, petrolLitre: 3.0, monthlyWage: 1100 },
  1960: { currency: "CZK", breadLoaf: 2.6, petrolLitre: 3.0, monthlyWage: 1300 },
  1970: { currency: "CZK", breadLoaf: 2.6, petrolLitre: 4.0, monthlyWage: 2100 },
  1980: { currency: "CZK", breadLoaf: 2.6, petrolLitre: 6.0, monthlyWage: 2900 },
  1990: { currency: "CZK", breadLoaf: 10, petrolLitre: 17, monthlyWage: 6000 },
  2000: { currency: "CZK", breadLoaf: 16, petrolLitre: 27, monthlyWage: 16000 },
  2010: { currency: "CZK", breadLoaf: 22, petrolLitre: 34, monthlyWage: 25000 },
  2020: { currency: "CZK", breadLoaf: 34, petrolLitre: 38, monthlyWage: 38000 },
};

const LITRES_PER_US_GALLON = 3.785;

// US / global figures straight from the decade table, in USD, wage made monthly.
function usEconomyForDecade(decadeStart: number): Economy {
  const d =
    DECADES.find((x) => x.decadeStart === decadeStart) ??
    DECADES[DECADES.length - 1];
  return {
    currency: "USD",
    breadLoaf: d.loafOfBreadUsd,
    petrolLitre: d.gallonOfGasUsd / LITRES_PER_US_GALLON,
    monthlyWage: Math.round(d.usAverageAnnualWageUsd / 12),
  };
}

function clampDecade(year: number): number {
  const start = Math.floor(year / 10) * 10;
  return Math.min(2020, Math.max(1920, start));
}

/** Local-currency economy snapshot for the subject's country and year. */
export function economyFor(country: Country, year: number): Economy {
  const decadeStart = clampDecade(year);
  if (country === "CZ") return CZ_BY_DECADE[decadeStart];
  // No verified local series for the other countries — show the honest
  // US/global figures in USD rather than a misleading modern-rate conversion.
  return usEconomyForDecade(decadeStart);
}

/** Format a local-currency amount; sub-10 values keep one/two decimals. */
export function fmtPrice(amount: number, currency: Currency): string {
  if (currency === "CZK") {
    if (amount < 10) return `${amount.toFixed(1).replace(".", ",")} Kč`;
    return `${Math.round(amount).toLocaleString("cs-CZ")} Kč`;
  }
  if (amount < 10) return `$${amount.toFixed(2)}`;
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

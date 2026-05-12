// Per-decade snapshot of the world. Numbers are rounded and approximate;
// sources include World Bank, US BLS, US Census, and historical CPI tables.

export type DecadeStats = {
  decadeStart: number; // e.g. 1950 means the 1950s
  worldPopulationBillions: number;
  usAverageAnnualWageUsd: number;
  loafOfBreadUsd: number;
  gallonOfGasUsd: number;
  postageStampCents: number;
  medianUsHouseUsd: number;
  worldBirthsPerYearMillions: number;
  globalLifeExpectancy: number;
};

export const DECADES: DecadeStats[] = [
  { decadeStart: 1920, worldPopulationBillions: 1.9, usAverageAnnualWageUsd: 1300, loafOfBreadUsd: 0.09, gallonOfGasUsd: 0.25, postageStampCents: 2, medianUsHouseUsd: 6300, worldBirthsPerYearMillions: 60, globalLifeExpectancy: 50 },
  { decadeStart: 1930, worldPopulationBillions: 2.1, usAverageAnnualWageUsd: 1370, loafOfBreadUsd: 0.08, gallonOfGasUsd: 0.18, postageStampCents: 3, medianUsHouseUsd: 5800, worldBirthsPerYearMillions: 70, globalLifeExpectancy: 56 },
  { decadeStart: 1940, worldPopulationBillions: 2.3, usAverageAnnualWageUsd: 1900, loafOfBreadUsd: 0.09, gallonOfGasUsd: 0.18, postageStampCents: 3, medianUsHouseUsd: 7400, worldBirthsPerYearMillions: 80, globalLifeExpectancy: 60 },
  { decadeStart: 1950, worldPopulationBillions: 2.5, usAverageAnnualWageUsd: 3300, loafOfBreadUsd: 0.14, gallonOfGasUsd: 0.27, postageStampCents: 3, medianUsHouseUsd: 7400, worldBirthsPerYearMillions: 100, globalLifeExpectancy: 65 },
  { decadeStart: 1960, worldPopulationBillions: 3.0, usAverageAnnualWageUsd: 5600, loafOfBreadUsd: 0.22, gallonOfGasUsd: 0.31, postageStampCents: 4, medianUsHouseUsd: 11900, worldBirthsPerYearMillions: 120, globalLifeExpectancy: 70 },
  { decadeStart: 1970, worldPopulationBillions: 3.7, usAverageAnnualWageUsd: 9400, loafOfBreadUsd: 0.24, gallonOfGasUsd: 0.36, postageStampCents: 6, medianUsHouseUsd: 23400, worldBirthsPerYearMillions: 125, globalLifeExpectancy: 71 },
  { decadeStart: 1980, worldPopulationBillions: 4.4, usAverageAnnualWageUsd: 16000, loafOfBreadUsd: 0.5, gallonOfGasUsd: 1.19, postageStampCents: 15, medianUsHouseUsd: 47200, worldBirthsPerYearMillions: 130, globalLifeExpectancy: 73 },
  { decadeStart: 1990, worldPopulationBillions: 5.3, usAverageAnnualWageUsd: 24000, loafOfBreadUsd: 0.7, gallonOfGasUsd: 1.15, postageStampCents: 25, medianUsHouseUsd: 79100, worldBirthsPerYearMillions: 135, globalLifeExpectancy: 75 },
  { decadeStart: 2000, worldPopulationBillions: 6.1, usAverageAnnualWageUsd: 32000, loafOfBreadUsd: 1.99, gallonOfGasUsd: 1.51, postageStampCents: 33, medianUsHouseUsd: 119600, worldBirthsPerYearMillions: 135, globalLifeExpectancy: 77 },
  { decadeStart: 2010, worldPopulationBillions: 6.9, usAverageAnnualWageUsd: 42000, loafOfBreadUsd: 2.79, gallonOfGasUsd: 2.79, postageStampCents: 44, medianUsHouseUsd: 221800, worldBirthsPerYearMillions: 140, globalLifeExpectancy: 78 },
  { decadeStart: 2020, worldPopulationBillions: 7.8, usAverageAnnualWageUsd: 54000, loafOfBreadUsd: 3.79, gallonOfGasUsd: 3.3, postageStampCents: 55, medianUsHouseUsd: 329000, worldBirthsPerYearMillions: 134, globalLifeExpectancy: 73 },
];

export function statsForYear(year: number): DecadeStats {
  const decadeStart = Math.floor(year / 10) * 10;
  return (
    DECADES.find((d) => d.decadeStart === decadeStart) ??
    DECADES[Math.max(0, Math.min(DECADES.length - 1, Math.floor((decadeStart - 1920) / 10)))]
  );
}

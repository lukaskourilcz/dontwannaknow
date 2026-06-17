// Month-anchored historical events since January 1938. Designed to
// surface "the month you were born" facts when a user enters a full date
// or month+year. Sourced from standard 20th- and 21st-century reference
// timelines. Each entry is one concise sentence in English.

import monthlyEventsJson from "./monthlyEvents.json";

export type MonthlyEvent = {
  year: number;
  month: number; // 1-12
  text: string;
};

export const MONTHLY_EVENTS: MonthlyEvent[] = monthlyEventsJson as MonthlyEvent[];

// ── Selectors ────────────────────────────────────────────────────

export function eventsInMonth(year: number, month: number): MonthlyEvent[] {
  return MONTHLY_EVENTS.filter((e) => e.year === year && e.month === month);
}

export function eventsInMonthLifetime(
  birthYear: number,
  birthMonth: number,
  currentYear: number,
): MonthlyEvent[] {
  // Pick events that occurred in the same calendar month as their birth.
  return MONTHLY_EVENTS.filter(
    (e) => e.month === birthMonth && e.year >= birthYear && e.year <= currentYear,
  );
}

export function eventsAroundMonth(
  year: number,
  month: number,
  monthSpan = 2,
): MonthlyEvent[] {
  // Events within ±monthSpan months of the given (year, month).
  return MONTHLY_EVENTS.filter((e) => {
    const dm = (e.year - year) * 12 + (e.month - month);
    return Math.abs(dm) <= monthSpan;
  });
}

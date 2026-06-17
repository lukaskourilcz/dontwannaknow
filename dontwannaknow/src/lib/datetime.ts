// Date/time helpers shared across the app. Keeping the millisecond maths and
// the "unknown birthday" fallback in one place avoids subtly different copies.

/** The current calendar year, resolved once at module load. */
export const CURRENT_YEAR = new Date().getFullYear();

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;

/**
 * Build a person's birth date in UTC. When the month or day is unknown we
 * default to 1 July — roughly the midpoint of the year — so derived day and
 * week counts land in a sensible middle rather than skewing to 1 January.
 */
export function birthDateUTC(
  birthYear: number,
  birthMonth?: number,
  birthDay?: number,
): Date {
  return new Date(Date.UTC(birthYear, (birthMonth ?? 7) - 1, birthDay ?? 1));
}

/** Whole days elapsed from `date` until now (never negative). */
export function daysSince(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / MS_PER_DAY));
}

/** Whole weeks elapsed from `date` until now (never negative). */
export function weeksSince(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / MS_PER_WEEK));
}

// String helpers shared across report data builders.

/** Upper-case the first character of `s`, leaving the rest untouched. */
export function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

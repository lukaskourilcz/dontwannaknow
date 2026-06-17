// String helpers shared across the fact, essay, and newspaper builders.

/** Upper-case the first character of `s`, leaving the rest untouched. */
export function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

/**
 * Join a list into a Czech-style sentence fragment:
 * `[]` → "", `[a]` → "a", `[a, b]` → "a a b", `[a, b, c]` → "a, b a c".
 */
export function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} a ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} a ${items[items.length - 1]}`;
}

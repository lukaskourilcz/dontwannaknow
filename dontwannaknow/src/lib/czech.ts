// Czech-language formatting helpers. Kept together so the grammar rules
// (plurals, case-specific phrases) live in one place rather than being
// re-derived inline wherever prose is generated.

/** Czech count-noun for years: 1 → "rok", 2–4 → "roky", otherwise → "let". */
export function czYears(n: number): string {
  if (n === 1) return "rok";
  if (n >= 2 && n <= 4) return "roky";
  return "let";
}

/**
 * Describe, in Czech, when an event happened relative to a person's birth,
 * given how old they were that year:
 *   age 0   → "v roce narození"       (in the year they were born)
 *   age < 0 → "5 let před narozením"  (5 years before they were born)
 *   age > 0 → "ve věku 30 let"        (at the age of 30)
 */
export function czAgePhrase(age: number): string {
  if (age === 0) return "v roce narození";
  if (age < 0) return `${-age} ${czYears(-age)} před narozením`;
  if (age === 1) return "ve věku jednoho roku";
  return `ve věku ${age} let`;
}

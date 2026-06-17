// Small random-selection helpers shared by the report and essay builders.
// Centralised here so every generator shuffles and samples the same way.

/** Return a new array with the elements of `arr` in random order (Fisher–Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Return up to `n` elements picked at random from `arr` (no repeats). */
export function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Return one random element from `arr`, or `undefined` if it is empty. */
export function pickOne<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

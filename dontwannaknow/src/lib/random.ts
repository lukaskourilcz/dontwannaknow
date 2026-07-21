// Random-selection helpers shared by the report data composers.
// Centralised here so every selector shuffles and samples the same way.

/** Return a new array with the elements of `arr` in random order (Fisher–Yates). */
export type RandomSource = () => number;

export function stableHash(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: string | number): RandomSource {
  let state = typeof seed === "number" ? seed >>> 0 : stableHash(seed);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

let activeRandom: RandomSource = Math.random;

export function withSeededRandom<T>(seed: string | number, task: () => T): T {
  const previous = activeRandom;
  activeRandom = createSeededRandom(seed);
  try {
    return task();
  } finally {
    activeRandom = previous;
  }
}

export function shuffle<T>(arr: T[], random: RandomSource = activeRandom): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Return up to `n` elements picked at random from `arr` (no repeats). */
export function pickN<T>(arr: T[], n: number, random: RandomSource = activeRandom): T[] {
  return shuffle(arr, random).slice(0, n);
}

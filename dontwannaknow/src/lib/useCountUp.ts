import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates a number from 0 (or `from`) to `target` over `duration` ms
 * using an ease-out cubic curve. Honours prefers-reduced-motion by
 * skipping the animation. Re-runs when `target` changes.
 *
 * For non-numeric strings, the original string is returned untouched.
 */
export function useCountUp(
  target: number | string,
  duration = 900,
  from = 0,
): number | string {
  const targetNum = typeof target === "number" ? target : Number(target);
  const isNumeric = typeof target === "number" || (!Number.isNaN(targetNum) && /^\d/.test(String(target)));
  const [value, setValue] = useState<number>(
    REDUCED_MOTION || !isNumeric ? targetNum : from,
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNumeric) return;
    if (REDUCED_MOTION) {
      setValue(targetNum);
      return;
    }
    const start = performance.now();
    const startValue = from;
    const delta = targetNum - from;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(startValue + delta * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(targetNum);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetNum, duration, from, isNumeric]);

  if (!isNumeric) return target;
  // Round to int while animating to avoid jitter.
  return Math.round(value);
}

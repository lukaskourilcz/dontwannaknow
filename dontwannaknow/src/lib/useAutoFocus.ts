import { useEffect, useRef } from "react";

/**
 * Focus an element whenever `dep` changes, selecting its contents too if it is
 * a text input. Returns the ref to attach to the element. The wizard uses this
 * to move focus to the active field each time the step advances.
 */
export function useAutoFocus<T extends HTMLElement>(dep: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (el instanceof HTMLInputElement) el.select();
  }, [dep]);
  return ref;
}

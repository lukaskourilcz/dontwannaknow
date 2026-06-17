import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Track a transient "copied!" confirmation for copy-to-clipboard buttons.
 *
 * - `copy(text)` writes to the clipboard and, on success, flips `copied` to
 *   true for `resetMs` milliseconds. It returns false if the Clipboard API is
 *   unavailable or blocked, so the caller can fall back.
 * - `flash()` shows the same confirmation without touching the clipboard.
 */
export function useCopied(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback(() => {
    setCopied(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), resetMs);
  }, [resetMs]);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        flash();
        return true;
      } catch {
        return false;
      }
    },
    [flash],
  );

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  return { copied, copy, flash };
}

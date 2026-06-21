import { useState } from "react";

// NOTE: this is a convenience gate, not real security. The password ships in
// the client bundle, so anyone determined can read it — it only keeps the
// editor out of casual sight. Don't expose anything truly sensitive behind it.
export const DEV_PASSWORD = "autobus";

const STORAGE_KEY = "dwk.dev.auth";

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Password gate state for the /dev section, remembered for the browser tab. */
export function useDevAuth() {
  const [unlocked, setUnlocked] = useState(isUnlocked);

  const tryUnlock = (password: string): boolean => {
    if (password !== DEV_PASSWORD) return false;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* sessionStorage unavailable — stay unlocked in-memory only */
    }
    setUnlocked(true);
    return true;
  };

  const signOut = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUnlocked(false);
  };

  return { unlocked, tryUnlock, signOut };
}

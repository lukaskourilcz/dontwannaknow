import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { t, type Lang } from "./translations";
import { settings } from "../config/settings";

export type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "dwk.lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return settings.defaultLang;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "cs" || stored === "en") return stored;
  return settings.defaultLang;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang());

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => t(lang, key, vars),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

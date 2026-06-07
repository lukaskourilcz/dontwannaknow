import { useContext } from "react";
import { LangContext, type LangContextValue } from "./LangContext";

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LangProvider");
  return ctx;
}

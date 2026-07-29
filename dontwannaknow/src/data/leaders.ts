// Političtí lídři a hlavy státu (CZ + UA, 1918–současnost).
//
// Každý záznam nese úřad, období, cestu k moci, doložené dobové vnímání
// (datované, se zdrojem), pozdější přehodnocení, výsledky a kontroverze.
// Vnímání je vždy citace doby, nikdy plochý verdikt. Data jsou commitnutý
// JSON s per-record citacemi; běhové prostředí je jen čte.

import { CURRENT_YEAR } from "../lib/datetime";
import type { RecordExtras } from "./_grouped";

export type LeaderSourceRef = {
  title: string;
  publisher?: string;
  url?: string;
  accessed?: string;
  licence?: string;
};

/** Datovaná, zdrojovaná poznámka o vnímání či přehodnocení. */
export type LeaderNote = {
  period: string;
  text: string;
  source?: LeaderSourceRef;
};

export type Leader = {
  id: string;
  country: "CZ" | "UA";
  name: string;
  office: string;
  termStart: number;
  /** Chybí-li, úřad trvá. */
  termEnd?: number;
  cameToPower?: string;
  summary?: string;
  achievements: string[];
  controversies: string[];
  reception: LeaderNote[];
  reassessment: LeaderNote[];
  /** Historiografie se skutečně rozchází — UI to říká výslovně. */
  contested?: boolean;
  sensitivity: "none" | "mild" | "difficult";
  shareSafe: boolean;
  sources: LeaderSourceRef[];
} & RecordExtras;

/** Lídři, jejichž úřad se protíná s daným obdobím, seřazení podle nástupu.
 * Načítá se líně — profily patří jen do vygenerované zprávy. */
export async function leadersOverlapping(
  country: "CZ" | "UA",
  fromYear: number,
  toYear: number,
): Promise<Leader[]> {
  const module = country === "CZ"
    ? await import("./public/leaders.cz.json")
    : await import("./public/leaders.ua.json");
  return (module.default as Leader[])
    .filter(
      (leader) =>
        leader.country === country &&
        leader.termStart <= toYear &&
        (leader.termEnd ?? CURRENT_YEAR) >= fromYear,
    )
    .sort((a, b) => a.termStart - b.termStart);
}

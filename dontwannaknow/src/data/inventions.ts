// Things and the year they became part of everyday life.
// Used to surface "born before X existed" facts.
//
// Čte se z generované veřejné vrstvy, aby záznamy nesly skóre relevance a
// citace. Bez dobového `detail` se záznam do zprávy nikdy nedostane —
// samotný název produktu není dobová vzpomínka (viz INVENTION_MIN_DISCOVERY).

import inventionsJson from "./public/inventions.json";
import type { RecordExtras } from "./_grouped";

export type Invention = {
  year: number;
  name: string;
  /** Dobová věta o tom, co se tím v běžném životě změnilo. Povinná pro sazbu. */
  detail?: string;
} & RecordExtras;

export const INVENTIONS: Invention[] = inventionsJson as Invention[];

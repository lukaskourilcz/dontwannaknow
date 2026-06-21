import educationJson from "./education.json";

// Škola, práce a studium podle země a desetiletí.
// Čísla jsou doložené historické odhady ze standardních referenčních
// zdrojů (statistické ročenky UNESCO, historické řady OECD,
// archivy národních ministerstev, tabulky dosaženého vzdělání US Census,
// sovětský Goskomstat, historické řady španělského INE o vzdělávání,
// československé statistické ročenky, StatCan, INEGI Mexiko).
// Berte je spíše jako řádové odhady než jako přesná čísla.

import type { Country } from "./countryDecades";

export type EducationSnapshot = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  compulsoryEnd: number;            // Věk, kdy končila povinná školní docházka
  avgYearsSchooling: number;        // Průměrný počet dokončených let vzdělání u dospělých
  highSchoolGradPct: number;        // Podíl ročníku, který dokončil vyšší střední vzdělání
  universityPct: number;            // Podíl dospělých s vysokoškolským titulem
  literacyPct: number;              // Míra gramotnosti dospělých
  commonJobs: string[];             // 3-5 nejčastějších povolání
  subjects: string[];               // Typické školní předměty
  classroom: string;                // Jednovětá atmosféra školního života
  workNote?: string;                // Jednovětá atmosféra pracovního života
};

export const EDUCATION: EducationSnapshot[] = educationJson as unknown as EducationSnapshot[];

export function educationFor(
  country: Country,
  year: number,
): EducationSnapshot | null {
  if (country === "INTL") return null;
  const decade = Math.floor(year / 10) * 10;
  return EDUCATION.find((e) => e.country === country && e.decadeStart === decade) ?? null;
}

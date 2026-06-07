// Countries that existed during certain windows but no longer do (or were renamed).
// Used to surface "when X was born, country Y still existed" facts and to
// highlight the modern territories that made them up on a world map.

export type GoneCountry = {
  name: string;
  startedYear: number;
  endedYear: number;
  becameText?: string; // e.g. "split into the Czech Republic and Slovakia"
  // ISO_A3 codes of modern countries that made up this former state.
  modernIso: string[];
};

export const GONE_COUNTRIES: GoneCountry[] = [
  {
    name: "Osmanská říše",
    startedYear: 1299,
    endedYear: 1922,
    becameText: "se rozpadla na Turecko a moderní Blízký východ",
    modernIso: ["TUR", "SYR", "IRQ", "LBN", "ISR", "PSE", "JOR", "SAU", "YEM", "EGY", "LBY", "GRC", "BGR", "ALB", "MKD"],
  },
  {
    name: "Britská Indie",
    startedYear: 1858,
    endedYear: 1947,
    becameText: "se rozdělila na Indii a Pákistán",
    modernIso: ["IND", "PAK", "BGD", "MMR"],
  },
  {
    name: "Československo",
    startedYear: 1918,
    endedYear: 1992,
    becameText: "se rozdělilo na Českou republiku a Slovensko",
    modernIso: ["CZE", "SVK"],
  },
  {
    name: "Sovětský svaz",
    startedYear: 1922,
    endedYear: 1991,
    becameText: "se rozpadl na 15 samostatných států",
    modernIso: ["RUS", "UKR", "BLR", "KAZ", "UZB", "KGZ", "TJK", "TKM", "ARM", "AZE", "GEO", "EST", "LVA", "LTU", "MDA"],
  },
  {
    name: "Jugoslávie",
    startedYear: 1929,
    endedYear: 2003,
    becameText: "se rozpadla na sedm států",
    modernIso: ["SRB", "HRV", "SVN", "BIH", "MNE", "MKD", "KOS"],
  },
  {
    name: "Východní Německo",
    startedYear: 1949,
    endedYear: 1990,
    becameText: "se znovu sjednotilo se Západním Německem",
    modernIso: ["DEU"],
  },
  {
    name: "Severní a Jižní Vietnam",
    startedYear: 1954,
    endedYear: 1976,
    becameText: "se sloučily do dnešního Vietnamu",
    modernIso: ["VNM"],
  },
  {
    name: "Cejlon",
    startedYear: 1505,
    endedYear: 1972,
    becameText: "se přejmenoval na Srí Lanku",
    modernIso: ["LKA"],
  },
  {
    name: "Barma",
    startedYear: 1948,
    endedYear: 1989,
    becameText: "se přejmenovala na Myanmar",
    modernIso: ["MMR"],
  },
  {
    name: "Zair",
    startedYear: 1971,
    endedYear: 1997,
    becameText: "se přejmenoval na Demokratickou republiku Kongo",
    modernIso: ["COD"],
  },
  {
    name: "Persie (pod tímto názvem)",
    startedYear: 1,
    endedYear: 1935,
    becameText: "se přejmenovala na Írán",
    modernIso: ["IRN"],
  },
  {
    name: "Jižní Súdán jako součást Súdánu",
    startedYear: 1956,
    endedYear: 2011,
    becameText: "Jižní Súdán vyhlásil nezávislost",
    modernIso: ["SDN"],
  },
];

export function goneCountriesAlive(year: number): GoneCountry[] {
  return GONE_COUNTRIES.filter(
    (c) => c.startedYear <= year && c.endedYear >= year,
  );
}

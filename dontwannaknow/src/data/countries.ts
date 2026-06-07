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
    name: "the Ottoman Empire",
    startedYear: 1299,
    endedYear: 1922,
    becameText: "broke apart into Turkey and the modern Middle East",
    modernIso: ["TUR", "SYR", "IRQ", "LBN", "ISR", "PSE", "JOR", "SAU", "YEM", "EGY", "LBY", "GRC", "BGR", "ALB", "MKD"],
  },
  {
    name: "the British Raj",
    startedYear: 1858,
    endedYear: 1947,
    becameText: "split into India and Pakistan",
    modernIso: ["IND", "PAK", "BGD", "MMR"],
  },
  {
    name: "Czechoslovakia",
    startedYear: 1918,
    endedYear: 1992,
    becameText: "split into the Czech Republic and Slovakia",
    modernIso: ["CZE", "SVK"],
  },
  {
    name: "the Soviet Union",
    startedYear: 1922,
    endedYear: 1991,
    becameText: "broke into 15 separate countries",
    modernIso: ["RUS", "UKR", "BLR", "KAZ", "UZB", "KGZ", "TJK", "TKM", "ARM", "AZE", "GEO", "EST", "LVA", "LTU", "MDA"],
  },
  {
    name: "Yugoslavia",
    startedYear: 1929,
    endedYear: 2003,
    becameText: "broke into seven countries",
    modernIso: ["SRB", "HRV", "SVN", "BIH", "MNE", "MKD", "KOS"],
  },
  {
    name: "East Germany",
    startedYear: 1949,
    endedYear: 1990,
    becameText: "reunified with West Germany",
    modernIso: ["DEU"],
  },
  {
    name: "North & South Vietnam",
    startedYear: 1954,
    endedYear: 1976,
    becameText: "merged into modern Vietnam",
    modernIso: ["VNM"],
  },
  {
    name: "Ceylon",
    startedYear: 1505,
    endedYear: 1972,
    becameText: "renamed itself Sri Lanka",
    modernIso: ["LKA"],
  },
  {
    name: "Burma",
    startedYear: 1948,
    endedYear: 1989,
    becameText: "renamed itself Myanmar",
    modernIso: ["MMR"],
  },
  {
    name: "Zaire",
    startedYear: 1971,
    endedYear: 1997,
    becameText: "renamed itself the Democratic Republic of the Congo",
    modernIso: ["COD"],
  },
  {
    name: "Persia (by that name)",
    startedYear: 1,
    endedYear: 1935,
    becameText: "renamed itself Iran",
    modernIso: ["IRN"],
  },
  {
    name: "South Sudan as part of Sudan",
    startedYear: 1956,
    endedYear: 2011,
    becameText: "South Sudan declared independence",
    modernIso: ["SDN"],
  },
];

export function goneCountriesAlive(year: number): GoneCountry[] {
  return GONE_COUNTRIES.filter(
    (c) => c.startedYear <= year && c.endedYear >= year,
  );
}

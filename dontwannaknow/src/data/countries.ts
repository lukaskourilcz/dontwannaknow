// Countries that existed during certain windows but no longer do (or were renamed).
// Used to surface "when X was born, country Y still existed" facts.

export type GoneCountry = {
  name: string;
  startedYear: number;
  endedYear: number;
  becameText?: string; // e.g. "split into the Czech Republic and Slovakia"
};

export const GONE_COUNTRIES: GoneCountry[] = [
  { name: "the Ottoman Empire", startedYear: 1299, endedYear: 1922, becameText: "broke apart into Turkey and the modern Middle East" },
  { name: "the British Raj", startedYear: 1858, endedYear: 1947, becameText: "split into India and Pakistan" },
  { name: "Czechoslovakia", startedYear: 1918, endedYear: 1992, becameText: "split into the Czech Republic and Slovakia" },
  { name: "the Soviet Union", startedYear: 1922, endedYear: 1991, becameText: "broke into 15 separate countries" },
  { name: "Yugoslavia", startedYear: 1929, endedYear: 2003, becameText: "broke into seven countries" },
  { name: "East Germany", startedYear: 1949, endedYear: 1990, becameText: "reunified with West Germany" },
  { name: "West Germany", startedYear: 1949, endedYear: 1990, becameText: "reunified with East Germany" },
  { name: "North Vietnam", startedYear: 1945, endedYear: 1976, becameText: "merged into modern Vietnam" },
  { name: "South Vietnam", startedYear: 1955, endedYear: 1976, becameText: "merged into modern Vietnam" },
  { name: "Ceylon", startedYear: 1505, endedYear: 1972, becameText: "renamed itself Sri Lanka" },
  { name: "Burma", startedYear: 1948, endedYear: 1989, becameText: "renamed itself Myanmar" },
  { name: "Zaire", startedYear: 1971, endedYear: 1997, becameText: "renamed itself the Democratic Republic of the Congo" },
  { name: "Persia (by that name)", startedYear: 1, endedYear: 1935, becameText: "renamed itself Iran" },
  { name: "South Sudan as part of Sudan", startedYear: 1956, endedYear: 2011, becameText: "South Sudan declared independence" },
];

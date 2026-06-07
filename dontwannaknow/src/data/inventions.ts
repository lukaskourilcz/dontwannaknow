// Things and the year they became part of everyday life.
// Used to surface "born before X existed" facts.

export type Invention = {
  year: number;
  name: string;
  // Optional flavor text to use instead of the default phrasing.
  detail?: string;
};

export const INVENTIONS: Invention[] = [
  { year: 1928, name: "krájený chléb", detail: "krájený chléb se v obchodech ještě neprodával" },
  { year: 1928, name: "penicilin" },
  { year: 1935, name: "parkovací automat" },
  { year: 1938, name: "kuličkové pero" },
  { year: 1947, name: "tranzistor" },
  { year: 1948, name: "televize ve většině domácností" },
  { year: 1950, name: "platební karty" },
  { year: 1954, name: "barevná televize" },
  { year: 1955, name: "suchý zip" },
  { year: 1958, name: "platební karta (jak ji známe dnes)" },
  { year: 1960, name: "antikoncepční pilulka" },
  { year: 1963, name: "magnetofonová kazeta" },
  { year: 1967, name: "domácí mikrovlnná trouba" },
  { year: 1969, name: "bankomat" },
  { year: 1971, name: "znak '@' v e-mailu" },
  { year: 1972, name: "kapesní kalkulačka" },
  { year: 1973, name: "mobilní telefon (prototyp)" },
  { year: 1975, name: "domácí videorekordér" },
  { year: 1977, name: "osobní počítač" },
  { year: 1979, name: "Sony Walkman" },
  { year: 1981, name: "MTV" },
  { year: 1982, name: "kompaktní disk" },
  { year: 1983, name: "mobilní telefon pro běžné uživatele" },
  { year: 1985, name: "Windows" },
  { year: 1989, name: "Game Boy" },
  { year: 1991, name: "World Wide Web" },
  { year: 1994, name: "první komerčně odeslaná SMS" },
  { year: 1995, name: "DVD" },
  { year: 1995, name: "Amazon" },
  { year: 1996, name: "Pokémon" },
  { year: 1998, name: "Google" },
  { year: 2001, name: "iPod" },
  { year: 2001, name: "Wikipedie" },
  { year: 2004, name: "Facebook" },
  { year: 2005, name: "YouTube" },
  { year: 2007, name: "iPhone" },
  { year: 2008, name: "Spotify" },
  { year: 2010, name: "Instagram" },
  { year: 2010, name: "iPad" },
  { year: 2016, name: "TikTok" },
  { year: 2022, name: "ChatGPT" },
];

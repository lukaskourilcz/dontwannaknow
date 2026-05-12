// Things and the year they became part of everyday life.
// Used to surface "born before X existed" facts.

export type Invention = {
  year: number;
  name: string;
  // Optional flavor text to use instead of the default phrasing.
  detail?: string;
};

export const INVENTIONS: Invention[] = [
  { year: 1928, name: "sliced bread", detail: "sliced bread wasn't sold in stores yet" },
  { year: 1928, name: "penicillin" },
  { year: 1935, name: "the parking meter" },
  { year: 1938, name: "the ballpoint pen" },
  { year: 1947, name: "the transistor" },
  { year: 1948, name: "television in most homes" },
  { year: 1950, name: "credit cards" },
  { year: 1954, name: "color TV" },
  { year: 1955, name: "Velcro" },
  { year: 1958, name: "the credit card (as we know it)" },
  { year: 1960, name: "the contraceptive pill" },
  { year: 1963, name: "the cassette tape" },
  { year: 1967, name: "the home microwave oven" },
  { year: 1969, name: "the ATM" },
  { year: 1971, name: "the email '@' sign" },
  { year: 1972, name: "the pocket calculator" },
  { year: 1973, name: "the mobile phone (prototype)" },
  { year: 1975, name: "the home VCR" },
  { year: 1977, name: "the personal computer" },
  { year: 1979, name: "the Sony Walkman" },
  { year: 1981, name: "MTV" },
  { year: 1982, name: "the compact disc" },
  { year: 1983, name: "the consumer mobile phone" },
  { year: 1985, name: "Windows" },
  { year: 1989, name: "Game Boy" },
  { year: 1991, name: "the World Wide Web" },
  { year: 1994, name: "the first SMS sent commercially" },
  { year: 1995, name: "DVDs" },
  { year: 1995, name: "Amazon" },
  { year: 1996, name: "Pokémon" },
  { year: 1998, name: "Google" },
  { year: 2001, name: "the iPod" },
  { year: 2001, name: "Wikipedia" },
  { year: 2004, name: "Facebook" },
  { year: 2005, name: "YouTube" },
  { year: 2007, name: "the iPhone" },
  { year: 2008, name: "Spotify" },
  { year: 2010, name: "Instagram" },
  { year: 2010, name: "the iPad" },
  { year: 2016, name: "TikTok" },
  { year: 2022, name: "ChatGPT" },
];

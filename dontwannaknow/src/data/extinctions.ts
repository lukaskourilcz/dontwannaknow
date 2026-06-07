// Animals declared extinct (or last confirmed alive) at known dates.
// Used to surface "when X was born, the Y still walked the earth — it
// wouldn't be officially gone until Z." All dates are well-documented
// in mainstream conservation sources (IUCN, Smithsonian, etc.).

export type Extinction = {
  species: string;
  lastConfirmedYear: number;
  declaredExtinctYear: number; // if known; otherwise = lastConfirmedYear
  note: string; // single short clause about the last individual / how it went
};

export const EXTINCTIONS: Extinction[] = [
  {
    species: "passenger pigeon",
    lastConfirmedYear: 1914,
    declaredExtinctYear: 1914,
    note: "Martha, the last one alive, died in the Cincinnati Zoo on 1 September 1914",
  },
  {
    species: "Carolina parakeet",
    lastConfirmedYear: 1918,
    declaredExtinctYear: 1939,
    note: "the last captive bird died in the same Cincinnati Zoo cage where Martha had died four years earlier",
  },
  {
    species: "heath hen",
    lastConfirmedYear: 1932,
    declaredExtinctYear: 1932,
    note: "the last male, 'Booming Ben', vanished from Martha's Vineyard in March 1932",
  },
  {
    species: "thylacine (Tasmanian tiger)",
    lastConfirmedYear: 1936,
    declaredExtinctYear: 1936,
    note: "the last known thylacine, 'Benjamin', died at Hobart Zoo on 7 September — the date is now Australia's National Threatened Species Day",
  },
  {
    species: "Bali tiger",
    lastConfirmedYear: 1937,
    declaredExtinctYear: 1937,
    note: "the last verified animal was shot in western Bali in September 1937",
  },
  {
    species: "Caribbean monk seal",
    lastConfirmedYear: 1952,
    declaredExtinctYear: 2008,
    note: "the last confirmed sighting was at Serranilla Bank between Jamaica and Nicaragua",
  },
  {
    species: "Caspian tiger",
    lastConfirmedYear: 1970,
    declaredExtinctYear: 1970,
    note: "the last verified animal was killed in Turkey's Hakkari province",
  },
  {
    species: "Japanese sea lion",
    lastConfirmedYear: 1974,
    declaredExtinctYear: 1974,
    note: "fishermen on Rebun Island saw the last one in 1974; never seen since",
  },
  {
    species: "Javan tiger",
    lastConfirmedYear: 1976,
    declaredExtinctYear: 2003,
    note: "the last credible sighting was in Meru Betiri National Park",
  },
  {
    species: "dusky seaside sparrow",
    lastConfirmedYear: 1987,
    declaredExtinctYear: 1990,
    note: "the last known male, 'Orange', died at Disney's Discovery Island captive-breeding facility",
  },
  {
    species: "golden toad",
    lastConfirmedYear: 1989,
    declaredExtinctYear: 2004,
    note: "the last male was seen in Costa Rica's Monteverde cloud forest in May 1989",
  },
  {
    species: "Pyrenean ibex (bucardo)",
    lastConfirmedYear: 2000,
    declaredExtinctYear: 2000,
    note: "the last female, Celia, was killed by a falling branch in Spain's Ordesa National Park",
  },
  {
    species: "baiji (Yangtze river dolphin)",
    lastConfirmedYear: 2002,
    declaredExtinctYear: 2007,
    note: "a 2006 expedition along 1,700 km of the Yangtze failed to find a single one",
  },
  {
    species: "Pinta Island tortoise",
    lastConfirmedYear: 2012,
    declaredExtinctYear: 2012,
    note: "Lonesome George, the last of his subspecies, died at the Charles Darwin Research Station on 24 June 2012",
  },
  {
    species: "western black rhinoceros",
    lastConfirmedYear: 2006,
    declaredExtinctYear: 2011,
    note: "extensive surveys in Cameroon couldn't find a single animal between 2006 and 2010",
  },
  {
    species: "Bramble Cay melomys",
    lastConfirmedYear: 2009,
    declaredExtinctYear: 2019,
    note: "the first mammal lost to sea-level rise; its tiny coral cay was repeatedly inundated",
  },
];

// Pick the species that were alive at the time the person was born and
// went extinct later in their lifetime. These are the most poignant.
export function speciesAliveAtBirth(birthYear: number, currentYear: number): Extinction[] {
  return EXTINCTIONS.filter(
    (e) => e.lastConfirmedYear >= birthYear && e.declaredExtinctYear <= currentYear,
  );
}

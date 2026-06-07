// Naked-eye cosmic events between roughly 1900 and 2025: bright comets,
// great eclipses, supernovae, and a few notable Mars/Jupiter close
// approaches. Indexed by year for easy lookup against a person's lifetime.

export type CosmicEvent = {
  year: number;
  text: string;
};

export const COSMIC_EVENTS: CosmicEvent[] = [
  { year: 1910, text: "oblohou prolétla Halleyova kometa a Země prošla jejím ohonem" },
  { year: 1919, text: "úplné zatmění Slunce 29. května potvrdilo Einsteinovu obecnou teorii relativity" },
  { year: 1925, text: "úplné zatmění Slunce zastínilo východ Spojených států, bylo vidět až v New Yorku" },
  { year: 1932, text: "dlouhé úplné zatmění Slunce přešlo přes Nové Anglie a Québec" },
  { year: 1948, text: "nad Evropou a Atlantikem bylo vidět úplné zatmění Měsíce" },
  { year: 1957, text: 'Sputnik se stal prvním člověkem vyrobeným objektem na oběžné dráze Země — pohybující se „hvězdou“, kterou bylo vidět za soumraku' },
  { year: 1958, text: "výjimečné sluneční maximum vyvolalo polární záři až nad Mexico City" },
  { year: 1961, text: "úplné zatmění Slunce přešlo 15. února přes Evropu — Itálie, Jugoslávie i SSSR se ponořily do stínu" },
  { year: 1965, text: "kometa Ikeja-Seki prolétla těsně kolem Slunce a krátce byla vidět i za bílého dne" },
  { year: 1969, text: "lidé přistáli na Měsíci — poprvé mohli při pohledu vzhůru vědět, že tam někdo je" },
  { year: 1970, text: "úplné zatmění Slunce přešlo 7. března přes Mexiko a východní pobřeží USA" },
  { year: 1972, text: "poslední pilotovaná měsíční mise Apollo 17 dala světu fotografii Země zvanou Modrá kulička" },
  { year: 1973, text: 'kometa Kohoutek byla vychvalována jako „kometa století“, byla vidět, ale zklamala' },
  { year: 1976, text: "kometa West v březnu zářila tak jasně, že ji bylo vidět i za soumraku" },
  { year: 1979, text: "poslední úplné zatmění Slunce nad pevninským územím USA na 38 let přešlo přes Montanu a Dakoty" },
  { year: 1986, text: "Halleyova kometa se vrátila ke svému jedinečnému zjevení za život" },
  { year: 1987, text: "ve Velkém Magellanově mračnu vzplanula supernova 1987A — nejjasnější za 400 let" },
  { year: 1991, text: "sedmiminutové úplné zatmění Slunce přešlo přes Mexiko — nejdelší ve 20. století" },
  { year: 1994, text: "úlomky komety Shoemaker-Levy 9 se v přímém přenosu zřítily do Jupiteru" },
  { year: 1996, text: "kometa Hjakutake prolétla pouhých 15 milionů km od Země — nejblíže za 200 let" },
  { year: 1997, text: "kometa Hale-Bopp byla pouhým okem viditelná po dobu 18 měsíců" },
  { year: 1999, text: "úplné zatmění Slunce přešlo 11. srpna přes Evropu, sledovala ho živě miliarda lidí" },
  { year: 2003, text: "Mars se přiblížil k Zemi nejvíce za téměř 60 000 let" },
  { year: 2009, text: "šestiminutové úplné zatmění Slunce přešlo přes Indii, Bhútán a Čínu — nejdelší v 21. století" },
  { year: 2012, text: "přechod Venuše přes sluneční kotouč — poslední až do roku 2117" },
  { year: 2017, text: '„Velké americké zatmění“ 21. srpna zastínilo kontinentální USA od Oregonu po Jižní Karolínu' },
  { year: 2020, text: "velká konjunkce přiblížila 21. prosince Jupiter a Saturn na pouhých 0,1° od sebe" },
  { year: 2024, text: "další úplné zatmění Slunce přešlo 8. dubna přes Mexiko, USA a východní Kanadu" },
];

export function cosmicEventsIn(birthYear: number, currentYear: number): CosmicEvent[] {
  return COSMIC_EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= currentYear,
  );
}

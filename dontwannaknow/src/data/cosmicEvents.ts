// Naked-eye cosmic events between roughly 1900 and 2025: bright comets,
// great eclipses, supernovae, and a few notable Mars/Jupiter close
// approaches. Indexed by year for easy lookup against a person's lifetime.

export type CosmicEvent = {
  year: number;
  text: string;
};

export const COSMIC_EVENTS: CosmicEvent[] = [
  { year: 1910, text: "Halley's Comet swept the sky and Earth passed through its tail" },
  { year: 1919, text: "the total solar eclipse of 29 May confirmed Einstein's general relativity" },
  { year: 1925, text: "a total solar eclipse darkened the eastern United States, visible all the way into New York City" },
  { year: 1932, text: "a long total solar eclipse swept across New England and Quebec" },
  { year: 1948, text: "a total lunar eclipse was visible over Europe and the Atlantic" },
  { year: 1957, text: "Sputnik became the first man-made object to orbit the Earth — a moving 'star' visible at dusk" },
  { year: 1958, text: "an exceptional solar maximum produced aurorae as far south as Mexico City" },
  { year: 1961, text: "a total solar eclipse crossed Europe on 15 February — Italy, Yugoslavia, the USSR all in shadow" },
  { year: 1965, text: "Comet Ikeya-Seki passed close to the Sun and was briefly visible in broad daylight" },
  { year: 1969, text: "humans landed on the Moon — the first night people could look up and know someone was up there" },
  { year: 1970, text: "a total solar eclipse crossed Mexico and the US East Coast on 7 March" },
  { year: 1972, text: "the last crewed Moon mission, Apollo 17, gave the world the Blue Marble photo of Earth" },
  { year: 1973, text: "Comet Kohoutek was hyped as the 'comet of the century' and visible but underwhelming" },
  { year: 1976, text: "Comet West shone bright enough to see in broad twilight in March" },
  { year: 1979, text: "the last total solar eclipse over the contiguous US for 38 years swept Montana and the Dakotas" },
  { year: 1986, text: "Halley's Comet returned for its once-in-a-lifetime appearance" },
  { year: 1987, text: "Supernova 1987A flared in the Large Magellanic Cloud — the brightest in 400 years" },
  { year: 1991, text: "a 7-minute total solar eclipse crossed Mexico — the longest of the 20th century" },
  { year: 1994, text: "Comet Shoemaker-Levy 9 fragments crashed into Jupiter on live television" },
  { year: 1996, text: "Comet Hyakutake passed within 15 million km of Earth — closest in 200 years" },
  { year: 1997, text: "Comet Hale-Bopp stayed visible to the naked eye for 18 months" },
  { year: 1999, text: "a total solar eclipse crossed Europe on 11 August, watched live by a billion people" },
  { year: 2003, text: "Mars made its closest approach to Earth in nearly 60,000 years" },
  { year: 2009, text: "a 6-minute total solar eclipse crossed India, Bhutan, and China — the longest of the 21st century" },
  { year: 2012, text: "a transit of Venus crossed the Sun's face — last until 2117" },
  { year: 2017, text: "the 'Great American Eclipse' on 21 August darkened the continental US from Oregon to South Carolina" },
  { year: 2020, text: "the great conjunction brought Jupiter and Saturn within 0.1° of each other on 21 December" },
  { year: 2024, text: "another total solar eclipse swept Mexico, the US, and eastern Canada on 8 April" },
];

export function cosmicEventsIn(birthYear: number, currentYear: number): CosmicEvent[] {
  return COSMIC_EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= currentYear,
  );
}

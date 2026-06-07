// Slang and catchphrases coined or popularised in each decade. These
// are the words and phrases someone growing up in that decade actually
// used. Drawn from popular dictionaries and decade-specific catalogues.

export type DecadeSlang = {
  decadeStart: number;
  expressions: { phrase: string; meaning: string }[];
};

export const SLANG: DecadeSlang[] = [
  {
    decadeStart: 1920,
    expressions: [
      { phrase: "the bee's knees", meaning: "the best of the best" },
      { phrase: "speakeasy", meaning: "an illegal bar serving liquor during Prohibition" },
      { phrase: "ballyhoo", meaning: "showy hype" },
      { phrase: "the cat's pajamas", meaning: "wonderful" },
      { phrase: "twenty-three skidoo", meaning: "scram, get out of here" },
      { phrase: "necking", meaning: "kissing in a parked car" },
      { phrase: "hooch", meaning: "bootleg liquor" },
    ],
  },
  {
    decadeStart: 1930,
    expressions: [
      { phrase: "swell", meaning: "wonderful" },
      { phrase: "racket", meaning: "an illegal scheme" },
      { phrase: "in the doghouse", meaning: "in trouble with your spouse" },
      { phrase: "scram", meaning: "leave fast" },
      { phrase: "putting on the Ritz", meaning: "dressing to the nines" },
      { phrase: "Hoover blanket", meaning: "a newspaper used to keep warm" },
    ],
  },
  {
    decadeStart: 1940,
    expressions: [
      { phrase: "snafu", meaning: "Situation Normal All F***ed Up — GI slang" },
      { phrase: "Kilroy was here", meaning: "the doodle that followed GIs around the globe" },
      { phrase: "gobbledygook", meaning: "bureaucratic nonsense, coined by Maury Maverick in 1944" },
      { phrase: "ration card", meaning: "the stamps you needed for sugar, meat, gas" },
      { phrase: "victory garden", meaning: "the vegetable patch you grew to help the war" },
      { phrase: "gas up", meaning: "fill the tank — newly important in wartime" },
    ],
  },
  {
    decadeStart: 1950,
    expressions: [
      { phrase: "cool", meaning: "great (still going strong)" },
      { phrase: "daddy-o", meaning: "address for a hip man" },
      { phrase: "made in the shade", meaning: "easy living" },
      { phrase: "going steady", meaning: "exclusively dating" },
      { phrase: "hi-fi", meaning: "high-fidelity stereo, the must-have appliance" },
      { phrase: "the bird", meaning: "anything fashionable or cool" },
      { phrase: "real gone", meaning: "extraordinary; wild" },
    ],
  },
  {
    decadeStart: 1960,
    expressions: [
      { phrase: "groovy", meaning: "excellent, hip" },
      { phrase: "far out", meaning: "amazing" },
      { phrase: "outta sight", meaning: "incredible" },
      { phrase: "the fuzz", meaning: "the police" },
      { phrase: "boob tube", meaning: "the television" },
      { phrase: "bummer", meaning: "a disappointment" },
      { phrase: "right on", meaning: "I agree" },
      { phrase: "psychedelic", meaning: "mind-expanding (drugs, music, posters)" },
    ],
  },
  {
    decadeStart: 1970,
    expressions: [
      { phrase: "dyno-mite!", meaning: "fantastic — from J.J. on Good Times" },
      { phrase: "right on", meaning: "still going" },
      { phrase: "boogie", meaning: "to dance or to leave" },
      { phrase: "catch you on the flip side", meaning: "see you later" },
      { phrase: "what's your bag?", meaning: "what's your problem?" },
      { phrase: "keep on truckin'", meaning: "carry on, in style" },
      { phrase: "burned out", meaning: "exhausted, fried" },
      { phrase: "10-4", meaning: "yes, copy that — from the CB radio craze" },
    ],
  },
  {
    decadeStart: 1980,
    expressions: [
      { phrase: "gnarly", meaning: "extreme — surf and skate slang" },
      { phrase: "totally", meaning: "intensifier, the Valley Girl way" },
      { phrase: "gag me with a spoon", meaning: "that's gross" },
      { phrase: "as if!", meaning: "I don't think so" },
      { phrase: "yuppie", meaning: "young urban professional" },
      { phrase: "rad", meaning: "radical, awesome" },
      { phrase: "psyche!", meaning: "just kidding" },
      { phrase: "wicked", meaning: "very good (New England especially)" },
    ],
  },
  {
    decadeStart: 1990,
    expressions: [
      { phrase: "all that and a bag of chips", meaning: "great, with extras" },
      { phrase: "talk to the hand", meaning: "I'm not listening" },
      { phrase: "you go, girl", meaning: "well done" },
      { phrase: "the bomb", meaning: "the best" },
      { phrase: "phat", meaning: "excellent (pretty hot and tempting)" },
      { phrase: "buggin'", meaning: "freaking out" },
      { phrase: "all that", meaning: "thinking highly of oneself" },
    ],
  },
];

export function slangFor(decadeStart: number): DecadeSlang | null {
  return SLANG.find((s) => s.decadeStart === decadeStart) ?? null;
}

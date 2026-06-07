// Slang a hlášky, které vznikly nebo zpopulárněly v každém desetiletí. Jsou
// to slova a fráze, které někdo vyrůstající v daném desetiletí skutečně
// používal. Čerpáno z populárních slovníků a katalogů jednotlivých dekád.

export type DecadeSlang = {
  decadeStart: number;
  expressions: { phrase: string; meaning: string }[];
};

export const SLANG: DecadeSlang[] = [
  {
    decadeStart: 1920,
    expressions: [
      { phrase: "the bee's knees", meaning: "to nejlepší z nejlepšího" },
      { phrase: "speakeasy", meaning: "nelegální bar, který za prohibice naléval alkohol" },
      { phrase: "ballyhoo", meaning: "okázalá šou a humbuk" },
      { phrase: "the cat's pajamas", meaning: "úžasné, skvělé" },
      { phrase: "twenty-three skidoo", meaning: "zmiz, vypadni odsud" },
      { phrase: "necking", meaning: "líbání v zaparkovaném autě" },
      { phrase: "hooch", meaning: "pašovaný chlast" },
    ],
  },
  {
    decadeStart: 1930,
    expressions: [
      { phrase: "swell", meaning: "skvělé, báječné" },
      { phrase: "racket", meaning: "nelegální kšeft" },
      { phrase: "in the doghouse", meaning: "v maléru u partnera či partnerky" },
      { phrase: "scram", meaning: "rychle vypadnout" },
      { phrase: "putting on the Ritz", meaning: "vyparádit se do nejlepšího" },
      { phrase: "Hoover blanket", meaning: "noviny, kterými se člověk přikrýval, aby se zahřál" },
    ],
  },
  {
    decadeStart: 1940,
    expressions: [
      { phrase: "snafu", meaning: "Situation Normal All F***ed Up — vojenský slang pro typický bordel" },
      { phrase: "Kilroy was here", meaning: "čmáranice, která vojáky provázela po celém světě" },
      { phrase: "gobbledygook", meaning: "úřední blábol; výraz vymyslel Maury Maverick v roce 1944" },
      { phrase: "ration card", meaning: "lístky, které jsi potřeboval na cukr, maso a benzín" },
      { phrase: "victory garden", meaning: "zeleninový záhonek, který sis pěstoval na pomoc válečnému úsilí" },
      { phrase: "gas up", meaning: "natankovat — za války nově důležité" },
    ],
  },
  {
    decadeStart: 1950,
    expressions: [
      { phrase: "cool", meaning: "super, skvělé (používá se dodnes)" },
      { phrase: "daddy-o", meaning: "oslovení pro frajera, hipového chlápka" },
      { phrase: "made in the shade", meaning: "bezstarostný život" },
      { phrase: "going steady", meaning: "chodit spolu napevno, jen spolu" },
      { phrase: "hi-fi", meaning: "kvalitní gramofon či stereo, must-have té doby" },
      { phrase: "the bird", meaning: "cokoliv módního nebo cool" },
      { phrase: "real gone", meaning: "výjimečné, divoké, mimořádné" },
    ],
  },
  {
    decadeStart: 1960,
    expressions: [
      { phrase: "groovy", meaning: "skvělé, hipové" },
      { phrase: "far out", meaning: "úžasné" },
      { phrase: "outta sight", meaning: "neuvěřitelné" },
      { phrase: "the fuzz", meaning: "policajti" },
      { phrase: "boob tube", meaning: "televize, bedna" },
      { phrase: "bummer", meaning: "zklamání, smůla" },
      { phrase: "right on", meaning: "souhlasím, přesně tak" },
      { phrase: "psychedelic", meaning: "rozšiřující vědomí (drogy, hudba, plakáty)" },
    ],
  },
  {
    decadeStart: 1970,
    expressions: [
      { phrase: "dyno-mite!", meaning: "paráda — z hlášky J.J. v seriálu Good Times" },
      { phrase: "right on", meaning: "stále v kurzu" },
      { phrase: "boogie", meaning: "tancovat, nebo taky vypadnout" },
      { phrase: "catch you on the flip side", meaning: "uvidíme se později" },
      { phrase: "what's your bag?", meaning: "co máš za problém?" },
      { phrase: "keep on truckin'", meaning: "jen tak dál, ve velkém stylu" },
      { phrase: "burned out", meaning: "vyčerpaný, vyhořelý" },
      { phrase: "10-4", meaning: "ano, rozumím — z éry CB vysílaček" },
    ],
  },
  {
    decadeStart: 1980,
    expressions: [
      { phrase: "gnarly", meaning: "extrémní — slang surfařů a skejťáků" },
      { phrase: "totally", meaning: "zesilovač ve stylu Valley Girl, naprosto" },
      { phrase: "gag me with a spoon", meaning: "to je hnus" },
      { phrase: "as if!", meaning: "to teda určitě ne" },
      { phrase: "yuppie", meaning: "mladý městský kariérista" },
      { phrase: "rad", meaning: "radikální, super" },
      { phrase: "psyche!", meaning: "jen tak žertuju, naletěl jsi" },
      { phrase: "wicked", meaning: "moc dobré (hlavně v Nové Anglii)" },
    ],
  },
  {
    decadeStart: 1990,
    expressions: [
      { phrase: "all that and a bag of chips", meaning: "skvělé, a ještě něco navíc" },
      { phrase: "talk to the hand", meaning: "neposlouchám tě" },
      { phrase: "you go, girl", meaning: "jen tak dál, holka, paráda" },
      { phrase: "the bomb", meaning: "to nejlepší" },
      { phrase: "phat", meaning: "vynikající (pretty hot and tempting)" },
      { phrase: "buggin'", meaning: "šílet, vyšilovat" },
      { phrase: "all that", meaning: "o sobě si moc myslet" },
    ],
  },
];

export function slangFor(decadeStart: number): DecadeSlang | null {
  return SLANG.find((s) => s.decadeStart === decadeStart) ?? null;
}

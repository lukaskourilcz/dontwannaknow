// Definice os redakčního skórování relevance. Jediný zdroj pravdy pro
// promptování skórovacích agentů i pro dokumentaci — změna zde znamená novou
// verzi promptu (zvyšte PROMPT_VERSION, jinak nelze diffovat opakované běhy).
//
// Osy jsou záměrně nezávislé: žádná z nich sama o sobě nesmí rozhodnout
// o zařazení záznamu. Deterministické brány (citlivost, sdílení, věkové okno,
// rozsah CZ/UA, slovník přehánění) skóre vždy přebijí — skóre jen řadí to,
// co brány už pustily.

export const PROMPT_VERSION = "relevance-v1";

export const MODEL_NOTE =
  "Skóroval agent Claude (build-time kurátorská pomoc); výstup je commitnutý JSON, běhové prostředí žádný model nevolá.";

export const AXES = {
  livedProximity: {
    short: "lp",
    pass: "A",
    label: "Blízkost prožitku",
    anchors: [
      "0 — vzdálená událost bez místního dopadu na dané místo",
      "1 — globální událost se slabou místní ozvěnou",
      "2 — širší státní celek (SSSR, federace) s omezeným průnikem do daného místa",
      "3 — celostátní dosah v moderní zemi",
      "4 — dobový stát, ve kterém člověk žil, s přímou místní přítomností",
      "5 — přímo město či čtvrť, kde se člověk narodil a vyrůstal",
    ],
  },
  everydayConsequence: {
    short: "ec",
    pass: "A",
    label: "Dopad na všední den",
    anchors: [
      "0 — nezměnilo nikomu den",
      "1 — dotklo se úzké profesní skupiny",
      "2 — změna pro menšinu domácností nebo jen krátkodobě",
      "3 — změna rutiny pro výraznou skupinu (fronty, ceny, program televize)",
      "4 — změnilo chování většiny domácností na měsíce",
      "5 — změnilo, co lidé jedli, nosili, kupovali, čeho se báli nebo co směli říkat (měnová reforma, příděly, zákazy)",
    ],
  },
  recognition: {
    short: "rv",
    pass: "B",
    label: "Hodnota rozpoznání",
    anchors: [
      "0 — pamětník by si nevzpomněl",
      "1 — vzpomene si jen úzký okruh",
      "2 — vzpomene si menšina dané generace",
      "3 — řekne „aha, to znám“ značná část generace",
      "4 — „ano, přesně tak“ — sdílená vzpomínka většiny, kdo tam žili",
      "5 — téměř univerzální prožitá zkušenost dané doby a místa",
    ],
  },
  discovery: {
    short: "dv",
    pass: "B",
    label: "Hodnota objevu",
    anchors: [
      "0 — obecně známé školní učivo",
      "1 — zná většina čtenářů novin",
      "2 — zná poučený zájemce o historii",
      "3 — překvapí běžného čtenáře",
      "4 — překvapí i sečtělého člověka („to jsem nevěděl/a“)",
      "5 — málo známý, dobře doložitelný detail, který mění pohled na dobu",
    ],
  },
  consequenceHorizon: {
    short: "ch",
    pass: "A",
    label: "Horizont důsledků",
    anchors: [
      "0 — zapomenuto během týdnů",
      "1 — sezónní epizoda",
      "2 — mělo význam jednotky let",
      "3 — formovalo zhruba dekádu",
      "4 — důsledky znatelné i po deseti letech",
      "5 — trvale změnilo město, zemi nebo každodennost",
    ],
  },
  explanatoryPayload: {
    short: "ep",
    pass: "C",
    label: "Vysvětlující náboj",
    anchors: [
      "0 — holé datum založení či spuštění bez místního důsledku",
      "1 — jméno a rok bez příběhu",
      "2 — dílčí zajímavost bez širší souvislosti",
      "3 — nese kus příběhu doby",
      "4 — vysvětluje mechanismus, jak doba fungovala",
      "5 — malý příběh, který otevírá pochopení celé éry",
    ],
  },
};

export const PASSES = {
  A: { axes: ["livedProximity", "everydayConsequence", "consequenceHorizon"], name: "kontextové osy" },
  B: { axes: ["recognition", "discovery"], name: "čtenářské osy" },
  C: { axes: ["explanatoryPayload"], name: "příběhová osa" },
};

export const GUARDRAILS = `Zásady, které skóre nesmí porušit:
- „Zajímavé“ neznamená „dramatické“. Válku, smrt a persekuci řeší samostatná
  citlivostní pravidla — neskórujte tragičnost, skórujte popsané osy.
- Neskórujte kvalitu textu ani styl. Hodnotíte podkladovou událost, ne prózu.
- Nevymýšlejte kontext, který v záznamu není. Při nejistotě skórujte střízlivě
  (nižší hodnota) a napište to do zdůvodnění.
- Každé skóre je celé číslo 0–5. Ke každému záznamu patří jednořádkové
  zdůvodnění v češtině (max ~20 slov).`;

export function passPrompt(pass, batch) {
  const axes = PASSES[pass].axes.map((axis) => {
    const spec = AXES[axis];
    return `### ${axis} (${spec.short}) — ${spec.label}\n${spec.anchors.join("\n")}`;
  }).join("\n\n");
  const fields = PASSES[pass].axes.map((axis) => AXES[axis].short).join(", ");
  return `Jste redakční kurátor produktu Tehdejší svět — česky psané, osobní
rekonstrukce prostředí, ve kterém někdo vyrůstal. Čtenář chce vědět, co
skutečně formovalo život v daném místě a čase; nikoho nezajímá vzdálené
korporátní výročí.

Ohodnoťte KAŽDÝ záznam v dávce na těchto osách (celá čísla 0–5):

${axes}

${GUARDRAILS}

Kohorta pro posouzení: lidé, kteří v daném místě a čase žili (u městských
záznamů obyvatelé města, u celostátních obyvatelé dané země v daném období).

Vstupní dávka (JSON): ${batch.file}
Zapište výsledek jako JSON do: ${batch.outFile}
Formát výstupu:
{
  "pass": "${pass}",
  "promptVersion": "${PROMPT_VERSION}",
  "scores": [
    { "key": "<key záznamu beze změny>", ${fields.split(", ").map((f) => `"${f}": <0-5>`).join(", ")}, "rationale": "<jednořádkové zdůvodnění>" }
  ]
}
Pokryjte všechny záznamy dávky, klíče nechte doslova beze změny.`;
}

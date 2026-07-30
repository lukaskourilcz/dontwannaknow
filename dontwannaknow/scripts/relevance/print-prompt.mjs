// Vytiskne PŘESNÝ skórovací prompt pro daný průchod. Jediný správný způsob,
// jak se k rubrice dostat — ať už skóruje Claude, Codex, nebo cokoli dalšího.
// Rubrika se nikdy neopisuje do dokumentace; tam by zastarala.
//
// Použití:
//   npm run relevance:prompt -- A            # kontextové osy
//   npm run relevance:prompt -- B --json     # čtenářské osy, strojově
//   npm run relevance:prompt -- --versions   # verze promptu a osy

import { AXES, PASSES, PROMPT_VERSION, passPrompt } from "./prompts.mjs";

const args = process.argv.slice(2);
const pass = args.find((a) => /^[ABC]$/.test(a));

if (args.includes("--versions") || !pass) {
  const summary = {
    promptVersion: PROMPT_VERSION,
    axisOrder: Object.keys(AXES),
    passes: Object.fromEntries(Object.entries(PASSES).map(([id, p]) => [id, p.axes])),
  };
  if (args.includes("--json")) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Verze promptu: ${summary.promptVersion}`);
    console.log(`Pořadí os (smluvní, odpovídá poli rel): ${summary.axisOrder.join(", ")}`);
    for (const [id, axes] of Object.entries(summary.passes)) {
      console.log(`Průchod ${id}: ${axes.join(", ")}`);
    }
    if (!pass) console.log("\nPro plný prompt: npm run relevance:prompt -- A|B|C");
  }
  process.exit(0);
}

const batch = {
  file: args.find((a) => a.endsWith(".json")) ?? "<cesta k dávce>",
  outFile: args[args.indexOf("--out") + 1] ?? "<cesta k výsledku>",
};
const text = passPrompt(pass, batch);
console.log(args.includes("--json") ? JSON.stringify({ pass, promptVersion: PROMPT_VERSION, prompt: text }, null, 2) : text);

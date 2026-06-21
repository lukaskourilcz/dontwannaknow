import slangJson from "./slang.json";
import { regroupSlang } from "./_grouped";

// Slang a hlášky, které vznikly nebo zpopulárněly v každém desetiletí. Jsou
// to slova a fráze, které někdo vyrůstající v daném desetiletí skutečně
// používal. Čerpáno z populárních slovníků a katalogů jednotlivých dekád.

export type DecadeSlang = {
  decadeStart: number;
  expressions: { phrase: string; meaning: string }[];
};

export const SLANG: DecadeSlang[] = regroupSlang(slangJson) as unknown as DecadeSlang[];

export function slangFor(decadeStart: number): DecadeSlang | null {
  return SLANG.find((s) => s.decadeStart === decadeStart) ?? null;
}

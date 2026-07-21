import { describe, expect, it } from "vitest";
import { createSeededRandom, pickN, stableHash, withSeededRandom } from "./random";

describe("seeded random helpers", () => {
  it("produces stable hashes and repeatable random sequences", () => {
    expect(stableHash("tehdejší svět")).toBe(stableHash("tehdejší svět"));
    const first = createSeededRandom("rodina");
    const second = createSeededRandom("rodina");
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it("scopes deterministic selection without leaking the generator", () => {
    const values = [1, 2, 3, 4, 5];
    const first = withSeededRandom("1953", () => pickN(values, 3));
    const second = withSeededRandom("1953", () => pickN(values, 3));
    expect(first).toEqual(second);
    expect(new Set(first).size).toBe(3);
  });
});

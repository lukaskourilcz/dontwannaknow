import { describe, expect, it } from "vitest";
import { czAgePhrase, czYears } from "./czech";

describe("Czech age formatting", () => {
  it.each([
    [1, "rok"],
    [2, "roky"],
    [4, "roky"],
    [5, "let"],
  ])("formats %i years", (age, expected) => {
    expect(czYears(age)).toBe(expected);
  });

  it("uses the correct form in relative-age phrases", () => {
    expect(czAgePhrase(0)).toBe("v roce narození");
    expect(czAgePhrase(1)).toBe("ve věku jednoho roku");
    expect(czAgePhrase(3)).toBe("ve věku 3 let");
    expect(czAgePhrase(-2)).toBe("2 roky před narozením");
  });
});

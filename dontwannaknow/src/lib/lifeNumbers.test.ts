import { describe, expect, it } from "vitest";
import { lifeNumbers } from "./lifeNumbers";

describe("lifeNumbers", () => {
  it("contains only elapsed-time calculations", () => {
    const items = lifeNumbers(36_525);
    expect(items.find((item) => item.key === "years")?.value).toBe(100);
    expect(items.find((item) => item.key === "days")?.value).toBe(36_525);
    expect(items.find((item) => item.key === "weeks")?.value).toBe(Math.floor(36_525 / 7));
    expect(items.map((item) => item.key)).not.toEqual(
      expect.arrayContaining(["heartbeats", "breaths", "blood", "food", "dreams"]),
    );
  });

  it("clamps future dates to zero elapsed time", () => {
    expect(lifeNumbers(-50).every((item) => item.value === 0)).toBe(true);
  });
});

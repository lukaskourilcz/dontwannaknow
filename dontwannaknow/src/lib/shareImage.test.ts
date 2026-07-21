import { beforeAll, describe, expect, it } from "vitest";
import { reportFor } from "./facts";
import { shareItemForKind } from "./shareImage";
import { makePerson } from "../test/factories";
import type { PersonReport } from "./facts";

describe("share image content", () => {
  let report: PersonReport;

  beforeAll(async () => {
    report = await reportFor(makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953 }));
  });

  it.each([
    ["culture", "teenage-years"],
    ["contrast", "different-from-today"],
  ] as const)("selects safe content for the %s template", (kind, chapterId) => {
    const item = shareItemForKind(report, kind);
    expect(item?.metadata.shareSafe).toBe(true);
    expect(item?.metadata.chapter).toBe(chapterId);
  });

  it("keeps cover, sky and comparison templates free of arbitrary facts", () => {
    expect(shareItemForKind(report, "cover")).toBeNull();
    expect(shareItemForKind(report, "sky")).toBeNull();
    expect(shareItemForKind(report, "comparison")).toBeNull();
  });
});

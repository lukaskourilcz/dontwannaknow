import { describe, expect, it } from "vitest";
import { buildShareUrl, decodeReportState, encodeReportState, sanitizeAnalyticsUrl } from "./share";
import { makePerson } from "../test/factories";

describe("private report links", () => {
  it("removes both query and fragment payloads from analytics URLs", () => {
    expect(sanitizeAnalyticsUrl("https://example.test/report?name=Anna#r=private"))
      .toBe("https://example.test/report");
  });

  it("omits names by default and preserves Czech UTF-8 when explicitly included", () => {
    const person = makePerson({ name: "Šárka" });
    const privateState = encodeReportState([person]);
    expect(decodeReportState(privateState)?.[0]?.label).toBe("");
    expect(decodeReportState(privateState)?.[0]).not.toHaveProperty("relationship");
    expect(privateState).not.toContain("Šárka");

    const namedState = encodeReportState([person], { includeNames: true });
    expect(decodeReportState(namedState)?.[0]?.label).toBe("Šárka");
  });

  it("round-trips two supported people and rejects malformed state", () => {
    const people = [
      makePerson({ birthYear: 1953, citySlug: "prague" }),
      makePerson({ country: "UA", citySlug: "kyiv", birthYear: 1948 }),
    ];
    expect(decodeReportState(encodeReportState(people))).toHaveLength(2);
    expect(decodeReportState("not-valid-base64")).toBeNull();
    expect(buildShareUrl(people)).toContain("#r=");
  });

  it("rejects a syntactically valid fragment with unsupported personal data", () => {
    const invalid = btoa(JSON.stringify({
      z: 1,
      p: [{ y: 1953, m: 2, d: 30, c: "CZ", s: "prague" }],
    })).replace(/=+$/, "");
    expect(decodeReportState(invalid)).toBeNull();
  });

  it("restores older links while ignoring their removed relationship field", () => {
    const legacy = btoa(JSON.stringify({
      z: 1,
      p: [{ y: 1953, c: "CZ", s: "prague", r: "mother" }],
    })).replace(/=+$/, "");

    expect(decodeReportState(legacy)?.[0]).toMatchObject({
      birthYear: 1953,
      country: "CZ",
      citySlug: "prague",
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { loadContent } from "./contentApi";
import { sourceByKey, type ContentRecord } from "./contentSources";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cityImagesSelection v /dev", () => {
  it("načte z build-time obálky editovatelné záznamy", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("dev API není dostupné")));

    const records = await loadContent<ContentRecord[]>("cityImagesSelection");

    expect(records).toHaveLength(20);
    expect(records[0]).toMatchObject({
      id: "prague-1950-kulicky-u-rudolfina",
      city: "prague",
      decade: 1950,
    });
  });

  it("přiřadí editorovou sadu ke zdrojovému registru cityImages", () => {
    const source = sourceByKey("cityImagesSelection");

    expect(source?.datasetKey).toBe("cityImages");
    expect(source?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining(["commonsTitle", "alt", "caption", "excluded"]),
    );
  });
});

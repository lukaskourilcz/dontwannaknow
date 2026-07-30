import test from "node:test";
import assert from "node:assert/strict";
import { assertAllowedLicence, normalizeLicence } from "./licence.mjs";
import { validateCityImageRecord } from "./validate.mjs";

const validRecord = {
  id: "prague-1950-test",
  city: "prague",
  decade: 1950,
  yearApprox: "1954",
  dateCertainty: "year",
  file: "prague/1950/prague-1950-test.webp",
  alt: "Černobílá fotografie pražské ulice s chodci a tramvají.",
  caption: "Pražská ulice s běžným provozem, kolem roku 1954.",
  licence: "CC BY-SA 4.0",
  licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: "Autor snímku, Wikimedia Commons",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Test.jpg",
  width: 1_000,
  height: 700,
};

test("normalizace připustí jen redistribuovatelné licence", () => {
  assert.equal(normalizeLicence("Public domain"), "PDM 1.0");
  assert.equal(normalizeLicence("CC0"), "CC0 1.0");
  assert.equal(normalizeLicence("CC BY 4.0"), "CC BY 4.0");
  assert.equal(normalizeLicence("CC BY-SA 3.0"), "CC BY-SA 3.0");
  assert.equal(normalizeLicence("CC BY-SA 3.0 de"), "CC BY-SA 3.0");
  assert.equal(normalizeLicence("CC BY-NC 4.0"), null);
  assert.equal(normalizeLicence("CC BY-ND 4.0"), null);
  assert.equal(normalizeLicence("Fair use"), null);
  assert.throws(() => assertAllowedLicence("CC BY-NC-SA 4.0", "syntetický NC záznam"));
});

test("audit odmítne syntetický NC záznam i nečeský alt", () => {
  const errors = validateCityImageRecord({
    ...validRecord,
    licence: "CC BY-NC 4.0",
    alt: "A city street with pedestrians and a tram.",
  }, { fileSize: 10_000 });
  assert.ok(errors.some((error) => error.includes("nepovolená licence")));
  assert.ok(errors.some((error) => error.includes("alt není věrohodně český")));
});

test("platný městský snímek projde licenčním, textovým i velikostním auditem", () => {
  assert.deepEqual(validateCityImageRecord(validRecord, { fileSize: 79_000 }), []);
});

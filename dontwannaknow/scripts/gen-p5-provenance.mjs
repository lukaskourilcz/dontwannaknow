// Reprodukovatelně skládá per-record citace tří ručně kurátorovaných sad P5.
// Neprovádí síťové volání: zdrojové záznamy i pravidla URL jsou commitnuté.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { recordKey } from "./relevance/record-key.mjs";

const data = new URL("../src/data/", import.meta.url);
const output = new URL("../src/data/provenance/", import.meta.url);
const accessed = "2026-07-30";
const allowedLicences = new Set(["CC0 1.0", "CC BY 4.0", "CC BY-SA 4.0"]);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, data), "utf8"));
const assertOpenLicences = (dataset, records) => {
  for (const record of records) {
    if (!allowedLicences.has(record.licence)) {
      throw new Error(
        `${dataset}/${record.id ?? "bez-id"}: licence „${record.licence}“ není povolena.`,
      );
    }
  }
};
const writeSidecar = async (dataset, records) => {
  await mkdir(output, { recursive: true });
  await writeFile(
    new URL(`${dataset}.json`, output),
    `${JSON.stringify({ generatedAt: accessed, records }, null, 2)}\n`,
  );
  console.log(`src/data/provenance/${dataset}.json: ${records.length} citací.`);
};

const babyNames = await readJson("babyNames/cz.json");
assertOpenLicences("babyNames", babyNames);
await writeSidecar("babyNames", babyNames.map((record) => ({
  key: recordKey("babyNames", record),
  title: "Statistika dětských jmen — tisková konference 30. května 2024",
  publisher: "Český statistický úřad",
  url: "https://statistikaamy.csu.gov.cz/soubory/statistika-a-my/2024/05/CSU-TK-Detska-jmena-prezentace.pdf",
  accessed,
  dateAccessed: accessed,
  licence: "CC BY 4.0",
  attribution: "Pořadí převzato beze změny; věta projektu rozlišuje hlášení a registr.",
})));

const czechSlang = await readJson("slang/cz.json");
const ukrainianSlang = await readJson("slang/ua.json");
assertOpenLicences("slang", [...czechSlang, ...ukrainianSlang]);
const ukrainianTerms = new Map([
  ["ua-kruto", "круто"],
  ["ua-chuvak", "чувак"],
  ["ua-mobilka", "мобілка"],
  ["ua-selfi", "селфі"],
  ["ua-mem", "мем"],
]);
await writeSidecar("slang", [...czechSlang, ...ukrainianSlang].map((record) => {
  const englishWiktionary = record.id === "cz-parba" || record.country === "ua";
  const sourceTerm = record.country === "ua"
    ? ukrainianTerms.get(record.id)
    : record.phrase;
  if (!sourceTerm) throw new Error(`Chybí zdrojový tvar pro ${record.id}.`);
  const publisher = englishWiktionary
    ? "Přispěvatelé Wiktionary"
    : "Přispěvatelé Wikislovníku";
  const host = englishWiktionary ? "en.wiktionary.org" : "cs.wiktionary.org";
  return {
    key: recordKey("slang", record),
    title: `Slovníkové heslo „${record.phrase}“`,
    publisher,
    url: `https://${host}/wiki/${encodeURIComponent(sourceTerm)}`,
    accessed,
    dateAccessed: accessed,
    licence: "CC BY-SA 4.0",
    attribution: "Význam parafrázován česky; časové okno je redakční datace projektu.",
  };
}));

const mediaMilestones = [
  ...await readJson("mediaMilestones/cz.json"),
  ...await readJson("mediaMilestones/ua.json"),
];
assertOpenLicences("mediaMilestones", mediaMilestones);
const mediaReference = (record) => {
  if (record.licence === "CC0 1.0") {
    return {
      title: `Wikidata: ${record.wikidataId}`,
      publisher: "Wikidata",
      url: `https://www.wikidata.org/wiki/${record.wikidataId}`,
      licence: record.licence,
    };
  }
  if (record.id === "cz-1958-televizni-noviny") {
    return {
      title: "Televizní noviny (Československá televize)",
      publisher: "Přispěvatelé Wikipedie",
      url: "https://cs.wikipedia.org/wiki/Televizn%C3%AD_noviny_(%C4%8Ceskoslovensk%C3%A1_televize)",
      licence: record.licence,
    };
  }
  if (record.id === "cz-1973-barva") {
    return {
      title: "Československá televize",
      publisher: "Přispěvatelé Wikipedie",
      url: "https://cs.wikipedia.org/wiki/%C4%8Ceskoslovensk%C3%A1_televize",
      licence: record.licence,
    };
  }
  return {
    title: "Televize na Ukrajině",
    publisher: "Přispěvatelé Wikipedie",
    url: "https://uk.wikipedia.org/wiki/%D0%A2%D0%B5%D0%BB%D0%B5%D0%B1%D0%B0%D1%87%D0%B5%D0%BD%D0%BD%D1%8F_%D0%B2_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%96",
    licence: record.licence,
  };
};
await writeSidecar("mediaMilestones", mediaMilestones.map((record) => {
  const source = mediaReference(record);
  return {
    key: recordKey("mediaMilestones", record),
    ...source,
    accessed,
    dateAccessed: accessed,
    ...(source.licence === "CC BY-SA 4.0"
      ? { attribution: "Fakta parafrázována v české redakční větě projektu." }
      : {}),
  };
}));

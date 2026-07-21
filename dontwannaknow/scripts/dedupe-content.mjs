import { readFile, writeFile } from "node:fs/promises";

const targets = [
  new URL("../src/data/cityFacts.json", import.meta.url),
  new URL("../src/data/countryEvents.json", import.meta.url),
];

function canonical(record) {
  return JSON.stringify(
    Object.fromEntries(Object.keys(record).sort().map((key) => [key, record[key]])),
  );
}

for (const target of targets) {
  const records = JSON.parse(await readFile(target, "utf8"));
  const seen = new Set();
  const unique = records.filter((record) => {
    const key = canonical(record);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  await writeFile(target, `${JSON.stringify(unique, null, 2)}\n`, "utf8");
  console.log(`${target.pathname}: odstraněno ${records.length - unique.length} přesných duplicit.`);
}

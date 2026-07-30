// Build-time download of long-run vital statistics from Our World in Data.
//
// The public application never calls OWID. This script downloads the Grapher
// CSV, its metadata and OWID's point-level source map, keeps only explicitly
// allowlisted upstreams, and commits deterministic CZ/UA JSON derivatives.
//
// Usage: node scripts/gen-vitals.mjs

import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordKey } from "./relevance/record-key.mjs";

const ACCESSED = new Date().toISOString().slice(0, 10);
const DATA_DIR = new URL("../src/data/", import.meta.url);
const VITALS_DIR = new URL("vitals/", DATA_DIR);
const PROVENANCE_URL = new URL("provenance/vitalsBackfill.json", DATA_DIR);
const SUPPORTED = new Map([["CZE", "cz"], ["UKR", "ua"]]);
const YEAR_FROM = 1920;
const YEAR_TO = 1959;

const SERIES = [
  {
    id: "lifeExpectancy",
    slug: "life-expectancy",
    valueColumn: "Life expectancy",
    sourceMap:
      "https://docs.google.com/spreadsheets/d/1LnrU1V3p2wq7sAPY4AHRdH1urol3cKev7prEvlLfSU4/export?format=csv&gid=0",
  },
  {
    id: "childMortality",
    slug: "child-mortality",
    valueColumn: "Under-five mortality rate (selected)",
    sourceMap:
      "https://docs.google.com/spreadsheets/d/1SaeXxXXeBAATXH3HTmonyPiBd7j0laE6GBUlcboTgYk/export?format=csv",
  },
];

const ALLOWED_UPSTREAMS = new Map([
  ["UN World Population Prospects", {
    upstream: "UN WPP",
    licence: "CC BY 3.0 IGO",
    metadataTitle: "World Population Prospects",
    publisher: "United Nations",
    title: "World Population Prospects",
    url: "https://population.un.org/wpp/downloads",
    attribution: "UN, World Population Prospects (2024), zpracování Our World in Data",
  }],
  ["Human Mortality Database", {
    upstream: "HMD",
    licence: "CC BY 4.0",
    metadataTitle: "Human Mortality Database",
    publisher: "Human Mortality Database",
    title: "Human Mortality Database",
    url: "https://www.mortality.org/",
    attribution: "Human Mortality Database, zpracování Our World in Data",
  }],
  ["Gapminder v7", {
    upstream: "Gapminder",
    licence: "CC BY 4.0",
    metadataTitle: "Child mortality rate under age five",
    publisher: "Gapminder",
    title: "Child mortality rate under age five v7",
    url: "https://www.gapminder.org/data/documentation/gd005/",
    attribution: "Gapminder, Child Mortality Rate under age five v7, zpracování Our World in Data",
  }],
]);

function download(url, destination) {
  execFileSync("curl", ["--http1.1", "-fsSL", url, "-o", destination], {
    stdio: "inherit",
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  const [header, ...values] = rows;
  return values.map((cells) =>
    Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])));
}

function assertMetadataAllows(sourceName, upstream, origins) {
  const origin = origins.find((candidate) => candidate.title === upstream.metadataTitle);
  const recorded = origin?.license?.name;
  if (!recorded) {
    throw new Error(`V metadatech OWID chybí licence upstreamu ${sourceName}.`);
  }
  if (!recorded.startsWith(upstream.licence)) {
    throw new Error(
      `Licence upstreamu ${sourceName} se změnila: očekáváno ${upstream.licence}, metadata uvádějí ${recorded}.`,
    );
  }
}

const tempDir = await mkdtemp(join(tmpdir(), "tehdejsi-vitals-"));

try {
  const records = [];
  const provenance = [];
  const dropped = new Map();

  for (const series of SERIES) {
    const csvPath = join(tempDir, `${series.slug}.csv`);
    const chartMetadataPath = join(tempDir, `${series.slug}.metadata.json`);
    const fullMetadataPath = join(tempDir, `${series.slug}.full-metadata.json`);
    const sourceMapPath = join(tempDir, `${series.slug}.sources.csv`);
    const base = `https://ourworldindata.org/grapher/${series.slug}`;
    download(`${base}.csv?v=1&csvType=full&useColumnShortNames=false`, csvPath);
    download(`${base}.metadata.json?v=1&csvType=full&useColumnShortNames=false`, chartMetadataPath);
    const chartMetadata = JSON.parse(await readFile(chartMetadataPath, "utf8"));
    const column = chartMetadata.columns?.[series.valueColumn]
      ?? Object.values(chartMetadata.columns ?? {})[0];
    if (!column?.fullMetadata) {
      throw new Error(`${series.slug}: metadata neobsahují odkaz fullMetadata.`);
    }
    download(column.fullMetadata, fullMetadataPath);
    download(series.sourceMap, sourceMapPath);

    const fullMetadata = JSON.parse(await readFile(fullMetadataPath, "utf8"));
    const sourceRows = parseCsv(await readFile(sourceMapPath, "utf8"));
    const sourceByPoint = new Map(sourceRows.map((row) => [
      `${row.country}|${row.year}`,
      row.source,
    ]));
    const rows = parseCsv(await readFile(csvPath, "utf8"));

    for (const row of rows) {
      const country = SUPPORTED.get(row.Code);
      const year = Number(row.Year);
      if (!country || year < YEAR_FROM || year > YEAR_TO) continue;
      if (country === "ua" && year < 1950) continue;
      const sourceName = sourceByPoint.get(`${row.Entity}|${row.Year}`);
      const upstream = ALLOWED_UPSTREAMS.get(sourceName);
      if (!upstream) {
        const label = sourceName || "neuvedený upstream";
        dropped.set(label, (dropped.get(label) ?? 0) + 1);
        continue;
      }
      assertMetadataAllows(sourceName, upstream, fullMetadata.origins ?? []);
      const value = Number(row[series.valueColumn]);
      if (!Number.isFinite(value)) continue;
      const record = {
        country,
        series: series.id,
        year,
        value: Math.round(value * 100) / 100,
        upstream: upstream.upstream,
        licence: upstream.licence,
      };
      records.push(record);
      provenance.push({
        key: recordKey("vitalsBackfill", record),
        title: upstream.title,
        publisher: upstream.publisher,
        url: upstream.url,
        accessed: ACCESSED,
        dateAccessed: ACCESSED,
        licence: upstream.licence,
        attribution: upstream.attribution,
      });
    }
  }

  records.sort((a, b) =>
    a.country.localeCompare(b.country) ||
    a.year - b.year ||
    a.series.localeCompare(b.series));
  provenance.sort((a, b) => a.key.localeCompare(b.key));

  await mkdir(VITALS_DIR, { recursive: true });
  await mkdir(new URL("provenance/", DATA_DIR), { recursive: true });
  for (const country of ["cz", "ua"]) {
    const countryRecords = records.filter((record) => record.country === country);
    await writeFile(
      new URL(`${country}.json`, VITALS_DIR),
      `${JSON.stringify(countryRecords, null, 2)}\n`,
    );
  }
  await writeFile(
    PROVENANCE_URL,
    `${JSON.stringify({ records: provenance }, null, 2)}\n`,
  );

  for (const [source, count] of [...dropped].sort()) {
    console.warn(`Přeskočeno ${count} bodů: upstream „${source}“ není v allowlistu P1.`);
  }
  console.log(`Vitals backfill: zapsáno ${records.length} bodů CZ/UA (${YEAR_FROM}–${YEAR_TO}).`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

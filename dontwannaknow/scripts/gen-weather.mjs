import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const START_DATE = "1940-01-01";
const laggedToday = new Date();
laggedToday.setUTCDate(laggedToday.getUTCDate() - 5);
const END_DATE = laggedToday.toISOString().slice(0, 10);
const CONCURRENCY = Math.max(1, Number(process.env.WEATHER_CONCURRENCY ?? 1));
const BATCH_SIZE = Math.max(1, Number(process.env.WEATHER_BATCH_SIZE ?? 2));
const RESUME = process.argv.includes("--resume");
const DAILY_FIELDS = [
  "temperature_2m_min",
  "temperature_2m_max",
  "precipitation_sum",
  "snowfall_sum",
];
const sourceData = new URL("../src/data/public/", import.meta.url);
const outputRoot = new URL("../public/data/weather/", import.meta.url);
const allCities = JSON.parse(await readFile(new URL("cities.json", sourceData), "utf8"));
const coordinates = JSON.parse(await readFile(new URL("cityCoords.json", sourceData), "utf8"));
const shardTotal = Math.max(1, Number(process.env.WEATHER_SHARD_TOTAL ?? 1));
const shardIndex = Number(process.env.WEATHER_SHARD_INDEX ?? 0);
if (!Number.isInteger(shardIndex) || shardIndex < 0 || shardIndex >= shardTotal) {
  throw new Error(`Neplatný WEATHER_SHARD_INDEX ${shardIndex} pro ${shardTotal} shardů.`);
}
const cities = allCities.filter((_, index) => index % shardTotal === shardIndex);

const integerTenths = (value) => value == null ? null : Math.round(Number(value) * 10);
const average = (values) => {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
};

function percentile(value, previous, direction) {
  const valid = previous.filter(Number.isFinite);
  if (!Number.isFinite(value) || !valid.length) return null;
  const count = valid.filter((candidate) =>
    direction === "cold" ? candidate >= value : candidate <= value).length;
  return Math.round((count / valid.length) * 100);
}

function groupDaily(daily) {
  const years = new Map();
  for (let index = 0; index < daily.time.length; index += 1) {
    const date = daily.time[index];
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const record = years.get(year) ?? {
      dates: [],
      months: [],
      minimum: [],
      maximum: [],
      precipitation: [],
      snowfall: [],
    };
    record.dates.push(date);
    record.months.push(month);
    record.minimum.push(daily.temperature_2m_min[index]);
    record.maximum.push(daily.temperature_2m_max[index]);
    record.precipitation.push(daily.precipitation_sum[index]);
    record.snowfall.push(daily.snowfall_sum[index]);
    years.set(year, record);
  }
  return years;
}

function summarize(year, record, previousSummaries) {
  const dailyMean = record.minimum.map((minimum, index) =>
    Number.isFinite(minimum) && Number.isFinite(record.maximum[index])
      ? (minimum + record.maximum[index]) / 2
      : null);
  const winter = average(dailyMean.filter((_, index) => [1, 2, 12].includes(record.months[index])));
  const summer = average(dailyMean.filter((_, index) => [6, 7, 8].includes(record.months[index])));
  const reference = previousSummaries.slice(-25);
  const complete = record.dates[0] === `${year}-01-01` &&
    record.dates.at(-1) === `${year}-12-31`;
  return {
    y: year,
    c: complete,
    wi: winter == null ? null : Math.round(winter * 10),
    su: summer == null ? null : Math.round(summer * 10),
    sd: record.snowfall.filter((value) => Number(value) >= 0.1).length,
    hd: record.maximum.filter((value) => Number(value) >= 30).length,
    wd: record.precipitation.filter((value) => Number(value) >= 10).length,
    cp: complete ? percentile(winter, reference.map((item) => item.winter), "cold") : null,
    hp: complete ? percentile(summer, reference.map((item) => item.summer), "hot") : null,
    n: reference.length,
    winter,
    summer,
  };
}

async function fetchArchive(batch, attempt = 1) {
  const label = batch.map((city) => city.slug).join(",");
  const cityCoordinates = batch.map((city) => coordinates[city.slug] ?? []);
  for (const [index, [latitude, longitude]] of cityCoordinates.entries()) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error(`${batch[index].slug}: chybí souřadnice.`);
    }
  }
  const query = new URLSearchParams({
    latitude: cityCoordinates.map(([latitude]) => latitude).join(","),
    longitude: cityCoordinates.map(([, longitude]) => longitude).join(","),
    start_date: START_DATE,
    end_date: END_DATE,
    daily: DAILY_FIELDS.join(","),
    timezone: batch.map((city) =>
      city.country === "UA" ? "Europe/Kyiv" : "Europe/Prague").join(","),
    models: "era5",
  });
  const url = `https://archive-api.open-meteo.com/v1/archive?${query}`;
  let response;
  try {
    response = await fetch(url, {
      headers: { "user-agent": "TehdejsiSvetDataBuilder/1.0 (+https://github.com/lukaskourilcz/dontwannaknow)" },
    });
  } catch (error) {
    if (attempt < 9) {
      const seconds = Math.min(45, 8 * attempt);
      console.warn(`${label}: ${error.message}, další pokus za ${seconds} s`);
      await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
      return fetchArchive(batch, attempt + 1);
    }
    throw error;
  }
  if (!response.ok) {
    if (attempt < 9 && [429, 500, 502, 503, 504].includes(response.status)) {
      const retryHeader = Number(response.headers.get("retry-after"));
      const seconds = Number.isFinite(retryHeader) && retryHeader > 0
        ? retryHeader
        : Math.min(45, 8 * attempt);
      console.warn(`${label}: HTTP ${response.status}, další pokus za ${seconds} s`);
      await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
      return fetchArchive(batch, attempt + 1);
    }
    throw new Error(`${label}: Open-Meteo HTTP ${response.status}`);
  }
  const responsePayload = await response.json();
  const payloads = Array.isArray(responsePayload) ? responsePayload : [responsePayload];
  if (
    payloads.length !== batch.length ||
    payloads.some((payload) => !payload.daily?.time?.length)
  ) {
    throw new Error(`${label}: neúplná denní řada.`);
  }
  return { payloads, url };
}

async function existingCity(city) {
  const cityDirectory = new URL(`${city.slug}/`, outputRoot);
  const existing = await readFile(new URL("summary.json", cityDirectory), "utf8")
    .then(JSON.parse)
    .catch(() => null);
  if (existing?.range?.[0] === START_DATE && existing?.range?.[1] === END_DATE) {
    return { slug: city.slug, years: existing.years?.length ?? 0, skipped: true };
  }
  return null;
}

async function generateCity(city, payload) {
  const cityDirectory = new URL(`${city.slug}/`, outputRoot);
  const years = groupDaily(payload.daily);
  await rm(cityDirectory, { recursive: true, force: true });
  await mkdir(cityDirectory, { recursive: true });
  const summaries = [];
  const summaryInputs = [];
  for (const [year, record] of [...years.entries()].sort(([first], [second]) => first - second)) {
    const summary = summarize(year, record, summaryInputs);
    summaryInputs.push({ winter: summary.winter, summer: summary.summer });
    summaries.push({
      y: summary.y,
      c: summary.c,
      wi: summary.wi,
      su: summary.su,
      sd: summary.sd,
      hd: summary.hd,
      wd: summary.wd,
      cp: summary.cp,
      hp: summary.hp,
      n: summary.n,
    });
    const packed = {
      v: 1,
      from: record.dates[0],
      t0: record.minimum.map(integerTenths),
      t1: record.maximum.map(integerTenths),
      p: record.precipitation.map(integerTenths),
      s: record.snowfall.map(integerTenths),
    };
    await writeFile(new URL(`${year}.json`, cityDirectory), JSON.stringify(packed));
  }
  await writeFile(new URL("summary.json", cityDirectory), JSON.stringify({
    v: 1,
    source: "ERA5 via Open-Meteo",
    sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
    licence: "CC BY 4.0",
    licenceUrl: "https://open-meteo.com/en/licence",
    generatedAt: new Date().toISOString().slice(0, 10),
    range: [START_DATE, END_DATE],
    years: summaries,
  }));
  return { slug: city.slug, years: years.size };
}

await mkdir(outputRoot, { recursive: true });
const completed = [];
const failures = [];
const pending = [];
for (const city of cities) {
  const existing = RESUME ? await existingCity(city) : null;
  if (existing) {
    completed.push(existing);
    console.log(`[${completed.length}/${cities.length}] ${city.slug}: použit existující výstup`);
  } else {
    pending.push(city);
  }
}
const queue = [];
for (let index = 0; index < pending.length; index += BATCH_SIZE) {
  queue.push(pending.slice(index, index + BATCH_SIZE));
}
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) {
    const batch = queue.shift();
    try {
      const { payloads } = await fetchArchive(batch);
      for (const [index, city] of batch.entries()) {
        const result = await generateCity(city, payloads[index]);
        completed.push(result);
        console.log(`[${completed.length + failures.length}/${cities.length}] ${result.slug}: ${result.years} ročních souborů`);
      }
    } catch (error) {
      failures.push(...batch.map((city) => ({ slug: city.slug, message: error.message })));
      console.error(`[${completed.length + failures.length}/${cities.length}] ${batch.map((city) => city.slug).join(",")}: ${error.message}`);
    }
  }
});
await Promise.all(workers);

if (failures.length) {
  throw new Error(
    `Počasí se nepodařilo připravit pro ${failures.map((failure) => failure.slug).join(", ")}. ` +
    "Po obnovení limitu spusťte npm run data:weather -- --resume.",
  );
}

await writeFile(new URL("manifest.json", outputRoot), `${JSON.stringify({
  version: 1,
  generatedAt: new Date().toISOString().slice(0, 10),
  source: "Open-Meteo Historical Weather API",
  sourceUrl: "https://open-meteo.com/en/docs/historical-weather-api",
  model: "ERA5",
  resolution: "0.25° (~25 km)",
  licence: "CC BY 4.0",
  licenceUrl: "https://open-meteo.com/en/licence",
  attribution: "Weather data by Open-Meteo.com; underlying reanalysis Copernicus C3S ERA5.",
  scoring: {
    status: "exempt",
    reason: "Denní řady a sezonní agregace jsou měření modelu, nikoli redakční záznamy; skórují se jen weatherTemplates.",
  },
  range: [START_DATE, END_DATE],
  cities: completed.sort((a, b) => a.slug.localeCompare(b.slug)),
}, null, 2)}\n`);
console.log(`Počasí připraveno: ${completed.length} měst, ${completed.reduce((sum, city) => sum + city.years, 0)} ročních řezů.`);

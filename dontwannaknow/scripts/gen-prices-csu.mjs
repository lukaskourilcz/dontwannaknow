import { mkdir, writeFile } from "node:fs/promises";

const DATASTAT_PRICES =
  "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/CEN0101DT01?format=CSV&kodZvlast=true";
const DATASTAT_WAGES =
  "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/MZDRT1?format=CSV&kodZvlast=true";
const DATASTAT_DOCS =
  "https://csu.gov.cz/zakladni-informace-pro-pouziti-api-datastatu";
const CZ_HISTORICAL_WAGES =
  "https://statistikaamy.csu.gov.cz/od-roku-2000-se-prumerna-mzda-temer-zdvojnasobila";
const UA_YEARBOOK =
  "https://www.ukrstat.gov.ua/druk/publicat/kat_u/2019/zb/11/zb_yearbook_2018.pdf";
const ACCESSED = new Date().toISOString().slice(0, 10);

const output = new URL("../src/data/pricesWages/", import.meta.url);
const provenanceOutput = new URL("../src/data/provenance/pricesWages.json", import.meta.url);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === "\"") {
      if (quoted && text[index + 1] === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...values] = rows;
  return values.map((value) => Object.fromEntries(header.map((key, index) => [key, value[index]])));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "TehdejsiSvetDataBuilder/1.0 (+https://github.com/lukaskourilcz/dontwannaknow)" },
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

function roundMoney(value) {
  return Math.round(value).toLocaleString("cs-CZ");
}

function periodAverage(rows, year, itemCode) {
  const values = rows
    .filter((row) => row.CasM?.startsWith(`${year}-`) && row.CENREP3 === itemCode)
    .map((row) => Number(row.Hodnota))
    .filter(Number.isFinite);
  if (values.length < 10) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const curatedCz = [
  {
    id: "cz-1955-prumerna-mzda",
    country: "cz",
    yearFrom: 1953,
    yearTo: 1957,
    kind: "wage",
    sentence: "V polovině padesátých let činila průměrná měsíční mzda v Československu zhruba 1 190 Kčs.",
    values: { wage: 1192, currency: "Kčs", referenceYear: 1955 },
    note: "Referenční hodnota je z roku 1955, tedy po měnové reformě z 1. června 1953; předreformní částky s ní nelze přímo porovnávat.",
  },
  {
    id: "cz-1970-prumerna-mzda",
    country: "cz",
    yearFrom: 1968,
    yearTo: 1972,
    kind: "wage",
    sentence: "Kolem roku 1970 činila průměrná měsíční mzda v Československu zhruba 1 920 Kčs.",
    values: { wage: 1915, currency: "Kčs", referenceYear: 1970 },
  },
  {
    id: "cz-1989-prumerna-mzda",
    country: "cz",
    yearFrom: 1987,
    yearTo: 1991,
    kind: "wage",
    sentence: "Na konci osmdesátých let činila průměrná měsíční mzda v Československu zhruba 3 170 Kčs.",
    values: { wage: 3170, currency: "Kčs", referenceYear: 1989 },
  },
  {
    id: "cz-1999-prumerna-mzda",
    country: "cz",
    yearFrom: 1997,
    yearTo: 1999,
    kind: "wage",
    sentence: "Na konci devadesátých let činila průměrná hrubá měsíční mzda v Česku zhruba 12 670 korun.",
    values: { wage: 12666, currency: "Kč", referenceYear: 1999 },
  },
];

const curatedUaValues = [
  [1950, 62.7],
  [1955, 68.8],
  [1965, 80.15],
  [1975, 122.33],
  [1985, 167.81],
  [1991, 479.7],
];
const curatedUa = curatedUaValues.map(([year, wage]) => ({
  id: `ua-${year}-prumerna-mzda`,
  country: "ua",
  yearFrom: year,
  yearTo: year,
  kind: "wage",
  sentence: `V roce ${year} činila na území dnešní Ukrajiny průměrná měsíční mzda zhruba ${roundMoney(wage)} sovětských rublů, které ukrajinská ročenka uvádí jako karbovance.`,
  values: { wage, currency: "sovětský rubl (karbovanec)", referenceYear: year },
  note: "Nominální údaj nelze bez zohlednění měnových reforem přímo porovnávat s jinými obdobími.",
}));
curatedUa.push({
  id: "ua-1995-prumerna-mzda",
  country: "ua",
  yearFrom: 1995,
  yearTo: 1995,
  kind: "wage",
  sentence: "V roce 1995 uvádí ukrajinská statistická ročenka průměrnou měsíční mzdu zhruba 73 hřiven po přepočtu do měnové jednotky zavedené při reformě v roce 1996.",
  values: { wage: 73, currency: "hřivna (statistický přepočet)", referenceYear: 1995 },
  note: "Ročenka publikuje rok 1995 zpětně v hřivnách; nejde o tvrzení, že hřivnové bankovky byly v oběhu už v roce 1995.",
});

const [priceCsv, wageCsv] = await Promise.all([
  fetchText(DATASTAT_PRICES),
  fetchText(DATASTAT_WAGES),
]);
const priceRows = parseCsv(priceCsv);
const wageRows = parseCsv(wageCsv);
const wageByYear = new Map(
  wageRows
    .filter((row) => row.IndicatorType === "5958P" && row.Uz0 === "CZ")
    .map((row) => [Number(row.CasR), Number(row.Hodnota)])
    .filter(([year, wage]) => Number.isInteger(year) && Number.isFinite(wage)),
);

const generatedCz = [];
for (const year of [2000, 2005, 2010, 2015, 2020, 2025]) {
  const wage = wageByYear.get(year);
  if (!wage) continue;
  generatedCz.push({
    id: `cz-${year}-prumerna-mzda`,
    country: "cz",
    yearFrom: year,
    yearTo: year,
    kind: "wage",
    sentence: `V roce ${year} činila průměrná hrubá měsíční mzda v Česku zhruba ${roundMoney(wage)} korun.`,
    values: { wage: Math.round(wage), currency: "Kč", referenceYear: year },
  });
  const bread = periodAverage(priceRows, year, "0111201");
  if (bread === undefined) continue;
  const workMinutes = (bread / wage) * 21.74 * 8 * 60;
  generatedCz.push({
    id: `cz-${year}-chleb-mzda`,
    country: "cz",
    yearFrom: year,
    yearTo: year,
    kind: "ratio",
    sentence: `V roce ${year} stál kilogram konzumního kmínového chleba v průměru kolem ${roundMoney(bread)} korun; při tehdejší průměrné hrubé mzdě to odpovídalo přibližně ${Math.max(1, Math.round(workMinutes))} minutám práce.`,
    values: {
      item: "konzumní kmínový chléb, 1 kg",
      price: Number(bread.toFixed(2)),
      wage: Math.round(wage),
      currency: "Kč",
      workMinutes: Math.max(1, Math.round(workMinutes)),
      referenceYear: year,
    },
    note: "Cena je průměrem dostupných měsíčních hodnot ČSÚ; pracovní čas je orientační přepočet z průměrné hrubé mzdy při 21,74 pracovních dnech po osmi hodinách.",
  });
}

const cz = [...curatedCz, ...generatedCz].sort((a, b) => a.yearFrom - b.yearFrom || a.id.localeCompare(b.id));
const ua = curatedUa.sort((a, b) => a.yearFrom - b.yearFrom);

const sourceFor = (record) => {
  if (record.country === "ua") {
    return {
      key: record.id,
      title: "Statistický ročník Ukrajiny 2018, tabulky 3.24–3.25",
      publisher: "Státní statistická služba Ukrajiny",
      url: UA_YEARBOOK,
      accessed: ACCESSED,
      dateAccessed: ACCESSED,
      licence: "CC BY 4.0",
      attribution: "Zdroj: Státní statistická služba Ukrajiny; vlastní česká formulace.",
    };
  }
  const generated = record.yearFrom >= 2000;
  const isRatio = record.kind === "ratio";
  return {
    key: record.id,
    title: generated
      ? isRatio
        ? "DataStat: průměrná cena chleba a průměrná mzda"
        : "DataStat: průměrná hrubá měsíční mzda"
      : "Od roku 2000 se průměrná mzda téměř zdvojnásobila",
    publisher: "Český statistický úřad",
    url: generated ? (isRatio ? DATASTAT_PRICES : DATASTAT_WAGES) : CZ_HISTORICAL_WAGES,
    ...(isRatio ? { relatedUrls: [DATASTAT_WAGES, DATASTAT_DOCS] } : {}),
    accessed: ACCESSED,
    dateAccessed: ACCESSED,
    licence: "CC BY 4.0",
    attribution: "Zdroj: Český statistický úřad; vlastní česká formulace a případný orientační přepočet.",
  };
};

await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(new URL("cz.json", output), `${JSON.stringify(cz, null, 2)}\n`),
  writeFile(new URL("ua.json", output), `${JSON.stringify(ua, null, 2)}\n`),
  writeFile(provenanceOutput, `${JSON.stringify({
    generatedAt: ACCESSED,
    records: [...cz, ...ua].map(sourceFor),
  }, null, 2)}\n`),
]);

console.log(`Ceny a mzdy připraveny: CZ ${cz.length}, UA ${ua.length}.`);

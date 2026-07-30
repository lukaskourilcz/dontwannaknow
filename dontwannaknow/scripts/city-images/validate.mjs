import { normalizeLicence } from "./licence.mjs";

export const CITY_IMAGE_MAX_BYTES = 80 * 1024;
export const CITY_IMAGE_LONGEST_EDGE = 1_000;

const CZECH_DIACRITICS = /[áčďéěíňóřšťúůýž]/i;
const DIFFICULT_IMAGE_WORDS =
  /\b(?:war|wartime|ruins?|bomb(?:ed|ing)?|funerals?|deport(?:ation|ed)?|válk\w*|trosk\w*|bombard\w*|pohřeb\w*|deport\w*|holodomor|голодомор|війна|война|руїн\w*|похорон\w*)\b/i;

export function isPlausiblyCzech(value) {
  const text = String(value ?? "").trim();
  return text.length >= 24 && CZECH_DIACRITICS.test(text);
}

export function validateCityImageRecord(record, options = {}) {
  const errors = [];
  const label = options.label ?? String(record?.id ?? "cityImages");
  const requiredStrings = [
    "id",
    "city",
    "yearApprox",
    "file",
    "alt",
    "caption",
    "licence",
    "attribution",
    "sourceUrl",
    "licenceUrl",
  ];
  for (const key of requiredStrings) {
    if (!String(record?.[key] ?? "").trim()) errors.push(`${label}: chybí ${key}.`);
  }
  if (!Number.isInteger(record?.decade) || record.decade % 10 !== 0) {
    errors.push(`${label}: decade musí být začátek desetiletí.`);
  }
  if (!["year", "decade"].includes(record?.dateCertainty)) {
    errors.push(`${label}: neplatná dateCertainty.`);
  }
  if (!normalizeLicence(record?.licence)) {
    errors.push(`${label}: nepovolená licence „${record?.licence ?? ""}“.`);
  }
  if (!isPlausiblyCzech(record?.alt)) errors.push(`${label}: alt není věrohodně český.`);
  if (!isPlausiblyCzech(record?.caption)) errors.push(`${label}: caption není věrohodně český.`);
  if (DIFFICULT_IMAGE_WORDS.test(`${record?.alt ?? ""} ${record?.caption ?? ""}`)) {
    errors.push(`${label}: obtížný obrazový motiv nesmí vstoupit do veřejného pásu.`);
  }
  if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/i.test(String(record?.sourceUrl ?? ""))) {
    errors.push(`${label}: sourceUrl musí vést na stránku souboru Wikimedia Commons.`);
  }
  if (!/^https:\/\//i.test(String(record?.licenceUrl ?? ""))) {
    errors.push(`${label}: licenceUrl musí být HTTPS.`);
  }
  if (!Number.isInteger(record?.width) || !Number.isInteger(record?.height)
    || record.width < 1 || record.height < 1) {
    errors.push(`${label}: chybí platné rozměry derivátu.`);
  } else if (Math.max(record.width, record.height) > CITY_IMAGE_LONGEST_EDGE) {
    errors.push(`${label}: nejdelší hrana překračuje ${CITY_IMAGE_LONGEST_EDGE} px.`);
  }
  if (options.fileSize !== undefined
    && (!Number.isInteger(options.fileSize) || options.fileSize < 1 || options.fileSize > CITY_IMAGE_MAX_BYTES)) {
    errors.push(`${label}: derivát překračuje ${CITY_IMAGE_MAX_BYTES} B nebo je prázdný.`);
  }
  return errors;
}

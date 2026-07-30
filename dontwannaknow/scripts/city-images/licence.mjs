const OPEN_LICENCE_PATTERNS = [
  { pattern: /^(?:public domain|pdm)(?:\s*1\.0)?$/i, canonical: "PDM 1.0" },
  { pattern: /^cc0(?:\s*1\.0)?$/i, canonical: "CC0 1.0" },
  { pattern: /^cc by\s+([1-4]\.0)(?:\s+[a-z]{2})?$/i, canonical: (match) => `CC BY ${match[1]}` },
  { pattern: /^cc by-sa\s+([1-4]\.0)(?:\s+[a-z]{2})?$/i, canonical: (match) => `CC BY-SA ${match[1]}` },
];

export function normalizeLicence(value) {
  const licence = String(value ?? "").replace(/\s+/g, " ").trim();
  for (const entry of OPEN_LICENCE_PATTERNS) {
    const match = licence.match(entry.pattern);
    if (!match) continue;
    return typeof entry.canonical === "function" ? entry.canonical(match) : entry.canonical;
  }
  return null;
}

export function assertAllowedLicence(value, label = "soubor") {
  const normalized = normalizeLicence(value);
  if (!normalized) {
    throw new Error(
      `${label}: licence „${String(value ?? "").trim() || "neuvedena"}“ není v povoleném seznamu `
      + "(PDM, CC0, CC BY, CC BY-SA).",
    );
  }
  return normalized;
}

export function licenceRequiresAttribution(licence) {
  return /^CC BY(?:-SA)?\s/i.test(String(licence));
}

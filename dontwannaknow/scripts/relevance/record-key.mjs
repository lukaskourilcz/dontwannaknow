// Identita záznamu pro sidecary (skóre relevance, provenience zdrojů).
// Klíčuje se obsahem, ne indexem — přežije přeuspořádání souboru. Stejný tvar
// používá gen-batches.mjs, merge-results.mjs i build-public-data.mjs.

export function recordKey(dataset, record) {
  switch (dataset) {
    case "cityFacts":
      return `${record.city}|${record.year}|${record.text}`;
    case "countryEvents":
      return `${record.country}|${record.year}|${record.text}`;
    case "countryDecades":
      return `${record.country}|${record.decadeStart}|${record.bucket}|${record.text}`;
    case "famousPeople":
      return `${record.country}|${record.decadeStart}|${record.name}`;
    case "inventions":
      return `${record.year}|${record.name}`;
    case "leaders":
      return record.id;
    case "vitalsBackfill":
      return `${record.country}|${record.series}|${record.year}|${record.value}|${record.upstream}`;
    case "pricesWages":
      return record.id;
    default:
      throw new Error(`Neznámá datová sada: ${dataset}`);
  }
}

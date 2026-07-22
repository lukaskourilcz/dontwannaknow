import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTENT_SOURCES,
  CATEGORY_LABELS,
  sourceByKey,
  searchHaystack,
  type Category,
  type ContentRecord,
  type ContentSource,
} from "./contentSources";
import { loadContent, saveContent, isLiveApiAvailable } from "./contentApi";

type Loaded = Record<string, ContentRecord[]>;
type Draft = { sourceKey: string; index: number; values: Record<string, string> };
type AuditIssue = "missing-metadata" | "missing-source" | "review-required" | "share-unsafe" | "unsupported-country";

const PAGE_SIZE = 60;
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const CHAPTERS = ["birth", "early-childhood", "everyday-day", "teenage-years", "different-from-today", "changing-world", "generation-context", "life-numbers"];
const TONES = ["warm", "playful", "neutral", "serious"];
const SENSITIVITIES = ["none", "mild", "difficult"];

function tagStateClass(tag: string): string {
  if (["verified", "none", "true"].includes(tag)) return "state-verified";
  if (["review-needed", "review-required", "difficult", "serious"].includes(tag)) return "state-review";
  if (["false", "share-unsafe"].includes(tag)) return "state-blocked";
  return "";
}

const yearOf = (r: ContentRecord): number =>
  Number(r.year ?? r.declaredExtinctYear ?? r.decadeStart ?? r.born ?? 0) || 0;

function recordToValues(source: ContentSource, r: ContentRecord): Record<string, string> {
  return Object.fromEntries(
    source.fields.map((f) => {
      const v = r[f.key];
      if (f.kind === "list") return [f.key, Array.isArray(v) ? v.join("\n") : v == null ? "" : String(v)];
      if (f.kind === "json") return [f.key, v == null ? "" : JSON.stringify(v, null, 2)];
      return [f.key, v == null ? "" : String(v)];
    }),
  );
}

// Throws (with a readable message) when a JSON field can't be parsed, so the
// caller can surface it instead of saving a broken record.
function valuesToRecord(source: ContentSource, values: Record<string, string>): ContentRecord {
  const out: ContentRecord = {};
  for (const f of source.fields) {
    const raw = (values[f.key] ?? "").trim();
    if (f.optional && raw === "") continue;
    if (f.kind === "number") out[f.key] = Number(raw) || 0;
    else if (f.kind === "boolean") out[f.key] = raw === "true";
    else if (f.kind === "list") out[f.key] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    else if (f.kind === "json") {
      try {
        out[f.key] = JSON.parse(raw);
      } catch {
        throw new Error(`Pole „${f.label}“ neobsahuje platný JSON.`);
      }
    } else out[f.key] = raw;
  }
  return out;
}

export default function ContentEditor() {
  const [data, setData] = useState<Loaded | null>(null);
  const [live, setLive] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sourceKey, setSourceKey] = useState<string | "all">("all");
  const [country, setCountry] = useState<"all" | "CZ" | "UA" | "unsupported">("all");
  const [city, setCity] = useState("all");
  const [chapter, setChapter] = useState("all");
  const [tone, setTone] = useState("all");
  const [sensitivity, setSensitivity] = useState("all");
  const [issue, setIssue] = useState<AuditIssue | "all">("all");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLive(await isLiveApiAvailable());
      const entries = await Promise.all(
        CONTENT_SOURCES.map(async (s) => [s.key, (await loadContent<ContentRecord[]>(s.key)) ?? []] as const),
      );
      if (alive) setData(Object.fromEntries(entries));
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Reset pagination whenever the filters change.
  useEffect(() => setShown(PAGE_SIZE), [query, category, sourceKey, country, city, chapter, tone, sensitivity, issue]);

  const visibleSources = useMemo(
    () => CONTENT_SOURCES.filter((s) => category === "all" || s.category === category),
    [category],
  );

  const cityOptions = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(
      Object.values(data).flatMap((records) =>
        records.map((record) => String(record.city ?? "").trim()).filter(Boolean),
      ),
    )).sort((a, b) => a.localeCompare(b, "cs"));
  }, [data]);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const sourceManifest = new Map(
      (data.dataSources ?? []).map((record) => [String(record.dataset ?? ""), record]),
    );
    const out: { source: ContentSource; index: number; record: ContentRecord }[] = [];
    for (const source of CONTENT_SOURCES) {
      if (category !== "all" && source.category !== category) continue;
      if (sourceKey !== "all" && source.key !== sourceKey) continue;
      const list = data[source.key] ?? [];
      list.forEach((record, index) => {
        if (q && !searchHaystack(source, record).includes(q)) return;
        const recordCountry = String(record.country ?? "").toUpperCase();
        if (country === "CZ" || country === "UA") {
          if (recordCountry !== country) return;
        } else if (country === "unsupported" && (!recordCountry || ["CZ", "UA"].includes(recordCountry))) return;
        if (city !== "all" && String(record.city ?? "") !== city) return;
        if (chapter !== "all" && String(record.chapter ?? "") !== chapter) return;
        if (tone !== "all" && String(record.tone ?? "") !== tone) return;
        if (sensitivity !== "all" && String(record.sensitivity ?? "") !== sensitivity) return;
        if (issue !== "all") {
          const sourceInfo = sourceManifest.get(source.key);
          const missingMetadata = source.key === "editorialRules" &&
            ["tone", "sensitivity", "shareSafe", "sourceConfidence", "reviewRequired"]
              .some((key) => record[key] === undefined || record[key] === "");
          const matchesIssue = {
            "missing-metadata": missingMetadata,
            "missing-source": !sourceInfo || !String(sourceInfo.source ?? "").trim(),
            "review-required": record.reviewRequired === true || record.sourceConfidence === "review-needed" || sourceInfo?.confidence === "review-needed",
            "share-unsafe": record.shareSafe === false,
            "unsupported-country": Boolean(recordCountry) && !["CZ", "UA"].includes(recordCountry),
          }[issue];
          if (!matchesIssue) return;
        }
        out.push({ source, index, record });
      });
    }
    return out.sort((a, b) => yearOf(b.record) - yearOf(a.record));
  }, [data, query, category, sourceKey, country, city, chapter, tone, sensitivity, issue]);

  const counts = useMemo(() => {
    if (!data) return { total: 0 };
    return { total: Object.values(data).reduce((n, list) => n + list.length, 0) };
  }, [data]);

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of CONTENT_SOURCES) {
      m[s.category] = (m[s.category] ?? 0) + (data?.[s.key]?.length ?? 0);
    }
    return m;
  }, [data]);

  async function persist(key: string, list: ContentRecord[]) {
    setData((prev) => ({ ...(prev ?? {}), [key]: list }));
    const res = await saveContent(key, list);
    if (!res.persisted && res.ok) setStatus(`Stažen soubor ${key}.json — přesuňte jej do src/data, aby se změna zachovala.`);
    else if (res.ok) setStatus(`Uloženo do ${key}.json`);
    else setStatus(`Uložení selhalo: ${res.error ?? "neznámá chyba"}`);
  }

  function openAdd() {
    const key = sourceKey !== "all" ? sourceKey : visibleSources[0]?.key ?? CONTENT_SOURCES[0].key;
    const source = sourceByKey(key)!;
    setDraft({ sourceKey: key, index: -1, values: recordToValues(source, source.blank()) });
  }

  function openEdit(source: ContentSource, index: number, record: ContentRecord) {
    setDraft({ sourceKey: source.key, index, values: recordToValues(source, record) });
  }

  async function saveDraft() {
    if (!draft || !data) return;
    const source = sourceByKey(draft.sourceKey)!;
    let record: ContentRecord;
    try {
      record = valuesToRecord(source, draft.values);
    } catch (e) {
      setStatus(`Nelze uložit: ${e instanceof Error ? e.message : String(e)}`);
      return;
    }
    const list = [...(data[draft.sourceKey] ?? [])];
    if (draft.index === -1) list.unshift(record);
    else list[draft.index] = record;
    setDraft(null);
    await persist(draft.sourceKey, list);
  }

  async function deleteRow(source: ContentSource, index: number) {
    if (!data) return;
    const record = data[source.key]?.[index];
    if (!record) return;
    if (!confirm(`Odstranit tento záznam ze sady ${source.label}?\n\n${source.summary(record)}`)) return;
    const list = (data[source.key] ?? []).filter((_, i) => i !== index);
    await persist(source.key, list);
  }

  if (!data) return <p className="dev-loading">Načítáme obsah…</p>;

  return (
    <div className="dev-content">
      <div className="dev-page-head">
        <h2>Knihovna obsahu</h2>
        <p>
          Vyhledávejte, filtrujte a upravujte podklady zpráv. Změny se
          při vývoji ukládají přímo do datových souborů JSON.
        </p>
      </div>

      {!live && (
        <p className="dev-banner">
          Režim jen pro čtení: vývojové rozhraní není dostupné. Uložení místo zápisu
          stáhne soubor JSON. Pro přímé úpravy spusťte <code>npm run dev</code>.
        </p>
      )}

      <div className="dev-toolbar">
        <input
          className="dev-search"
          type="search"
          aria-label="Prohledat obsah"
          placeholder="Prohledat všechen obsah…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="dev-select"
          aria-label="Filtrovat podle datové sady"
          value={sourceKey}
          onChange={(e) => setSourceKey(e.target.value)}
        >
          <option value="all">Všechny datové sady</option>
          {visibleSources.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="dev-btn dev-btn-primary" type="button" onClick={openAdd}>
          + Přidat záznam
        </button>
      </div>

      <div className="dev-audit-filters" aria-label="Redakční auditní filtry">
        <select className="dev-select" aria-label="Filtrovat podle země" value={country} onChange={(event) => setCountry(event.target.value as typeof country)}>
          <option value="all">Všechny země</option>
          <option value="CZ">Česko</option>
          <option value="UA">Ukrajina</option>
          <option value="unsupported">Nepodporované země</option>
        </select>
        <select className="dev-select" aria-label="Filtrovat podle města" value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="all">Všechna města</option>
          {cityOptions.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className="dev-select" aria-label="Filtrovat podle kapitoly" value={chapter} onChange={(event) => setChapter(event.target.value)}>
          <option value="all">Všechny kapitoly</option>
          {CHAPTERS.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className="dev-select" aria-label="Filtrovat podle tónu" value={tone} onChange={(event) => setTone(event.target.value)}>
          <option value="all">Všechny tóny</option>
          {TONES.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className="dev-select" aria-label="Filtrovat podle citlivosti" value={sensitivity} onChange={(event) => setSensitivity(event.target.value)}>
          <option value="all">Všechny citlivosti</option>
          {SENSITIVITIES.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className="dev-select" aria-label="Filtrovat podle auditního problému" value={issue} onChange={(event) => setIssue(event.target.value as typeof issue)}>
          <option value="all">Všechny auditní stavy</option>
          <option value="missing-metadata">Chybějící metadata</option>
          <option value="missing-source">Chybějící zdroj</option>
          <option value="review-required">Vyžaduje kontrolu</option>
          <option value="share-unsafe">Nevhodné ke sdílení</option>
          <option value="unsupported-country">Nepodporovaná země</option>
        </select>
      </div>

      <div className="dev-chips">
        <button
          type="button"
          className={`dev-chip${category === "all" ? " active" : ""}`}
          onClick={() => {
            setCategory("all");
            setSourceKey("all");
          }}
        >
          Vše <span className="count">{counts.total.toLocaleString("cs-CZ")}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`dev-chip${category === c ? " active" : ""}`}
            onClick={() => {
              setCategory(c);
              setSourceKey("all");
            }}
          >
            {CATEGORY_LABELS[c]}{" "}
            <span className="count">{(categoryCounts[c] ?? 0).toLocaleString("cs-CZ")}</span>
          </button>
        ))}
      </div>

      <p className="dev-meta" aria-live="polite">
        {rows.length.toLocaleString("cs-CZ")} z {counts.total.toLocaleString("cs-CZ")} záznamů
        {status && <span className="dev-status"> · {status}</span>}
      </p>

      {rows.length === 0 ? (
        <div className="dev-empty">
          <strong>Žádné odpovídající záznamy</strong>
          Zkuste jiný výraz nebo kategorii.
        </div>
      ) : (
        <>
          <ul className="dev-list">
            {rows.slice(0, shown).map(({ source, index, record }) => (
              <li key={`${source.key}-${index}`} className="dev-row">
                <div className="dev-row-main">
                  <span className="dev-row-summary">{source.summary(record)}</span>
                  <span className="dev-row-tags">
                    <span className="dev-tag dev-tag-cat">{CATEGORY_LABELS[source.category]}</span>
                    <span className="dev-tag">{source.label}</span>
                    {source.tags(record).map((t) => (
                      <span key={t} className={`dev-tag dev-tag-soft ${tagStateClass(t)}`.trim()}>
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="dev-row-actions">
                  <button className="dev-btn" type="button" onClick={() => openEdit(source, index, record)}>
                    Upravit
                  </button>
                  <button className="dev-btn dev-btn-danger" type="button" onClick={() => deleteRow(source, index)}>
                    Odstranit
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {shown < rows.length && (
            <button className="dev-btn dev-loadmore" type="button" onClick={() => setShown((n) => n + PAGE_SIZE)}>
              Načíst další ({(rows.length - shown).toLocaleString("cs-CZ")} skryto)
            </button>
          )}
        </>
      )}

      {draft && (
        <RecordModal
          draft={draft}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={saveDraft}
        />
      )}
    </div>
  );
}

function RecordModal({
  draft,
  onChange,
  onCancel,
  onSave,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const source = sourceByKey(draft.sourceKey)!;
  const isNew = draft.index === -1;
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const set = (key: string, value: string) =>
    onChange({ ...draft, values: { ...draft.values, [key]: value } });

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusableSelector = "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return (
    <div className="dev-modal-backdrop" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="dev-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="record-modal-title">
          {isNew ? "Přidat" : "Upravit"} · {source.label}
        </h3>
        {isNew && (
          <label className="dev-field dev-field-full">
            <span>Datová sada</span>
            <select
              className="dev-input"
              value={draft.sourceKey}
              onChange={(e) => {
                const next = sourceByKey(e.target.value)!;
                onChange({ sourceKey: next.key, index: -1, values: recordToValues(next, next.blank()) });
              }}
            >
              {CONTENT_SOURCES.map((s) => (
                <option key={s.key} value={s.key}>
                  {CATEGORY_LABELS[s.category]} · {s.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="dev-fields">
          {source.fields.map((f) => (
            <label key={f.key} className={`dev-field${f.full ? " dev-field-full" : ""}`}>
              <span>{f.label}</span>
              {f.kind === "textarea" || f.kind === "list" || f.kind === "json" ? (
                <textarea
                  className={`dev-input${f.kind === "json" ? " dev-input-mono" : ""}`}
                  rows={f.kind === "json" ? 6 : f.kind === "list" ? 4 : 3}
                  value={draft.values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : f.kind === "select" || f.kind === "boolean" ? (
                <select
                  className="dev-input"
                  value={draft.values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                >
                  {f.optional && <option value="">— bez přepsání —</option>}
                  {(f.kind === "boolean" ? ["true", "false"] : f.options)?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="dev-input"
                  type={f.kind === "number" ? "number" : "text"}
                  value={draft.values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <div className="dev-modal-actions">
          <button className="dev-btn" type="button" onClick={onCancel}>
            Zrušit
          </button>
          <button className="dev-btn dev-btn-primary" type="button" onClick={onSave}>
            Uložit
          </button>
        </div>
      </div>
    </div>
  );
}

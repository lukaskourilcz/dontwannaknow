import { useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 60;
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

const yearOf = (r: ContentRecord): number =>
  Number(r.year ?? r.declaredExtinctYear ?? 0) || 0;

function recordToValues(source: ContentSource, r: ContentRecord): Record<string, string> {
  return Object.fromEntries(
    source.fields.map((f) => [f.key, r[f.key] == null ? "" : String(r[f.key])]),
  );
}

function valuesToRecord(source: ContentSource, values: Record<string, string>): ContentRecord {
  const out: ContentRecord = {};
  for (const f of source.fields) {
    const raw = (values[f.key] ?? "").trim();
    if (f.optional && raw === "") continue;
    out[f.key] = f.kind === "number" ? Number(raw) || 0 : raw;
  }
  return out;
}

export default function ContentEditor() {
  const [data, setData] = useState<Loaded | null>(null);
  const [live, setLive] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sourceKey, setSourceKey] = useState<string | "all">("all");
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
  useEffect(() => setShown(PAGE_SIZE), [query, category, sourceKey]);

  const visibleSources = useMemo(
    () => CONTENT_SOURCES.filter((s) => category === "all" || s.category === category),
    [category],
  );

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const out: { source: ContentSource; index: number; record: ContentRecord }[] = [];
    for (const source of CONTENT_SOURCES) {
      if (category !== "all" && source.category !== category) continue;
      if (sourceKey !== "all" && source.key !== sourceKey) continue;
      const list = data[source.key] ?? [];
      list.forEach((record, index) => {
        if (q && !searchHaystack(source, record).includes(q)) return;
        out.push({ source, index, record });
      });
    }
    return out.sort((a, b) => yearOf(b.record) - yearOf(a.record));
  }, [data, query, category, sourceKey]);

  const counts = useMemo(() => {
    if (!data) return { total: 0 };
    return { total: Object.values(data).reduce((n, list) => n + list.length, 0) };
  }, [data]);

  async function persist(key: string, list: ContentRecord[]) {
    setData((prev) => ({ ...(prev ?? {}), [key]: list }));
    const res = await saveContent(key, list);
    if (!res.persisted && res.ok) setStatus(`Downloaded ${key}.json — drop it into src/data to keep the change.`);
    else if (res.ok) setStatus(`Saved ${key}.json`);
    else setStatus(`Save failed: ${res.error ?? "unknown error"}`);
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
    const record = valuesToRecord(source, draft.values);
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
    if (!confirm(`Delete this ${source.label} entry?\n\n${source.summary(record)}`)) return;
    const list = (data[source.key] ?? []).filter((_, i) => i !== index);
    await persist(source.key, list);
  }

  if (!data) return <p className="dev-loading">Loading content…</p>;

  return (
    <div className="dev-content">
      {!live && (
        <p className="dev-banner">
          Read-only: the dev server API isn't reachable. Saves will download a JSON
          file instead of writing it. Run <code>npm run dev</code> to edit in place.
        </p>
      )}

      <div className="dev-toolbar">
        <input
          className="dev-search"
          type="search"
          placeholder="Search all content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="dev-select"
          value={sourceKey}
          onChange={(e) => setSourceKey(e.target.value)}
        >
          <option value="all">All datasets</option>
          {visibleSources.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="dev-btn dev-btn-primary" type="button" onClick={openAdd}>
          + Add entry
        </button>
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
          All
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
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <p className="dev-meta">
        {rows.length.toLocaleString()} of {counts.total.toLocaleString()} entries
        {status && <span className="dev-status"> · {status}</span>}
      </p>

      <ul className="dev-list">
        {rows.slice(0, shown).map(({ source, index, record }) => (
          <li key={`${source.key}-${index}`} className="dev-row">
            <div className="dev-row-main">
              <span className="dev-row-summary">{source.summary(record)}</span>
              <span className="dev-row-tags">
                <span className="dev-tag dev-tag-cat">{CATEGORY_LABELS[source.category]}</span>
                <span className="dev-tag">{source.label}</span>
                {source.tags(record).map((t) => (
                  <span key={t} className="dev-tag dev-tag-soft">
                    {t}
                  </span>
                ))}
              </span>
            </div>
            <div className="dev-row-actions">
              <button className="dev-btn" type="button" onClick={() => openEdit(source, index, record)}>
                Edit
              </button>
              <button className="dev-btn dev-btn-danger" type="button" onClick={() => deleteRow(source, index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {shown < rows.length && (
        <button className="dev-btn dev-loadmore" type="button" onClick={() => setShown((n) => n + PAGE_SIZE)}>
          Load more ({(rows.length - shown).toLocaleString()} hidden)
        </button>
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
  const set = (key: string, value: string) =>
    onChange({ ...draft, values: { ...draft.values, [key]: value } });

  return (
    <div className="dev-modal-backdrop" onClick={onCancel}>
      <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {isNew ? "Add" : "Edit"} · {source.label}
        </h3>
        {isNew && (
          <label className="dev-field dev-field-full">
            <span>Dataset</span>
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
              {f.kind === "textarea" ? (
                <textarea
                  className="dev-input"
                  rows={3}
                  value={draft.values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : f.kind === "select" ? (
                <select
                  className="dev-input"
                  value={draft.values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                >
                  {f.options?.map((o) => (
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
            Cancel
          </button>
          <button className="dev-btn dev-btn-primary" type="button" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

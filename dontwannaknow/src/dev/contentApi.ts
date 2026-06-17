// Client for the dev-server content API defined in vite.config.ts.
//
// During `npm run dev` these endpoints read and write the JSON files on disk,
// so edits in /dev land straight in the repo's data files. In a production
// build the endpoints don't exist, so reads fall back to the JSON bundled at
// build time and saves fall back to downloading the file for the user to commit.

// Lazy importers for the build-time fallback (not loaded unless the dev API is
// unreachable, so editing files in dev doesn't reload this page).
const bundledData = import.meta.glob("../data/*.json");
const bundledConfig = import.meta.glob("../config/*.json");

function bundledImporter(key: string): (() => Promise<unknown>) | undefined {
  if (key === "settings") return bundledConfig["../config/gameSettings.json"];
  return bundledData[`../data/${key}.json`];
}

// A real dev-API response carries this header; a production SPA rewrite won't.
const isDevResponse = (res: Response) => res.ok && res.headers.get("x-dwk-dev") === "1";

/** True when the dev-server write API answered — i.e. saves persist to disk. */
export async function isLiveApiAvailable(): Promise<boolean> {
  try {
    return isDevResponse(await fetch("/__content/settings", { method: "GET" }));
  } catch {
    return false;
  }
}

export async function loadContent<T = unknown>(key: string): Promise<T> {
  try {
    const res = await fetch(`/__content/${key}`);
    if (isDevResponse(res)) return (await res.json()) as T;
  } catch {
    /* dev server not available — use the bundled copy */
  }
  const importer = bundledImporter(key);
  if (importer) {
    const mod = (await importer()) as { default: T };
    return mod.default;
  }
  return null as T;
}

export type SaveResult = { ok: boolean; persisted: boolean; error?: string };

export async function saveContent(key: string, data: unknown): Promise<SaveResult> {
  const body = JSON.stringify(data, null, 2);
  try {
    const res = await fetch(`/__content/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (isDevResponse(res)) return { ok: true, persisted: true };
  } catch {
    /* fall through to the download fallback */
  }
  // No dev server: hand the file to the user to drop into the repo.
  downloadJson(`${key}.json`, body);
  return { ok: true, persisted: false };
}

function downloadJson(filename: string, text: string) {
  const blob = new Blob([text + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

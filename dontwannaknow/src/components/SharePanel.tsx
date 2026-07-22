import { useId, useState } from "react";
import type { PersonReport } from "../lib/facts";
import type { Person } from "../lib/person";
import { buildShareUrl } from "../lib/share";
import {
  downloadBlob,
  generateShareImage,
  shareImageFilename,
  type ShareImageFormat,
  type ShareImageKind,
} from "../lib/shareImage";
import { useCopied } from "../lib/useCopied";
import { settings } from "../config/settings";
import { displayName } from "../lib/person";

const KIND_LABELS: Record<ShareImageKind, string> = {
  cover: "Obálka",
  fact: "Dobová souvislost",
  sky: "Obloha v den narození",
  culture: "Kultura dospívání",
  contrast: "Co bylo tehdy jiné",
  comparison: "Dva tehdejší světy",
};

export default function SharePanel({
  reports,
  people,
  skySvg,
  onPdf,
}: {
  reports: PersonReport[];
  people: Person[];
  skySvg: SVGSVGElement | null;
  onPdf: () => Promise<void>;
}) {
  const statusId = useId();
  const [includeNames, setIncludeNames] = useState(false);
  const [format, setFormat] = useState<ShareImageFormat>("landscape");
  const [kind, setKind] = useState<ShareImageKind>(skySvg ? "sky" : "fact");
  const [busy, setBusy] = useState<"image" | "pdf" | null>(null);
  const [status, setStatus] = useState("");
  const { copied, copy } = useCopied(settings.shareCopiedResetMs);

  const url = () => buildShareUrl(people, { includeNames });

  const copyLink = async () => {
    const ok = await copy(url());
    setStatus(ok ? "Odkaz je připravený ke sdílení." : "Odkaz najdete v adresním řádku.");
    if (!ok) window.history.replaceState(null, "", new URL(url()).hash);
  };

  const share = async () => {
    const shareData = {
      title: reports.length > 1 ? "Dva tehdejší světy" : "Tehdejší svět",
      text: "Poznejte svět, ve kterém vyrůstali vaši blízcí.",
      url: url(),
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  const createImage = async () => {
    setBusy("image");
    setStatus("");
    try {
      const blob = await generateShareImage({ reports, includeNames, format, kind, skySvg });
      downloadBlob(blob, shareImageFilename(kind, format));
      setStatus("Obrázek je uložený ve vašem zařízení.");
    } catch {
      setStatus("Obrázek se nepodařilo vytvořit. Zkuste jiný formát.");
    } finally {
      setBusy(null);
    }
  };

  const createPdf = async () => {
    setBusy("pdf");
    setStatus("");
    try {
      await onPdf();
      setStatus("Památeční vydání je připravené.");
    } catch {
      setStatus("Památeční vydání se nepodařilo vytvořit. Zkuste to prosím znovu.");
    } finally {
      setBusy(null);
    }
  };

  const previewTitle = reports.length > 1 && kind === "comparison"
    ? "Dva tehdejší světy"
    : includeNames
      ? displayName(reports[0].person)
      : `Rok ${reports[0].person.birthYear}`;

  return (
    <section className="share-panel" aria-labelledby="share-title" aria-busy={busy !== null} aria-describedby={status ? statusId : undefined}>
      <div className="share-panel-copy">
        <p className="chapter-eyebrow">Uchovat a sdílet</p>
        <h2 id="share-title">Pošlete tento svět dál</h2>
        <p>Odkaz obsahuje jen údaje nutné k obnovení zprávy. Jméno je ve výchozím nastavení vynecháno.</p>
      </div>

      <div className="share-layout">
        <div className="share-controls">
          <div className={`privacy-control${includeNames ? " includes-name" : ""}`}>
            <label className="privacy-toggle">
              <input
                type="checkbox"
                checked={includeNames}
                onChange={(event) => setIncludeNames(event.target.checked)}
              />
              <span><strong>{includeNames ? "Jméno bude zahrnuto" : "Jméno zůstává skryté"}</strong><small>Zahrnout jméno do odkazu a obrázku jen po výslovném zapnutí.</small></span>
            </label>
            {includeNames && <p>Jméno bude součástí sdíleného souboru i odkazu.</p>}
          </div>

          <div className="share-actions">
            <button type="button" className="primary" disabled={busy !== null} onClick={() => void share()}>Sdílet odkaz</button>
            <button type="button" className="secondary" disabled={busy !== null} onClick={() => void copyLink()}>
              {copied ? "Odkaz zkopírován" : "Kopírovat odkaz"}
            </button>
          </div>

          <fieldset className="share-builder">
            <legend>Vytvořit obrázek</legend>
            <label>
              <span>Obsah obrázku</span>
              <select value={kind} onChange={(event) => setKind(event.target.value as ShareImageKind)}>
                <option value="cover">Obálka</option>
                <option value="fact">Dobová souvislost</option>
                {skySvg && <option value="sky">Obloha v den narození</option>}
                <option value="culture">Kultura dospívání</option>
                <option value="contrast">Co bylo tehdy jiné</option>
                {reports.length > 1 && <option value="comparison">Dva tehdejší světy</option>}
              </select>
            </label>
            <label>
              <span>Formát</span>
              <select value={format} onChange={(event) => setFormat(event.target.value as ShareImageFormat)}>
                <option value="landscape">Na šířku · 1200 × 630</option>
                <option value="feed">Příspěvek · 1080 × 1350</option>
                <option value="story">Příběh · 1080 × 1920</option>
              </select>
            </label>
            <button type="button" className="secondary" disabled={busy !== null} onClick={() => void createImage()}>
              {busy === "image" ? "Vytváříme obrázek…" : "Stáhnout obrázek"}
            </button>
          </fieldset>
        </div>

        <figure className={`share-preview preview-${format}`} aria-label={`Náhled sdíleného obrázku: ${KIND_LABELS[kind]}`}>
          <div>
            <span>Tehdejší svět</span>
            <strong>{previewTitle}</strong>
            <small>{reports[0].historicalContext.primaryLabel}</small>
            <i aria-hidden="true" />
            <em>{KIND_LABELS[kind]}</em>
          </div>
          <figcaption>Náhled rozvržení · skutečný text se zalomí při vytvoření obrázku.</figcaption>
        </figure>
      </div>

      <button type="button" className="keepsake-action" disabled={busy !== null} onClick={() => void createPdf()}>
        <span>Vytvořit památeční vydání</span>
        <small>PDF vznikne přímo ve vašem prohlížeči</small>
      </button>
      {status && <p className="share-status" id={statusId} role="status" aria-live="polite">{status}</p>}
    </section>
  );
}

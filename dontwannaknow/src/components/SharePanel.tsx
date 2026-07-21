import { useState } from "react";
import type { PersonReport } from "../lib/facts";
import type { Person } from "../lib/person";
import { buildShareUrl } from "../lib/share";
import {
  downloadBlob,
  generateShareImage,
  type ShareImageFormat,
  type ShareImageKind,
} from "../lib/shareImage";
import { useCopied } from "../lib/useCopied";
import { settings } from "../config/settings";

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
      downloadBlob(blob, `tehdejsi-svet-${format}.png`);
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

  return (
    <section className="share-panel" aria-labelledby="share-title">
      <div className="share-panel-copy">
        <p className="chapter-eyebrow">Uchovat a sdílet</p>
        <h2 id="share-title">Pošlete tento svět dál</h2>
        <p>Odkaz obsahuje jen údaje nutné k obnovení zprávy. Jméno je ve výchozím nastavení vynecháno.</p>
      </div>

      <label className="privacy-toggle">
        <input
          type="checkbox"
          checked={includeNames}
          onChange={(event) => setIncludeNames(event.target.checked)}
        />
        <span>Zahrnout jméno do sdíleného odkazu a obrázku</span>
      </label>

      <div className="share-actions">
        <button type="button" className="primary" onClick={() => void share()}>Sdílet</button>
        <button type="button" className="secondary" onClick={() => void copyLink()}>
          {copied ? "Odkaz zkopírován" : "Kopírovat odkaz"}
        </button>
      </div>

      <div className="share-builder">
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
          {busy === "image" ? "Vytváříme obrázek…" : "Vytvořit obrázek"}
        </button>
      </div>

      <button type="button" className="keepsake-action" disabled={busy !== null} onClick={() => void createPdf()}>
        <span>Vytvořit památeční vydání</span>
        <small>PDF vznikne přímo ve vašem prohlížeči</small>
      </button>
      {status && <p className="share-status" role="status">{status}</p>}
    </section>
  );
}

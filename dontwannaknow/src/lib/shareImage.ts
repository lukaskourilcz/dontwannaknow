import type { PersonReport } from "./facts";
import type { ReportItem } from "./report";
import { reportTitle } from "./person";

export type ShareImageFormat = "landscape" | "feed" | "story";
export type ShareImageKind = "cover" | "fact" | "sky" | "culture" | "contrast" | "comparison";

const SIZES: Record<ShareImageFormat, [number, number]> = {
  landscape: [1200, 630],
  feed: [1080, 1350],
  story: [1080, 1920],
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.replace(/\*\*/g, "").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  maxLines: number,
): number {
  lines.slice(0, maxLines).forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

async function drawSky(
  context: CanvasRenderingContext2D,
  svg: SVGSVGElement | null,
  x: number,
  y: number,
  size: number,
) {
  if (!svg) return;
  const markup = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });
    context.drawImage(image, x, y, size, size);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function shareItemForKind(
  report: PersonReport,
  kind: ShareImageKind,
): Pick<ReportItem, "text" | "metadata"> | null {
  const chapterId = kind === "culture"
    ? "teenage-years"
    : kind === "contrast"
      ? "different-from-today"
      : null;
  if (!chapterId) return kind === "fact" ? report.shareItem : null;
  return report.chapters
    .find((chapter) => chapter.id === chapterId)
    ?.items.find((item) => item.metadata.shareSafe)
    ?? report.facts.find((fact) => fact.metadata.chapter === chapterId && fact.metadata.shareSafe)
    ?? null;
}

export async function generateShareImage(options: {
  reports: PersonReport[];
  includeNames: boolean;
  kind: ShareImageKind;
  format: ShareImageFormat;
  skySvg?: SVGSVGElement | null;
}): Promise<Blob> {
  const { reports, includeNames, kind, format, skySvg = null } = options;
  const [width, height] = SIZES[format];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Prohlížeč nepodporuje kreslení sdílecího obrázku.");

  const report = reports[0];
  const margin = Math.round(width * 0.075);
  const contentWidth = width - margin * 2;
  context.fillStyle = "#f7f2e8";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#1e3f39";
  context.fillRect(0, 0, width, Math.round(height * 0.055));
  context.fillStyle = "#d9684f";
  context.fillRect(margin, Math.round(height * 0.13), 72, 8);

  context.fillStyle = "#1e3f39";
  context.font = `600 ${Math.round(width * 0.025)}px Instrument Sans, sans-serif`;
  context.fillText("TEHDEJŠÍ SVĚT", margin, Math.round(height * 0.11));

  const title =
    kind === "comparison" && reports.length > 1
      ? "Dva tehdejší světy"
      : includeNames
        ? reportTitle(report.person)
        : `Tehdejší svět roku ${report.person.birthYear}`;
  context.font = `600 ${Math.round(width * (format === "story" ? 0.075 : 0.064))}px Fraunces, serif`;
  const titleY = Math.round(height * 0.24);
  let cursor = drawLines(context, wrapText(context, title, contentWidth), margin, titleY, Math.round(width * 0.078), 3);

  context.fillStyle = "#52645f";
  context.font = `500 ${Math.round(width * 0.024)}px Instrument Sans, sans-serif`;
  const place = report.historicalContext.primaryLabel;
  cursor = drawLines(context, wrapText(context, place, contentWidth), margin, cursor + 20, Math.round(width * 0.034), 2);

  if (kind === "sky" && skySvg) {
    const size = Math.min(Math.round(width * 0.42), Math.round(height * 0.43));
    await drawSky(context, skySvg, width - margin - size, height - margin - size, size);
    context.fillStyle = "#1e3f39";
    context.font = `500 ${Math.round(width * 0.032)}px Newsreader, serif`;
    drawLines(context, ["Obloha v den narození"], margin, height - margin - size + 40, 44, 2);
  } else if (kind === "comparison" && reports.length > 1) {
    const comparisonLines = reports.slice(0, 2).flatMap((current) => [
      `${includeNames ? reportTitle(current.person) : `Rok ${current.person.birthYear}`}`,
      current.historicalContext.primaryLabel,
    ]);
    context.fillStyle = "#171917";
    context.font = `450 ${Math.round(width * (format === "story" ? 0.045 : 0.035))}px Newsreader, serif`;
    drawLines(
      context,
      comparisonLines,
      margin,
      Math.max(cursor + 65, Math.round(height * 0.43)),
      Math.round(width * 0.05),
      6,
    );
  } else {
    const selected = shareItemForKind(report, kind);
    const fact = kind === "cover"
      ? `Dětství a dospívání v místě ${report.historicalContext.primaryLabel}: každodennost, kultura a proměny od roku ${report.person.birthYear}.`
      : selected?.text ?? "Každodenní život, kultura a události od dětství do dospělosti.";
    context.fillStyle = "#171917";
    context.font = `450 ${Math.round(width * (format === "story" ? 0.047 : 0.037))}px Newsreader, serif`;
    drawLines(
      context,
      wrapText(context, fact, contentWidth),
      margin,
      Math.max(cursor + 65, Math.round(height * 0.48)),
      Math.round(width * 0.052),
      format === "story" ? 8 : 5,
    );
  }

  context.fillStyle = "#1e3f39";
  context.font = `500 ${Math.round(width * 0.021)}px Instrument Sans, sans-serif`;
  context.fillText("Poznejte svět, ve kterém vyrůstali vaši blízcí.", margin, height - margin);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Obrázek se nepodařilo vytvořit."))), "image/png"),
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

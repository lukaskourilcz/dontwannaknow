import type { PersonReport } from "./facts";
import type { ReportItem } from "./report";
import { reportTitle } from "./person";
import { BRAND_COLORS, BRAND_FONTS } from "./brand";

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
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines && visible.length) {
    visible[visible.length - 1] = `${visible[visible.length - 1].replace(/[.,;:]?$/, "")}…`;
  }
  visible.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function drawBrandMark(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const radius = size * 0.2;
  context.fillStyle = BRAND_COLORS.green;
  context.beginPath();
  context.roundRect(x, y, size, size, radius);
  context.fill();
  context.fillStyle = BRAND_COLORS.paper;
  context.fillRect(x + size * 0.23, y + size * 0.24, size * 0.54, size * 0.12);
  context.fillRect(x + size * 0.44, y + size * 0.24, size * 0.12, size * 0.52);
  context.strokeStyle = BRAND_COLORS.coral;
  context.lineWidth = Math.max(2, size * 0.055);
  context.beginPath();
  context.moveTo(x + size * 0.75, y + size * 0.65);
  context.lineTo(x + size * 0.75, y + size * 0.82);
  context.lineTo(x + size * 0.58, y + size * 0.82);
  context.stroke();
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

export function shareImageFilename(kind: ShareImageKind, format: ShareImageFormat): string {
  return `tehdejsi-svet-${kind}-${format}.png`;
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
  if ("fonts" in document) await document.fonts.ready;

  const report = reports[0];
  const margin = Math.round(width * 0.075);
  const contentWidth = width - margin * 2;
  context.fillStyle = BRAND_COLORS.paper;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = BRAND_COLORS.rule;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(width * 0.5, 0);
  context.lineTo(width * 0.5, height);
  context.moveTo(0, height * 0.5);
  context.lineTo(width, height * 0.5);
  context.stroke();
  context.fillStyle = BRAND_COLORS.green;
  context.fillRect(0, 0, width, Math.max(12, Math.round(height * 0.025)));
  context.fillStyle = BRAND_COLORS.coral;
  context.fillRect(margin, Math.round(height * 0.17), Math.round(width * 0.065), Math.max(6, Math.round(width * 0.006)));

  const markSize = Math.round(width * 0.045);
  drawBrandMark(context, margin, Math.round(height * 0.075), markSize);
  context.fillStyle = BRAND_COLORS.green;
  context.font = `650 ${Math.round(width * 0.023)}px ${BRAND_FONTS.display}`;
  context.fillText("Tehdejší svět", margin + markSize + Math.round(width * 0.015), Math.round(height * 0.075) + markSize * 0.68);

  const title =
    kind === "comparison" && reports.length > 1
      ? "Dva tehdejší světy"
      : includeNames
        ? reportTitle(report.person)
        : `Tehdejší svět roku ${report.person.birthYear}`;
  context.font = `560 ${Math.round(width * (format === "story" ? 0.075 : 0.064))}px ${BRAND_FONTS.display}`;
  const titleY = Math.round(height * 0.3);
  let cursor = drawLines(context, wrapText(context, title, contentWidth), margin, titleY, Math.round(width * 0.078), 3);

  context.fillStyle = BRAND_COLORS.muted;
  context.font = `520 ${Math.round(width * 0.024)}px ${BRAND_FONTS.interface}`;
  const place = report.historicalContext.primaryLabel;
  cursor = drawLines(context, wrapText(context, place, contentWidth), margin, cursor + 20, Math.round(width * 0.034), 2);

  if (kind === "sky" && skySvg) {
    const size = Math.min(Math.round(width * 0.42), Math.round(height * 0.43));
    await drawSky(context, skySvg, width - margin - size, height - margin - size, size);
    context.fillStyle = BRAND_COLORS.green;
    context.font = `500 ${Math.round(width * 0.032)}px ${BRAND_FONTS.editorial}`;
    drawLines(context, ["Obloha v den narození"], margin, height - margin - size + 40, 44, 2);
  } else if (kind === "comparison" && reports.length > 1) {
    const comparisonLines = reports.slice(0, 2).flatMap((current) => [
      `${includeNames ? reportTitle(current.person) : `Rok ${current.person.birthYear}`}`,
      current.historicalContext.primaryLabel,
    ]);
    context.fillStyle = BRAND_COLORS.ink;
    context.font = `450 ${Math.round(width * (format === "story" ? 0.045 : 0.035))}px ${BRAND_FONTS.editorial}`;
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
    context.fillStyle = BRAND_COLORS.ink;
    context.font = `450 ${Math.round(width * (format === "story" ? 0.047 : 0.037))}px ${BRAND_FONTS.editorial}`;
    drawLines(
      context,
      wrapText(context, fact, contentWidth),
      margin,
      Math.max(cursor + 65, Math.round(height * 0.48)),
      Math.round(width * 0.052),
      format === "story" ? 8 : 5,
    );
  }

  context.fillStyle = BRAND_COLORS.green;
  context.font = `520 ${Math.round(width * 0.021)}px ${BRAND_FONTS.interface}`;
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

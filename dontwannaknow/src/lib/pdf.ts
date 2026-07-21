import regularFontUrl from "@expo-google-fonts/newsreader/400Regular/Newsreader_400Regular.ttf?url";
import boldFontUrl from "@expo-google-fonts/newsreader/700Bold/Newsreader_700Bold.ttf?url";
import type jsPDFType from "jspdf";
import type { PersonReport } from "./facts";
import { reportTitle } from "./person";
import { lifeNumbers } from "./lifeNumbers";
import { birthDateUTC, daysSince } from "./datetime";

const PAGE_MARGIN = 48;
const LINE_HEIGHT = 14;
const PAGE_BOTTOM = 42;
const BODY_WIDTH_INSET = 12;

const COLORS = {
  ink: [29, 36, 32] as const,
  green: [30, 63, 57] as const,
  coral: [217, 104, 79] as const,
  muted: [100, 103, 94] as const,
  rule: [219, 211, 197] as const,
  paper: [247, 242, 232] as const,
};

async function loadJsPdf(): Promise<typeof jsPDFType> {
  const mod = await import("jspdf");
  return mod.default;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function registerFonts(doc: jsPDFType): Promise<void> {
  const [regular, bold] = await Promise.all([
    fetch(regularFontUrl).then((response) => response.arrayBuffer()),
    fetch(boldFontUrl).then((response) => response.arrayBuffer()),
  ]);
  doc.addFileToVFS("Newsreader-Regular.ttf", bytesToBase64(new Uint8Array(regular)));
  doc.addFileToVFS("Newsreader-Bold.ttf", bytesToBase64(new Uint8Array(bold)));
  doc.addFont("Newsreader-Regular.ttf", "Newsreader", "normal");
  doc.addFont("Newsreader-Bold.ttf", "Newsreader", "bold");
  doc.setFont("Newsreader", "normal");
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

async function svgToPng(
  svgEl: SVGSVGElement,
  pxWidth = 720,
  pxHeight = 720,
): Promise<string> {
  const xml = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([xml], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = pxWidth;
    canvas.height = pxHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Obrázek oblohy se nepodařilo připravit.");
    context.fillStyle = "#1e3f39";
    context.fillRect(0, 0, pxWidth, pxHeight);
    context.drawImage(image, 0, 0, pxWidth, pxHeight);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function paintPageBackground(doc: jsPDFType): void {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setFillColor(...COLORS.paper);
  doc.rect(0, 0, width, height, "F");
  doc.setFillColor(...COLORS.green);
  doc.rect(0, 0, width, 12, "F");
}

function addPage(doc: jsPDFType): number {
  doc.addPage();
  paintPageBackground(doc);
  return PAGE_MARGIN;
}

function ensureRoom(
  doc: jsPDFType,
  cursorY: number,
  neededHeight: number,
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  return cursorY + neededHeight > pageHeight - PAGE_BOTTOM
    ? addPage(doc)
    : cursorY;
}

function writeLines(
  doc: jsPDFType,
  lines: string[],
  cursorY: number,
  options: { indent?: number; lineHeight?: number } = {},
): number {
  let y = cursorY;
  const lineHeight = options.lineHeight ?? LINE_HEIGHT;
  const x = PAGE_MARGIN + (options.indent ?? 0);
  for (const line of lines) {
    y = ensureRoom(doc, y, lineHeight);
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function writeChapter(
  doc: jsPDFType,
  report: PersonReport,
  chapterIndex: number,
  cursorY: number,
): number {
  const chapter = report.chapters[chapterIndex];
  if (!chapter || chapter.id === "life-numbers") return cursorY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = pageWidth - 2 * PAGE_MARGIN;
  let y = ensureRoom(doc, cursorY, 72);

  doc.setFont("Newsreader", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.coral);
  doc.text(cleanText(chapter.eyebrow).toUpperCase(), PAGE_MARGIN, y);
  y += 17;

  doc.setFontSize(19);
  doc.setTextColor(...COLORS.green);
  const titleLines = doc.splitTextToSize(cleanText(chapter.title), textWidth) as string[];
  y = writeLines(doc, titleLines, y, { lineHeight: 21 });
  y += 2;

  if (chapter.introduction) {
    doc.setFont("Newsreader", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.muted);
    const introLines = doc.splitTextToSize(cleanText(chapter.introduction), textWidth) as string[];
    y = writeLines(doc, introLines, y);
    y += 8;
  }

  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.ink);
  for (const item of chapter.items) {
    const prefix = item.year ? `${item.year} - ` : "";
    const lines = doc.splitTextToSize(
      `• ${prefix}${cleanText(item.text)}`,
      textWidth - BODY_WIDTH_INSET,
    ) as string[];
    y = ensureRoom(doc, y, lines.length * LINE_HEIGHT + 7);
    y = writeLines(doc, lines, y, { indent: BODY_WIDTH_INSET });
    y += 5;
  }

  doc.setDrawColor(...COLORS.rule);
  doc.setLineWidth(0.7);
  y = ensureRoom(doc, y, 18);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  return y + 18;
}

function writeLifeNumbers(doc: jsPDFType, report: PersonReport, cursorY: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = pageWidth - 2 * PAGE_MARGIN;
  let y = ensureRoom(doc, cursorY, 80);
  const daysLived = daysSince(
    birthDateUTC(report.person.birthYear, report.person.birthMonth, report.person.birthDay),
  );

  doc.setFont("Newsreader", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.coral);
  doc.text("08 · DLOUHÝ POHLED", PAGE_MARGIN, y);
  y += 17;
  doc.setFontSize(19);
  doc.setTextColor(...COLORS.green);
  doc.text("Život v číslech", PAGE_MARGIN, y);
  y += 24;

  for (const item of lifeNumbers(daysLived)) {
    const value = item.value.toLocaleString("cs-CZ");
    const line = `${item.label}: ${value}${item.unit ? ` ${item.unit}` : ""}. ${item.detail ?? ""}`;
    doc.setFont("Newsreader", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLORS.ink);
    const lines = doc.splitTextToSize(cleanText(line), textWidth) as string[];
    y = ensureRoom(doc, y, lines.length * LINE_HEIGHT + 7);
    y = writeLines(doc, lines, y);
    y += 5;
  }
  return y;
}

function pdfBirthDate(report: PersonReport): string {
  const { birthDay, birthMonth, birthYear } = report.person;
  return birthDay && birthMonth
    ? `${birthDay}. ${birthMonth}. ${birthYear}`
    : String(birthYear);
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generatePdf(
  report: PersonReport,
  skySvg: SVGSVGElement | null,
): Promise<void> {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  await registerFonts(doc);
  doc.setProperties({
    title: reportTitle(report.person),
    subject: "Osobní obraz doby narození, dětství a dospívání",
    author: "Tehdejší svět",
    creator: "Tehdejší svět",
    keywords: "historie, rodina, vzpomínky, dobový portrét",
  });
  paintPageBackground(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  let cursorY = PAGE_MARGIN;
  doc.setFont("Newsreader", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.coral);
  doc.text("TEHDEJŠÍ SVĚT", PAGE_MARGIN, cursorY);
  cursorY += 30;

  doc.setFontSize(32);
  doc.setTextColor(...COLORS.green);
  const titleLines = doc.splitTextToSize(reportTitle(report.person), pageWidth - 2 * PAGE_MARGIN) as string[];
  cursorY = writeLines(doc, titleLines, cursorY, { lineHeight: 34 });
  cursorY += 6;

  doc.setFont("Newsreader", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.ink);
  const subtitle = `${pdfBirthDate(report)} · ${report.historicalContext.primaryLabel}`;
  cursorY = writeLines(
    doc,
    doc.splitTextToSize(cleanText(subtitle), pageWidth - 2 * PAGE_MARGIN) as string[],
    cursorY,
    { lineHeight: 16 },
  );
  cursorY += 16;

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  cursorY = writeLines(
    doc,
    doc.splitTextToSize(
      "Dobový portrét prostředí, nikoli osobní životopis. Vznikl soukromě ve vašem prohlížeči z kurátorovaných dat.",
      pageWidth - 2 * PAGE_MARGIN,
    ) as string[],
    cursorY,
  );
  cursorY += 14;

  if (skySvg) {
    try {
      const png = await svgToPng(skySvg);
      const imageSize = 218;
      cursorY = ensureRoom(doc, cursorY, imageSize + 38);
      doc.addImage(png, "PNG", (pageWidth - imageSize) / 2, cursorY, imageSize, imageSize);
      cursorY += imageSize + 13;
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      doc.text(
        `Obloha nad městem ${report.historicalContext.cityLabel} v den narození`,
        pageWidth / 2,
        cursorY,
        { align: "center" },
      );
      cursorY += 22;
    } catch (error) {
      console.warn("Oblohu se nepodařilo vložit do PDF:", error);
    }
  }

  doc.setDrawColor(...COLORS.rule);
  doc.line(PAGE_MARGIN, cursorY, pageWidth - PAGE_MARGIN, cursorY);
  cursorY += 20;

  for (let index = 0; index < report.chapters.length; index += 1) {
    cursorY = writeChapter(doc, report, index, cursorY);
  }
  cursorY = writeLifeNumbers(doc, report, cursorY);

  if (doc.getNumberOfPages() < 2) addPage(doc);

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont("Newsreader", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `Tehdejší svět · strana ${page} z ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" },
    );
  }

  const subject = slugify(report.person.label) || "dobovy-portret";
  doc.save(`tehdejsi-svet-${subject}-${report.person.birthYear}.pdf`);
}

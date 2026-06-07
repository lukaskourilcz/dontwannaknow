// Generate a multi-page PDF of one person's report, including the
// rendered sky chart (captured from the DOM). The PDF is guaranteed to
// be at least two pages — if the essay runs short, we pad with a
// fact-appendix pulled from the same data.

import type { PersonReport } from "./facts";
import type jsPDFType from "jspdf";

// Lazy-load the jsPDF + html2canvas stack only when the user actually
// clicks "Download PDF". Keeps the initial bundle small.
async function loadJsPdf(): Promise<typeof jsPDFType> {
  const mod = await import("jspdf");
  return mod.default;
}

const PAGE_MARGIN = 50;
const LINE_HEIGHT = 14;
const HEADING_LINE_HEIGHT = 18;

async function svgToPng(
  svgEl: SVGSVGElement,
  pxWidth = 640,
  pxHeight = 640,
): Promise<string> {
  // Serialize. The astronomy SVG uses gradients defined inline, which is fine.
  const xml = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([xml], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = (e) => reject(e);
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = pxWidth;
    canvas.height = pxHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas ctx");
    // Fill background dark so the round sky doesn't show paper underneath.
    ctx.fillStyle = "#0d1a3a";
    ctx.fillRect(0, 0, pxWidth, pxHeight);
    ctx.drawImage(img, 0, 0, pxWidth, pxHeight);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ensureRoom(
  doc: jsPDFType,
  cursorY: number,
  neededHeight: number,
  pageHeight: number,
): number {
  if (cursorY + neededHeight > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return cursorY;
}

function writeParagraph(
  doc: jsPDFType,
  heading: string,
  body: string,
  cursorY: number,
  pageWidth: number,
  pageHeight: number,
): number {
  let y = cursorY;
  const textWidth = pageWidth - 2 * PAGE_MARGIN;

  // Heading
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(180, 90, 50);
  const headingLines = doc.splitTextToSize(heading, textWidth) as string[];
  y = ensureRoom(doc, y, headingLines.length * HEADING_LINE_HEIGHT + 6, pageHeight);
  doc.text(headingLines, PAGE_MARGIN, y);
  y += headingLines.length * HEADING_LINE_HEIGHT + 4;

  // Body
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 27, 24);
  const bodyLines = doc.splitTextToSize(body, textWidth) as string[];
  for (const line of bodyLines) {
    y = ensureRoom(doc, y, LINE_HEIGHT, pageHeight);
    doc.text(line, PAGE_MARGIN, y);
    y += LINE_HEIGHT;
  }
  y += 10;
  return y;
}

export async function generatePdf(
  report: PersonReport,
  skySvg: SVGSVGElement | null,
): Promise<void> {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let cursorY = PAGE_MARGIN;

  // ── Eyebrow ────────────────────────────────────────────────────
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(140, 130, 110);
  doc.text(
    "Don't wanna know · but you should",
    pageWidth / 2,
    cursorY,
    { align: "center" },
  );
  cursorY += 18;

  // ── Title ──────────────────────────────────────────────────────
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(20, 18, 15);
  doc.text(report.person.label, pageWidth / 2, cursorY + 14, { align: "center" });
  cursorY += 36;

  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(110, 101, 90);
  const subtitle = `Born ${report.person.birthYear} in ${
    report.cityLabel
      ? report.cityLabel + ", " + report.countryLabel
      : report.countryLabel
  } · ${report.ageNow} years on this planet`;
  doc.text(subtitle, pageWidth / 2, cursorY, { align: "center" });
  cursorY += 24;

  // ── Decorative rule ────────────────────────────────────────────
  doc.setDrawColor(217, 205, 182);
  doc.setLineWidth(0.6);
  doc.line(PAGE_MARGIN, cursorY, pageWidth - PAGE_MARGIN, cursorY);
  cursorY += 18;

  // ── Sky image, if we have one ─────────────────────────────────
  if (skySvg) {
    try {
      const png = await svgToPng(skySvg, 720, 720);
      const imgSize = 220;
      const x = (pageWidth - imgSize) / 2;
      doc.addImage(png, "PNG", x, cursorY, imgSize, imgSize);
      cursorY += imgSize + 12;

      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(140, 130, 110);
      const skyCaption = `The sky over ${
        report.cityLabel ?? report.countryLabel
      } around 23:00 local time on the date of birth.`;
      const captionLines = doc.splitTextToSize(
        skyCaption,
        pageWidth - 2 * PAGE_MARGIN,
      ) as string[];
      doc.text(captionLines, pageWidth / 2, cursorY, { align: "center" });
      cursorY += captionLines.length * 12 + 14;
    } catch (err) {
      // Sky generation can fail in headless environments; we just skip it.
      console.warn("sky->PNG failed:", err);
    }
  }

  // ── Essay paragraphs ───────────────────────────────────────────
  for (const para of report.essay) {
    const body =
      para.items && para.items.length
        ? para.items.map((it) => `• ${it}`).join("\n")
        : para.text ?? "";
    cursorY = writeParagraph(doc, para.heading, body, cursorY, pageWidth, pageHeight);
  }

  // ── Guarantee at least two pages ───────────────────────────────
  // jsPDF's typed pages array is awkward; we use getNumberOfPages().
  let pageCount = doc.getNumberOfPages();
  if (pageCount < 2) {
    doc.addPage();
    cursorY = PAGE_MARGIN;
    pageCount = 2;
  }

  // If we still have lots of room on the last page, drop in an
  // appendix of additional fact-bullets so the report feels finished.
  const remainingRoom = pageHeight - PAGE_MARGIN - cursorY;
  if (remainingRoom > 200 && report.facts.length > 0) {
    cursorY = writeParagraph(
      doc,
      "Appendix · more from the same world",
      "Stray facts that didn't make the essay, drawn from the same dataset.",
      cursorY,
      pageWidth,
      pageHeight,
    );
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 27, 24);
    const used = new Set<string>(
      report.essay.map((p) =>
        (p.text ?? p.items?.join(" ") ?? "").toLowerCase(),
      ),
    );
    const extras = report.facts
      .map((f) => f.text)
      .filter((t) => {
        const k = t.toLowerCase();
        if (used.has(k)) return false;
        used.add(k);
        return true;
      })
      .slice(0, 30);
    for (const fact of extras) {
      const lines = doc.splitTextToSize(
        "• " + fact,
        pageWidth - 2 * PAGE_MARGIN,
      ) as string[];
      for (const line of lines) {
        cursorY = ensureRoom(doc, cursorY, LINE_HEIGHT, pageHeight);
        doc.text(line, PAGE_MARGIN, cursorY);
        cursorY += LINE_HEIGHT;
      }
      cursorY += 3;
    }
  }

  // ── Footer on every page ───────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 140, 120);
    doc.text(
      `${report.person.label} · ${report.person.birthYear} · page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 24,
      { align: "center" },
    );
  }

  const slug = report.person.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  doc.save(`${slug || "person"}-${report.person.birthYear}.pdf`);
}

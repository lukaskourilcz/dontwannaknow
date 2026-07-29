import { lazy, Suspense, useState, type ReactNode } from "react";
import type { PersonReport } from "../lib/facts";
import type { Person } from "../lib/person";
import { displayName, reportTitle } from "../lib/person";
import { uniqueReportItems, type ReportChapter, type ReportItem } from "../lib/report";
import { CITY_COORDS } from "../data/cityCoords";
import { artForBirthYear } from "../data/artByDecade";
import { birthDateUTC, daysSince, weeksSince } from "../lib/datetime";
import { czAgePhrase } from "../lib/czech";
import LifeGrid from "./LifeGrid";
import LeaderProfile from "./LeaderProfile";
import SharePanel from "./SharePanel";
import { COPY } from "../copy";

const WorldMap = lazy(() => import("./WorldMap"));
const SkyMap = lazy(() => import("./SkyMap"));
const LifeNumbers = lazy(() => import("./LifeNumbers"));
const ArtStrip = lazy(() => import("./ArtStrip"));

type Props = {
  reports: PersonReport[];
  people: Person[];
};

function richText(text: string): ReactNode {
  return text.split("**").map((part, index) =>
    index % 2 ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function birthDate(person: Person): string {
  if (person.birthDay && person.birthMonth) {
    return `${person.birthDay}. ${person.birthMonth}. ${person.birthYear}`;
  }
  return String(person.birthYear);
}

function chapterById(report: PersonReport, id: ReportChapter["id"]) {
  return report.chapters.find((chapter) => chapter.id === id);
}

function chapterLabel(chapter: ReportChapter): string {
  return chapter.eyebrow.replace(/^\d{2}\s*·\s*/, "");
}

function itemKind(item: ReportItem): string {
  if (item.metadata.sensitivity === "difficult") return "Citlivý historický kontext";
  if (item.category === "city") return "Místní souvislost";
  if (item.category === "local") return "Souvislost ze země";
  if (["media", "writers", "famous", "contemporaries"].includes(item.category)) return "Kultura";
  const labels: Partial<Record<ReportItem["category"], string>> = {
    daily: "Domácnost a rytmus dne",
    food: "Jídlo",
    money: "Ceny a mzdy",
    clothes: "Oblečení",
    government: "Veřejné dění",
    illness: "Zdraví generace",
    world: "Širší souvislost",
    beautiful: "Proměna",
    bizarre: "Tehdy a dnes",
    context: "Redakční poznámka",
  };
  return labels[item.category] ?? "Dobový detail";
}

function itemVariant(item: ReportItem): string {
  if (item.id.startsWith("fallback-")) return "missing";
  if (item.metadata.sensitivity === "difficult") return "difficult";
  if (item.category === "city") return "local";
  if (["media", "writers", "famous", "contemporaries"].includes(item.category)) return "culture";
  if (item.metadata.chapter === "different-from-today") return "contrast";
  if (item.metadata.featured) return "featured";
  return "standard";
}

/** Značka jistoty: čtenář pozná doložený záznam od interní rešerše na první
 * pohled, bez čtení metodiky. Redakční poznámky značku nenesou. */
function confidenceMark(item: ReportItem): { label: string; className: string } | null {
  if (item.id.startsWith("fallback-") || item.category === "context") return null;
  if (item.metadata.sourceConfidence === "verified" && item.source) {
    return { label: "Doloženo", className: "confidence-verified" };
  }
  if (item.metadata.sourceConfidence === "review-needed") {
    return { label: "K ověření", className: "confidence-review" };
  }
  return null;
}

/** Hloubka na vyžádání: řádek se rozbalí do plnějšího příběhu se zdroji —
 * u lídrů do strukturovaného profilu, u záznamů do citace či poctivé
 * poznámky o interní rešerši. */
function ItemDepth({ item }: { item: ReportItem }) {
  const confidence = confidenceMark(item);
  if (!item.leader && !item.source && !confidence) return null;
  return (
    <details className="item-depth">
      <summary>
        <span className="summary-action-open">{item.leader ? "Zobrazit profil a zdroje" : "Zobrazit zdroj"}</span>
        <span className="summary-action-close">Skrýt podrobnosti</span>
      </summary>
      <div className="item-depth-body">
        {item.leader && <LeaderProfile leader={item.leader} />}
        {item.source ? (
          <p className="item-source">
            Zdroj:{" "}
            {item.source.url ? (
              <a href={item.source.url} target="_blank" rel="noopener noreferrer">
                {item.source.title}
              </a>
            ) : (
              item.source.title
            )}
            {item.source.publisher ? ` · ${item.source.publisher}` : ""}
          </p>
        ) : (
          <p className="item-source">
            Záznam pochází z interní kurátorované rešerše a zatím čeká na vnější ověření.
          </p>
        )}
      </div>
    </details>
  );
}

function ItemCard({ item }: { item: ReportItem }) {
  const variant = itemVariant(item);
  const confidence = confidenceMark(item);
  const time = item.year
    ? `${item.year}${item.age !== undefined && item.age >= 0 ? ` · ${czAgePhrase(item.age)}` : ""}`
    : null;
  return (
    <li className={`report-item item-${variant} tone-${item.metadata.tone} sensitivity-${item.metadata.sensitivity}`}>
      <div className="item-meta">
        <span className="item-kind">{itemKind(item)}</span>
        <span className="item-meta-right">
          {confidence && <span className={`item-confidence ${confidence.className}`}>{confidence.label}</span>}
          {time && <span className="item-year">{time}</span>}
        </span>
      </div>
      <p>{richText(item.text)}</p>
      <ItemDepth item={item} />
    </li>
  );
}

function ChapterItems({ items }: { items: ReportItem[] }) {
  return <ul className="report-items">{items.map((item) => <ItemCard key={item.id} item={item} />)}</ul>;
}

function comparisonItems(firstItems: ReportItem[], secondItems: ReportItem[]) {
  const first = uniqueReportItems(firstItems.slice(0, 5));
  const second = uniqueReportItems(secondItems.slice(0, 5));
  const secondTexts = new Set(second.map((item) => item.text));
  const sharedTexts = new Set(first.filter((item) => secondTexts.has(item.text)).map((item) => item.text));

  return {
    shared: first.filter((item) => sharedTexts.has(item.text)),
    first: first.filter((item) => !sharedTexts.has(item.text)),
    second: second.filter((item) => !sharedTexts.has(item.text)),
  };
}

function showChapter(id: ReportChapter["id"]) {
  const element = document.getElementById(id);
  if (element instanceof HTMLDetailsElement) element.open = true;
  window.requestAnimationFrame(() => element?.scrollIntoView?.({ block: "start", behavior: "auto" }));
}

function ChapterNavigation({
  chapters,
  comparison = false,
}: {
  chapters: ReportChapter[];
  comparison?: boolean;
}) {
  const visibleChapters = comparison
    ? chapters.filter((chapter) => chapter.id !== "life-numbers")
    : chapters;

  return (
    <nav className="chapter-navigation" aria-label={comparison ? "Kapitoly srovnání" : "Kapitoly zprávy"}>
      <p>{comparison ? "Kapitoly společného srovnání" : "Kapitoly osobního vydání"}</p>
      <ol>
        {visibleChapters.map((chapter, index) => (
          <li key={chapter.id}>
            <button type="button" onClick={() => showChapter(chapter.id)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{comparison && chapter.id === "birth" ? "Dva začátky" : chapter.title}</strong>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ChapterFrame({
  chapter,
  index,
  items = chapter.items,
  children,
}: {
  chapter: ReportChapter;
  index: number;
  items?: ReportItem[];
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(!chapter.collapsed);
  const chapterBody = (
    <>
      {items.length > 0 && <ChapterItems items={items} />}
      {children}
    </>
  );
  const content = (
    <div className="chapter-content">
      <header className="chapter-header">
        <p className="chapter-eyebrow"><span>{String(index + 1).padStart(2, "0")}</span>{chapterLabel(chapter)}</p>
        <h2>{chapter.title}</h2>
        {chapter.introduction && <p className="chapter-intro">{chapter.introduction}</p>}
      </header>
      {chapterBody}
    </div>
  );

  if (chapter.collapsed) {
    return (
      <details
        className={`report-chapter chapter-${chapter.id}`}
        id={chapter.id}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary>
          <span className="summary-head">
            <span className="summary-eyebrow">
              {String(index + 1).padStart(2, "0")} — {chapterLabel(chapter)}
              {chapter.id === "generation-context" ? " · citlivý kontext označen" : ""}
            </span>
            <h2>{chapter.title}</h2>
          </span>
          <small className="summary-action button-outline" aria-hidden="true">
            <span className="summary-action-open">Zobrazit</span>
            <span className="summary-action-close">Skrýt</span>
          </small>
        </summary>
        {expanded && (
          <div className="chapter-content chapter-content-expanded">
            {chapter.introduction && <p className="chapter-intro">{chapter.introduction}</p>}
            {chapterBody}
          </div>
        )}
      </details>
    );
  }
  return <section className={`report-chapter chapter-${chapter.id}`} id={chapter.id}>{content}</section>;
}

function WeeksDisclosure({ report }: { report: PersonReport }) {
  const [expanded, setExpanded] = useState(false);
  const weeks = weeksSince(
    birthDateUTC(report.person.birthYear, report.person.birthMonth, report.person.birthDay),
  );
  return (
    <details className="weeks-details" onToggle={(event) => setExpanded(event.currentTarget.open)}>
      <summary>
        <span className="weeks-summary-label">
          <span className="summary-action-open">Zobrazit čas v týdnech</span>
          <span className="summary-action-close">Skrýt čas v týdnech</span>
        </span>
        <span className="weeks-summary-count" aria-hidden="true">{weeks.toLocaleString("cs-CZ")} týdnů</span>
      </summary>
      {expanded && <LifeGrid weeksLived={weeks} label={displayName(report.person)} />}
    </details>
  );
}

function Cover({ report, skyRef }: { report: PersonReport; skyRef: (node: SVGSVGElement | null) => void }) {
  const { person, historicalContext } = report;
  const coordinates = CITY_COORDS[person.citySlug];
  const hasSky = Boolean(person.birthMonth && person.birthDay && coordinates);
  const endYear = person.birthYear + 18;

  return (
    <section className="report-cover" aria-labelledby="report-title">
      <div className="cover-copy">
        <p className="cover-kicker">Osobní vydání · narození {person.birthYear}</p>
        <h1 id="report-title">{reportTitle(person)}</h1>
        <p className="cover-subtitle">
          Dětství a dospívání · {historicalContext.cityLabel} · {person.birthYear}–{endYear}
        </p>
        <dl className="cover-details">
          <div><dt>Narození</dt><dd>{birthDate(person)}</dd></div>
          <div><dt>Tehdejší místo</dt><dd>{historicalContext.primaryLabel}</dd></div>
          <div><dt>Dnes</dt><dd>{historicalContext.presentDayLabel}</dd></div>
          <div><dt>Formativní období</dt><dd>{person.birthYear}–{endYear}</dd></div>
        </dl>
        {historicalContext.transition && (
          <p className="cover-transition-note">Rok nebo měsíc narození zasahuje do změny státního uspořádání. Celé datum by údaj zpřesnilo.</p>
        )}
        <div className="cover-note"><strong>Jak zprávu číst</strong><p>{COPY.methodology}</p></div>
      </div>
      <div className={`cover-visual${hasSky ? " has-sky" : " year-only"}`}>
        {hasSky ? (
          <Suspense fallback={<div className="visual-placeholder">Počítáme polohu hvězd…</div>}>
            <SkyMap
              birthDate={birthDateUTC(person.birthYear, person.birthMonth, person.birthDay)}
              lat={coordinates![0]}
              lon={coordinates![1]}
              cityName={historicalContext.cityLabel}
              svgRef={skyRef}
            />
          </Suspense>
        ) : (
          <figure className="cover-year-plate">
            <div className="cover-year-mark" aria-label={`Rok narození ${person.birthYear}`}>
              <span>{person.birthYear}</span>
            </div>
            <figcaption>
              <span className="cover-year-caption-label">Rok narození</span>
              <span className="cover-year-caption-note">Pro zobrazení oblohy zadejte celé datum narození.</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

function Timeline({ report }: { report: PersonReport }) {
  if (!report.milestones.length) {
    return <p className="visual-placeholder">Pro přesné věkové milníky zatím nemáme dost časově ukotvených údajů.</p>;
  }
  return (
    <ol className="milestone-timeline" aria-label="Proměny podle věku">
      {report.milestones.map((milestone) => (
        <li key={milestone.age} className="milestone-row">
          <span className="milestone-year">{milestone.year}</span>
          <span className="milestone-age">{milestone.age <= 0 ? "Narození" : `${milestone.age} let`}</span>
          <div className="milestone-text">
            {milestone.items.map((item) => <p key={item.id}>{richText(item.text)}</p>)}
          </div>
        </li>
      ))}
    </ol>
  );
}

function VisualExtras({ report, chapterId }: { report: PersonReport; chapterId: ReportChapter["id"] }) {
  const art = artForBirthYear(report.person.birthYear);
  if (chapterId === "teenage-years" && art.length) {
    return (
      <Suspense fallback={<div className="visual-placeholder">Načítáme dobové umění…</div>}>
        <div className="chapter-visual">
          <div className="chapter-visual-head">
            <h3>Umění, které už tehdy mělo svůj příběh</h3>
            <span className="chapter-visual-note">Obrazům bylo kolem sta let</span>
          </div>
          <ArtStrip items={art} birthYear={report.person.birthYear} />
        </div>
      </Suspense>
    );
  }
  if (chapterId === "changing-world") {
    return (
      <div className="chapter-visual visual-stack">
        <Timeline report={report} />
        <Suspense fallback={<div className="visual-placeholder">Připravujeme mapu…</div>}>
          <WorldMap birthYear={report.person.birthYear} />
        </Suspense>
      </div>
    );
  }
  if (chapterId === "life-numbers") {
    const elapsedDays = daysSince(
      birthDateUTC(report.person.birthYear, report.person.birthMonth, report.person.birthDay),
    );
    return (
      <div className="chapter-visual visual-stack">
        <Suspense fallback={<div className="visual-placeholder">Počítáme dlouhý pohled…</div>}>
          <LifeNumbers daysLived={elapsedDays} />
        </Suspense>
        <WeeksDisclosure report={report} />
      </div>
    );
  }
  return null;
}

function SingleReport({ report }: { report: PersonReport }) {
  const milestoneItemIds = new Set(
    report.milestones.flatMap((milestone) => milestone.items.map((item) => item.id)),
  );
  const belongsToMap = (item: ReportItem) =>
    item.text.startsWith("V roce narození na mapě ještě existoval stát");
  return (
    <>
      {report.chapters.map((chapter, index) => (
        <ChapterFrame
          key={chapter.id}
          chapter={chapter}
          index={index}
          items={chapter.items.filter((item) =>
            !milestoneItemIds.has(item.id) && !belongsToMap(item),
          )}
        >
          <VisualExtras report={report} chapterId={chapter.id} />
        </ChapterFrame>
      ))}
    </>
  );
}

function ComparisonChapter({
  chapter,
  other,
  chapterIndex,
  first,
  second,
}: {
  chapter: ReportChapter;
  other: ReportChapter;
  chapterIndex: number;
  first: PersonReport;
  second: PersonReport;
}) {
  const collapsed = chapter.id === "generation-context";
  const [expanded, setExpanded] = useState(!collapsed);
  const items = comparisonItems(chapter.items, other.items);
  const people = [
    { report: first, items: items.first },
    { report: second, items: items.second },
  ];
  const body = (
    <>
      {items.shared.length > 0 && (
        <div className="comparison-shared">
          <p>Co je spojovalo</p>
          <ChapterItems items={items.shared} />
        </div>
      )}
      {people.some((person) => person.items.length > 0) && (
        <div className="comparison-columns">
          {people.map(({ report, items: personItems }, personIndex) => (
            <article key={`${chapter.id}-${personIndex}`}>
              <p className="comparison-person-label">Vydání {personIndex === 0 ? "A" : "B"}</p>
              <h3>{displayName(report.person)} · {report.person.birthYear}</h3>
              <p className="comparison-place">{report.historicalContext.primaryLabel}</p>
              {personItems.length > 0 && <ChapterItems items={personItems} />}
            </article>
          ))}
        </div>
      )}
    </>
  );

  if (collapsed) {
    return (
      <details
        className={`comparison-chapter chapter-${chapter.id}`}
        id={chapter.id}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary>
          <span className="summary-head">
            <span className="summary-eyebrow">
              {String(chapterIndex + 1).padStart(2, "0")} — {chapterLabel(chapter)}
              {chapter.id === "generation-context" ? " · citlivý kontext označen" : ""}
            </span>
            <h2>{chapter.title}</h2>
          </span>
          <small className="summary-action button-outline" aria-hidden="true">
            <span className="summary-action-open">Zobrazit</span>
            <span className="summary-action-close">Skrýt</span>
          </small>
        </summary>
        {expanded && <div className="comparison-chapter-expanded">{body}</div>}
      </details>
    );
  }

  return (
    <section className={`comparison-chapter chapter-${chapter.id}`} id={chapter.id}>
      <header className="chapter-header">
        <p className="chapter-eyebrow"><span>{String(chapterIndex + 1).padStart(2, "0")}</span>{chapterLabel(chapter)}</p>
        <h2>{chapter.id === "birth" ? "Dva začátky" : chapter.title}</h2>
      </header>
      {body}
    </section>
  );
}

function ComparisonReport({ reports }: { reports: [PersonReport, PersonReport] }) {
  const [first, second] = reports;
  return (
    <section className="comparison-report" aria-labelledby="comparison-title">
      <header className="comparison-cover">
        <p className="cover-kicker">Dvě osobní vydání · jedno srovnání</p>
        <h1 id="comparison-title">Dva tehdejší světy</h1>
        <p>Nejde o soutěž. Srovnání ukazuje, co bylo v jednotlivých dobách a místech jiné a co zůstávalo podobné.</p>
        <div className="comparison-thread" aria-hidden="true"><span /><i /><span /></div>
        <div className="comparison-people">
          {[first, second].map((report, personIndex) => (
            <article key={`comparison-person-${personIndex}`}>
              <span>Vydání {personIndex === 0 ? "A" : "B"}</span>
              <h2>{displayName(report.person)}</h2>
              <p className="comparison-year">{report.person.birthYear}–{report.person.birthYear + 18}</p>
              <p>{report.historicalContext.primaryLabel}</p>
            </article>
          ))}
        </div>
      </header>

      <ChapterNavigation chapters={first.chapters} comparison />

      {first.chapters.map((chapter, chapterIndex) => {
        const other = chapterById(second, chapter.id);
        if (!other || chapter.id === "life-numbers") return null;
        return (
          <ComparisonChapter
            key={chapter.id}
            chapter={chapter}
            other={other}
            chapterIndex={chapterIndex}
            first={first}
            second={second}
          />
        );
      })}
    </section>
  );
}

export default function Results({ reports, people }: Props) {
  const [skySvg, setSkySvg] = useState<SVGSVGElement | null>(null);
  const primary = reports[0];
  if (!primary) return null;
  const isPair = reports.length > 1 && reports[1];

  const createPdf = async () => {
    const { generatePdf } = await import("../lib/pdf");
    await generatePdf(primary, skySvg);
  };

  return (
    <article className={`report${isPair ? " report-pair" : ""}`}>
      {isPair ? (
        <ComparisonReport reports={[primary, reports[1]!]} />
      ) : (
        <>
          <Cover report={primary} skyRef={setSkySvg} />
          <ChapterNavigation chapters={primary.chapters} />
          <SingleReport report={primary} />
        </>
      )}

      <SharePanel reports={reports} people={people} skySvg={skySvg} onPdf={createPdf} />
      <p className="report-methodology">Číselné údaje jsou dobové průměry a přibližné výpočty; chybějící období nepřekrýváme smyšlenými fakty.</p>
    </article>
  );
}

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
import SharePanel from "./SharePanel";
import { COPY } from "../copy";

const WorldMap = lazy(() => import("./WorldMap"));
const SkyMap = lazy(() => import("./SkyMap"));
const LifeNumbers = lazy(() => import("./LifeNumbers"));
const ArtStrip = lazy(() => import("./ArtStrip"));

type Props = {
  reports: PersonReport[];
  people: Person[];
  onReset: () => void;
  onRegenerate: () => void;
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

function ItemCard({ item }: { item: ReportItem }) {
  const variant = itemVariant(item);
  const time = item.year
    ? `${item.year}${item.age !== undefined && item.age >= 0 ? ` · ${czAgePhrase(item.age)}` : ""}`
    : null;
  return (
    <li className={`report-item item-${variant} tone-${item.metadata.tone} sensitivity-${item.metadata.sensitivity}`}>
      <div className="item-meta">
        <span className="item-kind">{itemKind(item)}</span>
        {time && <span className="item-year">{time}</span>}
      </div>
      <p>{richText(item.text)}</p>
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
          <span>{String(index + 1).padStart(2, "0")} · {chapterLabel(chapter)}</span>
          <h2>{chapter.title}</h2>
          <small className="summary-action" aria-hidden="true">
            <span className="summary-action-open">Zobrazit kapitolu</span>
            <span className="summary-action-close">Skrýt kapitolu</span>
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
  return (
    <details className="weeks-details" onToggle={(event) => setExpanded(event.currentTarget.open)}>
      <summary>
        <span className="summary-action-open">Zobrazit čas v týdnech</span>
        <span className="summary-action-close">Skrýt čas v týdnech</span>
      </summary>
      {expanded && (
        <LifeGrid
          weeksLived={weeksSince(
            birthDateUTC(report.person.birthYear, report.person.birthMonth, report.person.birthDay),
          )}
          label={displayName(report.person)}
        />
      )}
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
        <div className="cover-edition-line">
          <p className="cover-kicker">Osobní vydání · {birthDate(person)}</p>
          <span aria-hidden="true">TS/{person.birthYear}/{person.variant + 1}</span>
        </div>
        <h1 id="report-title">{reportTitle(person)}</h1>
        <p className="cover-subtitle">
          Dětství a dospívání · {historicalContext.cityLabel} · {person.birthYear}–{endYear}
        </p>
        <dl className="cover-details">
          <div><dt>Narození</dt><dd>{birthDate(person)}</dd></div>
          <div><dt>Tehdejší místo</dt><dd>{historicalContext.primaryLabel}</dd></div>
          <div><dt>Dnes</dt><dd>{historicalContext.presentDayLabel}</dd></div>
        </dl>
        <div className="cover-age-line" aria-label={`Formativní období od roku ${person.birthYear} do roku ${endYear}`}>
          <span><strong>{person.birthYear}</strong><small>narození</small></span>
          <i aria-hidden="true" />
          <span><strong>{person.birthYear + 10}</strong><small>10 let</small></span>
          <i aria-hidden="true" />
          <span><strong>{endYear}</strong><small>18 let</small></span>
        </div>
        {historicalContext.transition && (
          <p className="cover-transition-note">Rok nebo měsíc narození zasahuje do změny státního uspořádání. Celé datum by údaj zpřesnilo.</p>
        )}
        <div className="cover-note"><strong>Jak zprávu číst</strong><p>{COPY.methodology}</p></div>
      </div>
      <div className={`cover-visual${hasSky ? " has-sky" : " year-only"}`}>
        <p className="cover-visual-label">{hasSky ? "Obloha v den narození" : "Rok narození"}</p>
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
          <div className="cover-year-mark" aria-label={`Rok narození ${person.birthYear}`}>
            <span>{person.birthYear}</span>
            <small>Pro zobrazení oblohy zadejte celé datum narození.</small>
          </div>
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
        <li key={milestone.age}>
          <div className="milestone-marker"><span>{milestone.age}</span><small>let</small></div>
          <div className="milestone-copy">
            <p className="milestone-label"><span>{milestone.year}</span>{milestone.label}</p>
            <ul>{milestone.items.map((item) => <li key={item.id}>{richText(item.text)}</li>)}</ul>
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
        <div className="chapter-visual"><h3>Umění, které už tehdy mělo svůj příběh</h3><ArtStrip items={art} birthYear={report.person.birthYear} /></div>
      </Suspense>
    );
  }
  if (chapterId === "changing-world") {
    return (
      <div className="chapter-visual visual-stack">
        <Timeline report={report} />
        <div>
          <h3>Státy a hranice, které se mezitím proměnily</h3>
          <Suspense fallback={<div className="visual-placeholder">Připravujeme mapu…</div>}>
            <WorldMap birthYear={report.person.birthYear} />
          </Suspense>
        </div>
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
          <span>{String(chapterIndex + 1).padStart(2, "0")} · {chapterLabel(chapter)}</span>
          <h2>{chapter.title}</h2>
          <small className="summary-action" aria-hidden="true">
            <span className="summary-action-open">Zobrazit kapitolu</span>
            <span className="summary-action-close">Skrýt kapitolu</span>
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

export default function Results({ reports, people, onReset, onRegenerate }: Props) {
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
      <nav className="report-toolbar" aria-label="Ovládání zprávy">
        <button type="button" className="text-button" onClick={onReset}>Nový tehdejší svět</button>
        <button type="button" className="secondary" onClick={onRegenerate}>Ukázat další souvislosti</button>
      </nav>

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

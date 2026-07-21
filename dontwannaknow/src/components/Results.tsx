import { lazy, Suspense, useState, type ReactNode } from "react";
import type { PersonReport } from "../lib/facts";
import type { Person } from "../lib/person";
import { displayName, reportTitle } from "../lib/person";
import { uniqueReportItems, type ReportChapter, type ReportItem } from "../lib/report";
import { CITY_COORDS } from "../data/cityCoords";
import { artForBirthYear } from "../data/artByDecade";
import { birthDateUTC, daysSince, weeksSince } from "../lib/datetime";
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

function itemKind(item: ReportItem): string {
  if (item.metadata.sensitivity === "difficult") return "Složitý kontext";
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

function ItemCard({ item }: { item: ReportItem }) {
  return (
    <li className={`report-item tone-${item.metadata.tone} sensitivity-${item.metadata.sensitivity}`}>
      <span className="item-kind">{itemKind(item)}</span>
      {item.year && <span className="item-year">{item.year}</span>}
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

function ChapterFrame({
  chapter,
  items = chapter.items,
  children,
}: {
  chapter: ReportChapter;
  items?: ReportItem[];
  children?: ReactNode;
}) {
  const chapterBody = (
    <>
      {items.length > 0 && <ChapterItems items={items} />}
      {children}
    </>
  );
  const content = (
    <div className="chapter-content">
      <header className="chapter-header">
        <p className="chapter-eyebrow">{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        {chapter.introduction && <p className="chapter-intro">{chapter.introduction}</p>}
      </header>
      {chapterBody}
    </div>
  );

  if (chapter.collapsed) {
    return (
      <details className={`report-chapter chapter-${chapter.id}`} id={chapter.id}>
        <summary>
          <span>{chapter.eyebrow}</span>
          <h2>{chapter.title}</h2>
          <small className="summary-action" aria-hidden="true">
            <span className="summary-action-open">Zobrazit kapitolu</span>
            <span className="summary-action-close">Skrýt kapitolu</span>
          </small>
        </summary>
        <div className="chapter-content chapter-content-expanded">
          {chapter.introduction && <p className="chapter-intro">{chapter.introduction}</p>}
          {chapterBody}
        </div>
      </details>
    );
  }
  return <section className={`report-chapter chapter-${chapter.id}`} id={chapter.id}>{content}</section>;
}

function Cover({ report, skyRef }: { report: PersonReport; skyRef: (node: SVGSVGElement | null) => void }) {
  const { person, historicalContext } = report;
  const coordinates = CITY_COORDS[person.citySlug];
  const hasSky = Boolean(person.birthMonth && person.birthDay && coordinates);
  const endYear = person.birthYear + 18;

  return (
    <section className="report-cover" aria-labelledby="report-title">
      <div className="cover-copy">
        <p className="cover-kicker">Osobní obraz jedné doby</p>
        <h1 id="report-title">{reportTitle(person)}</h1>
        <p className="cover-subtitle">
          Dětství a dospívání · {historicalContext.cityLabel} · {person.birthYear}–{endYear}
        </p>
        <dl className="cover-details">
          <div><dt>Narození</dt><dd>{birthDate(person)}</dd></div>
          <div><dt>Tehdejší místo</dt><dd>{historicalContext.primaryLabel}</dd></div>
          <div><dt>Dnes</dt><dd>{historicalContext.presentDayLabel}</dd></div>
        </dl>
        {historicalContext.transition && (
          <p className="cover-transition-note">Rok nebo měsíc narození zasahuje do změny státního uspořádání. Celé datum by údaj zpřesnilo.</p>
        )}
        <p className="cover-note">{COPY.methodology}</p>
      </div>
      <div className="cover-visual" aria-label="Náhled oblohy v den narození">
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
            <p className="milestone-label">{milestone.label} · {milestone.year}</p>
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
        <details className="weeks-details">
          <summary>
            <span className="summary-action-open">Zobrazit čas v týdnech</span>
            <span className="summary-action-close">Skrýt čas v týdnech</span>
          </summary>
          <LifeGrid
            weeksLived={weeksSince(
              birthDateUTC(report.person.birthYear, report.person.birthMonth, report.person.birthDay),
            )}
            label={displayName(report.person)}
          />
        </details>
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
      {report.chapters.map((chapter) => (
        <ChapterFrame
          key={chapter.id}
          chapter={chapter}
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

function ComparisonReport({ reports }: { reports: [PersonReport, PersonReport] }) {
  const [first, second] = reports;
  return (
    <section className="comparison-report" aria-labelledby="comparison-title">
      <header className="comparison-cover">
        <p className="cover-kicker">Dva lidé · dvě prostředí</p>
        <h1 id="comparison-title">Dva tehdejší světy</h1>
        <p>Nejde o soutěž. Srovnání ukazuje, co bylo v jednotlivých dobách a místech jiné a co zůstávalo podobné.</p>
        <div className="comparison-people">
          {[first, second].map((report, personIndex) => (
            <article key={`comparison-person-${personIndex}`}>
              <span>{report.person.birthYear}</span>
              <h2>{displayName(report.person)}</h2>
              <p>{report.historicalContext.primaryLabel}</p>
            </article>
          ))}
        </div>
      </header>

      {first.chapters.map((chapter) => {
        const other = chapterById(second, chapter.id);
        if (!other || chapter.id === "life-numbers") return null;
        const items = comparisonItems(chapter.items, other.items);
        const people = [
          { report: first, items: items.first },
          { report: second, items: items.second },
        ];
        return (
          <section className={`comparison-chapter chapter-${chapter.id}`} id={chapter.id} key={chapter.id}>
            <header className="chapter-header">
              <p className="chapter-eyebrow">{chapter.eyebrow}</p>
              <h2>{chapter.id === "birth" ? "Dva začátky" : chapter.title}</h2>
            </header>
            {items.shared.length > 0 && (
              <div className="comparison-shared">
                <p>Společná souvislost</p>
                <ChapterItems items={items.shared} />
              </div>
            )}
            {people.some((person) => person.items.length > 0) && (
              <div className="comparison-columns">
                {people.map(({ report, items: personItems }, personIndex) => (
                  <article key={`${chapter.id}-${personIndex}`}>
                    <h3>{displayName(report.person)} · {report.person.birthYear}</h3>
                    <p className="comparison-place">{report.historicalContext.primaryLabel}</p>
                    {personItems.length > 0 && <ChapterItems items={personItems} />}
                  </article>
                ))}
              </div>
            )}
          </section>
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

  const showChapter = (id: ReportChapter["id"]) => {
    const element = document.getElementById(id);
    if (element instanceof HTMLDetailsElement) element.open = true;
    window.requestAnimationFrame(() => element?.scrollIntoView({ block: "start", behavior: "auto" }));
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
          <nav className="chapter-navigation" aria-label="Kapitoly zprávy">
            {primary.chapters.map((chapter) => (
              <button key={chapter.id} type="button" onClick={() => showChapter(chapter.id)}>
                {chapter.title}
              </button>
            ))}
          </nav>
          <SingleReport report={primary} />
        </>
      )}

      <SharePanel reports={reports} people={people} skySvg={skySvg} onPdf={createPdf} />
      <p className="report-methodology">Číselné údaje jsou dobové průměry a přibližné výpočty; chybějící období nepřekrýváme smyšlenými fakty.</p>
    </article>
  );
}

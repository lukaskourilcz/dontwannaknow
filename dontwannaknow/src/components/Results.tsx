import { useRef, useState, type ReactNode } from "react";
import type { Person, PersonReport, Fact } from "../lib/facts";
import { genderForm, pairReport } from "../lib/facts";
import WorldMap from "./WorldMap";
import SkyMap from "./SkyMap";
import LifeGrid from "./LifeGrid";
import LifeNumbers from "./LifeNumbers";
import ArtStrip from "./ArtStrip";
import HeroBrief from "./HeroBrief";
import HeroSummary from "./HeroSummary";
import { artForBirthYear } from "../data/artByDecade";
import { CITY_COORDS } from "../data/cityCoords";
import { lifeExpectancyFor } from "../data/lifeExpectancy";
import { buildShareUrl } from "../lib/share";
import { generatePdf } from "../lib/pdf";
import { useLang } from "../i18n/useLang";
import { useCopied } from "../lib/useCopied";
import { birthDateUTC, weeksSince, daysSince } from "../lib/datetime";
import { settings } from "../config/settings";

// Render **bold** spans (names of people, films and works) while preserving
// any line breaks for the white-space: pre-line pair lists.
function boldify(text: string): ReactNode {
  if (!text.includes("**")) return text;
  return text
    .split("**")
    .map((seg, i) => (i % 2 === 1 ? <strong key={i}>{seg}</strong> : seg));
}

type Props = {
  reports: PersonReport[];
  people: Person[];
  onReset: () => void;
  onRegenerate: () => void;
};

// The 17 report categories, regrouped into 8 progressive-disclosure topics.
// Nothing is dropped — every category stays reachable, only its default
// visibility changes (folded behind an accordion).
type Topic = {
  id: string;
  title: { cs: string; en: string };
  hint: { cs: string; en: string };
  categories: Fact["category"][];
};

const TOPICS: Topic[] = [
  {
    id: "city",
    title: { cs: "V rodném městě", en: "In their home town" },
    hint: { cs: "Ulice jejich dětství, rok za rokem", en: "The streets of their childhood, year by year" },
    categories: ["city"],
  },
  {
    id: "beautiful",
    title: { cs: "Krásné okamžiky", en: "Beautiful moments" },
    hint: { cs: "To dobré a velké", en: "The good and the great" },
    categories: ["beautiful"],
  },
  {
    id: "life",
    title: { cs: "Každodenní život", en: "Everyday life" },
    hint: { cs: "Jídlo, oblečení, ceny, nemoci", en: "Food, clothes, prices, illnesses" },
    categories: ["food", "clothes", "money", "illness", "daily"],
  },
  {
    id: "power",
    title: { cs: "Moc, tváře a pera", en: "Power, faces and pens" },
    hint: { cs: "Politika, slavní, vrstevníci, spisovatelé", en: "Politics, the famous, contemporaries, writers" },
    categories: ["government", "famous", "media", "contemporaries", "writers"],
  },
  {
    id: "local",
    title: { cs: "Po celé zemi", en: "Across the country" },
    hint: { cs: "Co hýbalo republikou", en: "What moved the nation" },
    categories: ["local"],
  },
  {
    id: "world",
    title: { cs: "Svět kolem", en: "The wider world" },
    hint: { cs: "Události za hranicemi", en: "Events beyond the border" },
    categories: ["world", "everyday"],
  },
  {
    id: "youth",
    title: { cs: "Dospívání", en: "Growing up" },
    hint: { cs: "Písničky, obrazovky, móda", en: "Songs, screens, fashion" },
    categories: ["youth"],
  },
  {
    id: "bizarre",
    title: { cs: "Zajímavosti", en: "Curiosities" },
    hint: { cs: "Věci, které dnes působí zvláštně", en: "Things that feel strange today" },
    categories: ["bizarre"],
  },
];

function groupByCategory(facts: Fact[]) {
  const map = new Map<Fact["category"], string[]>();
  for (const f of facts) {
    const list = map.get(f.category) ?? [];
    list.push(f.text);
    map.set(f.category, list);
  }
  return map;
}

// All items belonging to a topic, in category order, for one grouped report.
function topicItems(grouped: Map<Fact["category"], string[]>, topic: Topic): string[] {
  const out: string[] = [];
  for (const cat of topic.categories) {
    const items = grouped.get(cat);
    if (items) out.push(...items);
  }
  return out;
}

// The per-person "maps, sky & numbers" module body (world map, night sky when
// a full date + city coords exist, life-in-numbers, and the art strip).
function VisualsForPerson({
  report,
  index,
  skyRefs,
}: {
  report: PersonReport;
  index: number;
  skyRefs: React.MutableRefObject<Map<number, SVGSVGElement | null>>;
}) {
  const { lang } = useLang();
  const { person } = report;
  const art = artForBirthYear(person.birthYear);

  const hasSky =
    person.birthMonth &&
    person.birthDay &&
    person.citySlug &&
    CITY_COORDS[person.citySlug];

  return (
    <div className="visuals-person">
      <div className="visuals-block">
        <h4 className="module-label">{lang === "cs" ? "Svět toho roku" : "The world that year"}</h4>
        <WorldMap birthYear={person.birthYear} />
      </div>

      <div className="visuals-split">
        {hasSky &&
          (() => {
            const [lat, lon] = CITY_COORDS[person.citySlug!];
            const date = new Date(
              Date.UTC(person.birthYear, person.birthMonth! - 1, person.birthDay!),
            );
            return (
              <div className="visuals-block">
                <h4 className="module-label">{lang === "cs" ? "Noční obloha" : "The night sky"}</h4>
                <SkyMap
                  birthDate={date}
                  lat={lat}
                  lon={lon}
                  cityName={report.cityLabel ?? report.countryLabel}
                  svgRef={(el) => {
                    skyRefs.current.set(index, el);
                  }}
                />
              </div>
            );
          })()}
        <div className="visuals-block">
          <h4 className="module-label">{lang === "cs" ? "Život v číslech" : "Life in numbers"}</h4>
          <LifeNumbers
            daysLived={daysSince(
              birthDateUTC(person.birthYear, person.birthMonth, person.birthDay),
            )}
          />
        </div>
      </div>

      {art.length > 0 && (
        <div className="visuals-block">
          <h4 className="module-label">{lang === "cs" ? "Sto let před tebou" : "A century before you"}</h4>
          <ArtStrip items={art} birthYear={person.birthYear} />
        </div>
      )}
    </div>
  );
}

export default function Results({ reports, people, onReset, onRegenerate }: Props) {
  const { t, lang } = useLang();
  const { copied, copy, flash } = useCopied(settings.shareCopiedResetMs);
  const skyRefs = useRef<Map<number, SVGSVGElement | null>>(new Map());

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [essayOpen, setEssayOpen] = useState(false);

  const isPair = reports.length >= 2;
  const primary = reports[0];
  const pair = isPair ? pairReport(reports[0].person, reports[1].person) : null;

  const grouped = reports.map((r) => groupByCategory(r.facts));

  const anyTopicOpen = TOPICS.some((tp) => open[tp.id]);

  const toggle = (key: string) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  const toggleAll = () => {
    if (anyTopicOpen) {
      setOpen({});
    } else {
      const next: Record<string, boolean> = { visuals: true };
      TOPICS.forEach((tp) => (next[tp.id] = true));
      setOpen(next);
    }
  };

  const handleShare = async () => {
    const url = buildShareUrl(people);
    const copiedToClipboard = await copy(url);
    if (!copiedToClipboard) {
      window.history.replaceState(null, "", `#d=${url.split("#d=")[1]}`);
      flash();
    }
  };

  const handleDownload = async () => {
    const svg = skyRefs.current.get(0) ?? null;
    try {
      await generatePdf(primary, svg);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Omlouváme se — vytvoření PDF selhalo. Zkuste to znovu nebo zkontrolujte konzoli.");
    }
  };

  const genderWord = (p: Person) =>
    lang === "cs"
      ? genderForm(p.gender, "muž", "žena")
      : genderForm(p.gender, "man", "woman");

  const placeOf = (r: PersonReport) =>
    r.cityLabel ? `${r.cityLabel}, ${r.countryLabel}` : r.countryLabel;

  const metaLine = (r: PersonReport) =>
    `${r.person.birthYear} · ${placeOf(r)} · ${genderWord(r.person)}`;

  const singleHeadline = (r: PersonReport) =>
    lang === "cs"
      ? `Svět ${r.person.label}, jak vypadal v roce ${r.person.birthYear}`
      : `${r.person.label}'s world, as it was in ${r.person.birthYear}`;

  return (
    <div className={isPair ? "results2 results2-pair" : "results2 results2-single"}>
      {/* ── top bar ─────────────────────────────────────── */}
      <div className="results2-topbar">
        <button type="button" className="results2-back" onClick={onReset}>
          {t("results.newWorld")}
        </button>
        <div className="results2-actions">
          <button type="button" className="secondary" onClick={onRegenerate}>
            {t("results.shuffle")}
          </button>
          <button type="button" className="secondary" onClick={handleShare}>
            {copied ? t("results.share.copied") : t("results.share")}
          </button>
          <button type="button" className="secondary" onClick={handleDownload}>
            {t("results.pdf")}
          </button>
        </div>
      </div>

      {/* ── summary: single ─────────────────────────────── */}
      {!isPair && (
        <div className="summary">
          <p className="result-meta">{metaLine(primary)}</p>
          <h2 className="result-headline">{singleHeadline(primary)}</h2>

          <HeroSummary report={primary} />

          <div className="summary-grid">
            <div className="summary-brief">
              <HeroBrief person={primary.person} />
            </div>
            <div className="summary-weeks">
              <h3 className="module-label">{lang === "cs" ? "Život v týdnech" : "Life in weeks"}</h3>
              <LifeGrid
                weeksLived={weeksSince(
                  birthDateUTC(
                    primary.person.birthYear,
                    primary.person.birthMonth,
                    primary.person.birthDay,
                  ),
                )}
                ageNow={primary.ageNow}
                label={primary.person.label}
                lifeExpectancyYears={lifeExpectancyFor(
                  primary.person.country,
                  primary.person.gender,
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── summary: pair (two worlds side by side) ─────── */}
      {isPair && (
        <div className="summary">
          <p className="result-meta">
            {reports[0].person.label} ({reports[0].person.birthYear}) ·{" "}
            {reports[1].person.label} ({reports[1].person.birthYear}) ·{" "}
            {lang === "cs" ? "dva světy vedle sebe" : "two worlds side by side"}
          </p>
          <h2 className="result-headline">
            {reports[0].person.label} &amp; {reports[1].person.label}
          </h2>

          <div className="pair-summary">
            {reports.map((r) => (
              <div className="pair-col" key={`${r.person.label}-${r.person.birthYear}`}>
                <h3 className="pair-name">{r.person.label}</h3>
                <p className="pair-meta">
                  {r.person.birthYear} · {placeOf(r)}
                </p>
                <div className="pair-mini-stats">
                  <div className="hero-stat">
                    <span className="hero-stat-label">
                      {lang === "cs" ? "Věk dnes" : "Age today"}
                    </span>
                    <span className="hero-stat-value">{r.ageNow}</span>
                  </div>
                  <div className="hero-stat">
                    <span className="hero-stat-label">
                      {lang === "cs" ? "Prožité dny" : "Days lived"}
                    </span>
                    <span className="hero-stat-value">
                      {daysSince(
                        birthDateUTC(
                          r.person.birthYear,
                          r.person.birthMonth,
                          r.person.birthDay,
                        ),
                      ).toLocaleString(lang === "cs" ? "cs-CZ" : "en-US")}
                    </span>
                  </div>
                </div>
                <div className="pair-brief">
                  <HeroBrief person={r.person} />
                </div>
                <h4 className="module-label">
                  {lang === "cs" ? "Život v týdnech" : "Life in weeks"}
                </h4>
                <LifeGrid
                  weeksLived={weeksSince(
                    birthDateUTC(
                      r.person.birthYear,
                      r.person.birthMonth,
                      r.person.birthDay,
                    ),
                  )}
                  ageNow={r.ageNow}
                  label={r.person.label}
                  lifeExpectancyYears={lifeExpectancyFor(
                    r.person.country,
                    r.person.gender,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── progressive: reveal on demand ───────────────── */}
      <div className="explore">
        <div className="explore-header">
          <h3>{t("results.explore")}</h3>
          <button type="button" className="explore-toggle" onClick={toggleAll}>
            {anyTopicOpen ? t("results.collapseAll") : t("results.expandAll")}
          </button>
        </div>

        {TOPICS.map((tp) => {
          const itemsA = topicItems(grouped[0], tp);
          const itemsB = isPair ? topicItems(grouped[1], tp) : [];
          if (itemsA.length === 0 && itemsB.length === 0) return null;
          const isOpen = !!open[tp.id];
          return (
            <div className="accordion-item" key={tp.id}>
              <button
                type="button"
                className="accordion-btn"
                aria-expanded={isOpen}
                onClick={() => toggle(tp.id)}
              >
                <span className="accordion-heading">
                  <span className="accordion-title">{tp.title[lang]}</span>
                  <span className="accordion-hint">{tp.hint[lang]}</span>
                </span>
                <span className={`accordion-icon${isOpen ? " open" : ""}`}>+</span>
              </button>
              {isOpen &&
                (isPair ? (
                  <div className="accordion-body accordion-body-pair">
                    <ul className="accordion-list">
                      {itemsA.map((it, i) => (
                        <li key={i}>{boldify(it)}</li>
                      ))}
                    </ul>
                    <ul className="accordion-list">
                      {itemsB.map((it, i) => (
                        <li key={i}>{boldify(it)}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="accordion-body accordion-list">
                    {itemsA.map((it, i) => (
                      <li key={i}>{boldify(it)}</li>
                    ))}
                  </ul>
                ))}
            </div>
          );
        })}

        {/* maps, sky & numbers — folded */}
        <div className="accordion-item">
          <button
            type="button"
            className="accordion-btn"
            aria-expanded={!!open.visuals}
            onClick={() => toggle("visuals")}
          >
            <span className="accordion-heading">
              <span className="accordion-title">
                {lang === "cs" ? "Mapy, obloha a čísla" : "Maps, sky and numbers"}
              </span>
              <span className="accordion-hint">
                {lang === "cs"
                  ? "Svět na mapě, noční obloha jejich dne a život v číslech"
                  : "The world on a map, the night sky of their day, and life in numbers"}
              </span>
            </span>
            <span className={`accordion-icon${open.visuals ? " open" : ""}`}>+</span>
          </button>
          {open.visuals && (
            <div className="accordion-body visuals-module">
              {reports.map((r, i) => (
                <div key={`vis-${i}`}>
                  {isPair && <h3 className="visuals-person-name">{r.person.label}</h3>}
                  <VisualsForPerson report={r} index={i} skyRefs={skyRefs} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* the essay / comparison — folded */}
        <div className="essay-fold">
          {!essayOpen && (
            <button
              type="button"
              className="essay-fold-open"
              onClick={() => setEssayOpen(true)}
            >
              {isPair ? t("results.readComparison") : t("results.readStory")}
            </button>
          )}
          {essayOpen && (
            <div className="essay-fold-body">
              <h3 className="module-label">
                {isPair ? t("results.comparison") : t("results.fullStory")}
              </h3>
              {isPair && pair ? (
                <div className="essay">
                  {pair.map((p, i) => (
                    <section key={i} className="essay-paragraph">
                      <h4>{p.heading}</h4>
                      {p.items ? (
                        <ul className="pair-event-list">
                          {p.items.map((it, j) => (
                            <li key={j}>{boldify(it)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{boldify(p.text ?? "")}</p>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                <div className="essay">
                  {primary.essay.map((p, i) => (
                    <section key={i} className="essay-paragraph">
                      <h4>{p.heading}</h4>
                      {p.items ? (
                        <ul className="essay-list">
                          {p.items.map((it, j) => (
                            <li key={j}>{boldify(it)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{boldify(p.text ?? "")}</p>
                      )}
                    </section>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="essay-fold-collapse"
                onClick={() => setEssayOpen(false)}
              >
                {t("results.collapseStory")}
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="disclaimer">{t("results.disclaimer")}</p>
    </div>
  );
}

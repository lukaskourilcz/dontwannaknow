import { useRef, useState } from "react";
import type { Person, PersonReport, Fact } from "../lib/facts";
import { pairReport } from "../lib/facts";
import WorldMap from "./WorldMap";
import SkyMap from "./SkyMap";
import LifeGrid from "./LifeGrid";
import Newspaper from "./Newspaper";
import { CITY_COORDS } from "../data/cityCoords";
import { lifeExpectancyFor } from "../data/lifeExpectancy";
import { buildShareUrl } from "../lib/share";
import { generatePdf } from "../lib/pdf";
import { useLang } from "../i18n/useLang";
import HeroSummary from "./HeroSummary";

type Divider = { label: string };
function SectionDivider({ label }: Divider) {
  return (
    <div className="section-divider" role="separator">
      <span className="section-divider-line" />
      <span className="section-divider-label">{label}</span>
      <span className="section-divider-line" />
    </div>
  );
}

type Props = {
  reports: PersonReport[];
  people: Person[];
  onReset: () => void;
  onRegenerate: () => void;
};

const SECTION_ORDER: { key: Fact["category"]; title: string; tone: string }[] = [
  { key: "city", title: "In their hometown", tone: "Year by year, on the streets they grew up on" },
  { key: "bizarre", title: "Bizarre", tone: "Strange-but-true" },
  { key: "beautiful", title: "Beautiful", tone: "The good and the great" },
  { key: "local", title: "Across the country", tone: "" },
  { key: "government", title: "Who was in charge", tone: "Politics & power" },
  { key: "famous", title: "Famous faces of the era", tone: "Writers, artists, leaders" },
  { key: "clothes", title: "What people wore", tone: "" },
  { key: "illness", title: "What people fell ill from", tone: "" },
  { key: "daily", title: "Daily life", tone: "" },
  { key: "food", title: "What was on the table", tone: "" },
  { key: "money", title: "What things cost", tone: "" },
  { key: "world", title: "What the world was doing", tone: "" },
  { key: "everyday", title: "The wider world", tone: "Prices, wages, people" },
  { key: "youth", title: "Growing up", tone: "Songs, screens, fashion" },
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

type ViewMode = "essay" | "facts";

export default function Results({ reports, people, onReset, onRegenerate }: Props) {
  const { t, lang } = useLang();
  const [view, setView] = useState<ViewMode>("essay");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const skyRefs = useRef<Map<number, SVGSVGElement | null>>(new Map());

  // Build pair comparison when 2+ people are submitted.
  const pair =
    reports.length >= 2
      ? pairReport(reports[0].person, reports[1].person)
      : null;

  const handleShare = async () => {
    const url = buildShareUrl(people);
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 1800);
    } catch {
      // Fallback: stick it in the URL bar.
      window.history.replaceState(null, "", `#d=${url.split("#d=")[1]}`);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 1800);
    }
  };

  const handleDownload = async (i: number, report: PersonReport) => {
    const svg = skyRefs.current.get(i) ?? null;
    try {
      await generatePdf(report, svg);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Sorry — PDF generation failed. Try again, or check the console.");
    }
  };

  return (
    <div className="results">
      <div className="results-header">
        <h2>{t("results.heading")}</h2>
        <div className="results-actions">
          <div className="view-toggle" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={view === "essay"}
              className={view === "essay" ? "active" : ""}
              onClick={() => setView("essay")}
            >
              {t("results.essay")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "facts"}
              className={view === "facts" ? "active" : ""}
              onClick={() => setView("facts")}
            >
              {t("results.facts")}
            </button>
          </div>
          <button className="secondary" type="button" onClick={onRegenerate}>
            {t("results.shuffle")}
          </button>
          <button className="secondary" type="button" onClick={handleShare}>
            {shareState === "copied" ? t("results.share.copied") : t("results.share")}
          </button>
          <button className="secondary" type="button" onClick={onReset}>
            {t("results.reset")}
          </button>
        </div>
      </div>

      {pair && view === "essay" && (
        <article className="person-card pair-card">
          <header className="person-header">
            <h3>
              {reports[0].person.label} &amp; {reports[1].person.label}
            </h3>
            <p className="person-sub">Their two worlds, side by side</p>
          </header>
          <div className="essay">
            {pair.map((p, i) => (
              <section key={i} className="essay-paragraph">
                <h4>{p.heading}</h4>
                <p>{p.text}</p>
              </section>
            ))}
          </div>
        </article>
      )}

      {reports.map((r, i) => {
        const grouped = groupByCategory(r.facts);
        return (
          <article
            key={`${r.person.label}-${r.person.birthYear}-${r.person.country}-${r.person.citySlug ?? "x"}-${i}`}
            className="person-card"
          >
            <header className="person-header">
              <div className="person-header-row">
                <div>
                  <h3>{r.person.label}</h3>
                  <p className="person-sub">
                    <span>{r.person.birthYear}</span>
                    <span className="dot" />
                    <span>
                      {r.cityLabel ? `${r.cityLabel}, ${r.countryLabel}` : r.countryLabel}
                    </span>
                    <span className="dot" />
                    <span>
                      {r.ageNow} {t("person.yearsOnPlanet")}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  className="secondary download-btn"
                  onClick={() => handleDownload(i, r)}
                  aria-label={`PDF · ${r.person.label}`}
                >
                  {t("results.pdf")}
                </button>
              </div>
            </header>

            <HeroSummary report={r} />

            <SectionDivider label={lang === "cs" ? "Život v letech" : "Life in years"} />
            <LifeGrid
              ageNow={r.ageNow}
              lifeExpectancy={lifeExpectancyFor(r.person.country)}
              label={r.person.label}
            />

            {r.person.birthMonth &&
              r.person.birthDay &&
              r.person.citySlug &&
              CITY_COORDS[r.person.citySlug] &&
              (() => {
                const [lat, lon] = CITY_COORDS[r.person.citySlug];
                const date = new Date(
                  Date.UTC(
                    r.person.birthYear,
                    r.person.birthMonth - 1,
                    r.person.birthDay,
                  ),
                );
                return (
                  <>
                    <SectionDivider label={lang === "cs" ? "Noční obloha" : "The night sky"} />
                    <SkyMap
                      birthDate={date}
                      lat={lat}
                      lon={lon}
                      cityName={r.cityLabel ?? r.countryLabel}
                      svgRef={(el) => {
                        skyRefs.current.set(i, el);
                      }}
                    />
                  </>
                );
              })()}

            <SectionDivider label={lang === "cs" ? "Svět" : "The world"} />
            <WorldMap birthYear={r.person.birthYear} />

            <SectionDivider label={lang === "cs" ? "Titulní strana" : "The front page"} />
            <Newspaper person={r.person} />

            <SectionDivider
              label={
                view === "essay"
                  ? lang === "cs" ? "Příběh" : "The story"
                  : lang === "cs" ? "Fakta" : "Facts"
              }
            />

            {view === "essay" && (
              <div className="essay">
                {r.essay.map((p, j) => (
                  <section key={j} className="essay-paragraph">
                    <h4>{p.heading}</h4>
                    <p>{p.text}</p>
                  </section>
                ))}
              </div>
            )}

            {view === "facts" &&
              SECTION_ORDER.map(({ key, title, tone }) => {
                const items = grouped.get(key);
                if (!items || items.length === 0) return null;
                return (
                  <section key={key} className={`facts facts-${key}`}>
                    <h4>
                      {title}
                      {tone && <span className="tone"> · {tone}</span>}
                    </h4>
                    <ul>
                      {items.map((t, k) => (
                        <li key={k}>{t}</li>
                      ))}
                    </ul>
                  </section>
                );
              })}
          </article>
        );
      })}
      <p className="disclaimer">{t("results.disclaimer")}</p>
    </div>
  );
}

import { useRef, useState, type ReactNode } from "react";
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
import { useCopied } from "../lib/useCopied";
import { birthDateUTC, weeksSince } from "../lib/datetime";
import HeroSummary from "./HeroSummary";

// Render **bold** spans (used for names of people, films and works) while
// preserving any line breaks for the white-space: pre-line lists.
function boldify(text: string): ReactNode {
  if (!text.includes("**")) return text;
  return text
    .split("**")
    .map((seg, i) => (i % 2 === 1 ? <strong key={i}>{seg}</strong> : seg));
}

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
  { key: "city", title: "V rodném městě", tone: "Rok za rokem v ulicích jejich dětství" },
  { key: "bizarre", title: "Zajímavosti", tone: "" },
  { key: "beautiful", title: "Krásné", tone: "To dobré a velké" },
  { key: "local", title: "Po celé zemi", tone: "" },
  { key: "government", title: "Kdo měl moc", tone: "Politika a moc" },
  { key: "famous", title: "Slavné tváře té doby", tone: "Spisovatelé, umělci, vůdci" },
  { key: "writers", title: "Spisovatelé v roce narození", tone: "Kolik jim bylo a na čem právě pracovali" },
  { key: "media", title: "Co se četlo a sledovalo", tone: "Časopisy, knihy a televize" },
  { key: "clothes", title: "Co se nosilo", tone: "" },
  { key: "illness", title: "Na co lidé stonali", tone: "" },
  { key: "daily", title: "Každodenní život", tone: "" },
  { key: "food", title: "Co bylo na stole", tone: "" },
  { key: "money", title: "Co kolik stálo", tone: "" },
  { key: "world", title: "Co se dělo ve světě", tone: "" },
  { key: "everyday", title: "Širší svět", tone: "Ceny, mzdy, lidé" },
  { key: "youth", title: "Dospívání", tone: "Písničky, obrazovky, móda" },
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
  const { copied, copy, flash } = useCopied();
  const skyRefs = useRef<Map<number, SVGSVGElement | null>>(new Map());

  // Build pair comparison when 2+ people are submitted.
  const pair =
    reports.length >= 2
      ? pairReport(reports[0].person, reports[1].person)
      : null;

  const handleShare = async () => {
    const url = buildShareUrl(people);
    const copiedToClipboard = await copy(url);
    if (!copiedToClipboard) {
      // Clipboard blocked — fall back to putting the link in the URL bar.
      window.history.replaceState(null, "", `#d=${url.split("#d=")[1]}`);
      flash();
    }
  };

  const handleDownload = async (i: number, report: PersonReport) => {
    const svg = skyRefs.current.get(i) ?? null;
    try {
      await generatePdf(report, svg);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Omlouváme se — vytvoření PDF selhalo. Zkuste to znovu nebo zkontrolujte konzoli.");
    }
  };

  return (
    <div className="results">
      <div className="results-header">
        <h2>{t("results.heading")}</h2>
        <div className="results-actions">
          <div className="view-toggle" role="tablist" aria-label="Režim zobrazení">
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
            {copied ? t("results.share.copied") : t("results.share")}
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
            <p className="person-sub">Jejich dva světy vedle sebe</p>
          </header>
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
        </article>
      )}

      <div className={reports.length > 1 ? "person-cards person-cards-pair" : "person-cards"}>
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

            <SectionDivider label={lang === "cs" ? "Život v týdnech" : "Life in weeks"} />
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
              lifeExpectancyYears={lifeExpectancyFor(r.person.country, r.person.gender)}
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
                    {p.items ? (
                      <ul className="essay-list">
                        {p.items.map((it, k) => (
                          <li key={k}>{boldify(it)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{boldify(p.text ?? "")}</p>
                    )}
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
                        <li key={k}>{boldify(t)}</li>
                      ))}
                    </ul>
                  </section>
                );
              })}
          </article>
        );
      })}
      </div>
      <p className="disclaimer">{t("results.disclaimer")}</p>
    </div>
  );
}

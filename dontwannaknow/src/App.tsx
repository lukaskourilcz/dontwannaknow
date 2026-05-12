import { lazy, Suspense, useEffect, useState } from "react";
import TypeformWizard from "./components/TypeformWizard";
import ErrorBoundary from "./components/ErrorBoundary";
import { reportFor, type Person, type PersonReport } from "./lib/facts";
import { decodePeopleUrl } from "./lib/share";
import { LangProvider } from "./i18n/LangContext";
import { useLang } from "./i18n/useLang";
import "./styles.css";

// Code-split the heavy result page so the wizard loads fast.
const Results = lazy(() => import("./components/Results"));

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" role="tablist" aria-label="Language">
      <button
        type="button"
        role="tab"
        aria-selected={lang === "cs"}
        className={lang === "cs" ? "active" : ""}
        onClick={() => setLang("cs")}
      >
        CZ
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={lang === "en"}
        className={lang === "en" ? "active" : ""}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}

function AppInner() {
  const { t } = useLang();
  const [people, setPeople] = useState<Person[] | null>(null);
  const [reports, setReports] = useState<PersonReport[] | null>(null);

  const generate = (list: Person[]) => {
    setReports(list.map(reportFor));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const match = hash.match(/[#&]d=([A-Za-z0-9_-]+)/);
    if (!match) return;
    const decoded = decodePeopleUrl(match[1]);
    if (decoded && decoded.length > 0) {
      setPeople(decoded);
      generate(decoded);
    }
  }, []);

  const handleSubmit = (list: Person[]) => {
    setPeople(list);
    generate(list);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegenerate = () => {
    if (people) generate(people);
  };

  const handleReset = () => {
    setPeople(null);
    setReports(null);
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <div className="page">
      <div className="lang-bar">
        <LangToggle />
      </div>
      <header className="hero">
        <p className="eyebrow">{t("hero.eyebrow")}</p>
        <h1>{t("hero.title")}</h1>
        <p className="lede">{t("hero.lede")}</p>
      </header>

      <main>
        {!reports && <TypeformWizard onSubmit={handleSubmit} />}
        {reports && people && (
          <Suspense fallback={<div className="loading-fallback" role="status">Loading…</div>}>
            <Results
              reports={reports}
              people={people}
              onReset={handleReset}
              onRegenerate={handleRegenerate}
            />
          </Suspense>
        )}
      </main>

      <footer className="footer">
        <p>{t("footer")}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <AppInner />
      </LangProvider>
    </ErrorBoundary>
  );
}

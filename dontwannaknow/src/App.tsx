import { lazy, Suspense, useEffect, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import TypeformWizard from "./components/TypeformWizard";
import ErrorBoundary from "./components/ErrorBoundary";
import { reportFor, type Person, type PersonReport } from "./lib/facts";
import { decodePeopleUrl } from "./lib/share";
import { LangProvider } from "./i18n/LangContext";
import { useLang } from "./i18n/useLang";
// "NewForm" runs on an editorial type system: Inter (TWK Lausanne substitute)
// for all UI, body and chrome; Playfair Display (Editorial New substitute) for
// the literary display headlines; DM Serif Display (PP Mondwest substitute) for
// the rare architectural mega-statement. Imported here (not in main) so the dev
// console pulls only what it needs.
import "@fontsource-variable/inter/standard.css";
import "@fontsource-variable/inter/standard-italic.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/dm-serif-display/400.css";
import "./styles.css";

// Code-split the heavy result page so the wizard loads fast.
const Results = lazy(() => import("./components/Results"));

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduced = useReducedMotion();
  const [people, setPeople] = useState<Person[] | null>(null);
  const [reports, setReports] = useState<PersonReport[] | null>(null);

  const generate = (list: Person[]) => {
    // In a two-person comparison the shared world events live in the pair
    // card, so each individual report skips them to avoid repetition.
    const excludeWorld = list.length >= 2;
    setReports(list.map((p) => reportFor(p, excludeWorld)));
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
      <header className="nav-header">
        <button
          type="button"
          className="wordmark"
          onClick={handleReset}
          aria-label="dontwannaknow home"
        >
          <span className="wordmark-ink">dontwanna</span>
          <span className="wordmark-volt">know</span>
        </button>
      </header>

      <div className="lang-bar">
        <LangToggle />
      </div>

      <main>
        <AnimatePresence mode="wait" initial={false}>
          {!reports && (
            <m.div
              key="wizard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <TypeformWizard onSubmit={handleSubmit} />
            </m.div>
          )}
          {reports && people && (
            <m.div
              key="results"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Suspense
                fallback={
                  <div className="loading-fallback" role="status" aria-live="polite">
                    <span className="loading-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                }
              >
                <Results
                  reports={reports}
                  people={people}
                  onReset={handleReset}
                  onRegenerate={handleRegenerate}
                />
              </Suspense>
            </m.div>
          )}
        </AnimatePresence>
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
      <LazyMotion features={domAnimation} strict>
        <LangProvider>
          <AppInner />
        </LangProvider>
      </LazyMotion>
    </ErrorBoundary>
  );
}

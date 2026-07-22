import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import NewForm from "./components/NewForm";
import ErrorBoundary from "./components/ErrorBoundary";
import BrandMark from "./components/BrandMark";
import { decodeReportState, sanitizeAnalyticsUrl } from "./lib/share";
import type { Person } from "./lib/person";
import type { PersonReport } from "./lib/facts";
import { COPY } from "./copy";
import "@fontsource-variable/fraunces/standard.css";
import "@fontsource-variable/newsreader/standard.css";
import "@fontsource-variable/instrument-sans/standard.css";
import "./styles.css";

const Results = lazy(() => import("./components/Results"));
const EASE = [0.22, 1, 0.36, 1] as const;

function AppInner() {
  const reducedMotion = useReducedMotion();
  const [people, setPeople] = useState<Person[] | null>(null);
  const [reports, setReports] = useState<PersonReport[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const generate = useCallback(async (list: Person[]) => {
    setLoading(true);
    try {
      const { reportFor } = await import("./lib/facts");
      const excludeWorld = list.length > 1;
      setPeople(list);
      setReports(await Promise.all(list.map((person) => reportFor(person, excludeWorld))));
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    } catch (error) {
      console.error("Zprávu se nepodařilo vytvořit", error);
      setPeople(null);
      setReports(null);
      setShareError("Zprávu se nepodařilo vytvořit. Zkontrolujte údaje a zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }, [reducedMotion]);

  useEffect(() => {
    const match = window.location.hash.match(/[#&]r=([A-Za-z0-9_-]+)/);
    if (!match) return;
    const decoded = decodeReportState(match[1]);
    if (!decoded) {
      setShareError("Sdílený odkaz je neplatný nebo používá nepodporovaná data.");
      return;
    }
    void generate(decoded);
  }, [generate]);

  const reset = () => {
    setPeople(null);
    setReports(null);
    setShareError(null);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const showAnother = () => {
    if (!people) return;
    void generate(people.map((person) => ({ ...person, variant: person.variant + 1 })));
  };

  return (
    <div className="page site-shell">
      <a className="skip-link" href="#main-content">Přeskočit na hlavní obsah</a>
      <header className="nav-header site-header">
        <button type="button" className="brand-wordmark" onClick={reset} aria-label="Tehdejší svět — domů">
          <BrandMark className="brand-mark" />
          <span className="brand-wordmark-copy">
            <strong>{COPY.brand}</strong>
            <small>Osobní vydání</small>
          </span>
        </button>
        <span className="site-header-note">Česko a Ukrajina · 1920–současnost</span>
      </header>

      <main id="main-content">
        {shareError && <p className="app-notice" role="alert">{shareError}</p>}
        <AnimatePresence mode="wait" initial={false}>
          {!reports && !loading && (
            <m.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <NewForm onSubmit={(list) => void generate(list)} />
            </m.div>
          )}
          {loading && (
            <m.div key="loading" className="report-loading" role="status" aria-live="polite">
              <span className="loading-dots" aria-hidden="true"><i /><i /><i /></span>
              <p><strong>Připravujeme osobní vydání.</strong><span>Skládáme ověřené souvislosti do jednotlivých kapitol…</span></p>
            </m.div>
          )}
          {reports && people && !loading && (
            <m.div
              key="results"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: EASE }}
            >
              <Suspense fallback={<div className="report-loading" role="status">Načítáme kapitoly…</div>}>
                <Results reports={reports} people={people} onReset={reset} onRegenerate={showAnother} />
              </Suspense>
            </m.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer site-footer">
        <div>
          <strong>{COPY.brand}</strong>
          <p>{COPY.footer}</p>
        </div>
        <p className="footer-trust">{COPY.trust}</p>
      </footer>

      <Analytics beforeSend={(event) => ({ ...event, url: sanitizeAnalyticsUrl(event.url) })} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation} strict>
        <AppInner />
      </LazyMotion>
    </ErrorBoundary>
  );
}

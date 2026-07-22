import { useEffect, useState, type FormEvent } from "react";
import { useDevAuth } from "./devAuth";
import ContentEditor from "./ContentEditor";
import SettingsEditor from "./SettingsEditor";
import "@fontsource-variable/fraunces/standard.css";
import "@fontsource-variable/instrument-sans/standard.css";
import "./dev.css";

type Route = "content" | "settings";

function currentRoute(): Route {
  return window.location.pathname.replace(/\/+$/, "").endsWith("/settings")
    ? "settings"
    : "content";
}

export default function DevApp() {
  const { unlocked, tryUnlock, signOut } = useDevAuth();
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    const onPop = () => setRoute(currentRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: Route) => {
    window.history.pushState(null, "", to === "settings" ? "/dev/settings" : "/dev");
    setRoute(to);
  };

  if (!unlocked) return <PasswordGate onUnlock={tryUnlock} />;

  return (
    <div className="dev-app">
      <header className="dev-header">
        <div className="dev-brand">
          <strong>Tehdejší svět</strong>
          <span>redakční konzole</span>
        </div>
        <span className="dev-environment-badge">Lokální nástroj</span>
        <nav className="dev-nav">
          <button
            type="button"
            className={`dev-tab${route === "content" ? " active" : ""}`}
            onClick={() => navigate("content")}
          >
            Obsah
          </button>
          <button
            type="button"
            className={`dev-tab${route === "settings" ? " active" : ""}`}
            onClick={() => navigate("settings")}
          >
            Nastavení
          </button>
        </nav>
        <div className="dev-header-right">
          <a className="dev-link" href="/">
            ← Zpět do aplikace
          </a>
          <button className="dev-btn" type="button" onClick={signOut}>
            Zamknout
          </button>
        </div>
      </header>
      <main className="dev-main">
        {route === "content" ? <ContentEditor /> : <SettingsEditor />}
      </main>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => boolean }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!onUnlock(pw)) {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="dev-gate">
      <form className="dev-gate-card" onSubmit={submit}>
        <p className="dev-eyebrow">Tehdejší svět</p>
        <h1>Redakční konzole</h1>
        <p className="dev-gate-sub">Zadejte heslo pro správu obsahu a nastavení. Jde jen o vývojovou pojistku, ne zabezpečenou administraci.</p>
        <label className="dev-field">
          <span>Vývojové heslo</span>
          <input
            autoFocus
            type="password"
            className="dev-input"
            value={pw}
            aria-invalid={error}
            aria-describedby={error ? "dev-gate-error" : undefined}
            autoComplete="current-password"
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
          />
        </label>
        {error && <p className="dev-gate-error" id="dev-gate-error" role="alert">Nesprávné heslo.</p>}
        <button className="dev-btn dev-btn-primary" type="submit">
          Odemknout
        </button>
      </form>
    </div>
  );
}

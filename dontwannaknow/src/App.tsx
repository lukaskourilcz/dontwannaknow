import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Results from "./components/Results";
import { reportFor, type Person, type PersonReport } from "./lib/facts";
import { decodePeopleUrl } from "./lib/share";
import "./styles.css";

export default function App() {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [reports, setReports] = useState<PersonReport[] | null>(null);

  const generate = (list: Person[]) => {
    setReports(list.map(reportFor));
  };

  // On first load, see if there's a shareable URL hash and use it.
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
      <header className="hero">
        <p className="eyebrow">Don't wanna know · but you should</p>
        <h1>The world your people lived through</h1>
        <p className="lede">
          Enter a birth year and birthplace for yourself, your parents, your
          grandparents — and see the bizarre, the beautiful, and the everyday
          details of the world they were born into.
        </p>
      </header>

      <main>
        {!reports && <PersonForm onSubmit={handleSubmit} />}
        {reports && people && (
          <Results
            reports={reports}
            people={people}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>

      <footer className="footer">
        <p>Made with curiosity. Facts compiled from public historical data.</p>
      </footer>
    </div>
  );
}

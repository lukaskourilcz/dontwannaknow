import { useState } from "react";
import PersonForm from "./components/PersonForm";
import Results from "./components/Results";
import { reportFor, type Person, type PersonReport } from "./lib/facts";
import "./styles.css";

export default function App() {
  const [reports, setReports] = useState<PersonReport[] | null>(null);

  const handleSubmit = (people: Person[]) => {
    setReports(people.map(reportFor));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Don't wanna know · but you should</p>
        <h1>The world your people lived through</h1>
        <p className="lede">
          Enter a birth year for yourself, your parents, your grandparents — and
          see the bizarre, the beautiful, and the everyday details of the world
          they were born into.
        </p>
      </header>

      <main>
        {!reports && <PersonForm onSubmit={handleSubmit} />}
        {reports && <Results reports={reports} onReset={() => setReports(null)} />}
      </main>

      <footer className="footer">
        <p>Made with curiosity. Facts compiled from public historical data.</p>
      </footer>
    </div>
  );
}

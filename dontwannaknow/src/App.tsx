import { useState } from "react";
import TypeformEmbed from "./components/TypeformEmbed";

type Result = {
  momMeetingsLeft: number;
  grandmaMeetingsLeft: number;
};

export default function App() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAndCalculate = async () => {
    setLoading(true);

    const TOKEN = "your_pat_token";
    const FORM_ID = "abc123";
    const url = `https://api.typeform.com/forms/${FORM_ID}/responses?page_size=1`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const data = await res.json();

    const answers = data.items[0].answers;

    const userAge = Number(answers[0].text);
    const momAge = Number(answers[1].text);
    const grandmaAge = Number(answers[2].text);
    const momFreq = Number(answers[3].text);
    const grandmaFreq = Number(answers[4].text);

    const avgLife = 82;

    const momRemainingYears = avgLife - momAge;
    const grandmaRemainingYears = avgLife - grandmaAge;

    const momMeetingsLeft = momRemainingYears * momFreq;
    const grandmaMeetingsLeft = grandmaRemainingYears * grandmaFreq;

    setResult({ momMeetingsLeft, grandmaMeetingsLeft });
    setLoading(false);
  };

  return (
    <div>
      <h1>How much time left?</h1>
      <TypeformEmbed />

      {!result && (
        <button onClick={fetchAndCalculate} disabled={loading}>
          {loading ? "Loading..." : "See Results"}
        </button>
      )}

      {result && (
        <div>
          <p>
            You will likely see your mom about{" "}
            <strong>{result.momMeetingsLeft}</strong> more times.
          </p>
          <p>
            You will likely see your grandma about{" "}
            <strong>{result.grandmaMeetingsLeft}</strong> more times.
          </p>
        </div>
      )}
    </div>
  );
}

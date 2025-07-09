import { useState } from "react";

type FormData = {
  userAge: string;
  momAge: string;
  grandmaAge: string;
  momFreq: string;
  grandmaFreq: string;
};

type FormProps = {
  onSubmit: (data: FormData) => void;
};

export default function Form({ onSubmit }: FormProps) {
  const [userAge, setUserAge] = useState("");
  const [momAge, setMomAge] = useState("");
  const [grandmaAge, setGrandmaAge] = useState("");
  const [momFreq, setMomFreq] = useState("");
  const [grandmaFreq, setGrandmaFreq] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ userAge, momAge, grandmaAge, momFreq, grandmaFreq });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Your age"
        value={userAge}
        onChange={(e) => setUserAge(e.target.value)}
      />
      <input
        placeholder="Mom's age"
        value={momAge}
        onChange={(e) => setMomAge(e.target.value)}
      />
      <input
        placeholder="Grandma's age"
        value={grandmaAge}
        onChange={(e) => setGrandmaAge(e.target.value)}
      />
      <input
        placeholder="Meetings with mom (per year)"
        value={momFreq}
        onChange={(e) => setMomFreq(e.target.value)}
      />
      <input
        placeholder="Meetings with grandma (per year)"
        value={grandmaFreq}
        onChange={(e) => setGrandmaFreq(e.target.value)}
      />
      <button type="submit">Calculate</button>
    </form>
  );
}

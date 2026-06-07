import { useEffect, useRef, useState } from "react";
import { g, type Person, type Gender } from "../lib/facts";
import { COUNTRY_LABELS, type Country } from "../data/countryDecades";
import { citiesFor } from "../data/cities";
import { useLang } from "../i18n/useLang";

type Props = {
  onSubmit: (people: Person[]) => void;
};

const COUNTRY_ORDER: Country[] = ["CZ", "US", "ES", "UA", "CA", "MX", "INTL"];

type ParsedDate = { year: number; month?: number; day?: number };

const MIN_YEAR = 1900;
const CURRENT_YEAR = new Date().getFullYear();

function parseDate(input: string): ParsedDate | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const iso = trimmed.match(/^((?:18|19|20)\d{2})-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month, day };
  }
  const slash = trimmed.match(/^(0?[1-9]|[12]\d|3[01])[./](0?[1-9]|1[0-2])[./]((?:18|19|20)\d{2})$/);
  if (slash) {
    const day = Number(slash[1]);
    const month = Number(slash[2]);
    const year = Number(slash[3]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month, day };
  }
  const monthYear = trimmed.match(/^(0?[1-9]|1[0-2])[./-]((?:18|19|20)\d{2})$/);
  if (monthYear) {
    const month = Number(monthYear[1]);
    const year = Number(monthYear[2]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year, month };
  }
  const yearOnly = trimmed.match(/^(18|19|20)\d{2}$/);
  if (yearOnly) {
    const year = Number(yearOnly[0]);
    if (year < MIN_YEAR || year > CURRENT_YEAR) return null;
    return { year };
  }
  return null;
}

type Step = "intro" | "label" | "gender" | "year" | "country" | "city" | "more" | "review";

const STEP_ORDER: Step[] = ["label", "gender", "year", "country", "city"];

type DraftPerson = {
  label: string;
  gender: Gender;
  year: string;
  country: Country;
  citySlug: string;
};

const EMPTY_DRAFT: DraftPerson = {
  label: "",
  gender: "m",
  year: "",
  country: "CZ",
  citySlug: "",
};

// First person is "you", second is the person you compare your life with.
const DEFAULT_LABELS = ["Já", "Máma"];
const MAX_PEOPLE = 2;

export default function TypeformWizard({ onSubmit }: Props) {
  const { t, lang } = useLang();
  const [step, setStep] = useState<Step>("intro");
  const [people, setPeople] = useState<Person[]>([]);
  const [draft, setDraft] = useState<DraftPerson>({
    ...EMPTY_DRAFT,
    label: DEFAULT_LABELS[0],
  });
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  // Focus the input every time the step changes.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [step]);

  const goNext = () => {
    const i = STEP_ORDER.indexOf(step as Step);
    if (i < 0 || i === STEP_ORDER.length - 1) {
      setStep("more");
    } else {
      setStep(STEP_ORDER[i + 1]);
    }
  };

  const goBack = () => {
    setError(null);
    if (step === "intro") return;
    if (step === "review") return setStep("more");
    if (step === "more") return setStep("city");
    const i = STEP_ORDER.indexOf(step as Step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
    else setStep("intro");
  };

  const startWithEmpty = () => {
    setDraft({
      ...EMPTY_DRAFT,
      label: DEFAULT_LABELS[people.length] ?? "Another person",
    });
    setError(null);
    setStep("label");
  };

  const finalizeDraft = (): Person | null => {
    const parsed = parseDate(draft.year);
    if (!parsed) return null;
    return {
      label: draft.label.trim() || "Someone",
      gender: draft.gender,
      birthYear: parsed.year,
      birthMonth: parsed.month,
      birthDay: parsed.day,
      country: draft.country,
      citySlug: draft.citySlug || undefined,
    };
  };

  // Called when user clicks "Next" on the current step. Validates per step.
  const validateAndAdvance = () => {
    setError(null);
    if (step === "label") {
      if (!draft.label.trim()) {
        setError(t("form.err.empty"));
        return;
      }
      goNext();
      return;
    }
    if (step === "year") {
      const parsed = parseDate(draft.year);
      if (!parsed) {
        setError(t("form.err.date", { label: draft.label || "?" }));
        return;
      }
      goNext();
      return;
    }
    if (step === "country" || step === "city") {
      goNext();
      return;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndAdvance();
    }
  };

  const addPersonAndContinue = () => {
    const finalized = finalizeDraft();
    if (!finalized) {
      setError(t("form.err.date", { label: draft.label || "?" }));
      setStep("year");
      return;
    }
    setPeople((prev) => [...prev, finalized]);
    startWithEmpty();
  };

  const addPersonAndReview = () => {
    const finalized = finalizeDraft();
    if (!finalized) {
      setError(t("form.err.date", { label: draft.label || "?" }));
      setStep("year");
      return;
    }
    const next = [...people, finalized];
    setPeople(next);
    setStep("review");
  };

  const submit = (list: Person[]) => {
    if (list.length === 0) {
      setError(t("form.err.empty"));
      return;
    }
    onSubmit(list);
  };

  const totalSteps = STEP_ORDER.length;
  const currentIndex = step === "intro" ? 0 : step === "more" || step === "review"
    ? totalSteps
    : STEP_ORDER.indexOf(step as Step) + 1;
  const progressPct = Math.round((currentIndex / totalSteps) * 100);

  const cityOptions = citiesFor(draft.country);

  // ─── Rendering ─────────────────────────────────────────────────

  const QuestionLabel: Record<Step, { cs: string; en: string; hint?: { cs: string; en: string } }> = {
    intro: {
      cs: "Pojďme prozkoumat svět, kterým prošli tví blízcí.",
      en: "Let's explore the world your people lived through.",
    },
    label: {
      cs: "Jak budeme říkat první osobě?",
      en: "What shall we call the first person?",
      hint: { cs: "Třeba 'Babi', 'Děda', nebo 'Já'.", en: "E.g. 'Grandma', 'Grandpa', or 'You'." },
    },
    gender: {
      cs: `${draft.label || "Tahle osoba"} — muž, nebo žena?`,
      en: `${draft.label || "This person"} — man or woman?`,
      hint: { cs: "Aby texty zněly přirozeně.", en: "So the prose reads naturally." },
    },
    year: {
      cs: `Kdy se ${draft.label || "tahle osoba"} ${g(draft.gender, "narodil", "narodila")}?`,
      en: `When was ${draft.label || "this person"} born?`,
      hint: {
        cs: "Stačí rok. Nebo plné datum, např. 1953-04-12, 12/04/1953 nebo 04/1953.",
        en: "A year is fine. Or a full date — 1953-04-12, 12/04/1953, or 04/1953.",
      },
    },
    country: {
      cs: `V které zemi?`,
      en: `In which country?`,
    },
    city: {
      cs: cityOptions.length ? `A v jakém městě?` : `Pokračujme.`,
      en: cityOptions.length ? `And in which city?` : `Let's continue.`,
      hint: { cs: "Můžeš to klidně přeskočit.", en: "Feel free to skip." },
    },
    more: {
      cs: "Hotovo!",
      en: "Done!",
    },
    review: {
      cs: "Tvoje lidé",
      en: "Your people",
    },
  };

  const renderQuestionText = (s: Step) =>
    QuestionLabel[s][lang === "cs" ? "cs" : "en"];

  const renderHint = (s: Step) => {
    const h = QuestionLabel[s].hint;
    return h ? h[lang === "cs" ? "cs" : "en"] : null;
  };

  return (
    <div className="wizard">
      {step !== "intro" && step !== "review" && (
        <div className="wizard-progress">
          <div className="wizard-progress-bar" style={{ width: `${progressPct}%` }} />
          <p className="wizard-progress-text">
            {currentIndex} / {totalSteps}
          </p>
        </div>
      )}

      {step !== "intro" && step !== "review" && (
        <button type="button" className="wizard-back" onClick={goBack}>
          ← {lang === "cs" ? "Zpět" : "Back"}
        </button>
      )}

      <div className="wizard-screen" key={step}>
        {/* ── INTRO ────────────────────────────────── */}
        {step === "intro" && (
          <div className="wizard-intro">
            <h2 className="wizard-question">{renderQuestionText("intro")}</h2>
            <p className="wizard-lede">
              {lang === "cs"
                ? "Nejdřív pár otázek o tobě, pak o člověku, s kterým se chceš porovnat. Za dvě minuty uvidíš oba vaše světy vedle sebe."
                : "First a few questions about you, then about the person you want to compare with. In two minutes you'll see both your worlds side by side."}
            </p>
            <button
              type="button"
              className="primary wizard-cta"
              onClick={startWithEmpty}
            >
              {lang === "cs" ? "Začít" : "Begin"} →
            </button>
          </div>
        )}

        {/* ── LABEL ────────────────────────────────── */}
        {step === "label" && (
          <div className="wizard-step">
            <h2 className="wizard-question">
              {people.length === 0
                ? lang === "cs"
                  ? "Nejdřív ty — jak ti budeme říkat?"
                  : "First, you — what should we call you?"
                : lang === "cs"
                  ? "A s kým chceš svůj život porovnat?"
                  : "And who do you want to compare your life with?"}
            </h2>
            <p className="wizard-hint">
              {people.length === 0
                ? lang === "cs"
                  ? "Klidně nech „Já“."
                  : "“Me” is fine."
                : lang === "cs"
                  ? "Třeba Máma, Děda nebo kamarád."
                  : "E.g. Mom, Grandpa, or a friend."}
            </p>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="wizard-input"
              type="text"
              value={draft.label}
              placeholder={DEFAULT_LABELS[people.length] ?? "Mom"}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              onKeyDown={onKeyDown}
            />
            <div className="wizard-actions">
              <button className="primary" onClick={validateAndAdvance}>
                {lang === "cs" ? "Dál" : "Next"} →
              </button>
              <span className="wizard-enter-hint">
                {lang === "cs" ? "nebo stiskni Enter" : "or press Enter"}
              </span>
            </div>
          </div>
        )}

        {/* ── GENDER ──────────────────────────────── */}
        {step === "gender" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("gender")}</h2>
            <p className="wizard-hint">{renderHint("gender")}</p>
            <div className="wizard-country-grid wizard-gender-grid">
              {(
                [
                  ["m", lang === "cs" ? "Muž" : "Man"],
                  ["f", lang === "cs" ? "Žena" : "Woman"],
                ] as const
              ).map(([val, name]) => (
                <button
                  type="button"
                  key={val}
                  className={`country-card ${draft.gender === val ? "active" : ""}`}
                  onClick={() => {
                    setDraft({ ...draft, gender: val });
                    setTimeout(() => goNext(), 120);
                  }}
                >
                  <span className="country-card-name">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── YEAR ────────────────────────────────── */}
        {step === "year" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("year")}</h2>
            <p className="wizard-hint">{renderHint("year")}</p>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="wizard-input"
              type="text"
              inputMode="numeric"
              placeholder="1953"
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
              onKeyDown={onKeyDown}
            />
            <div className="wizard-actions">
              <button className="primary" onClick={validateAndAdvance}>
                {lang === "cs" ? "Dál" : "Next"} →
              </button>
              <span className="wizard-enter-hint">
                {lang === "cs" ? "nebo stiskni Enter" : "or press Enter"}
              </span>
            </div>
          </div>
        )}

        {/* ── COUNTRY ──────────────────────────────── */}
        {step === "country" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("country")}</h2>
            <div className="wizard-country-grid">
              {COUNTRY_ORDER.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`country-card ${draft.country === c ? "active" : ""}`}
                  onClick={() => {
                    setDraft({ ...draft, country: c, citySlug: "" });
                    setTimeout(() => goNext(), 120);
                  }}
                >
                  <span className="country-card-name">{COUNTRY_LABELS[c]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CITY ────────────────────────────────── */}
        {step === "city" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("city")}</h2>
            {cityOptions.length > 0 ? (
              <>
                <p className="wizard-hint">{renderHint("city")}</p>
                <select
                  ref={inputRef as React.RefObject<HTMLSelectElement>}
                  className="wizard-input wizard-select"
                  value={draft.citySlug}
                  onChange={(e) =>
                    setDraft({ ...draft, citySlug: e.target.value })
                  }
                  onKeyDown={onKeyDown}
                >
                  <option value="">
                    {lang === "cs" ? "Kdekoliv v zemi" : "Anywhere in the country"}
                  </option>
                  {cityOptions.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                      {c.aka ? ` (${c.aka})` : ""}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <p className="wizard-hint">
                {lang === "cs"
                  ? "Pro tuhle volbu nemáme seznam měst — to nevadí, pojďme dál."
                  : "We don't have a city list for this choice — that's fine, let's continue."}
              </p>
            )}
            <div className="wizard-actions">
              <button className="primary" onClick={validateAndAdvance}>
                {lang === "cs" ? "Dál" : "Next"} →
              </button>
              <button
                className="link"
                type="button"
                onClick={() => {
                  setDraft({ ...draft, citySlug: "" });
                  goNext();
                }}
              >
                {lang === "cs" ? "přeskočit" : "skip"}
              </button>
            </div>
          </div>
        )}


        {/* ── MORE: Add another, or finish? ─────────── */}
        {step === "more" && (
          <div className="wizard-step">
            <h2 className="wizard-question">
              {people.length < 1
                ? lang === "cs"
                  ? "Chceš svůj život s někým porovnat?"
                  : "Compare your life with someone?"
                : lang === "cs"
                  ? "Hotovo — máme oba."
                  : "Done — we've got both."}
            </h2>
            <p className="wizard-hint">
              {people.length < 1
                ? lang === "cs"
                  ? "Přidej druhou osobu k porovnání, nebo se rovnou podívej na svůj svět."
                  : "Add a second person to compare, or just see your own world."
                : lang === "cs"
                  ? "Ukážeme vaše dva světy vedle sebe."
                  : "We'll show your two worlds side by side."}
            </p>
            <div className="wizard-actions wizard-actions-row">
              {people.length < 1 && (
                <button className="secondary" type="button" onClick={addPersonAndContinue}>
                  {lang === "cs" ? "+ Přidat osobu k porovnání" : "+ Add a comparison"}
                </button>
              )}
              <button className="primary" type="button" onClick={addPersonAndReview}>
                {(people.length < 1
                  ? lang === "cs"
                    ? "Ukaž mi můj svět"
                    : "Show me my world"
                  : lang === "cs"
                    ? "Ukaž oba světy"
                    : "Show both worlds")}{" "}
                →
              </button>
            </div>
          </div>
        )}

        {/* ── REVIEW ──────────────────────────────── */}
        {step === "review" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("review")}</h2>
            <ul className="wizard-review-list">
              {people.map((p, i) => (
                <li key={i}>
                  <strong>{p.label}</strong> · {p.birthYear}
                  {p.birthMonth ? `-${String(p.birthMonth).padStart(2, "0")}` : ""}
                  {p.birthDay ? `-${String(p.birthDay).padStart(2, "0")}` : ""}{" "}
                  · {COUNTRY_LABELS[p.country]}
                  {p.citySlug ? ` · ${p.citySlug}` : ""}
                </li>
              ))}
            </ul>
            <div className="wizard-actions wizard-actions-row">
              {people.length < MAX_PEOPLE && (
                <button
                  className="secondary"
                  type="button"
                  onClick={() => {
                    startWithEmpty();
                  }}
                >
                  {lang === "cs" ? "+ Přidat osobu k porovnání" : "+ Add a comparison"}
                </button>
              )}
              <button
                className="primary"
                type="button"
                onClick={() => submit(people)}
              >
                {lang === "cs" ? "Ukaž mi jejich svět" : "Show me their world"} →
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="wizard-error">{error}</p>}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import type { Person } from "../lib/facts";
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

type Step = "intro" | "label" | "year" | "country" | "city" | "meetings" | "more" | "review";

const STEP_ORDER: Step[] = ["label", "year", "country", "city", "meetings"];

type DraftPerson = {
  label: string;
  year: string;
  country: Country;
  citySlug: string;
  meetings: string;
};

const EMPTY_DRAFT: DraftPerson = {
  label: "",
  year: "",
  country: "CZ",
  citySlug: "",
  meetings: "",
};

const DEFAULT_LABELS = ["You", "Mom", "Grandma"];

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
    if (step === "more") return setStep("meetings");
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
    const m = draft.meetings.trim() ? Number(draft.meetings.trim()) : undefined;
    return {
      label: draft.label.trim() || "Someone",
      birthYear: parsed.year,
      birthMonth: parsed.month,
      birthDay: parsed.day,
      country: draft.country,
      citySlug: draft.citySlug || undefined,
      meetingsPerYear: m !== undefined && !Number.isNaN(m) && m > 0 ? m : undefined,
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
    if (step === "country" || step === "city" || step === "meetings") {
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
    year: {
      cs: `Kdy se ${draft.label || "tahle osoba"} narodil/a?`,
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
    meetings: {
      cs: `Jak často ji/ho vídáš ročně?`,
      en: `How often do you see them per year?`,
      hint: {
        cs: "Volitelné. Pokud to vyplníš, spočítáme, kolik setkání ti s nimi nejspíš zbývá.",
        en: "Optional. If you fill this in, we'll estimate how many more meetings you've got left.",
      },
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
                ? "Pár otázek — kdo, kdy, kde — a ukážeme ti, čím ten člověk prošel. Stačí jedna osoba, ale klidně přidej víc."
                : "A few questions — who, when, where — and we'll show you the world they walked through. One person is enough; add more if you like."}
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
            <h2 className="wizard-question">{renderQuestionText("label")}</h2>
            <p className="wizard-hint">{renderHint("label")}</p>
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

        {/* ── MEETINGS ──────────────────────────────── */}
        {step === "meetings" && (
          <div className="wizard-step">
            <h2 className="wizard-question">{renderQuestionText("meetings")}</h2>
            <p className="wizard-hint">{renderHint("meetings")}</p>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="wizard-input"
              type="number"
              min={0}
              max={365}
              placeholder={lang === "cs" ? "např. 4" : "e.g. 4"}
              value={draft.meetings}
              onChange={(e) => setDraft({ ...draft, meetings: e.target.value })}
              onKeyDown={onKeyDown}
            />
            <div className="wizard-actions">
              <button className="primary" onClick={validateAndAdvance}>
                {lang === "cs" ? "Dál" : "Next"} →
              </button>
              <button
                className="link"
                type="button"
                onClick={() => {
                  setDraft({ ...draft, meetings: "" });
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
              {lang === "cs"
                ? `Skvělé. Přidat dalšího nebo se podívat na svět ${draft.label || "této osoby"}?`
                : `Great. Add another person, or see ${draft.label || "this person"}'s world?`}
            </h2>
            <p className="wizard-hint">
              {lang === "cs"
                ? "Můžeš porovnat víc lidí najednou — nebo skončit u jednoho."
                : "You can compare several people side by side — or stop at one."}
            </p>
            <div className="wizard-actions wizard-actions-row">
              <button className="secondary" type="button" onClick={addPersonAndContinue}>
                {lang === "cs" ? "+ Přidat další" : "+ Add another"}
              </button>
              <button className="primary" type="button" onClick={addPersonAndReview}>
                {lang === "cs" ? "Ukaž mi jejich svět" : "Show me their world"} →
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
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  startWithEmpty();
                }}
              >
                {lang === "cs" ? "+ Přidat dalšího" : "+ Add another"}
              </button>
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

import { useState } from "react";
import { genderForm, type Person, type Gender } from "../lib/facts";
import { COUNTRY_LABELS, type Country } from "../data/countryDecades";
import { citiesFor } from "../data/cities";
import { useLang } from "../i18n/useLang";
import { useAutoFocus } from "../lib/useAutoFocus";
import { CURRENT_YEAR } from "../lib/datetime";
import { settings } from "../config/settings";

type Props = {
  onSubmit: (people: Person[]) => void;
};

const COUNTRY_ORDER: Country[] = settings.countryOrder;

type ParsedDate = { year: number; month?: number; day?: number };

const MIN_YEAR = settings.minBirthYear;

// Accepts a bare year, month+year, or a full date written with any
// separators — 12. 4. 1953, 12/04/1953, 1953-04-12 — or none at all
// (12041953), since the mobile numeric keypad offers no punctuation.
function parseDate(input: string): ParsedDate | null {
  const groups = input.trim().match(/\d+/g);
  if (!groups) return null;

  const yearOk = (y: number) => y >= MIN_YEAR && y <= CURRENT_YEAR;
  const monthOk = (m: number) => m >= 1 && m <= 12;
  const dayOk = (y: number, m: number, d: number) =>
    d >= 1 && d <= new Date(Date.UTC(y, m, 0)).getUTCDate();

  const full = (y: number, m: number, d: number): ParsedDate | null =>
    yearOk(y) && monthOk(m) && dayOk(y, m, d) ? { year: y, month: m, day: d } : null;
  const partial = (y: number, m: number): ParsedDate | null =>
    yearOk(y) && monthOk(m) ? { year: y, month: m } : null;

  if (groups.length === 1) {
    const g = groups[0];
    if (g.length === 4) return yearOk(Number(g)) ? { year: Number(g) } : null;
    if (g.length === 6)
      return (
        partial(Number(g.slice(2)), Number(g.slice(0, 2))) ??
        partial(Number(g.slice(0, 4)), Number(g.slice(4)))
      );
    if (g.length === 8)
      return (
        full(Number(g.slice(4)), Number(g.slice(2, 4)), Number(g.slice(0, 2))) ??
        full(Number(g.slice(0, 4)), Number(g.slice(4, 6)), Number(g.slice(6)))
      );
    return null;
  }

  const n = groups.map(Number);
  if (groups.length === 2) {
    if (groups[0].length === 4) return partial(n[0], n[1]);
    return partial(n[1], n[0]);
  }
  if (groups.length === 3) {
    if (groups[0].length === 4) return full(n[0], n[1], n[2]);
    return full(n[2], n[1], n[0]);
  }
  return null;
}

type Step = "intro" | "label" | "gender" | "year" | "country" | "city" | "more";

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
const DEFAULT_LABELS = settings.defaultLabels;

export default function TypeformWizard({ onSubmit }: Props) {
  const { t, lang } = useLang();
  const [step, setStep] = useState<Step>("intro");
  const [people, setPeople] = useState<Person[]>([]);
  const [draft, setDraft] = useState<DraftPerson>({
    ...EMPTY_DRAFT,
    label: DEFAULT_LABELS[0],
  });
  const [error, setError] = useState<string | null>(null);
  // Move focus to the active field each time the wizard step changes.
  const inputRef = useAutoFocus<HTMLInputElement | HTMLSelectElement>(step);

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
    if (step === "more")
      return setStep(citiesFor(draft.country).length ? "city" : "country");
    const i = STEP_ORDER.indexOf(step as Step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
    else setStep("intro");
  };

  const startWithEmpty = (count = people.length) => {
    setDraft({
      ...EMPTY_DRAFT,
      label: DEFAULT_LABELS[count] ?? "Another person",
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
    const next = [...people, finalized];
    setPeople(next);
    // people state hasn't flushed yet, so pass the new count explicitly —
    // otherwise the second person inherits the first one's default name.
    startWithEmpty(next.length);
  };

  // Finalize the current draft and go straight to the report — no separate
  // review/confirm step.
  const addPersonAndFinish = () => {
    const finalized = finalizeDraft();
    if (!finalized) {
      setError(t("form.err.date", { label: draft.label || "?" }));
      setStep("year");
      return;
    }
    onSubmit([...people, finalized]);
  };

  const totalSteps = STEP_ORDER.length;
  const currentIndex = step === "intro" ? 0 : step === "more"
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
    },
    year: {
      cs: `Kdy se ${draft.label || "tahle osoba"} ${genderForm(draft.gender, "narodil", "narodila")}?`,
      en: `When was ${draft.label || "this person"} born?`,
      hint: {
        cs: "Stačí rok — třeba 1953. Celé datum zapiš jakkoliv: 12. 4. 1953, i bez mezer a teček.",
        en: "A year is enough — e.g. 1953. Or a full date in any form: 12 4 1953, even without spaces.",
      },
    },
    country: {
      cs: `V které zemi?`,
      en: `In which country?`,
    },
    city: {
      cs: `A v jakém městě?`,
      en: `And in which city?`,
      hint: { cs: "Můžeš to klidně přeskočit.", en: "Feel free to skip." },
    },
    more: {
      cs: "Hotovo!",
      en: "Done!",
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
      {step !== "intro" && (
        <div className="wizard-progress">
          <div className="wizard-progress-bar" style={{ width: `${progressPct}%` }} />
          <p className="wizard-progress-text">
            {currentIndex} / {totalSteps}
          </p>
        </div>
      )}

      {step !== "intro" && (
        <button type="button" className="wizard-back" onClick={goBack}>
          ← {lang === "cs" ? "Zpět" : "Back"}
        </button>
      )}

      <div className="wizard-screen" key={step}>
        {/* ── INTRO ────────────────────────────────── */}
        {step === "intro" && (
          <div className="wizard-intro">
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="wizard-hero-title">{t("hero.title")}</h1>
            <p className="wizard-lede">
              {lang === "cs"
                ? "Nejdřív pár otázek o tobě, pak o člověku, s kterým se chceš porovnat. Za dvě minuty uvidíš oba vaše světy vedle sebe."
                : "First a few questions about you, then about the person you want to compare with. In two minutes you'll see both your worlds side by side."}
            </p>
            <button
              type="button"
              className="primary wizard-cta"
              onClick={() => startWithEmpty()}
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
              onChange={(e) => {
                setError(null);
                setDraft({ ...draft, label: e.target.value });
              }}
              onKeyDown={onKeyDown}
              onFocus={(e) => e.currentTarget.select()}
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
              onChange={(e) => {
                setError(null);
                setDraft({ ...draft, year: e.target.value });
              }}
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
                    // No city list for this country → the city step would be
                    // an empty screen, so jump straight to the finish.
                    const next = citiesFor(c).length ? "city" : "more";
                    setTimeout(() => setStep(next as Step), 120);
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
                </option>
              ))}
            </select>
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
              <button className="primary" type="button" onClick={addPersonAndFinish}>
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
      </div>

      {error && <p className="wizard-error">{error}</p>}
    </div>
  );
}

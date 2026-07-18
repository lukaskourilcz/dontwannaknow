import { useState } from "react";
import type { Person, Gender } from "../lib/facts";
import { COUNTRY_LABELS, type Country } from "../data/countryDecades";
import { citiesFor } from "../data/cities";
import { parseDate } from "../lib/parseDate";
import { useLang } from "../i18n/useLang";
import { settings } from "../config/settings";

type Props = {
  onSubmit: (people: Person[]) => void;
};

const COUNTRY_ORDER: Country[] = settings.countryOrder;
const DEFAULT_LABELS = settings.defaultLabels;

// A short, chip-friendly country label. COUNTRY_LABELS.INTL spells out
// "Kdekoliv (jen globální fakta)" — too long for a pill — so we trim it.
function chipLabel(c: Country): string {
  if (c === "INTL") return "Kdekoliv";
  return COUNTRY_LABELS[c];
}

/**
 * The single-screen intake form. One pitch block and one card: birth year is
 * the only required field; name, gender, country and city sit below it, and a
 * second person can be tucked in for a side-by-side comparison. Replaces the
 * multi-step TypeformWizard — same data model, one screen.
 */
export default function NewForm({ onSubmit }: Props) {
  const { t, lang } = useLang();
  const [name, setName] = useState(DEFAULT_LABELS[0] ?? "Já");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState<Gender>("m");
  const [country, setCountry] = useState<Country>(COUNTRY_ORDER[0] ?? "CZ");
  const [citySlug, setCitySlug] = useState("");
  const [compareOpen, setCompareOpen] = useState(false);
  const [name2, setName2] = useState("");
  const [year2, setYear2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cityOptions = citiesFor(country);
  const compareYearValid = !!parseDate(year2);
  const isPair = compareOpen && compareYearValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseDate(year);
    if (!parsed) {
      setError(t("form.err.date2"));
      return;
    }
    setError(null);

    const primary: Person = {
      label: name.trim() || DEFAULT_LABELS[0] || "Já",
      gender,
      birthYear: parsed.year,
      birthMonth: parsed.month,
      birthDay: parsed.day,
      country,
      citySlug: citySlug || undefined,
    };

    const people: Person[] = [primary];

    // The comparison is a lightweight add-on: we only collect the second
    // person's name and year, and let them share the primary's country.
    if (compareOpen) {
      const parsed2 = parseDate(year2);
      if (parsed2) {
        people.push({
          label: name2.trim() || DEFAULT_LABELS[1] || "Druhá osoba",
          gender: "m",
          birthYear: parsed2.year,
          birthMonth: parsed2.month,
          birthDay: parsed2.day,
          country,
        });
      }
    }

    onSubmit(people);
  };

  const onCountryPick = (c: Country) => {
    setCountry(c);
    setCitySlug("");
  };

  const ctaLabel = isPair
    ? lang === "cs"
      ? "Ukázat oba světy"
      : "Show both worlds"
    : lang === "cs"
      ? "Ukázat můj svět"
      : "Show my world";

  return (
    <div className="newform">
      {/* ── pitch ─────────────────────────────────────────── */}
      <div className="newform-pitch">
        <p className="eyebrow">
          {lang === "cs"
            ? "Jeden rok. Jedno místo. Celý svět."
            : "One year. One place. A whole world."}
        </p>
        <h1 className="newform-title">
          {lang === "cs"
            ? "Jaký byl svět, když se narodili?"
            : "What was the world like when they were born?"}
        </h1>
        <p className="newform-lede">
          {lang === "cs"
            ? "Napiš rok narození a místo — a během vteřiny složíme svět, kterým prošli tví blízcí. Události, ceny, tváře a noční oblohu jejich dne."
            : "Enter a birth year and place — and in a second we'll assemble the world your people lived through. Events, prices, faces and the night sky of their day."}
        </p>
        <div className="newform-trust">
          <span className="trust-chip">
            <span className="trust-dot" />
            {lang === "cs" ? "Bez AI a serveru" : "No AI, no server"}
          </span>
          <span className="trust-chip">
            <span className="trust-dot" />
            {lang === "cs" ? "Vše ve tvém prohlížeči" : "All in your browser"}
          </span>
          <span className="trust-chip">
            <span className="trust-dot" />
            {lang === "cs" ? "Hotovo za 20 vteřin" : "Done in 20 seconds"}
          </span>
        </div>
      </div>

      {/* ── the one card ──────────────────────────────────── */}
      <div className="newform-card">
        <form onSubmit={handleSubmit} className="newform-form">
          {/* birth year — the hero field */}
          <div className="newform-field">
            <label className="newform-label" htmlFor="nf-year">
              {lang === "cs" ? "Rok narození" : "Birth year"}
              <span className="req"> *</span>
            </label>
            <input
              id="nf-year"
              className={`newform-year${error ? " has-error" : ""}`}
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                if (error) setError(null);
              }}
              inputMode="numeric"
              placeholder="1953"
              autoFocus
            />
            <p className="newform-help">
              {lang === "cs"
                ? "Stačí rok. Nebo celé datum: 12. 4. 1953."
                : "A year is enough. Or a full date: 12 4 1953."}
            </p>
          </div>

          {/* name + gender */}
          <div className="newform-namerow">
            <div className="newform-field">
              <label className="newform-label" htmlFor="nf-name">
                {lang === "cs" ? "Koho hledáme?" : "Who are we looking up?"}
              </label>
              <input
                id="nf-name"
                className="newform-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={DEFAULT_LABELS[0] ?? "Já"}
              />
            </div>
            <div className="seg-control" role="group" aria-label={lang === "cs" ? "Pohlaví" : "Gender"}>
              <button
                type="button"
                className={gender === "m" ? "active" : ""}
                aria-pressed={gender === "m"}
                onClick={() => setGender("m")}
              >
                {lang === "cs" ? "Muž" : "Man"}
              </button>
              <button
                type="button"
                className={gender === "f" ? "active" : ""}
                aria-pressed={gender === "f"}
                onClick={() => setGender("f")}
              >
                {lang === "cs" ? "Žena" : "Woman"}
              </button>
            </div>
          </div>

          {/* country chips */}
          <div className="newform-field">
            <label className="newform-label">
              {lang === "cs" ? "Země" : "Country"}
              <span className="req"> *</span>
            </label>
            <div className="chip-row">
              {COUNTRY_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip${country === c ? " active" : ""}`}
                  aria-pressed={country === c}
                  onClick={() => onCountryPick(c)}
                >
                  {chipLabel(c)}
                </button>
              ))}
            </div>
          </div>

          {/* city — optional, quiet; hidden when the country has no city list */}
          {cityOptions.length > 0 && (
            <div className="newform-field">
              <label className="newform-label" htmlFor="nf-city">
                {lang === "cs" ? "Město" : "City"}
                <span className="optional">
                  {" "}
                  · {lang === "cs" ? "nepovinné" : "optional"}
                </span>
              </label>
              <select
                id="nf-city"
                className="newform-select"
                value={citySlug}
                onChange={(e) => setCitySlug(e.target.value)}
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
            </div>
          )}

          {/* optional comparison, tucked away */}
          {compareOpen && (
            <div className="newform-compare">
              <div className="newform-compare-head">
                <span className="newform-label">
                  {lang === "cs" ? "Porovnat s druhou osobou" : "Compare with a second person"}
                </span>
                <button
                  type="button"
                  className="newform-remove"
                  onClick={() => setCompareOpen(false)}
                >
                  {lang === "cs" ? "odebrat" : "remove"}
                </button>
              </div>
              <div className="newform-compare-grid">
                <input
                  className="newform-name"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder={lang === "cs" ? "Babička" : "Grandma"}
                />
                <input
                  className="newform-name newform-year2"
                  value={year2}
                  onChange={(e) => setYear2(e.target.value)}
                  inputMode="numeric"
                  placeholder="1928"
                />
              </div>
            </div>
          )}

          {/* actions */}
          <div className="newform-actions">
            <button type="submit" className="primary newform-cta">
              {ctaLabel} →
            </button>
            {!compareOpen && (
              <button
                type="button"
                className="newform-ghost"
                onClick={() => setCompareOpen(true)}
              >
                {lang === "cs" ? "+ Porovnat s druhou osobou" : "+ Compare with a second person"}
              </button>
            )}
          </div>

          {error && <p className="newform-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

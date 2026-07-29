import { useState } from "react";
import { citiesFor } from "../data/cityCatalog";
import type { SupportedCountry } from "../data/countryDecades";
import { COPY } from "../copy";
import { parseDate } from "../lib/parseDate";
import {
  SUPPORTED_YEAR_RANGE,
  normalizePerson,
  validatePerson,
  type Person,
  type SubjectRelation,
} from "../lib/person";

type Props = { onSubmit: (people: Person[]) => void };

type Draft = {
  relationship: SubjectRelation;
  name: string;
  birthDate: string;
  country: SupportedCountry;
  citySlug: string;
};

/**
 * Editorial wording for the relationship control. Values stay the canonical
 * SubjectRelation keys; only the visible labels are person-centric here.
 */
const RELATIONSHIP_OPTIONS: ReadonlyArray<{ value: SubjectRelation; label: string }> = [
  { value: "mother", label: "Svět maminky" },
  { value: "father", label: "Svět tatínka" },
  { value: "grandmother", label: "Svět babičky" },
  { value: "grandfather", label: "Svět dědečka" },
  { value: "self", label: "Můj vlastní svět" },
  { value: "partner", label: "Svět partnera či partnerky" },
  { value: "friend", label: "Svět kamaráda či kamarádky" },
  { value: "other", label: "Svět někoho jiného" },
];

const emptyDraft = (relationship: SubjectRelation = "mother"): Draft => ({
  relationship,
  name: "",
  birthDate: "",
  country: "CZ",
  citySlug: "",
});

type DraftErrors = Partial<Record<"birthDate" | "city", string>>;

function PersonFields({
  draft,
  onChange,
  errors,
  prefix,
  heading,
}: {
  draft: Draft;
  onChange: (next: Draft) => void;
  errors: DraftErrors;
  prefix: string;
  heading?: string;
}) {
  const cityOptions = citiesFor(draft.country);
  const hintId = `${prefix}-date-hint`;
  const dateErrorId = `${prefix}-date-error`;
  const cityErrorId = `${prefix}-city-error`;
  const nameHintId = `${prefix}-name-hint`;

  return (
    <fieldset className="person-fields">
      {heading && <legend>{heading}</legend>}

      <div className="field-grid">
        <div className="field-group">
          <label className="field-index-label" htmlFor={`${prefix}-relationship`}>
            <span className="field-index" aria-hidden="true">01</span>
            <span className="field-name">Váš vztah k tomuto člověku</span>
          </label>
          <select
            id={`${prefix}-relationship`}
            value={draft.relationship}
            onChange={(event) => onChange({ ...draft, relationship: event.target.value as SubjectRelation })}
          >
            {RELATIONSHIP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <span className="field-hint">Vztah upraví oslovení, ale nemění výběr faktů.</span>
        </div>

        <div className="field-group">
          <label className="field-index-label" htmlFor={`${prefix}-birth-date`}>
            <span className="field-index" aria-hidden="true">02</span>
            <span className="field-name">Datum nebo rok narození</span>
          </label>
          <input
            id={`${prefix}-birth-date`}
            value={draft.birthDate}
            inputMode="numeric"
            aria-invalid={Boolean(errors.birthDate)}
            aria-describedby={`${hintId}${errors.birthDate ? ` ${dateErrorId}` : ""}`}
            onChange={(event) => onChange({ ...draft, birthDate: event.target.value })}
            placeholder="např. 12. 4. 1953 nebo 1953"
          />
          <span className="field-hint" id={hintId}>
            Stačí rok; celé datum navíc vypočte oblohu v den narození. Data od {SUPPORTED_YEAR_RANGE.min} do {SUPPORTED_YEAR_RANGE.max}.
          </span>
          {errors.birthDate && <span className="field-error" id={dateErrorId}>{errors.birthDate}</span>}
        </div>

        <div className="field-group">
          <span className="field-index-label">
            <span className="field-index" aria-hidden="true">03</span>
            <span className="field-name">Místo narození</span>
          </span>
          <div className="place-controls">
            <select
              value={draft.country}
              aria-label="Země narození"
              onChange={(event) => onChange({ ...draft, country: event.target.value as SupportedCountry, citySlug: "" })}
            >
              <option value="CZ">Česko</option>
              <option value="UA">Ukrajina</option>
            </select>
            <select
              id={`${prefix}-city`}
              value={draft.citySlug}
              aria-label="Město narození"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? cityErrorId : undefined}
              onChange={(event) => onChange({ ...draft, citySlug: event.target.value })}
            >
              <option value="">Vyberte město</option>
              {cityOptions.map((city) => <option key={city.slug} value={city.slug}>{city.name}</option>)}
            </select>
          </div>
          <span className="field-hint">Podporujeme pečlivě vybraná města v Česku a na Ukrajině.</span>
          {errors.city && <span className="field-error" id={cityErrorId}>{errors.city}</span>}
        </div>

        <div className="field-group">
          <label className="field-index-label" htmlFor={`${prefix}-name`}>
            <span className="field-index" aria-hidden="true">04</span>
            <span className="field-name">Křestní jméno <span className="field-optional">(nepovinné)</span></span>
          </label>
          <input
            id={`${prefix}-name`}
            value={draft.name}
            maxLength={60}
            autoComplete="off"
            aria-describedby={nameHintId}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Např. Marie"
          />
          <span className="field-hint" id={nameHintId}>Objeví se pouze na obálce vydání; do odkazu se nesdílí.</span>
        </div>
      </div>
    </fieldset>
  );
}

function personFromDraft(draft: Draft): { person?: Person; errors: DraftErrors } {
  const errors: DraftErrors = {};
  const parsed = parseDate(draft.birthDate);
  if (!parsed) {
    errors.birthDate = "Zadejte platný rok nebo datum narození.";
  } else if (parsed.year < SUPPORTED_YEAR_RANGE.min || parsed.year > SUPPORTED_YEAR_RANGE.max) {
    errors.birthDate = `Pro tento rok zatím nemáme dostatek ověřených dat.`;
  }
  if (!draft.citySlug) errors.city = "Vyberte město.";
  if (!parsed || Object.keys(errors).length) return { errors };

  const person = normalizePerson({
    relationship: draft.relationship,
    name: draft.name,
    birthYear: parsed.year,
    birthMonth: parsed.month,
    birthDay: parsed.day,
    country: draft.country,
    citySlug: draft.citySlug,
  });
  const validation = validatePerson(person);
  if (validation) errors.city = validation;
  return Object.keys(errors).length ? { errors } : { person, errors };
}

export default function NewForm({ onSubmit }: Props) {
  const [primary, setPrimary] = useState<Draft>(emptyDraft());
  const [secondary, setSecondary] = useState<Draft>(emptyDraft("grandmother"));
  const [comparison, setComparison] = useState(false);
  const [primaryErrors, setPrimaryErrors] = useState<DraftErrors>({});
  const [secondaryErrors, setSecondaryErrors] = useState<DraftErrors>({});

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const first = personFromDraft(primary);
    const second = comparison ? personFromDraft(secondary) : null;
    setPrimaryErrors(first.errors);
    setSecondaryErrors(second?.errors ?? {});
    if (!first.person || (comparison && !second?.person)) {
      window.requestAnimationFrame(() => {
        const invalidId = first.errors.birthDate
          ? "person-a-birth-date"
          : first.errors.city
            ? "person-a-city"
            : second?.errors.birthDate
              ? "person-b-birth-date"
              : "person-b-city";
        document.getElementById(invalidId)?.focus();
      });
      return;
    }
    onSubmit(second?.person ? [first.person, second.person] : [first.person]);
  };

  return (
    <div className="onboarding">
      <section className="onboarding-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{COPY.heroQuestion}</h1>
          <p className="hero-positioning">{COPY.positioning}</p>
          <p className="hero-description">{COPY.description}</p>
        </div>
        <figure className="hero-archive-motif" aria-hidden="true">
          <div className="hero-plate">
            <picture>
              <source
                media="(max-width: 980px)"
                srcSet="/media/hero-editorial-mobile.webp"
                width="800"
                height="600"
              />
              <img
                src="/media/hero-editorial-desktop.webp"
                width="720"
                height="900"
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>
          <figcaption>
            <span>Obr. 01 — dobový archiv</span>
            <span>1920–současnost</span>
          </figcaption>
        </figure>
      </section>

      <form className="person-form" onSubmit={submit} noValidate aria-label="Údaje pro osobní vydání">
        <div className="form-heading">
          <h2>Začněte tím, co bezpečně víte</h2>
          <span className="form-heading-note">Stačí rok a město</span>
        </div>

        <PersonFields
          draft={primary}
          onChange={(next) => { setPrimary(next); setPrimaryErrors({}); }}
          errors={primaryErrors}
          prefix="person-a"
        />

        {comparison && (
          <div className="comparison-form-section">
            <div className="comparison-form-heading">
              <div>
                <span className="form-overline">Dva tehdejší světy</span>
                <h2>Druhý člověk</h2>
                <p>Ukážeme společné i odlišné souvislosti bez soutěžního hodnocení.</p>
              </div>
              <button type="button" className="text-button" onClick={() => setComparison(false)}>
                Odebrat
              </button>
            </div>
            <PersonFields
              draft={secondary}
              onChange={(next) => { setSecondary(next); setSecondaryErrors({}); }}
              errors={secondaryErrors}
              prefix="person-b"
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary form-submit">
            {comparison ? "Vytvořit dvě osobní vydání" : "Vytvořit osobní vydání"}
          </button>
          {!comparison && (
            <button type="button" className="secondary" onClick={() => setComparison(true)}>
              Přidat druhého člověka pro porovnání
            </button>
          )}
        </div>

        <p className="privacy-line">
          <span className="privacy-lock" aria-hidden="true">✓</span>
          Nic, co zadáte do formuláře, se neposílá na server. Zpráva vzniká přímo ve vašem prohlížeči.
        </p>
      </form>
    </div>
  );
}

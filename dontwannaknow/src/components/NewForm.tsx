import { useId, useState } from "react";
import { citiesFor } from "../data/cityCatalog";
import type { SupportedCountry } from "../data/countryDecades";
import { COPY } from "../copy";
import { parseDate } from "../lib/parseDate";
import {
  RELATIONSHIPS,
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

      <fieldset className="form-section choice-fieldset relationship-section">
        <legend className="field-label">Jaký je váš vztah k tomuto člověku?</legend>
        <div className="relationship-grid">
          {RELATIONSHIPS.map((relation) => (
            <label
              key={relation.value}
              className={`relationship-chip${draft.relationship === relation.value ? " active" : ""}`}
            >
              <input
                className="choice-input"
                type="radio"
                name={`${prefix}-relationship`}
                value={relation.value}
                checked={draft.relationship === relation.value}
                onChange={() => onChange({ ...draft, relationship: relation.value })}
              />
              <span>{relation.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <label className="form-field" htmlFor={`${prefix}-name`}>
          <span className="field-label">Jak se tento člověk jmenuje?</span>
          <input
            id={`${prefix}-name`}
            value={draft.name}
            maxLength={60}
            autoComplete="off"
            aria-describedby={nameHintId}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Křestní jméno (nepovinné)"
          />
          <span className="field-hint" id={nameHintId}>Jméno upraví oslovení na obálce, ale nemění výběr faktů.</span>
        </label>

        <label className="form-field" htmlFor={`${prefix}-birth-date`}>
          <span className="field-label">Kdy se narodil?</span>
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
            Stačí rok. Pokrýváme ověřená data od {SUPPORTED_YEAR_RANGE.min} do {SUPPORTED_YEAR_RANGE.max}.
          </span>
          {errors.birthDate && <span className="field-error" id={dateErrorId}>{errors.birthDate}</span>}
        </label>

        <fieldset className="form-field choice-fieldset country-field">
          <legend className="field-label">Ve které dnešní zemi se narodil?</legend>
          <div className="country-options">
            {(["CZ", "UA"] as const).map((country) => (
              <label
                key={country}
                className={`country-option${draft.country === country ? " active" : ""}`}
              >
                <input
                  className="choice-input"
                  type="radio"
                  name={`${prefix}-country`}
                  value={country}
                  checked={draft.country === country}
                  onChange={() => onChange({ ...draft, country, citySlug: "" })}
                />
                <span className="country-code" aria-hidden="true">{country}</span>
                <span>{country === "CZ" ? "Česko" : "Ukrajina"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="form-field" htmlFor={`${prefix}-city`}>
          <span className="field-label">Ve kterém městě?</span>
          <select
            id={`${prefix}-city`}
            value={draft.citySlug}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? cityErrorId : undefined}
            onChange={(event) => onChange({ ...draft, citySlug: event.target.value })}
          >
            <option value="">Vyberte město</option>
            {cityOptions.map((city) => <option key={city.slug} value={city.slug}>{city.name}</option>)}
          </select>
          {errors.city && <span className="field-error" id={cityErrorId}>{errors.city}</span>}
        </label>
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
  const formId = useId();
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
      <section className="onboarding-hero" aria-labelledby={`${formId}-title`}>
        <p className="hero-kicker">Soukromé osobní vydání</p>
        <h1 id={`${formId}-title`}>{COPY.heroQuestion}</h1>
        <p className="hero-positioning">{COPY.positioning}</p>
        <p className="hero-description">{COPY.description}</p>
        <div className="hero-archive-motif" aria-hidden="true">
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
        <ul className="trust-index" aria-label="Soukromí, metoda a rozsah">
          <li><span>01</span><strong>Jen ve vašem prohlížeči</strong><small>Nic z formuláře se neposílá na server.</small></li>
          <li><span>02</span><strong>Bez AI při tvorbě zprávy</strong><small>Výběr je deterministický a vychází z místních dat.</small></li>
          <li><span>03</span><strong>Česko a Ukrajina</strong><small>Podporujeme pečlivě vybraná města od roku 1920.</small></li>
        </ul>
      </section>

      <form className="person-form-card" onSubmit={submit} noValidate aria-label="Údaje pro osobní vydání">
        <div className="form-introduction">
          <p className="form-overline">První člověk</p>
          <h2>Začněte tím, co bezpečně víte</h2>
          <p>Stačí rok a město narození. Jméno i přesný den jsou nepovinné.</p>
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

        <div className="privacy-note">
          <span className="privacy-lock" aria-hidden="true">✓</span>
          <div>
            <strong>Soukromě ve vašem prohlížeči</strong>
            <p>{COPY.privacy}</p>
          </div>
        </div>
      </form>
    </div>
  );
}

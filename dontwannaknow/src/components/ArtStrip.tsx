import { ageInBirthYear, type Artwork } from "../data/artByDecade";
import { useLang } from "../i18n/useLang";

/**
 * "Sto let před tebou" — public-domain paintings that had turned roughly a
 * century old the year the person was born. Each work shows its true age in
 * that year (so the "turned 100" line is always accurate). Images are
 * desaturated to sit inside the monochrome NewForm canvas (DESIGN.md: imagery
 * is black-and-white / desaturated), lifting to colour on hover.
 */
export default function ArtStrip({
  items,
  birthYear,
}: {
  items: Artwork[];
  birthYear: number;
}) {
  const { lang } = useLang();
  if (!items.length) return null;
  const show = items.slice(0, 3);

  const intro =
    lang === "cs"
      ? `Obrazy, kterým bylo v roce tvého narození kolem sta let.`
      : `Paintings that were about a hundred years old the year you were born.`;

  return (
    <div className="art-strip-wrap">
      <p className="art-intro">{intro}</p>
      <div className="art-strip">
        {show.map((a, i) => {
          const age = ageInBirthYear(a, birthYear);
          const ageLine =
            lang === "cs"
              ? `V roce ${birthYear} mu bylo ${age} let`
              : `Turned ${age} the year you were born`;
          return (
            <figure className="art-item" key={`${a.source}-${i}`}>
              <a
                href={a.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="art-frame"
              >
                <img src={a.image} alt={a.title} loading="lazy" decoding="async" />
              </a>
              <figcaption>
                <span className="art-title">{a.title}</span>
                <span className="art-meta">
                  {a.artist} · {a.year}
                </span>
                <span className="art-age">{ageLine}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

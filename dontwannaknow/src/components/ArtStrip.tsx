import { ageInBirthYear, type Artwork } from "../data/artByDecade";

/**
 * "Sto let před tebou" — public-domain paintings that had turned roughly a
 * century old the year the person was born. Each work shows its true age in
 * that year (so the "turned 100" line is always accurate). Images are
 * gently desaturated to sit inside the warm editorial canvas, lifting toward
 * the source colour on hover.
 */
export default function ArtStrip({
  items,
  birthYear,
}: {
  items: Artwork[];
  birthYear: number;
}) {
  if (!items.length) return null;
  const show = items.slice(0, 3);

  return (
    <div className="art-strip-wrap">
      <p className="art-intro">
        Obrazy, kterým bylo v roce narození tohoto člověka kolem sta let.
      </p>
      <div className="art-strip">
        {show.map((a, i) => {
          const age = ageInBirthYear(a, birthYear);
          const ageLine = `V roce ${birthYear} bylo obrazu ${age} let`;
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

import { ageInBirthYear, type Artwork } from "../data/artByDecade";
import type { CityImage } from "../data/cityImages";

/**
 * "Sto let před tebou" — public-domain paintings that had turned roughly a
 * century old the year the person was born. Each work shows its true age in
 * that year (so the "turned 100" line is always accurate). Images are
 * gently desaturated to sit inside the warm editorial canvas, lifting toward
 * the source colour on hover.
 */
type ArtStripProps = {
  variant: "art";
  items: Artwork[];
  birthYear: number;
} | {
  variant: "city";
  items: CityImage[];
  birthYear: number;
};

export default function ArtStrip(props: ArtStripProps) {
  if (!props.items.length) return null;
  return (
    <div className="art-strip-wrap">
      <div className="art-strip">
        {props.variant === "city" ? props.items.slice(0, 3).map((image) => (
          <figure className="art-item" key={image.id}>
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="art-frame"
            >
              <img
                src={`/data/images/${image.file}`}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption>
              <span className="art-title">{image.caption}</span>
              <span className="art-meta">{image.attribution}</span>
              <span className="art-meta">
                <a href={image.licenceUrl} target="_blank" rel="noopener noreferrer">
                  {image.licence}
                </a>
                {" · "}
                <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Zdroj fotografie
                </a>
              </span>
            </figcaption>
          </figure>
        )) : props.items.slice(0, 3).map((artwork, i) => {
          const age = ageInBirthYear(artwork, props.birthYear);
          return (
            <figure className="art-item" key={`${artwork.source}-${i}`}>
              <a
                href={artwork.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="art-frame"
              >
                <img src={artwork.image} alt={artwork.title} loading="lazy" decoding="async" />
              </a>
              <figcaption>
                <span className="art-title">{artwork.title}</span>
                <span className="art-meta">
                  {artwork.artist} · {artwork.year} · v roce {props.birthYear} bylo obrazu {age} let
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

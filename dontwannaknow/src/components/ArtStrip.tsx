import type { Artwork } from "../data/artByDecade";

/**
 * "Umění té doby" — a small row of public-domain artworks created in the
 * person's birth decade. Images are desaturated to sit inside the monochrome
 * NewForm canvas (DESIGN.md: imagery is black-and-white / desaturated), lifting
 * to colour on hover. Each links to the museum's page in a new tab.
 */
export default function ArtStrip({ items }: { items: Artwork[] }) {
  if (!items.length) return null;
  const show = items.slice(0, 3);
  return (
    <div className="art-strip">
      {show.map((a, i) => (
        <figure className="art-item" key={`${a.source}-${i}`}>
          <a href={a.pageUrl} target="_blank" rel="noopener noreferrer" className="art-frame">
            <img src={a.image} alt={a.title} loading="lazy" decoding="async" />
          </a>
          <figcaption>
            <span className="art-title">{a.title}</span>
            <span className="art-meta">
              {a.artist} · {a.year}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

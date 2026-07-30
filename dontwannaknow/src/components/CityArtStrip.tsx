import { useEffect, useState } from "react";
import { artForBirthYear } from "../data/artByDecade";
import { decadeForYear, loadCityImages, type CityImage } from "../data/cityImages";
import ArtStrip from "./ArtStrip";

export default function CityArtStrip({
  citySlug,
  cityName,
  birthYear,
}: {
  citySlug: string;
  cityName: string;
  birthYear: number;
}) {
  const [images, setImages] = useState<CityImage[] | null>(null);

  useEffect(() => {
    let active = true;
    setImages(null);
    loadCityImages(citySlug, birthYear)
      .then((records) => {
        if (active) setImages(records);
      })
      .catch(() => {
        if (active) setImages([]);
      });
    return () => {
      active = false;
    };
  }, [birthYear, citySlug]);

  if (images === null) {
    return (
      <div className="chapter-visual" role="status" aria-live="polite">
        <div className="visual-placeholder">Načítáme obraz města…</div>
      </div>
    );
  }

  if (images.length) {
    return (
      <div className="chapter-visual">
        <div className="chapter-visual-head">
          <h3>Město těch let</h3>
          <span className="chapter-visual-note">
            {cityName} · {decadeForYear(birthYear)}–{decadeForYear(birthYear) + 9}
          </span>
        </div>
        <ArtStrip variant="city" items={images} birthYear={birthYear} />
      </div>
    );
  }

  const art = artForBirthYear(birthYear);
  if (!art.length) return null;
  return (
    <div className="chapter-visual">
      <div className="chapter-visual-head">
        <h3>Umění, které už tehdy mělo svůj příběh</h3>
        <span className="chapter-visual-note">Obrazům bylo kolem sta let</span>
      </div>
      <ArtStrip variant="art" items={art} birthYear={birthYear} />
    </div>
  );
}

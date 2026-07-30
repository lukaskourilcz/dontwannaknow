import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CityArtStrip from "./CityArtStrip";

describe("CityArtStrip", () => {
  it("zobrazí přesný pražský snímek s českým altem, zdrojem a licencí", async () => {
    render(<CityArtStrip citySlug="prague" cityName="Praha" birthYear={1953} />);

    expect(await screen.findByRole("heading", { name: "Město těch let" })).toBeInTheDocument();
    const image = screen.getByAltText(/dětí hrajících kuličky/i);
    expect(image).toHaveAttribute(
      "src",
      "/data/images/prague/1950/prague-1950-kulicky-u-rudolfina.webp",
    );
    expect(image).toHaveAttribute("loading", "lazy");
    expect(screen.getByRole("link", { name: "CC BY-SA 3.0" })).toHaveAttribute(
      "href",
      "https://creativecommons.org/licenses/by-sa/3.0",
    );
    expect(screen.getByRole("link", { name: "Zdroj fotografie" })).toHaveAttribute(
      "href",
      expect.stringContaining("commons.wikimedia.org/wiki/File:"),
    );
  });

  it("pro nepokryté město zachová původní umělecký fallback", async () => {
    render(<CityArtStrip citySlug="usti-nad-labem" cityName="Ústí nad Labem" birthYear={1953} />);
    expect(await screen.findByRole("heading", {
      name: "Umění, které už tehdy mělo svůj příběh",
    })).toBeInTheDocument();
  });
});

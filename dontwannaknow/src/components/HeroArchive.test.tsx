import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroArchive from "./HeroArchive";

describe("HeroArchive", () => {
  it("shows the static poster and stays decorative without WebGL", () => {
    const { container } = render(<HeroArchive highlightYear={1953} />);

    const motif = container.querySelector(".hero-archive-motif");
    expect(motif).toBeInTheDocument();
    expect(motif).toHaveAttribute("aria-hidden", "true");

    // The poster is the fallback every browser gets, so it must not depend on
    // the scene loading, and it must never advertise itself to assistive tech.
    const poster = container.querySelector("img");
    expect(poster).toHaveAttribute("src", "/media/hero-editorial-desktop.webp");
    expect(poster).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("does not mount the scene when the browser cannot run WebGL", () => {
    const { container } = render(<HeroArchive highlightYear={null} />);
    expect(container.querySelector(".hero-scene")).toBeNull();
  });
});

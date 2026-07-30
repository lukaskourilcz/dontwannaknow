// Akceptační scénáře ze zadání modernizace: zpráva pro Prahu 1953 a Charkov
// 1991 nese profily lídrů, rozlišení jistoty a rozbalitelné zdroje — a nic,
// co by působilo jako výplň (holé datum bez příběhu na čelných místech).
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";
import Results from "./Results";

vi.mock("./SharePanel", () => ({ default: () => null }));
vi.mock("./WorldMap", () => ({ default: () => <div data-testid="world-map" /> }));
vi.mock("./SkyMap", () => ({ default: () => <div data-testid="sky-map" /> }));
vi.mock("./LifeNumbers", () => ({ default: () => <div data-testid="life-numbers" /> }));
vi.mock("./CityArtStrip", () => ({ default: () => <div data-testid="art-strip" /> }));

describe("acceptance: Praha 1953 a Charkov 1991", () => {
  const prague = makePerson({ country: "CZ", citySlug: "prague", birthYear: 1953, birthMonth: 4, birthDay: 12 });
  const kharkiv = makePerson({ country: "UA", citySlug: "kharkiv", birthYear: 1991 });
  let pragueReport: Awaited<ReturnType<typeof reportFor>>;
  let kharkivReport: Awaited<ReturnType<typeof reportFor>>;

  beforeAll(async () => {
    pragueReport = await reportFor(prague);
    kharkivReport = await reportFor(kharkiv);
  });

  it("shows a leader profile with sourced, dated reception for 1953 Prague", () => {
    const { container } = render(<Results reports={[pragueReport]} people={[prague]} />);
    // Profil sídlí ve sbalené kapitole širších souvislostí — otevřít.
    // jsdom při programovém otevření <details> nevystřelí toggle, doplníme ho.
    const context = pragueReport.chapters.find((chapter) => chapter.id === "generation-context")!;
    fireEvent.click(screen.getByRole("button", { name: new RegExp(context.title) }));
    const details = container.querySelector<HTMLDetailsElement>("#generation-context")!;
    fireEvent(details, new Event("toggle", { bubbles: false }));
    const profile = container.querySelector(".leader-profile");
    expect(profile).not.toBeNull();
    expect(profile?.textContent).toContain("Dobové vnímání");
    expect(profile?.querySelector(".leader-source-link")).not.toBeNull();
    const leaderItems = pragueReport.chapters
      .flatMap((chapter) => chapter.items)
      .filter((item) => item.leader);
    expect(leaderItems.length).toBeGreaterThan(0);
    expect(leaderItems.every((item) => item.metadata.shareSafe === false)).toBe(true);
    expect(leaderItems.every((item) => item.metadata.chapter === "generation-context")).toBe(true);
  });

  it("keeps source confidence out of the reading surface entirely", () => {
    const { container } = render(<Results reports={[pragueReport]} people={[prague]} />);
    // Žádné zdrojové značky ani odkazy v řádcích — jistota původu žije
    // v datech a auditu, čtenářská plocha zůstává čistá.
    expect(container.querySelectorAll(".item-confidence").length).toBe(0);
    expect(container.querySelectorAll(".item-depth .item-source").length).toBe(0);
  });

  it("keeps chapter budgets at 4–8 items despite richer data", () => {
    for (const report of [pragueReport, kharkivReport]) {
      for (const chapter of report.chapters) {
        if (chapter.id === "life-numbers") continue;
        expect(chapter.items.length, `${report.person.citySlug} ${chapter.id}`).toBeLessThanOrEqual(8);
        expect(chapter.items.length, `${report.person.citySlug} ${chapter.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("gives the 1991 Kharkiv report a leader profile and scored ranking", () => {
    const leaderItems = kharkivReport.chapters
      .flatMap((chapter) => chapter.items)
      .filter((item) => item.leader);
    expect(leaderItems.length).toBeGreaterThan(0);
    const scored = kharkivReport.chapters
      .flatMap((chapter) => chapter.items)
      .filter((item) => item.relevance);
    expect(scored.length).toBeGreaterThan(5);
  });

  it("fills the 1991 Kharkiv everyday chapters with real decade texture, not fallbacks", () => {
    for (const chapterId of ["everyday-day", "different-from-today"] as const) {
      const chapter = kharkivReport.chapters.find((candidate) => candidate.id === chapterId)!;
      const realItems = chapter.items.filter((item) => !item.id.startsWith("fallback-"));
      expect(realItems.length, chapterId).toBeGreaterThanOrEqual(4);
    }
  });
});

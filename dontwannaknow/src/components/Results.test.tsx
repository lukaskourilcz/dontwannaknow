import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { COPY } from "../copy";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";
import Results from "./Results";

vi.mock("./SharePanel", () => ({ default: () => null }));
vi.mock("./WorldMap", () => ({ default: () => <div data-testid="world-map" /> }));
vi.mock("./SkyMap", () => ({ default: () => <div data-testid="sky-map" /> }));
vi.mock("./LifeNumbers", () => ({ default: () => <div data-testid="life-numbers" /> }));
vi.mock("./ArtStrip", () => ({ default: () => <div data-testid="art-strip" /> }));

describe("Results", () => {
  const person = makePerson();
  let report: Awaited<ReturnType<typeof reportFor>>;

  beforeAll(async () => {
    report = await reportFor(person);
  });

  it("gives every visible report text one home", () => {
    const { container } = render(
      <Results
        reports={[report]}
        people={[person]}
        onReset={vi.fn()}
        onRegenerate={vi.fn()}
      />,
    );

    const exactOccurrences = (text: string) => [...container.querySelectorAll("p, li")]
      .filter((element) => element.textContent?.replace(/\s+/g, " ").trim() === text).length;

    expect(report.shareItem).not.toBeNull();
    expect(exactOccurrences(report.shareItem!.text)).toBe(1);
    expect(exactOccurrences(COPY.methodology)).toBe(1);
    expect(container.textContent).not.toMatch(/\b01\s*·\s*01\s*·/);

    const milestoneItem = report.milestones.flatMap((milestone) => milestone.items)[0];
    expect(milestoneItem).toBeDefined();
    expect(exactOccurrences(milestoneItem!.text)).toBe(1);

    const mapItem = report.chapters
      .flatMap((chapter) => chapter.items)
      .find((item) => item.text.startsWith("V roce narození na mapě ještě existoval stát"));
    expect(mapItem).toBeDefined();
    expect(exactOccurrences(mapItem!.text)).toBe(0);

    const context = report.chapters.find((chapter) => chapter.id === "generation-context")!;
    const contextHeadings = screen.getAllByRole("heading", { name: context.title });
    expect(contextHeadings).toHaveLength(1);

    const details = contextHeadings[0].closest("details")!;
    expect(details.open).toBe(false);
    fireEvent.click(details.querySelector("summary")!);
    fireEvent(details, new Event("toggle", { bubbles: true }));
    expect(details.open).toBe(true);
    expect(details.querySelector(".chapter-content-expanded .chapter-header")).toBeNull();
    expect(details.querySelectorAll(".chapter-content-expanded .chapter-intro")).toHaveLength(1);

  });

  it("opens a collapsed chapter from the ordered chapter navigation", () => {
    const { container } = render(
      <Results
        reports={[report]}
        people={[person]}
        onReset={vi.fn()}
        onRegenerate={vi.fn()}
      />,
    );
    const context = report.chapters.find((chapter) => chapter.id === "generation-context")!;
    const details = container.querySelector<HTMLDetailsElement>(`#${context.id}`)!;

    expect(details.open).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(context.title) }));
    expect(details.open).toBe(true);
  });

  it("shows an honest birthday-sky fallback for a year-only report", () => {
    render(
      <Results
        reports={[report]}
        people={[person]}
        onReset={vi.fn()}
        onRegenerate={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(`Rok narození ${person.birthYear}`)).toBeInTheDocument();
    expect(screen.getByText("Pro zobrazení oblohy zadejte celé datum narození.")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Noční obloha/)).not.toBeInTheDocument();
  });

  it("renders stable comparison columns for two identical contexts", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { container } = render(
      <Results
        reports={[report, report]}
        people={[person, person]}
        onReset={vi.fn()}
        onRegenerate={vi.fn()}
      />,
    );

    expect(container.querySelectorAll(".comparison-people > article")).toHaveLength(2);
    expect(container.querySelectorAll(".comparison-chapter")).toHaveLength(7);
    expect(screen.getByRole("navigation", { name: "Kapitoly srovnání" })).toBeInTheDocument();
    const factTexts = [...container.querySelectorAll(".comparison-report .report-item p")]
      .map((element) => element.textContent?.replace(/\s+/g, " ").trim());
    expect(new Set(factTexts).size).toBe(factTexts.length);
    expect(container.querySelectorAll(".comparison-shared").length).toBeGreaterThan(0);
    expect(container.querySelector(".comparison-report .chapter-visual")).toBeNull();
    const context = container.querySelector<HTMLDetailsElement>(".comparison-report #generation-context")!;
    expect(context.open).toBe(false);
    expect(context.querySelector(".item-difficult")).toBeNull();
    expect(error.mock.calls.flat().join(" ")).not.toContain("same key");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { COPY } from "../copy";
import { reportFor } from "../lib/facts";
import { makePerson } from "../test/factories";
import Results from "./Results";

describe("Results", () => {
  it("gives every visible report text one home", async () => {
    const person = makePerson();
    const report = await reportFor(person);
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
    await userEvent.click(details.querySelector("summary")!);
    expect(details.open).toBe(true);
    expect(details.querySelector(".chapter-content-expanded .chapter-header")).toBeNull();
    expect(details.querySelectorAll(".chapter-content-expanded .chapter-intro")).toHaveLength(1);

    const life = report.chapters.find((chapter) => chapter.id === "life-numbers")!;
    const lifeDetails = screen.getByRole("heading", { name: life.title }).closest("details")!;
    await userEvent.click(lifeDetails.querySelector(":scope > summary")!);
    const weeksSummary = screen.getByText("Zobrazit čas v týdnech").closest("summary")!;
    await userEvent.click(weeksSummary);
    expect(weeksSummary.closest("details")).toHaveAttribute("open");
    expect(screen.getByText("Skrýt čas v týdnech")).toBeInTheDocument();
  });

  it("renders stable comparison columns for two identical contexts", async () => {
    const person = makePerson();
    const report = await reportFor(person);
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
    const factTexts = [...container.querySelectorAll(".comparison-report .report-item p")]
      .map((element) => element.textContent?.replace(/\s+/g, " ").trim());
    expect(new Set(factTexts).size).toBe(factTexts.length);
    expect(container.querySelectorAll(".comparison-shared").length).toBeGreaterThan(0);
    expect(container.querySelector(".comparison-report .chapter-visual")).toBeNull();
    expect(error.mock.calls.flat().join(" ")).not.toContain("same key");
  });
});

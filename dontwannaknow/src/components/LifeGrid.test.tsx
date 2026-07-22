import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LifeGrid from "./LifeGrid";

describe("LifeGrid", () => {
  it("keeps the hundred-year scale accessible without thousands of DOM nodes", () => {
    const { container } = render(<LifeGrid weeksLived={2_800} label="maminka" />);

    expect(screen.getByRole("img", { name: /od narození uplynulo přibližně 2800 týdnů/i }))
      .toBeInTheDocument();
    expect(container.querySelectorAll(".life-grid-cell")).toHaveLength(3);
    expect(screen.getByText(/neříká nic o tom, kolik času zbývá/i)).toBeInTheDocument();
  });
});

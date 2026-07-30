import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("landing shell", () => {
  it("opens without the report-edition masthead strip", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Čí svět chcete poznat?" })).toBeInTheDocument();
    expect(screen.queryByText("Osobní vydání z ověřených dobových dat")).not.toBeInTheDocument();
    expect(screen.queryByText("Česko a Ukrajina · 1920–2026")).not.toBeInTheDocument();
  });
});

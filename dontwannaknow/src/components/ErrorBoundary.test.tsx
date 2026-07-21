import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

function Broken(): ReactNode {
  throw new Error("zkušební chyba");
}

describe("ErrorBoundary", () => {
  it("shows a Czech recovery path and can retry rendering", async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("heading", { name: "Stránku se nepodařilo zobrazit" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Zkusit znovu" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});

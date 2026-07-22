import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { reportFor } from "../lib/facts";
import { decodeReportState } from "../lib/share";
import { makePerson } from "../test/factories";
import type { PersonReport } from "../lib/facts";
import SharePanel from "./SharePanel";

afterEach(() => {
  window.history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

describe("SharePanel privacy", () => {
  const person = makePerson({ name: "Šárka" });
  let report: PersonReport;

  beforeAll(async () => {
    report = await reportFor(person);
  });

  it("keeps the name out of a copied link until the user explicitly includes it", async () => {
    const writeText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(
      <SharePanel
        reports={[report]}
        people={[person]}
        skySvg={null}
        onPdf={vi.fn()}
      />,
    );

    const copyButton = screen.getByRole("button", { name: "Kopírovat odkaz" });
    fireEvent.click(copyButton);
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const privateUrl = writeText.mock.calls[0][0];
    expect(decodeReportState(privateUrl.split("#r=")[1])?.[0]?.label).toBe("");
    expect(screen.getByText("Jméno zůstává skryté")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Kopírovat odkaz" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
    const namedUrl = writeText.mock.calls[1][0];
    expect(decodeReportState(namedUrl.split("#r=")[1])?.[0]?.label).toBe("Šárka");
    expect(screen.getByText("Jméno bude zahrnuto")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NewForm from "./NewForm";

describe("NewForm", () => {
  it("shows the hero question once and gives the relationship control its own label", () => {
    render(<NewForm onSubmit={vi.fn()} />);

    expect(screen.getAllByText("Čí svět chcete poznat?")).toHaveLength(1);
    expect(screen.getByText("Jaký je váš vztah k tomuto člověku?")).toBeInTheDocument();
  });

  it("art-directs the decorative hero without exposing generated text", () => {
    const { container } = render(<NewForm onSubmit={vi.fn()} />);
    const media = container.querySelector(".hero-archive-motif");
    const source = media?.querySelector("source");
    const image = media?.querySelector("img");

    expect(media).toHaveAttribute("aria-hidden", "true");
    expect(source).toHaveAttribute("media", "(max-width: 980px)");
    expect(source).toHaveAttribute("srcset", "/media/hero-editorial-mobile.webp");
    expect(image).toHaveAttribute("src", "/media/hero-editorial-desktop.webp");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("width", "720");
    expect(image).toHaveAttribute("height", "900");
  });

  it("validates required date and city accessibly", async () => {
    const user = userEvent.setup();
    render(<NewForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Vytvořit osobní vydání" }));
    expect(screen.getByText("Zadejte platný rok nebo datum narození.")).toBeInTheDocument();
    expect(screen.getByText("Vyberte město.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("např. 12. 4. 1953 nebo 1953")).toHaveAttribute("aria-invalid", "true");
  });

  it("submits a full Czech birth date without requiring a name", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("např. 12. 4. 1953 nebo 1953"), "12. 4. 1953");
    await user.selectOptions(screen.getByRole("combobox", { name: "Ve kterém městě?" }), "prague");
    await user.click(screen.getByRole("button", { name: "Vytvořit osobní vydání" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0][0]).toMatchObject({
      label: "",
      birthYear: 1953,
      birthMonth: 4,
      birthDay: 12,
      country: "CZ",
      citySlug: "prague",
    });
  });

  it("adds and submits a second person for comparison", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Přidat druhého člověka pro porovnání" }));

    const dateInputs = screen.getAllByPlaceholderText("např. 12. 4. 1953 nebo 1953");
    const cities = screen.getAllByRole("combobox", { name: "Ve kterém městě?" });
    await user.type(dateInputs[0], "1953");
    await user.type(dateInputs[1], "1960");
    await user.selectOptions(cities[0], "prague");
    await user.selectOptions(cities[1], "brno");
    await user.click(screen.getByRole("button", { name: "Vytvořit dvě osobní vydání" }));

    expect(onSubmit.mock.calls[0][0]).toHaveLength(2);
  });
});

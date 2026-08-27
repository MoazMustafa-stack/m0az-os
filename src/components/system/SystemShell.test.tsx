import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SystemShell } from "./SystemShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SystemShell", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
    vi.restoreAllMocks();
  });

  it("routes visible navigation through the system action", () => {
    render(<SystemShell initialSection="home" />);
    const pushState = vi.spyOn(window.history, "pushState");
    fireEvent.click(screen.getByRole("button", { name: /^projects$/i }));
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    expect(pushState).toHaveBeenCalledWith({ m0az: true }, "", "/projects");
  });

  it("runs terminal commands and mounts the same projects module", () => {
    render(<SystemShell initialSection="home" />);
    const pushState = vi.spyOn(window.history, "pushState");
    const input = screen.getByLabelText("M0AZ_OS terminal command");
    fireEvent.change(input, { target: { value: "projects" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    expect(pushState).toHaveBeenCalledWith({ m0az: true }, "", "/projects");
  });

  it("mounts a direct project route and opens the command palette", () => {
    render(<SystemShell initialSection="project" initialProjectSlug="m0az-os" />);
    expect(screen.getByRole("heading", { name: "M0AZ_OS" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open command palette" }));
    expect(screen.getByRole("dialog", { name: "SYSTEM COMMAND" })).toBeInTheDocument();
  });
});

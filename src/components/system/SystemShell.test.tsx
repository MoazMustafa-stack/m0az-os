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
    fireEvent.click(screen.getByRole("button", { name: /^work$/i }));
    expect(screen.getByRole("heading", { name: /work/i })).toBeInTheDocument();
    expect(pushState).toHaveBeenCalledWith({ m0az: true }, "", "/projects");
  });

  it("runs terminal commands and mounts the same projects module", () => {
    render(<SystemShell initialSection="home" />);
    const pushState = vi.spyOn(window.history, "pushState");
    const input = screen.getByLabelText("M0AZ_OS terminal command");
    fireEvent.change(input, { target: { value: "work" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByRole("heading", { name: /work/i })).toBeInTheDocument();
    expect(pushState).toHaveBeenCalledWith({ m0az: true }, "", "/projects");
  });

  it("mounts a direct project route and opens the command palette", () => {
    render(<SystemShell initialSection="project" initialProjectSlug="m0az-os" />);
    expect(screen.getByRole("heading", { name: "M0AZ_OS" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open command palette" }));
    expect(screen.getByRole("dialog", { name: "SYSTEM COMMAND" })).toBeInTheDocument();
  });

  it("routes the recruiter path to experience and exposes the approved PDF", () => {
    render(<SystemShell initialSection="home" />);
    const pushState = vi.spyOn(window.history, "pushState");
    fireEvent.click(screen.getByRole("button", { name: "REVIEW EXPERIENCE" }));
    expect(screen.getByRole("heading", { name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "DOWNLOAD PDF" })).toHaveAttribute("href", "/moaz-mustafa-resume.pdf");
    expect(pushState).toHaveBeenCalledWith({ m0az: true }, "", "/experience");
  });

  it("keeps the private work teaser link-free", () => {
    render(<SystemShell initialSection="projects" />);
    expect(screen.getByRole("heading", { name: "Intermittent Edge AI Recovery" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Intermittent Edge AI Recovery/i })).not.toBeInTheDocument();
  });

  it("presents technologies with capability evidence instead of proficiency scores", () => {
    render(<SystemShell initialSection="skills" />);
    expect(screen.getByRole("heading", { name: "Languages" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Developer tools and verification" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "End-to-end product delivery" })).toBeInTheDocument();
    expect(screen.getByText(/Cordis\.us \/ Lahmah Cuts · Cephalon-Ordis/)).toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });
});

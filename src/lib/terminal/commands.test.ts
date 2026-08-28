import { describe, expect, it } from "vitest";
import { completeInput, executeTerminalCommand, type CommandContext } from "./commands";

const context: CommandContext = {
  cwd: "/home/moaz",
  host: "portfolio",
  history: ["help"],
  mode: "visitor",
  startedAt: Date.now() - 5_000,
  theme: "phosphor",
  soundEnabled: false,
  activeProjectSlug: null,
  achievements: [],
};

describe("command execution", () => {
  it("returns the same project navigation intent as visible UI", () => {
    expect(executeTerminalCommand("project 01", context).effect?.navigate).toEqual({
      section: "project", projectSlug: "lahmah-cuts",
    });
  });

  it("mounts a project host without executing a real command", () => {
    const result = executeTerminalCommand("ssh m0az-os", context);
    expect(result.effect).toMatchObject({ host: "m0az-os", directory: "/home/moaz/projects/m0az-os", unlock: "remote-shell" });
    expect(result.lines).toContain("Connection established.");
  });

  it("supports safe pipeline filtering", () => {
    const result = executeTerminalCommand("projects | grep M0AZ", context);
    expect(result.lines.join("\n")).toContain("M0AZ_OS");
  });

  it("supports work as the recruiter-facing projects alias", () => {
    expect(executeTerminalCommand("work", context).effect?.navigate).toEqual({ section: "projects" });
  });

  it("suggests likely commands and completes known prefixes", () => {
    expect(executeTerminalCommand("projetcs", context).lines.join(" ")).toContain("projects");
    expect(completeInput("neo", context.cwd).value).toBe("neofetch ");
  });

  it("keeps destructive-looking commands theatrical", () => {
    const result = executeTerminalCommand("rm -rf /", context);
    expect(result.effect?.panic).toBe(true);
    expect(result.lines.at(-1)).toContain("No data was touched");
  });
});

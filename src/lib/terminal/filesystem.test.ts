import { describe, expect, it } from "vitest";
import { getNode, HOME, listDirectory, resolvePath, tree } from "./filesystem";

describe("fictional filesystem", () => {
  it("normalizes relative, home, and parent paths", () => {
    expect(resolvePath("projects/../about", HOME)).toBe("/home/moaz/about");
    expect(resolvePath("~/projects", "/")).toBe("/home/moaz/projects");
  });

  it("hides graveyard entries unless explicitly requested", () => {
    expect(listDirectory(`${HOME}/lab`).some((item) => item.name === ".graveyard")).toBe(false);
    expect(listDirectory(`${HOME}/lab`, true).some((item) => item.name === ".graveyard")).toBe(true);
  });

  it("builds project files from authoritative content", () => {
    expect(getNode(`${HOME}/projects/m0az-os/README.md`)?.content).toContain("M0AZ_OS");
    expect(tree(`${HOME}/projects`).join("\n")).toContain("m0az-os/");
  });
});

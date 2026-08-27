import { describe, expect, it } from "vitest";
import { parseInput, tokenize } from "./parser";

describe("terminal parser", () => {
  it("tokenizes quotes and escaped whitespace", () => {
    expect(tokenize("echo 'clear thought' escaped\\ space").tokens).toEqual([
      "echo", "clear thought", "escaped space",
    ]);
  });

  it("parses flags, arguments, and a bounded pipeline", () => {
    expect(parseInput("projects --all | grep rust")).toEqual({
      raw: "projects --all | grep rust",
      stages: [
        { command: "projects", args: [], flags: { all: true } },
        { command: "grep", args: ["rust"], flags: {} },
      ],
    });
  });

  it("rejects unfinished quotes and empty stages", () => {
    expect(parseInput("echo 'unfinished")).toHaveProperty("error");
    expect(parseInput("projects | ")).toHaveProperty("error");
  });
});

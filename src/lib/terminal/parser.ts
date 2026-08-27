export interface ParsedStage {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface ParsedInput {
  raw: string;
  stages: ParsedStage[];
}

export interface TokenizeResult {
  tokens: string[];
  error?: string;
}

const WHITESPACE = /\s/;

export function tokenize(input: string): TokenizeResult {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;

  const push = () => {
    if (current.length > 0) tokens.push(current);
    current = "";
  };

  for (const character of input.trim()) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      else current += character;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === "|") {
      push();
      tokens.push("|");
      continue;
    }
    if (WHITESPACE.test(character)) {
      push();
      continue;
    }
    current += character;
  }

  if (escaped) current += "\\";
  if (quote) return { tokens, error: `unterminated ${quote} quote` };
  push();
  return { tokens };
}

function parseStage(tokens: string[]): ParsedStage {
  const [command = "", ...rest] = tokens;
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token.startsWith("--")) {
      const [name, inlineValue] = token.slice(2).split("=", 2);
      if (inlineValue !== undefined) flags[name] = inlineValue;
      else if (rest[index + 1] && !rest[index + 1].startsWith("-")) {
        flags[name] = rest[index + 1];
        index += 1;
      } else flags[name] = true;
    } else if (token.startsWith("-") && token.length > 1) {
      for (const name of token.slice(1)) flags[name] = true;
    } else args.push(token);
  }
  return { command: command.toLowerCase(), args, flags };
}

export function parseInput(input: string): ParsedInput | { raw: string; error: string } {
  const { tokens, error } = tokenize(input);
  if (error) return { raw: input, error };
  if (tokens.length === 0) return { raw: input, stages: [] };

  const groups: string[][] = [[]];
  for (const token of tokens) {
    if (token === "|") {
      if (groups.at(-1)?.length === 0) return { raw: input, error: "empty pipeline stage" };
      groups.push([]);
    } else groups.at(-1)?.push(token);
  }
  if (groups.at(-1)?.length === 0) return { raw: input, error: "empty pipeline stage" };
  return { raw: input, stages: groups.map(parseStage) };
}

export function levenshtein(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const held = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = held;
    }
  }
  return row[b.length];
}

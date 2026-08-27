import { graveyard, projects, research, siteIdentity, skillGroups } from "@/content/site";

export interface FileNode {
  type: "file" | "directory" | "link";
  content?: string;
  target?: string;
  hidden?: boolean;
}

export const HOME = "/home/moaz";

function clean(path: string) {
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return `/${parts.join("/")}` || "/";
}

export function resolvePath(input: string, cwd: string) {
  if (!input || input === "~") return HOME;
  const expanded = input.startsWith("~/") ? `${HOME}/${input.slice(2)}` : input;
  return clean(expanded.startsWith("/") ? expanded : `${cwd}/${expanded}`);
}

const projectNodes: Record<string, FileNode> = {};
for (const project of projects) {
  const root = `${HOME}/projects/${project.slug}`;
  projectNodes[root] = { type: "directory" };
  projectNodes[`${root}/README.md`] = {
    type: "file",
    content: `${project.name}\n\n${project.oneLineDescription}\n\n${project.solution}`,
  };
  projectNodes[`${root}/architecture.txt`] = {
    type: "file",
    content: project.architecture.map((line, index) => `${index + 1}. ${line}`).join("\n"),
  };
  projectNodes[`${root}/stack.txt`] = { type: "file", content: project.stack.join("\n") };
  projectNodes[`${root}/decisions.log`] = {
    type: "file",
    content: project.engineeringHighlights.map((line) => `[decision] ${line}`).join("\n"),
  };
}

export const filesystem: Record<string, FileNode> = {
  "/": { type: "directory" },
  "/home": { type: "directory" },
  [HOME]: { type: "directory" },
  [`${HOME}/about`]: { type: "directory" },
  [`${HOME}/about/bio.md`]: { type: "file", content: `${siteIdentity.name}\n${siteIdentity.role}\n\n${siteIdentity.summary}` },
  [`${HOME}/about/focus.md`]: { type: "file", content: siteIdentity.currentFocus },
  [`${HOME}/projects`]: { type: "directory" },
  [`${HOME}/research`]: { type: "directory" },
  ...Object.fromEntries(research.map((item) => [`${HOME}/research/${item.id.toLowerCase()}.md`, { type: "file" as const, content: `${item.title}\n\n${item.abstract}` }])),
  [`${HOME}/experience`]: { type: "directory" },
  [`${HOME}/experience/timeline.md`]: { type: "file", content: "Independent product engineering\nResearch and systems practice" },
  [`${HOME}/skills`]: { type: "directory" },
  [`${HOME}/skills/processes.txt`]: { type: "file", content: skillGroups.map((group) => `${group.load.padEnd(7)} ${group.name}: ${group.items.join(", ")}`).join("\n") },
  [`${HOME}/lab`]: { type: "directory" },
  [`${HOME}/lab/experiments`]: { type: "directory" },
  [`${HOME}/lab/prototypes`]: { type: "directory" },
  [`${HOME}/lab/.graveyard`]: { type: "directory", hidden: true },
  ...Object.fromEntries(graveyard.map((item) => [`${HOME}/lab/.graveyard/${item.name}.md`, { type: "file" as const, hidden: true, content: `WHY IT FAILED\n${item.failure}\n\nWHAT I LEARNED\n${item.learned}` }])),
  [`${HOME}/contact`]: { type: "directory" },
  [`${HOME}/contact/github`]: { type: "link", target: siteIdentity.github },
  [`${HOME}/resume`]: { type: "file", content: "Web resume mounted at /resume. Reviewed PDF not configured." },
  ...projectNodes,
};

export function getNode(path: string) { return filesystem[clean(path)]; }

export function listDirectory(path: string, includeHidden = false) {
  const normalized = clean(path);
  if (getNode(normalized)?.type !== "directory") return [];
  const prefix = normalized === "/" ? "/" : `${normalized}/`;
  return Object.entries(filesystem)
    .filter(([candidate, node]) => candidate.startsWith(prefix) && candidate !== normalized && !candidate.slice(prefix.length).includes("/") && (includeHidden || !node.hidden))
    .map(([candidate, node]) => ({ name: candidate.slice(prefix.length), ...node }))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "directory" ? -1 : 1));
}

export function formatPath(path: string) { return path.startsWith(HOME) ? path.replace(HOME, "~") : path; }

export function tree(path: string, includeHidden = false, depth = 0): string[] {
  if (depth > 4) return [];
  const items = listDirectory(path, includeHidden);
  return items.flatMap((item, index) => {
    const last = index === items.length - 1;
    const label = `${last ? "└──" : "├──"} ${item.name}${item.type === "directory" ? "/" : ""}`;
    if (item.type !== "directory") return [label];
    const children = tree(`${path}/${item.name}`, includeHidden, depth + 1);
    return [label, ...children.map((line) => `${last ? "    " : "│   "}${line}`)];
  });
}

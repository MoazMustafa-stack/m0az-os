import { achievements, findProject, projects, research, siteIdentity, skillGroups } from "@/content/site";
import type { AchievementId, SectionId, ThemeId } from "@/types/domain";
import { formatPath, getNode, HOME, listDirectory, resolvePath, tree } from "./filesystem";
import { levenshtein, parseInput, type ParsedStage } from "./parser";

export interface CommandContext {
  cwd: string;
  host: string;
  history: string[];
  mode: "visitor" | "root";
  startedAt: number;
  theme: ThemeId;
  soundEnabled: boolean;
  activeProjectSlug: string | null;
  achievements: AchievementId[];
}

export interface CommandEffect {
  navigate?: { section: SectionId; projectSlug?: string | null };
  directory?: string;
  host?: string;
  theme?: ThemeId;
  sound?: boolean;
  clear?: boolean;
  reboot?: boolean;
  shutdown?: boolean;
  panic?: boolean;
  resetLocal?: boolean;
  root?: boolean;
  openUrl?: string;
  unlock?: AchievementId;
  secret?: string;
}

export interface CommandResult {
  lines: string[];
  error?: boolean;
  effect?: CommandEffect;
}

interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  hidden?: boolean;
}

export const commandDefinitions: CommandDefinition[] = [
  { name: "help", description: "list documented commands" },
  { name: "about", description: "display profile" },
  { name: "projects", aliases: ["work"], description: "list flagship work" },
  { name: "project", description: "open project by id or slug" },
  { name: "research", description: "inspect research work" },
  { name: "experience", description: "show engineering timeline" },
  { name: "skills", description: "inspect active working set" },
  { name: "contact", description: "show public channels" },
  { name: "resume", description: "mount web resume" },
  { name: "ls", description: "list directory entries" },
  { name: "cd", description: "change fictional directory" },
  { name: "pwd", description: "print working directory" },
  { name: "cat", description: "print a fictional file" },
  { name: "tree", description: "render directory tree" },
  { name: "open", description: "open a module, project, or link" },
  { name: "clear", aliases: ["cls"], description: "clear terminal output" },
  { name: "history", description: "show command history" },
  { name: "echo", description: "write arguments" },
  { name: "date", description: "display local date" },
  { name: "uptime", description: "show portfolio session uptime" },
  { name: "whoami", description: "display current shell identity" },
  { name: "hostname", description: "display current host" },
  { name: "theme", description: "set light, phosphor, amber, or ice" },
  { name: "sound", description: "toggle restrained interface audio" },
  { name: "neofetch", description: "display system profile" },
  { name: "top", description: "show skill processes" },
  { name: "man", description: "read command manual" },
  { name: "git", description: "inspect project milestones" },
  { name: "ssh", description: "mount a project host" },
  { name: "back", description: "return to portfolio host" },
  { name: "reboot", description: "replay the boot sequence" },
  { name: "shutdown", description: "enter low-power display mode" },
  { name: "achievements", description: "list discovered achievements" },
  { name: "env", description: "show portfolio environment" },
  { name: "ps", description: "show active focus processes" },
  { name: "grep", description: "search input or portfolio content" },
  { name: "reset", description: "reset versioned local state" },
  { name: "architecture", description: "read mounted project architecture" },
  { name: "stack", description: "read mounted project stack" },
  { name: "readme", description: "read mounted project summary" },
  { name: "decisions", description: "read mounted project decisions" },
  { name: "challenges", description: "read mounted project challenges" },
  { name: "timeline", description: "read mounted project milestones" },
  { name: "repo", description: "open mounted project source" },
  { name: "demo", description: "open mounted project demo" },
  { name: "sudo", hidden: true, description: "request elevated fiction" },
  { name: "root", hidden: true, description: "inspect access boundary" },
  { name: "nmap", hidden: true, description: "inspect fictional local services" },
  { name: "rm", hidden: true, description: "simulate a filesystem operation" },
  { name: "coffee", hidden: true, description: "request build fuel" },
  { name: "42", hidden: true, description: "ask the important question" },
  { name: "fortune", hidden: true, description: "print an engineering fortune" },
  { name: "matrix", hidden: true, description: "decline a visual cliche" },
  { name: "journalctl", hidden: true, description: "read portfolio service log" },
  { name: "make", hidden: true, description: "build a small target" },
  { name: "ping", hidden: true, description: "check fictional reachability" },
  { name: "curl", hidden: true, description: "read a portfolio endpoint" },
];

const definitionMap = new Map<string, CommandDefinition>();
for (const definition of commandDefinitions) {
  definitionMap.set(definition.name, definition);
  for (const alias of definition.aliases ?? []) definitionMap.set(alias, definition);
}

const sectionIds: SectionId[] = ["home", "about", "projects", "experience", "research", "skills", "resume", "contact", "lab"];
const sectionFor = (value: string) => {
  const normalized = value.replace(/^\//, "").toLowerCase();
  return normalized === "work" ? "projects" : sectionIds.find((section) => section === normalized);
};

function duration(startedAt: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function mountedProject(context: CommandContext) {
  return findProject(context.activeProjectSlug ?? context.host);
}

function projectCommand(command: string, context: CommandContext): CommandResult {
  const project = mountedProject(context);
  if (!project) return { lines: ["No project host mounted. Use: ssh <project>"], error: true };
  if (command === "architecture") return { lines: project.architecture.map((item, index) => `${index + 1}. ${item}`) };
  if (command === "stack") return { lines: project.stack.map((item) => `- ${item}`) };
  if (command === "readme") return { lines: [project.name, "", project.oneLineDescription, "", project.solution] };
  if (command === "decisions") return { lines: project.engineeringHighlights.map((item) => `[decision] ${item}`) };
  if (command === "challenges") return { lines: project.challenges.map((item) => `[challenge] ${item}`) };
  if (command === "timeline") return { lines: project.milestones.map((item) => `${item.date}  ${item.hash}  ${item.message}`) };
  const link = project.links.find((item) => item.kind === command);
  if (!link) return { lines: [`${command}: not published for this project`], error: true };
  return { lines: [`opening ${link.href}`], effect: { openUrl: link.href } };
}

function executeStage(stage: ParsedStage, context: CommandContext, stdin: string[] = []): CommandResult {
  const definition = definitionMap.get(stage.command);
  const command = definition?.name ?? stage.command;
  const arg = stage.args.join(" ");

  if (!definition) {
    const suggestion = commandDefinitions.map(({ name }) => ({ name, distance: levenshtein(command, name) })).sort((a, b) => a.distance - b.distance)[0];
    return { lines: [`command not found: ${command}`, ...(suggestion?.distance <= 3 ? ["", `Did you mean: ${suggestion.name}`] : ["Type 'help' for available commands."])], error: true };
  }

  if (command === "help") return { lines: ["AVAILABLE COMMANDS", "", "Primary navigation", "  work  experience  about  contact", "", "Explore", "  projects  research  skills  resume  open lab", "", "Filesystem", "  ls  cd  pwd  cat  tree  open  grep", "", "System", "  neofetch  top  uptime  history  clear  theme  sound", "", "Project hosts", "  ssh <project>  git log  architecture  stack  decisions  back", "", "Use: man <command>     Tab completes names and paths."] };
  if (command === "clear") return { lines: [], effect: { clear: true } };
  if (command === "pwd") return { lines: [context.cwd] };
  if (command === "hostname") return { lines: [context.host] };
  if (command === "whoami") return { lines: [context.mode === "root" ? "root" : siteIdentity.handle, siteIdentity.role] };
  if (command === "echo") return { lines: [arg] };
  if (command === "date") return { lines: [new Date().toString()] };
  if (command === "uptime") return { lines: [`up ${duration(context.startedAt)}, 1 visitor, load: deliberate`] };
  if (command === "history") return { lines: context.history.map((item, index) => `${String(index + 1).padStart(3)}  ${item}`) };

  if (["about", "research", "experience", "skills", "contact", "resume"].includes(command)) {
    const section = command as SectionId;
    return { lines: [`mounting ~/${section} ...`, `[ OK ] ${section}.service`], effect: { navigate: { section } } };
  }
  if (command === "projects") return { lines: ["ID   PROJECT                      DOMAIN                  STATUS", ...projects.map((project) => `${project.id}   ${project.name.padEnd(28)} ${project.category.padEnd(23)} ${project.status}`)], effect: { navigate: { section: "projects" } } };
  if (command === "project") {
    const project = findProject(stage.args[0] ?? "");
    if (!project) return { lines: ["usage: project <id|slug>", `available: ${projects.map((item) => item.slug).join(", ")}`], error: true };
    return { lines: [`opening ${project.name} ...`], effect: { navigate: { section: "project", projectSlug: project.slug } } };
  }

  if (command === "ls") {
    const path = resolvePath(stage.args[0] ?? context.cwd, context.cwd);
    const node = getNode(path);
    if (!node) return { lines: [`ls: ${stage.args[0] ?? path}: No such file or directory`], error: true };
    if (node.type !== "directory") return { lines: [path.split("/").at(-1) ?? path] };
    const items = listDirectory(path, Boolean(stage.flags.a));
    return { lines: [items.map((item) => `${item.name}${item.type === "directory" ? "/" : item.type === "link" ? "@" : ""}`).join("  ") || "<empty>"] };
  }
  if (command === "cd") {
    const path = resolvePath(stage.args[0] ?? HOME, context.cwd);
    const node = getNode(path);
    if (!node) return { lines: [`cd: ${stage.args[0] ?? ""}: No such file or directory`], error: true };
    if (node.type !== "directory") return { lines: [`cd: ${stage.args[0]}: Not a directory`], error: true };
    const grave = path.includes("/.graveyard");
    return { lines: [`directory: ${formatPath(path)}`], effect: { directory: path, ...(grave ? { unlock: "archaeologist" as AchievementId, secret: "graveyard" } : {}) } };
  }
  if (command === "cat") {
    if (!stage.args[0]) return { lines: ["usage: cat <file>"], error: true };
    const node = getNode(resolvePath(stage.args[0], context.cwd));
    if (!node) return { lines: [`cat: ${stage.args[0]}: No such file`], error: true };
    if (node.type === "directory") return { lines: [`cat: ${stage.args[0]}: Is a directory`], error: true };
    return { lines: (node.content ?? node.target ?? "").split("\n") };
  }
  if (command === "tree") {
    const path = resolvePath(stage.args[0] ?? context.cwd, context.cwd);
    if (getNode(path)?.type !== "directory") return { lines: [`tree: ${stage.args[0] ?? path}: directory not found`], error: true };
    return { lines: [formatPath(path), ...tree(path, Boolean(stage.flags.a))] };
  }
  if (command === "open") {
    if (!stage.args[0]) return { lines: ["usage: open <module|project|file>"], error: true };
    const project = findProject(stage.args[0]);
    if (project) return { lines: [`opening ${project.name}`], effect: { navigate: { section: "project", projectSlug: project.slug } } };
    const section = sectionFor(stage.args[0]);
    if (section) return { lines: [`opening /${section}`], effect: { navigate: { section } } };
    const node = getNode(resolvePath(stage.args[0], context.cwd));
    if (node?.type === "link" && node.target) return { lines: [`opening ${node.target}`], effect: { openUrl: node.target } };
    if (node?.type === "file") return { lines: (node.content ?? "").split("\n") };
    return { lines: [`open: ${stage.args[0]}: target not found`], error: true };
  }

  if (command === "theme") {
    const theme = stage.args[0] as ThemeId | undefined;
    if (!theme) return { lines: [`theme: ${context.theme}`, "available: light phosphor amber ice"] };
    if (!["light", "phosphor", "amber", "ice"].includes(theme)) return { lines: [`theme: unknown variant ${theme}`], error: true };
    return { lines: [`theme switched: ${theme}`], effect: { theme } };
  }
  if (command === "sound") {
    const enabled = stage.args[0] ? stage.args[0] === "on" : !context.soundEnabled;
    return { lines: [`sound ${enabled ? "enabled" : "disabled"}`], effect: { sound: enabled } };
  }
  if (command === "neofetch") return { lines: ["       ████        moaz@portfolio", "     ██    ██      -------------------------", "    ██ M0AZ ██      OS: M0AZ_OS", "     ██  ██        Kernel: product-systems", "       ██          Shell: portfolio-sh", `                   Host: ${context.host}`, "                   Focus: Systems / Product / Research", `                   Projects: ${projects.length}`, `                   Uptime: ${duration(context.startedAt)}`] };
  if (command === "top" || command === "ps") return { lines: ["PID   LOAD     PROCESS", ...skillGroups.map((group, index) => `${101 + index}   ${group.load.padEnd(8)} ${group.name}`), "", "LOAD describes current attention, not competency."] };
  if (command === "man") {
    const subject = stage.args[0] ?? "moaz";
    if (subject === "moaz") return { lines: ["MOAZ(1)                 USER COMMANDS", "", "NAME", "    moaz - software engineer and systems builder", "", "DESCRIPTION", `    ${siteIdentity.summary}`, "", "SEE ALSO", "    projects(1), research(1), contact(1)"] };
    const entry = definitionMap.get(subject);
    return entry ? { lines: [`${entry.name.toUpperCase()}(1)              M0AZ_OS COMMANDS`, "", "NAME", `    ${entry.name} - ${entry.description}`, "", "SYNOPSIS", `    ${entry.name} [arguments]`] } : { lines: [`No manual entry for ${subject}`], error: true };
  }

  if (command === "ssh") {
    const project = findProject(stage.args[0] ?? "");
    if (!project) return { lines: ["usage: ssh <project>", `hosts: ${projects.map((item) => item.slug).join("  ")}`], error: true };
    return { lines: [`Connecting to ${project.slug}...`, "Verifying host fingerprint...", "Connection established.", "", `moaz@${project.slug}:~$`], effect: { host: project.slug, directory: `${HOME}/projects/${project.slug}`, navigate: { section: "project", projectSlug: project.slug }, unlock: "remote-shell" } };
  }
  if (command === "back") return { lines: ["Connection to project host closed.", "moaz@portfolio:~$"], effect: { host: "portfolio", directory: HOME, navigate: { section: "projects" } } };
  if (command === "git") {
    const project = mountedProject(context) ?? projects[0];
    const subcommand = stage.args[0] ?? "status";
    if (subcommand === "log") return { lines: project.milestones.flatMap((item) => [`commit ${item.hash}`, `Date:   ${item.date}`, `    ${item.message}`, ""]) };
    if (subcommand === "remote") return { lines: project.links.filter((link) => link.kind === "source").map((link) => `origin  ${link.href}`).concat(project.links.some((link) => link.kind === "source") ? [] : ["origin  <not published>"]) };
    if (subcommand === "status") return { lines: [`On host ${project.slug}`, `Project state: ${project.status}`, "Working tree is represented by curated milestones."] };
    return { lines: [`git: unsupported safe subcommand '${subcommand}'`, "supported: status log remote"], error: true };
  }
  if (["architecture", "stack", "readme", "decisions", "challenges", "timeline", "repo", "demo"].includes(command)) return projectCommand(command, context);

  if (command === "achievements") return { lines: achievements.map((item) => `${context.achievements.includes(item.id) ? "[x]" : "[ ]"} ${item.name.padEnd(16)} ${context.achievements.includes(item.id) ? item.description : "???"}`) };
  if (command === "env") return { lines: ["ROLE=SoftwareEngineer", "FOCUS=Systems,Product,Research", "SHELL=portfolio-sh", `HOST=${context.host}`, `THEME=${context.theme}`, "STATUS=Building"] };
  if (command === "grep") {
    const needle = (stage.args[0] ?? "").toLowerCase();
    if (!needle) return { lines: ["usage: grep <pattern> [-R ~]"], error: true };
    const source = stdin.length ? stdin : [...projects.flatMap((project) => [project.name, project.oneLineDescription, ...project.stack]), ...research.flatMap((item) => [item.title, item.abstract])];
    const matches = source.filter((line) => line.toLowerCase().includes(needle));
    return { lines: matches.length ? matches : [`grep: no matches for '${needle}'`] };
  }
  if (command === "reset") {
    if (!stage.flags["local-state"]) return { lines: ["usage: reset --local-state", "This resets only M0AZ_OS preferences and discoveries."], error: true };
    if (!stage.flags.confirm) return { lines: ["Local reset requested. Repeat with:", "reset --local-state --confirm"] };
    return { lines: ["Versioned local session state reset."], effect: { resetLocal: true } };
  }
  if (command === "reboot") return { lines: ["Reboot scheduled. Session content remains safe."], effect: { reboot: true } };
  if (command === "shutdown") return { lines: ["It is now safe to close this tab.", "Press any navigation control to resume."], effect: { shutdown: true } };

  if (command === "sudo" || command === "root") return { lines: ["[sudo] password for visitor:", "Permission denied.", "Hint: this is a public portfolio, not a real host."] };
  if (command === "nmap") return { lines: ["Starting M0AZ Nmap (fictional simulation)", "", "PORT       STATE     SERVICE", "22/tcp     open      projects", "80/tcp     open      portfolio", "443/tcp    open      resume", "3000/tcp   open      lab", "1337/tcp   filtered  unknown"], effect: stage.args.includes("1337") ? { unlock: "curious", secret: "port-1337" } : undefined };
  if (command === "rm") {
    const target = stage.args.join(" ");
    if ((stage.flags.r && stage.flags.f && target === "/") || arg.includes("-rf /")) return { lines: ["Removing /projects...", "Removing /about...", "Removing /system...", "", "###################### 93%", "KERNEL PANIC - why would you do that", "", "Filesystem restored from snapshot. No data was touched."], effect: { panic: true, unlock: "panic", secret: "snapshot-recovery" } };
    return { lines: ["rm: read-only fictional filesystem", "Nothing was removed."], error: true };
  }
  if (command === "coffee") return { lines: ["Brewing...", "[ OK ] focus.service restarted", "A small cup has been allocated to PID 101."] };
  if (command === "42") return { lines: ["The answer is 42. The interface contract is still undefined."] };
  if (command === "fortune") return { lines: ["A robust system is one whose failure behavior was designed before the demo."] };
  if (command === "matrix") return { lines: ["Declined: green rain would violate the visual direction.", "Try 'theme amber' if you need a dramatic change."] };
  if (command === "journalctl") return { lines: ["[ OK ] portfolio.service mounted", "[ OK ] terminal.service listening", "[ OK ] curiosity.service active", "[FAIL] sleep.service deliberately unavailable"] };
  if (command === "make") return { lines: stage.args[0] === "portfolio" ? ["Compiling clarity...", "Linking projects...", "Removing gratuitous effects...", "Build complete."] : [`make: unknown target '${stage.args[0] ?? ""}'`] };
  if (command === "ping") return { lines: [`PING ${stage.args[0] ?? "portfolio"}: 64 bytes`, "reply: service reachable through a fictional adapter", "0% packet loss"] };
  if (command === "curl") {
    const section = sectionFor(stage.args[0] ?? "about");
    return section ? { lines: [`{ \"module\": \"${section}\", \"status\": \"available\" }`] } : { lines: ["curl: endpoint not found"], error: true };
  }
  return { lines: [`${command}: unavailable in this context`], error: true };
}

export function executeTerminalCommand(input: string, context: CommandContext): CommandResult {
  const parsed = parseInput(input);
  if ("error" in parsed) return { lines: [`parse error: ${parsed.error}`], error: true };
  let result: CommandResult = { lines: [] };
  for (const stage of parsed.stages) {
    result = executeStage(stage, context, result.lines);
    if (result.error) break;
  }
  return result;
}

export function completeInput(input: string, cwd: string) {
  const match = input.match(/^(.*?)([^\s]*)$/);
  if (!match) return { value: input, matches: [] as string[] };
  const prefix = match[1];
  const partial = match[2].toLowerCase();
  const isFirst = prefix.trim().length === 0;
  const candidates = isFirst ? commandDefinitions.map(({ name }) => name) : [...projects.map(({ slug }) => slug), ...listDirectory(cwd, true).map((node) => `${node.name}${node.type === "directory" ? "/" : ""}`), "light", "phosphor", "amber", "ice", ...sectionIds];
  const matches = [...new Set(candidates.filter((candidate) => candidate.toLowerCase().startsWith(partial)))].sort();
  return { value: matches.length === 1 ? `${prefix}${matches[0]}${matches[0].endsWith("/") ? "" : " "}` : input, matches };
}

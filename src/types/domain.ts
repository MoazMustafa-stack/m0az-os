export type SectionId =
  | "home"
  | "about"
  | "projects"
  | "project"
  | "experience"
  | "research"
  | "skills"
  | "resume"
  | "contact"
  | "lab";

export type ProjectStatus = "ACTIVE" | "STABLE" | "EXPERIMENT";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "source" | "demo" | "case-study";
}

export interface ProjectMilestone {
  hash: string;
  date: string;
  message: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  oneLineDescription: string;
  status: ProjectStatus;
  category: string;
  period: string;
  role: string;
  stack: string[];
  problem: string;
  solution: string;
  architecture: string[];
  engineeringHighlights: string[];
  challenges: string[];
  outcomes: string[];
  links: ProjectLink[];
  milestones: ProjectMilestone[];
}

export interface ResearchItem {
  id: string;
  title: string;
  status: "EXPLORING" | "PROTOTYPING" | "DOCUMENTING";
  abstract: string;
  tags: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  context: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  name: string;
  load: "HIGH" | "ACTIVE" | "WARM";
  items: string[];
  note: string;
}

export interface NavigationItem {
  id: SectionId;
  label: string;
  path: string;
  shortcut: string;
}

export interface TerminalEntry {
  id: number;
  kind: "command" | "output" | "error" | "system";
  text: string;
}

export type AchievementId =
  | "first-command"
  | "sysadmin"
  | "archaeologist"
  | "panic"
  | "curious"
  | "remote-shell";

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
}

export type ThemeId = "phosphor" | "amber" | "ice";

export interface SessionState {
  activeSection: SectionId;
  activeProjectSlug: string | null;
  terminalDirectory: string;
  terminalEntries: TerminalEntry[];
  commandHistory: string[];
  sessionMode: "visitor" | "root";
  host: string;
  theme: ThemeId;
  soundEnabled: boolean;
  terminalExpanded: boolean;
  paletteOpen: boolean;
  bootVisible: boolean;
  bootComplete: boolean;
  achievements: AchievementId[];
  discoveredSecrets: string[];
  commandCount: number;
  startedAt: number;
}

export interface PersistedSession {
  version: 1;
  theme: ThemeId;
  soundEnabled: boolean;
  bootComplete: boolean;
  achievements: AchievementId[];
  discoveredSecrets: string[];
  commandHistory: string[];
}

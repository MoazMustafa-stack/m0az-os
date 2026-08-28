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

export interface SiteIdentity {
  name: string;
  handle: string;
  systemName: string;
  hostname: string;
  headline: string;
  role: string;
  summary: string;
  currentFocus: string;
  availability: string;
  graduation: string;
  targetRoles: string[];
  github: string;
  email: string;
  linkedin: string;
  resumePath: string;
}

export interface NavigationItem {
  id: SectionId;
  label: string;
  path: string;
  shortcut: string;
}

export interface EngagementPath {
  id: "recruiting" | "freelance";
  audience: string;
  title: string;
  description: string;
  signals: string[];
  actionLabel: string;
  actionSection: SectionId;
  emailLabel: string;
  emailHref: string;
}

export interface ProofPoint {
  id: string;
  value: string;
  label: string;
  detail: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  result: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

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
  classification: "featured";
  workType: "PLATFORM" | "EXPERIMENTAL SYSTEM" | "PORTFOLIO PRODUCT";
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
  constraints: string[];
  architecture: string[];
  engineeringHighlights: string[];
  challenges: string[];
  evidence: string[];
  outcomes: string[];
  links: ProjectLink[];
  milestones: ProjectMilestone[];
}

export interface ArchiveProject {
  classification: "archive";
  id: string;
  name: string;
  summary: string;
  evidence: string;
  stack: string[];
  href: string;
}

export interface PrivateWorkTeaser {
  classification: "private-teaser";
  id: string;
  name: string;
  summary: string;
  status: "PRIVATE PROTOTYPE";
  tags: string[];
  href: null;
}

export interface ResearchItem {
  id: string;
  title: string;
  status: "EXPLORING" | "PROTOTYPING" | "DOCUMENTING";
  abstract: string;
  tags: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  project: string;
  summary: string;
  outcomes: string[];
}

export interface SkillGroup {
  name: string;
  load: "HIGH" | "ACTIVE" | "WARM";
  items: string[];
  note: string;
}

export interface TechnologyItem {
  name: string;
  context: string;
}

export interface TechnologyCategory {
  id: string;
  label: string;
  description: string;
  items: TechnologyItem[];
}

export interface CapabilityEvidence {
  id: string;
  title: string;
  summary: string;
  evidence: string[];
  demonstratedIn: string[];
}

export interface DeliveryStage {
  id: string;
  label: string;
  description: string;
  outputs: string[];
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

export type ThemeId = "phosphor" | "light" | "amber" | "ice";

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
  revealSequence: boolean;
  achievements: AchievementId[];
  discoveredSecrets: string[];
  commandCount: number;
  startedAt: number;
  notification: { id: number; kind: "system" | "network" | "achievement" | "warning"; text: string } | null;
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

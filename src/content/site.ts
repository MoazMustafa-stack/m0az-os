import type {
  Achievement,
  ExperienceItem,
  NavigationItem,
  Project,
  ResearchItem,
  SkillGroup,
} from "@/types/domain";

export const siteIdentity = {
  name: "Moaz",
  handle: "moaz",
  systemName: "M0AZ_OS",
  hostname: "portfolio",
  role: "Software engineer · systems builder · research-minded maker",
  summary:
    "I design software as a set of understandable systems: deliberate interfaces, reliable state, and engineering decisions that can be explained.",
  currentFocus:
    "Building resilient product systems and experimental tools where infrastructure, interaction, and research meet.",
  github: "https://github.com/MoazMustafa-stack",
  email: null as string | null,
  linkedin: null as string | null,
  resumePath: null as string | null,
};

export const navigation: NavigationItem[] = [
  { id: "home", label: "HOME", path: "/", shortcut: "01" },
  { id: "projects", label: "PROJECTS", path: "/projects", shortcut: "02" },
  { id: "experience", label: "EXPERIENCE", path: "/experience", shortcut: "03" },
  { id: "research", label: "RESEARCH", path: "/research", shortcut: "04" },
  { id: "skills", label: "SKILLS", path: "/skills", shortcut: "05" },
  { id: "lab", label: "LAB", path: "/lab", shortcut: "06" },
  { id: "contact", label: "CONTACT", path: "/contact", shortcut: "07" },
];

export const projects: Project[] = [
  {
    id: "01",
    slug: "m0az-os",
    name: "M0AZ_OS",
    oneLineDescription:
      "A portfolio expressed as a coherent, browser-native operating environment.",
    status: "ACTIVE",
    category: "Product systems",
    period: "2026 — present",
    role: "Product engineer · interaction architect",
    stack: ["Next.js", "React", "TypeScript", "CSS", "Vitest", "Playwright"],
    problem:
      "Technical portfolios often separate the memorable interface from the useful information. Recruiters get friction; curious engineers get a visual theme with no depth.",
    solution:
      "M0AZ_OS makes the interface itself the portfolio. Familiar web navigation and a real command model both operate on one session, one filesystem, and shareable URLs.",
    architecture: [
      "Server-rendered App Router entry points provide stable, indexable URLs.",
      "A reducer-backed client session coordinates pointer, keyboard, and terminal actions.",
      "Structured content drives the workspace, fictional filesystem, search, and project hosts.",
      "The terminal parser accepts a bounded grammar and never executes machine code.",
    ],
    engineeringHighlights: [
      "One typed action surface across visible navigation and shell commands",
      "Versioned, privacy-conscious device-local persistence",
      "Reduced-motion, keyboard, screen-reader, and mobile-first behavior",
      "Static project routes with contextual metadata and simulated SSH hosts",
    ],
    challenges: [
      "Keeping the OS metaphor rich without hiding essential information",
      "Making terminal output expressive without creating noisy live regions",
      "Preserving deterministic server markup around time and device preferences",
    ],
    outcomes: [
      "A fast portfolio shell understandable without terminal knowledge",
      "An exploration layer that rewards technical visitors without gating content",
      "A content model designed for safe, incremental publication",
    ],
    links: [
      {
        label: "SOURCE (after repository publish)",
        href: "https://github.com/MoazMustafa-stack/m0az-os",
        kind: "source",
      },
    ],
    milestones: [
      { hash: "58f3f6e", date: "2026-08-28", message: "establish architecture and project brain" },
      { hash: "3a0baa0", date: "2026-08-28", message: "initialize application runtime" },
    ],
  },
  {
    id: "02",
    slug: "resilient-runtime-lab",
    name: "Resilient Runtime Lab",
    oneLineDescription:
      "An engineering notebook for recovery-oriented, intermittently connected systems.",
    status: "EXPERIMENT",
    category: "Systems research",
    period: "ongoing lab",
    role: "Researcher · systems engineer",
    stack: ["Python", "Linux", "Distributed systems", "Edge computing"],
    problem:
      "Systems at the edge must remain useful when power, connectivity, and compute are inconsistent, but failure behavior is often treated as an afterthought.",
    solution:
      "Explore recovery as a first-class product behavior through explicit checkpoints, degradation modes, and measurable interruption scenarios.",
    architecture: [
      "Scenario generator describes interruption and recovery windows.",
      "Workload state is checkpointed through small replaceable strategies.",
      "A deterministic simulator compares completion, loss, and recovery cost.",
    ],
    engineeringHighlights: [
      "Failure-injection as a reusable test surface",
      "Explicit recovery state instead of implicit retries",
      "Reproducible experiment inputs and outputs",
    ],
    challenges: [
      "Separating useful models from unrealistic precision",
      "Keeping experiments explainable as the state space grows",
    ],
    outcomes: [
      "A research direction and repeatable experimental vocabulary",
      "Publication details intentionally limited while the work matures",
    ],
    links: [],
    milestones: [
      { hash: "lab-001", date: "current", message: "define recovery experiment boundary" },
      { hash: "lab-000", date: "current", message: "catalog research questions" },
    ],
  },
  {
    id: "03",
    slug: "interface-protocols",
    name: "Interface Protocols",
    oneLineDescription:
      "Small experiments in treating interaction rules like observable system protocols.",
    status: "EXPERIMENT",
    category: "Interaction engineering",
    period: "ongoing lab",
    role: "Designer · prototyper",
    stack: ["TypeScript", "React", "Accessibility", "State machines"],
    problem:
      "Interfaces become fragile when visual behavior, navigation, and state transitions are implemented as unrelated event handlers.",
    solution:
      "Prototype interaction models as named events with inspectable state changes, then render multiple input modes over the same protocol.",
    architecture: [
      "Intent enters through pointer, keyboard, or command adapters.",
      "Typed events update a small deterministic state model.",
      "Views subscribe to derived state rather than duplicating intent logic.",
    ],
    engineeringHighlights: [
      "Input-mode parity",
      "Inspectable state transitions",
      "Accessibility behavior designed into the protocol",
    ],
    challenges: [
      "Avoiding ceremony for interactions that should remain simple",
      "Keeping URL and transient UI state at appropriate boundaries",
    ],
    outcomes: [
      "A reusable set of patterns demonstrated directly by M0AZ_OS",
      "A lab space for ideas that are not presented as finished client work",
    ],
    links: [],
    milestones: [
      { hash: "proto-02", date: "current", message: "unify command and navigation actions" },
      { hash: "proto-01", date: "current", message: "map keyboard interaction protocol" },
    ],
  },
];

export const experience: ExperienceItem[] = [
  {
    period: "NOW",
    role: "Independent product engineering",
    context: "BUILD / TEST / DOCUMENT",
    summary:
      "Turning ambiguous product ideas into maintainable systems with clear boundaries, careful interfaces, and evidence-driven iteration.",
    highlights: [
      "Architecture and implementation across product and infrastructure layers",
      "Documentation designed to survive handoffs and future sessions",
      "Accessible, responsive interfaces treated as engineering constraints",
    ],
  },
  {
    period: "ONGOING",
    role: "Research and systems practice",
    context: "OBSERVE / MODEL / RECOVER",
    summary:
      "Exploring resilient computation, developer tooling, and interaction models through reproducible prototypes rather than unsupported claims.",
    highlights: [
      "Small experimental systems with explicit assumptions",
      "Failure analysis and recovery-oriented design",
      "Technical storytelling that exposes tradeoffs and decisions",
    ],
  },
];

export const research: ResearchItem[] = [
  {
    id: "R-01",
    title: "Graceful work under intermittent power",
    status: "PROTOTYPING",
    abstract:
      "How should local compute choose, preserve, and resume useful work when power availability is uncertain? The current focus is the experiment design: workload boundaries, checkpoint strategies, and honest metrics.",
    tags: ["edge", "resilience", "simulation"],
  },
  {
    id: "R-02",
    title: "Interaction parity as a system property",
    status: "DOCUMENTING",
    abstract:
      "A study of interfaces where command, pointer, keyboard, deep-link, and assistive interactions express the same underlying actions without creating duplicate products.",
    tags: ["HCI", "state", "accessibility"],
  },
  {
    id: "R-03",
    title: "Explainable failure archives",
    status: "EXPLORING",
    abstract:
      "What changes when abandoned prototypes are documented around assumptions, failure modes, and lessons instead of hidden as incomplete work?",
    tags: ["learning", "engineering practice", "archives"],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    name: "systems-engineering",
    load: "HIGH",
    items: ["Linux", "reliability", "state modeling", "debugging", "architecture"],
    note: "Designing boundaries, failure behavior, and operable systems.",
  },
  {
    name: "product-engineering",
    load: "HIGH",
    items: ["TypeScript", "React", "Next.js", "responsive UI", "accessibility"],
    note: "Moving from product intent to fast, understandable interfaces.",
  },
  {
    name: "research-prototyping",
    load: "ACTIVE",
    items: ["Python", "experiments", "simulation", "measurement", "technical writing"],
    note: "Making assumptions visible and prototypes reproducible.",
  },
  {
    name: "developer-workflow",
    load: "WARM",
    items: ["Git", "testing", "CI", "documentation", "tooling"],
    note: "Reducing the cost of understanding, changing, and shipping code.",
  },
];

export const achievements: Achievement[] = [
  { id: "first-command", name: "HELLO, SHELL", description: "Executed a first command." },
  { id: "sysadmin", name: "SYSADMIN", description: "Executed ten commands." },
  { id: "archaeologist", name: "ARCHAEOLOGIST", description: "Found the lab graveyard." },
  { id: "panic", name: "PANIC", description: "Tested the snapshot recovery system." },
  { id: "curious", name: "CURIOUS", description: "Found the filtered local service." },
  { id: "remote-shell", name: "REMOTE SHELL", description: "Mounted a project host." },
];

export const graveyard = [
  {
    name: "omniscient-task-router",
    failure: "The abstraction grew faster than the evidence for it.",
    learned: "Instrument a simple workflow before generalizing it.",
  },
  {
    name: "infinite-dashboard",
    failure: "The interface optimized density instead of decisions.",
    learned: "A useful dashboard should make the next action clearer.",
  },
  {
    name: "perfect-first-architecture",
    failure: "It attempted to resolve uncertainty before usage existed.",
    learned: "Keep seams explicit, then earn complexity with evidence.",
  },
];

export const findProject = (slugOrId: string) => {
  const normalized = slugOrId.toLowerCase();
  return projects.find(
    (project) =>
      project.slug === normalized ||
      project.id === normalized.padStart(2, "0") ||
      project.name.toLowerCase() === normalized,
  );
};

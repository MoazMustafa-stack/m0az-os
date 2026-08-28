import type {
  Achievement,
  ArchiveProject,
  CapabilityEvidence,
  DeliveryStage,
  EducationItem,
  EngagementPath,
  ExperienceItem,
  NavigationItem,
  PrivateWorkTeaser,
  Project,
  ProofPoint,
  ResearchItem,
  ServiceOffering,
  SiteIdentity,
  SkillGroup,
  TechnologyCategory,
} from "@/types/domain";

export const siteIdentity: SiteIdentity = {
  name: "Moaz Mustafa",
  handle: "moaz",
  systemName: "M0AZ_OS",
  hostname: "portfolio",
  headline: "Software engineer building reliable product systems, developer tools, and interactive computing experiences.",
  role: "Software engineer · full-stack product engineer · systems builder",
  summary: "I turn product intent into understandable, testable software—from commerce workflows and web platforms to local-first tools and experimental desktop systems.",
  currentFocus: "Building product systems, developer tools, and resilient interfaces with explicit architecture, measurable behavior, and reliable delivery.",
  availability: "Open to full-time and internship roles in India and the GCC, with India as the primary focus and remote collaboration available for GCC teams.",
  graduation: "B.Tech. CSE · VIT · Expected May 2027",
  targetRoles: ["Software Engineer", "Full-Stack / Product Engineer", "Systems Software / Developer Tools"],
  github: "https://github.com/MoazMustafa-stack",
  email: "moazmustafa2005@gmail.com",
  linkedin: "https://www.linkedin.com/in/moazmustafa/",
  resumePath: "/moaz-mustafa-resume.pdf",
};

export const navigation: NavigationItem[] = [
  { id: "home", label: "HOME", path: "/", shortcut: "01" },
  { id: "projects", label: "WORK", path: "/projects", shortcut: "02" },
  { id: "experience", label: "EXPERIENCE", path: "/experience", shortcut: "03" },
  { id: "about", label: "ABOUT", path: "/about", shortcut: "04" },
  { id: "contact", label: "CONTACT", path: "/contact", shortcut: "05" },
];

export const secondaryNavigation: NavigationItem[] = [
  { id: "research", label: "RESEARCH", path: "/research", shortcut: "R1" },
  { id: "skills", label: "SKILLS", path: "/skills", shortcut: "S1" },
  { id: "lab", label: "LAB", path: "/lab", shortcut: "L1" },
  { id: "resume", label: "RESUME", path: "/resume", shortcut: "CV" },
];

export const recruiterEmailHref = "mailto:moazmustafa2005@gmail.com?subject=Software%20engineering%20opportunity%20-%20Moaz%20Mustafa";
export const freelanceEmailHref = "mailto:moazmustafa2005@gmail.com?subject=Freelance%20project%20inquiry%20-%20Moaz%20Mustafa";

export const engagementPaths: EngagementPath[] = [
  {
    id: "recruiting",
    audience: "FOR RECRUITERS",
    title: "Review role fit",
    description: "Scan verified experience, engineering range, education, and delivery evidence for software engineering roles.",
    signals: ["Cordis.us internship", "VIT · May 2027", "Product + systems"],
    actionLabel: "REVIEW EXPERIENCE",
    actionSection: "experience",
    emailLabel: "EMAIL ABOUT A ROLE",
    emailHref: recruiterEmailHref,
  },
  {
    id: "freelance",
    audience: "FOR FREELANCE HIRES",
    title: "Scope a product build",
    description: "Explore end-to-end product and web delivery for focused remote engagements of roughly two to eight weeks.",
    signals: ["Product systems", "Web applications", "Consulting + audits"],
    actionLabel: "EXPLORE SERVICES",
    actionSection: "contact",
    emailLabel: "DISCUSS A PROJECT",
    emailHref: freelanceEmailHref,
  },
];

export const proofPoints: ProofPoint[] = [
  { id: "commerce-tests", value: "260+", label: "AUTOMATED TESTS", detail: "Release coverage for the Lahmah Cuts commerce platform." },
  { id: "velora-performance", value: "60 FPS", label: "INTEGRATED GRAPHICS", detail: "17.05 ms p95 in Velora's rendered prototype baseline." },
  { id: "portfolio-verification", value: "20 / 18 / 16", label: "ROUTES / UNIT / E2E", detail: "Static routes, unit/component tests, and desktop/mobile browser flows in M0AZ_OS." },
];

export const education: EducationItem[] = [
  { institution: "Vellore Institute of Technology", degree: "B.Tech. in Computer Science and Engineering", period: "Expected May 2027", result: "CGPA 8.34/10.0" },
];

export const services: ServiceOffering[] = [
  {
    id: "product-systems",
    title: "Product and systems builds",
    description: "Turn a defined product problem into an operable system with clear technical boundaries and a maintainable delivery path.",
    deliverables: ["Discovery", "Architecture", "Implementation", "Testing", "Deployment", "Handoff"],
  },
  {
    id: "web-apps",
    title: "Web application delivery",
    description: "Build responsive React and Next.js applications with APIs, authentication, data workflows, and administrative surfaces.",
    deliverables: ["React / Next.js", "APIs", "Auth", "Data workflows", "Responsive UI", "Admin tooling"],
  },
  {
    id: "consulting",
    title: "Technical consulting",
    description: "Use a focused engagement to clarify architecture, isolate reliability or performance risks, or prove an idea quickly.",
    deliverables: ["Architecture review", "Performance audit", "Debugging", "Prototype", "Technical documentation"],
  },
];

export const projects: Project[] = [
  {
    id: "01",
    classification: "featured",
    workType: "PLATFORM",
    slug: "cephalon-ordis",
    name: "Cephalon-Ordis",
    oneLineDescription: "A local-first command center for orchestrating subscription-authenticated Codex workers without API keys.",
    status: "ACTIVE",
    category: "AI operations platform",
    period: "2026 — present",
    role: "Product engineer · systems architect",
    stack: ["SvelteKit", "Fastify", "PostgreSQL", "WebSockets", "Rust", "Tauri", "Docker"],
    problem: "Local Codex work spans machines, approvals, artifacts, reports, and usage limits, but those concerns are difficult to coordinate safely as one observable workflow.",
    solution: "Build a local-first operations surface that coordinates authenticated workers, durable jobs, approvals, reports, and cost-aware scheduling without introducing direct API-key usage.",
    constraints: [
      "Use local ChatGPT subscription authentication instead of a direct OpenAI API client.",
      "Keep runtime state, artifacts, credentials, and deployment data outside the public source tree.",
      "Make approvals scoped, one-time, and explicit at the coordinator boundary.",
    ],
    architecture: [
      "A SvelteKit installable PWA provides the operator surface.",
      "A Fastify coordinator exposes REST and WebSocket job and event flows.",
      "PostgreSQL stores jobs, append-only events, approvals, reports, idea graphs, and ledger records.",
      "Windows and Arch workers heartbeat into the coordinator and invoke locally authenticated Codex processes.",
      "A Rust/Tauri companion and local voice-service boundary extend native workflows without weakening server boundaries.",
    ],
    engineeringHighlights: [
      "Subscription-only allowance guard with queued and waiting-for-allowance states",
      "Append-only event history and scoped approval model",
      "Local MCP server plus validated workflow skills",
      "Explicit operations, security, and deployment documentation",
    ],
    challenges: [
      "Coordinating heterogeneous workers without obscuring operator authority",
      "Keeping durable state understandable across long-running workflows",
      "Separating public code from machine-specific runtime and deployment state",
    ],
    evidence: [
      "First vertical slice spans the PWA, coordinator, database, workers, reports, approvals, and cost guard.",
      "Repository verification covers tests, typechecking, builds, skill validation, and subscription-only auditing.",
    ],
    outcomes: [
      "Established an end-to-end local orchestration foundation with explicit security and operations boundaries.",
      "Created one durable model for jobs, events, approvals, artifacts, and reports across Windows and Arch workers.",
    ],
    links: [],
    milestones: [
      { hash: "vertical-slice", date: "2026", message: "connect operator UI, coordinator, database, and workers" },
      { hash: "security-boundary", date: "2026", message: "formalize approvals, auth, and subscription-only safeguards" },
    ],
  },
  {
    id: "02",
    classification: "featured",
    workType: "EXPERIMENTAL SYSTEM",
    slug: "velora",
    name: "Velora",
    oneLineDescription: "An experimental spatial desktop interface for Linux built as a safe layer inside Omarchy and Hyprland.",
    status: "EXPERIMENT",
    category: "Systems interaction",
    period: "2026 — present",
    role: "Systems engineer · interaction prototyper",
    stack: ["Rust", "Tokio", "Godot 4", "GDScript", "Wayland", "Hyprland", "Unix sockets"],
    problem: "Desktop environments expose applications and system state through disconnected panels and commands, leaving little room to explore spatial interaction without replacing reliable existing workflows.",
    solution: "Represent applications, projects, and system state as a navigable pixel-art world while leaving Hyprland in control and keeping ordinary desktop shortcuts available.",
    constraints: [
      "Run inside the existing desktop session instead of replacing the compositor.",
      "Never overwrite Omarchy or Hyprland configuration.",
      "Keep process-launch policy inside the native core rather than trusting frontend input.",
    ],
    architecture: [
      "Godot renders a pixel-perfect frontend with navigable rooms and facing-aware interaction stations.",
      "A native Rust GDExtension transports typed protocol-v2 messages over a user-only Unix socket.",
      "A Tokio core discovers XDG desktop entries, exposes bounded registry pages, and controls launches by desktop ID.",
      "Handshake, heartbeat, and reconnect flows avoid blocking the Godot main thread.",
      "A supervised development runner owns the native core lifecycle without modifying the surrounding desktop.",
    ],
    engineeringHighlights: [
      "Typed IPC handshake, heartbeat, paging, and reconnect behavior",
      "Core-side desktop-entry revalidation before process launch",
      "Deterministic security, IPC, acceptance, and rendered-performance gates",
      "Conventional desktop remains available whenever the prototype exits",
    ],
    challenges: [
      "Balancing a playful spatial model with fast conventional controls",
      "Bridging Godot and native Rust without blocking rendering",
      "Making experimental Linux integration safe to enter and easy to leave",
    ],
    evidence: [
      "Validated on Intel UHD integrated graphics with native Wayland and the Godot Compatibility renderer.",
      "Live IPC checks exercise handshake, registry transfer, shutdown, and frontend reconnection.",
    ],
    outcomes: [
      "Averaged 60 FPS across 600 frames with 17.05 ms p95 and 19.27 ms maximum frame time.",
      "Delivered a vertical-slice desktop world backed by native application discovery and controlled launches.",
    ],
    links: [{ label: "SOURCE", href: "https://github.com/MoazMustafa-stack/Velora", kind: "source" }],
    milestones: [
      { hash: "phase-1", date: "2026", message: "complete pixel-perfect spatial interaction foundation" },
      { hash: "phase-2", date: "2026", message: "connect native Rust core through typed IPC" },
    ],
  },
  {
    id: "03",
    classification: "featured",
    workType: "PORTFOLIO PRODUCT",
    slug: "m0az-os",
    name: "M0AZ_OS",
    oneLineDescription: "A recruiter-readable portfolio expressed as a coherent browser-native operating environment.",
    status: "ACTIVE",
    category: "Product systems",
    period: "2026 — present",
    role: "Product engineer · interaction architect",
    stack: ["Next.js", "React", "TypeScript", "CSS", "Vitest", "Playwright"],
    problem: "Technical portfolios often separate a memorable interface from useful evidence: recruiters get friction while technical visitors get a visual theme with little depth.",
    solution: "Make the interface itself the portfolio while keeping every important path clickable, indexable, keyboard-accessible, and independent of terminal knowledge.",
    constraints: [
      "Keep essential content available through ordinary navigation.",
      "Never execute terminal input as machine code or send it to a server.",
      "Publish only owner-reviewed identity, experience, project, and contact facts.",
    ],
    architecture: [
      "Static App Router entry points provide shareable and indexable URLs.",
      "A reducer-backed client session coordinates pointer, keyboard, history, palette, and terminal actions.",
      "Structured content drives modules, project routes, search, fictional files, and simulated project hosts.",
      "A bounded parser and curated effect model keep terminal behavior finite and safe.",
      "Versioned local persistence stores preferences and achievements without contact or analytics data.",
    ],
    engineeringHighlights: [
      "One typed action surface across visible navigation and shell commands",
      "Safe quoted-input parser, filesystem, project mounts, and limited pipelines",
      "Responsive, reduced-motion, high-contrast, keyboard, and screen-reader behavior",
      "Production metadata, sitemap, robots, manifest, and generated social image",
    ],
    challenges: [
      "Keeping the OS metaphor rich without hiding evidence",
      "Preserving mounted session state while URLs remain shareable",
      "Testing hydrated terminal UI without screenshot-induced false warnings",
    ],
    evidence: [
      "The production build pre-renders 20 static and generated routes.",
      "The verification suite grew from 15 unit/component tests and 8 browser flows to 18 unit/component tests and 16 desktop/mobile Chromium flows.",
    ],
    outcomes: [
      "Created a portfolio that supports fast recruiter scanning and deeper technical exploration.",
      "Kept the terminal, command palette, visible controls, and direct routes synchronized around one session model.",
    ],
    links: [{ label: "SOURCE", href: "https://github.com/MoazMustafa-stack/m0az-os", kind: "source" }],
    milestones: [
      { hash: "foundation", date: "2026", message: "establish architecture and public-safety boundaries" },
      { hash: "release", date: "2026", message: "verify responsive shell, terminal, metadata, and routes" },
    ],
  },
];

export const archiveProjects: ArchiveProject[] = [
  { classification: "archive", id: "A1", name: "mdForge", summary: "A cross-platform Markdown workspace built with a concurrent Rust and Tauri backend.", evidence: "10–20× smaller than Electron, about 50 MB RAM, and sub-100 ms live preview.", stack: ["Rust", "Tauri", "React", "TypeScript"], href: "https://github.com/MoazMustafa-stack/mdForge" },
  { classification: "archive", id: "A2", name: "Topper-Inator", summary: "A transcript-processing product spanning a Next.js client, FastAPI backend, and Supabase data layer.", evidence: "1.37 s for six-video ingestion and 11.7 s per-video transcript extraction.", stack: ["Python", "FastAPI", "Next.js", "Supabase"], href: "https://github.com/MoazMustafa-stack/topperinator" },
  { classification: "archive", id: "A3", name: "FogIQM", summary: "A fog-assisted IoT network quality simulation for latency, jitter, accuracy, and ablation analysis.", evidence: "Produces comparative tables and repeatable latency, jitter, MOS, and utilisation plots.", stack: ["Python", "NumPy", "SciPy", "Matplotlib"], href: "https://github.com/MoazMustafa-stack/FogIQM" },
  { classification: "archive", id: "A4", name: "Multi-Cam Tracker", summary: "A multi-camera object-tracking prototype with global identities and reviewable detection history.", evidence: "Combines YOLOv8, StrongSORT, SQLite logging, and a Flask review dashboard.", stack: ["Python", "YOLOv8", "StrongSORT", "Flask", "SQLite"], href: "https://github.com/MoazMustafa-stack/Multi-Cam-Tracker" },
];

export const privateWork: PrivateWorkTeaser[] = [
  { classification: "private-teaser", id: "P1", name: "Intermittent Edge AI Recovery", summary: "Research and prototype for intermittent-power recovery in edge AI inference.", status: "PRIVATE PROTOTYPE", tags: ["Python", "edge AI", "recovery systems", "simulation"], href: null },
];

export const experience: ExperienceItem[] = [
  {
    company: "Cordis.us",
    role: "Software Engineering Intern",
    period: "May 2026 — July 2026",
    location: "Hybrid · Bahrain",
    project: "Lahmah Cuts commerce platform",
    summary: "Engineered production commerce workflows across the customer experience, operational administration, payments, and release-quality layers.",
    outcomes: [
      "Delivered secure authentication, checkout, order management, and role-based administrative workflows with Next.js, React, TypeScript, Supabase, and PostgreSQL.",
      "Designed verified-webhook payment, receipt, refund, reconciliation, immutable-financial-record, email, and WhatsApp delivery pipelines.",
      "Added PostgreSQL Row-Level Security, role-based access, Dockerized testing, GitHub Actions CI/CD, API smoke tests, and more than 260 automated tests.",
    ],
  },
];

export const research: ResearchItem[] = [
  { id: "R-01", title: "Intermittent-power recovery in edge AI", status: "PROTOTYPING", abstract: "A private research prototype exploring how edge inference can checkpoint, degrade, and recover when available power is uncertain.", tags: ["edge AI", "resilience", "simulation"] },
  { id: "R-02", title: "Fog-assisted internet quality monitoring", status: "DOCUMENTING", abstract: "Simulation work comparing latency, jitter, accuracy, ablation behavior, and quality timelines in fog-assisted IoT networks.", tags: ["fog computing", "IoT", "measurement"] },
  { id: "R-03", title: "Interaction parity as a system property", status: "EXPLORING", abstract: "How can pointer, keyboard, command, deep-link, and assistive interactions express the same underlying actions without creating parallel products?", tags: ["HCI", "state", "accessibility"] },
];

export const skillGroups: SkillGroup[] = [
  { name: "product-engineering", load: "HIGH", items: ["TypeScript", "React", "Next.js", "FastAPI", "Node.js", "responsive UI"], note: "Shipping coherent applications across interface, API, data, and operational boundaries." },
  { name: "systems-infrastructure", load: "HIGH", items: ["Rust", "Python", "Linux", "Wayland", "PostgreSQL", "Docker", "Redis", "Kafka"], note: "Designing native services, reliable state, process boundaries, and operable infrastructure." },
  { name: "developer-tooling", load: "ACTIVE", items: ["Tauri", "Godot 4", "Git", "REST APIs", "local-first tools", "technical documentation"], note: "Building tools that make complex workflows inspectable and easier to operate." },
  { name: "testing-delivery", load: "HIGH", items: ["Vitest", "Playwright", "pytest", "GitHub Actions", "CI/CD", "Dockerized testing"], note: "Treating verification, release gates, and failure behavior as product features." },
  { name: "research-prototyping", load: "WARM", items: ["simulation", "computer vision", "edge AI", "performance measurement", "HCI"], note: "Using bounded prototypes and explicit metrics to investigate uncertain systems questions." },
];

export const capabilityEvidence: CapabilityEvidence[] = [
  {
    id: "C-01",
    title: "End-to-end product delivery",
    summary: "Own a product path across interface, API, data, operational workflows, and release readiness.",
    evidence: ["Authentication, checkout, order management, payments, and administration delivered for Lahmah Cuts.", "Cephalon-Ordis vertical slice connects installable UI, coordinator, workers, approvals, and reports."],
    demonstratedIn: ["Cordis.us / Lahmah Cuts", "Cephalon-Ordis"],
  },
  {
    id: "C-02",
    title: "Systems architecture and integration",
    summary: "Define explicit process, protocol, state, security, and recovery boundaries across mixed technology stacks.",
    evidence: ["Durable PostgreSQL event model, cost guards, and approval boundaries in Cephalon-Ordis.", "Typed Unix-socket protocol, reconnect behavior, and Wayland integration in Velora."],
    demonstratedIn: ["Cephalon-Ordis", "Velora"],
  },
  {
    id: "C-03",
    title: "Reliability and release confidence",
    summary: "Turn critical behavior into repeatable checks, failure-safe workflows, and evidence a team can inspect.",
    evidence: ["More than 260 automated tests plus Dockerized CI and smoke tests for Lahmah Cuts.", "Unit, component, and desktop/mobile browser coverage across M0AZ_OS routes and interactions."],
    demonstratedIn: ["Cordis.us / Lahmah Cuts", "M0AZ_OS"],
  },
  {
    id: "C-04",
    title: "Developer experience and tooling",
    summary: "Make complex systems easier to operate with safe interfaces, local-first workflows, and useful documentation.",
    evidence: ["Safe terminal grammar and unified navigation state in M0AZ_OS.", "Local orchestration and inspectable worker activity in Cephalon-Ordis; sub-100 ms preview in mdForge."],
    demonstratedIn: ["M0AZ_OS", "Cephalon-Ordis", "mdForge"],
  },
  {
    id: "C-05",
    title: "Performance and research prototyping",
    summary: "Build bounded prototypes, select meaningful measurements, and use results to guide the next engineering decision.",
    evidence: ["Velora held a 60 FPS prototype baseline with 17.05 ms p95 on integrated graphics.", "FogIQM, Topper-Inator, and Multi-Cam Tracker test simulation, ingestion, and computer-vision questions."],
    demonstratedIn: ["Velora", "FogIQM", "Topper-Inator", "Multi-Cam Tracker"],
  },
];

export const technologyCategories: TechnologyCategory[] = [
  {
    id: "T-01",
    label: "Languages",
    description: "Languages used across shipped product work, native systems, automation, and research prototypes.",
    items: [
      { name: "TypeScript", context: "Product interfaces, APIs, typed content, and testable web systems" },
      { name: "Python", context: "FastAPI services, simulation, data work, and computer vision" },
      { name: "Rust", context: "Native services, local tooling, IPC, and performance-sensitive work" },
      { name: "SQL", context: "PostgreSQL models, Row-Level Security, reconciliation, and SQLite prototypes" },
      { name: "GDScript", context: "Godot interface and interaction layer for Velora" },
    ],
  },
  {
    id: "T-02",
    label: "Product frameworks",
    description: "Application layers selected to match the product surface and operational constraints.",
    items: [
      { name: "React + Next.js", context: "Commerce, portfolio, and responsive product interfaces" },
      { name: "SvelteKit + Fastify", context: "Cephalon-Ordis PWA and local coordinator" },
      { name: "FastAPI + Flask", context: "Python APIs, ingestion, and prototype services" },
      { name: "Tauri", context: "Small native desktop shells for local tools" },
      { name: "Godot 4", context: "Spatial desktop interaction and rendering experiments" },
    ],
  },
  {
    id: "T-03",
    label: "Data and messaging",
    description: "State, persistence, authorization, coordination, and realtime communication.",
    items: [
      { name: "PostgreSQL + Supabase", context: "Commerce data, RLS, payments, events, and durable state" },
      { name: "SQLite", context: "Portable local persistence for tracking prototypes" },
      { name: "Redis + Kafka", context: "Coordination and messaging in infrastructure-oriented work" },
      { name: "WebSockets", context: "Live coordinator and worker activity" },
      { name: "REST APIs", context: "Clear service boundaries and integration contracts" },
    ],
  },
  {
    id: "T-04",
    label: "Systems and platform",
    description: "Native integration and runtime concepts behind local-first and experimental computing work.",
    items: [
      { name: "Linux + Wayland", context: "Desktop systems and compositor integration" },
      { name: "Hyprland", context: "Workspace and window-manager integration for Velora" },
      { name: "Tokio", context: "Asynchronous Rust runtime and reconnect behavior" },
      { name: "Unix sockets + XDG", context: "Typed local IPC and standard service discovery" },
      { name: "Docker", context: "Reproducible services, testing, and handoff" },
    ],
  },
  {
    id: "T-05",
    label: "Developer tools and verification",
    description: "Tools used to keep work reviewable, repeatable, and safe to change.",
    items: [
      { name: "Git + GitHub Actions", context: "Versioned delivery, CI/CD, and release gates" },
      { name: "Playwright", context: "Desktop/mobile flows, accessibility paths, and visual checks" },
      { name: "Vitest", context: "Unit and component behavior in TypeScript applications" },
      { name: "pytest", context: "Python service and prototype verification" },
      { name: "Technical documentation", context: "Architecture, handoff, decisions, and operating guidance" },
    ],
  },
  {
    id: "T-06",
    label: "Research and applied AI",
    description: "A practical prototype stack for answering uncertain performance and systems questions.",
    items: [
      { name: "NumPy + SciPy", context: "Simulation and quantitative experiments" },
      { name: "Matplotlib", context: "Research output and comparison plots" },
      { name: "YOLOv8 + StrongSORT", context: "Multi-camera detection and tracking prototype" },
      { name: "Edge AI", context: "Intermittent-power recovery research" },
      { name: "Performance measurement", context: "Frame-time, latency, ingestion, and extraction evidence" },
    ],
  },
];

export const deliveryStages: DeliveryStage[] = [
  { id: "D-01", label: "Discover", description: "Clarify the user, constraint, failure mode, and success signal before choosing architecture.", outputs: ["problem framing", "constraints", "success evidence"] },
  { id: "D-02", label: "Architect", description: "Make state, trust, integration, and recovery boundaries explicit enough to review.", outputs: ["system shape", "contracts", "risk decisions"] },
  { id: "D-03", label: "Build", description: "Deliver the smallest coherent vertical slice, then expand around observed behavior.", outputs: ["working slice", "interfaces", "operational paths"] },
  { id: "D-04", label: "Verify", description: "Test critical flows and measure the properties that make the product credible.", outputs: ["automated checks", "performance evidence", "failure coverage"] },
  { id: "D-05", label: "Ship and hand off", description: "Package deployment, documentation, and ownership so the system remains operable.", outputs: ["release path", "documentation", "handoff"] },
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
  { name: "omniscient-task-router", failure: "The abstraction grew faster than the evidence for it.", learned: "Instrument a simple workflow before generalizing it." },
  { name: "infinite-dashboard", failure: "The interface optimized density instead of decisions.", learned: "A useful dashboard should make the next action clearer." },
  { name: "perfect-first-architecture", failure: "It attempted to resolve uncertainty before usage existed.", learned: "Keep seams explicit, then earn complexity with evidence." },
];

export const findProject = (slugOrId: string) => {
  const normalized = slugOrId.toLowerCase();
  return projects.find((project) => project.slug === normalized || project.id === normalized.padStart(2, "0") || project.name.toLowerCase() === normalized);
};

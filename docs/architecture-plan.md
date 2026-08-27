# M0AZ_OS architecture plan

## Repository audit

The repository began as a clean Create Next App project using Next.js 16.3.3,
React 19.2.8, TypeScript 5, App Router, and ESLint 9. There was no product code,
content, deployment configuration, test suite, or external integration to preserve.
The generated repository contains no `.openai/hosting.json`, so the project remains
a standard portable Next.js application rather than a Sites-hosted application.

## Proposed architecture

M0AZ_OS is one application with several public URL entry points. Every route mounts
the same `SystemShell` and supplies initial route state. Pointer navigation and the
terminal both call the same typed system actions; neither owns a second navigation
model.

```text
public route / pointer / keyboard / terminal
                    |
                    v
              system actions
                    |
                    v
          reducer-backed session state
              /            \
             v              v
       workspace UI    terminal transcript
```

Static portfolio content lives in `src/content/site.ts`. Domain contracts live in
`src/types`. The simulated shell is split into a tokenizer/parser, fictional
filesystem, and command executor. Browser persistence is versioned and contains
only preferences, discoveries, achievements, and command history.

## Route strategy

- `/`, `/about`, `/projects`, `/experience`, `/research`, `/skills`, `/contact`,
  `/resume`, and `/lab` are stable section URLs.
- `/projects/[slug]` statically renders project detail entry points with matching
  metadata.
- In-app actions use Next navigation so browser history, direct loading, and the
  visible workspace remain synchronized.
- The shell content is pre-rendered, preserving indexable headings and copy even
  though interaction is client-side.

## Migration strategy

No migration is needed. Development proceeds in reversible milestones:

1. documentation, public-safety rules, and the Obsidian brain;
2. design tokens and responsive system shell;
3. structured portfolio modules and public routes;
4. terminal, filesystem, shared actions, and persistence;
5. project hosts, boot sequence, effects, and secret layer;
6. accessibility, metadata, automated tests, and production verification.

## Major risks

- **Immersion hiding content:** persistent visible navigation and semantic content
  take priority over terminal-only interaction.
- **Hydration and URL drift:** route input is authoritative on mount; navigation is
  funneled through one action surface.
- **Public data exposure:** real personal/project details are not inferred from the
  workstation. Publishing is driven only by explicit content configuration.
- **Client bundle growth:** no terminal emulator, animation framework, audio
  library, or state dependency is added unless it solves a measured need.
- **Accessibility:** effects are decorative, motion is reducible, terminal output
  is not a noisy assertive live region, and all core actions are standard controls.

## Dependency decisions

- React context plus `useReducer` is sufficient for the session state; Zustand is
  not required for this scale.
- CSS handles transitions and display effects; no animation package is required.
- The terminal is purpose-built and never executes operating-system commands.
- Vitest, Testing Library, and Playwright are appropriate development-only tools
  for logic, component, and critical-flow coverage.

## Implementation phases

The phases in the product brief are preserved, but adjacent work may be delivered
together when doing so keeps the repository buildable. Core content is completed
before Easter eggs, and each major milestone is committed independently.

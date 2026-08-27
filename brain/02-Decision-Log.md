---
tags: [architecture, decisions]
---

# Decision log

## ADR-001 — One action surface

**Decision:** clickable navigation, keyboard actions, public routes, and terminal
commands converge on the same typed navigation and session actions.

**Why:** the operating-system metaphor is only credible if the terminal and visible
interface describe one state, not parallel applications.

## ADR-002 — Custom reducer instead of a state dependency

**Decision:** use React context and a reducer for the bounded session model.

**Why:** it keeps the client bundle small, exposes transitions clearly for tests,
and avoids adding a dependency before state complexity warrants it.

## ADR-003 — CSS effects, no animation runtime

**Decision:** use CSS for mount, scanline, cursor, and glitch effects.

**Why:** the visual language is intentionally restrained and does not require an
animation library. Reduced-motion can disable the effects centrally.

## ADR-004 — Explicitly safe starter content

**Decision:** publish only facts the owner has explicitly supplied or safe project
metadata created in this repository. Unknown contact and resume details remain
unconfigured rather than inferred from local files.

**Why:** the repository is public and the user explicitly requested care around
sensitive data and projects.

## ADR-005 — Native history for persistent in-app state

**Decision:** in-app navigation updates the browser URL with the History API while
the shared system provider remains mounted. Back/forward events synchronize the
same reducer state.

**Why:** replacing the full App Router tree during terminal-driven navigation reset
the simulated host session. Native history preserves the OS session while keeping
routes shareable and server-rendered on direct visits.

## ADR-006 — Explicit hydration readiness for visual tests

**Decision:** the provider marks the document ready after React hydration, and
visual tests wait for that marker before taking screenshots.

**Why:** Playwright temporarily hides carets during screenshots. A screenshot racing
hydration could mutate the terminal input and produce a false hydration warning.

# Architecture

## Boundaries

M0AZ_OS separates durable portfolio content, session behavior, command semantics,
and rendering:

- `src/content/site.ts` is authoritative content.
- `src/types/domain.ts` defines public domain and session contracts.
- `src/components/system/SystemProvider.tsx` owns transient/persisted session state.
- `src/lib/terminal/` owns shell grammar, filesystem data, and command results.
- `src/components/system/` renders the OS shell and adapts user input to actions.
- `src/app/` supplies stable, indexable entry points and route metadata.

## Shared actions

`navigate(section, projectSlug?)` is the common path for visible buttons and terminal
effects. It updates state immediately and pushes the matching App Router URL. A
direct route load initializes the same state through `SystemShell` props.

Command execution is pure with respect to the browser. It receives a serializable
context and returns lines plus declared effects. The terminal adapter applies only
known effects such as navigation, directory change, theme change, or opening a
curated link.

## Server/client boundary

Route pages, metadata, sitemap, icons, and structured records stay server-capable.
`SystemShell` is the explicit client boundary because pointer/keyboard input,
reducer state, and localStorage are interactive. Next.js still pre-renders the
initial Client Component output, so important text exists in static HTML.

## Persistence

One versioned key, `m0az-os:session`, contains only:

- theme and sound preference;
- boot completion;
- discovered achievements/secrets;
- a bounded command history.

It never stores contact form data, machine information, analytics identifiers, or
terminal output. `reset --local-state --confirm` clears the owned key only.

## Security model

Terminal input never reaches a shell, `eval`, `Function`, dynamic import, API route,
or server action. Filesystem nodes and outbound links are created from curated
static data. The repository ignores environment files, private brain notes,
certificates, reports, and platform state.

## Accessibility model

Core information is reachable through landmarks and ordinary controls. Command use
is optional. Terminal transcript is labelled but not an assertive live region; a
single polite summary announces completion. Motion and scanlines are removed for
reduced-motion users, contrast tokens respond to high-contrast preference, and
focus rings remain visible across themes.

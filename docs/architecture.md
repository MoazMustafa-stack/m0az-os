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

Skills data is split into typed capability evidence, technology categories, delivery
stages, and attention-based skill groups in `src/content/site.ts`. Home, Experience,
Skills, structured Person metadata, and fictional filesystem files select from those
same records; no page owns a separate technology list.

## Persistence

One versioned key, `m0az-os:session`, contains only:

- theme and sound preference;
- boot completion;
- discovered achievements/secrets;
- a bounded command history.

It never stores contact form data, machine information, analytics identifiers, or
terminal output. `reset --local-state --confirm` clears the owned key only.

Boot completion prevents the first-contact prompt from repeating on ordinary return
visits. A terminal `reboot` deliberately reopens the same bounded prompt.

## Presentation modes

The same semantic modules render in desktop and mobile shells. Desktop uses a
sidebar plus Explore group; mobile uses a fixed five-tab dock, floating terminal,
sticky module headers, and card surfaces. This is CSS-driven and does not create a
second content or navigation model.

Theme state supports a true light palette plus the phosphor, amber, and ice dark
palettes. The visible mode button, command palette, and safe `theme` terminal command
all dispatch the same reducer event.

## Security model

Terminal input never reaches a shell, `eval`, `Function`, dynamic import, API route,
or server action. Filesystem nodes and outbound links are created from curated
static data. The repository ignores environment files, private brain notes,
certificates, reports, and platform state.

## Accessibility model

Core information is reachable through landmarks and ordinary controls. First-time
initialization requires typing one clearly displayed bounded command; after reveal,
terminal use is optional. Terminal transcript is labelled but not an assertive live region; a
single polite summary announces completion. Motion and scanlines are removed for
reduced-motion users, the initialization delay is shortened, contrast tokens respond
to high-contrast preference, and focus rings remain visible across dark/light themes.

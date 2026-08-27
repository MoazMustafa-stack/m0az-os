# M0AZ_OS

M0AZ_OS is a personal portfolio expressed as a small browser-native operating
environment. The visible modules, public URLs, command palette, fictional
filesystem, and interactive terminal all operate on the same application state.

The product is designed for two speeds: a recruiter can click through the important
content immediately, while a curious visitor can discover project hosts, manual
pages, safe shell composition, achievements, and a quiet hidden layer.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- dependency-free reducer/context session model
- custom terminal tokenizer, parser, command registry, and filesystem
- CSS design/effect system with reduced-motion and high-contrast modes
- Vitest and Testing Library for logic/components
- Playwright for critical browser flows

No command entered in the browser is executed by the operating system. The terminal
is a finite simulation over curated portfolio data.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The canonical URL environment variable is public and
used only for metadata/sitemap generation.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Architecture

Public route, pointer, keyboard, command-palette, and terminal inputs converge on
the actions provided by `SystemProvider`. The reducer owns session state. Structured
content drives both the visual modules and shell interfaces.

```text
route / pointer / keyboard / terminal
                 |
                 v
            system actions
                 |
                 v
           session reducer
           /            \
          v              v
    workspace UI    shell transcript
```

See [docs/architecture.md](docs/architecture.md) and
[docs/command-system.md](docs/command-system.md) for the durable design.

## Edit portfolio content

Start with `src/content/site.ts`. The file contains the owner identity, navigation,
projects, experience, research, skills, achievements, and graveyard entries. Domain
contracts are in `src/types/domain.ts`.

Unknown private details are intentionally not inferred from this machine. Review a
public contact address and résumé PDF before configuring them. See
[docs/content-guide.md](docs/content-guide.md).

## Project brain

`brain/` is an Obsidian-compatible Markdown vault and the continuity layer for
humans and future coding sessions. Open `brain/` as a vault, then begin at
`00-Start-Here.md`. Repository-level `AGENTS.md` requires meaningful sessions to
refresh current state, change ledger, durable decisions, and handoff.

Use `brain/private/` for local-only notes. It is ignored by Git and must not contain
information required to build the public project.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, run the complete quality suite,
then deploy on any Next.js-compatible platform. The application has no backend,
secrets, database, or runtime third-party dependency.

## License

Source code is available under the MIT License. Portfolio prose and personal brand
content remain © Moaz unless otherwise stated.

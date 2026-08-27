---
tags: [m0az-os, index, continuity]
---

# M0AZ_OS brain

This folder is an Obsidian vault and the durable memory for the project. It is
deliberately plain Markdown so it remains useful in GitHub, any editor, and future
coding sessions.

## Open in this order

1. [[01-Current-State]] — what works now and current health.
2. [[05-Session-Handoff]] — the exact next task and known hazards.
3. [[02-Decision-Log]] — why the architecture looks the way it does.
4. [[04-Debugging-Playbook]] — how to reproduce and isolate failures.
5. [[03-Change-Ledger]] — chronological implementation history.

## Source-of-truth map

- Product content: `src/content/site.ts`
- Domain models: `src/types/domain.ts`
- System state/actions: `src/components/system/SystemProvider.tsx`
- Terminal behavior: `src/lib/terminal/`
- Architecture: `docs/architecture.md`
- Command reference: `docs/command-system.md`
- Content editing: `docs/content-guide.md`
- Hidden behavior: `docs/easter-eggs.md`

## Public-safety rule

Everything in this vault except `private/` is published with the repository. Never
record tokens, passwords, private emails, unpublished employer/client names, local
machine details, or private resume data here. Use `private/` for local-only notes.

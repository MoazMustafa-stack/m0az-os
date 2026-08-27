<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## M0AZ_OS continuity protocol

This repository is public. Never commit credentials, private contact details,
unpublished client work, raw resumes, private research, or identifying analytics.

Before changing code:

1. Read `brain/00-Start-Here.md` and `brain/05-Session-Handoff.md`.
2. Read the relevant architecture document in `docs/`.
3. Inspect `git status` and preserve unrelated work.

Before ending a meaningful session:

1. Update `brain/01-Current-State.md` and `brain/05-Session-Handoff.md`.
2. Append a dated entry to `brain/03-Change-Ledger.md`.
3. Record durable decisions in `brain/02-Decision-Log.md`.
4. Run the checks appropriate to the change and record the result.

Keep private scratch notes in `brain/private/`; that directory is ignored by Git.

---
tags: [handoff, next]
updated: 2026-08-28
---

# Session handoff

## Current objective

Prepare owner-reviewed public content and deploy the verified M0AZ_OS portfolio.

## Next concrete step

1. Authenticate GitHub CLI with `gh auth login -h github.com`.
2. Create and push the public `m0az-os` repository from the local `main` branch.
3. Review and replace placeholder-safe project, contact, LinkedIn, and résumé fields
   in `src/content/site.ts`; never infer these from local files.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and deploy.

## Constraints to preserve

- Do not inspect or publish files from sibling projects as portfolio content.
- Do not copy the local resume into `public/` without explicit owner review.
- Do not add real shell execution or interpret terminal input as code.
- Keep core navigation obvious and independent of command knowledge.
- Run `npm run check` and `npm run test:e2e` before pushing material changes.
- Update this note before ending the session.

## Known blocker

The saved GitHub CLI token is invalid. Local commits can continue. Public repository
creation/push requires the owner to complete `gh auth login -h github.com`.

## Verified baseline

- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run check`: pass (lint, typecheck, 14 tests, 20-route production build).
- `npm run test:e2e`: pass (8 tests across desktop and mobile Chromium).
- Representative views emit no browser errors or framework overlay.

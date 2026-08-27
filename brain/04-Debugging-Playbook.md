---
tags: [debugging, runbook]
---

# Debugging playbook

## Fast triage

1. Read [[05-Session-Handoff]] and inspect `git status`.
2. Reproduce with the smallest route and input.
3. Run `npm run lint`, `npm run test`, and `npm run build` independently; do not
   assume a passing dev server proves a production build.
4. For route mismatches, compare the URL-derived initial section with session state.
5. For terminal bugs, test tokenizer output before command execution.
6. For persistence bugs, inspect only the versioned `m0az-os:session` key and use
   the built-in local-state reset command.

## Common failure boundaries

- **Hydration:** time and uptime must initialize deterministically, then update in an
  effect. Browser APIs stay behind client boundaries.
- **Terminal:** input is data only. Never pass it to `eval`, `Function`, a shell,
  a server action, or an API endpoint.
- **Routes:** project slugs must exist in `site.projects`; unknown slugs use the
  framework not-found path.
- **Motion:** test again with reduced motion enabled; no delayed state may be
  required for content access.
- **Mobile keyboard:** the terminal panel uses viewport-safe sizing and must not
  trap focus.

## Useful commands

```bash
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
```

Record new repeatable failures and their fixes here.

# Content guide

## Publication checklist

Before adding personal or project content, confirm that it is intentionally public.
Do not copy from local résumés, client directories, research drafts, or sibling
repositories merely because they are accessible on the development machine.

For each project, verify:

- name, dates, role, and status are accurate;
- employer/client names may be disclosed;
- screenshots contain no accounts, keys, customer data, or private URLs;
- repository/demo links are genuinely public;
- outcomes are supportable and do not invent metrics;
- research status distinguishes an experiment from a published result.

## Editing identity and contacts

Edit `siteIdentity` in `src/content/site.ts`. The current email, LinkedIn, GitHub,
and résumé path were explicitly owner-approved on 2026-08-28. The published PDF is
an unchanged owner-approved copy; its phone number remains excluded from metadata.

Identity, availability, proof points, education, experience, services, skill groups,
technology categories, capability evidence, delivery stages, and work classifications
stay centralized in the same content module. Technology entries state where a tool was
used; capability claims link to named work and factual evidence. Do not publish
self-scored percentages, unsupported expertise labels, or tools without public evidence.
`projects`
contains complete flagship studies, `archiveProjects` contains compact public work,
and `privateWork` uses a typed nullable link. Private teasers must keep `href: null`
and must not gain repository links or unpublished evidence.

## Adding work

Add one complete flagship `Project` record to `projects`. The same object powers the
work list, detail route, metadata, terminal table, filesystem files, search, SSH
context, Git simulation, and sitemap. Use a URL-safe unique slug and curated links.

Primary navigation is intentionally limited to Home, Work, Experience, About, and
Contact. Add specialist routes to `secondaryNavigation` unless the information
architecture is deliberately reconsidered. Work keeps `/projects` as its public URL,
and `work` remains a terminal alias for `projects`.

## Metadata

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment. Do not put secrets in a
`NEXT_PUBLIC_` variable; those values are intentionally bundled for browsers.

## Updating the brain

After meaningful content changes, update the current state, change ledger, decision
log if applicable, and handoff under `brain/`. Keep private review notes in the
ignored `brain/private/` directory.

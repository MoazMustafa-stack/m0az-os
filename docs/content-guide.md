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

Edit `siteIdentity` in `src/content/site.ts`. `email`, `linkedin`, and `resumePath`
start as `null`. Add only a reviewed public alias/profile and a sanitized PDF placed
under `public/`. The UI deliberately shows an honest unconfigured state otherwise.

## Adding a project

Add one complete `Project` record to `projects`. The same object powers the project
list, detail route, metadata, terminal table, filesystem files, search, SSH context,
Git simulation, and sitemap. Use a URL-safe unique slug and curated outbound links.

## Metadata

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment. Do not put secrets in a
`NEXT_PUBLIC_` variable; those values are intentionally bundled for browsers.

## Updating the brain

After meaningful content changes, update the current state, change ledger, decision
log if applicable, and handoff under `brain/`. Keep private review notes in the
ignored `brain/private/` directory.

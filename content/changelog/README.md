# Product changelog entries

The public changelog starts after the first verified production deployment of
`assign-web@1.0.0`. Add one concise Markdown file for each meaningful,
user-visible product update. A product deployment is the evidence gate; this
directory does not define whether a feature is released.

Write each entry by hand before the production deployment and commit it with
`draft: true`; set `draft: false` only after the deployment is verified. See the
[release changelog gate](../../../architecture/operations/deployment-guide.md#public-production-release-changelog-gate).
Use lowercase kebab-case filenames (`YYYY-MM-DD-short-title.md`) and this front
matter:

```yaml
---
title: "Integrations marketplace is live"
version: "1.0.0"
summary: "Discover supported integrations and connect the tools your Workspace already uses from one marketplace."
changes:
  - "Browse integrations by category and connect them from one page."
  - "Connected tools now show their sync status."
date: 2026-09-01
draft: true
link:
  label: "Explore integrations"
  href: "https://assign.so/integrations"
---
```

`version` is the unprefixed SemVer of the deployed `assign-web` artifact.
`changes` holds at most eight short lines, and `link` is optional. Keep the
title, summary and changes understandable without internal project names, SHAs,
deployment identifiers, or implementation details. Combine related improvements
that reached production together.

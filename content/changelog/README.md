# Product changelog entries

The public changelog starts after the first verified production deployment of
`assign-web@1.0.0`. Add one concise Markdown file for each meaningful,
user-visible product update. A product deployment is the evidence gate; this
directory does not define whether a feature is released.

Use lowercase kebab-case filenames and this front matter:

```yaml
---
title: "Integrations marketplace is live"
summary: "Discover supported integrations and connect the tools your Workspace already uses from one marketplace."
date: 2026-09-01
draft: false
link:
  label: "Explore integrations"
  href: "https://assign.so/integrations"
---
```

`link` is optional. Keep the title and summary understandable without internal
project names, artifact versions, deployment identifiers, or implementation
details. Combine related improvements that reached production together.

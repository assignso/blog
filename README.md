# Assign Blog

The Astro source for [blog.assign.so](https://blog.assign.so). The blog is a static GitHub Pages site; canonical editorial content stays in the private [`assignso/posts`](https://github.com/assignso/posts) repository and is checked out during each build.

## Content sources

Astro loads Markdown and MDX matching `content/sources/**/posts/**/*.{md,mdx}`. The repository includes one local starter post under `content/sources/blog/posts/`. CI checks out `assignso/posts` at `content/sources/posts`, so files anywhere in that repository become part of the same collection.

Every post must include:

```yaml
---
title: "A useful title"
description: "A concise summary."
date: 2026-08-22
slug: a-useful-title
tags:
  - engineering
author: Assign team
draft: false
---
```

Slugs use lowercase letters, numbers, and hyphens. Draft posts are excluded from the site and RSS feed.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run the same checks as CI with:

```sh
pnpm build
pnpm lint
```

To preview canonical posts locally, check out `assignso/posts` into `content/sources/posts` before starting Astro.

## Deployment

`.github/workflows/deploy-pages.yml` builds and deploys on pushes to `main` and manual dispatches. The workflow requires the repository secret `ASSIGN_BLOG_SOURCE_READ_TOKEN`, a fine-grained GitHub token with read-only Contents access to `assignso/posts` and no write, package, workflow, or administration permissions.

GitHub Pages is configured with the custom domain `blog.assign.so`. Its Namecheap DNS record must be a CNAME with host `blog` and value `assignso.github.io`.

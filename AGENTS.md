# Assign Blog agent rules

- Follow the workspace rules and
  [`architecture/operations/developer-publication.md`](../architecture/operations/developer-publication.md)
  before changing public content, navigation, metadata, or publication behavior.
- Preserve the static, accessible, low-cost Astro/GitHub Pages boundary and the
  independent long-form editorial source in `posts`.

## Product changelog

- The public product changelog begins only after a verified production
  deployment of `assign-web@1.0.0`. Before that gate, keep `/changelog` in its
  empty pre-stable state.
- After that gate, add a dated entry under
  `content/changelog/` for each successful deployment that makes a
  meaningful user-visible improvement available. Use the verified deployment
  and released public documentation as evidence; planned, partial, rolled-back,
  internal-only, or unsupported work receives no entry.
- Keep updates small and product-facing: one clear title, one concise summary,
  and at most one useful public link. Combine related changes and omit internal
  repository names, SHAs, provider IDs, migration details, and release mechanics.
- Treat this page as a public update stream, not the compatibility ledger or
  release authority. `architecture/CHANGELOG.md` and immutable deployment
  records remain authoritative.

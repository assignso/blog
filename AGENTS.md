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
- After that gate, every public production deployment with a meaningful
  user-visible improvement gets one hand-written entry under
  `content/changelog/`. Follow the workspace
  [release changelog gate](../architecture/operations/deployment-guide.md#public-production-release-changelog-gate):
  aggregate the work since the last deployment, write the entry before
  deploying, commit it with `draft: true` and a passing build, and set
  `draft: false` only after the deployment is verified live. Planned, partial,
  rolled-back, internal-only, or unsupported work is never published.
- Every entry carries `version`, the public `assign-web` SemVer without a `v`
  prefix, and a `changes` list of short user-facing lines alongside `summary`.
  Never generate entries from commits or conversations, and run Humanizer on
  the prose.
- Keep updates small and product-facing: one clear title, one concise summary,
  up to eight short changes, and at most one useful public link. Combine
  related changes and omit internal repository names, SHAs, provider IDs,
  migration details, and release mechanics. The version is the only
  release identifier shown.
- Treat this page as a public update stream, not the compatibility ledger or
  release authority. `architecture/CHANGELOG.md` and immutable deployment
  records remain authoritative.

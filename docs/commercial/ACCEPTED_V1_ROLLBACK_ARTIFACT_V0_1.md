# Moon Today Board — Accepted v1 Rollback Artifact v0.1

Status: `R1 VERIFIED`

## Immutable identity

| Identity | Value |
| --- | --- |
| Annotated tag | `v1.0.0` |
| Tag object SHA | `ce228e3cfd4cdc466ad0977b9c2d6f1073a2b141` |
| Tagged commit | `bdf2853eb7087898352f804a02d38f251eb5268a` |
| Accepted application commit | `33e5750b9577277cb94dae2e736a7444e29e587a` |
| App build identity | `2026.07.22-b` |
| Service-worker cache identity | `2026-07-22-b` |

The tagged commit changes no runtime application path relative to the accepted
application commit. The tag records provenance, but it is not the executable
rollback pointer. When a clone includes the tag, the verifier checks both the
tag-object and peeled commit SHAs so tag movement remains detectable.

## Deployment guard

`.github/workflows/pages.yml` is manual-only and checks out recorded commit
`bdf2853eb7087898352f804a02d38f251eb5268a` directly. It never resolves the
deployment target through a movable tag name. Pushes to `main` no longer deploy
GitHub Pages. This prevents later commercial client commits from silently
replacing the accepted rollback surface.

Running the workflow is a deployment and still requires explicit Founder
authority. This document and the workflow change do not trigger it.

## Recovery procedure

1. Verify that the workflow checkout ref is the exact tagged commit above. If
   the clone includes `v1.0.0`, also verify its tag-object and peeled commit SHAs
   against this record.
2. Verify the accepted build and all v1 tests locally from the tag.
3. Obtain explicit Founder deployment authority.
4. Manually dispatch `Deploy accepted v1 rollback`.
5. Record run ID, deployed commit, URL, HTTP result, and build marker.

Rollback restores the accepted application code at the existing GitHub Pages
origin. It does not reconstruct local browser data. Users should export JSON
before any origin, browser, or storage transition.

# Moon Today Board

Today Board v1 is accepted as a complete local-first product baseline.

Commercial UX R1 is implemented as a preview layer over that baseline. Moon
Local remains free, on-device, offline-capable, and account-free. Paid plans,
sign-in, sync, checkout, and remote storage are not active in R1.

Copyright (c) 2026 nguyentudu. All rights reserved. This public repository is
not open source. First-party material is governed by [LICENSE](LICENSE); Moon
Today Board marks are addressed in [TRADEMARKS.md](TRADEMARKS.md). Third-party
and previously licensed material retains its original license and ownership.

Accepted repository commit: `33e5750b9577277cb94dae2e736a7444e29e587a`

Accepted runtime identities:

- App build: `2026.07.22-b`
- Service-worker cache: `2026-07-22-b`

## Product DNA

Reduce the cost of returning without taking away agency.

Product promise:

Help me return without rebuilding my world.

Commercial positioning: Moon is for founders and independent operators who
return to interrupted work across multiple workstreams. It competes on
continuity and Time To Context, not task volume, automated scheduling, or
engagement.

## R1 commercial preview

- First-return onboarding asks only for a situation and a return point.
- A sample can prefill the form without mutating the board.
- Moon Local is the only active entitlement.
- Continuity Pro and Founding License are visibly marked preview-only.
- Account, sync, and checkout controls are unavailable and fail-closed.
- Continuity Review is a non-functional Continuity Pro preview for Moon Local;
  it does not calculate board data, emit telemetry, or assign a productivity score.
- Trust and local-data promises are available in the application and under
  `docs/commercial/`.

Candidate pricing is documented in `docs/commercial/OFFER_V0_1.md`; it is not a
live offer or adopted payment configuration.

## Accepted v1 rollback

Annotated tag `v1.0.0` resolves to the accepted v1 repository merge without any
runtime-path difference from accepted application commit
`33e5750b9577277cb94dae2e736a7444e29e587a`.

The GitHub Pages workflow is manual-only and explicitly checks out accepted
commit `bdf2853eb7087898352f804a02d38f251eb5268a`. The `v1.0.0` tag records
provenance but is not the executable rollback pointer. Pushes to `main` no
longer deploy automatically. Dispatching the rollback workflow remains a
deployment and requires separate Founder authority.

Exact identities and recovery steps are recorded in
`docs/commercial/ACCEPTED_V1_ROLLBACK_ARTIFACT_V0_1.md`.

## What It Does

- Capture Situations and persist them locally on the user's device.
- Move Situations through Continue, Pause, Finished, and Leave Alone with
  explicit lifecycle semantics.
- Record Waiting context, a Return Point, and the next Action or Trigger.
- Track a Promise, its counterparty and due date, and its explicit status.
- Record an Outcome while preserving closure and reopening history.
- Attach links, images, audio, and files, then assign evidence roles without
  duplicating stored media.
- Open assigned re-entry evidence directly from the Situation that needs it.
- Search and filter Situations by their saved continuity context.
- Edit through progressive sections with independent draft continuity,
  explicit Save and Cancel, and guarded state transitions.
- Export and import the board as JSON while preserving accepted semantics.
- Install and run as an offline-capable, local-first PWA with explicit update
  activation and edit-session protection.

## Run Locally

```bash
npm install
npm run dev
```

Or:

```bash
npm run start
```

Open the local Vite URL shown in the terminal.

## GitHub Setup

If this repo has no remote yet:

```bash
git remote add origin <GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

If a remote already exists:

```bash
git push
```

Do not push to GitHub until the intended repository URL is known.

## Deploy Static

Use a static host for controlled public testing:

1. Vercel
2. Netlify
3. GitHub Pages

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

See [docs/deploy/public-test-url.md](docs/deploy/public-test-url.md).

## Use With People

Use the app with one person at a time.

Ask them to:

- Add one thing they may want to return to.
- Move it between zones if another zone feels more honest.
- Add or edit a tiny note.
- Hide a card if it should leave active load.
- Reload the page and confirm the board returns.
- Export their board if they want to keep it outside Moon.

The original bounded testing protocol remains useful when gathering feedback:

- Share the public test URL with only 10 testers.
- Observe whether they return without being pushed.
- Log whether the board made return feel lighter or heavier.
- Count return signals, not engagement.
- Stop after 10 users and review before adding scope.

Use [docs/validation/manual-ui-checklist.md](docs/validation/manual-ui-checklist.md), [docs/validation/user-log-template.md](docs/validation/user-log-template.md), and [docs/validation/return-interview.md](docs/validation/return-interview.md) during testing.

## Local Save

The board saves in the browser on the user's device through local storage. It exists only so a reload can restore the board.

There is no cloud account, remote database, or cross-device sync. Users can keep a copy outside Moon with Export JSON.

## V1 Frozen Scope

The accepted v1 intentionally excludes:

- AI
- voice features
- account
- backend
- database
- analytics
- tracking
- notification
- sync
- collaboration
- marketplace
- payments
- Railway backend

Local storage is allowed only for product continuity. No tracking, analytics, telemetry, or remote calls are included.

No cloud. No account. No tracking.

These boundaries describe the accepted v1 release. They do not permanently
prohibit separately governed work in a future version.

## Static Deploy

For controlled public testing, use a static host only. See [docs/deploy/static-deploy.md](docs/deploy/static-deploy.md).

## Accepted V1 Status

Today Board v1 is **ACCEPTED** at commit
`33e5750b9577277cb94dae2e736a7444e29e587a`.

| Acceptance area | Result | Accepted scope |
| --- | --- | --- |
| Code | PASS | Production build and the complete repository `test:*` suite pass. |
| Android runtime | PASS | Responsive interaction, long-card editing, independent edit sessions, and standalone behavior are accepted. |
| Offline | PASS | Local-first persistence, offline app-shell behavior, JSON portability, and old-board compatibility are accepted. |
| Lifecycle | PASS | Promise and closure guardrails, atomic transitions, history integrity, and Leave Alone consent are accepted. |
| UX | PASS | Re-entry-first presentation, progressive editing, actionable evidence, draft continuity, and card-scoped sticky actions are accepted. |
| PWA update | PASS | Install readiness, explicit update activation, busy/edit protection, and app/cache identity alignment are accepted. |

This acceptance supersedes earlier candidate, `EARLY PASS`, pending-proof,
and in-progress status wording for Today Board v1.

Voice, collaboration, and marketplace capabilities are post-v1 scope and
were not included in this accepted release.

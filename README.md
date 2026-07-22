# Moon Today Board

Today Board v1 is accepted as a complete local-first product baseline.

Accepted repository commit: `33e5750b9577277cb94dae2e736a7444e29e587a`

Accepted runtime identities:

- App build: `2026.07.22-b`
- Service-worker cache: `2026-07-22-b`

## Product DNA

Reduce the cost of returning without taking away agency.

Product promise:

Help me return without rebuilding my world.

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

# Moon Today Board

Moon Product v1 Local for controlled public testing.

This is not launch. This is not scale. This is only a local-first test surface for 10 users.

## Product DNA

Reduce the cost of returning without taking away agency.

Product promise:

Help me return without rebuilding my world.

## What It Does

- Create cards.
- Rename cards.
- Move cards between Continue, Pause, Finished, and Leave Alone.
- Add and edit a tiny note.
- Hide cards.
- Save locally for continuity.
- Export JSON for portability.
- Import JSON from a previous board export.

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

## Test With Users

Use the app with one person at a time.

Ask them to:

- Add one thing they may want to return to.
- Move it between zones if another zone feels more honest.
- Add or edit a tiny note.
- Hide a card if it should leave active load.
- Reload the page and confirm the board returns.
- Export their board if they want to keep it outside Moon.

10-user protocol:

- Share the public test URL with only 10 testers.
- Observe whether they return without being pushed.
- Log whether the board made return feel lighter or heavier.
- Count return signals, not engagement.
- Stop after 10 users and review before adding scope.

Use [docs/validation/manual-ui-checklist.md](docs/validation/manual-ui-checklist.md), [docs/validation/user-log-template.md](docs/validation/user-log-template.md), and [docs/validation/return-interview.md](docs/validation/return-interview.md) during testing.

## Local Save

The board saves in the browser on the user's device through local storage. It exists only so a reload can restore the board.

There is no cloud account, remote database, or cross-device sync. Users can keep a copy outside Moon with Export JSON.

## Forbidden Scope

Do not add:

- AI
- account
- backend
- database
- analytics
- tracking
- notification
- sync
- team
- payment
- Railway backend

Local storage is allowed only for product continuity. No tracking, analytics, telemetry, or remote calls are included.

No cloud. No account. No tracking.

## Static Deploy

For controlled public testing, use a static host only. See [docs/deploy/static-deploy.md](docs/deploy/static-deploy.md).

## Next Milestone

10 users / 3 returns / 3 relief signals

## Current Status

```text
Re-entry Core                  EARLY PASS
Quick Capture                  PASS
Rich Media                     PASS
Storage Foundation             PASS WITH ARCHITECTURAL WARNING
Card Density                   PASS
Zone Auto-height               PASS ON ANDROID
Retrieval Surface              IN PROGRESS
Mobile Polish                  NEXT
Install Readiness              LATER
Cross-device Verification      REQUIRED
IndexedDB                      LIKELY LATER
Weekly Review                  DEFERRED
```

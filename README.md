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

## Test With Users

Use the app with one person at a time.

Ask them to:

- Add one thing they may want to return to.
- Move it between zones if another zone feels more honest.
- Add or edit a tiny note.
- Hide a card if it should leave active load.
- Reload the page and confirm the board returns.
- Export their board if they want to keep it outside Moon.

Use [docs/validation/manual-ui-checklist.md](docs/validation/manual-ui-checklist.md), [docs/validation/user-log-template.md](docs/validation/user-log-template.md), and [docs/validation/return-interview.md](docs/validation/return-interview.md) during testing.

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

## Static Deploy

For controlled public testing, use a static host only. See [docs/deploy/static-deploy.md](docs/deploy/static-deploy.md).

## Next Milestone

10 users / 3 returns / 3 relief signals

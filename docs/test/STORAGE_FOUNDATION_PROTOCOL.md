# Storage Foundation Protocol

Study status:

- STORAGE_FOUNDATION_IMPLEMENTED
- REAL_DEVICE_STORAGE_PROOF_PENDING

## Scope

Do not add:

- AI
- backend
- cloud
- account
- sync
- analytics
- notifications

## Local Storage

Canonical key:

`moon.today-board.v1`

Safe warning threshold:

`4 MB`

## What Must Be Visible

- current estimated board size
- percentage of safe quota
- per-card size estimate
- image count and estimated size
- audio count and estimated size
- file count and estimated size
- total board size

## Quota Guard

- Catch storage write failure.
- Never report saved when persistence fails.
- Show a clear storage error.
- Keep all checks local-only.
- Do not send analytics or telemetry.

## Cleanup

- Individual image removal must update UI, localStorage, and export JSON.
- Individual audio removal must update UI, localStorage, and export JSON.
- Individual file removal must update UI, localStorage, and export JSON.
- Hidden-card media cleanup removes media only from hidden cards.
- Export before cleanup remains available.

## Hard Gates

- storage usage visible
- quota error visible
- cleanup works
- export still works
- refresh still works

## IndexedDB Decision

IndexedDB recommendation: PENDING_REAL_DEVICE_RESULTS

Do not migrate storage silently.

Recommend IndexedDB only if real-device testing shows localStorage cannot reliably preserve compressed media.

# Media Storage Reliability

Study status:

- MEDIA_IMPLEMENTED
- REAL_DEVICE_PROOF_PENDING

## Current Storage

Today Board still uses localStorage only.

Canonical key:

`moon.today-board.v1`

This hardening task does not migrate storage.

## Guardrails

- Images are resized to a maximum width of 1280px.
- Images and screenshots are stored as compressed JPEG data URLs.
- Voice capture stops after 20 seconds.
- The app estimates board size before display.
- The app catches storage write failure.
- The app must not claim success after storage failure.
- Media remains portable through JSON export/import.

## Storage Error Copy

VI:

- Không đủ bộ nhớ trình duyệt để lưu media này.
- Card chưa được lưu.
- Hãy xóa media cũ hoặc xuất board để sao lưu.

EN:

- There is not enough browser storage for this media.
- The card was not saved.
- Remove older media or export the board as a backup.

## Migration Decision

INDEXEDDB_MIGRATION_RECOMMENDED = PENDING_REAL_DEVICE_RESULTS

Change to YES only if real-device testing shows that reliable media use cannot fit within localStorage.

Do not implement IndexedDB migration without explicit approval.

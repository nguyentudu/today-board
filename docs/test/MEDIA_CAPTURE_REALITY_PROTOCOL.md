# Media Capture Reality Protocol

Study status:

- MEDIA_IMPLEMENTED
- REAL_DEVICE_PROOF_PENDING

Change to MEDIA_REALITY_PASS only after real-device evidence exists.

## Scope

Do not add:

- AI
- transcription
- backend
- cloud storage
- account
- sync
- analytics
- tracking
- notifications
- search
- filter
- tag
- weekly review
- team features
- workflow
- new capture types

## Required Flow

Run on at least one real mobile browser and one desktop browser:

1. Open Today Board.
2. Open Quick Capture.
3. Upload or capture an image.
4. Confirm real thumbnail is visible before Save.
5. Record voice.
6. Confirm real audio player is visible before Save.
7. Save.
8. Open board.
9. Confirm card appears in Quay lại / Continue.
10. Confirm thumbnail appears after Save.
11. Confirm audio player appears after Save.
12. Refresh browser.
13. Confirm thumbnail remains.
14. Confirm audio player remains and is playable.
15. Export JSON.
16. Import into a clean board.
17. Confirm image, audio, link, and attachment metadata remain.

## Hard Gates

- actual thumbnail visible before Save
- actual thumbnail visible after Save
- actual thumbnail remains after refresh
- audio player visible and playable
- quota failure produces a visible error
- Save never claims success after storage failure
- individual media removal works
- export/import restores media
- platform results kept separate
- no fake device PASS
- no new product scope

## Verdict Rule

PASS only if at least one real mobile browser and one desktop browser complete the required flow with real media still visible.

Otherwise mark BORDERLINE or FAIL.

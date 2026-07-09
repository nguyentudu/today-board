# Quick Capture Persistence Bugfix

Study status: QUICK_CAPTURE_PERSISTENCE_READY

Canonical localStorage key:

`moon.today-board.v1`

## Scope

Do not add:

- AI
- backend
- cloud
- account
- sync
- analytics
- notifications
- new features

## Manual Browser Test

Use the public URL:

https://nguyentudu.github.io/today-board/

1. Open Quick Capture from the main board.
2. Enter a title.
3. Enter a note.
4. Enter a link.
5. Add a camera photo if the device supports it.
6. Record a short voice note if the browser supports it.
7. Select Save.
8. Confirm the screen says saved.
9. Select Mở board / Open board.
10. Confirm the new card appears in Quay lại / Continue.
11. Confirm title is preserved.
12. Confirm note is preserved.
13. Confirm link is preserved under saved context.
14. Confirm photo is preserved if captured.
15. Confirm voice is preserved if recorded.
16. Refresh the browser.
17. Confirm the card still exists.
18. Export JSON.
19. Confirm exported JSON includes the quick-capture card.
20. Import the JSON.
21. Confirm the quick-capture card remains present.

## Large Capture Check

1. Try saving a very large photo or voice capture.
2. If browser storage rejects the board, confirm the app shows a clear storage error.
3. Confirm the app does not claim the capture was saved.

## Hard Gates

- Save -> board shows card
- Refresh -> card remains
- Link preserved
- Photo preserved if captured
- Voice preserved if recorded
- Export includes card
- No fake PASS from code-only check

## Notes

Quick Capture must write to the same board storage as the main board.

No backend, cloud storage, sync, analytics, notifications, account, or AI is used.

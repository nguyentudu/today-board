# Media Capture Size Preview Fix

Study status:

- MEDIA_IMPLEMENTED
- REAL_DEVICE_PROOF_PENDING

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

## Expected Behavior

- Images are resized before saving.
- Maximum image width is 1280px.
- Screenshots are compressed before saving when screen capture is supported.
- Voice recording stops automatically after 20 seconds.
- The app shows media size before and after compression.
- If media remains too large for browser storage, the app shows a clear error and does not claim it saved.
- Saved cards show image thumbnails and audio players.
- Refresh preserves image thumbnails and audio players.
- Export/import preserves compressed image and audio data.

## Manual Browser Test

Use:

https://nguyentudu.github.io/today-board/

1. Open Quick Capture.
2. Enter a title.
3. Capture or choose a photo.
4. Confirm the size message appears.
5. Save.
6. Open board.
7. Confirm the card appears in Quay lại / Continue.
8. Confirm the image thumbnail is visible.
9. Refresh.
10. Confirm the thumbnail is still visible.
11. Open Quick Capture again.
12. Record voice.
13. Confirm recording stops within 20 seconds if not stopped manually.
14. Save.
15. Open board.
16. Confirm the audio player is visible.
17. Refresh.
18. Confirm the audio player is still visible.
19. Export JSON.
20. Import the exported JSON.
21. Confirm thumbnails and audio players remain visible.

## Screenshot Check

1. Open a normal card.
2. Use Chụp màn hình / Capture screen if the browser supports it.
3. Confirm the size message appears.
4. Confirm the screenshot thumbnail appears under saved context.
5. Refresh.
6. Confirm the screenshot thumbnail remains visible.

## Storage Failure Check

1. Try a very large image or long/high-size audio capture.
2. Confirm the app shows a clear media-too-large or storage error.
3. Confirm it does not claim the media was saved.

## Hard Gates

- quick photo capture visible after Save
- screenshot visible after Save if supported
- voice playable after Save
- refresh preserves media
- storage failure visible
- no fake PASS

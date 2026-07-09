# Quick Capture E2E Checklist

Study status: QUICK_CAPTURE_E2E_READY

Use the public URL:

https://nguyentudu.github.io/today-board/

## Scope

Do not add:

- AI
- backend
- cloud
- account
- sync
- analytics
- notifications
- workflow

## Main Path

- Open the board.
- Confirm the "Ghi nhanh" / "Quick Capture" button is visible.
- Open Quick Capture.
- Enter a title.
- Enter a note.
- Enter a link.
- Add a camera photo if the device supports it.
- Record a short voice note if the browser supports it.
- Save.
- Select "Mở board" / "Open board".
- Confirm the new card appears in "Quay lại" / "Continue".
- Confirm the title is preserved.
- Confirm the note is preserved.
- Confirm the link appears under saved context.
- Confirm the photo preview appears under saved context when a photo was captured.
- Confirm the audio player appears under saved context when voice was recorded.

## Export / Import

- Export JSON.
- Import the exported JSON.
- Confirm the quick-capture card is still present.
- Confirm title, note, link, photo, and voice fields are preserved.

## Share Target

- Open Quick Capture with shared params:
  `?mode=quick-capture&title=Shared%20Title&text=Shared%20Text&url=https%3A%2F%2Fexample.com`
- Confirm title is prefilled.
- Confirm note/text is prefilled.
- Confirm link is prefilled.
- Save.
- Open board.
- Confirm the saved card appears in "Quay lại" / "Continue".

## Empty Capture

- Open Quick Capture with no prefilled values.
- Leave title, note, link, photo, and voice empty.
- Select Save.
- Confirm the app shows a gentle message.
- Confirm no crash occurs.

## Pass Criteria

- Save creates a new card when capture content exists.
- New card appears in Quay lại by default.
- Title, note, and link are preserved.
- Camera photo attaches to the card when supported.
- Voice recording attaches to the card when supported.
- Export/import preserves the quick-capture card.
- Share Target prefill still works.
- Empty captures fail gently with no crash.
- No forbidden scope is added.

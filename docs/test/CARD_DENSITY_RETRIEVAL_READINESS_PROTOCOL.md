# Card Density Retrieval Readiness Protocol

## Test Purpose

Verify Today Board is easier to scan before adding Search / Filter / Tag.

## Before / After Expected Behavior

Before:

- cards opened with full editor visible
- raw media payloads could appear in card fields
- mobile scanning became difficult with media-heavy cards

After:

- cards are collapsed by default
- raw base64/data URLs are hidden from normal UI
- Open shows readable detail
- Edit shows the full editor and capture controls
- media appears as thumbnails, audio players, file rows, and count indicators

## Mobile Checklist

- no horizontal scrolling
- summary text clamps to 2-3 lines
- Open / Edit / Collapse controls are easy to reach
- one card opens independently
- thumbnails stay within card width
- long links wrap safely
- edit controls remain reachable above the mobile keyboard

## Raw Base64 Visibility Check

- Create or import a card with image/audio data URLs.
- Confirm no `data:image`, `data:audio`, or base64 payload appears in collapsed cards.
- Confirm no raw media payload appears in Open mode.
- Confirm Edit mode does not expose `imageRefs`, `audioRefs`, or `fileRefs` as raw technical text fields.

## Collapse / Expand Behavior

- Reload the board.
- Confirm every card starts collapsed.
- Open one card.
- Confirm only that card opens.
- Select Edit.
- Confirm editor appears only for that card.
- Select Collapse.
- Confirm the card returns to summary mode.

## Media Indicator Check

- Cards with media show only non-zero indicators.
- Images show as `3 ảnh` / `3 images`.
- Voice shows as `1 ghi âm` / `1 voice note`.
- Files show as `1 file`.
- Links show as `2 link` / `2 links`.

## Cleanup Confirmation Check

- Hide a card with media.
- Select hidden media cleanup.
- Confirm summary appears before cleanup.
- Confirm cancel prevents cleanup.
- Confirm explicit confirmation is required before cleanup runs.

## Export / Import Regression Check

- Export a board with links, images, audio, files, notes, timestamps, and states.
- Import into a clean board.
- Confirm cards are still collapsed by default.
- Confirm media still renders in Open mode.
- Confirm Edit mode still preserves capture controls.

## Known Limitations

- No Search / Filter / Tag yet.
- No IndexedDB migration yet.
- Real-device media proof remains tracked in media reality docs.

## Next Milestone

Search / Filter / Tag

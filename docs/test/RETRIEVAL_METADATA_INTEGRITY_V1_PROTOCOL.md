# Retrieval Metadata Integrity v1 Protocol

## 1. Mission

Verify Today Board classifies links, tags, and ordinary text correctly so retrieval indicators and filters do not mislabel context.

## 2. Defect Summary

A mixed Link field containing two valid URLs and one ordinary line such as `#research` could be counted as three links. That made indicators, Has-link filtering, and acceptance evidence ambiguous.

## 3. Canonical Valid-link Definition

A link is counted as retrieval metadata only when it is a valid `http://` or `https://` URL. Validation uses the shared helper in `src/lib/links.ts`.

## 4. Valid and Invalid Examples

Valid:
- `https://example.com`
- `http://example.com/path`
- `https://example.com?q=test`

Invalid:
- `#research`
- `research`
- `ghi chú thường`
- `www.example.com`
- `example.com`
- `data:image/jpeg;base64,...`
- `blob:https://example.com/...`
- `javascript:alert(1)`
- empty strings
- objects and arrays

## 5. Shared-validator Requirement

Collapsed link count, Has-link filtering, search indexing of readable links, and Open mode link rendering must use the same validator.

## 6. Indicator Logic

Collapsed cards count only valid HTTP/HTTPS URLs. Invalid Link-field lines do not increase the link count.

## 7. Has-link Filter Logic

Has-link is true only when `extractValidHttpUrls(card.richLinks).length > 0`.

## 8. Search Versus Tag-filter Distinction

Generic search may match human text, valid URLs, filenames, and tags. Tag filtering must inspect only `tags[]`.

## 9. Tag Integrity Rules

Tags are manual metadata. They are never inferred from Snapshot, Note, Why still open, If you return, Bookmark reason, Link lines, filenames, or media metadata.

## 10. Unique-token Acceptance Method

Use `retrieval-proof-742` only in `tags[]`.

Expected:
- collapsed card shows `#retrieval-proof-742`
- Open mode shows it read-only
- Edit mode preloads it
- search `retrieval-proof-742` and `#retrieval-proof-742` find the card
- tag filter `#retrieval-proof-742` finds the card
- refresh and export/import preserve it

## 11. Old-board Compatibility

Mixed Link-field content is preserved. Invalid lines are not silently deleted, converted into tags, or moved into another field.

## 12. Export/import Behavior

Export preserves raw Link-field content, tags, media, state, timestamps, and unrelated fields. Import normalizes tags safely and does not infer tags from link or snapshot text.

## 13. Search Stability Regression Checklist

- Search input remains mounted.
- No app-level render per keystroke.
- No localStorage write per keystroke.
- Composition events remain handled.
- 120 ms debounce remains.
- Media payloads are not searched.

## 14. Android Manual Proof Steps

Scenario A: two valid URLs plus `#research` should show `2 link`, render only two clickable anchors, and preserve `#research` as non-link text.

Scenario B: `#research` only should show no link indicator and should not match Has link.

Scenario C: put `retrieval-proof-742` only in Tags and confirm collapsed, Open, search, tag filter, refresh, and export/import behavior.

Scenario D: put `#research` in Snapshot only and confirm generic search can match it while tag filter does not.

Scenario E: export/import the tagged board and verify tags, link counts, media, audio, and state.

Scenario F: repeat search stability checks with `nghien cuu`, `nghiên cứu`, Backspace, and `retrieval-proof-742`.

## 15. Known Limitations

Manual Android proof remains required before PASS. Desktop Chrome, iPhone Safari, and Installed PWA remain retest required.

## 16. Next Milestone

Mobile Layout Polish

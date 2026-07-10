# Retrieval Surface v1 Protocol

## 1. Mission

Verify that a person can find the exact card they need to return to by content, state, media, date, or manual tag.

## 2. Product Rationale

Retrieval supports the promise: help me return without rebuilding context. It should make existing cards easier to find without turning Today Board into a task manager, dashboard, or knowledge base.

## 3. Searchable Fields

Search covers title, note, context snapshot, why still open, if you return, bookmark reason, readable links, manual tags, and file names.

Search does not inspect raw base64 media, data URLs, serialized objects, internal IDs, storage keys, or MIME payloads.

## 4. Filter Logic

All active retrieval groups combine with AND logic.

## 5. Tag Rules

Tags are manual, optional, lowercased, deduplicated, limited to 8 per card, and limited to 32 characters per tag. Stored tags omit the leading `#`; display adds it back.

## 6. AND / OR Combination Behavior

- Search terms use AND.
- Selected states use OR.
- Selected media filters use AND.
- Selected tags use AND.
- Last-touch filter adds another AND condition.

## 7. Old-board Compatibility

Older boards without `tags` load with `tags: []`. Malformed tag values are normalized safely and unrelated fields are preserved.

## 8. Mobile Checklist

- Retrieval surface appears above storage and attention zones.
- Search and filter chips wrap without horizontal scrolling.
- Touch targets remain approximately 44px.
- Result count and clear actions remain reachable.
- Empty result states stay compact.

## 9. Export/import Regression

- Export includes tags.
- Import restores tags.
- Import accepts old boards without tags.
- Search and tag filters work after import.

## 10. Quick Capture Regression

Quick Capture remains unchanged. It may leave tags empty in v1. A quick-captured card must still be findable by title, note, or link.

## 11. Known Limitations

- Retrieval UI state is in memory only and may reset on refresh.
- No semantic search, fuzzy ranking, saved searches, project hierarchy, or auto-tagging.
- Cross-device verification remains required.

## 12. Prohibited Claims

Do not claim PMF, retention proof, commercial validation, semantic search, AI organization, or cross-device sync.

## 13. Next Milestone

Mobile Layout Polish

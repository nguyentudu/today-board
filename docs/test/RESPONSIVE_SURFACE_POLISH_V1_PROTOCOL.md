# Responsive Surface Polish v1 Protocol

## 1. Mission

Polish the existing retrieval and card surfaces so Today Board remains light, stable, readable, and usable across mobile and desktop.

## 2. Product Rationale

Retrieval is now correct. This pass makes retrieval easier to use without changing matching logic, data semantics, storage, capture, or Moon language.

## 3. Scope

- Compact mobile retrieval controls.
- Clear filter wording and hierarchy.
- Stable scroll behavior during retrieval changes.
- Wider expanded-card layout on desktop.
- Public-surface cleanup of internal test labeling.

## 4. Out of Scope

No AI, semantic search, saved searches, dashboards, new filters, new tag behavior, new schema, storage migration, Weekly Review, backend, analytics, or tracking.

## 5. Mobile Retrieval Compaction Behavior

Search, result count, filter toggle, active summary, and clear-all remain visible. Advanced filters are collapsed by default at the mobile breakpoint and expand inline.

## 6. Advanced-filter State Behavior

Collapsing filters does not clear retrieval state. The filter count excludes the search query and counts active state group, media chips, date filter, and selected tags.

## 7. Result-count Semantics

Inactive retrieval shows total card wording. Active retrieval shows result wording.

## 8. State Reset Wording

The state group uses non-destructive reset wording: `Đặt lại vùng` / `Reset states`.

## 9. Scroll-stability Rules

The Retrieval Surface stays mounted. Filter toggles update result sections below the controls. No scroll APIs are used for filter changes.

## 10. Desktop Expanded-card Strategy

On desktop, any zone containing an Open/Edit card spans the board grid row so the expanded card gets readable width while the attention state remains visible.

## 11. Mobile Expanded-card Behavior

Mobile keeps one-column layout. Expanded cards stay within viewport width, and media/audio/file/link rows wrap safely.

## 12. Accessibility Checklist

- Filter toggle exposes expanded/collapsed state.
- Filter chips use `aria-pressed`.
- Focus order follows visual order.
- Controls remain keyboard accessible.
- Open mode stays read-only.
- Edit mode stays separate.

## 13. Android Checklist

- Search remains visible.
- Advanced filters collapse by default.
- Active summary remains visible after filtering.
- Keyboard and IME stability remain intact.
- No horizontal scroll.

## 14. Desktop Checklist

- Collapsed board remains multi-column.
- Expanded Open card is not trapped in a narrow column.
- Expanded Edit textareas and media use readable width.
- Collapse restores compact layout.

## 15. iPhone/PWA Checklist

Retest mobile compaction, search typing, safe-area behavior, expanded card width, and horizontal overflow. Do not mark PASS without device proof.

## 16. Retrieval Regression Checklist

Run retrieval, search-stability, density, layout, metadata-integrity, and responsive-surface tests.

## 17. Quick Capture Regression

Quick Capture remains unchanged. Create a title/note/link/media card, save, open board, search, refresh, and search again.

## 18. Export/import Regression

Export a board with tag, link, image, audio, file, and state. Import into a test session and verify each remains intact.

## 19. Known Limitations

Desktop/iPhone/PWA manual verification is still required. Real browser screenshots were not captured by this protocol alone.

## 20. Prohibited Claims

Do not claim launch readiness, PMF, retention proof, automated retrieval intelligence, or cross-device sync.

## 21. Next Milestone

Install Readiness

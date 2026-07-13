# Installed PWA Finalization v1 Protocol

## 1. Mission

Close the remaining Android installed-PWA gaps around safe updates, non-obstructive offline status, and natural keyboard dismissal without changing Today Board product or data behavior.

## 2. Current Validated State

- PWA foundation, Android install recognition, home-screen icon, standalone launch, offline shell, offline retrieval, local media, installed data continuity, tag filtering, search, and Vietnamese IME: PASS.
- Real Build A to Build B activation and stale-cache proof: pending until the deployed two-build acceptance is completed.
- Desktop installed verification and iPhone Add to Home Screen: later platform checks.

## 3. Scope

- User-controlled service-worker update activation.
- Build marker for deployed-bundle acceptance.
- Inline offline status.
- Safe search-keyboard dismissal on reading intent.
- Focused regression tests and manual acceptance.

## 4. Out of Scope

No AI, backend, cloud, account, sync, analytics, notifications, background sync, IndexedDB, routing changes, new fields, filters, media types, or product workflows.

## 5. Update Lifecycle Design

Build B installs and waits. The running app shows a polite inline update notice and continues normally. Only the explicit reload action messages the waiting worker. `controllerchange` reloads once after that request. Install never calls `skipWaiting()` automatically.

## 6. Build Marker Strategy

The running bundle exposes `window.__TODAY_BOARD_BUILD_ID__`. A subtle marker is rendered only with `?debug-build=1`. The guarded acceptance baseline is Build A `2026.07.13-b` at commit `6c160c1`; the successor acceptance deployment is Build B `2026.07.13-c`.

## 7. Waiting-Worker Handling

Both an already waiting worker and a newly installed worker are detected. The notice appears only after a real waiting state and does not block board use.

## 8. Explicit Reload Behavior

The reload button sends `TODAY_BOARD_SKIP_WAITING`. A one-shot guard permits exactly one reload after the new worker controls the page. No board save, storage rewrite, or forced timer reload occurs.

## 9. Unsafe-State Protection

Reload is guarded while Edit mode is open, Quick Capture contains unsaved content, voice recording is active, or import/export work is active. The notice explains what must finish; it does not discard content or disable the app.

## 10. Cache Versioning

Current app-shell cache: `today-board-shell-2026-07-13-c`. Future shell releases must change the version while retaining the `today-board-shell` prefix.

## 11. Old-Cache Cleanup

Activation deletes only caches beginning with the Today Board prefix and not matching the current cache. User media, imported files, exported JSON, and localStorage are never copied into Cache Storage.

## 12. Unrelated-Cache Preservation

Caches outside the Today Board prefix are recorded as preserved and are never deleted. Development-only diagnostics list the current version, current cache, deleted Today Board caches, and preserved unrelated caches.

## 13. Offline Status Placement

Offline status is inline in the stable app status region at the top of the surface. It is not fixed, sticky, or overlaid, so it cannot cover card actions, audio controls, file rows, or bottom gestures.

## 14. Safe-Area Handling

The status region lives inside `#app`, which retains top, right, bottom, and left `env(safe-area-inset-*)` padding. Mobile status copy wraps within the viewport.

## 15. Keyboard Dismissal Behavior

With Search focused, tapping non-interactive board content blurs Search while retaining query and results. A touch scroll crossing 14 pixels blurs once. Returning to Search reuses the same input node.

## 16. IME Protection

Composition state is shared with the dismissal handler. No outside tap or scroll blur is performed during composition. The existing 120 ms search debounce and stable input lifecycle remain unchanged.

## 17. Tap-Outside Rules

Buttons, links, inputs, textareas, selects, labels, audio, video, contenteditable elements, role buttons, and explicitly interactive elements are excluded. Their first tap remains available to the control.

## 18. Scroll-Gesture Rules

Only touch pointers are considered. Native scrolling is never prevented. The handler is passive, performs no layout measurement, and blurs at most once per gesture.

## 19. Android Installed Checklist

- Type `nghien cuu`, `nghiên cứu`, and `#retrieval-proof-742`.
- Hold Backspace; verify caret, keyboard, and viewport stability.
- Tap blank card content; verify keyboard closes and query/results remain.
- Scroll results; verify one natural dismissal with no jump.
- Tap filters, tags, Clear Search, links, audio, and card actions; verify first-tap behavior.
- Toggle airplane mode near bottom content; verify inline status covers nothing and disappears online.

## 20. Browser Regression Checklist

- Repeat Search, IME, tap-outside, scroll, filter, and offline checks in regular Android Chrome.
- Verify browser and installed app still use the same saved board.
- Confirm no installed-mode CSS causes horizontal overflow.

## 21. Update Acceptance Checklist

1. Open Build A and record its marker or deployed asset identity.
2. Enter Edit and type unsaved text.
3. Deploy Build B.
4. Verify update notice appears without reload and unsaved text remains.
5. Verify reload action is guarded in Edit.
6. Save or exit, trigger reload, and verify Build B marker.
7. Verify board, tags, states, image, audio, and file data remain.

## 22. Cache Inspection Checklist

- Record the Build A Today Board cache.
- Create or identify an unrelated test cache.
- Activate Build B explicitly.
- Confirm Build B cache exists, Build A cache is gone, and unrelated cache remains.
- Confirm app-shell cache contains no board media or imported/exported payloads.

## 23. Data-Preservation Checklist

- Search `#retrieval-proof-742` before and after update.
- Verify its tag and attention state.
- Open cards with image, audio, and file before and after update.
- Refresh and verify the same local board remains.
- Re-run export/import and storage cleanup regressions.

## 24. Known Limitations

- Automated checks cannot prove a physical Android keyboard or OS-level installed window.
- A real two-deployment session is required for final waiting-worker and stale-cache acceptance.
- Desktop installed and iPhone Add to Home Screen remain separate platform validations.
- localStorage remains the architectural media limit; no cloud backup or permanent-storage guarantee exists.

## 25. Prohibited Claims

Do not claim cloud backup, cross-device sync, permanent storage, background sync, notification support, identical iOS install behavior, or final update PASS without the real Build A to Build B evidence.

## 26. Next Milestone Recommendation

After Android finalization: Desktop Installed Verification, then iPhone Add to Home Screen. Do not reopen Retrieval or Responsive Surface without a new regression.

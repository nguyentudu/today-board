# Install Readiness v1 Protocol

## 1. Mission

Make Today Board installable and reliable as a lightweight PWA without changing board behavior, storage semantics, retrieval, media, or Quick Capture.

## 2. Product Rationale

Today Board should reopen later like a stable local-first app while staying honest: no cloud backup, no sync, and no guarantee of permanent storage.

## 3. Scope

Manifest, icons, app-shell service worker, scoped cache versioning, offline shell, explicit update action, standalone safe-area layout, and install-mode regression checks.

## 4. Out of Scope

No AI, sync, backend, analytics, push notifications, background sync, IndexedDB migration, native wrappers, install wizard, or app-store packaging.

## 5. Manifest Fields

Required fields: id, name, short_name, description, start_url, scope, display, display_override, theme_color, background_color, lang, dir, icons, and existing share_target.

## 6. Icon Requirements

Required PNG icons: 192x192 and 512x512. Additional local icons are provided for 144, 180, 256, and 384. Maskable purpose is declared.

## 7. Service Worker Strategy

Cache the app shell and safe static assets only. Navigation uses network-first with cached shell fallback. Versioned static assets use cache-first once fetched.

## 8. Cache Versioning

Cache name uses `today-board-shell` prefix plus an explicit version. Update this version when the app shell strategy changes.

## 9. Cache Cleanup

Activation deletes only caches whose names start with the Today Board cache prefix and are not the current shell cache.

## 10. Offline Shell Behavior

After one successful online load, the cached shell should open offline and read saved localStorage board data. First-ever offline load is not promised.

## 11. Update Lifecycle

Waiting workers are detected. The app shows a small update action and never force-reloads immediately while a person may be editing or capturing.

## 12. Unsaved-work Rule

No automatic reload. The user must choose the update action.

## 13. Install Path

Use browser-native install paths. Do not add intrusive install prompts.

## 14. Standalone Layout

Safe-area variables are applied around the app shell. Browser and installed modes share the same board data.

## 15. Safe-area Checklist

- Header visible below status bar.
- Bottom controls not hidden by gesture area.
- No horizontal scroll.
- Expanded cards remain viewport-safe.

## 16. Android Install Checklist

Install, launch standalone, verify icon/name, reopen, refresh, search, Quick Capture, offline shell, media, export/import, cleanup, and update action.

## 17. Desktop Install Checklist

Install in Chrome where available, launch standalone window, resize, test expanded Open/Edit, offline shell, export/import, and update action.

## 18. iPhone Safari Notes

Use Add to Home Screen. Do not claim identical install behavior to Android. Verify safe areas, keyboard, media, export/import limits, and refresh persistence.

## 19. Installed PWA Regression Checklist

Retrieval, metadata integrity, valid links, tags, Open/Edit separation, card density, responsive polish, Quick Capture, media, export/import, storage, and cleanup must remain intact.

## 20. Quick Capture Regression

Installed app -> Quick Capture -> title/note/link/photo/voice -> Save -> open board -> search -> refresh -> search again.

## 21. Media Regression

Images render, audio plays, files remain visible, valid links remain external, invalid text is not treated as a link.

## 22. Export/import Regression

Export JSON must not be cached or reused accidentally. Import must preserve tags, states, media, files, links, and searchability.

## 23. Storage/cleanup Regression

Service worker cache is separate from the board storage meter. Cleanup logic and quota guard are unchanged.

## 24. Cache Reset Instructions

Developer reset:
- DevTools -> Application -> Service Workers -> Unregister.
- DevTools -> Application -> Cache Storage -> delete `today-board-shell-*`.
- Reload the public URL online before testing offline.

## 25. Known Limitations

Manual Android/desktop/iPhone installed-mode proof is still required before PASS. Offline first-ever load is not supported.

## 26. Prohibited Claims

Do not claim cloud backup, cross-device sync, background sync, app-store packaging, encryption, or permanent storage guarantees.

## 27. Next Milestone Recommendation

Tester Evidence System

## Responsive Surface Acceptance Record

Responsive Surface Polish was accepted before this milestone and should not be reopened without a new regression.

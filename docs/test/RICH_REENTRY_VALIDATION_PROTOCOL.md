# Rich Re-entry Validation Protocol

## Question

After 7-30 days, does image/link context help users recover faster than text-only cards?

Study status: RICH_CAPTURE_UX_READY

Status labels:

- IMAGE_UPLOAD_READY
- CAMERA_CAPTURE_READY_IF_SUPPORTED
- SCREENSHOT_CAPTURE_READY_IF_SUPPORTED
- SHARE_TARGET_READY_IF_SUPPORTED
- CLOUD_STORAGE_NOT_ADDED

## Scope

This is evidence collection only.

Do not add:

- AI
- backend
- account
- sync
- analytics
- tracking
- voice
- cloud upload
- mobile app
- search
- weekly review

## Test Setup

Ask each tester to create 1-3 cards.

For at least one card, ask them to add:

- one or more links
- one or more uploaded local images, captured photos, screen captures if supported, image data URLs, or local image references
- bookmark reason: "Vì sao lưu?"

Do not use cloud storage.

Do not claim camera, screen capture, or share target support on browsers that do not expose those capabilities.

Do not remind testers to return.

## Re-entry Window

Wait 7-30 days.

## Observation

When a tester returns, ask:

- Did the image/link context help you recover faster than text-only cards?
- Which saved context helped most?
- Did the bookmark reason help?
- Did you need another tool?
- Exact quote:

## Success Gate

- 10 users
- 3 successful rich re-entries
- users report image/link helped re-entry

## Verdict Rule

PASS only if rich capture helps re-entry without turning Board into a productivity app.

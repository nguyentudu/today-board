# Real Capture Validation Protocol

## Question

Does real local capture help a tester recover card context without turning Today Board into another system to manage?

Study status:

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
- database
- analytics
- tracking
- notifications
- team features
- workflow engine

## Test Setup

Ask each tester to create 1-3 cards.

For at least one card, ask them to add one captured context item:

- uploaded image
- camera photo if the device/browser supports it
- screen capture if the browser supports it
- shared link if the device/browser supports PWA share targets

Ask them to add a short bookmark reason: "Vì sao lưu?"

Images stay local to the browser or the exported JSON file.

No cloud storage is used.

## Return Window

Wait 7-30 days.

Do not remind testers to return.

## Observation

When a tester returns, ask:

- Did the image, photo, screen capture, or shared link help you recover context?
- Could you explain the card in under 30 seconds?
- Did you need another tool or document?
- Did this feel lighter or heavier?
- Exact quote:

## Success Gate

- 10 users
- 3 successful rich re-entries
- users report image/link context helped re-entry

## Stop Conditions

- people feel watched
- people feel pressured
- capture becomes another thing to maintain
- people open more tools, not fewer

## Verdict Rule

PASS only if real local capture helps re-entry without adding backend, cloud storage, analytics, or productivity pressure.

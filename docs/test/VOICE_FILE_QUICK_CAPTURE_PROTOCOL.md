# Voice File Quick Capture Protocol

## Validation Question

Does richer capture help users return faster after 24h-7 days?

## Study Status

- VOICE_CAPTURE_READY_IF_SUPPORTED
- AUDIO_PLAYBACK_READY
- SMALL_FILE_ATTACHMENT_READY
- QUICK_CAPTURE_READY
- SHARE_TARGET_QUICK_CAPTURE_READY_IF_SUPPORTED
- CLOUD_STORAGE_NOT_ADDED
- TRANSCRIPTION_NOT_ADDED

## Scope

This is evidence collection only.

Do not add:

- AI
- transcription
- backend
- cloud upload
- account
- sync
- analytics
- notifications
- team features
- workflow

## Test Setup

Ask each tester to save 1-3 things they may want to return to.

For one card, ask them to capture one or two lightweight context items:

- short voice note
- small file reference
- photo
- link through quick capture or share target

Remind testers:

- audio stays only in this browser or the exported file
- files stay local when small enough for browser storage
- large files may not persist well in browser storage
- no cloud upload is used
- no transcription is created

## Return Window

Wait 24 hours to 7 days.

Do not remind testers to return.

## Observation

When a tester returns, ask:

- Did the richer capture help you remember what this was?
- Which capture helped most: voice, file, photo, or link?
- Could you recover context in under 30 seconds?
- Did you need another tool or document?
- Did this feel lighter or heavier?
- Exact quote:

## Success Gate

- 10 users invited
- 3 returned
- 3 successful re-entries
- users report richer capture helped re-entry

## Stop Conditions

- capture feels like maintenance
- voice or files make the board feel heavy
- users worry about where data goes
- people open more tools, not fewer

## Verdict Rule

PASS only if voice, file, and quick capture help re-entry without adding backend, cloud storage, transcription, analytics, or productivity pressure.

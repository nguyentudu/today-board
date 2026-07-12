# Search Input Stability Fix v1

## Observed Android Symptom

Typing in Search on Android Chrome caused keyboard flicker, viewport movement, caret instability, and risk of interrupted Vietnamese IME composition.

## Root Cause

The search input event updated retrieval state by calling the app-level board change path. That path re-rendered the whole board, wrote the board back to localStorage, replaced the search input DOM node, then attempted to restore focus and selection. Android treated that as repeated focus/viewport work while the keyboard was open.

## Render Lifecycle Before Fix

Input event -> retrieval query changes -> app-level render -> root content replaced -> Retrieval Surface recreated -> search input recreated -> focus and selection restored -> columns rebuilt.

## Render Lifecycle After Fix

Input event -> retrieval query changes in memory -> debounce 120 ms -> result count, active-filter summary, filter selected state, and attention-zone results update in place. The search input and Retrieval Surface remain mounted.

## IME Handling

The input listens for `compositionstart`, `compositionend`, and `input`. During composition, destructive result updates are paused. On `compositionend`, the final composed query is applied immediately.

Android Vietnamese keyboard cases to verify:
- nghiên cứu
- quay lại
- để yên
- ghi âm

## Caret / Focus Behavior

The search input is no longer remounted per keystroke, and focus is not restored after every input event. Clear actions keep focus where practical without forcing a focus loop during typing.

## Scroll Behavior

No `scrollIntoView`, `window.scrollTo`, or forced scroll restoration is used. Result changes occur below the stable Retrieval Surface.

## Debounce Decision

Search results update after a 120 ms debounce for ordinary input. The input value updates immediately. Composition end applies immediately.

## Performance Safeguards

- No localStorage write on search input.
- No board export serialization on search input.
- No media decoding on search input.
- Retrieval search indexes only lightweight metadata.
- Raw base64 media is not searched.

## Android Manual Protocol

Scenario A: Latin typing
- Tap search.
- Type `nghien cuu` continuously.
- Delete one character at a time.
- Hold Backspace.

Scenario B: Vietnamese IME
- Type `nghiên cứu`.
- Type `quay lại`.
- Type `để yên`.
- Type `ghi âm`.

Scenario C: Tag query
- Type `#research`.
- Delete part of the query.
- Insert text in the middle.
- Clear the query.

Scenario D: Filters with keyboard open
- Keep search focused.
- Select Có ảnh.
- Select Có ghi âm.
- Change Last touched.
- Clear all filters.

Scenario E: Long query
- Type at least 30 characters continuously.

## Retrieval Acceptance Checklist

- Add `#research`, refresh, confirm tag remains, search `#research`.
- Select Quay lại + Tạm dừng and confirm states are unchanged.
- Test Today, Last 7 days, Last 30 days, Older than 30 days.
- Export/import a tagged board and confirm tags remain.
- Quick Capture `Retrieval QC 01`, save, search, refresh, search again.

## UI State vs Persisted Tags

Retrieval UI state may reset after refresh in v1. Card tag data is persisted on cards and must survive refresh and export/import.

## Known Limitations

Real Android Chrome validation is still required before PASS. Desktop Chrome, iPhone Safari, and Installed PWA also require retest.

## Cross-device Retest Status

| Platform | Status |
| --- | --- |
| Android Chrome | pending |
| Desktop Chrome | pending |
| iPhone Safari | pending |
| Installed PWA | pending |

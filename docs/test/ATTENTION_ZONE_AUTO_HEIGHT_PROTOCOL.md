# Attention Zone Auto Height Protocol

## A. Purpose

Verify that attention zones use natural content height and do not reserve artificial blank space after empty states or collapsed cards.

## B. Test Matrix

Case 1:
- zone has 0 cards
- expected: compact empty state

Case 2:
- zone has 1 collapsed card
- expected: no large blank space below card

Case 3:
- zone has multiple collapsed cards
- expected: natural vertical flow

Case 4:
- open one card
- expected: only that card expands

Case 5:
- collapse opened card
- expected: section height shrinks immediately

Case 6:
- move card between states
- expected: source and destination zones both recalculate height

Case 7:
- hide a card
- expected: zone height recalculates

Case 8:
- import an old board
- expected: all zones render naturally

## C. Device Status

Record each device separately. Do not mark an unavailable device PASS.

| Device | Status | Notes |
| --- | --- | --- |
| Android Chrome | pending | Must confirm no large blank zone beneath final card. |
| Desktop Chrome | pending | Must confirm normal spacing and no overlap. |
| iPhone Safari | pending | Only mark after physical test. |
| Installed PWA | pending | Only mark after installed PWA test. |

## D. Regression Checklist

- Open mode still shows readable card detail.
- Edit mode still shows the full editor and capture controls.
- Quick Capture still creates cards.
- Media rendering still shows thumbnails, audio players, files, and links.
- Storage panel still shows the meter and details.
- Cleanup confirmation appears before hidden media cleanup.
- Export/import preserves board data and media.

## E. Next Milestone

Search / Filter / Manual Tags v1

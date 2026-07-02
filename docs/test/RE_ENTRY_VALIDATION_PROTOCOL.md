# Re-entry Validation Protocol

## Goal

Test whether users can return to a card and recover context in under 30 seconds.

Study status: READY_FOR_10_USER_VALIDATION

Build freeze note: No more feature work until 10-user evidence exists.

## Process

1. Invite up to 10 users.
2. Ask each tester to create 1-3 cards.
3. Ask each tester to fill:
   - Snapshot: what is happening?
   - Why is this still open?
   - If you return, where do you start?
4. Ask testers to leave the board for at least 24 hours.
5. Ask testers to return naturally.
6. Observe whether they can explain the card context in under 30 seconds without opening another tool.

Do not remind.

Do not fabricate results.

## Successful Re-entry

A successful re-entry means:

- tester returns after at least 24 hours
- tester opens or views a card
- tester can explain the context in under 30 seconds
- tester does not open another tool

## Success Gate

- 10 users invited
- 3 returned
- 3 relief signals
- 3 successful re-entries

## Hard Gates

- Re-entry fields visible on card
- Context Snapshot visible without opening separate page
- Last Touch prominent
- Export/import preserves new fields
- localStorage preserves new fields
- No forbidden scope added
- No fake validation data
- No analytics or tracking
- Public URL remains active

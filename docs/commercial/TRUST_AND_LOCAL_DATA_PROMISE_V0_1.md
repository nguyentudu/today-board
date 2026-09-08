# Moon Today Board — Trust and Local Data Promise v0.1

Status: `R1 PRODUCT PROMISE — NOT A SUBSTITUTE FOR R4 LEGAL TERMS`

## What happens now

Moon Local stores board content in this browser on this device under
`moon.today-board.v1`. The current application has no account requirement,
analytics, behavioral tracking, payment activation, remote sync, or server
upload of board content.

The browser origin is part of the storage boundary. Data stored at
`https://nguyentudu.github.io/today-board/` cannot be silently read by a future
commercial domain.

## User controls

- Export JSON at any time, regardless of future entitlement state.
- Import a valid Moon Today Board JSON file on the same or another supported
  origin.
- Remove all current local data by first exporting if desired, then clearing
  site data for the exact Moon origin in browser settings.
- Continue using Moon Local without creating an account.

Clearing browser/site data, uninstalling without retained site data, device
loss, browser reset, or storage eviction can remove the local board. Moon cannot
recover a board that was never exported or encrypted and synced by a future
activated service.

## What R1 does not do

- It does not send board titles, context, return points, media, promises, or
  outcomes to a server.
- It does not create an Auth0 account or infer an identity.
- It does not start Lemon Squeezy checkout or grant a paid entitlement.
- It does not collect raw continuity telemetry or optimize engagement.

Pricing, account, and sync controls shown in R1 are honest previews and remain
disabled until their separately authorized phases pass.

## Future encrypted sync boundary

If sync is activated later, board content and attachments must be encrypted on
the client before upload. The service may process minimum account, commerce,
version, and operational metadata but must not receive plaintext continuity
content or an unwrapped content-encryption key. Login alone must not be able to
recover an encryption key.

## Domain transition promise

A future domain transition must provide an explicit old-origin export and
new-origin import walkthrough. Moon will not claim silent cross-origin migration
and will not replace or delete the old local board as a side effect of import or
account creation.

## Support and legal status

R4 must publish the Founder-approved support address, privacy statement, terms,
refund rules, data-deletion instructions, media quota/recovery explanation, and
limitations. This R1 promise is a product boundary and does not adopt those
legal terms in advance.

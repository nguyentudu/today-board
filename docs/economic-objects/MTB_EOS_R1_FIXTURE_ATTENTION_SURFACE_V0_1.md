# MTB-EOS-R1 — Fixture-only Economic Object Attention Surface v0.1

Status: `IMPLEMENTED LOCALLY — INDEPENDENT VERIFICATION REQUIRED — NO DEPLOYMENT`

Anchor: `nguyentudu/today-board@6964636b516d14580a65dfd70702c7cda0385e72`

## Purpose

R1 tests whether a Founder can understand, within one bounded surface:

- which Economic Object needs attention;
- why it matters now;
- which proof, rights, and transferability states are known;
- which blockers remain; and
- what safe proposal belongs to the owning system.

The surface consumes exactly the five deeply frozen R0 projections. It does not transform an Economic Object into a Today Board Situation or Card.

## Surface contract

Every rendered fixture exposes:

- object identity, domain, and version;
- `proof.state`;
- `rights.state`;
- `transferability.state`;
- `attention.state` and `attention.whyNow`;
- all declared blockers;
- the proposed next-action label and owning system; and
- the Founder-approval requirement.

Blocked objects appear before actionable objects. This is a view-order decision only; the canonical R0 fixture array and every projection remain unchanged.

## Authority boundary

R1 is:

- fixture-only;
- read-only;
- bilingual;
- responsive;
- visibly disclosed as synthetic and non-live;
- mounted as an independent surface above the existing Board retrieval and Situation columns.

R1 does not include:

- persistence or migration;
- creation or mutation of Cards, Situations, Board state, lifecycle, or retrieval semantics;
- Proof Commerce, Game Seed, Founder Runtime, provider, or network connection;
- evidence fetching or credential handling;
- payment, entitlement, checkout, marketplace, license issuance, publication, sale, or transfer;
- an execution button or action handler;
- service-worker identity change or deployment.

## Verification

Run:

```bash
npm run build
npm run test:economic-object-contract
npm run test:economic-object-surface
```

The dedicated R1 verifier checks the exact fixture count and projection version, fail-closed validity, required visible fields, fixture disclosure, Founder authority, absence of execution controls, absence of persistence/network/domain/commerce coupling, and responsive styles.

## Next gate

R1 requires fresh independent implementation-candidate verification before any next-stage surface authority is considered.

# MTB-EOS-R1.2 — Surface Contract Remediation Report v0.1

## Verdict

`REMEDIATION IMPLEMENTATION PASS — FRESH INDEPENDENT RE-VERIFICATION REQUIRED`

## Identity

- Repository: `nguyentudu/today-board`
- Parent branch: `codex/mtb-eos-r1-fixture-attention-surface`
- Parent commit: `e5abb61ead3cfe09cfdf7c26a74e08388e3fd94b`
- Remediation branch: `codex/mtb-eos-r1-2-surface-contract-remediation`
- Immutable R0 projection inputs: `src/economicObjects/contracts.ts`, `src/economicObjects/fixtures.ts`

## R1.1 findings addressed

### 1. Complete Vietnamese rendering and language semantics

- Added view-only Vietnamese copy for every canonical fixture title, Why now statement, blocker, and next proposal.
- Added Vietnamese labels for domain, Proof, Rights, Transferability, and Attention states.
- Preserved product/system names while avoiding mutation of the canonical fixture data.
- Added `lang` to the Economic Object surface.
- Synchronized `document.documentElement.lang` with the existing language toggle.

### 2. Visible canonical identity

- Every object card now renders its canonical `objectId` as visible text.
- The existing `data-economic-object-id` remains available as structural identity, but is no longer the only exposure.

### 3. DOM-level verification

- The R1 verifier now renders both Vietnamese and English surfaces through an isolated DOM harness.
- It verifies semantic section/article structure, language attributes, five rendered objects, visible canonical IDs, exact localized fixture content, retained English fixture content, attention order, and absence of buttons.
- Source-boundary checks remain in place for network, persistence, commerce, domain coupling, and action handlers.

## Verification evidence

- Production build: `PASS`.
- R0.2 contract verifier: `PASS`.
- R1 surface verifier with rendered DOM assertions: `PASS`.
- Full repository test inventory: `22/22 PASS`.

## Non-mutations

R1.2 does not add or change:

- Economic Object contract or fixture truth;
- Situation, Card, Board-state, lifecycle, or retrieval semantics;
- persistence, migration, import/export, or user data;
- Proof Commerce connection, network request, credential, or provider state;
- payment, entitlement, checkout, marketplace, license issuance, sale, or transfer;
- service-worker identity or deployment.

## Remaining gate

R1.2 requires fresh independent remediation verification. No further implementation, push, PR, merge, or deployment is authorized by this packet.

The next bounded work package is:

> MTB-EOS-R1.3 — Fresh Independent Remediation Verification

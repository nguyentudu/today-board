# MTB-EOS-R0 — Cross-System Economic Object Contract v0.1

Status: `R0.2 REMEDIATED LOCALLY — INDEPENDENT RE-VERIFICATION REQUIRED — R1 SURFACE NOT AUTHORIZED`

Baseline: `nguyentudu/today-board main@b49d46642fe10629afe2bdf3471476b4a4b75b18`

## 1. Goal

Define the smallest versioned projection that lets Moon Today Board answer:

> What economic object needs Founder attention, why now, what blocks it, and what is the next safe action?

R0 supplies a typed contract, five deterministic synthetic projections, repository fit evidence, and an executable fail-closed verifier. It does not add a user-facing surface or connect another system.

## 2. Boundary

The contract is an **attention projection**, not a canonical Economic Object and not a universal asset ontology.

- Game Seed remains authoritative for asset production state and build usage.
- Proof Commerce remains authoritative for evidence, provenance, rights assertions, and transfer or license eligibility.
- Today Board may present supplied state and decide attention ordering; it cannot upgrade or manufacture rights.
- Founder Runtime may record a proposal and explicit authority; R0 does not execute an action.
- AI output remains inference until a domain authority records a fact or transition.

## 3. Contract

The canonical TypeScript contract is `src/economicObjects/contracts.ts` and is versioned as `economic-object-attention-v0.1`.

It keeps these axes separate:

| Axis | Question |
| --- | --- |
| Proof | What evidence state has the source supplied? |
| Rights | Are relevant rights clear, conditional, unresolved, or unknown? |
| Transferability | May the object be transferred, conditionally transferred, licensed only, not transferred, or is this unknown? |
| Attention | Is Founder action blocked, actionable, an opportunity, a watch item, or unnecessary? |
| Next action | What bounded proposal should be routed to which authoritative system? |

These states must not be collapsed into one score. A verified identity does not imply transferable rights. Account access does not imply ownership. `license_only` must not be presented as transfer authority.

The v0.1 next-action vocabulary is a closed allowlist:

- `approve_game_use`
- `resolve_dependency_rights`
- `verify_transfer_conditions`
- `stop_transfer_review`
- `classify_and_collect_evidence`

Transfer, sale, checkout, license issuance, and publication are not action kinds in this contract. Unknown strings are rejected at runtime rather than treated as future authority. The allowlist itself is frozen at runtime.

## 4. Fail-closed rules

When proof, rights, or transferability is unknown or restricted:

1. Attention state is `blocked`.
2. At least one blocker is explicit.
3. The next action routes to Proof Commerce.
4. Founder approval is required.
5. No sell, transfer, checkout, entitlement, or publication action is exposed.

A `verified` proof state also requires at least one non-empty evidence reference. Founder approval remains necessary but cannot cure missing proof or create transfer authority.

R0 treats a platform account marked `non_transferable` as blocked. It does not infer that a platform-dependent account is an owned asset.

## 5. Synthetic fixtures

The canonical fixtures are in `src/economicObjects/fixtures.ts`:

1. Verified game asset with clear rights and `license_only` transferability.
2. Game asset with an unresolved purchased dependency.
3. Conditionally transferable synthetic digital business.
4. Non-transferable synthetic platform account.
5. Unknown digital object that fails closed.

All evidence references are synthetic identifiers. No user data, provider account, credential, remote request, marketplace listing, or real rights claim is created.

The fixture graph is deeply frozen at runtime. TypeScript readonly fields and runtime immutability both protect deterministic fixture behavior.

## 6. R0 acceptance

R0 passes when:

- repository baseline build and existing tests pass;
- exactly five unique fixtures exist;
- every fixture uses the contract version and fixture source version;
- unknown and non-transferable objects fail closed;
- the license-only object cannot propose transfer;
- partial, unverified, unknown, conditional, unresolved, and non-transferable states reject unsafe actions;
- verified proof without evidence identity is rejected;
- transfer, sale, checkout, license issuance, publication, and unknown action kinds are rejected;
- fixture objects and every nested object/array are frozen;
- no network primitive or credential field enters the contract lane;
- application runtime, Board v1, Card, persistence, import/export, commerce, and payment code remain unchanged;
- R1 is explicitly left closed.

Run:

```bash
npm run test:economic-object-contract
```

## 7. R0.2 remediation

R0.2 addresses the four findings from MTB-EOS-R0.1:

1. `license_only` now rejects a transfer action.
2. Unresolved truth rejects a transfer action even when the blocked envelope otherwise appears valid.
3. `verified` now requires evidence identity.
4. Canonical fixtures are deeply immutable.

The verifier exercises each rule with independent adversarial projections rather than checking only the five canonical examples.

## 8. Rollback

Delete only the paths listed in `MTB_EOS_R0_CANONICAL_PATH_MANIFEST_V0_1.json` and remove the new package script. No application data or external system is changed.

## 9. Next authority gate

After independent verification of this R0 packet, the next bounded command is:

> Founder authorizes MTB-EOS-R1 to implement a fixture-only Economic Object attention surface using the exact R0 projection, without persistence migration, Proof Commerce connection, payment, entitlement, marketplace, transfer, deployment, or mutation of accepted Situation semantics.

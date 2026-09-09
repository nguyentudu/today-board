# MTB-EOS-R0 — Repository Fit Map v0.1

## Verdict

`PASS — FITS AS A SEPARATE READ-ONLY ATTENTION PROJECTION`

`FAIL — DOES NOT FIT AS FIELDS ON THE ACCEPTED SITUATION CARD`

## Repository truth

The inspected canonical baseline is `main@b49d46642fe10629afe2bdf3471476b4a4b75b18`.

- Production build passes.
- All 20 pre-existing `test:*` scripts pass.
- The accepted local continuity model is `Board.version: 1` with `Card` as a Situation aggregate.
- Local persistence, JSON import/export, retrieval, lifecycle, promise, outcome, and evidence semantics depend on that shape.
- Commercial R1 exists as preview UI.
- Public-client R2 is an explicitly disabled fixture payment boundary: no provider, checkout, portal, paid entitlement, account, sync, or remote request is active.
- Commercial v1 explicitly excludes Proof Commerce integration and requires separate phase/path authority.

## Fit decisions

| Existing area | R0 decision | Reason |
| --- | --- | --- |
| `src/domain/card.ts` | Do not modify | A Situation is not an Economic Object passport or rights aggregate. |
| `src/domain/board.ts` | Do not modify | Board v1 lifecycle must not become an asset state machine. |
| `src/storage/localStore.ts` | Do not modify | R0 does not persist projections or migrate accepted data. |
| `src/storage/exportBoard.ts` | Do not modify | Fixtures must not silently enter user exports. |
| `src/domain/retrieval.ts` | Do not modify | R0 does not mix object search with Situation retrieval. |
| `src/commercial/*` | Do not modify | Rights/transferability is independent from Moon subscription entitlement. |
| `src/ui/*` and `src/app.ts` | Do not modify | R0 does not authorize a surface or runtime wiring. |
| `src/economicObjects/contracts.ts` | Add | Separate, provider-neutral attention projection. |
| `src/economicObjects/fixtures.ts` | Add | Five deterministic synthetic objects for R1 input. |
| Contract verifier | Add | Proves fail-closed behavior and runtime isolation. |

## Proposed R1 seam

R1 may add a read-only view that consumes `EconomicObjectAttentionProjection[]` from a fixture provider. It should render beside the board rather than become a new Card subtype.

R1 must not:

- write projections into `moon.today-board.v1`;
- change `Board.version`;
- map rights states onto Continue/Pause/Finished/Leave Alone;
- call Proof Commerce;
- infer transferability;
- expose transfer, sale, or checkout;
- activate commercial entitlements;
- rank ordinary personal Situations against synthetic economic objects using one universal score.

The first user-facing measure is bounded Time To Context: can the Founder identify the object, why it matters now, the blocker, and the safe next action within a few seconds?

## Architecture consequence

R0 validates the integration direction while preserving domain specialization:

```text
Game Seed production state ─┐
                            ├─> versioned attention projection ─> Today Board
Proof evidence/rights ──────┘

Today Board ─> Founder proposal ─> explicit approval ─> bounded executor
```

Only the projection crosses boundaries. Canonical asset state, evidence, rights, authority, and execution remain in their owning systems.

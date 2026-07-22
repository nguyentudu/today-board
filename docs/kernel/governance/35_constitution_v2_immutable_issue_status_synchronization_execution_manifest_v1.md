# Moon Constitution v2 Immutable Issue-Status Synchronization Execution Manifest v1

## 1. Task identity

| Field | Value |
|---|---|
| Task | Moon Constitution v2 Immutable Issue-Status Synchronization Execution Manifest v1 |
| Task number | 35 |
| Mode | Execution-manifest construction only |
| Governance posture | Fail-closed |
| Manifest status | IMMUTABLE ? PENDING INDEPENDENT VERIFICATION |

## 2. Purpose

This immutable manifest binds the exact approved source, candidate, six operations, verification contracts, durability requirements, atomic replacement procedure, and failure rules. It does not execute synchronization, mutate the canonical register, open the execution gate, or make an issue governance-effective.

## 3. Authority chain

Task 31 Founder resolution authority ? Task 32 field-scope clarification ? Task 33 exact synchronization packet ? Task 34 Founder exact-byte approval ? Task 35 immutable execution manifest. No authority is inferred beyond this chain.

## 4. Task 34 bound identities

| Artifact | SHA-256 |
|---|---|
| `docs/kernel/governance/34_constitution_v2_founder_exact_byte_approval_of_task_33_frozen_issue_status_synchronization_payload_v1.md` | `C2082404492C4CD040DA500A5918DCE2DCA7A1875EF1D51A8B403759916219DE` |
| `docs/kernel/governance/34a_constitution_v2_founder_exact_byte_approval_of_task_33_frozen_issue_status_synchronization_payload_v1.json` | `2E5E31A7269AEBC4D93555F230B3AA7F5820C989D2D0290287DF8CD933384FAB` |
| `docs/kernel/governance/34b_constitution_v2_founder_exact_byte_approval_of_task_33_frozen_issue_status_synchronization_payload_matrix_v1.md` | `49A9835DB313B625117200BEE186597E928BB5A3AFF350ECB4FE301980E66A61` |

## 5. Task 33 bound identities

| Artifact or payload | SHA-256 |
|---|---|
| `docs/kernel/governance/33_constitution_v2_exact_issue_status_synchronization_decision_packet_v1.md` | `F9A01E4083183BA91812A17FE0671452407733E94DC47E2A4C9656A2FB77F61D` |
| `docs/kernel/governance/33a_constitution_v2_exact_issue_status_synchronization_decision_packet_v1.json` | `55AAD7598BD661AB0480423634B1AD51948AAE78D418C9425ECD02DFAD010C70` |
| `docs/kernel/governance/33b_constitution_v2_exact_issue_status_synchronization_operation_matrix_v1.md` | `AADE4C5C0F2F3F43D16594A9CEDDBB6D4AFAA27695027085CF28A983BBF991D4` |
| `docs/kernel/governance/33c_constitution_v2_exact_issue_status_synchronization_frozen_approval_payload_v1.json` | `1E711922212FB0AA824E00C080A156827BB6DB55E946BF0EB0A53786EE8C9068` |
| Canonical frozen approval payload | `73F54918847D7A63E695753E86D3AF17B2A1A98EC2A2FFD884CFFA65C3D1D0D4` |

The frozen artifact-file identity and canonical frozen-payload identity are separate and non-substitutable.

## 6. Canonical source identity

- Path: `docs/kernel/governance/01_constitution_issues_v1.md`
- SHA-256: `7658039D3F80442E8964077062A65CAB56D208CFD1EDAC5B3E7CEB41BF50ACB6`
- Byte length: `23764`
- Encoding: `UTF-8`
- BOM: `absent`
- Line endings: `LF only`
- CRLF count: `0`

Any mismatch blocks execution with `BLOCKED ? APPROVED CANONICAL SOURCE IDENTITY MISMATCH`. Rebase, regeneration, and best-effort adaptation are prohibited.

## 7. Candidate identity

- SHA-256: `01EC4CAE937D512B3BC8554ADEEEB0251ACC1A8C10F433FFE8E395648DC59886`
- Byte length: `23722`
- Byte delta: `-42`
- Encoding: `UTF-8`
- BOM: `absent`
- Line endings: `LF only`
- CRLF count: `0`

Semantic equivalence is insufficient; exact byte equality is required.

## 8. Six-operation scope

| Operation | Issue | Representation | Source range | Transition | Authorized |
|---|---|---|---|---|---|
| `ISSUE-SYNC-OP-001` | `CONST-ISSUE-001` | `overview` | `4368:4383` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |
| `ISSUE-SYNC-OP-002` | `CONST-ISSUE-001` | `detailed_record` | `8428:8443` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |
| `ISSUE-SYNC-OP-003` | `CONST-ISSUE-002` | `overview` | `4632:4647` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |
| `ISSUE-SYNC-OP-004` | `CONST-ISSUE-002` | `detailed_record` | `13050:13065` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |
| `ISSUE-SYNC-OP-005` | `CONST-ISSUE-003` | `overview` | `4922:4937` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |
| `ISSUE-SYNC-OP-006` | `CONST-ISSUE-003` | `detailed_record` | `18144:18159` | `TRIAGE REQUIRED` ? `RESOLVED` | YES |

Exactly six operations, three issues, and six representations are bound. Atomicity is `ALL-OR-ZERO`; added, omitted, substituted, regenerated, subset, or partial operations are prohibited.

## 9. Per-operation preconditions

Every operation is bound to the canonical path, original-source byte range, exact preimage and postimage hex, preimage and postimage SHA-256, one issue-bounded occurrence, issue-boundary assertion, and context anchors contained in the machine manifest. Every source slice must match before reconstruction.

## 10. Operation ordering

Offsets reference the original preimage. Apply operations in descending original-byte order: `ISSUE-SYNC-OP-006, ISSUE-SYNC-OP-004, ISSUE-SYNC-OP-002, ISSUE-SYNC-OP-005, ISSUE-SYNC-OP-003, ISSUE-SYNC-OP-001`. Range overlap and collision counts are zero. This order prevents offset invalidation and deterministically reproduces the approved candidate.

## 11. Pre-execution verification contract

1. Task 35 manifest artifact identity equals its published immutable identity
2. Task 36 independent manifest-verification authority is present and PASS
3. Task 34 artifact identities match
4. Task 33 artifact identities match
5. Frozen canonical payload identity matches
6. Canonical source path matches
7. Canonical source SHA-256 matches
8. Canonical source byte length is 23764
9. Canonical source is valid UTF-8
10. Canonical source has no BOM
11. Canonical source uses LF-only line endings
12. Canonical source CRLF count is zero
13. Exact operation count is six
14. Operation identifiers are unique
15. Original-source mutation ranges do not overlap
16. Each operation source slice equals its exact preimage bytes
17. Each issue-bound preimage occurrence count is exactly one
18. Each operation remains within its authorized issue boundary
19. Reconstructed candidate identity and invariants match
20. A separate execution-gate authorization artifact binds this manifest, Task 36, source, candidate, execution task, and any required invocation identity

Any failed check stops execution before canonical mutation.

## 12. Candidate reconstruction contract

Read verified canonical bytes once; verify all original-range preimages; apply the six manifest operations in declared descending original-range order to an in-memory byte array; verify exact candidate identity before any disk replacement.

The executor may not search alternate fields, repair input, normalize formatting, recompile operations, change wording, use another candidate, or write directly to the canonical path during reconstruction. Candidate mismatch verdict: `BLOCKED ? RECONSTRUCTED CANDIDATE IDENTITY MISMATCH`.

## 13. Temporary-file procedure

- Exact path: `docs/kernel/governance/.01_constitution_issues_v1.md.issue-status-sync.tmp`
- Same filesystem and directory as canonical file: `YES`
- Creation: exclusive binary create
- Existing path: block; never overwrite or reuse
- Content: complete exact candidate bytes only
- Readback verification: mandatory
- Temporary existence does not confer canonical status

## 14. Durability requirements

Write the complete candidate, flush userspace buffers, request platform-appropriate file-level `fsync`, close, reopen, reread, and reverify the exact candidate. Silent downgrade is prohibited. If required file durability is unavailable, execution remains blocked.

## 15. Atomic replacement procedure

Required model: verified source ? verified temporary candidate ? one same-filesystem atomic replacement to `docs/kernel/governance/01_constitution_issues_v1.md`. Compare-and-swap source recheck is mandatory immediately before replacement. In-place edits, multiple canonical writes, append-and-repair, and non-atomic fallback are prohibited.

## 16. Directory durability

After replacement, request platform-appropriate directory durability for `docs/kernel/governance`. If required directory durability cannot be established, persisted execution success must not be claimed.

## 17. Post-write verification contract

Reopen and reread the canonical path. Require candidate SHA-256 `01EC4CAE937D512B3BC8554ADEEEB0251ACC1A8C10F433FFE8E395648DC59886`, 23,722 bytes, valid UTF-8, no BOM, LF-only line endings, CRLF count zero, 6/6 authorized representations `RESOLVED`, zero authorized representations `TRIAGE REQUIRED`, zero issues `CLOSED`, zero unauthorized status changes, and zero unexplained byte differences. Write-call success alone is insufficient.

## 18. Failure model

Before replacement, fail closed, leave canonical bytes unchanged, and safely remove or quarantine only the known temporary file. During replacement, permit only a true atomic primitive. After replacement but before persisted verification, record `MUTATION MAY HAVE OCCURRED ? PERSISTED RESULT NOT YET VERIFIED` and do not declare success.

## 19. Rollback posture

No partial-subset repair, inferred reverse operation, unverified-backup reconstruction, changed-source reversion, silent rollback, or regenerated rollback is authorized. Preserve evidence and escalate any post-write failure to separately authorized recovery.

## 20. Semantics and closure boundary

Resolution semantics remain `RESOLVED_NOT_CLOSED`. Closure, archival, deletion, schema extension, executor-selected fields or wording, future issues, and wildcard authority remain prohibited. Synchronization does not close any issue.

## 21. Effective-point model

Effective point: `EFFECTIVE_ON_INDEPENDENT_PERSISTED_VERIFICATION`. Atomic replacement alone is not governance-effective. Required sequence: Task 35 ? Task 36 ? separate execution-gate authority ? Task 37 ? Task 38 ? 3/3 issues become governance-effective as `RESOLVED_NOT_CLOSED`. Until Task 38 PASS, governance-effective resolved issues remain `0/3`.

## 22. Execution-gate state

Execution gate: `CLOSED`. Task 35 does not open it. A later gate decision must bind the Task 35 manifest identity, Task 36 verification identity, source identity, candidate identity, exact execution task, and any required invocation identity. Absence blocks execution.

## 23. Independent verification requirement

Task 36 must independently verify every Task 35 artifact, authority binding, source and candidate identity, exact operation, deterministic reconstruction, durability and atomicity contract, failure model, closure prohibition, and closed-gate state. Task 35 does not self-verify. Any later Task 35 artifact change invalidates Task 36 and requires a new manifest version.

## 24. Recommended next task

**Moon Constitution v2 Independent Issue-Status Synchronization Execution-Manifest Verification v1 ? Task 36**

## 25. Final verdict

**PASS ? IMMUTABLE ISSUE-STATUS SYNCHRONIZATION EXECUTION MANIFEST CREATED; INDEPENDENT VERIFICATION REQUIRED; EXECUTION GATE CLOSED**

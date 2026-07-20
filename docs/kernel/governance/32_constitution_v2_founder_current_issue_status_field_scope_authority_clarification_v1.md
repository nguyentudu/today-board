# Moon Constitution v2 Founder Current-Issue-Status Field Scope Authority Clarification v1

## 1. Task identity

| Field | Value |
|---|---|
| Task | Moon Constitution v2 Founder Current-Issue-Status Field Scope Authority Clarification Recording v1 |
| Phase | Phase 0 - Constitutional Foundation |
| Task number | 32 |
| Task type | Exact Founder Authority Clarification Recording |
| Decision date | 2026-07-19 |
| Founder verdict | APPROVE BOTH CURRENT-STATUS REPRESENTATIONS FOR ALL THREE ISSUES |
| Authority posture | Recording only; no packet compilation, mutation, or execution authority |

This artifact clarifies field scope only.

It does not compile an exact synchronization packet.

It does not authorize execution.

It does not modify the canonical register.

It does not make any issue governance-effective as RESOLVED.

## 2. Preconditions and identities

| Artifact | Path | Observed SHA-256 | Match |
|---|---|---|---|
| Persisted Constitution v2 | `docs/kernel/07_continuity_kernel_constitution_v2.md` | `9A935EF28DD21FBAA3A1B27CC0A626B6F719653DB9D3DAB51617FA394D516F7C` | YES |
| Issue-resolution verification | `docs/kernel/governance/30_constitution_v2_issue_resolution_verification_v1.md` | `5EE881A6B6FFF99CC1AD52B3010EEC2DBC517EA853AE16211D7EC953C7AA3D70` | YES |
| Machine-readable issue-resolution verification | `docs/kernel/governance/30a_constitution_v2_issue_resolution_verification_v1.json` | `B8EF7604966181772D78F8956BC46265DB5B7A0811F09441A6B9D3C9A6D75CD9` | YES |
| Founder resolution authority decision | `docs/kernel/governance/31_constitution_v2_founder_issue_resolution_authority_decision_v1.md` | `F67029620D7C9CAF93E1098AFCF10C7063E631C271A86DA07688A2C683DE7B37` | YES |
| Machine-readable Founder decision | `docs/kernel/governance/31a_constitution_v2_founder_issue_resolution_authority_decision_v1.json` | `BA06E7655651BA175300195CF46D2B8C90EEF73EE529475BC4952BDECDF91FD8` | YES |
| Founder decision matrix | `docs/kernel/governance/31b_constitution_v2_founder_issue_resolution_decision_matrix_v1.md` | `3874D1BD6DD539AACA61EC7B8AC71205BCE7487941137FABC5FE5860A6770DCE` | YES |
| Canonical issue register | `docs/kernel/governance/01_constitution_issues_v1.md` | `7658039D3F80442E8964077062A65CAB56D208CFD1EDAC5B3E7CEB41BF50ACB6` | YES |

Canonical register properties: 23,764 bytes; UTF-8; BOM absent; CRLF count 0; LF line endings; final newline present. The source identity was stable across two reads.

Task 31 records exactly three `RESOLVE` decisions, `RESOLVED_NOT_CLOSED`, closure authority 0/3, target status `RESOLVED`, effective point `EFFECTIVE_ON_INDEPENDENT_PERSISTED_VERIFICATION`, and current effective resolution 0/3. The canonical register remains unchanged.

## 3. Blocked packet context

The prior exact synchronization packet compilation attempt returned:

`BLOCKED — LOGICAL FIELD CLASS MAPS TO MULTIPLE REGISTER FIELDS`

The blocker was independently reproduced from the unchanged canonical register. For each issue, the previously authorized logical class `Current issue status` maps to two distinct existing physical representations: the overview current-status representation and the detailed-record current-status representation. No packet artifact, exact operation, candidate register, approval payload, or canonical-register mutation resulted from the blocked attempt.

## 4. Covered issues

Exactly these issues are covered:

1. `CONST-ISSUE-001`
2. `CONST-ISSUE-002`
3. `CONST-ISSUE-003`

No wildcard issue authority exists. No future issue is included.

## 5. Authorized physical field scope

For each covered issue, the previously authorized logical field class `Current issue status` includes both existing canonical current-status representations in `docs/kernel/governance/01_constitution_issues_v1.md`:

1. the issue's current-status representation in the canonical overview;
2. the issue's current-status representation in the canonical detailed record.

| Issue ID | Representation | Confirmed source value | Authorized target value | Authorized |
|---|---|---|---|---|
| `CONST-ISSUE-001` | canonical overview current status | TRIAGE REQUIRED | RESOLVED | YES |
| `CONST-ISSUE-001` | canonical detailed-record current status | TRIAGE REQUIRED | RESOLVED | YES |
| `CONST-ISSUE-002` | canonical overview current status | TRIAGE REQUIRED | RESOLVED | YES |
| `CONST-ISSUE-002` | canonical detailed-record current status | TRIAGE REQUIRED | RESOLVED | YES |
| `CONST-ISSUE-003` | canonical overview current status | TRIAGE REQUIRED | RESOLVED | YES |
| `CONST-ISSUE-003` | canonical detailed-record current status | TRIAGE REQUIRED | RESOLVED | YES |

Exactly six current-status representations are authorized. This task does not identify byte offsets, preimages, postimages, operation IDs, or candidate bytes.

## 6. Atomicity clarification

The six current-status representations must be handled as one all-or-zero synchronization scope.

All six authorized status representations transition together, or none of the six transition.

The following are not authorized:

- updating only the overview representation for any issue;
- updating only the detailed-record representation for any issue;
- updating only a subset of the three issues;
- committing a partial status synchronization package.

A subset requires separate Founder approval.

## 7. Fail-closed requirements

The later exact packet and execution chain must fail closed if any of the following does not match:

- canonical source path;
- canonical source SHA-256;
- source byte length;
- issue-record boundary;
- issue-record uniqueness;
- field identity;
- authorized preimage;
- preimage occurrence count;
- expected postimage;
- operation inventory;
- expected candidate identity.

This task does not perform those checks for execution purposes. It records only the required future behavior.

## 8. Preserved resolution and closure semantics

| Field | Exact value |
|---|---|
| Resolution semantics | RESOLVED_NOT_CLOSED |
| Target canonical status | RESOLVED |
| Issue closure | NOT AUTHORIZED |

`RESOLVED` and `CLOSED` are separate governance states. This clarification does not authorize `CLOSED` status, a closure decision, closure wording, closure date, issue removal, archival, lifecycle-complete wording, or an inference that `RESOLVED` means `CLOSED`.

## 9. Preserved effective point

Effective point: `EFFECTIVE_ON_INDEPENDENT_PERSISTED_VERIFICATION`.

| Temporal stage | State |
|---|---|
| Authorization | Founder authority artifacts |
| Persistence | authorized atomic canonical-register commit |
| Interim state | PERSISTED_TARGET_PENDING_EFFECTIVENESS |
| Governance effectiveness | independent persisted-result verification PASS |

The presence of target bytes after atomic commit does not itself make the resolution governance-effective. The three issues become governance-effective as `RESOLVED_NOT_CLOSED` only after independent persisted verification returns PASS for the exact authorized result.

This clarification does not authorize a new register field named `PERSISTED_TARGET_PENDING_EFFECTIVENESS` unless separately supported by existing schema and later exact approval.

## 10. Preserved history treatment

History treatment: `REPLACE_CURRENT_PRESERVE_PROVENANCE`.

Historical provenance must remain available through immutable linked governance artifacts, existing authorized provenance fields, and existing decision or history representations where applicable.

This clarification does not authorize deleting historical status, rewriting historical authority, concealing prior `TRIAGE REQUIRED` state, removing Founder disposition history, removing verification references, or creating a new schema field.

## 11. Scope exclusions

This clarification does not authorize:

- modification of fields outside the logical field classes already authorized by artifacts 31/31a/31b;
- executor-selected fields;
- executor-selected wording;
- schema extension;
- future issues;
- wildcard issue authority;
- issue closure;
- `CLOSED` status;
- closure wording;
- closure date;
- modification of Constitution v1;
- modification of Constitution v2;
- modification of structural findings;
- modification of Amendment evidence;
- ratification;
- official-status declaration;
- Constitution v1 supersession;
- canonical-register execution;
- execution-manifest creation;
- independent verification claims;
- effective issue resolution.

## 12. Governance state

| State | Result |
|---|---|
| Issue-resolution verification | PASS |
| Founder resolution authority decision | PASS |
| Current-status field-scope clarification | RECORDED |
| Covered issues | 3/3 |
| Overview status representations authorized | 3/3 |
| Detailed-record status representations authorized | 3/3 |
| Authorized status physical representations | 6/6 |
| Source status | TRIAGE REQUIRED |
| Target status | RESOLVED |
| Atomicity | ALL-OR-ZERO |
| Resolution semantics | RESOLVED_NOT_CLOSED |
| Closure authority | NONE |
| Resolution effective | NO |
| Canonical register modified | NO |
| Exact synchronization packet | NOT YET COMPILED |
| Execution gate | CLOSED |
| Ratification readiness | NOT REVIEWED |

## 13. Next task and final verdict

Recommended next task: **Moon Constitution v2 Exact Issue-Status Synchronization Decision Packet v1 — Task 33**

Verdict: **PASS — CURRENT-ISSUE-STATUS FIELD SCOPE AUTHORITY CLARIFIED AND RECORDED**

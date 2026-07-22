# Moon Constitution v2 Founder Exact-Postimage Approval for Structural Operations v1

## 1. Decision Control

| Field | Value |
| --- | --- |
| Decision ID | `CONST-V2-STRUCTURAL-POSTIMAGE-APPROVAL-001` |
| Version | v1 |
| Status | APPROVED - EXACT STRUCTURAL POSTIMAGES AUTHORIZED |
| Phase | Phase 0 - Constitutional Foundation |
| Decision authority | Founder |
| Decision date | 17 July 2026 |
| Decision scope | `STRUCT-OP-001`, `STRUCT-OP-002`, `STRUCT-OP-003` |

This record approves only the exact operation-level postimages identified below. It does not reopen Canonical-Term Model B, canonical written forms, alias policy, Payload Route A, frozen-payload protection, structural work-item scope, Amendment wording approval, or the Approved Wording Manifest.

This record does not modify Constitution v2 and does not authorize subset execution.

## 2. Source Control

| Source | Identity |
| --- | --- |
| Evidence packet | `docs/kernel/governance/16_constitution_v2_exact_postimage_evidence_packet_v1.md` |
| Evidence packet SHA-256 | `37F90A2D690F202535094EFF73AAA550EAD9E5E1BB6BC40B1F7154C43347428F` |
| Constitution v2 | `docs/kernel/07_continuity_kernel_constitution_v2.md` |
| Constitution v2 SHA-256 | `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| Frozen AMEND-001-C SHA-256 | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Expected atomic result SHA-256 | `7707FAC9379160C78FA6D97A53D851A61EC8F4CF02F7E7FBE67E8EA11DA6E079` |
| Immutable execution manifest v2 | `docs/kernel/governance/15a_constitution_v2_structural_correction_execution_manifest_v2.json` |
| Immutable execution manifest v2 SHA-256 | `8DBDFB1B1CD8820DDC399C14F223A705C3078A8D7F65AFA4BD0B1FE50BE7B143` |

Approval is valid only while the source Constitution and frozen payload identities match exactly.

## 3. Approved Exact Postimages

### 3.1 STRUCT-OP-001

| Field | Approved value |
| --- | --- |
| Parent work item | `STRUCT-WORK-001` |
| Finding ID | `CONST-V2-STRUCT-001` |
| Exact source range | `[42, 122)` |
| Exact preimage SHA-256 | `FBFD1813D41726039EF5740A4F1656007F0C856CD1B55FD6B260DE6CCD08D6C7` |
| Selected option | `POSTIMAGE-OPTION-001-A` |
| Approved postimage SHA-256 | `4E3598E108A7868C73E8E868660CAD3783FC0B6F4D0937E68CFD395146F420D3` |
| Founder disposition | APPROVED AS EXACT POSTIMAGE |
| Semantic meaning unchanged | YES |
| Normative force unchanged | YES |
| Frozen-payload overlap | NONE |

Approved exact postimage, JSON-escaped:

```json
"Status: Amendment 001 incorporated — post-incorporation verification PASS; structural correction applied — pending independent verification  "
```

### 3.2 STRUCT-OP-002

| Field | Approved value |
| --- | --- |
| Parent work item | `STRUCT-WORK-001` |
| Finding ID | `CONST-V2-STRUCT-001` |
| Exact source range | `[160, 262)` |
| Exact preimage SHA-256 | `F1906F0C45E5086A21766EBD7469EA72248267203734655D55B53DBEE6F55ACA` |
| Selected option | `POSTIMAGE-OPTION-002-A` |
| Approved postimage SHA-256 | `624E3B2F4711C98EBA6248F232E6139B777ED109D90E49801AEAD06525B17B80` |
| Founder disposition | APPROVED AS EXACT POSTIMAGE |
| Semantic meaning unchanged | YES |
| Normative force unchanged | YES |
| Frozen-payload overlap | NONE |

Approved exact postimage, JSON-escaped:

```json
"Version posture: Constitution v2 remains a candidate; Amendment 001 incorporated; structural correction applied; independent structural correction verification pending  "
```

### 3.3 STRUCT-OP-003

| Field | Approved value |
| --- | --- |
| Parent work item | `STRUCT-WORK-002` |
| Finding ID | `CONST-V2-STRUCT-002` |
| Exact source occurrence uniquely established | YES |
| Exact source range | `[355, 355)` |
| Exact preimage SHA-256 | `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855` |
| Deterministic anchor SHA-256 | `48D1BD07030DFC1073EF10B1B15E7DF3A4FC30FD433955590D40C30F8550450A` |
| Selected option | `POSTIMAGE-OPTION-003-A` |
| Approved postimage SHA-256 | `F36354B8217E1F38BC6D3D2D9FE472D926F6EADB2EFD82A19C6CAB524C7DD346` |
| Founder disposition | APPROVED AS EXACT POSTIMAGE |
| Semantic meaning unchanged | YES |
| Normative force unchanged | YES |
| Frozen-payload overlap | NONE |

Approved exact inserted bytes, JSON-escaped:

```json
"Ratification: Founder ratification pending  \nOfficial status: Constitution v2 is not official  \nSupersession: Constitution v1 is not superseded  \n"
```

## 4. Approval Conditions

Each operation is approved only while all of these conditions remain true:

- exact source identity matches;
- exact preimage is reproduced;
- exact range is deterministic;
- selected postimage is reproduced byte-for-byte;
- semantic meaning is unchanged;
- normative force is unchanged;
- frozen-payload overlap is `NONE`;
- authority source is recorded.

A general instruction is not exact-result approval.

## 5. Atomic Execution Authority

| Field | Decision |
| --- | --- |
| Subset execution | NOT AUTHORIZED |
| Atomic execution | REQUIRED |
| Approved unresolved operations | 3/3 |
| Complete manifest operations required | 6/6 |
| Apply-on-failure behavior | APPLY ZERO OPERATIONS |
| Manifest authorized for creation | `docs/kernel/governance/15a_constitution_v2_structural_correction_execution_manifest_v2.json` |

Execution may proceed only when the immutable manifest v2 contains all six exact operations, records its own identity, the source Constitution identity still matches, and the frozen payload identity still matches.

## 6. Scope Preservation

- Constitution v2 modified by this decision record: NO
- Frozen AMEND-001-C payload modified: NO
- Approved Wording Manifest modified: NO
- Structural correction executed: NO
- Findings closed: 0
- Issues closed: 0
- Ratification performed: NO

## 7. Final Founder Decision

`STRUCT-OP-001`, `STRUCT-OP-002`, and `STRUCT-OP-003` are approved exactly as identified above. Together with the three previously authorized canonical-term operations, they may form one immutable six-operation atomic execution manifest.

**Final status: APPROVED - EXACT STRUCTURAL POSTIMAGES AUTHORIZED**

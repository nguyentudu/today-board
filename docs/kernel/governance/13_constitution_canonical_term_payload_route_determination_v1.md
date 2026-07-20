# Moon Constitution Canonical-Term Payload Route Determination v1

## 1. Document Control

| Field | Value |
| --- | --- |
| Title | Moon Constitution Canonical-Term Payload Route Determination v1 |
| Version | v1 |
| Status | PAYLOAD ROUTE DETERMINED |
| Phase | Phase 0 - Constitutional Foundation |
| Task type | Deterministic Byte-Range / Payload-Impact Verification |
| Decision authority | Founder Canonical-Term Authority Decision and the explicit canonical mappings supplied for this task |
| Execution mode | Read-only measurement and route determination |
| Structural Finding | CONST-V2-STRUCT-003 |
| Structural Work Item | STRUCT-WORK-003 |
| Affected Change | AMEND-001-C |
| Created date | 2026-07-17 |

## 2. Purpose and Scope Lock

This artifact determines mechanically whether the exact three canonical-term replacements required for `CONST-V2-STRUCT-003` change any byte in the frozen AMEND-001-C payload.

It processes only the three correction occurrences identified by `STRUCT-WORK-003`. It performs no repository-wide normalization, writes no simulated candidate, changes no source artifact, closes no finding or issue, and performs no ratification.

## 3. Authority and Source Package

| Source | Authority used |
| --- | --- |
| Current task, Required occurrence inventory | Explicit identity-to-canonical mappings: Fresh Start to `Fresh Start`; Present Only to `Present Only`; No Old Pull to `No Old Pull` |
| `docs/kernel/governance/12_constitution_canonical_term_authority_decision_v1.md` | General identity-versus-representation rule, exact range evidence, and frozen-boundary rule |
| `docs/kernel/governance/10_constitution_v2_structural_correction_work_package_v1.md` | Affected occurrence boundary and correction limits |
| `docs/kernel/governance/11_constitution_v2_blocked_structural_finding_authority_resolution_v1.md` | Prior frozen-overlap diagnosis and authority safeguards |
| `docs/kernel/governance/06_constitution_amendment_001_founder_wording_approval_v1.md` | Frozen wording identity and Approved Wording Manifest |
| `docs/kernel/governance/04_constitution_amendment_001_v1.md` | AMEND-001-C wording lineage |
| `docs/kernel/07_continuity_kernel_constitution_v2.md` | Exact candidate bytes measured |
| `docs/kernel/governance/08_constitution_amendment_001_incorporation_diff.md` | Supporting location evidence only |

The earlier decision record left the atomic canonical forms pending. The current task supplies exact mappings and states that canonical forms are complete 3/3. Those explicit mappings, rather than visual similarity or repository style, mechanically determine the replacements measured here. This artifact does not modify the earlier decision record.

## 4. Encoding and Source Identity

| Measure | Observed value |
| --- | --- |
| Constitution path | `docs/kernel/07_continuity_kernel_constitution_v2.md` |
| Encoding | UTF-8 |
| Byte-order mark | Absent |
| Line-ending form | LF |
| LF count | 671 |
| CRLF count | 0 |
| Exact file length | 60,793 bytes |
| Verified Constitution identity | SHA-256 `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |

No bytes, line endings, punctuation, spaces, tabs, Markdown markers, or capitalization were normalized during measurement.

## 5. Required Occurrence Inventory

The Work Package identifies three inconsistent pairs. The correction occurrence in each pair is the clause 15.6 representation; the adjacent frozen representation already equals the explicit canonical form and requires no replacement.

### Table A - Occurrence Inventory

| Occurrence ID | Source finding | Source work item | Current text | Intended constitutional identity | Canonical form | Section | Line | Byte range | Exact proposed replacement | Replacement required | Mapping certain |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| TERM-OCC-001 | CONST-V2-STRUCT-003 | STRUCT-WORK-003 | `Fresh-start` | Fresh Start | `Fresh Start` | 15 | 413 | `[37399, 37410)` | `Fresh Start` | YES | YES |
| TERM-OCC-002 | CONST-V2-STRUCT-003 | STRUCT-WORK-003 | `present-only` | Present Only | `Present Only` | 15 | 413 | `[37412, 37424)` | `Present Only` | YES | YES |
| TERM-OCC-003 | CONST-V2-STRUCT-003 | STRUCT-WORK-003 | `no-old-pull` | No Old Pull | `No Old Pull` | 15 | 413 | `[37448, 37459)` | `No Old Pull` | YES | YES |

| Inventory measure | Result |
| --- | ---: |
| Required correction occurrences available | 3 |
| Required correction occurrences inventoried | 3 |
| Occurrences mapped unambiguously | 3 |
| Occurrences unresolved | 0 |
| Additional occurrences introduced | 0 |

The frozen line-415 forms `Fresh Start`, `Present Only`, and `No Old Pull` were separately verified during payload reconstruction. They are not additional correction occurrences because each already equals its supplied canonical form.

## 6. Frozen AMEND-001-C Payload Reconstruction

| Field | Exact result |
| --- | --- |
| Change ID | AMEND-001-C |
| Manifest entry ID | AMEND-001-MANIFEST-C |
| Constitution v2 target section | Section 15, immediately after clause 15.6 |
| Frozen payload line | 415 |
| Frozen payload start byte | 37,625 |
| Frozen payload end byte | 38,502 exclusive |
| Frozen payload range | `[37625, 38502)` |
| Frozen payload byte length | 877 |
| Frozen payload occurrence count | 1 |
| Approved payload identity | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Observed payload identity | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Identity match | YES |

### 6.1 Approved Payload Text

> A person's explicit continuity boundaries constrain continuity use and may limit retention, retrieval, presentation, inference, reopening, or cross-session continuity without constituting Continuity failure. Preservation and Situation identity do not by themselves authorize those uses. Fresh Start, Present Only, and No Old Pull do not automatically require permanent deletion or non-retention; retention, persistence, retrieval, presentation, inference, reopening, cross-session continuity, deletion, and forgetting remain distinct. The Continuity Invariants Specification defines universal effects, Situation Lifecycle defines reopening and cross-session effects, the Kernel Acceptance Specification defines tests, and Kernel Architecture defines storage, retrieval, presentation, deletion, and enforcement mechanics, without redefining this authority or these distinctions.

The reconstructed bytes are exactly the Approved Wording Manifest payload and occur once in Constitution v2.

## 7. Exact Overlap Test

The interval test is `correction_start < frozen_end` and `correction_end > frozen_start`.

### Table B - Payload Overlap

| Occurrence ID | Correction range | Frozen payload range | First overlap condition | Second overlap condition | Overlap | Frozen identity affected |
| --- | --- | --- | --- | --- | --- | --- |
| TERM-OCC-001 | `[37399, 37410)` | `[37625, 38502)` | `37399 < 38502`: TRUE | `37410 > 37625`: FALSE | NONE | NO |
| TERM-OCC-002 | `[37412, 37424)` | `[37625, 38502)` | `37412 < 38502`: TRUE | `37424 > 37625`: FALSE | NONE | NO |
| TERM-OCC-003 | `[37448, 37459)` | `[37625, 38502)` | `37448 < 38502`: TRUE | `37459 > 37625`: FALSE | NONE | NO |

Correction ranges overlapping frozen payload: **0**.  
Correction ranges outside frozen payload: **3**.

All replacements are equal-length UTF-8 replacements outside the frozen range. No insertion is proposed, so insertion-boundary classification is not applicable.

## 8. In-Memory Identity Simulation

Only the three exact byte ranges in Table A were replaced in a byte-array clone. The candidate was never written to disk and was discarded after hashing.

### Table C - Identity Simulation

| Artifact | Identity before | Identity after | Changed |
| --- | --- | --- | --- |
| Constitution v2 | `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` | `C7E5E69349F614AFDA493A165E2E9123B09135B9DC2C5FB85979D7E2E7BBC2DE` | YES |
| AMEND-001-C frozen block | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | NO |
| Approved Manifest payload | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | NO |

| Impact conclusion | Result |
| --- | --- |
| Complete Constitution identity changes | YES |
| Frozen payload identity changes | NO |
| Approved Manifest payload changes | NO |
| Founder-approved exact wording changes | NO |
| Constitutional meaning changes | NO under the explicit identity-to-canonical mappings and general representation rule supplied for this task |

## 9. Payload Route Selection

All Route A conditions are mechanically satisfied:

1. Every required correction has overlap `NONE`.
2. Frozen AMEND-001-C bytes remain identical.
3. The Approved Manifest payload remains identical.
4. Founder-approved exact wording remains unchanged.
5. The explicit canonical mappings classify the three changes as representation normalization.
6. Constitutional identity, semantic scope, and authority remain unchanged.

**Selected route: ROUTE A - STRUCTURAL CORRECTION AUTHORIZED**

| Route result | Decision |
| --- | --- |
| STRUCT-WORK-003 authorization | AUTHORIZED |
| Founder wording reapproval required | NO |
| Approved Manifest update required | NO |
| Targeted Amendment revision required | NO |
| Correction execution performed | NO |

Route A authorizes a future structural correction task within the measured ranges and supplied canonical replacements. It does not itself execute that correction.

## 10. Three-Finding Package Effect

| Package measure | Result |
| --- | --- |
| SAFE work items | 2 |
| SAFE work items applied | 0 |
| SAFE work items affected by this route | 0 |
| STRUCT-WORK-003 route | A |
| All three work items executable under one authority envelope | YES |
| Recommended execution strategy | ATOMIC STRUCTURAL CORRECTION - 3/3 |

The future correction task should create one candidate identity, apply only the three authorized work items, and run one complete post-correction identity and structural verification cycle.

## 11. Correction Execution Boundary

| Boundary field | Authorized value |
| --- | --- |
| Constitution source preimage | SHA-256 `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| Allowed location | Constitution v2 Section 15, line 413, exact byte ranges in Table A |
| Allowed changes | `Fresh-start` to `Fresh Start`; `present-only` to `Present Only`; `no-old-pull` to `No Old Pull` |
| Maximum change | Three equal-length replacements, exactly one per measured range |
| Expected resulting Constitution identity | SHA-256 `C7E5E69349F614AFDA493A165E2E9123B09135B9DC2C5FB85979D7E2E7BBC2DE` before the separately authorized metadata work items are applied |
| Frozen identity required after correction | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Manifest payload required after correction | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Prohibited scope | Any other occurrence, byte, line ending, punctuation, spacing, Markdown, heading, Amendment block, Manifest payload, issue state, or ratification state |

Metadata work items 001 and 002 will produce a different final full-file hash. Their exact authorized metadata text and final atomic postimage must be calculated by the structural correction task; this simulation does not pre-authorize those bytes.

## 12. Route Consistency Validation

| Consistency check | Result |
| --- | --- |
| Correction text invented | NO; exact canonical mappings are supplied by the task |
| Every replacement uses supplied canonical form | YES |
| Implicit alias recognized | NO |
| Occurrence outside finding boundary included | NO |
| Frozen-byte change routes to B | NOT TRIGGERED; changed-byte overlap is 0 |
| Route A based only on unchanged meaning | NO; exact byte overlap and identities were measured |
| Complete-file identity confused with payload identity | NO |
| Founder-approved payload preserved | YES |
| Work Package correction boundary preserved | YES |
| Simulated candidate persisted | NO |

**Route consistency validation: PASS**

## 13. Artifact Discipline

| Artifact or action | Result |
| --- | --- |
| Constitution v1 modified | NO |
| Constitution v2 modified | NO |
| Amendment modified | NO |
| Founder Canonical-Term Decision modified | NO |
| Founder Wording Approval modified | NO |
| Approved Wording Manifest modified | NO |
| Structural Work Package modified | NO |
| Issue Register modified | NO |
| Findings closed | 0 |
| Issues closed | 0 |
| Ratification performed | NO |
| Application code modified | NO |
| Temporary candidate retained | NO |

## 14. Verdict and Next Gate

The three exact canonical replacements are wholly outside the frozen AMEND-001-C payload. The complete Constitution identity changes, but the frozen block, Founder-approved wording, and Approved Manifest payload remain byte-identical. Route A is therefore mechanically required.

**Recommended next task: Moon Constitution v2 Structural Correction v1**

Scope: all three structural work items as one atomic correction package.

**Verdict: PASS — PAYLOAD ROUTE DETERMINED**

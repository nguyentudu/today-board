# Moon Constitution Canonical Term Authority Decision v1

## 1. Document Control

| Field | Value |
| --- | --- |
| Title | Moon Constitution Canonical Term Authority Decision v1 |
| Decision ID | CANONICAL-TERM-DECISION-001 |
| Version | v1 |
| Status | FOUNDER DECISION INCOMPLETE |
| Phase | Phase 0 - Constitutional Foundation |
| Decision authority | Founder |
| Execution mode | Decision artifact creation and authority-path determination only |
| Structural Finding | CONST-V2-STRUCT-003 |
| Structural Work Item | STRUCT-WORK-003 |
| Affected Amendment Change | AMEND-001-C |
| Decision date | PENDING |
| Created date | 2026-07-17 |

## 2. Purpose and Scope Lock

This record preserves the Founder-supplied canonical-term principle, reconstructs its exact application boundary around `CONST-V2-STRUCT-003`, and determines whether a complete term-specific correction decision exists.

Its scope is limited exclusively to `CONST-V2-STRUCT-003`, `STRUCT-WORK-003`, `AMEND-001-C`, and `CONST-ISSUE-003`. It does not reconsider another finding, Amendment change, issue, primitive, or constitutional meaning. It does not perform or authorize a structural correction.

## 3. Authoritative Sources

| Source | Authority used |
| --- | --- |
| Founder constitutional principle supplied for this task | General canonical identity, representation, alias, capitalization, hyphenation, downstream, and structural-correction rules |
| `docs/kernel/reviews/05_constitution_structural_integrity_verification_v1.md` | Finding identity and evidence |
| `docs/kernel/governance/10_constitution_v2_structural_correction_work_package_v1.md` | Blocked work-item boundary and verification condition |
| `docs/kernel/governance/11_constitution_v2_blocked_structural_finding_authority_resolution_v1.md` | Route C authority diagnosis |
| `docs/kernel/07_continuity_kernel_constitution_v2.md` | Candidate text and exact byte ranges |
| `docs/kernel/governance/06_constitution_amendment_001_founder_wording_approval_v1.md` | Founder-approved exact AMEND-001-C identity and Approved Wording Manifest |
| `docs/kernel/governance/04_constitution_amendment_001_v1.md` | Amendment wording lineage |

No naming convention, repository style, majority usage, or informal discussion was used to select a canonical form.

## 4. Founder Constitutional Rule

### 4.1 Constitutional Ownership

The Constitution owns the canonical identity, canonical semantic scope and canonical authority of every constitutional defined term.

### 4.2 Representation

Representation is not independently normative unless the Constitution explicitly declares that a representational feature participates in defined-term identity.

Representation may include:

- capitalization;
- typographic emphasis;
- Markdown styling;
- HTML rendering;
- PDF presentation;
- speech rendering;
- localization;
- display formatting.

### 4.3 Canonical Written Form

Every constitutional defined term must have one explicit canonical written form.

### 4.4 Aliases

An alias is valid only when explicitly recognized by the Constitution or by a downstream artifact explicitly authorized to register aliases.

No implicit alias is valid.

An alias may reference a constitutional identity. It may not redefine that identity, its semantic scope or its authority.

### 4.5 Capitalization

Capitalization is not independently normative unless explicitly declared for a specific defined term.

### 4.6 Hyphenation

Hyphenation is normative only when the Constitution explicitly establishes that it distinguishes defined-term identity.

### 4.7 Downstream Authority

Downstream layers may render, display, translate or localize constitutional terms. They may not create, merge, split or redefine constitutional identities.

### 4.8 Structural Correction Authority

A structural correction may normalize representation only when the constitutional identity, semantic scope and authority are provably unchanged.

Where that equivalence is not proven, the correction requires Founder constitutional authority.

## 5. Canonical-Term Constitutional Precedent

| Field | Decision |
| --- | --- |
| Precedent ID | CANONICAL-TERM-PRECEDENT-001 |
| Rule | Constitutional identity and representation are distinct. |
| Binding effect | Future constitutional defined terms inherit this rule unless a later Founder-authorized amendment explicitly supersedes it. |
| Downstream effect | Continuity Language, Ontology, Canonical Model, Architecture and Implementation must inherit constitutional identity and may not silently redefine it. |
| Primitive effect | This precedent does not itself add, merge, split, or rename any primitive. |
| Incorporation state | Governance precedent recorded; not incorporated into Constitution v2 by this task. |

## 6. Affected-Term Reconstruction

The source finding identifies a set of three exact boundary-name pairs, not one generic unnamed term.

| Affected name | Current representation in clause 15.6 | Alternative representation in AMEND-001-C | Affected section | Change ID | Issue ID |
| --- | --- | --- | --- | --- | --- |
| Fresh Start boundary name | `Fresh-start` | `Fresh Start` | Section 15 | AMEND-001-C | CONST-ISSUE-003 |
| Present Only boundary name | `present-only` | `Present Only` | Section 15 | AMEND-001-C | CONST-ISSUE-003 |
| No Old Pull boundary name | `no-old-pull` | `No Old Pull` | Section 15 | AMEND-001-C | CONST-ISSUE-003 |

### 6.1 Exact Locations

All ranges are zero-based and half-open. Character offsets are offsets in the UTF-8-decoded Constitution v2 text. Byte offsets are offsets in the exact UTF-8 Constitution v2 file.

| Representation | Line and columns, one-based inclusive | Constitution character range | Constitution byte range |
| --- | --- | --- | --- |
| `Fresh-start` | Line 413, columns 49-59 | `[37397, 37408)` | `[37399, 37410)` |
| `present-only` | Line 413, columns 62-73 | `[37410, 37422)` | `[37412, 37424)` |
| `no-old-pull` | Line 413, columns 98-108 | `[37446, 37457)` | `[37448, 37459)` |
| `Fresh Start` | Line 415, columns 288-298 | `[37910, 37921)` | `[37912, 37923)` |
| `Present Only` | Line 415, columns 301-312 | `[37923, 37935)` | `[37925, 37937)` |
| `No Old Pull` | Line 415, columns 319-329 | `[37941, 37952)` | `[37943, 37954)` |

| Identity field | Value |
| --- | --- |
| Frozen wording block boundary | Constitution v2 line 415; character range `[37623, 38500)`; UTF-8 byte range `[37625, 38502)` |
| Frozen wording block length | 877 characters; 877 UTF-8 bytes |
| Approved wording identity | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Current Constitution v2 identity | SHA-256 `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| Exact overlapping substring | `Fresh Start, Present Only, and No Old Pull` |
| Overlap within frozen payload | Character and byte range `[287, 329)` relative to the 877-byte payload |

The affected title-case names are inside the exact frozen hashed payload. The hyphenated lower-case names are outside that payload in existing clause 15.6.

## 7. Term-Specific Founder Decision Record

The general Founder principle is explicit. The required atomic choices for these three names are not supplied by an authoritative source.

| Decision field | Founder-controlled result |
| --- | --- |
| Defined term | Three affected continuity-boundary names: Fresh Start, Present Only, and No Old Pull, each paired with a hyphenated lower-case representation in clause 15.6 |
| Canonical identity | PENDING for each affected name |
| Canonical written form | PENDING for each affected name |
| Recognized aliases | NONE currently recognized; future alias treatment PENDING |
| Unrecognized representations | PENDING until canonical form and alias treatment are selected |
| Capitalization normative | NO by default under the Founder principle; no term-specific exception is recorded |
| Hyphenation normative | PENDING because term identity equivalence has not been established |
| Typographic styling normative | NO by default under the Founder principle |
| Constitutional semantic scope | Existing Section 15 user-boundary and non-automatic-deletion protections remain authoritative; exact term-level identity remains PENDING |
| Constitutional authority | Constitution |
| Downstream presentation freedom | Rendering, display, translation, or localization only after constitutional identity and any alias authority are explicit |
| Downstream prohibited actions | Creating, merging, splitting, or redefining identity, semantic scope, authority, or an unlisted alias |
| Selected canonical-term model | PENDING; no Model A, B, C, or D was explicitly selected |

No exact canonical form is mechanically determined by the general principle. Founder approval of the title-case AMEND-001-C text establishes that text's frozen identity, but it does not expressly declare the title-case forms globally canonical or the clause 15.6 forms aliases.

## 8. Representation-Versus-Identity Test

| Test | Variant A | Variant B | Same identity | Same semantic scope | Same authority | Representational only |
| --- | --- | --- | --- | --- | --- | --- |
| Fresh Start pair | `Fresh-start` | `Fresh Start` | PENDING | PENDING | PENDING | UNCLEAR |
| Present Only pair | `present-only` | `Present Only` | PENDING | PENDING | PENDING | UNCLEAR |
| No Old Pull pair | `no-old-pull` | `No Old Pull` | PENDING | PENDING | PENDING | UNCLEAR |

Current reading: the adjacent context makes each pair appear related to the same class of continuity boundary.

Corrected reading: PENDING. No Founder-controlled atomic decision establishes whether each pair is one identity, an explicit alias pair, or distinct terms.

Rights or duties changed: **UNCLEAR**.  
Authority changed: **UNCLEAR**.  
Defined-term reference changed: **YES** under any normalization or alias operation.  
Constitutional meaning changed: **UNCLEAR**.

**Semantic impact classification: POTENTIALLY SEMANTIC**

## 9. Exact Frozen-Range Analysis

| Required field | Exact evidence |
| --- | --- |
| Frozen block start | Constitution v2 character offset `37623`; UTF-8 byte offset `37625` |
| Frozen block end | Constitution v2 character offset `38500` exclusive; UTF-8 byte offset `38502` exclusive |
| Frozen block identity | SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` |
| Affected text start | Relative payload offset `287`; Constitution character offset `37910`; UTF-8 byte offset `37912` |
| Affected text end | Relative payload offset `329` exclusive; Constitution character offset `37952` exclusive; UTF-8 byte offset `37954` exclusive |
| Affected text inside frozen hashed payload | YES |
| Exact overlapping substring | `Fresh Start, Present Only, and No Old Pull` |
| Correction operation | PENDING; no `REPLACE`, `INSERT`, or other textual operation is authorized |

The exact frozen intersection is proven. It does not select where a future correction should occur.

## 10. Payload-Impact Determination

The current Work Package boundary prohibits editing AMEND-001-C. The table records impact under that boundary; no correction is authorized.

| Payload question | Result | Basis |
| --- | --- | --- |
| Complete Constitution v2 identity changes | YES if any correction text is later applied | Any file-text change changes the complete-file hash. |
| Frozen AMEND-001-C wording identity changes | NO under the existing boundary | The frozen block must remain byte-identical. |
| Approved Manifest payload changes | NO under the existing boundary | No approved payload change is authorized. |
| Approved target postimage changes | YES if clause 15.6 or adjacent text changes | The combined target-region identity changes outside the frozen block. |
| Founder-approved exact wording changes | NO under the existing boundary | AMEND-001-C remains exact. |

If a later Founder decision chooses to edit any character inside AMEND-001-C, every affected frozen identity result changes to `YES`, and the Route 2 wording-reapproval chain becomes mandatory.

## 11. Exact Authorized Correction Text

| Field | Result |
| --- | --- |
| Current exact text | Recorded in section 6 for all six representations |
| Authorized replacement text | PENDING |
| Authorized location | PENDING |
| Maximum allowed change | PENDING, bounded to the smallest correction for CONST-V2-STRUCT-003 |
| Correction type | PENDING between exact normalization, explicit alias treatment, or explicit no-text deferral |
| Meaning preserved | Existing trust-boundary meaning must remain unchanged |
| Protected meanings | User authority, consent precedence, preservation/use separation, operation distinctions, non-automatic-deletion treatment, downstream ownership, and implementation neutrality |
| Prohibited expansion | No new primitive, trust rule, deletion rule, operational mechanic, unrelated naming registry, or change outside CONST-V2-STRUCT-003 |
| Exact authorized correction text | PENDING |
| Correction execution authorized | NO |

The Founder principle alone does not mechanically determine exact correction text.

## 12. Ownership Decision

| Ownership field | Result |
| --- | --- |
| Constitution decides | Canonical identity, semantic scope, and authority |
| Named downstream owner decides | PENDING; no Model D owner has been selected |
| Downstream owner | PENDING |
| Downstream may | Render, display, translate, or localize after authority is explicit; register aliases only if explicitly authorized |
| Downstream must not | Create, merge, split, redefine, or silently alias constitutional identities; alter semantic scope or authority |

No generic `downstream` owner is substituted for the missing Founder choice.

## 13. Wording-Reapproval Rule

| Question | Result |
| --- | --- |
| Frozen AMEND-001-C identity changes under current boundary | NO |
| Approved Manifest payload changes under current boundary | NO |
| Founder-approved exact wording changes under current boundary | NO |
| Founder wording reapproval required under current boundary | NO |
| Founder wording reapproval required if any frozen byte changes | YES, without editorial exception |

This result does not authorize an outside-payload correction. It only distinguishes the frozen wording gate from the unresolved constitutional naming gate.

## 14. Required Authority Route After Decision

**Selected execution route: Route 4 - Founder decision incomplete**

Route 4 is required because canonical written form, selected model, alias treatment, hyphenation identity effect, exact correction text, representation ownership, and Founder decision date remain unresolved.

| Execution result | Value |
| --- | --- |
| STRUCT-WORK-003 status | BLOCKED |
| Structural correction executable | NO |
| Frozen payload revision authorized | NO |
| Exact no-text-correction decision recorded | NO |
| Required completion action | Founder completes the atomic term-specific decision fields and supplies exact correction text or an explicit no-text deferral |

## 15. Two SAFE Work Items

| Measure | Result |
| --- | ---: |
| SAFE work items preserved | 2 |
| SAFE work items applied | 0 |
| SAFE work items affected by this incomplete decision | 0 |

**Recommended correction strategy: BLOCK ALL CORRECTIONS PENDING TARGETED FOUNDER DECISION COMPLETION**

No execution dependency is invented. The strategy preserves one candidate identity while the blocked naming authority remains unresolved.

## 16. Decision Completeness Validation

| Mandatory field | Status |
| --- | --- |
| General canonical-identity rule | COMPLETE |
| Affected defined terms | COMPLETE |
| Canonical written form | INCOMPLETE |
| Selected model | INCOMPLETE |
| Alias treatment | INCOMPLETE |
| Capitalization rule | COMPLETE |
| Hyphenation rule | INCOMPLETE for affected names |
| Representation ownership | INCOMPLETE |
| Constitutional/downstream boundary | COMPLETE at the general level; term-specific owner remains incomplete |
| Exact frozen range | COMPLETE |
| Frozen payload impact | COMPLETE under current boundary |
| Manifest impact | COMPLETE under current boundary |
| Semantic impact | COMPLETE as `POTENTIALLY SEMANTIC`; final equivalence remains unresolved |
| Exact authorized correction text or no-text decision | INCOMPLETE |
| Wording reapproval requirement | COMPLETE under current boundary |
| Selected execution route | COMPLETE: Route 4 |
| Founder authority | COMPLETE |
| Founder decision date | INCOMPLETE |

**Decision completeness: INCOMPLETE**

Unresolved decision fields:

1. Canonical identity for each affected name.
2. Canonical written form for each affected name.
3. Selected Model A, B, C, or D.
4. Alias treatment and any exact recognized aliases.
5. Whether hyphenation distinguishes identity for these names.
6. Term-specific downstream representation owner, if Model D is selected.
7. Exact authorized correction text and location, or an explicit no-text-correction decision.
8. Final identity and semantic equivalence classification for each pair.
9. Founder decision date.

## 17. Decision Consistency Validation

| Consistency check | Result |
| --- | --- |
| Primitive renamed implicitly | NO |
| Alias invented | NO |
| Representation confused with identity | NO; distinction is explicit and unresolved pairs remain pending |
| Downstream allowed to redefine identity | NO |
| Scope exceeds CONST-V2-STRUCT-003 | NO |
| Frozen change bypasses reapproval | NO |
| SAFE work item altered | NO |
| Broader representation registry created | NO |
| Founder term-specific choice assumed | NO |

The incomplete record is internally consistent with all source authority and blocks execution rather than filling missing choices.

**Decision consistency: PASS**

## 18. Amendment-Scope Impact

| Possible effect | Result |
| --- | --- |
| Correction to AMEND-001-C | NO; not authorized |
| New constitutional clause | NO; not authorized |
| Constitutional precedent only | YES; the Founder-supplied general principle is recorded as governance authority but is not incorporated into Constitution v2 |
| Downstream deferral | PENDING; no Model D owner selected |
| New constitutional issue | NO |
| Existing Issue 003 reconsidered beyond naming scope | NO |

The precedent exists as governance authority only. Constitution v2 remains unchanged until an exact text-change process is separately authorized and completed.

## 19. Required Decision Matrix

| Question | Founder decision | Evidence | Constitutional effect | Execution consequence |
| --- | --- | --- | --- | --- |
| Constitution owns identity? | YES | Founder constitutional principle | Constitution owns canonical identity, scope, and authority | Downstream cannot redefine |
| Canonical form required? | YES | Founder constitutional principle | Every defined term requires one explicit form | Exact form still pending |
| Aliases permitted? | Only when explicitly recognized | Founder constitutional principle | No implicit alias exists | Alias treatment pending |
| Capitalization normative? | NO by default | Founder constitutional principle | Capitalization alone does not define identity absent exception | Does not select canonical form |
| Hyphenation normative? | Only where explicitly identity-distinguishing | Founder constitutional principle | Term-specific effect remains unresolved | Correction blocked |
| Representation owner | PENDING | No Model D selection | No registry authority granted | Correction blocked |
| Affected term identity | PENDING for three boundary-name pairs | Sources identify forms but not identity equivalence | No canonical identity selected | Correction blocked |
| Frozen payload affected? | NO under existing boundary | Work Package prohibits editing AMEND-001-C | Frozen block remains exact | Route 2 not presently selected |
| Manifest affected? | NO under existing boundary | No payload change authorized | Manifest remains frozen | No manifest update |
| Wording reapproval required? | NO under existing boundary; YES if frozen bytes change | Founder wording identity rule | No editorial exception | Current blocker is constitutional decision, not reapproval |
| Selected execution route | Route 4 | Mandatory fields unresolved | No text-change authority | Founder completion required |

## 20. Artifact Discipline

| Artifact or action | Result |
| --- | --- |
| Constitution v1 modified | NO |
| Constitution v2 modified | NO |
| Amendment modified | NO |
| Founder Wording Approval modified | NO |
| Approved Wording Manifest modified | NO |
| Structural Work Package modified | NO |
| Issue Register modified | NO |
| Findings closed | 0 |
| Issues closed | 0 |
| Ratification performed | NO |
| Application code modified | NO |
| Schema modified | NO |

## 21. Verdict and Next Gate

The Founder-supplied general constitutional principle is recorded, the affected names and exact frozen ranges are established, and payload routing is clear. The atomic term-specific decision is incomplete because no authoritative input selects canonical forms, alias treatment, model, exact correction text or no-text deferral, downstream owner, or decision date.

**Recommended next task: Founder completion of Canonical-Term Decision Record**

**Verdict: BORDERLINE — FOUNDER DECISION INCOMPLETE**

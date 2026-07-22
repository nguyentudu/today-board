# Moon Constitution Amendment 001 Incorporation Diff v1

## 1. Document Control

| Field | Value |
| --- | --- |
| Amendment ID | 001 |
| Status | INCORPORATION DIFF COMPLETE — INDEPENDENT VERIFICATION PENDING |
| Execution date | 2026-07-16 |
| Source Constitution | `docs/kernel/01_continuity_kernel_constitution_v1.md` |
| Source Constitution SHA-256 | `81297F4699C8414C9399777E3EE0CE9793F39C46550ED425169E1C6F61157E87` |
| Resulting Constitution | `docs/kernel/07_continuity_kernel_constitution_v2.md` |
| Resulting Constitution SHA-256 | `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| Founder Wording Approval | `docs/kernel/governance/06_constitution_amendment_001_founder_wording_approval_v1.md` |
| Approval artifact SHA-256 | `9E505C306E49BF2BB74B84E1B86611E331B43D05A611D2408EDB9461EF664A98` |
| Approved Wording Manifest SHA-256 | `A4FCB6C3FD84E69C57C0148D278F6B13F9D958628A06582719859C7FE7D594DA` |
| Manifest hash boundary | Exact UTF-8 manifest section from its section 9 heading through the final entry, excluding trailing line breaks and section 10 |
| Atomic execution status | APPLIED 3/3; PARTIAL APPLICATION NO |

## 2. Source and Result Identity

| Measure | Source v1 | Result v2 |
| --- | --- | --- |
| SHA-256 | `81297F4699C8414C9399777E3EE0CE9793F39C46550ED425169E1C6F61157E87` | `BF8F80F38C217E2E39F9D50A862B8314E5ECDBDFD99D91B873350E43F76279F5` |
| File size | 58,796 bytes | 60,793 bytes |
| Line count | 662 | 671 |
| Status | PRE-INCORPORATION BASELINE | INCORPORATED — PENDING VERIFICATION |

## 3. Target Preimage Verification

| Change ID | Target section | Operation | Expected preimage identity | Observed preimage identity | Match | Occurrences |
| --- | --- | --- | --- | --- | --- | --- |
| AMEND-001-A | Section 4 definition anchor | INSERT EXACT BLOCK | `264035821CB8F093B70396B346D9C2ACFE715EE13A2D7DF2D6E9BB0BDC7F2C56` | `264035821CB8F093B70396B346D9C2ACFE715EE13A2D7DF2D6E9BB0BDC7F2C56` | YES | 1 |
| AMEND-001-B | Section 7.7 complete three-paragraph body | INSERT EXACT BLOCK | `D52AA91581546BF886550D29BD21CEDCB6E503D00A2A21872CF49D5645DF94EC` | `D52AA91581546BF886550D29BD21CEDCB6E503D00A2A21872CF49D5645DF94EC` | YES | 1 |
| AMEND-001-C | Section 15 clause 15.6 anchor | INSERT EXACT BLOCK | `E4676299DCDD1A99B86694C288299FC891962406E9D712D18970E2E636A74BBD` | `E4676299DCDD1A99B86694C288299FC891962406E9D712D18970E2E636A74BBD` | YES | 1 |

### 3.1 AMEND-001-A

**Preimage**

> **A Situation is a context with the potential to require future understanding, continuation, resumption, attention, commitment, or conclusion.**

**Approved wording**

> A context qualifies as a Situation only when continuity of its identity or meaning across a meaningful separation may be needed; possible future usefulness alone does not make retained material a Situation. Continuity Language may define canonical terms, Ontology may define conceptual relationships, the Situation Primitive Specification may define operational semantics, and the Kernel Acceptance Specification may define tests, but none may redefine this qualification.

**Postimage**

> **A Situation is a context with the potential to require future understanding, continuation, resumption, attention, commitment, or conclusion.**
>
> A context qualifies as a Situation only when continuity of its identity or meaning across a meaningful separation may be needed; possible future usefulness alone does not make retained material a Situation. Continuity Language may define canonical terms, Ontology may define conceptual relationships, the Situation Primitive Specification may define operational semantics, and the Kernel Acceptance Specification may define tests, but none may redefine this qualification.

Identity verification: approved and incorporated wording SHA-256 `A276B62AE5B69E8E16CAF9F2F1C938EC97A699AB0CE89503F5853B9C29F3E225`; exact match **YES**.

### 3.2 AMEND-001-B

**Preimage**

> **Constitutional definition:** The way a Situation reaches a concluded or intentionally inactive disposition.
>
> **Fundamental question:** How did this Situation end or become intentionally inactive?
>
> **Must not be confused with:** Waiting. Waiting describes temporary obstruction to possible continuation. Outcome describes conclusion or deliberate disposition. Completion, cancellation, abandonment, reference preservation, or deliberate leaving-alone may express Outcome in later modelling, but this Constitution does not settle categories.

**Approved wording**

> Pause, non-attention, leave-alone presentation, voluntary delay, or temporary Waiting does not by itself establish Outcome; Outcome requires conclusion or an intentional disposition of the current Situation. Ontology defines identity relationships, Situation Lifecycle defines transitions and reopening, the Waiting and Outcome Primitive Specifications define operational semantics, and the Kernel Acceptance Specification defines tests, without redefining this distinction.

**Postimage**

> **Constitutional definition:** The way a Situation reaches a concluded or intentionally inactive disposition.
>
> **Fundamental question:** How did this Situation end or become intentionally inactive?
>
> **Must not be confused with:** Waiting. Waiting describes temporary obstruction to possible continuation. Outcome describes conclusion or deliberate disposition. Completion, cancellation, abandonment, reference preservation, or deliberate leaving-alone may express Outcome in later modelling, but this Constitution does not settle categories.
>
> Pause, non-attention, leave-alone presentation, voluntary delay, or temporary Waiting does not by itself establish Outcome; Outcome requires conclusion or an intentional disposition of the current Situation. Ontology defines identity relationships, Situation Lifecycle defines transitions and reopening, the Waiting and Outcome Primitive Specifications define operational semantics, and the Kernel Acceptance Specification defines tests, without redefining this distinction.

Identity verification: approved and incorporated wording SHA-256 `88E14DF3CDD9EA0BD03016D9C0A05A6DD18FB6E24E02A43C0C24AA683BC7E03A`; exact match **YES**.

### 3.3 AMEND-001-C

**Preimage**

> 6. **Moon must respect continuity boundaries.** Fresh-start, present-only, light-continuity, and no-old-pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.

**Approved wording**

> A person's explicit continuity boundaries constrain continuity use and may limit retention, retrieval, presentation, inference, reopening, or cross-session continuity without constituting Continuity failure. Preservation and Situation identity do not by themselves authorize those uses. Fresh Start, Present Only, and No Old Pull do not automatically require permanent deletion or non-retention; retention, persistence, retrieval, presentation, inference, reopening, cross-session continuity, deletion, and forgetting remain distinct. The Continuity Invariants Specification defines universal effects, Situation Lifecycle defines reopening and cross-session effects, the Kernel Acceptance Specification defines tests, and Kernel Architecture defines storage, retrieval, presentation, deletion, and enforcement mechanics, without redefining this authority or these distinctions.

**Postimage**

> 6. **Moon must respect continuity boundaries.** Fresh-start, present-only, light-continuity, and no-old-pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.
>
> A person's explicit continuity boundaries constrain continuity use and may limit retention, retrieval, presentation, inference, reopening, or cross-session continuity without constituting Continuity failure. Preservation and Situation identity do not by themselves authorize those uses. Fresh Start, Present Only, and No Old Pull do not automatically require permanent deletion or non-retention; retention, persistence, retrieval, presentation, inference, reopening, cross-session continuity, deletion, and forgetting remain distinct. The Continuity Invariants Specification defines universal effects, Situation Lifecycle defines reopening and cross-session effects, the Kernel Acceptance Specification defines tests, and Kernel Architecture defines storage, retrieval, presentation, deletion, and enforcement mechanics, without redefining this authority or these distinctions.

Identity verification: approved and incorporated wording SHA-256 `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957`; exact match **YES**.

## 4. Approved-Block Identity Verification

| Change ID | Approved identity | Incorporated identity | Exact match |
| --- | --- | --- | --- |
| AMEND-001-A | `A276B62AE5B69E8E16CAF9F2F1C938EC97A699AB0CE89503F5853B9C29F3E225` | `A276B62AE5B69E8E16CAF9F2F1C938EC97A699AB0CE89503F5853B9C29F3E225` | YES |
| AMEND-001-B | `88E14DF3CDD9EA0BD03016D9C0A05A6DD18FB6E24E02A43C0C24AA683BC7E03A` | `88E14DF3CDD9EA0BD03016D9C0A05A6DD18FB6E24E02A43C0C24AA683BC7E03A` | YES |
| AMEND-001-C | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | `E6EE9BD4FD488FE6AE36B1009A6305F37E46205EAF2B81257B8132906E4D7957` | YES |

Exact matches: **3/3**.

## 5. Diff Classification

| Diff hunk | Location | Classification | Manifest entry | Authorized |
| --- | --- | --- | --- | --- |
| HUNK-001 | Document heading and version metadata | AUTHORIZED VERSION METADATA | Amendment-level approval | YES |
| HUNK-002 | Section 4 after Situation definition | AMEND-001-A | AMEND-001-MANIFEST-A | YES |
| HUNK-003 | End of section 7.7 | AMEND-001-B | AMEND-001-MANIFEST-B | YES |
| HUNK-004 | Section 15 after clause 15.6 | AMEND-001-C | AMEND-001-MANIFEST-C | YES |

Unauthorized textual changes: **0**.  
Unclassified diff hunks: **0**.  
Additional formatting changes: **0**.

## 6. Complete Classified Diff

```diff
@@ AUTHORIZED VERSION METADATA @@
-# Moon Continuity Kernel Constitution v1
+# Moon Continuity Kernel Constitution v2
 
-Status: Constitutional working model  
+Status: Amendment 001 incorporated — pending post-incorporation verification  
 Scope: Phase 0 - Meaning and Model  
-Version posture: Current v1 hypothesis, subject to explicit evolution
+Version posture: Constitution v2 incorporates Amendment 001; pending post-incorporation verification  
+Incorporated amendment: Moon Constitution Amendment 001 v1  
+Incorporation date: 2026-07-16

@@ AMEND-001-A / AMEND-001-MANIFEST-A / SECTION 4 @@
 **A Situation is a context with the potential to require future understanding, continuation, resumption, attention, commitment, or conclusion.**
 
+A context qualifies as a Situation only when continuity of its identity or meaning across a meaningful separation may be needed; possible future usefulness alone does not make retained material a Situation. Continuity Language may define canonical terms, Ontology may define conceptual relationships, the Situation Primitive Specification may define operational semantics, and the Kernel Acceptance Specification may define tests, but none may redefine this qualification.
+
 Situation is Moon's root conceptual object because continuity must be continuity *of something*. That something cannot be defined by the interface that renders it or the industry term that currently names it. A Situation gives conceptual identity to what a person may need to recognize and return to across a separation.

@@ AMEND-001-B / AMEND-001-MANIFEST-B / SECTION 7.7 @@
 **Must not be confused with:** Waiting. Waiting describes temporary obstruction to possible continuation. Outcome describes conclusion or deliberate disposition. Completion, cancellation, abandonment, reference preservation, or deliberate leaving-alone may express Outcome in later modelling, but this Constitution does not settle categories.
 
+Pause, non-attention, leave-alone presentation, voluntary delay, or temporary Waiting does not by itself establish Outcome; Outcome requires conclusion or an intentional disposition of the current Situation. Ontology defines identity relationships, Situation Lifecycle defines transitions and reopening, the Waiting and Outcome Primitive Specifications define operational semantics, and the Kernel Acceptance Specification defines tests, without redefining this distinction.
+
 ## 8. Ontology Versus Canonical Model

@@ AMEND-001-C / AMEND-001-MANIFEST-C / SECTION 15 @@
 6. **Moon must respect continuity boundaries.** Fresh-start, present-only, light-continuity, and no-old-pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.
+
+A person's explicit continuity boundaries constrain continuity use and may limit retention, retrieval, presentation, inference, reopening, or cross-session continuity without constituting Continuity failure. Preservation and Situation identity do not by themselves authorize those uses. Fresh Start, Present Only, and No Old Pull do not automatically require permanent deletion or non-retention; retention, persistence, retrieval, presentation, inference, reopening, cross-session continuity, deletion, and forgetting remain distinct. The Continuity Invariants Specification defines universal effects, Situation Lifecycle defines reopening and cross-session effects, the Kernel Acceptance Specification defines tests, and Kernel Architecture defines storage, retrieval, presentation, deletion, and enforcement mechanics, without redefining this authority or these distinctions.
+
 7. **Emotional judgment and trust behavior are not automatically outsourced.** External systems may provide Evidence or operations, but they do not automatically own interpretation, relational meaning, or sensitive decisions.
```

## 7. Deterministic Drift Check

Removing the three approved insertion blocks and reversing only the authorized version metadata from Constitution v2 reproduces the exact source Constitution identity:

`81297F4699C8414C9399777E3EE0CE9793F39C46550ED425169E1C6F61157E87`

Result: **PASS — ZERO UNAUTHORIZED DRIFT**.

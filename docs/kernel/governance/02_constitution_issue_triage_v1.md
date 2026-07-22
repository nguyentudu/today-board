# Moon Constitution Issue Triage v1

## 1. Document Control

| Field | Value |
| --- | --- |
| Title | Moon Constitution Issue Triage v1 |
| Document ID | MOON-CONST-TRIAGE-001 |
| Version | 1.0 |
| Status | DRAFT FOR FOUNDER DISPOSITION |
| Phase | Phase 0 - Constitutional Foundation |
| Source Constitution | `docs/kernel/01_continuity_kernel_constitution_v1.md` |
| Source review | `docs/kernel/reviews/01_constitution_ratification_review_v1.md` |
| Source issue register | `docs/kernel/governance/01_constitution_issues_v1.md` |
| Owner | Moon Architecture |
| Decision authority | Founder |
| Created date | 2026-07-15 |
| Last updated date | 2026-07-15 |

## 2. Purpose

This document validates each registered constitutional issue, separates constitutional decisions from downstream specification questions, proposes controlled dispositions, scopes the smallest possible amendment, and prepares explicit Founder decisions.

**This document does not amend or ratify the Constitution.** It does not accept, reject, defer, merge, resolve, or close an issue on behalf of the Founder. Every Founder decision remains `PENDING`.

The current governance state remains:

| Work item | State |
| --- | --- |
| Constitution Draft | COMPLETE |
| Independent Review | COMPLETE |
| Issue Register | COMPLETE |
| Founder Issue Disposition | PENDING |
| Amendment 001 | NOT STARTED |
| Constitution Ratification | PENDING |
| Kernel Implementation | BLOCKED |

## 3. Triage Principles

### 3.1 Evidence Before Interpretation

Every triage conclusion must be traceable to the Constitution, the independent review, and the source issue record. A plausible concern is not enough by itself. The affected constitutional language and the materially different interpretations must be identifiable.

### 3.2 Minimal Constitutional Change

Constitutional amendment is recommended only when the Constitution owns an unresolved meaning, authority, precedence, trust, or invariant boundary. Explicit deferral is preferable when the Constitution already establishes the boundary and only operational detail is missing.

### 3.3 Constitution Owns Meaning, Not Implementation

The Constitution may define conceptual meaning, authority, precedence, trust boundaries, invariant scope, mandatory layer separation, and what downstream layers may not redefine. It must not define schema, cardinality implementation, API behavior, database representation, UI behavior, storage logic, test fixtures, application workflow, or domain-specific rules.

Mixed ownership must be expressed precisely: the Constitution establishes the binding boundary; the named downstream document defines the structure, lifecycle, tests, or technical realization within that boundary.

### 3.4 Potential Tension Is Not Actual Conflict

A potential tension exists when two principles permit materially different interpretations under a valid condition. An actual conflict exists only when both rules require incompatible outcomes under the same valid conditions. The sources identify zero actual invariant conflicts and two major potential tensions. This triage preserves that finding.

### 3.5 Founder Authority Remains Explicit

This document may validate evidence, recommend a disposition, and explain options. Only the Founder may select a constitutional meaning, authorize an amendment, reject an issue, or direct formal deferral.

## 4. Central Triage Table

The two `TENSION` rows are review findings already mapped by the Issue Register. They are included for complete triage and do not create additional registered issues.

| Issue ID | Title | Validated? | Classification | Severity | Constitution-owned? | Constitution change required? | Downstream owner | Proposed disposition | Target amendment | Founder decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CONST-ISSUE-001 | Situation qualification boundary | YES | DEFINITION AMBIGUITY | HIGH | PARTIALLY | YES | Continuity Language; Ontology; Situation Primitive Specification; Kernel Acceptance Specification | ACCEPT FOR AMENDMENT | Amendment 001, Change A | PENDING |
| CONST-ISSUE-002 | Intentional inactivity boundary | YES | LIFECYCLE AMBIGUITY | HIGH | PARTIALLY | YES | Ontology; Situation Lifecycle; Waiting and Outcome Primitive Specifications; Kernel Acceptance Specification | ACCEPT FOR AMENDMENT | Amendment 001, Change B | PENDING |
| CONST-ISSUE-003 | Authorized discontinuity precedence | YES | TRUST-BOUNDARY AMBIGUITY | CRITICAL | PARTIALLY | YES | Continuity Invariants; Situation Lifecycle; Kernel Acceptance Specification; Architecture | ACCEPT FOR AMENDMENT | Amendment 001, Change C | PENDING |
| TENSION-001 | Fresh Start versus Situation identity | YES | POTENTIAL INVARIANT TENSION | CRITICAL | YES | YES through surviving issue | Continuity Invariants; Situation Lifecycle; Architecture | MERGE WITH ANOTHER ISSUE | Merge into CONST-ISSUE-003 / Amendment 001, Change C | PENDING |
| TENSION-002 | Outcome versus reopened Situation | YES | POTENTIAL INVARIANT TENSION | MEDIUM | PARTIALLY | NO for reopening mechanics; Change B still clarifies the Outcome boundary | Ontology; Situation Lifecycle | DEFER TO DOWNSTREAM SPECIFICATION | Amendment 001, Change B only for the semantic boundary; no amendment for reopening mechanics | PENDING |

## 5. Detailed Triage Records

### 5.1 CONST-ISSUE-001 - Situation Qualification Boundary

| Field | Triage finding |
| --- | --- |
| Issue ID | CONST-ISSUE-001 |
| Issue title | Situation Qualification Boundary |
| Source issue record | `docs/kernel/governance/01_constitution_issues_v1.md`, section 6, `CONST-ISSUE-001` |
| Affected constitutional sections | Section 4, Definition of Situation; section 7.1, Situation; invariant 9.1, Situation identity; section 21, Constitution Acceptance |
| Review finding | Review sections 1, 2.1, 2.3, 8, 13.2, and 14 find no minimum test separating a Situation from ambient context, retained information, or a transient concern. |
| Issue statement | “Potential to require future understanding” is broad enough to admit almost any information that might later be useful, while Situation identity carries binding constitutional protection. The Constitution does not state the minimum continuity claim that activates Situation status. |
| Competing interpretations | A: possible future usefulness is sufficient. B: a coherent identity or meaning must need continuity across a meaningful separation. C: only a person-authorized intent to return is sufficient. |
| Validation result | YES. Each interpretation is textually plausible and produces materially different Kernel scope. |
| Evidence supporting the issue | Section 4 uses “potential” and a broad list of possible future needs; section 7.1 repeats that breadth; invariant 9.1 makes Situation identity binding; section 4 explicitly defers identity mechanics but does not establish a lower qualification boundary. |
| Evidence against the issue | Section 4 distinguishes Situation from tasks, notes, projects, files, reminders, and domain nouns. The phrase “context” and the Continuity definition imply more than isolated data. These constraints reduce overreach but do not give Architect or QA a repeatable threshold. |
| Classification | DEFINITION AMBIGUITY |
| Severity | HIGH. Inconsistent qualification could expand or contract the root conceptual object and produce incompatible Kernels. |
| Constitution ownership analysis | PARTIALLY. The Constitution owns the minimum meaning boundary because downstream layers may not redefine Situation. It need not own recognition algorithms, representation, cardinality, or identity mechanics. |
| Downstream ownership analysis | Continuity Language owns canonical wording and substitutions; Ontology owns conceptual relationships; the Situation Primitive Specification owns operational semantic rules; Kernel Acceptance owns examples and behavioral checks. |
| Behavioral divergence if unresolved | One conforming system may turn every bookmark or passing thought into a Situation. Another may require explicit return intent and exclude unresolved context that the Constitution expected to preserve. Packs and Surfaces may invent incompatible eligibility rules. |
| Trust or dignity impact | Over-classification can create unnecessary retention and return pressure. Under-classification can lose context a person expected Moon to preserve. The issue is not itself a consent rule, but it changes the scope over which trust rules operate. |
| Amendment necessity | YES. All necessity tests are met: the issue is valid, the Constitution owns the minimum boundary, current wording permits divergent meanings, Kernel scope changes materially, and downstream documents cannot choose without inventing constitutional meaning. |
| Smallest possible constitutional change | Add one qualification sentence to section 4 and one explicit deferral sentence. Do not rewrite the definition or add a Primitive. |
| Alternative non-amendment resolution | Continuity Language and Kernel Acceptance could publish examples only. This is not recommended because examples would implicitly create the missing constitutional threshold and could be challenged as exceeding downstream authority. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Proposed amendment mapping | Amendment 001, Change A |
| Founder decision | PENDING |
| Decision rationale | PENDING - no Founder disposition exists in the sources. |
| Closure condition | Founder accepts a resolution option; a minimal amendment is ratified and incorporated; downstream owners can derive objective qualification rules without redefining Situation. A formal rejection or deferral with rationale provides an alternative closure path. |

#### Constitution Ownership Test

The Constitution must establish **what minimum continuity meaning distinguishes a Situation from merely retained material**. Downstream specifications must define **canonical terms, relationships, representation, operational examples, and QA fixtures**.

#### Minimal Change Proposal

| Element | Constraint |
| --- | --- |
| Target section | Section 4, Definition of Situation; optionally corresponding acceptance wording in section 21 only if needed for consistency |
| Change type | One definition clarification plus one explicit downstream deferral |
| Intended effect | Prevent possible future usefulness alone from automatically establishing Situation status while retaining domain independence |
| Wording constraints | Must remain conceptual; must not require a UI act, field, score, storage object, or particular Primitive instance |
| What must remain unchanged | Situation remains Moon's root object; task/note/project/card/domain non-equivalence remains; identity mechanics and cardinality remain deferred |

#### Resolution Options

**Option A - Continuity-claim threshold**  
Constitutional meaning: A context qualifies when preserving its identity or meaning across a meaningful separation may be necessary for understanding, resumption, attention, commitment, or honest disposition.  
Advantages: Fits the existing thesis, remains domain-independent, and supplies a semantic lower boundary.  
Risks: “Meaningful separation” still requires downstream examples and could remain broad in edge cases.  
Downstream consequences: Language defines the terms; Situation Specification and Acceptance define examples and non-examples.  
Required amendment scope: One sentence plus explicit deferral.  
**Recommended for Founder consideration.**

**Option B - Person-authorized return threshold**  
Constitutional meaning: A context qualifies when a person has authorized or expressed that it may need future continuity.  
Advantages: Stronger agency boundary and narrower qualification.  
Risks: May exclude situations whose continuity need exists before explicit capture or authorization; requires later rules for relational and imported contexts.  
Downstream consequences: Consent and authorship semantics become central to Ontology and Primitive Specifications.  
Required amendment scope: One qualification sentence and one authority boundary.

### 5.2 CONST-ISSUE-002 - Intentional Inactivity Boundary

| Field | Triage finding |
| --- | --- |
| Issue ID | CONST-ISSUE-002 |
| Issue title | Outcome, Waiting, Attention, and Intentional Inactivity Boundary |
| Source issue record | `docs/kernel/governance/01_constitution_issues_v1.md`, section 6, `CONST-ISSUE-002` |
| Affected constitutional sections | Section 3 on Attention and Outcome; sections 7.3 and 7.7; invariants 9.3, 9.7, and 9.13; principles 11.15 and 11.16; trust clauses 15.1, 15.2, 15.5, and 15.8; deferred lifecycle questions in section 19 |
| Review finding | Review sections 1, 2.3, 3, 4.2, 8, 13.2, and 14 find that intentionally inactive Outcome overlaps with voluntary Waiting, Attention management, pause, abandonment, leaving alone, and chosen discontinuity. |
| Issue statement | The Constitution distinguishes Waiting from Outcome but also allows “intentionally inactive” and “deliberate leaving-alone” to express Outcome. It does not state when chosen inactivity is a temporary attention or obstruction condition and when it is a disposition of the Situation. |
| Competing interpretations | A: any deliberate inactivity may express Outcome. B: Outcome requires intent to dispose of or conclude the current continuity arc; pause and leave-alone Attention do not qualify. C: leaving alone may be Outcome only when explicitly classified by the person, regardless of likely future return. |
| Validation result | YES. The interpretations are compatible with different parts of the current wording and would produce different Primitive classifications and lifecycle assumptions. |
| Evidence supporting the issue | Section 7.7 includes intentionally inactive disposition and deliberate leaving-alone; section 7.3 says Waiting preserves possible continuation; Attention is not a demand for action; trust clause 15.5 says inactivity is not automatically Outcome. No clause establishes the positive threshold for deliberate inactivity becoming Outcome. |
| Evidence against the issue | Invariants 9.3, 9.7, and 9.13 already forbid treating temporary obstruction or inactivity automatically as Outcome. These rules prevent the most direct error, but do not resolve explicitly chosen pause, abandonment, or leave-alone cases. |
| Classification | LIFECYCLE AMBIGUITY with a constitutional definition boundary |
| Severity | HIGH. Divergent classifications could redefine Outcome or Waiting and create incompatible Kernel behavior. |
| Constitution ownership analysis | PARTIALLY. The Constitution owns the minimum semantic distinction and non-inference boundary. It does not own state transitions, reopening identity, categories, or a transition graph. |
| Downstream ownership analysis | Ontology owns relationships and identity structure; Situation Lifecycle owns transitions and reopening; Waiting and Outcome Specifications own detailed rules; Kernel Acceptance owns operational cases. |
| Behavioral divergence if unresolved | A Surface may treat moving something out of attention as Outcome, another may preserve it as open, and a third may classify voluntary delay as Waiting. Reopening may accidentally create, continue, or replace identity based on implementation defaults. |
| Trust or dignity impact | Over-classifying Outcome can misstate a person's intent. Under-classifying deliberate disposition can keep a Situation active and create pressure to return. Both threaten honest, non-coercive continuity. |
| Amendment necessity | YES for the semantic boundary. NO for detailed transition and reopening mechanics. A downstream-only answer would need to invent what Outcome fundamentally means in an ambiguous case. |
| Smallest possible constitutional change | Add one semantic distinction or normative must-not rule near sections 7.3/7.7, plus one explicit statement that lifecycle and reopening mechanics remain downstream. |
| Alternative non-amendment resolution | Defer all cases to Situation Lifecycle. This would keep the Constitution unchanged but would give Lifecycle authority to choose among constitutional Primitive meanings; it is therefore not recommended. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Proposed amendment mapping | Amendment 001, Change B |
| Founder decision | PENDING |
| Decision rationale | PENDING - no Founder disposition exists in the sources. |
| Closure condition | Founder selects a semantic boundary; a minimal amendment is ratified and incorporated; Lifecycle can define transition and reopening rules without redefining Waiting, Attention, or Outcome. A formal alternative disposition may also close or defer the issue. |

#### Constitution Ownership Test

The Constitution must establish **what makes intentional inactivity a disposition rather than mere non-attention, voluntary pause, or obstruction**. Ontology and Situation Lifecycle must define **identity, transitions, reopening, and successor relationships**. Primitive Specifications and Acceptance must define operational rules and tests.

#### Minimal Change Proposal

| Element | Constraint |
| --- | --- |
| Target section | Sections 7.3 and 7.7; invariant 9.13 only if needed to make the distinction binding |
| Change type | One semantic boundary, one must-not inference rule or normative example, and one explicit lifecycle deferral |
| Intended effect | Make deliberate disposition distinguishable from inactivity, Attention choice, and temporary Waiting |
| Wording constraints | Must not define statuses, a transition graph, reopening identity, or Surface zones |
| What must remain unchanged | Waiting remains obstruction; Outcome permits honest non-completion; Attention remains non-coercive; seven-Primitives set remains unchanged |

#### Resolution Options

**Option A - Disposition threshold**  
Constitutional meaning: Outcome requires a conclusion or an intentional disposition of the current Situation; pause, non-attention, or leave-alone presentation does not by itself qualify.  
Advantages: Gives QA a stable distinction, protects against Surface-driven Outcome, and preserves honest abandonment.  
Risks: “Disposition” needs downstream examples; some deliberate leave-alone cases still require explicit interpretation.  
Downstream consequences: Lifecycle defines transitions and reopening; Acceptance defines examples such as cancellation, abandonment, pause, and voluntary delay.  
Required amendment scope: One boundary sentence plus explicit deferral.  
**Recommended for Founder consideration.**

**Option B - Explicit human classification threshold**  
Constitutional meaning: Deliberate inactivity may express Outcome only when the person explicitly classifies it as the Situation's disposition; no behavioral inactivity or Surface movement may infer it.  
Advantages: Strong agency and non-inference protection; allows deliberate leaving-alone to remain within Outcome.  
Risks: Makes Outcome depend heavily on explicit classification and leaves collaborative authority questions downstream.  
Downstream consequences: Primitive Specifications must define classification authority and correction; Lifecycle handles reopening.  
Required amendment scope: One authority-qualified Outcome sentence and one non-inference rule.

### 5.3 CONST-ISSUE-003 - Authorized Discontinuity Precedence

| Field | Triage finding |
| --- | --- |
| Issue ID | CONST-ISSUE-003 |
| Issue title | Trust Precedence for Fresh Start, Present Only, Light Continuity, and No Old Pull |
| Source issue record | `docs/kernel/governance/01_constitution_issues_v1.md`, section 6, `CONST-ISSUE-003` |
| Affected constitutional sections | Section 3, Definition of Continuity; invariants 9.1, 9.11, and 9.15; principles 11.8 through 11.10; decision question 12.13; trust clauses 15.1, 15.2, 15.6, 15.9, and the section 15 closing rule; section 19 deferral of expiry, deletion, forgetting, and no-old-pull operation |
| Review finding | Review sections 1, 2.3, 4.2, 11, 13.2, and 14 identify missing precedence when binding identity and preservation meet a legitimate choice for fresh start, present-only use, light continuity, forgetting, or no old pull. |
| Issue statement | The Constitution makes Situation identity and preservation fidelity binding, recognizes discontinuity preferences as legitimate, and defers their exact treatment. It does not say whether user authority can limit retention, retrieval, presentation, reopening, or cross-session continuity, or whether the preference controls only current visibility. |
| Competing interpretations | A: identity and preservation duties continue beneath the Surface; discontinuity controls presentation and recall only. B: authorized discontinuity can limit retention as well as retrieval and presentation. C: permissions are separate and may be granted or withdrawn independently, with deletion requiring a distinct instruction. |
| Validation result | YES. All interpretations are compatible with at least part of the text and produce materially different trust and persistence behavior. |
| Evidence supporting the issue | Invariant 9.1 makes identity binding; invariant 9.11 protects faithful preservation; principle 11.10 places consent and dignity before retention; trust 15.1 gives people control over whether a Situation remains; trust 15.6 establishes discontinuity legitimacy but explicitly defers exact treatment. |
| Evidence against the issue | The phrase “consent and dignity before retention” and the closing trust rule strongly imply user authority. The Constitution may already establish direction. It does not, however, separate permissions or state the precedence required for universal conformance. |
| Classification | TRUST-BOUNDARY AMBIGUITY with a potential invariant tension and authority gap |
| Severity | CRITICAL. Divergent interpretation can violate consent, dignity, explicit boundaries, or core constitutional authority. |
| Constitution ownership analysis | PARTIALLY. The Constitution owns user authority, permission boundaries, and precedence among constitutional principles. It must not choose storage mechanisms, deletion algorithms, retention periods, or consent UI. |
| Downstream ownership analysis | Continuity Invariants specifies universal rules; Situation Lifecycle defines cross-session and reopening effects; Kernel Acceptance supplies tests; architecture implements retention, retrieval, presentation, and deletion honestly within technical limits. |
| Behavioral divergence if unresolved | One implementation may retain and later reintroduce material after a fresh-start request; another may delete it; another may suppress presentation but keep Return Points retrievable. All may claim compliance. |
| Trust or dignity impact | Direct. A broad identity reading can become coercive retention or unwanted recall. A broad deletion reading can destroy continuity a person intended only to hide. Ambiguity about authority can make consent ineffective. |
| Amendment necessity | YES. The Constitution must establish the authority and precedence boundary. Detailed permission states and mechanisms remain downstream. |
| Smallest possible constitutional change | Add one trust-precedence rule and one explicit statement separating the constitutional permission categories while deferring their operational representation. |
| Alternative non-amendment resolution | Defer the entire permission model to Invariants and Architecture. This is not recommended because those layers would have to decide whether consent can limit a binding constitutional identity or preservation duty. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Proposed amendment mapping | Amendment 001, Change C |
| Founder decision | PENDING |
| Decision rationale | PENDING - no Founder disposition or preferred trust philosophy exists in the sources. |
| Closure condition | Founder selects a precedence option; a minimal amendment is ratified and incorporated; downstream specifications can distinguish permissions and mechanisms without inventing constitutional authority. A formal alternative disposition may also close or defer the issue. |

#### Trust-Boundary Analysis

The following categories are distinct. A decision about one must not silently decide another.

| Concern | Current constitutional support | Unresolved Founder-level boundary | Downstream ownership after boundary |
| --- | --- | --- | --- |
| User authority | Human agency, consent, dignity, and control are binding values. | Whether user authority can limit every continuity operation or only specified operations. | Invariants and Acceptance define conformance; architecture enforces it. |
| Consent state | Consent is binding but not represented. | Whether authorization is global, operation-specific, or context-specific at the constitutional level. | Canonical Model and Architecture represent state after constitutional scope is known. |
| Recall permission | No-old-pull and control over return to Attention are legitimate. | Whether recall permission limits retrieval, presentation, or both. | Lifecycle, Invariants, and Surface rules. |
| Persistence permission | Consent and dignity precede retention; preservation remains a duty where authorized. | Whether fresh start or light continuity can withdraw retention permission, and under what authority. | Architecture defines storage behavior; Acceptance tests truthful effect. |
| Visibility permission | A person controls whether a Situation returns to Attention or is left behind. | Whether invisible material may remain retrievable without separate authorization. | Surface and retrieval specifications under the constitutional rule. |
| Deletion or forgetting request | Forgetting, expiry, and deletion are explicitly deferred and legitimate concerns. | Whether a request mandates removal, disables future retrieval, or requires a separately explicit deletion instruction. | Lifecycle, Invariants, Acceptance, and Architecture. |
| Situation identity | Identity must remain faithful across authorized representations. | Whether identity continues when all continuity permissions are withdrawn, and what claims may remain. | Ontology and Lifecycle define identity mechanics. |
| Return Point behavior | Return Point supports resumption and must not be inferred from recency. | Whether Return Points remain retained, retrievable, or presentable after no-old-pull. | Return Point Specification, Lifecycle, and retrieval behavior. |
| Fresh Start | Its legitimacy is established. | Whether it resets presentation only, cross-session retrieval, retained continuity, or a selected combination. | Invariants, Lifecycle, Acceptance, Architecture. |
| Present Only | Its legitimacy is established. | Whether current-session context may persist after the session or be recalled later. | Lifecycle and Architecture. |
| No Old Pull | Its legitimacy is established. | Whether it forbids automatic presentation, all retrieval, Return Point use, or reintroduction after reopening. | Retrieval rules, Lifecycle, and Acceptance. |

Operational distinctions:

- **Retention** keeps a representation or continuity record available.
- **Retrieval** makes retained material findable in response to an act or query.
- **Presentation** places material before the person or in Attention.
- **Inference** derives meaning or permission not explicitly confirmed.
- **Reopening** changes the lifecycle relation to a previously disposed Situation.
- **Cross-session continuity** permits meaning to remain available after a session boundary.
- **Deletion** removes a retained representation or makes a technically qualified erasure claim.

None of these operations is a synonym for another. The amendment should state constitutional authority and precedence, not implement a permission matrix.

#### Constitution Ownership Test

The Constitution must establish **whose authority governs and how authorized continuity boundaries constrain identity and preservation duties**. Downstream documents must define **permission representation, lifecycle effects, retrieval and presentation behavior, deletion mechanics, technical guarantees, and tests**.

#### Minimal Change Proposal

| Element | Constraint |
| --- | --- |
| Target section | Section 15, Ethical and Trust Boundaries; cross-reference to invariant 9.1 or preservation principle only if required for unambiguous precedence |
| Change type | One trust-precedence rule plus one explicit operational deferral |
| Intended effect | Prevent identity or preservation from being interpreted as unconditional retention or reintroduction, while avoiding unsupported deletion guarantees |
| Wording constraints | Must distinguish authorization from technical mechanism; must not conflate retention, retrieval, presentation, or deletion; must preserve honest claims |
| What must remain unchanged | Situation identity, preservation fidelity, agency, dignity, local-truth honesty, reversibility where practical, and downstream ownership of mechanics |

#### Resolution Options

**Option A - Authorization-bounded continuity**  
Constitutional meaning: Identity and preservation duties apply only within continuity the person has authorized; authorized boundaries may limit retention, retrieval, presentation, or cross-session continuity without constituting Continuity failure.  
Advantages: Gives consent and dignity direct precedence and prevents coercive interpretation.  
Risks: Requires careful downstream separation of permissions and honest handling of technically unavoidable retention.  
Downstream consequences: Invariants and Lifecycle define effects; Architecture implements operation-specific permissions and truthful deletion limits.  
Required amendment scope: One precedence clause plus one deferral.  
**Recommended for Founder consideration.**

**Option B - Layered permission independence**  
Constitutional meaning: Situation identity may remain preserved while retention, retrieval, presentation, reopening, and deletion permissions are constitutionally distinct and individually controlled; fresh start does not itself imply deletion unless specified.  
Advantages: Avoids conflating hiding, forgetting, and deletion; supports precise and reversible choices.  
Risks: Persistent identity may still feel coercive unless default authority and no-old-pull behavior are explicit; greater downstream policy complexity.  
Downstream consequences: Invariants must define non-inference among permissions; Canonical Model and Architecture represent and enforce them.  
Required amendment scope: One separation rule, one authority rule, and explicit downstream deferral.

**Option C - Minimum authority rule with downstream permission model**  
Constitutional meaning: A person's explicit continuity boundary must be honored, but the Constitution does not choose whether a named preference affects retention, retrieval, presentation, or deletion; each preference must be defined downstream before use.  
Advantages: Smallest constitutional footprint and avoids premature policy.  
Risks: May leave the current precedence question unresolved unless the amendment also forbids identity and preservation from overriding an explicit boundary.  
Downstream consequences: Invariants and Acceptance become blockers before any preference can be implemented.  
Required amendment scope: One must-honor rule and one strict deferral.

## 6. Potential Tension Triage

### 6.1 TENSION-001 - Fresh Start versus Situation Identity

| Question | Finding |
| --- | --- |
| Does the tension exist? | YES. Binding identity and legitimate discontinuity lack an explicit precedence rule. |
| Actual conflict? | NO. The Constitution does not simultaneously require unconditional retention and unconditional removal. |
| Coverage | Fully covered by `CONST-ISSUE-003`. Separate treatment would duplicate the same constitutional uncertainty. |
| Proposed disposition | MERGE WITH ANOTHER ISSUE |
| Surviving issue | CONST-ISSUE-003 |
| Founder decision | PENDING |

### 6.2 TENSION-002 - Outcome versus Reopened Situation

| Question | Finding |
| --- | --- |
| Does the tension exist? | YES. The Constitution allows Outcome and explicitly leaves same/related/successor identity unresolved when revisited. |
| Actual conflict? | NO. No clause requires incompatible identity outcomes under the same conditions. |
| Constitutional portion | `CONST-ISSUE-002` must clarify what qualifies as Outcome or deliberate disposition. |
| Downstream portion | Ontology and Situation Lifecycle must decide whether reopening resumes the same Situation, relates another, or creates a successor. |
| Proposed disposition | DEFER TO DOWNSTREAM SPECIFICATION for reopening mechanics |
| Owner document | Moon Continuity Ontology v1 and Situation Lifecycle Specification v1 |
| Reason for deferral | Identity relationships and state transitions are explicitly downstream and can be decided after the constitutional Outcome boundary is clear. |
| Required future decision | Define valid reopening identity relations and transition authority without redefining Outcome. |
| Closure condition | Amendment 001 Change B, if accepted, clarifies Outcome; Ontology and Lifecycle then ratify reopening semantics with Acceptance tests. |
| Founder decision | PENDING |

## 7. Founder Decision Packet

### CONST-ISSUE-001

| Field | Decision support |
| --- | --- |
| Issue ID | CONST-ISSUE-001 |
| Decision required | Decide whether Situation needs a constitutional qualification boundary and select the governing threshold. |
| Why Founder authority is required | The choice determines the scope of Moon's root object and what downstream layers may classify as a Situation. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Alternative dispositions | DEFER TO DOWNSTREAM SPECIFICATION; REQUEST CLARIFICATION; REJECT |
| Recommended option | Option A - Continuity-claim threshold |
| Constitutional consequence | Amendment 001 Change A may add one definition clarification and explicit deferral. |
| Downstream consequence | Language, Ontology, Situation Specification, and Acceptance must operationalize the selected boundary. |
| Founder decision | PENDING |
| Founder rationale | PENDING |
| Decision date | PENDING |

### CONST-ISSUE-002

| Field | Decision support |
| --- | --- |
| Issue ID | CONST-ISSUE-002 |
| Decision required | Decide the minimum semantic distinction between intentional disposition and pause, Waiting, or non-attention. |
| Why Founder authority is required | The choice determines the constitutional meaning of Outcome and limits what downstream lifecycle work may infer. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Alternative dispositions | DEFER TO DOWNSTREAM SPECIFICATION; REQUEST CLARIFICATION; MERGE WITH ANOTHER ISSUE; REJECT |
| Recommended option | Option A - Disposition threshold |
| Constitutional consequence | Amendment 001 Change B may add one semantic boundary and lifecycle deferral. |
| Downstream consequence | Ontology, Lifecycle, Primitive Specifications, and Acceptance define transitions, reopening, and cases. |
| Founder decision | PENDING |
| Founder rationale | PENDING |
| Decision date | PENDING |

### CONST-ISSUE-003

| Field | Decision support |
| --- | --- |
| Issue ID | CONST-ISSUE-003 |
| Decision required | Decide which constitutional authority and precedence apply when identity or preservation meets an explicit continuity boundary, and choose how much permission separation the Constitution must state. |
| Why Founder authority is required | This is a trust philosophy and constitutional authority decision affecting consent, dignity, retention, recall, and truthful continuity claims. Codex cannot select it. |
| Proposed disposition | ACCEPT FOR AMENDMENT |
| Alternative dispositions | REQUEST CLARIFICATION; DEFER TO DOWNSTREAM SPECIFICATION; MERGE WITH ANOTHER ISSUE; REJECT |
| Recommended option | Option A - Authorization-bounded continuity |
| Constitutional consequence | Amendment 001 Change C may add one precedence clause and explicit operational deferral. |
| Downstream consequence | Invariants, Lifecycle, Acceptance, and Architecture distinguish permissions and implement the selected rule. |
| Founder decision | PENDING |
| Founder rationale | PENDING |
| Decision date | PENDING |

## 8. Founder Decision Summary

| Issue ID | Proposed disposition | Recommended option | Founder decision | Target amendment | Downstream owner | Status after decision |
| --- | --- | --- | --- | --- | --- | --- |
| CONST-ISSUE-001 | ACCEPT FOR AMENDMENT | Option A - Continuity-claim threshold | PENDING | Amendment 001, Change A | Language; Ontology; Situation Specification; Acceptance | ACCEPTED if approved; otherwise selected Founder disposition |
| CONST-ISSUE-002 | ACCEPT FOR AMENDMENT | Option A - Disposition threshold | PENDING | Amendment 001, Change B | Ontology; Lifecycle; Waiting/Outcome Specifications; Acceptance | ACCEPTED if approved; otherwise selected Founder disposition |
| CONST-ISSUE-003 | ACCEPT FOR AMENDMENT | Option A - Authorization-bounded continuity | PENDING | Amendment 001, Change C | Invariants; Lifecycle; Acceptance; Architecture | ACCEPTED if approved; otherwise selected Founder disposition |

## 9. Next-Step Logic

- If the Founder selects `ACCEPT FOR AMENDMENT` for one or more issues, the next task is **Moon Constitution Amendment 001 v1**, limited to the accepted issues and selected options.
- If all issues are `REJECT`, the next task is **Moon Constitution Ratification Review v2**.
- If an issue is `DEFER TO DOWNSTREAM SPECIFICATION`, the Issue Register must later record its disposition, owner layer, reason, target document, and closure condition. Ratification may proceed only when no unresolved constitutional blocker remains.
- If any issue receives `REQUEST CLARIFICATION`, the next task is **Moon Constitution Issue Clarification v1**. Amendment work must not begin automatically.
- If issues are merged, the surviving issue must preserve both source traces and the Founder must disposition that surviving issue.

Because all Founder decisions are currently `PENDING`, the immediate recommended next task is **Moon Constitution Founder Issue Disposition v1**.

## 10. Scope Confirmation

This triage does not edit the Constitution, independent review, or Issue Register. It does not create Amendment 001, ratify any meaning, close any issue, define schema or implementation, write a downstream specification, introduce a Primitive, or assume Founder intent.

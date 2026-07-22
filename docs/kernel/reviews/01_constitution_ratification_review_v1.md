# Moon Constitution Ratification Review v1

Review posture: Independent constitutional review  
Authoritative input: `docs/kernel/01_continuity_kernel_constitution_v1.md` only  
Review scope: Conceptual sufficiency, consistency, operability, independence, and resistance to feature pressure

## 1. Executive Finding

The Moon Continuity Kernel Constitution v1 establishes a coherent constitutional direction. It defines Continuity as more than storage, retrieval, task management, history, reminders, automation, synchronization, or archiving. It establishes Situation as the root conceptual object, separates Card from Situation, defines Primitive and Invariant distinctly, prevents domain Packs and Surfaces from redefining Kernel meaning, and subjects new Primitive candidates to an explicit evolution test.

The seven current v1 primitives are generally independent at the constitutional level. The Constitution successfully protects Evidence from reduction to Attachment, Waiting from reduction to Status, Promise from reduction to Deadline, Return Point from reduction to History, Next Action from reduction to Return Point, and Outcome from reduction to Waiting. Its domain and Surface independence tests are substantive rather than decorative. Its counterexamples redirect feature and domain requests away from the Kernel with useful consistency.

The document is not yet sufficiently precise for unconditional ratification. Three constitutional boundaries remain open in ways that could produce materially different future models:

1. **Situation qualification:** The definition is so broad that almost any context with possible future relevance can qualify. The Constitution does not give Architect or QA a minimum test for distinguishing a Situation from ambient context, retained information, or a transient concern.
2. **Outcome versus intentional inactivity:** Outcome includes an "intentionally inactive disposition" and later permits deliberate leaving-alone as a possible expression. This can overlap with voluntary Waiting, Attention management, pause, abandonment, and fresh-start boundaries. Different readers can classify the same case differently while each appears faithful to the text.
3. **Identity versus discontinuity rights:** Situation identity is binding, while fresh-start, present-only, light-continuity, no-old-pull, expiry, deletion, and forgetting are recognized but deferred. The Constitution does not state which principle governs when preservation of identity conflicts with a person's choice not to retain or reintroduce the past.

Two further ambiguities should be resolved in Language, Ontology, Lifecycle, or Invariants work, but do not by themselves require a new Primitive:

- the scope and authority of Promise, including self-commitment, multi-party disagreement, and broken Promise;
- the constitutional treatment of inferred classification, conflicting Evidence, and Evidence whose provenance is absent or disputed.

No schema, cardinality, storage, serialization, migration, or implementation architecture is defined. Surface and Today Board references are used as boundary examples rather than as sources of Kernel meaning. The review therefore finds no implementation leakage and no actual Surface leakage.

## 2. Constitutional Clarity Review

### 2.1 Ratings

| Definition | Rating | Independent review |
| --- | --- | --- |
| Continuity | PASS | The positive definition identifies identity, meaning, relevant context, commitments, present condition, and resumability across separation. The following distinctions prevent reduction to a supporting capability. “Relevant” and the minimum sufficiency threshold remain intentionally contextual, but the constitutional direction is clear. |
| Situation | BORDERLINE | The definition establishes the root object and rejects task-, note-, project-, customer-, ticket-, conversation-, file-, and reminder-equivalence. It does not specify the minimum boundary by which a context becomes a Situation. “Potential to require future understanding” can include nearly any retained thought or object. |
| Primitive | PASS | Irreducibility, domain independence, independent semantics, continuity contribution, and counterexample survival form a strict candidacy test. The definition resists field-driven and feature-driven expansion. |
| Invariant | PASS | The document clearly distinguishes a kind of meaning from a rule that must remain true about meaning. Cross-domain, cross-Surface, cross-Pack, and cross-implementation scope is explicit. |
| Kernel | PASS | The Kernel is defined as domain-independent Continuity meaning and the rules protecting it. The definition does not depend on a technical runtime or packaging arrangement. |
| Pack | PASS | A Pack is clearly a domain expression that may translate terminology and guidance but may not alter Primitive semantics. The one-Kernel rule prevents domain fragmentation. |
| Surface | PASS | A Surface is an interaction expression for capture, view, retrieval, Attention, Resume, or conclusion. The document consistently denies Surface ownership of constitutional meaning. |

### 2.2 Clarity Strengths

- Definitions are followed by exclusions and failure modes, making them usable for review rather than merely descriptive.
- Primitive and Invariant are not conflated. This is essential for later Ontology and QA work.
- The document says when it is illustrative and when it is binding.
- The Constitution repeatedly rejects implementation defaults as constitutional authority.
- Current v1 status is explicit; the set of seven is neither casually expandable nor declared eternally complete.

### 2.3 Clarity Weaknesses

**Situation has no lower boundary.** The Constitution explains what a Situation can be and what it is not necessarily equivalent to, but it does not establish a minimum constitutional qualification. A bookmark, a remembered colour, an unfinished sentence, and a complex multi-party commitment can all be described as contexts with potential future understanding. The later Ontology can decide identity and relationships, but the Constitution should still state what continuity claim makes a context eligible to be treated as a Situation rather than merely as Evidence, metadata, or ambient information.

**Continuity has no explicit discontinuity priority.** The trust section recognizes fresh starts and no-old-pull, but the primary Continuity definition could be read as preferring preservation whenever future return is possible. A constitutional rule is needed to say that chosen discontinuity can legitimately limit preservation, retrieval, or reintroduction without being treated as Continuity failure.

**Outcome’s inactive boundary is unstable.** “Concluded or intentionally inactive” is broader than conclusion. The text later treats pausing and leaving alone as legitimate choices, and it identifies Attention as non-coercive. Without a sharper boundary, an intentionally ignored Situation can be classified as Outcome, Attention state, voluntary Waiting, or an exercise of discontinuity rights.

## 3. Primitive Independence Test

| Challenge | Rating | Review |
| --- | --- | --- |
| Could Situation simply be Task, Note, Project, Card, Ticket, or Conversation? | PASS | The Constitution correctly treats these as actions, expressions, groupings, representations, operational views, or Evidence-bearing interactions. None carries the full continuity identity of a Situation. |
| Could Evidence simply be Attachment? | PASS | Attachment is a storage or interaction relationship. Evidence is defined by its role in restoring understanding. The Constitution also protects against treating retained material as true merely because it exists. |
| Could Waiting simply be Status? | PASS | Waiting carries the specific meaning of obstruction or dependency. Status summarizes condition and may label a Waiting expression without containing its reason. The distinction is objective enough for QA. |
| Could Promise simply be Deadline? | PASS | Promise is commitment; Deadline is time metadata or a constraint. The Constitution explicitly permits Promise without Deadline and Deadline without Promise. |
| Could Return Point simply be History or recent activity? | PASS | Return Point is selected for resumption value. History and recency can support selection but do not establish it. |
| Could Next Action simply be Return Point? | PASS | Return Point restores orientation; Next Action expresses movement. The Constitution includes both counter-directions: a Return Point with no available action, and an action without sufficient resumption context. |
| Could Outcome simply be Status? | PASS WITH BOUNDARY RISK | Outcome has independent conclusion or disposition meaning. Status can label it but cannot replace it. The risk lies not in Status reduction but in the breadth of “intentionally inactive.” |
| Could Outcome simply be Waiting? | PASS | Waiting preserves possible continuation under obstruction; Outcome expresses conclusion or deliberate disposition. Reopening and deliberate inactivity still need sharper treatment. |
| Could Promise be Evidence? | PASS | A message may be Evidence that a Promise was made, but the commitment and the material supporting its understanding are different meanings. The Constitution's non-inference rule protects this distinction. |
| Could Next Action be Promise? | PASS | An intended act is not necessarily a commitment. A committed act can be both represented by a Next Action and related to a Promise, but one does not faithfully replace the other. |

### 3.1 Independence Finding

Primitive independence is **PASS** at the constitutional level. The unresolved issues concern boundaries and lifecycle, not evidence that the seven should collapse into fewer concepts. No review case justifies adding an eighth Primitive.

## 4. Invariant Consistency Review

### 4.1 Actual Conflicts

No direct logical contradiction was found among the stated Invariants. No rule requires both a proposition and its negation under the same conditions.

### 4.2 Possible Conflicts Requiring Resolution

| Tension | Classification | Review |
| --- | --- | --- |
| Preservation fidelity versus correct classification | Possible conflict | Preservation requires human input to remain faithful, while Continuity requires meaning to remain correctly classified. The text makes classification explicit, justified, and correctable, which prevents direct contradiction. It does not state what happens when classification is required for a Surface but the person has not confirmed it. |
| Fresh start versus Situation identity | Major possible conflict | Situation identity is binding across representation and time. Fresh-start, present-only, light-continuity, no-old-pull, forgetting, and expiry are legitimate but deferred. Identity could be interpreted as requiring retention or reintroduction that trust boundaries would prohibit. Constitutional precedence is missing. |
| Outcome versus reopened Situation | Major possible conflict | Outcome is conclusion or intentional disposition. The Constitution explicitly defers whether a revisited Outcome resumes the same Situation, relates another Situation, or creates a successor. This is an honest deferral, but it blocks objective lifecycle tests until resolved. |
| Evidence versus inference | Possible conflict | Evidence supports understanding, while inference is not human confirmation and one Primitive must not be inferred from another without explicit logic. It remains unclear whether inferred material can be Evidence, a derived view, or merely an unclassified suggestion. |
| Promise versus conflicting human accounts | Possible conflict | Commitment is independent, but the Constitution does not establish whose account governs when parties disagree. Provenance humility helps, but ownership and authority remain deferred. |

### 4.3 False Alarms

| Apparent conflict | Finding | Reason |
| --- | --- | --- |
| Human Agency versus Automation | False alarm | Automation may assist but may not own meaning, priority, or disposition. The rule permits assistance while preserving human authority. |
| Retrieval versus Truth | False alarm | Retrieval reveals an expression but does not define truth. No rule requires retrieval to establish correctness. |
| Evidence versus Situation | False alarm | Evidence supports understanding and does not replace Situation identity. The roles are complementary. |
| Attention versus Resume | False alarm | Attention governs present awareness; Resume governs return orientation. Visibility does not require action. |
| Outcome versus honest non-completion | False alarm | The Constitution explicitly permits conclusion without conventional completion. The remaining issue is the inactive boundary, not non-completion itself. |

## 5. Six-Domain Independence Test

The definitions were tested after removing local nouns and workflow assumptions.

| Domain | Situation test | Primitive test | Result |
| --- | --- | --- | --- |
| Freelancer | An unresolved client direction remains a context requiring future understanding or continuation. | Feedback can be Waiting; annotated work can be Evidence; an agreed revision can be Promise; a precise restart location can be Return Point. | PASS |
| Seller | An order with uncertain payment remains independently understandable as a Situation. | Confirmation can be Waiting; receipt can be Evidence; reservation can be Promise; fulfillment or refund can be Outcome. | PASS |
| Research | An unresolved interpretation remains a Situation without becoming a task or project. | Citation can be Evidence; source access can be Waiting; disputed claim can be Return Point; reviewing the source can be Next Action. | PASS |
| Healthcare | A follow-up context can require return without Moon becoming a healthcare system. | Result can be Evidence; pending result can be Waiting; follow-up commitment can be Promise; transfer or conclusion can contribute to Outcome. | PASS WITH TRUST CAUTION |
| Factory | A production interruption remains a Situation independent of equipment-management vocabulary. | Inspection image can be Evidence; material shortage can be Waiting; inspection commitment can be Promise; component check can be Next Action. | PASS |
| Creative Studio | A paused concept direction remains a Situation independent of project structure. | Moodboard can be Evidence; approval can express Waiting; comparison can be Next Action; selected or abandoned direction can express Outcome. | PASS |

The healthcare example requires domain governance, consent, and safety beyond the Kernel, which the Constitution acknowledges through non-goals and Pack boundaries. This is not a failure of domain independence. No major definition works only in one reviewed domain.

## 6. Surface Independence Test

| Replacement Surface | Does constitutional meaning change? | Review |
| --- | --- | --- |
| Telegram | No | Messages can express Evidence, Promise, or ordinary text. Telegram remains an Integration and/or Surface; message form does not determine classification. |
| Voice | No | Spoken capture can express any relevant human meaning. Audio format does not make the material Evidence automatically and does not redefine Situation. |
| Desktop | No | Wider presentation may reveal more context or support editing. Display capacity does not alter Primitive semantics. |
| Timeline | No | Chronology can render Evidence or activity. The Constitution prevents timeline recency from becoming Return Point automatically. |
| Today Board | No | Cards and attention zones simplify interaction. The Constitution explicitly denies them lifecycle or Kernel authority. |

No actual Surface leakage was found. The Constitution mentions possible Surface affordances, such as voice capture and timelines, only illustratively. The Today Board question in the architectural checklist is an anti-leak test: it asks whether the Kernel can avoid becoming card-shaped. It does not grant Today Board authority.

## 7. Feature Pressure Test

| Candidate request | Constitutional redirection | Feature-pressure finding |
| --- | --- | --- |
| Tracking Number | Evidence expression, Integration, or Metadata | Clear. It should not become a Primitive or automatically require a Kernel concept. |
| Priority | Metadata, derived view, or operational policy | Clear. It orders Attention or action without defining Situation meaning. |
| Reminder | Surface Feature and possible Attention expression | Clear. It does not equal Continuity and should not create a Primitive. |
| Customer | Pack concept or Situation relationship | Clear at constitutional level; relationship details remain Ontology work. |
| Assignment | Pack concept, possible Promise expression, or Situation relationship | Mostly clear. Architect must avoid inferring Promise merely from assignment. |
| Approval | Depending on context, Waiting, Promise, Outcome expression, or Pack concept | Clear enough to prevent a dedicated Primitive, but classification requires explicit human context. |
| Calendar Event | Integration, Metadata, possible Evidence, or Promise qualifier | Clear. Time does not create Promise automatically. |
| Notification | Surface Feature or Integration | Clear. Trust rules also prevent coercive engagement logic. |
| Activity Log | Evidence expression, derived view, or Surface Feature | Clear. It cannot become Return Point merely through recency. |
| Version History | Evidence expression, provenance support, or derived view | Clear by extension of Activity Log and Return Point rules, although not named directly in the Constitution. |
| Comment | Evidence expression, Surface Feature, Promise expression, or ordinary text | Clear. Form does not determine classification. |
| Moodboard | Evidence expression, Template, or Surface Feature | Clear. Its creative-domain form stays outside the Kernel. |
| Citation | Evidence expression and provenance support | Clear. It does not become an independent Primitive. |
| Deadline | Metadata or Promise qualifier | Clear. The Promise distinction prevents field-driven conflation. |
| Status | Metadata, derived view, Pack concept, or Surface concept | Clear. Waiting and Outcome cannot be reduced to it. |

The Constitution redirects feature pressure effectively. An Architect could still create fields in a Surface or representation, but the document does not imply that each candidate requires a Kernel field. The strongest protection is the requirement to identify lost continuity meaning before admitting a Primitive.

## 8. Operational Case Review

| Difficult situation | Finding | Constitutional reading |
| --- | --- | --- |
| “Wait until Friday.” | AMBIGUOUS | It may be voluntary Waiting, time metadata, an operational policy, or an expression of Attention. The Constitution says Waiting may be internal or decisional but does not give a threshold for voluntary deferral. |
| “Call customer Friday.” | ANSWERS | It can express a Next Action qualified by time. It is not a Promise unless commitment exists, and the customer remains a Pack concept or relationship. |
| “Waiting for customer.” | ANSWERS | This is Waiting when the customer's response is an obstruction or dependency preventing continuation. |
| Waiting by personal choice | AMBIGUOUS | Internal or decisional Waiting permits this reading, but voluntary pause may also be Attention management or chosen discontinuity. |
| Evidence without provenance | ANSWERS WITH LIMIT | It can still help understanding and therefore be Evidence. Provenance humility requires uncertainty; absence of provenance prevents implied authority, not Evidence status. |
| Conflicting Evidence | DEFERS | The Constitution prevents retrieval from defining truth and prevents silent reinterpretation, but conflict handling, confidence, and authority are intentionally deferred. |
| Situation intentionally abandoned | ANSWERS WITH BOUNDARY RISK | Abandonment may express Outcome. The boundary between abandonment, leave-alone Attention, and fresh-start choice requires amendment. |
| Situation completed then reopened | DEFERS | The Constitution explicitly asks whether this is the same, related, or successor Situation. This properly belongs to Ontology and Lifecycle, but acceptance tests cannot yet choose one. |
| Promise broken | AMBIGUOUS | The original commitment remains conceptually distinguishable from performance, but the Constitution does not state whether breach changes Promise meaning, creates Evidence, or contributes to Outcome. |
| Two Return Points | DEFERS | Cardinality is explicitly deferred. The Constitution does not imply exactly one Return Point. |
| No Next Action | ANSWERS PARTLY | A Situation can exist without a task and can be Waiting despite having a Return Point. The Constitution does not require every Situation to have a Next Action. It does not classify every no-action case. |
| Outcome without completion | ANSWERS | Cancellation, abandonment, reference preservation, and deliberate disposition can express Outcome. Conventional completion is not required. |
| A date appears in a note | ANSWERS | It remains human text or Evidence. It must not become Promise automatically. |
| A card is moved to “Leave Alone” | ANSWERS PARTLY | The Surface action cannot define Kernel truth. Whether it expresses Attention, Outcome, or discontinuity requires later mapping and the inactive boundary amendment. |
| A retrieved item ranks first | ANSWERS | Retrieval rank does not define truth, identity, commitment, or classification. |

The operational result is **BORDERLINE**. Core distinction questions are answerable, but the three amendment-level boundaries produce inconsistent classifications in common cases.

## 9. Ontology Leakage Review

### 9.1 Findings

No finalized Ontology leakage was found.

- The Constitution does not define required or optional Primitive instances.
- It does not define singularity, plurality, ordering, containment, or ownership.
- It does not define canonical relationships among Primitives.
- It does not define whether reopened Situations retain identity.
- It does not define lifecycle transitions or transition authority.
- It explicitly labels illustrative statements as non-cardinality and non-schema explanations.

### 9.2 Wording That Requires Care in Later Work

- Statements that a project can relate several Situations or a customer can participate in several Situations are examples of non-equivalence, not accepted relationship types or cardinality.
- “There is one Continuity Kernel” is a constitutional coherence rule, not a deployment or ownership architecture.
- Situation identity is an Invariant, but the means and threshold of identity are explicitly unresolved.
- Waiting preserving possible continuation and Outcome expressing conclusion establishes semantic distinction; it does not define a transition graph.

These are not leaks because the document repeatedly and explicitly defers structural interpretation.

## 10. Implementation Leakage Review

| Pressure category | Occurrence | Finding |
| --- | --- | --- |
| Database thinking | “Universal database” appears as a non-goal. | No leakage. |
| Field thinking | Field is defined as a Surface representation and rejected as Primitive evidence. Today Board fields are denied Kernel authority. | No leakage. |
| Schema thinking | “Meaning before Schema” states subordination; no representation is proposed. | No leakage. |
| TypeScript thinking | None. | No leakage. |
| UI thinking | Card, controls, voice, timeline, and board appear as Surface examples and anti-leak tests. | No leakage. |
| Migration thinking | Migration is explicitly outside the constitutional result and Today Board mapping is deferred. | No leakage. |
| Local-storage thinking | Today Board's local storage is mentioned only to deny canonical persistence authority. | No leakage. |
| PWA thinking | None. | No leakage. |
| Today Board assumptions | Four attention zones and Card fields are explicitly denied universal lifecycle or Kernel status. | No leakage. |
| Serialization or API thinking | None. | No leakage. |

Implementation leakage detected: **no**.

## 11. Trust Boundary Review

| Boundary | Rating | Review |
| --- | --- | --- |
| Fresh start | BORDERLINE | Legitimacy is explicit, but constitutional precedence over identity and preservation is not. |
| Present only | BORDERLINE | Recognized as a dignity boundary; operational and conceptual consequences are deferred. |
| Light continuity | BORDERLINE | Recognized but undefined. Different Surfaces could make incompatible retention choices while claiming compliance. |
| No old pull | BORDERLINE | Legitimate, but no rule states when old Situations must not return to Attention or retrieval. |
| Human agency | PASS | Automation and Surface behavior are subordinate to human ownership of meaning and disposition. |
| Consent | PASS WITH SPECIFICATION NEED | Consent is a binding value, though provenance, authorship, correction, and representation are deferred. |
| Dignity | PASS | Non-coercion, legitimate ignoring, and no engagement exploitation are clear. |
| Local truth | PASS | Local retention and incomplete Evidence must not be represented as durable or verified certainty. |
| Preservation | PASS WITH TENSION | Preservation is faithful and reversible where practical, but needs a priority rule when a person chooses discontinuity. |

The trust principles are directionally consistent. The principal conflict is not between two explicit commands; it is the absence of a precedence rule when Continuity preservation and chosen discontinuity point in opposite directions. Trust boundary consistency is therefore **BORDERLINE** until amended.

## 12. Architect Comprehension Test

| Concept | Likely Layer | Related Primitive | Kernel Candidate | Reasoning | Potential Invariant Risk |
| --- | --- | --- | --- | --- | --- |
| Tracking Number | Integration / Metadata | Evidence | No | Identifies external shipment information; domain-dependent. | Treating external state as verified truth. |
| Reminder | Surface Feature | Attention | No | Brings something forward but does not preserve context. | Coercive return or false urgency. |
| Deadline | Metadata / Pack | Promise qualifier / Next Action qualifier | No | Time does not establish commitment. | Reducing Promise to time. |
| Meeting | Pack / Integration / Situation relationship | Evidence / Promise / Next Action | No | Event form can express several meanings depending on context. | Inferring commitment from attendance. |
| Shipment | Pack concept / possible Situation | Situation / Evidence / Waiting / Outcome | No as Primitive | Commerce noun may identify a Situation or participate in one. | Creating a logistics-specific Kernel. |
| Invoice | Evidence / Pack / Integration | Evidence / Promise | No | Document can support understanding or record an obligation. | Treating document existence as commitment truth. |
| Customer | Pack / Situation relationship | Situation / Promise | No | Domain participant, not continuity meaning. | Defining Situation around CRM entities. |
| Moodboard | Evidence / Template / Surface | Evidence | No | Creative context carrier whose form is domain-specific. | Equating attachment form with Evidence meaning. |
| Citation | Evidence / Provenance | Evidence | No | Supports source understanding and origin. | Treating provenance as correctness. |
| Lab Result | Evidence / Integration | Evidence / Waiting | No | Result may support understanding or resolve Waiting. | Treating retrieval as clinical interpretation. |
| Approval | Pack / relationship / expression | Waiting / Promise / Outcome | No | Meaning changes depending on whether approval is awaited, committed, or granted. | Silent classification from a workflow label. |
| Priority | Metadata / Derived View / Policy | Attention / Next Action | No | Orders attention or action under contextual policy. | Turning priority into Situation truth. |
| Estimate | Evidence / Metadata / Pack | Evidence / Promise | No | May inform understanding; becomes Promise only through commitment. | Inferring Promise from a number. |
| Attachment | Surface relationship | Evidence | No | Storage relationship does not establish evidential role. | Counting retention as understanding. |
| Voice Recording | Surface expression | Evidence / Promise / Return Point | No | Medium can carry several meanings. | Classifying by media type. |
| Calendar Event | Integration / Metadata | Evidence / Promise / Next Action | No | Time-bound external representation; meaning depends on context. | Inferring commitment or urgency. |
| Checklist | Template / Surface Feature | Next Action / Evidence | No | Arranges acts or records checks without creating Primitive meaning. | Turning workflow order into lifecycle truth. |
| Relationship | Ontology candidate / Pack | Situation / Promise | Not enough evidence | May be structurally important but its continuity role and independence are unresolved. | Premature cardinality or ownership. |
| Conversation | Surface / Integration / Evidence expression | Evidence / Promise | No | Interaction can carry several Primitive expressions. | Treating all messages as Evidence or Promise. |
| Bookmark | Surface Feature / Evidence expression | Evidence / Return Point | No | Saved reference may aid understanding or resumption. | Treating saved location as meaningful Return Point automatically. |
| Version History | Derived View / Surface Feature | Evidence / Provenance / Return Point | No | Chronology supports review but does not define resumption. | Reducing Return Point to recency. |
| Comment | Surface expression | Evidence / Promise | No | Human text requires explicit contextual classification. | Silent transformation of prose. |
| Assignment | Pack / Situation relationship | Promise / Next Action | No | Responsibility and commitment may be related but are not identical. | Inferring Promise without human commitment. |
| Notification | Surface Feature / Integration | Attention | No | Delivery mechanism does not create continuity meaning. | Engagement pressure and surveillance. |
| Status | Metadata / Derived View / Pack / Surface | Waiting / Outcome | No | Summary label cannot replace obstruction or conclusion meaning. | Collapsing distinct Primitives. |

The Constitution supports correct high-level classification for these concepts. Architect comprehension is **PASS**, with caution around Relationship, voluntary Waiting, and Outcome boundaries that the Constitution itself defers or leaves ambiguous.

## 13. QA Operability Review

### 13.1 Objective Tests Available Now

| Constitutional distinction | QA test | Expected result |
| --- | --- | --- |
| Waiting versus Status | Present a label such as “open” with no obstruction, then a case blocked by customer response. | Only the second has sufficient constitutional meaning to be Waiting. |
| Promise versus Deadline | Present a date with no commitment, then an explicit commitment with no date. | The first is not Promise by time alone; the second can be Promise. |
| Outcome versus Waiting | Present a material dependency and a deliberate cancellation. | Dependency is Waiting; cancellation can express Outcome. |
| Situation versus Card | Render the same continuity context through Card and Voice. | Situation identity and Primitive meanings remain stable across Surfaces. |
| Evidence versus Attachment | Present an attached file unrelated to understanding and a quoted observation that restores context. | Attachment alone is not Evidence; understanding role determines Evidence. |
| Return Point versus History | Present the latest event and an earlier meaningful restart point. | Recency alone cannot select the Return Point. |
| Next Action versus Return Point | Present restart context with no available action and an action with no context. | Neither Primitive substitutes for the other. |
| Pack versus Kernel | Rename Promise using two domain terms. | Domain terminology may change while commitment semantics remain constant. |
| Retrieval versus Truth | Rank an incomplete or conflicting item first. | Visibility and rank do not make it true. |
| Preservation versus Classification | Retain text containing a date. | Text remains preserved; Promise classification is not silently added. |

### 13.2 Tests Not Yet Objective

| Area | Why QA cannot yet decide consistently |
| --- | --- |
| Situation qualification | No minimum threshold separates a Situation from ambient context or retained information. |
| Voluntary Waiting | Pause, personal choice, Attention, and Waiting can overlap. |
| Intentionally inactive Outcome | Leave-alone, abandonment, pause, and discontinuity have no complete boundary. |
| Fresh start versus identity | No precedence rule governs deliberate forgetting or no-old-pull. |
| Reopened Outcome | Same, related, and successor Situation are all explicitly possible. |
| Broken Promise | The Constitution defines commitment but not the constitutional effect of breach. |
| Conflicting Evidence | Truth, authority, confidence, and resolution policy are deferred. |

Moon QA can derive strong tests for the central Primitive distinctions and layer boundaries. QA operability is **BORDERLINE** overall because common trust and disposition cases remain non-deterministic.

## 14. Required Constitutional Amendments

The following amendments are required before unconditional ratification. They should clarify constitutional boundaries without defining schema, cardinality, or technical behavior.

### Amendment 1: Situation Qualification Boundary

State the minimum continuity claim required for a context to qualify as a Situation. The amendment should allow broad domain independence while preventing every retained object, thought, or possible future reference from becoming a Situation by default. It should clarify how ordinary Evidence or ambient context differs from the context whose identity Continuity protects.

### Amendment 2: Outcome, Attention, Waiting, and Chosen Discontinuity Boundary

Clarify what “intentionally inactive disposition” means constitutionally. State how deliberate leaving-alone, voluntary pause, abandonment, Waiting by choice, and Outcome differ at the level of meaning. Do not define lifecycle transitions or categories; establish only the distinctions needed to prevent contradictory classification.

### Amendment 3: Trust Precedence for Fresh Start and No-Old-Pull

State that a person's legitimate choice for fresh start, present-only use, light continuity, forgetting, or no-old-pull can limit preservation, retrieval, and reintroduction without being treated as a failure of Situation identity. Clarify that identity fidelity applies within the continuity the person has authorized, not as an unconditional retention mandate.

The following are required resolutions in subsequent Phase 0 documents rather than constitutional amendments unless those documents reveal a constitutional contradiction:

- Promise scope, parties, self-commitment, disagreement, and breach;
- inferred classification and human confirmation boundaries;
- Evidence conflict, confidence, provenance absence, and authority;
- Return Point cardinality;
- reopened Situation identity and lifecycle semantics.

## 15. Founder Recommendation

**ACCEPT WITH AMENDMENTS**

The Constitution is conceptually strong, domain-independent, Surface-independent, resistant to feature pressure, and free of implementation or Ontology leakage. It can govern most immediate Language and counterexample work. It should not be ratified unchanged because Situation qualification, intentionally inactive Outcome, and the precedence of chosen discontinuity remain open in ways that would allow materially inconsistent models and QA verdicts. Ratification should follow a focused constitutional amendment addressing those three boundaries; no rewrite of the constitutional model is required.

# Moon Continuity Kernel Constitution v1

Status: Constitutional working model  
Scope: Phase 0 - Meaning and Model  
Version posture: Current v1 hypothesis, subject to explicit evolution

## 1. Preamble

Moon needs a stable thinking contract before it needs a technical architecture. Without such a contract, product decisions, domain language, interface constraints, and implementation habits can quietly become the model. The result would be a collection of useful but unrelated modules whose shared purpose exists only in conversation history. This Constitution exists to prevent that outcome.

The Constitution states what Moon means by Continuity, Situation, Primitive, Invariant, Kernel, Pack, Surface, Template, Integration, and Feature. It establishes the distinctions that Moon Founder, Moon Architect, Moon QA, Pack designers, and Surface implementers must preserve. It also sets boundaries for conceptual evolution so that Moon can become more expressive without becoming conceptually larger merely because a new use case, screen, or industry vocabulary appears.

This document governs conceptual decisions. It does not prescribe runtime mechanics, persistence technology, interface composition, data structures, or delivery plans. Those questions belong to later phases. Examples in this document test meaning; they do not establish schemas or product requirements.

Implementation may evolve frequently. Constitutional meaning changes only deliberately. A change in implementation is not automatically a change in Moon's conceptual world. Conversely, a new interface or integration must not redefine constitutional meaning merely because it is convenient to do so. When implementation and constitutional meaning conflict, the conflict must be made explicit rather than allowing implementation to become the model by default.

This Constitution is not final forever. It is the current constitutional working model for Moon Continuity Kernel v1. It is intended to be tested through later modelling, counterexamples, field validation, and explicit amendments. Its authority comes from clarity and disciplined use, not from a claim of universal or mathematical completeness.

## 2. Moon Thesis

Moon exists to support the continuity of Situations.

Moon does not begin with tasks, projects, notes, industries, workflows, or features. Each of those can be useful, and Moon may interoperate with them, but none is the constitutional starting point. Moon begins with the human problem of encountering something meaningful, leaving it for a time, and later needing to understand, continue, resume, attend to, honour, or conclude it without reconstructing its context from zero.

A person may leave a Situation because attention moved elsewhere, another person has not responded, material is unavailable, uncertainty remains, the right moment has not arrived, or the Situation has simply become too costly to hold in active memory. The loss that follows is not only forgotten information. It may include forgotten significance, unclear commitments, missing evidence, uncertainty about what is blocking movement, and no trustworthy place from which to resume.

Moon protects against that loss by supporting continuity. Continuity includes preserving enough meaning to understand again, maintaining the identity of what is being returned to, keeping relevant Evidence and commitments distinguishable, expressing present Attention without coercion, supporting a meaningful Return Point, and allowing an honest Outcome.

Moon therefore does not primarily manage tasks. A task can express a Next Action, but a Situation can exist with no task. Moon does not primarily manage projects. A project can relate several Situations, but project structure does not define their meaning. Moon does not primarily store notes. Notes can carry Evidence or explanation, but retained text alone does not create continuity.

Productivity may result when continuity reduces reconstruction cost, but productivity is not Moon's constitutional starting point. Moon must not treat faster output, more activity, or repeated engagement as proof that continuity has improved. The constitutional question is whether a person can preserve, understand, resume, continue, or conclude a Situation with less needless rebuilding and without losing agency.

## 3. Definition of Continuity

**Continuity is the preservation and support of a Situation's identity, meaning, relevant context, commitments, present condition, and resumability across separation in time, attention, place, surface, or domain.**

Continuity is positive, not merely the absence of data loss. A Situation has continuity when a person can return and recognize what it is, understand why it matters, distinguish what is known from what is blocking movement, identify commitments that still matter, find a meaningful place to resume, and understand whether it remains open or has reached an Outcome. Not every Situation needs every form of support, but continuity concerns this coherent capacity rather than a single stored record.

Continuity may span several activities:

- **Capture** gives a Situation or its supporting context an initial expression.
- **Preservation** keeps human-provided meaning available without silently changing what kind of meaning it is.
- **Retrieval** helps a person find the Situation again.
- **Attention** expresses how or whether the Situation should occupy present awareness.
- **Resume** enables return from a meaningful point rather than from an undifferentiated history.
- **Outcome** supports an honest concluded or intentionally inactive disposition.

These activities support Continuity, but none individually equals it.

Continuity is not memory storage. Storage can retain content while losing the distinction between Evidence, commitment, obstruction, and conclusion. Continuity requires retained meaning to remain usable and correctly classified.

Continuity is not search. Search can reveal a record, but finding a record does not establish that the record expresses the right Situation, preserves its commitments, or offers a useful place to resume.

Continuity is not task management. Tasks describe acts to perform. A Situation may need understanding, waiting, preservation, or conclusion even when no action is presently available.

Continuity is not activity history. A complete sequence of events may still leave a person unsure where to resume. History records what happened; continuity supports what must remain understandable across time.

Continuity is not reminders. A reminder can bring something to attention without restoring context, clarifying a commitment, or respecting whether the person wants to return.

Continuity is not workflow automation. Automation can move information or trigger actions, but continuity remains concerned with human meaning and ownership. Movement through a process does not prove that a Situation remains understood.

Continuity is not knowledge management. Knowledge may be broadly reusable and independent of a particular Situation. Continuity concerns the persistence of meaning around something that may need to be returned to, including local, incomplete, relational, and time-sensitive context.

Continuity is not synchronization. Synchronization can make representations consistent across devices or systems. It does not determine whether those representations preserve the right meaning.

Continuity is not archiving. Archiving may preserve something after active use. Continuity includes active, paused, waiting, resumed, and concluded conditions, and it must not assume that preservation means permanent inactive storage.

**Provenance** supports Continuity by helping a person understand where retained material came from, who or what expressed it, and under what context. Provenance does not automatically make material true, nor does it transform an expression into a different Primitive. **Preservation** means keeping an expression and its meaning available as faithfully and reversibly as practical. **Resume** means recovering sufficient understanding and orientation to continue from a meaningful point. **Attention** means the relationship between a Situation and present awareness; it is not a demand for action.

## 4. Definition of Situation

**A Situation is a context with the potential to require future understanding, continuation, resumption, attention, commitment, or conclusion.**

Situation is Moon's root conceptual object because continuity must be continuity *of something*. That something cannot be defined by the interface that renders it or the industry term that currently names it. A Situation gives conceptual identity to what a person may need to recognize and return to across a separation.

A Situation can be brief or long-lived, individual or relational, concrete or exploratory. It can involve action, but it does not need to begin as an action. It can contain uncertainty without yet being Waiting. It can carry a commitment without being reducible to a Promise. It can end without having been completed in a conventional productivity sense.

A Situation is not necessarily a task. A task usually expresses an act, while a Situation may be blocked, exploratory, relational, or awaiting interpretation. A Situation is not necessarily a note. A note is an expression; a Situation is the context that may need continuity. A Situation is not necessarily a project. A project can group work, while a Situation can cross project boundaries or exist without formal organization.

A Situation is also not necessarily a customer, ticket, conversation, file, or reminder. A customer may participate in several Situations. A ticket may represent one operational view of a Situation. A conversation may provide Evidence or commitments. A file may preserve Evidence. A reminder may draw Attention. None of these substitutes automatically for the Situation itself.

Situation is domain-independent because its definition survives the removal of domain vocabulary. A freelancer may need to return to an unresolved client direction. A seller may need to return to an order whose payment is uncertain. A researcher may need to return to an unresolved interpretation. A healthcare worker may need to return to a patient's follow-up context. A factory operator may need to return to a production interruption. A local service provider may need to return to a repair whose next safe step depends on a part or decision. Each domain names different objects and obligations, but the invariant concern is a context that may need to be understood, continued, resumed, attended to, committed to, or concluded.

The root status of Situation does not settle later modelling questions about identity, relationships, containment, duration, or cardinality. Those belong to the Ontology, Canonical Model, and Lifecycle phases. Constitutionally, it establishes only that Moon's continuity meaning is organized around Situations rather than around screens, records, industries, or activity units.

## 5. Card Is a Surface, Not the Core Object

A Card is a user-interface representation. A Situation is the conceptual object.

Today Board Card is one Situation Surface: a compact way to capture, view, retrieve, and return to some continuity meaning. Its usefulness does not make its shape constitutional. A card layout has practical limitations concerning space, ordering, interaction, visibility, and media. The Kernel must never be structurally defined by those limitations.

A Situation may later be expressed through a voice interaction, Telegram surface, desktop surface, timeline, team-oriented view, or another form not yet imagined. These expressions may emphasize different aspects of continuity. A voice surface may make Return Points easier to capture. A timeline may make Evidence provenance easier to inspect. A compact board may make Attention easier to scan. None becomes the Situation itself.

This distinction protects both Moon and Today Board. Moon remains able to express Continuity beyond cards, while Today Board remains free to simplify the model for its context. A Surface may omit, combine, summarize, or sequence constitutional meaning when that simplification is honest. It may not redefine a Primitive merely because the interface needs a convenient label or field.

No code naming, migration, or interface change follows from this constitutional statement. It establishes conceptual separation only.

## 6. Definition of a Continuity Primitive

**A Continuity Primitive is a domain-independent concept that carries irreducible meaning required to understand, preserve, continue, resume, or conclude a Situation.**

"Irreducible" does not mean that a Primitive can never be described in smaller words. It means that representing it as another existing Primitive would cause persistent loss, ambiguity, or misclassification of continuity meaning. A Primitive remains meaningful after industry names, interface labels, and implementation choices are removed.

A Primitive must:

- carry independent continuity meaning;
- remain useful across multiple unrelated domains or continuity contexts;
- possess semantics that are not supplied merely by a screen, workflow, or template;
- contribute directly to understanding, preservation, continuation, resumption, or conclusion;
- remain distinguishable from labels, status values, controls, and storage forms;
- have a meaningful continuity role that can be examined independently;
- survive counterexamples that attempt to reduce it to an existing Primitive.

A Primitive is not automatically any concept that appears frequently. Frequency can reveal a common feature without establishing independent meaning. A Primitive is also not whatever needs a dedicated label in an interface. Interface convenience is evidence about usability, not proof about ontology.

### 6.1 Primitive and Adjacent Concepts

| Concept | Constitutional meaning | Why it is not automatically a Primitive |
| --- | --- | --- |
| Primitive | Irreducible, domain-independent continuity meaning | It is admitted only through the evolution rules in this Constitution. |
| Feature | A capability that helps a person interact with Moon | Search, export, or recording can support primitives without becoming conceptual entities. |
| Field | A bounded place where a Surface accepts or displays an expression | A field reflects a representation choice and may combine or split meanings. |
| Workflow step | A prescribed point in an operational sequence | The order may be domain-specific and may change without changing Kernel meaning. |
| Template | A preconfigured expression of existing meaning | A template selects and arranges primitives; it does not establish new ones. |
| Domain term | A concept whose meaning depends on an industry or practice | It belongs in a Pack unless it survives removal of domain language. |
| Integration | A connection to an external system or source | It transports or references expressions; connection alone is not continuity meaning. |
| Surface behavior | A way the interface reveals or changes an expression | Interaction design must serve constitutional meaning rather than define it. |

### 6.2 Primitive Candidacy Test

Before a concept is considered a Primitive, Moon must ask:

1. What continuity meaning is lost if this concept is represented by the current primitives?
2. Does the concept remain meaningful after all domain and interface vocabulary is removed?
3. Does it appear across multiple unrelated domains for the same conceptual reason?
4. Does it have semantics and a continuity role independent of a workflow step or status label?
5. Is the concept more than a convenient field, report, filter, template variation, or automation rule?
6. Can a person confuse it consistently with an existing Primitive, and would that confusion matter?
7. Does admitting it make Moon more coherent, or merely more accommodating to one product idea?
8. Which constitutional invariants would it create, refine, or threaten?
9. Has it survived boundary cases and counterexamples?
10. Is explicit constitutional amendment justified?

Failure to answer these questions is a reason to keep the candidate outside the Kernel while research continues.

## 7. Current v1 Primitive Set

Moon Continuity Kernel v1 currently proposes seven core primitives. They are the current v1 hypothesis, not an eternally fixed or universally proven set. Their internal structure, relationships, cardinality, requiredness, and lifecycle transitions are deferred.

### 7.1 Situation

**Constitutional definition:** The context that may need to be understood, continued, resumed, attended to, committed to, or concluded.

**Fundamental question:** What is happening or may need to be returned to?

**Must not be confused with:** a task, note, card, ticket, customer, conversation, or project. Those may represent, participate in, or relate to a Situation without replacing it.

### 7.2 Evidence

**Constitutional definition:** What helps a Situation be understood again.

**Fundamental question:** If context is lost, what helps reconstruct understanding?

**Must not be confused with:** an attachment alone. Images, audio, files, links, citations, messages, documents, observations, and other expressions may serve as Evidence, but storage form does not establish evidential meaning. Evidence supports understanding; it does not replace the Situation and does not become true merely because it is retained.

### 7.3 Waiting

**Constitutional definition:** What is currently preventing or delaying a Situation from continuing.

**Fundamental question:** What is blocking or delaying continuation?

**Must not be confused with:** a generic status. Status is a label about condition. Waiting carries the specific continuity meaning of obstruction or dependency. Waiting may be internal, external, informational, material, relational, or decisional. A Situation described as "open" or "paused" does not thereby identify what it is waiting for.

Waiting is also not Outcome. Waiting preserves the possibility of continuation while identifying an obstruction. Outcome expresses conclusion or intentional disposition.

### 7.4 Promise

**Constitutional definition:** What has been committed, especially between people or toward a future expectation.

**Fundamental question:** What has been promised or must not be forgotten as a commitment?

**Must not be confused with:** a deadline alone. Time can constrain a Promise, but a date does not establish who committed to what, toward whom, or with what human significance. A deadline without commitment may be scheduling metadata. A Promise without a deadline remains a Promise.

### 7.5 Return Point

**Constitutional definition:** The meaningful place from which a Situation can be resumed.

**Fundamental question:** When returning later, where should understanding or work begin?

**Must not be confused with:** the last-opened timestamp, exhaustive history, or activity log. A Return Point is selected for resumption value, not generated merely because an event happened most recently. History may provide Evidence for choosing a Return Point, but chronology alone does not define it.

### 7.6 Next Action

**Constitutional definition:** The next meaningful act that can move the Situation.

**Fundamental question:** What should happen next?

**Must not be confused with:** Return Point. Return Point restores orientation; Next Action expresses movement. A person may know where to resume yet still have no available Next Action because the Situation is Waiting. Conversely, a suggested action may exist without preserving enough context to resume responsibly.

### 7.7 Outcome

**Constitutional definition:** The way a Situation reaches a concluded or intentionally inactive disposition.

**Fundamental question:** How did this Situation end or become intentionally inactive?

**Must not be confused with:** Waiting. Waiting describes temporary obstruction to possible continuation. Outcome describes conclusion or deliberate disposition. Completion, cancellation, abandonment, reference preservation, or deliberate leaving-alone may express Outcome in later modelling, but this Constitution does not settle categories.

## 8. Ontology Versus Canonical Model

The Constitution comes before both Ontology and Canonical Model.

**Ontology defines what kinds of entities and meanings exist in Moon's conceptual world.** It asks whether Situation, Evidence, Waiting, Promise, Return Point, Next Action, and Outcome are distinct kinds of meaning; what other constitutional entities may be needed; and which terms refer to expressions, relationships, or derived views.

**The Canonical Model defines how constitutional entities relate, compose, constrain, and evolve.** It will address structural questions that the Constitution deliberately leaves open: relationships, multiplicity, identity rules, composition, ownership, constraints, and change over time.

The Constitution establishes the reasons these distinctions matter. It does not complete either later document. Statements such as "Evidence helps a Situation be understood" or "a Situation may involve Waiting" are constitutional explanations, not finalized relationship structures or cardinality claims.

This separation prevents a premature representation from deciding ontology. A convenient arrangement in Today Board, a domain Pack, or an early persistence method must not settle what entities exist or how they canonically relate.

## 9. Invariants

**An Invariant is a rule of meaning that must remain true across domains, Packs, Surfaces, Templates, persistence methods, implementations, and Integrations.**

Primitives name kinds of continuity meaning. Invariants govern what must remain true about that meaning and its expression. A Primitive answers "what kind of meaning is this?" An Invariant answers "what must never become false when Moon represents or acts on that meaning?"

Invariants are binding because a domain-specific expression is not trustworthy if it changes the meaning of a Primitive. A seller Pack and a healthcare Pack may use different language, but neither may turn Waiting into conclusion or Promise into mere time metadata. Likewise, a Surface may simplify what it displays, but it may not silently reinterpret retained text as another Primitive.

The following are constitutional invariants for the current working model:

1. **Situation identity:** A Situation must remain identifiable as the Situation itself across changes of Surface, Pack, attention, and representation. This does not yet define the technical or ontological mechanics of identity.
2. **Evidence distinction:** Evidence supports understanding but does not replace the Situation. Retaining an attachment does not prove that its meaning or provenance is understood.
3. **Waiting distinction:** Waiting describes obstruction or delay to continuation, not conclusion.
4. **Promise distinction:** Promise describes commitment, not merely time, scheduling, or urgency.
5. **Return Point distinction:** Return Point supports resumption; it is not exhaustive historical recording or automatic recency.
6. **Next Action distinction:** Next Action describes meaningful movement; it is not the location or context of resumption.
7. **Outcome distinction:** Outcome describes conclusion or intentional disposition; it is not temporary obstruction.
8. **Surface fidelity:** A Surface representation may simplify Kernel meaning but must not redefine it.
9. **Pack fidelity:** Pack terminology may translate or contextualize Primitive expressions but must not alter Primitive semantics.
10. **Retrieval humility:** Retrieval may reveal a Situation or supporting expression, but retrieval rank, visibility, or absence does not define the Situation's truth.
11. **Preservation fidelity:** Preservation must not silently reinterpret human input. Retained text remains human text unless an explicit and justified act classifies it otherwise.
12. **Classification integrity:** Moon must preserve the distinction between "data was retained" and "Moon correctly understood what kind of data it is."
13. **Primitive non-inference:** One Primitive must not be inferred from another without explicit, justified, and reviewable logic. Evidence of a date does not automatically become a Promise; inactivity does not automatically become Outcome.
14. **Provenance humility:** Provenance supports interpretation but does not guarantee correctness or authority.
15. **Agency:** Continuity support must not require unnecessary surveillance, tracking, or retention.
16. **Domain independence:** Domain vocabulary must not change the constitutional meaning of a Primitive.
17. **Implementation subordination:** Implementation must serve the conceptual model and must not silently become the conceptual model.

Some important candidates remain constitutional questions rather than settled invariants:

- How much change can occur before a Situation is no longer the same Situation?
- Under what conditions may an inferred classification be shown, accepted, corrected, or rejected?
- What forms of forgetting, expiry, or deliberate discontinuity must be constitutionally protected?
- When a Promise involves several people, whose interpretation governs its meaning?
- When an Outcome is revisited, is the prior Situation resumed, related, or succeeded by another Situation?

These questions must be resolved in later Phase 0 work. Their uncertainty must not be hidden behind implementation defaults.

## 10. Kernel, Pack, Surface, Template, Integration, and Feature

### 10.1 Kernel

The **Continuity Kernel** is Moon's domain-independent continuity meaning and the rules that protect it. It contains constitutional concepts and, after later modelling, their canonical relationships, lifecycle meaning, and invariants. The Kernel must remain coherent when all industry and interface language is removed.

### 10.2 Pack

A **Pack** is a domain-specific expression of Kernel meaning. It may provide terminology, templates, validation, suggested workflows, and integrations appropriate to a practice or industry. A Pack may call a Promise a client commitment or an Outcome a case disposition when those terms are faithful. It may not redefine Promise as deadline or Outcome as status merely because a domain system does so.

There is one Continuity Kernel, not separate kernels for each domain. Packs are expressions around shared meaning.

### 10.3 Surface

A **Surface** is a user-facing way to capture, view, retrieve, attend to, resume, or conclude Situations. Today Board, Telegram, Voice, and Desktop are examples of possible Surfaces. A Surface decides what to reveal and how people interact, but it does not own constitutional meaning.

### 10.4 Template

A **Template** is a preconfigured expression of existing Primitives for a recurring context. It can guide what a person considers without creating a new kind of meaning. A template for client return, research interruption, or equipment follow-up remains a selection and arrangement of Kernel concepts.

### 10.5 Integration

An **Integration** connects Moon to an external system, communication channel, or Evidence source. It may bring in expressions, expose provenance, or permit actions elsewhere. Connection does not establish truth, ownership, or Primitive classification.

### 10.6 Feature

A **Feature** is a capability that supports interaction with the model. Search, export, import, recording, filters, and display controls can be valuable Features. Their value does not make them Kernel concepts.

### 10.7 Constitutional Relationship

The constitutional direction is:

Moon OS  
down to Continuity Kernel  
down to Pack and Surface expressions  
down to concrete user experiences

Situation and Continuity Primitives provide the meaning that Pack and Surface expressions use. Moon OS may coordinate broader experiences, but it must not bypass Kernel meaning when it claims to preserve continuity. This relationship is conceptual; it does not finalize packaging or architecture.

## 11. Continuity Principles

1. **Continuity before Feature.** A capability is justified by how it supports continuity, not by how many interactions it adds.
2. **Situation before Interface.** Moon asks what must remain understandable before deciding how it should appear.
3. **Primitive before Domain.** Shared continuity meaning is identified before industry terminology is applied.
4. **Meaning before Schema.** Representation follows clarified meaning. Early structures must not settle ambiguous concepts by accident.
5. **Context before Workflow.** A process can move while its meaning is lost. Moon preserves the context required for responsible movement.
6. **Resume before Productivity.** The first measure is whether a person can return without rebuilding, not whether the system increases activity.
7. **Correct classification before convenient retrieval.** Finding something quickly is not enough if Moon misstates what it is.
8. **Preservation without silent reinterpretation.** Human expressions remain what the person expressed unless classification is explicit, justified, and correctable.
9. **Human agency before automation.** Automation may assist continuity but does not own the meaning, priority, or disposition of a Situation.
10. **Consent and dignity before retention.** More history is not automatically more continuity. Moon must respect limits on what should remain available or be brought back.
11. **Local truth must not be disguised as cloud certainty.** Moon must state honestly when continuity depends on one device, incomplete material, or an unverified source.
12. **A Surface may simplify meaning but must not corrupt it.** Omission for clarity can be acceptable; reclassification for convenience is not.
13. **Packs may rename expressions but may not redefine Primitives.** Domain language is a translation layer, not a competing ontology.
14. **Implementation must serve the model.** Persistent structures, controls, and integrations are replaceable; constitutional distinctions are deliberate.
15. **Attention is not coercion.** Making a Situation visible must not turn visibility into pressure to act.
16. **Conclusion must remain honest.** A Situation need not be called completed to leave active attention. Outcome must allow truthful disposition.

## 12. Constitutional Decision Questions

Every future product, Pack, Surface, Integration, and architecture idea must answer these questions before architectural approval:

1. Which Primitive does this idea strengthen?
2. Is it truly a Kernel concern, or a Pack, Surface, Template, Integration, Feature, derived view, or operational policy concern?
3. Does it remain meaningful after removing the industry name?
4. Is the concept independent, or can existing Primitives represent it faithfully?
5. Does it improve understanding, preservation, resumption, continuation, attention, commitment, or conclusion?
6. Does it preserve human meaning, or silently reinterpret user data?
7. Does it create a model concept merely because an interface needs another field or control?
8. Would accepting it make Moon more coherent, or only larger?
9. Which Invariants could it threaten?
10. Can Today Board express it without forcing the Kernel to become card-shaped?
11. What counterexample would show that the idea is domain-specific or reducible?
12. What provenance or uncertainty must remain visible?
13. Does it preserve the person's ability to ignore, leave, conclude, forget, or start fresh?
14. What claim would the idea tempt Moon to make that the available evidence cannot support?

An idea that has no satisfactory answers may still be valuable. It must remain in the appropriate outer layer or research state rather than entering the Kernel prematurely.

## 13. Evolution Rules

The Kernel evolves through explicit conceptual review. It does not expand automatically when a product experiment succeeds or an industry requests familiar terminology.

A new Primitive may be considered only when all of the following are true:

- existing Primitives cannot represent it faithfully;
- the candidate appears across multiple unrelated domains;
- its meaning survives removal of domain terminology;
- it has independent semantics;
- it has an identifiable lifecycle or continuity role;
- combining it with another Primitive causes persistent ambiguity or loss of meaning;
- it passes review against current Invariants;
- it survives counterexamples and reduction attempts;
- its trust and agency consequences are understood sufficiently for constitutional use;
- it is accepted through an explicit constitutional amendment.

A concept must remain outside the Kernel when it is primarily domain-specific, implementation-specific, interface-specific, integration-specific, a convenience field, workflow preference, automation rule, report, metric, industry label, or temporary product experiment.

Rejected or deferred Kernel candidates need not be discarded. They may belong in a:

- Pack;
- Surface;
- Template;
- Integration;
- Feature;
- derived view;
- operational policy;
- research hypothesis.

### 13.1 Lightweight Amendment Process

A constitutional amendment must state the observed ambiguity or loss, the proposed change, the domains in which it appears, the counterexamples considered, the Invariants affected, and why an outer-layer destination is insufficient. Moon Founder, Moon Architect, and Moon QA must be able to review the reasoning. The Constitution should record the accepted change and the questions still deferred.

This process is intentionally lightweight. It requires an explicit argument, not a bureaucracy. A change may refine wording, split or combine concepts, add a Primitive, retire a claim, or mark an issue unresolved. No amendment may claim universal proof from one domain, one Surface, or one implementation.

## 14. Non-goals

Moon is not constitutionally defined as:

- a task manager;
- project management software;
- a customer relationship management system;
- enterprise resource planning software;
- a note-taking application;
- a knowledge base;
- a file manager;
- a document management system;
- a calendar;
- a reminder engine;
- a workflow automation platform;
- an analytics dashboard;
- a surveillance system;
- an employee monitoring system;
- a universal database;
- a replacement for every domain tool.

Moon may interoperate with these categories or express limited related capabilities. A Surface may show a Next Action in a list, an Integration may connect to a calendar, a Pack may reference a customer, and Evidence may include a document. These uses do not change Moon's constitutional identity.

This boundary prevents two errors. First, Moon must not absorb every adjacent capability merely because it can be connected to continuity. Second, Moon must not claim to replace specialized domain systems whose responsibilities, safety requirements, or operational depth exceed the Continuity Kernel.

## 15. Ethical and Trust Boundaries

Continuity concerns what remains available across time. That power creates specific trust obligations.

1. **Continuity must not become coercive retention.** Keeping something available is not always beneficial. People must retain meaningful control over whether a Situation remains, returns to Attention, or is left behind.
2. **Moon must not make users feel trapped into returning.** Return support is an offer, not a demand. Pausing, leaving alone, concluding, and ignoring must remain legitimate human choices.
3. **Moon must not exploit unresolved Situations to maximize engagement.** Uncertainty, obligation, and unfinished work must not become mechanisms for repeated pressure.
4. **Moon must not imply certainty where only local, incomplete, or inferred material exists.** A locally retained board is not cloud durability. A retrieved expression is not verified truth. An inference is not human confirmation.
5. **Moon must not silently transform human text into another Primitive classification.** A date in a note is not automatically a Promise. A pause is not automatically Waiting. Inactivity is not automatically Outcome.
6. **Moon must respect continuity boundaries.** Fresh-start, present-only, light-continuity, and no-old-pull preferences may be essential to dignity and safety. Their exact constitutional treatment remains for later specification, but their legitimacy is established here.
7. **Emotional judgment and trust behavior are not automatically outsourced.** External systems may provide Evidence or operations, but they do not automatically own interpretation, relational meaning, or sensitive decisions.
8. **Automation must not override human ownership of meaning.** Assistance can suggest or organize; it must not silently decide what a person promised, what they are waiting for, or how a Situation ended.
9. **Preservation should remain understandable and reversible where practical.** People should be able to know what is retained and avoid irreversible consequences hidden behind ordinary interaction.
10. **Moon should help people resume, not manufacture dependence.** A successful continuity system reduces reconstruction cost without making the person afraid to function without it.

These boundaries are specific to Continuity. They do not attempt to settle every ethical question about software or automation. They establish that retention, return, and classification must remain subordinate to human agency, consent, dignity, and honest claims.

## 16. Relationship to Today Board

Today Board is an early Continuity Surface. It is a practical proof that lightweight capture, Evidence, retrieval, Attention, resumption, preservation, and outcome-like behavior can help a person return without reconstructing everything.

Today Board is not the full Kernel. It is not the definition of Situation. Its four attention zones are not a universal Situation lifecycle. Its Card fields are not evidence that every field belongs in the Kernel. Its local storage behavior is not a canonical persistence rule. Its strengths and constraints provide field evidence, not constitutional authority.

Current Today Board concepts may later map approximately to Kernel concepts. That mapping requires its own careful work after Language, Ontology, Canonical Model, Lifecycle, Invariants, and Primitive Specifications are sufficiently stable. This Constitution does not perform that mapping and does not propose migration.

Today Board is also not the permanent center of Moon OS. It may remain an important Surface, but voice, messaging, desktop, timeline, domain Pack, and other expressions must be able to use the same continuity meaning without becoming card-shaped.

## 17. Domain-Independence Tests

Domain examples validate whether constitutional meanings survive changes of vocabulary. They do not define workflows or assert that Moon applies identically in every domain.

### 17.1 Situation and Continuity Across Domains

| Domain | Example Situation | Continuity concern |
| --- | --- | --- |
| Freelancer | A client direction remains unresolved after a call. | Return with the decision context, commitment, and next meaningful point intact. |
| Seller or local commerce | Payment confirmation is missing for an order. | Preserve what happened, what is awaited, and what honest disposition remains possible. |
| Research | An interpretation was left open while access to a source was pending. | Recover the question, supporting Evidence, obstruction, and Return Point. |
| Healthcare | Follow-up depends on a test result and prior observations. | Preserve context and provenance without pretending to replace clinical systems or judgment. |
| Factory or operations | Production stopped after a material discrepancy. | Recover the operational context, Evidence, Waiting, commitment, and safe next movement. |
| Creative studio or agency | A concept direction paused after feedback conflicted. | Retain the rationale, references, unresolved choice, and place to resume. |

What remains invariant is not the domain object. It is a context that may need future understanding, continuation, resumption, attention, commitment, or conclusion.

### 17.2 Primitive Independence

**Evidence**

- Freelancer: the client message and annotated draft.
- Seller: payment receipt or delivery photo.
- Research: citation, observation, or source excerpt.
- Healthcare: test result or recorded observation.
- Factory: inspection image or machine reading.
- Agency: moodboard reference or feedback recording.

Invariant after removing domain wording: an expression that helps the Situation be understood again. The medium alone does not establish the meaning.

**Waiting**

- Freelancer: waiting for client feedback.
- Seller: waiting for payment confirmation.
- Research: waiting for paper access or peer response.
- Healthcare: waiting for test results.
- Factory: waiting for material availability.
- Agency: waiting for approval or a creative decision.

Invariant: an obstruction or dependency currently delaying continuation, not a generic state label and not conclusion.

**Promise**

- Freelancer: a commitment to deliver a revision.
- Seller: a commitment to reserve an item or refund a payment.
- Research: a commitment to share findings with a collaborator.
- Healthcare: a commitment to follow up with a patient or colleague.
- Factory: a commitment to inspect or replace a component.
- Agency: a commitment to provide a concept by an agreed point.

Invariant: a human or operational commitment toward an expectation. Dates may qualify it but do not create it alone.

**Return Point**

- Freelancer: resume at the unresolved paragraph and client question.
- Seller: resume by checking the payment reference against the order.
- Research: resume at the disputed interpretation and missing source.
- Healthcare: resume by reviewing the new result alongside the prior observation.
- Factory: resume at the failed inspection step with the current machine condition.
- Agency: resume at the two remaining directions and the feedback that separates them.

Invariant: a meaningful orientation for resumption, not merely the most recent event.

**Next Action**

- Freelancer: send a clarified choice to the client.
- Seller: verify the transaction with the payment provider.
- Research: obtain and review the cited source.
- Healthcare: perform the appropriate reviewed follow-up step.
- Factory: inspect the specified component.
- Agency: prepare one comparison for decision.

Invariant: the next meaningful movement available to the Situation. It remains distinct from the context needed to resume.

**Outcome**

- Freelancer: delivered, cancelled, or deliberately ended.
- Seller: fulfilled, refunded, declined, or retained for reference.
- Research: concluded, abandoned, superseded, or preserved as an open question.
- Healthcare: follow-up concluded or transferred under appropriate practice.
- Factory: restored, decommissioned, deferred by deliberate disposition, or escalated beyond the local Situation.
- Agency: approved, cancelled, superseded, or preserved as reference.

Invariant: how the Situation became concluded or intentionally inactive, not what temporarily obstructed it.

### 17.3 Layer Independence

| Constitutional concept | Freelancer | Seller | Research | Healthcare | What remains invariant |
| --- | --- | --- | --- | --- | --- |
| Primitive | Waiting for feedback and Promise to revise | Waiting for payment and Promise to reserve | Evidence from a citation and Return Point at an unresolved claim | Waiting for a result and Evidence from an observation | The same irreducible continuity meanings remain distinguishable despite domain nouns. |
| Invariant | A delivery date alone is not a Promise | "Open" alone does not explain Waiting | Recent activity alone is not a Return Point | Retrieved material alone does not establish truth | Rules protecting meaning remain binding regardless of local terminology or practice. |
| Kernel | Defines shared Situation, Evidence, Waiting, Promise, Return Point, Next Action, and Outcome meaning | Uses the same shared meanings | Uses the same shared meanings | Uses the same shared meanings | Domain-independent meaning and its protections do not vary by industry. |
| Pack | May say client commitment or revision approval | May say order hold or payment confirmation | May say source access or peer response | May say follow-up or result review | Domain language contextualizes Kernel meaning without redefining it. |
| Surface | May use a compact board or desktop view | May use messaging or a local board | May use voice, timeline, or desktop | May use an appropriately governed domain-facing view | Interaction form changes capture and presentation, not constitutional meaning. |
| Template | May preconfigure a client-return expression | May preconfigure an unresolved-order expression | May preconfigure an interrupted-inquiry expression | May preconfigure an appropriate follow-up expression | A recurring arrangement selects existing meanings; it does not create a new Primitive. |
| Integration | May connect client messages | May connect payment or delivery evidence | May connect citation sources | May connect an authorized evidence source | Connections supply or carry expressions; they do not determine truth or classification. |
| Feature | Search, export, or voice capture | Filters or evidence capture | Retrieval or citation display | Retrieval or preservation controls | Capabilities support interaction while remaining outside constitutional ontology. |

A freelancer Pack may say "client commitment" while a factory Pack says "service commitment." Both expressions remain Promise. Today Board may show compact cards while Voice uses spoken capture. Both remain Surfaces. A calendar connection may expose time metadata while a messaging connection may expose conversation Evidence. Both remain Integrations. Removing the domain and interface terms leaves shared Kernel meaning intact.

## 18. Boundary Tests and Counterexamples

The following classifications are tentative constitutional reasoning, not permanent ontology. Several concepts may express more than one Primitive depending on human meaning. The test is whether the concept itself deserves independent Kernel status.

| Candidate | Tentative classification | Constitutional reasoning |
| --- | --- | --- |
| Tracking Number | Evidence expression; Integration concept; Metadata; not currently a Kernel Primitive | It can help verify or retrieve an external shipment state. Its meaning depends on a logistics system and does not independently describe continuity. |
| Moodboard | Evidence expression; Template or Surface feature; not currently a Kernel Primitive | It can help reconstruct creative context. The board form is domain and Surface specific; its evidential role is reusable. |
| Citation | Evidence expression; Provenance support; not currently a Kernel Primitive | It identifies or supports a source. Citation is a form of Evidence and provenance, not a new root meaning. |
| Customer | Situation relationship; Pack concept; not currently a Kernel Primitive | A customer may participate in many Situations. The term depends on commerce and does not itself express continuity. |
| Project | Pack concept; derived view; Situation relationship; not currently a Kernel Primitive | It may group or frame Situations, but organizational grouping is not the same as the context requiring continuity. |
| Reminder | Surface feature; possible expression of Attention; not currently a Kernel Primitive | It brings something forward in time. It does not necessarily preserve understanding or identify a commitment. |
| Deadline | Metadata; possible Promise qualifier; Pack concept; not currently a Kernel Primitive | A deadline can constrain action or commitment, but time alone is not Promise. Some deadlines are external constraints with no promise. |
| Status | Metadata; derived view; Pack or Surface concept; not currently a Kernel Primitive | Status summarizes condition. It can label Waiting or Outcome expressions but does not contain their distinct meaning. |
| Activity Log | Evidence expression; derived view; Surface feature; not currently a Kernel Primitive | History may aid understanding and provenance. Exhaustive event recording is not Return Point and does not ensure continuity. |
| Attachment | Evidence expression; Surface feature; not currently a Kernel Primitive | Attachment describes a storage or interaction relationship. It becomes Evidence only when it helps understanding. |
| Calendar Event | Integration concept; Metadata; possible Evidence or Promise qualifier; not currently a Kernel Primitive | It represents time in an external system. Its continuity meaning depends on what the event expresses. |
| Approval | Waiting expression, Promise expression, Outcome expression, or Pack concept depending on context; not currently a Kernel Primitive | Awaiting approval can be Waiting; granting approval may contribute to Outcome; promising approval carries commitment. The domain act does not yet show irreducible shared meaning. |
| Notification | Surface feature; Integration concept; not currently a Kernel Primitive | It delivers information or Attention. Delivery mechanism is not continuity meaning and can become coercive if treated as core. |
| Comment | Evidence expression; Surface feature; not currently a Kernel Primitive | A comment may contain Evidence, Promise, or ordinary text. Its conversational form does not determine classification. |
| Assignment | Situation relationship; Promise expression; Pack concept; not currently a Kernel Primitive | Assignment may establish responsibility or commitment, but role allocation and Promise must not be conflated without later modelling. |
| Priority | Metadata; derived view; operational policy; not currently a Kernel Primitive | Priority orders Attention or action under a policy. It does not establish the Situation's meaning and may change by context. |

These counterexamples demonstrate three rules. First, familiar domain nouns do not automatically become Primitives. Second, an expression's medium or interface form does not determine its Primitive. Third, one candidate can participate in several continuity meanings depending on explicit human context; Moon must not silently choose among them.

## 19. Deferred Architectural Questions

The following questions are intentionally unanswered here:

- How Situation identity is represented and maintained across time and Surfaces.
- How Primitives relate, compose, or refer to one another.
- Which expressions are required, optional, singular, plural, ordered, or repeatable.
- How provenance, confidence, authorship, consent, and correction are represented.
- How Situation relationships such as participation, grouping, succession, or dependency are modelled.
- How lifecycle changes are distinguished from attention changes and Surface states.
- How persistence, retrieval, export, and interoperability preserve constitutional meaning.
- How Packs translate language without creating semantic divergence.
- How inferred meaning is proposed, confirmed, corrected, rejected, or prohibited.
- How expiry, deletion, forgetting, fresh starts, and no-old-pull boundaries operate.
- How Today Board concepts map to the Canonical Model.

These belong to later Phase 0 specifications or Phase 1 architecture. Their presence here prevents accidental answers from becoming constitutional precedent.

## 20. Phase 0 Boundary

Phase 0 establishes meaning before architecture. Its required sequence is:

1. Moon Continuity Kernel Constitution v1
2. Moon Continuity Language v1
3. Moon Continuity Ontology v1
4. Moon Canonical Continuity Model v1
5. Situation Lifecycle Specification v1
6. Continuity Invariants Specification v1
7. Primitive Specifications:
   - Situation
   - Evidence
   - Waiting
   - Promise
   - Return Point
   - Next Action
   - Outcome
8. Kernel Acceptance Specification v1

The ordering among Ontology, Canonical Model, Lifecycle, and the full Invariants Specification may be refined if conceptual work reveals a dependency. The governing rule is that implementation must not precede sufficient conceptual clarity.

Architecture and implementation begin only after Phase 0 outputs are stable enough to make contradictions, omissions, and violations testable. Today Board migration, Kernel architecture, persistence decisions, and Surface mapping do not belong in this Constitution.

The next recommended task is **Moon Continuity Language v1**. It should establish canonical definitions, permitted synonyms, prohibited conflations, translation guidance, and term-level QA tests using this Constitution. Ontology follows once the language is precise enough to support entity distinctions without relying on conversational intuition.

## 21. Constitution Acceptance

This Constitution passes only if a reader can answer the following without access to chat history:

- Moon exists to support Situation Continuity and reduce reconstruction on return.
- Continuity preserves and supports identity, meaning, context, commitments, condition, and resumability across separation.
- Situation is the context that may need future understanding, continuation, resumption, attention, commitment, or conclusion.
- Situation is not Card; Card is a Surface representation.
- A Primitive carries irreducible, domain-independent continuity meaning.
- A Feature supports interaction and does not automatically belong to the Kernel.
- An Invariant is a cross-domain and cross-implementation rule that protects meaning.
- Primitive and Invariant differ: one names a kind of meaning; the other governs what must remain true.
- Waiting is obstruction, not generic status.
- Promise is commitment, not deadline alone.
- Return Point is meaningful resumption orientation, not history.
- Next Action is movement, not Return Point.
- Outcome is conclusion or intentional disposition, not Waiting.
- Kernel, Pack, Surface, Template, Integration, and Feature occupy distinct constitutional layers.
- Domain-specific concepts do not enter the Kernel merely because they are common or useful.
- Primitive evolution requires cross-domain irreducibility, counterexamples, invariant review, and explicit amendment.
- Moon is not constitutionally a task manager, CRM, ERP, note app, knowledge base, workflow engine, analytics system, or universal database.
- Today Board is an early Continuity Surface and proof source, not the core model.
- Moon Continuity Language v1 is the next Phase 0 document.

Moon QA should be able to turn these answers into future constitutional checks. If a later specification reduces Waiting to a status value, Promise to time, Return Point to history, or Situation to a card-shaped record, it conflicts with this Constitution even if the implementation is internally consistent.

## Appendix A. Vietnamese Core-Term Glossary

This glossary supports discussion; the English terms remain canonical until Moon Continuity Language v1 establishes translation policy.

| Canonical term | Vietnamese working term | Short meaning |
| --- | --- | --- |
| Continuity | Tính liên tục / sự tiếp nối ngữ cảnh | Khả năng giữ và khôi phục ý nghĩa của một Situation qua thời gian hoặc gián đoạn. |
| Situation | Tình huống | Bối cảnh có thể cần được hiểu lại, tiếp tục, quay lại, chú ý, cam kết, hoặc kết thúc. |
| Evidence | Bằng chứng / ngữ liệu hỗ trợ | Điều giúp hiểu lại Situation. |
| Waiting | Sự chờ đợi / điều đang chặn | Điều đang ngăn hoặc làm chậm việc tiếp tục. |
| Promise | Cam kết / lời hứa | Điều đã được cam kết đối với một người hoặc kỳ vọng tương lai. |
| Return Point | Điểm quay lại | Nơi có ý nghĩa để bắt đầu hiểu hoặc tiếp tục khi quay lại. |
| Next Action | Hành động tiếp theo | Hành động có ý nghĩa tiếp theo có thể làm Situation chuyển động. |
| Outcome | Kết cục / trạng thái kết thúc có chủ ý | Cách Situation đi đến kết thúc hoặc trở nên không hoạt động một cách có chủ ý. |
| Primitive | Khái niệm nguyên thủy | Ý nghĩa continuity độc lập, không phụ thuộc ngành, không thể giản lược trung thực vào khái niệm hiện có. |
| Invariant | Bất biến | Quy tắc ý nghĩa phải luôn đúng qua domain, Pack, Surface, và implementation. |
| Kernel | Hạt nhân | Ý nghĩa Continuity độc lập với domain và các quy tắc bảo vệ ý nghĩa đó. |
| Pack | Gói theo domain | Cách diễn đạt Kernel theo một domain mà không định nghĩa lại Primitive. |
| Surface | Bề mặt tương tác | Cách người dùng capture, xem, tìm lại, resume, hoặc conclude Situation. |
| Template | Mẫu cấu hình | Cách sắp xếp có sẵn của các ý nghĩa đã tồn tại. |
| Integration | Tích hợp | Kết nối đến hệ thống hoặc nguồn Evidence bên ngoài. |
| Provenance | Nguồn gốc và bối cảnh xuất xứ | Thông tin giúp hiểu một biểu đạt đến từ đâu và trong hoàn cảnh nào. |
| Preservation | Sự bảo toàn | Giữ biểu đạt và ý nghĩa của nó khả dụng mà không âm thầm diễn giải lại. |
| Resume | Quay lại và tiếp tục | Khôi phục đủ hiểu biết và định hướng để tiếp tục từ điểm có ý nghĩa. |
| Attention | Sự chú ý hiện tại | Mối quan hệ giữa Situation và nhận thức hiện tại, không phải mệnh lệnh hành động. |

## Appendix B. Self-Review Record

1. The document defines Continuity independently of Today Board.
2. Core definitions survive removal of domain examples.
3. No Primitive is justified by an interface field.
4. Card remains at the Surface layer.
5. Ontology and Canonical Model are explicitly deferred.
6. The seven Primitives are a v1 hypothesis, not eternal truth.
7. Invariants are distinguished from Primitives and made reviewable.
8. Moon QA can derive checks from definitions, distinctions, and acceptance statements.
9. Waiting is protected from reduction to status.
10. Promise is protected from reduction to deadline.
11. Return Point is protected from reduction to history.
12. Rejected Kernel candidates have explicit outer-layer destinations.
13. Agency, consent, dignity, and honest claims are constitutional boundaries.
14. Implementation is explicitly subordinate to meaning.
15. The next task is Moon Continuity Language v1, followed by Ontology, not implementation.

import { readFileSync } from "node:fs";
import ts from "typescript";

const stateSource = readFileSync("src/domain/state.ts", "utf8");
const cardDomainSource = readFileSync("src/domain/card.ts", "utf8");
const lifecycleSource = readFileSync("src/domain/lifecycle.ts", "utf8");
const boardDomainSource = readFileSync("src/domain/board.ts", "utf8");
const prioritySource = readFileSync("src/domain/reentryPriority.ts", "utf8");
const boardViewSource = readFileSync("src/ui/Board.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const appSource = readFileSync("src/app.ts", "utf8");
const swSource = readFileSync("public/sw.js", "utf8");
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

function stripImports(source) {
  return source.replace(/import[\s\S]*?from\s+["'][^"']+["'];\s*/g, "");
}

const executableSource = [stateSource, cardDomainSource, lifecycleSource, boardDomainSource, prioritySource]
  .map(stripImports)
  .join("\n");
const js = ts.transpileModule(executableSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const domain = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const created = domain.addCard(domain.createBoard(), "Lifecycle integrity");
const cardId = created.cards[0].id;
const draft = domain.createCardEditDraft(created.cards[0]);
Object.assign(draft, {
  contextSnapshot: "Complete draft context",
  waitingOn: "Historical dependency",
  ifYouReturn: "Retained return point",
  nextStepKind: "action",
  nextStep: "Retained next action",
  promise: "Deliver final package",
  promiseStatus: "kept",
  outcome: "Package delivered",
});

const atomic = domain.applyCardEditDraftAndTransition(created, cardId, draft, "finished");
assert(
  "draft and transition persist atomically",
  atomic.applied
    && atomic.board.cards[0].state === "finished"
    && atomic.board.cards[0].contextSnapshot === "Complete draft context"
    && atomic.board.cards[0].promiseStatus === "kept"
    && atomic.board.cards[0].outcome === "Package delivered",
);
assert("successful transition appends exactly one history entry", atomic.board.cards[0].stateHistory.length === 1);
assert(
  "no continuity fields are silently cleared",
  atomic.board.cards[0].waitingOn === "Historical dependency"
    && atomic.board.cards[0].ifYouReturn === "Retained return point"
    && atomic.board.cards[0].nextStep === "Retained next action"
    && atomic.board.cards[0].promise === "Deliver final package",
);

const openDraft = domain.createCardEditDraft(created.cards[0]);
Object.assign(openDraft, { promise: "Open commitment", promiseStatus: "open", outcome: "Would otherwise finish" });
const beforeOpenAssessment = JSON.stringify(created.cards[0]);
const openAssessment = domain.assessLifecycleTransition(created.cards[0], "finished", openDraft);
const openBlocked = domain.applyCardEditDraftAndTransition(created, cardId, openDraft, "finished");
assert(
  "open Promise blocks Finished",
  !openAssessment.allowed
    && openAssessment.block === "OPEN_PROMISE_BLOCKS_FINISHED"
    && !openBlocked.applied
    && openBlocked.board === created,
);
assert("pure assessment does not mutate the card", JSON.stringify(created.cards[0]) === beforeOpenAssessment);

for (const status of ["kept", "released"]) {
  const resolvedDraft = { ...openDraft, promiseStatus: status };
  const result = domain.applyCardEditDraftAndTransition(created, cardId, resolvedDraft, "finished");
  assert(`${status} Promise permits Finished`, result.applied && result.board.cards[0].promiseStatus === status);
}

const noOutcomeDraft = domain.createCardEditDraft(created.cards[0]);
const missingAssessment = domain.assessLifecycleTransition(created.cards[0], "finished", noOutcomeDraft);
const missingDeclined = domain.applyCardEditDraftAndTransition(created, cardId, noOutcomeDraft, "finished");
const missingAccepted = domain.applyCardEditDraftAndTransition(
  created,
  cardId,
  noOutcomeDraft,
  "finished",
  ["FINISH_WITHOUT_OUTCOME"],
);
assert(
  "missing Outcome requires explicit confirmation",
  missingAssessment.requiredConfirmations.includes("FINISH_WITHOUT_OUTCOME")
    && !missingDeclined.applied
    && missingDeclined.board === created,
);
assert(
  "Finish without Outcome remains represented honestly",
  missingAccepted.applied
    && missingAccepted.board.cards[0].outcome === ""
    && cardViewSource.includes("outcomeMissing")
    && cardViewSource.includes("finishWithoutOutcomeAction"),
);

const leaveDraft = { ...openDraft, outcome: "" };
const leaveAssessment = domain.assessLifecycleTransition(created.cards[0], "leave-alone", leaveDraft);
const leaveDeclined = domain.applyCardEditDraftAndTransition(created, cardId, leaveDraft, "leave-alone");
const leaveAccepted = domain.applyCardEditDraftAndTransition(
  created,
  cardId,
  leaveDraft,
  "leave-alone",
  ["LEAVE_ALONE_WITH_OPEN_PROMISE"],
);
assert(
  "Leave Alone with open Promise requires explicit consent",
  leaveAssessment.requiredConfirmations.includes("LEAVE_ALONE_WITH_OPEN_PROMISE")
    && !leaveDeclined.applied
    && leaveAccepted.applied
    && leaveAccepted.board.cards[0].promiseStatus === "open",
);
assert(
  "Leave Alone never enters re-entry prioritization",
  domain.getReentrySignal(leaveAccepted.board.cards[0]).readiness === "excluded"
    && prioritySource.includes('card.state !== "continue"'),
);

const finishedCard = atomic.board.cards[0];
const reopenDraft = domain.createCardEditDraft(finishedCard);
const reopened = domain.applyCardEditDraftAndTransition(atomic.board, cardId, reopenDraft, "continue");
assert(
  "reopening preserves previous Outcome and closedAt",
  reopened.applied
    && reopened.board.cards[0].outcome === finishedCard.outcome
    && reopened.board.cards[0].closedAt === finishedCard.closedAt
    && reopened.board.cards[0].stateHistory.length === 2
    && cardViewSource.includes("previousOutcome"),
);

assert(
  "rejected transitions change nothing",
  openBlocked.board === created
    && created.cards[0].state === "continue"
    && created.cards[0].stateHistory.length === 0,
);
assert(
  "persistence failure retains draft and original state",
  boardViewSource.indexOf("if (!trySaveBoard(nextBoard))") < boardViewSource.indexOf("onChange(nextBoard)")
    && cardViewSource.includes("editSessions.set(card.id, draft)")
    && cardViewSource.includes("text.transitionSaveFailed"),
);

const buildId = appSource.match(/BUILD_ID = "([^"]+)"/)?.[1];
const cacheVersion = swSource.match(/CACHE_VERSION = "([^"]+)"/)?.[1];
assert(
  "app and service-worker identities move together",
  buildId?.replace(/\./g, "-") === cacheVersion && buildId === "2026.07.23-b",
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

import { readFileSync } from "node:fs";
import ts from "typescript";

const stateSource = readFileSync("src/domain/state.ts", "utf8");
const cardSource = readFileSync("src/domain/card.ts", "utf8");
const boardSource = readFileSync("src/domain/board.ts", "utf8");
const localStoreSource = readFileSync("src/storage/localStore.ts", "utf8");
const retrievalSource = readFileSync("src/domain/retrieval.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const editorSource = readFileSync("src/ui/CardEditor.ts", "utf8");
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

const executableSource = [stateSource, cardSource, boardSource, localStoreSource]
  .map(stripImports)
  .join("\n");
const js = ts.transpileModule(executableSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const domain = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const created = domain.addCard(domain.createBoard(), "Client delivery");
const createdCard = created.cards[0];
assert(
  "new situations do not invent a promise",
  createdCard.promise === "" && createdCard.promiseStatus === "none" && createdCard.promiseDueOn === "",
);
assert(
  "new situations start without a fabricated outcome or history",
  createdCard.outcome === "" && createdCard.closedAt === "" && createdCard.stateHistory.length === 0,
);

const promised = domain.updateCardPromise(created, createdCard.id, {
  text: "Send the final logo package",
  to: "Lan",
  dueOn: "2026-07-24",
});
const promisedCard = promised.cards[0];
assert("a recorded promise defaults to open", promisedCard.promiseStatus === "open");
assert(
  "promise counterparty and promised date persist",
  promisedCard.promiseTo === "Lan" && promisedCard.promiseDueOn === "2026-07-24",
);

const invalidDate = domain.updateCardPromise(promised, createdCard.id, { dueOn: "2026-02-31" });
assert("invalid promised dates are rejected", invalidDate.cards[0].promiseDueOn === "");

const withOutcome = domain.updateCardOutcome(promised, createdCard.id, "Logo v3 approved and final files delivered");
const finished = domain.moveCard(withOutcome, createdCard.id, "finished");
const finishedCard = finished.cards[0];
assert(
  "finishing records one exact state transition",
  finishedCard.stateHistory.length === 1
    && finishedCard.stateHistory[0].from === "continue"
    && finishedCard.stateHistory[0].to === "finished",
);
assert("finishing records the latest closure time", Boolean(finishedCard.closedAt));

const reopened = domain.moveCard(finished, createdCard.id, "continue");
const reopenedCard = reopened.cards[0];
assert("reopening preserves the prior outcome", reopenedCard.outcome === finishedCard.outcome);
assert("reopening preserves the last closure identity", reopenedCard.closedAt === finishedCard.closedAt);
assert(
  "reopening appends history instead of erasing closure",
  reopenedCard.stateHistory.length === 2 && reopenedCard.stateHistory[1].from === "finished",
);

const roundTripped = domain.sanitizeBoard(JSON.parse(JSON.stringify(reopened)));
assert(
  "JSON export and import preserve promise and closure semantics",
  roundTripped.cards[0].promise === promisedCard.promise
    && roundTripped.cards[0].promiseStatus === "open"
    && roundTripped.cards[0].outcome === finishedCard.outcome
    && roundTripped.cards[0].stateHistory.length === 2,
);

const legacy = domain.sanitizeBoard({
  version: 1,
  cards: [{ id: "legacy", title: "Legacy", state: "pause", createdAt: "2026-01-01", updatedAt: "2026-01-02" }],
});
assert(
  "old boards gain safe promise and closure defaults",
  legacy.cards[0].promise === ""
    && legacy.cards[0].promiseStatus === "none"
    && legacy.cards[0].outcome === ""
    && legacy.cards[0].stateHistory.length === 0,
);

const inconsistent = domain.sanitizeBoard({
  version: 1,
  cards: [{
    id: "inconsistent",
    title: "Inconsistent history",
    state: "continue",
    stateHistory: [{ from: "continue", to: "finished", at: "2026-07-20T10:00:00.000Z" }],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-02",
  }],
});
assert("import drops state history that contradicts current state", inconsistent.cards[0].stateHistory.length === 0);

assert(
  "retrieval indexes promise and outcome truth",
  retrievalSource.includes("card.promise")
    && retrievalSource.includes("card.promiseTo")
    && retrievalSource.includes("card.outcome"),
);
assert(
  "collapsed finished situations expose outcome completeness",
  cardViewSource.includes("outcomeRecorded") && cardViewSource.includes("outcomeMissing"),
);
assert(
  "open mode exposes bounded state history",
  cardViewSource.includes("renderStateHistory") && cardViewSource.includes("slice(-3)"),
);
assert(
  "edit mode keeps promise and outcome progressive",
  editorSource.includes("promiseField")
    && editorSource.includes("promiseStatusField")
    && editorSource.includes("outcomeField"),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

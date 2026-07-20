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

const created = domain.addCard(domain.createBoard(), "Client logo round 2");
const createdCard = created.cards[0];
assert("new situations start without a forced waiting condition", createdCard.waitingOn === "");
assert("new situations start without a forced next step", createdCard.nextStepKind === "none" && createdCard.nextStep === "");

const updated = domain.updateCardReentryNotes(created, createdCard.id, {
  waitingOn: "Client feedback",
  ifYouReturn: "Open the annotated Figma frame",
  nextStepKind: "trigger",
  nextStep: "When feedback arrives, revise the logo",
});
const updatedCard = updated.cards[0];
assert("waiting context persists through the board update path", updatedCard.waitingOn === "Client feedback");
assert("return point remains distinct from next step", updatedCard.ifYouReturn.includes("Figma") && updatedCard.nextStep.includes("revise"));
assert("next trigger classification persists", updatedCard.nextStepKind === "trigger");

const roundTripped = domain.sanitizeBoard(JSON.parse(JSON.stringify(updated)));
assert(
  "JSON export and import preserve re-entry semantics",
  roundTripped.cards[0].waitingOn === "Client feedback"
    && roundTripped.cards[0].ifYouReturn === "Open the annotated Figma frame"
    && roundTripped.cards[0].nextStepKind === "trigger"
    && roundTripped.cards[0].nextStep === "When feedback arrives, revise the logo",
);

const legacy = domain.sanitizeBoard({
  version: 1,
  cards: [{ id: "legacy", title: "Legacy card", state: "continue", createdAt: "2026-01-01", updatedAt: "2026-01-02" }],
});
assert(
  "old boards gain safe continuity defaults",
  legacy.cards[0].waitingOn === "" && legacy.cards[0].nextStepKind === "none" && legacy.cards[0].nextStep === "",
);

const importedDraft = domain.sanitizeBoard({
  version: 1,
  cards: [{
    id: "draft",
    title: "Imported draft",
    state: "pause",
    waitingOn: "Supplier quote",
    ifYouReturn: "Review the quote",
    nextStep: "Choose a supplier",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-02",
  }],
});
assert("import preserves waiting context", importedDraft.cards[0].waitingOn === "Supplier quote");
assert("import infers action for an unclassified existing next step", importedDraft.cards[0].nextStepKind === "action");

assert(
  "retrieval indexes waiting and next-step context",
  retrievalSource.includes("card.waitingOn") && retrievalSource.includes("card.nextStep"),
);
assert(
  "collapsed cards surface an explicit return point",
  cardViewSource.includes("summary-return-point") && cardViewSource.includes("returnPointShort"),
);
assert(
  "open mode presents a dedicated re-entry view",
  cardViewSource.includes("reentryViewTitle") && cardViewSource.includes("nextStepLabel"),
);
assert(
  "edit mode supports waiting, action, and trigger without changing quick capture",
  editorSource.includes("waitingOnField") && editorSource.includes("nextStepKindField") && editorSource.includes("nextStepField"),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

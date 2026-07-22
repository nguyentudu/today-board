import { readFileSync } from "node:fs";
import ts from "typescript";

const stateSource = readFileSync("src/domain/state.ts", "utf8");
const cardDomainSource = readFileSync("src/domain/card.ts", "utf8");
const lifecycleDomainSource = readFileSync("src/domain/lifecycle.ts", "utf8");
const boardDomainSource = readFileSync("src/domain/board.ts", "utf8");
const boardViewSource = readFileSync("src/ui/Board.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const editorSource = readFileSync("src/ui/CardEditor.ts", "utf8");
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

const executableSource = [stateSource, cardDomainSource, lifecycleDomainSource, boardDomainSource]
  .map(stripImports)
  .join("\n");
const js = ts.transpileModule(executableSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const domain = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const persisted = domain.addCard(domain.createBoard(), "Persisted title");
const cardId = persisted.cards[0].id;
const persistedUpdatedAt = persisted.cards[0].updatedAt;
const draft = domain.createCardEditDraft(persisted.cards[0]);
Object.assign(draft, {
  title: "Coherent title",
  note: "Coherent note",
  contextSnapshot: "Current context",
  waitingOn: "Client answer",
  ifYouReturn: "Open the latest brief",
  nextStepKind: "action",
  nextStep: "Send the revision",
  promise: "Deliver the revision",
  promiseTo: "Client",
  promiseDueOn: "2026-07-21",
  promiseStatus: "open",
  outcome: "Approved",
  richLinks: ["https://example.com/brief"],
  bookmarkReason: "Return here first",
  tags: ["Moon", "Review"],
});

assert("draft changes do not mutate persisted values", persisted.cards[0].title === "Persisted title");
assert("draft changes do not touch updatedAt", persisted.cards[0].updatedAt === persistedUpdatedAt);
assert("dirty draft is detected", domain.isCardEditDraftDirty(persisted.cards[0], draft));

const saved = domain.applyCardEditDraft(persisted, cardId, draft);
const savedCard = saved.cards[0];
assert(
  "explicit save applies coherent values",
  savedCard.title === "Coherent title"
    && savedCard.note === "Coherent note"
    && savedCard.contextSnapshot === "Current context"
    && savedCard.waitingOn === "Client answer"
    && savedCard.ifYouReturn === "Open the latest brief"
    && savedCard.nextStepKind === "action"
    && savedCard.nextStep === "Send the revision"
    && savedCard.promise === "Deliver the revision"
    && savedCard.promiseTo === "Client"
    && savedCard.promiseDueOn === "2026-07-21"
    && savedCard.promiseStatus === "open"
    && savedCard.outcome === "Approved"
    && savedCard.richLinks[0] === "https://example.com/brief"
    && savedCard.bookmarkReason === "Return here first"
    && savedCard.tags.join(",") === "moon,review",
);

assert(
  "edit remains open across persisted media rerenders",
  cardViewSource.includes("const editSessions = new Map")
    && cardViewSource.includes('editSessions.has(card.id) ? "edit" : "summary"')
    && cardViewSource.includes("staged text draft survives their rerender"),
);
assert(
  "text entry updates only the staged draft",
  editorSource.includes('addEventListener("input"')
    && editorSource.includes("onDraftChange")
    && !editorSource.includes("onSaveDraft"),
);
assert(
  "save persists before replacing the board",
  boardViewSource.includes("commit(applyCardEditDraft(board, cardId, draft))")
    && boardViewSource.indexOf("if (!trySaveBoard(nextBoard))") < boardViewSource.indexOf("onChange(nextBoard)")
    && !appSource.slice(appSource.indexOf("function render("), appSource.indexOf("function copyStorage")).includes("saveBoard("),
);
assert(
  "failed storage save retains the draft",
  cardViewSource.includes("if (!onSaveDraft(card.id, draft))")
    && cardViewSource.includes("editSessions.set(card.id, draft)")
    && cardViewSource.includes("text.editSaveFailed"),
);
assert(
  "cancel abandons the draft without a board mutation",
  cardViewSource.includes('cancelButton.addEventListener("click"')
    && cardViewSource.includes("editSessions.delete(card.id)")
    && cardViewSource.includes('setMode("open")'),
);
assert(
  "state and hide cannot silently discard a draft",
  cardViewSource.includes("window.confirm(text.unsavedDraftConfirm)")
    && cardViewSource.includes("assessLifecycleTransition(card, targetState, draft)")
    && cardViewSource.includes("onTransition(card.id, draft, targetState")
    && cardViewSource.includes("transition-confirmation")
    && cardViewSource.includes("if (discardDraft())"),
);
assert(
  "media and evidence roles retain immediate-save semantics",
  boardViewSource.includes("updateCardRichContext")
    && boardViewSource.includes("updateCardEvidenceRole")
    && cardViewSource.includes("immediate-save operations"),
);
assert(
  "PWA activation remains blocked by an active editor",
  appSource.includes('document.querySelector(".card-editor")')
    && appSource.includes("Save or exit before reloading"),
);
assert(
  "input keystrokes do not trigger an app-wide remount",
  !editorSource.includes("onChange(nextBoard)")
    && appSource.includes("root.replaceChildren")
    && editorSource.includes('title.addEventListener("input"'),
);

const buildId = appSource.match(/BUILD_ID = "([^"]+)"/)?.[1];
const cacheVersion = swSource.match(/CACHE_VERSION = "([^"]+)"/)?.[1];
assert(
  "app and service-worker identities move together",
  Boolean(buildId) && buildId?.replace(/\./g, "-") === cacheVersion,
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

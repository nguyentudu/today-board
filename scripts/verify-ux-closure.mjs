import { readFileSync } from "node:fs";

const board = readFileSync("src/ui/Board.ts", "utf8");
const card = readFileSync("src/ui/Card.ts", "utf8");
const editor = readFileSync("src/ui/CardEditor.ts", "utf8");
const copy = readFileSync("src/ui/i18n.ts", "utf8");
const css = readFileSync("styles/main.css", "utf8");
const app = readFileSync("src/app.ts", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

const primaryControls = board.slice(board.indexOf("controls.append("), board.indexOf("top.append("));
assert(
  "data controls leave the primary capture hierarchy",
  primaryControls.includes("languageToggle")
    && primaryControls.includes("newCardInput")
    && primaryControls.includes("addButton")
    && primaryControls.includes("quickCaptureButton")
    && !primaryControls.includes("exportButton")
    && !primaryControls.includes("importButton")
    && board.includes('dataPanel.className = "data-device-panel"')
    && board.includes("dataActions.append(exportButton, importButton, importInput, selectedFile)"),
);

for (const field of [
  "titleField",
  "noteField",
  "contextSnapshotField",
  "whyStillOpenField",
  "waitingOnField",
  "ifYouReturnField",
  "nextStepKindField",
  "nextStepField",
  "promiseField",
  "promiseToField",
  "promiseDueField",
  "promiseStatusField",
  "outcomeField",
  "linksField",
  "captureControls",
  "bookmarkReasonField",
  "tagsField",
]) {
  assert(`progressive editor preserves ${field}`, editor.includes(field));
}

assert(
  "progressive sections are bounded and re-entry essentials come first",
  editor.includes('createEditorSection("reentry-essentials"')
    && editor.includes('createEditorSection("promise-closure"')
    && editor.includes('createEditorSection("evidence"')
    && editor.includes('createEditorSection("details"')
    && editor.indexOf('createEditorSection("reentry-essentials"') < editor.indexOf('createEditorSection("promise-closure"'),
);
assert(
  "populated and state-relevant sections remain discoverable",
  editor.includes("const promiseRelevant")
    && editor.includes('card.state === "finished"')
    && editor.includes("const evidenceRelevant")
    && editor.includes("card.evidenceMeta.length")
    && editor.includes("const detailsRelevant"),
);
assert(
  "validation reveals its progressive section",
  card.includes('openEditorSection(item, "promise-closure")')
    && card.includes("finishBlockedOpenPromise")
    && card.includes("requiredConfirmations"),
);
assert(
  "mobile Save and Cancel remain reachable without covering content",
  card.includes('draftActions.className = "draft-action-bar"')
    && css.includes(".card-edit .draft-action-bar")
    && css.includes("position: fixed")
    && css.includes("env(safe-area-inset-bottom)")
    && css.includes("padding-bottom: calc(5.5rem"),
);
assert(
  "focus and keyboard cleanup preserves staged draft semantics",
  card.includes("releaseObsoleteFocus(item)")
    && board.includes("dismissObsoleteFocus()")
    && editor.includes("document.activeElement.blur()")
    && card.includes("editSessions.set(card.id, draft)"),
);
assert(
  "compact evidence roles preserve explicit metadata semantics",
  card.includes("updateCardEvidenceRole") === false
    && card.includes("actions.onEvidenceRole({ id, kind, role")
    && card.includes('"reference", "brief", "feedback", "latest", "return-first", "outcome-proof"')
    && css.includes(".evidence-role-control")
    && css.includes("display: inline-flex"),
);

const viCopy = copy.slice(copy.indexOf("  vi: {"), copy.indexOf("} satisfies Record<"));
assert(
  "Vietnamese runtime copy no longer contains Selected",
  viCopy.includes('selectedFile: "Đã chọn:"') && !viCopy.includes('"Selected:'),
);
assert(
  "open mode remains re-entry-first",
  /else\s*\{\s*item\.append\(\s*renderReadableDetail\(card, text\),\s*renderRichContext/.test(card)
    && card.includes("text.reentryViewTitle")
    && card.includes("text.savedContext"),
);
assert(
  "section toggles expose state and preserve their viewport anchor",
  editor.includes('summary.setAttribute("aria-expanded"')
    && editor.includes('section.addEventListener("toggle"')
    && editor.includes("window.scrollBy"),
);
assert(
  "app and service-worker identities close together",
  app.includes('BUILD_ID = "2026.07.22-a"') && sw.includes('CACHE_VERSION = "2026-07-22-a"'),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

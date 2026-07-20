import { readFileSync } from "node:fs";
import ts from "typescript";

const prioritySource = readFileSync("src/domain/reentryPriority.ts", "utf8").replace(/^import type .*$/gm, "");
const columnSource = readFileSync("src/ui/Column.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const boardSource = readFileSync("src/domain/board.ts", "utf8");
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

const js = ts.transpileModule(prioritySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const priority = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

function card(id, overrides = {}) {
  return {
    id,
    state: "continue",
    hidden: false,
    contextSnapshot: "",
    whyStillOpen: "",
    waitingOn: "",
    ifYouReturn: "",
    nextStepKind: "none",
    nextStep: "",
    evidenceMeta: [],
    updatedAt: "2026-07-20T10:00:00.000Z",
    ...overrides,
  };
}

const actionable = card("actionable", { nextStepKind: "action", nextStep: "Open Figma" });
const prepared = card("prepared", { ifYouReturn: "Open the annotated frame" });
const waiting = card("waiting", { waitingOn: "Client feedback", nextStepKind: "trigger", nextStep: "Feedback arrives" });
const contextOnly = card("context", { contextSnapshot: "Draft v2 was sent" });
const unprepared = card("unprepared");

assert("an explicit next action is actionable", priority.getReentrySignal(actionable).readiness === "actionable");
assert("a return point without waiting is prepared", priority.getReentrySignal(prepared).readiness === "prepared");
assert("waiting remains waiting even with a named trigger", priority.getReentrySignal(waiting).readiness === "waiting");
assert("saved context alone is not presented as ready", priority.getReentrySignal(contextOnly).readiness === "context-only");
assert("an empty continue situation exposes the missing return point", priority.getReentrySignal(unprepared).readiness === "unprepared");

const ranked = [unprepared, waiting, prepared, contextOnly, actionable].sort(priority.compareReentryPriority);
assert(
  "continue situations rank by continuation quality",
  ranked.map((item) => item.id).join(",") === "actionable,prepared,waiting,context,unprepared",
);

for (const state of ["pause", "finished", "leave-alone"]) {
  const excluded = card(state, {
    state,
    nextStepKind: "action",
    nextStep: "Should not surface",
    ifYouReturn: "Should not surface",
    evidenceMeta: [{ id: "file-proof", kind: "file", role: "return-first" }],
  });
  assert(`${state} is excluded from re-entry prioritization`, priority.getReentrySignal(excluded).readiness === "excluded");
}

const before = JSON.stringify(actionable);
priority.getReentrySignal(actionable);
assert("priority derivation never mutates the situation", JSON.stringify(actionable) === before);

const tied = [
  card("older", { updatedAt: "2026-07-19T10:00:00.000Z" }),
  card("newer", { updatedAt: "2026-07-20T10:00:00.000Z" }),
].sort(priority.compareReentryPriority);
assert("equal readiness uses last touched only as a tie-breaker", tied[0].id === "newer");

assert(
  "only the Continue column is sorted by re-entry priority",
  columnSource.includes('if (props.state === "continue")') && columnSource.includes("cards.sort(compareReentryPriority)"),
);
assert(
  "the UI states that prioritization never changes state",
  columnSource.includes("reentryPriorityNote"),
);
assert(
  "excluded states never receive a re-entry signal pill",
  cardViewSource.includes('reentrySignal.readiness !== "excluded"'),
);
assert(
  "priority logic is not wired into the state mutation path",
  !boardSource.includes("getReentrySignal") && !boardSource.includes("compareReentryPriority"),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

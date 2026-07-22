import { readFileSync } from "node:fs";

const css = readFileSync("styles/main.css", "utf8");
const column = readFileSync("src/ui/Column.ts", "utf8");
const card = readFileSync("src/ui/Card.ts", "utf8");

const failures = [];

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m"));
  return match?.[1] ?? "";
}

function fail(message) {
  failures.push(message);
}

const columnsBlock = block(".columns");
const columnBlock = block(".column");
const headerBlock = block(".column-header");
const listBlock = block(".card-list");

if (!columnsBlock.includes("align-items: start")) {
  fail(".columns must align items to start so short zones do not stretch.");
}

if (!columnsBlock.includes("grid-auto-rows: max-content")) {
  fail(".columns must use natural grid row height.");
}

for (const [name, source] of [
  [".column", columnBlock],
  [".column-header", headerBlock],
  [".card-list", listBlock],
]) {
  if (/min-height\s*:/.test(source)) {
    fail(`${name} must not reserve fixed minimum vertical space.`);
  }

  if (/(^|[;\s])height\s*:/.test(source)) {
    fail(`${name} must not use fixed height.`);
  }

  if (/flex-grow\s*:\s*[1-9]/.test(source)) {
    fail(`${name} must not grow to fill artificial space.`);
  }
}

if (!column.includes('empty.className = "empty-column"')) {
  fail("empty zones must render compact empty-state copy.");
}

if (!column.includes("props.board.cards.filter") || !column.includes("!card.hidden")) {
  fail("hidden cards must be filtered from visible zone height.");
}

if (!card.includes('editSessions.has(card.id) ? "edit" : "summary"')) {
  fail("cards must start collapsed unless an active edit session is being restored.");
}

if (!card.includes("setMode(\"open\")") || !card.includes("setMode(\"summary\")")) {
  fail("cards must expand and collapse independently.");
}

if (!card.includes("renderReadableDetail(card, text)") || !card.includes("CardEditor({")) {
  fail("Open mode and Edit mode must remain separate.");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log("PASS attention zones use natural layout rules");
console.log("PASS empty zones render compact empty-state structure");
console.log("PASS cards remain independently collapsible");
console.log("PASS hidden cards do not reserve visible zone space");

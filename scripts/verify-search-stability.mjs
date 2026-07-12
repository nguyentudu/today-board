import { readFileSync } from "node:fs";

const board = readFileSync("src/ui/Board.ts", "utf8");
const retrieval = board.slice(board.indexOf("function createRetrievalSurface"), board.indexOf("function createStateFilters"));
const renderColumns = board.slice(board.indexOf("function renderColumns"), board.indexOf("  renderColumns();"));
const inputListener = retrieval.match(/search\.addEventListener\("input"[\s\S]*?\n  \}\);/)?.[0] ?? "";
const failures = [];

function assert(name, condition) {
  if (!condition) {
    failures.push(name);
  } else {
    console.log(`PASS ${name}`);
  }
}

assert("search input handles compositionstart", retrieval.includes('search.addEventListener("compositionstart"'));
assert("search input handles compositionend", retrieval.includes('search.addEventListener("compositionend"'));
assert("search input uses debounced targeted results update", retrieval.includes("window.setTimeout(updateResults, 120)"));
assert("search input does not call app-level onChange", !retrieval.includes("onChange("));
assert("search input does not force focus on every input", !retrieval.includes("restoreSearchFocus"));
assert("search input does not call focus from input listener", !inputListener.includes("search.focus"));
assert("retrieval surface is not rebuilt on query input", !retrieval.includes("replaceChildren("));
assert("retrieval input path does not write storage", !retrieval.includes("trySaveBoard") && !retrieval.includes("saveBoard") && !retrieval.includes("localStorage"));
assert("result updates are limited to result count summary controls and columns", retrieval.includes("resultCount.textContent") && retrieval.includes("updateActiveFilterSummary") && retrieval.includes("onResultsChange()"));
assert("filtered columns update below stable retrieval controls", renderColumns.includes("columns.replaceChildren()") && !renderColumns.includes("shell.replaceChildren"));
assert("media payloads are not decoded by retrieval lifecycle", !retrieval.includes("imageRefs") && !retrieval.includes("audioRefs") && !retrieval.includes("FileReader"));

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

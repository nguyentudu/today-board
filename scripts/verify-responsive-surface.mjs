import { readFileSync } from "node:fs";

const board = readFileSync("src/ui/Board.ts", "utf8");
const card = readFileSync("src/ui/Card.ts", "utf8");
const css = readFileSync("styles/main.css", "utf8");
const i18n = readFileSync("src/ui/i18n.ts", "utf8");
const failures = [];

function assert(name, condition) {
  if (!condition) {
    failures.push(name);
  } else {
    console.log(`PASS ${name}`);
  }
}

const retrievalSurface = board.slice(board.indexOf("function createRetrievalSurface"), board.indexOf("function createStateFilters"));
const stateFilters = board.slice(board.indexOf("function createStateFilters"), board.indexOf("function createMediaFilters"));
const renderColumns = board.slice(board.indexOf("function renderColumns"), board.indexOf("  renderColumns();"));

assert("mobile advanced filters can start collapsed", board.includes('window.matchMedia("(max-width: 640px)"') && board.includes("filterGroups.hidden = !advancedFiltersOpen"));
assert("advanced filters toggle has aria expanded", retrievalSurface.includes('setAttribute("aria-expanded"'));
assert("active filter count excludes search query", board.includes("function countActiveAdvancedFilters") && !board.match(/countActiveAdvancedFilters[\s\S]*retrievalQuery\.search/));
assert("active summary stays available for selected filters", board.includes("updateActiveFilterSummary") && board.includes("retrievalQuery.media.map"));
assert("search stays visible outside advanced filters", retrievalSurface.indexOf("controls.append(search") < retrievalSurface.indexOf("filterGroups.append"));
assert("state group no longer uses destructive Xóa copy", i18n.includes('clearFilter: "Đặt lại vùng"') && i18n.includes('clearFilter: "Reset states"'));
assert("result count switches between cards and results", board.includes("formatRetrievalCount") && i18n.includes("resultCountSingular") && i18n.includes("cardCountSingular"));
assert("filter updates do not call scroll APIs", !board.includes("scrollIntoView") && !board.includes("scrollTo"));
assert("filter updates do not call focus except clear actions", !stateFilters.includes(".focus(") && !retrievalSurface.match(/createChip[\s\S]*\.focus/));
assert("retrieval surface remains mounted while results update", !retrievalSurface.includes("replaceChildren(") && renderColumns.includes("columns.replaceChildren()"));
assert("columns opt out of scroll anchoring", css.includes(".columns") && css.includes("overflow-anchor: none"));
assert("desktop expanded card spans readable row", css.includes(".column:has(.card-expanded)") && css.includes("grid-column: 1 / -1"));
assert("expanded card class applies only open/edit modes", card.includes('item.classList.add("card-expanded")') && card.includes('if (mode === "summary")'));
assert("mobile expanded layout remains viewport constrained", css.includes("@media (max-width: 640px)") && css.includes("grid-template-columns: 1fr"));
assert("public surface no longer says Test Notes", i18n.includes('testNotesTitle: "Gợi ý nhẹ"') && i18n.includes('testNotesTitle: "Gentle notes"'));
assert("open edit separation remains in card", card.includes("renderReadableDetail(card, text)") && card.includes("CardEditor({"));
assert("search stability lifecycle remains present", retrievalSurface.includes("compositionstart") && retrievalSurface.includes("window.setTimeout(updateResults, 120)"));

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

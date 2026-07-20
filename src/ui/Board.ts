import {
  addCard,
  hideCard,
  moveCard,
  renameCard,
  updateCardNote,
  updateCardOutcome,
  updateCardPromise,
  updateCardReentryNotes,
  updateCardRichContext,
  updateCardTags,
  type Board as BoardModel,
} from "../domain/board";
import {
  collectTags,
  createDefaultRetrievalQuery,
  filterCards,
  isRetrievalActive,
  type LastTouchedFilter,
  type MediaFilter,
  type RetrievalQuery,
} from "../domain/retrieval";
import type { BoardState } from "../domain/state";
import { BOARD_STATES } from "../domain/state";
import { formatBytes } from "../media/localMedia";
import { cleanupHiddenCardMedia, getStorageDiagnostics } from "../storage/diagnostics";
import { exportBoard, readImportedBoard } from "../storage/exportBoard";
import { BOARD_STORAGE_WARNING_BYTES, trySaveBoard } from "../storage/localStore";
import { Column } from "./Column";
import type { Language } from "./i18n";
import { copy } from "./i18n";

let retrievalQuery: RetrievalQuery = createDefaultRetrievalQuery([...BOARD_STATES]);
let advancedFiltersOpen = !window.matchMedia("(max-width: 640px)").matches;

interface BoardProps {
  board: BoardModel;
  language: Language;
  selectedImportFileName: string;
  onChange: (board: BoardModel) => void;
  onImportFileSelected: (fileName: string) => void;
  onLanguageChange: (language: Language) => void;
  onQuickCapture: () => void;
}

export function Board({
  board,
  language,
  selectedImportFileName,
  onChange,
  onImportFileSelected,
  onLanguageChange,
  onQuickCapture,
}: BoardProps): HTMLElement {
  const text = copy[language];
  const shell = document.createElement("div");
  shell.className = "board-shell";

  const top = document.createElement("section");
  top.className = "top-panel";

  const headingGroup = document.createElement("div");
  headingGroup.className = "heading-group";

  const title = document.createElement("h1");
  title.textContent = text.title;

  const promise = document.createElement("p");
  promise.textContent = text.subtitle;

  headingGroup.append(title, promise);

  const controls = document.createElement("div");
  controls.className = "board-controls";

  const storageMessage = document.createElement("p");
  storageMessage.className = "storage-message";
  storageMessage.setAttribute("role", "status");

  const languageToggle = document.createElement("div");
  languageToggle.className = "language-toggle";
  languageToggle.setAttribute("aria-label", "Language");

  for (const option of ["vi", "en"] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = option === language ? "language-button active" : "language-button";
    button.textContent = option.toUpperCase();
    button.addEventListener("click", () => onLanguageChange(option));
    languageToggle.append(button);
  }

  const newCardInput = document.createElement("input");
  newCardInput.type = "text";
  newCardInput.placeholder = text.createPlaceholder;
  newCardInput.ariaLabel = text.createPlaceholder;

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = text.createButton;
  addButton.addEventListener("click", () => {
    if (commit(addCard(board, newCardInput.value))) {
      newCardInput.value = "";
    }
  });

  newCardInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addButton.click();
    }
  });

  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = text.exportButton;
  exportButton.addEventListener("click", () => {
    document.documentElement.dataset.pwaBusy = "true";
    try {
      exportBoard(board);
    } finally {
      delete document.documentElement.dataset.pwaBusy;
    }
  });

  const quickCaptureButton = document.createElement("button");
  quickCaptureButton.type = "button";
  quickCaptureButton.textContent = text.quickCaptureButton;
  quickCaptureButton.addEventListener("click", onQuickCapture);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json,.json";
  importInput.className = "file-input";
  importInput.ariaLabel = text.importButton;

  const importButton = document.createElement("button");
  importButton.type = "button";
  importButton.textContent = text.importButton;
  importButton.addEventListener("click", () => importInput.click());

  const selectedFile = document.createElement("span");
  selectedFile.className = "selected-file";
  selectedFile.textContent = `${text.selectedFile} ${selectedImportFileName}`;
  selectedFile.hidden = selectedImportFileName.length === 0;

  importInput.addEventListener("change", async () => {
    const file = importInput.files?.[0];

    if (!file) {
      return;
    }

    document.documentElement.dataset.pwaBusy = "true";
    try {
      const imported = await readImportedBoard(file);
      onImportFileSelected(file.name);
      commit(imported);
      importInput.value = "";
    } finally {
      delete document.documentElement.dataset.pwaBusy;
    }
  });

  controls.append(
    languageToggle,
    newCardInput,
    addButton,
    quickCaptureButton,
    exportButton,
    importButton,
    importInput,
    selectedFile,
  );
  top.append(headingGroup, controls);

  const localNote = document.createElement("p");
  localNote.className = "local-note";
  localNote.textContent = text.savedNote;

  const columns = document.createElement("div");
  columns.className = "columns";
  const retrievalView = createRetrievalSurface(board, language, renderColumns);
  const retrievalSurface = retrievalView.element;
  const storagePanel = createStoragePanel(board, language, storageMessage, (nextBoard) => commit(nextBoard));

  function commit(nextBoard: BoardModel): boolean {
    if (!trySaveBoard(nextBoard)) {
      storageMessage.textContent = `${text.storageNotEnough} ${text.cardNotSaved} ${text.storageAdvice}`;
      return false;
    }

    onChange(nextBoard);
    return true;
  }

  function renderColumns(): void {
    columns.replaceChildren();
    const retrievalActive = isRetrievalActive(retrievalQuery, [...BOARD_STATES]);
    const visibleCards = filterCards(board.cards, retrievalQuery, [...BOARD_STATES]);
    const visibleBoard = { ...board, cards: visibleCards };
    const visibleActiveCards = visibleCards.filter((card) => !card.hidden);

    for (const state of BOARD_STATES) {
      if (retrievalActive && !visibleActiveCards.some((card) => card.state === state)) {
        continue;
      }

      columns.append(
        Column({
          board: visibleBoard,
          state,
          language,
          onRename: (cardId: string, nextTitle: string) => commit(renameCard(board, cardId, nextTitle)),
          onMove: (cardId: string, nextState: BoardState) => commit(moveCard(board, cardId, nextState)),
          onNote: (cardId: string, note: string) => commit(updateCardNote(board, cardId, note)),
          onContextSnapshot: (cardId: string, contextSnapshot: string) =>
            commit(updateCardReentryNotes(board, cardId, { contextSnapshot })),
          onWhyStillOpen: (cardId: string, whyStillOpen: string) =>
            commit(updateCardReentryNotes(board, cardId, { whyStillOpen })),
          onWaitingOn: (cardId: string, waitingOn: string) =>
            commit(updateCardReentryNotes(board, cardId, { waitingOn })),
          onIfYouReturn: (cardId: string, ifYouReturn: string) =>
            commit(updateCardReentryNotes(board, cardId, { ifYouReturn })),
          onNextStepKind: (cardId: string, nextStepKind) =>
            commit(updateCardReentryNotes(board, cardId, { nextStepKind })),
          onNextStep: (cardId: string, nextStep: string) =>
            commit(updateCardReentryNotes(board, cardId, { nextStep })),
          onPromise: (cardId: string, promise) => commit(updateCardPromise(board, cardId, promise)),
          onOutcome: (cardId: string, outcome: string) => commit(updateCardOutcome(board, cardId, outcome)),
          onRichLinks: (cardId: string, richLinks: string[]) =>
            commit(updateCardRichContext(board, cardId, { richLinks })),
          onImageRefs: (cardId: string, imageRefs: string[]) =>
            commit(updateCardRichContext(board, cardId, { imageRefs })),
          onAudioRefs: (cardId: string, audioRefs: string[]) =>
            commit(updateCardRichContext(board, cardId, { audioRefs })),
          onFileRefs: (cardId: string, fileRefs) => commit(updateCardRichContext(board, cardId, { fileRefs })),
          onBookmarkReason: (cardId: string, bookmarkReason: string) =>
            commit(updateCardRichContext(board, cardId, { bookmarkReason })),
          onTags: (cardId: string, tags: string[]) => commit(updateCardTags(board, cardId, tags)),
          onHide: (cardId: string) => commit(hideCard(board, cardId)),
        }),
      );
    }

    if (retrievalActive && visibleActiveCards.length === 0) {
      const noResults = document.createElement("p");
      noResults.className = "no-results";
      noResults.textContent = text.noResults;
      columns.append(noResults);
    }
  }

  renderColumns();

  const testNotes = document.createElement("section");
  testNotes.className = "test-notes";

  const testNotesTitle = document.createElement("h2");
  testNotesTitle.textContent = text.testNotesTitle;

  const testNotesList = document.createElement("ul");

  for (const note of text.testNotes) {
    const item = document.createElement("li");
    item.textContent = note;
    testNotesList.append(item);
  }

  testNotes.append(testNotesTitle, testNotesList);

  shell.append(top, localNote, retrievalSurface, storagePanel, columns, testNotes);
  setupSearchKeyboardDismissal(shell, retrievalView.searchInput, retrievalView.isComposing);

  return shell;
}

interface RetrievalSurfaceView {
  element: HTMLElement;
  searchInput: HTMLInputElement;
  isComposing: () => boolean;
}

function createRetrievalSurface(
  board: BoardModel,
  language: Language,
  onResultsChange: () => void,
): RetrievalSurfaceView {
  const text = copy[language];
  const surface = document.createElement("section");
  surface.className = "retrieval-surface";
  let searchTimer: number | undefined;
  let composing = false;
  const selectedUpdaters: Array<() => void> = [];

  const updateResults = () => {
    const activeCards = filterCards(board.cards, retrievalQuery, [...BOARD_STATES]).filter((card) => !card.hidden);
    const active = isRetrievalActive(retrievalQuery, [...BOARD_STATES]);
    resultCount.textContent = formatRetrievalCount(activeCards.length, active, text);
    updateActiveFilterSummary(activeSummary, text, language, board);
    clearAll.hidden = !isRetrievalActive(retrievalQuery, [...BOARD_STATES]);
    updateFilterToggle();
    for (const updateSelected of selectedUpdaters) {
      updateSelected();
    }
    onResultsChange();
  };

  const scheduleSearchUpdate = () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(updateResults, 120);
  };

  const heading = document.createElement("div");
  heading.className = "retrieval-heading";
  const title = document.createElement("h2");
  title.textContent = text.retrievalTitle;
  const helper = document.createElement("p");
  helper.textContent = text.retrievalHelper;
  heading.append(title, helper);

  const controls = document.createElement("div");
  controls.className = "retrieval-controls";

  const search = document.createElement("input");
  search.type = "search";
  search.value = retrievalQuery.search;
  search.placeholder = text.searchCards;
  search.ariaLabel = text.searchCards;
  search.addEventListener("compositionstart", () => {
    composing = true;
    window.clearTimeout(searchTimer);
  });
  search.addEventListener("compositionend", () => {
    composing = false;
    retrievalQuery = { ...retrievalQuery, search: search.value };
    updateResults();
  });
  search.addEventListener("input", () => {
    retrievalQuery = { ...retrievalQuery, search: search.value };
    if (!composing) {
      scheduleSearchUpdate();
    }
  });

  const resultCount = document.createElement("p");
  resultCount.className = "retrieval-result-count";
  resultCount.setAttribute("role", "status");
  resultCount.textContent = "";

  const clearSearch = document.createElement("button");
  clearSearch.type = "button";
  clearSearch.className = "quiet-button";
  clearSearch.textContent = text.clearSearch;
  clearSearch.addEventListener("mousedown", (event) => event.preventDefault());
  clearSearch.addEventListener("click", () => {
    retrievalQuery = { ...retrievalQuery, search: "" };
    search.value = "";
    updateResults();
    search.focus();
  });

  controls.append(search, resultCount, clearSearch);

  const filterToggle = document.createElement("button");
  filterToggle.type = "button";
  filterToggle.className = "quiet-button filter-toggle";
  filterToggle.setAttribute("aria-controls", "advanced-filters");
  filterToggle.addEventListener("mousedown", (event) => event.preventDefault());
  filterToggle.addEventListener("click", () => {
    advancedFiltersOpen = !advancedFiltersOpen;
    updateFilterToggle();
    filterGroups.hidden = !advancedFiltersOpen;
  });

  const filterGroups = document.createElement("div");
  filterGroups.className = "filter-groups";
  filterGroups.id = "advanced-filters";
  filterGroups.hidden = !advancedFiltersOpen;
  filterGroups.append(
    createStateFilters(text, updateResults, selectedUpdaters),
    createMediaFilters(text, updateResults, selectedUpdaters),
    createLastTouchedFilter(text, updateResults, selectedUpdaters),
    createTagFilters(board, text, updateResults, selectedUpdaters),
  );

  const activeSummary = createActiveFilterSummary(text, language, board);
  const clearAll = document.createElement("button");
  clearAll.type = "button";
  clearAll.className = "quiet-button";
  clearAll.textContent = text.clearAllFilters;
  clearAll.hidden = !isRetrievalActive(retrievalQuery, [...BOARD_STATES]);
  clearAll.addEventListener("mousedown", (event) => event.preventDefault());
  clearAll.addEventListener("click", () => {
    retrievalQuery = createDefaultRetrievalQuery([...BOARD_STATES]);
    search.value = "";
    updateResults();
    search.focus();
  });

  const updateFilterToggle = () => {
    const activeFilterCount = countActiveAdvancedFilters();
    const label = activeFilterCount > 0 ? `${text.activeFiltersToggle} · ${activeFilterCount}` : text.filtersToggle;
    filterToggle.textContent = `${label} · ${advancedFiltersOpen ? text.hideFilters : text.showFilters}`;
    filterToggle.setAttribute("aria-expanded", String(advancedFiltersOpen));
  };

  surface.append(heading, controls, filterToggle, activeSummary, clearAll, filterGroups);
  updateResults();

  return {
    element: surface,
    searchInput: search,
    isComposing: () => composing,
  };
}

const INTERACTIVE_DISMISS_SELECTOR = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "label",
  "audio",
  "video",
  '[contenteditable="true"]',
  '[role="button"]',
  "[data-keep-keyboard]",
  "[data-interactive]",
].join(",");

function setupSearchKeyboardDismissal(
  shell: HTMLElement,
  search: HTMLInputElement,
  isComposing: () => boolean,
): void {
  let touchStartY: number | undefined;
  let blurredForGesture = false;

  shell.addEventListener("pointerdown", (event) => {
    if (document.activeElement !== search || isComposing()) {
      return;
    }

    if (event.pointerType === "touch") {
      touchStartY = event.clientY;
      blurredForGesture = false;
    }

    const target = event.target instanceof Element ? event.target : null;

    if (!target?.closest(INTERACTIVE_DISMISS_SELECTOR)) {
      search.blur();
    }
  });

  shell.addEventListener(
    "pointermove",
    (event) => {
      if (
        event.pointerType !== "touch" ||
        touchStartY === undefined ||
        blurredForGesture ||
        document.activeElement !== search ||
        isComposing()
      ) {
        return;
      }

      if (Math.abs(event.clientY - touchStartY) >= 14) {
        blurredForGesture = true;
        search.blur();
      }
    },
    { passive: true },
  );

  const endGesture = () => {
    touchStartY = undefined;
    blurredForGesture = false;
  };

  shell.addEventListener("pointerup", endGesture);
  shell.addEventListener("pointercancel", endGesture);
}

function createStateFilters(
  text: (typeof copy)[Language],
  onUpdate: () => void,
  selectedUpdaters: Array<() => void>,
): HTMLElement {
  const group = createFilterGroup(text.stateFilter);
  const all = createChip(text.allStates, retrievalQuery.states.length === BOARD_STATES.length, () => {
    retrievalQuery = { ...retrievalQuery, states: [...BOARD_STATES] };
    onUpdate();
  });
  selectedUpdaters.push(() => setChipSelected(all, retrievalQuery.states.length === BOARD_STATES.length));
  group.append(all);

  const clear = createChip(text.clearFilter, retrievalQuery.states.length === 0, () => {
    retrievalQuery = { ...retrievalQuery, states: [] };
    onUpdate();
  });
  selectedUpdaters.push(() => setChipSelected(clear, retrievalQuery.states.length === 0));
  group.append(clear);

  for (const state of BOARD_STATES) {
    const chip = createChip(text.stateLabels[state], retrievalQuery.states.includes(state), () => {
      const states = toggleValue(retrievalQuery.states, state);
      retrievalQuery = { ...retrievalQuery, states };
      onUpdate();
    });
    selectedUpdaters.push(() => setChipSelected(chip, retrievalQuery.states.includes(state)));
    group.append(chip);
  }

  return group;
}

function createMediaFilters(
  text: (typeof copy)[Language],
  onUpdate: () => void,
  selectedUpdaters: Array<() => void>,
): HTMLElement {
  const group = createFilterGroup(text.mediaFilters);
  const options: Array<[MediaFilter, string]> = [
    ["image", text.hasImage],
    ["voice", text.hasVoice],
    ["file", text.hasFile],
    ["link", text.hasLink],
  ];

  for (const [value, label] of options) {
    const chip = createChip(label, retrievalQuery.media.includes(value), () => {
      retrievalQuery = { ...retrievalQuery, media: toggleValue(retrievalQuery.media, value) };
      onUpdate();
    });
    selectedUpdaters.push(() => setChipSelected(chip, retrievalQuery.media.includes(value)));
    group.append(chip);
  }

  return group;
}

function createLastTouchedFilter(
  text: (typeof copy)[Language],
  onUpdate: () => void,
  selectedUpdaters: Array<() => void>,
): HTMLElement {
  const field = document.createElement("label");
  field.className = "retrieval-select";
  const label = document.createElement("span");
  label.textContent = text.lastTouchedFilter;
  const select = document.createElement("select");
  select.ariaLabel = text.lastTouchedFilter;

  const options: Array<[LastTouchedFilter, string]> = [
    ["any", text.anyTime],
    ["today", text.todayFilter],
    ["last7", text.last7],
    ["last30", text.last30],
    ["older30", text.older30],
  ];

  for (const [value, labelText] of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = labelText;
    option.selected = retrievalQuery.lastTouched === value;
    select.append(option);
  }

  select.addEventListener("change", () => {
    retrievalQuery = { ...retrievalQuery, lastTouched: select.value as LastTouchedFilter };
    onUpdate();
  });
  selectedUpdaters.push(() => {
    select.value = retrievalQuery.lastTouched;
  });

  field.append(label, select);
  return field;
}

function createTagFilters(
  board: BoardModel,
  text: (typeof copy)[Language],
  onUpdate: () => void,
  selectedUpdaters: Array<() => void>,
): HTMLElement {
  const group = createFilterGroup(text.tags);
  for (const tag of collectTags(board.cards)) {
    const chip = createChip(`#${tag}`, retrievalQuery.tags.includes(tag), () => {
      retrievalQuery = { ...retrievalQuery, tags: toggleValue(retrievalQuery.tags, tag) };
      onUpdate();
    });
    selectedUpdaters.push(() => setChipSelected(chip, retrievalQuery.tags.includes(tag)));
    group.append(chip);
  }
  return group;
}

function createActiveFilterSummary(text: (typeof copy)[Language], language: Language, board: BoardModel): HTMLElement {
  const summary = document.createElement("p");
  summary.className = "active-filter-summary";
  updateActiveFilterSummary(summary, text, language, board);
  return summary;
}

function updateActiveFilterSummary(
  summary: HTMLElement,
  text: (typeof copy)[Language],
  language: Language,
  board: BoardModel,
): void {
  if (!isRetrievalActive(retrievalQuery, [...BOARD_STATES])) {
    summary.hidden = true;
    summary.textContent = "";
    return;
  }

  const labels = [
    ...(retrievalQuery.states.length === BOARD_STATES.length ? [] : retrievalQuery.states.map((state) => text.stateLabels[state])),
    ...retrievalQuery.media.map((media) => mediaLabel(media, text)),
    retrievalQuery.lastTouched === "any" ? "" : lastTouchedLabel(retrievalQuery.lastTouched, text),
    ...retrievalQuery.tags.map((tag) => `#${tag}`),
  ].filter(Boolean);

  if (labels.length === 0) {
    summary.hidden = true;
    summary.textContent = "";
    return;
  }

  summary.textContent = `${text.filtering} ${labels.join(" · ")}`;
  summary.dataset.totalTags = String(collectTags(board.cards).length);
  summary.lang = language;
}

function countActiveAdvancedFilters(): number {
  let count = 0;

  if (retrievalQuery.states.length !== BOARD_STATES.length) {
    count += 1;
  }

  count += retrievalQuery.media.length;

  if (retrievalQuery.lastTouched !== "any") {
    count += 1;
  }

  count += retrievalQuery.tags.length;

  return count;
}

function formatRetrievalCount(count: number, active: boolean, text: (typeof copy)[Language]): string {
  if (active) {
    return `${count} ${count === 1 ? text.resultCountSingular : text.resultCount}`;
  }

  return `${count} ${count === 1 ? text.cardCountSingular : text.cardCount}`;
}

function createFilterGroup(label: string): HTMLElement {
  const group = document.createElement("fieldset");
  group.className = "filter-group";
  const legend = document.createElement("legend");
  legend.textContent = label;
  group.append(legend);
  return group;
}

function createChip(label: string, selected: boolean, onClick: () => void): HTMLButtonElement {
  const chip = document.createElement("button");
  chip.type = "button";
  setChipSelected(chip, selected);
  chip.textContent = label;
  chip.addEventListener("mousedown", (event) => event.preventDefault());
  chip.addEventListener("click", onClick);
  return chip;
}

function setChipSelected(chip: HTMLButtonElement, selected: boolean): void {
  chip.className = selected ? "filter-chip selected" : "filter-chip";
  chip.setAttribute("aria-pressed", String(selected));
}

function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function mediaLabel(media: MediaFilter, text: (typeof copy)[Language]): string {
  return media === "image" ? text.hasImage : media === "voice" ? text.hasVoice : media === "file" ? text.hasFile : text.hasLink;
}

function lastTouchedLabel(filter: LastTouchedFilter, text: (typeof copy)[Language]): string {
  return filter === "today"
    ? text.todayFilter
    : filter === "last7"
      ? text.last7
      : filter === "last30"
        ? text.last30
        : filter === "older30"
          ? text.older30
          : text.anyTime;
}

function createStoragePanel(
  board: BoardModel,
  language: Language,
  storageMessage: HTMLParagraphElement,
  onCleanup: (board: BoardModel) => boolean,
): HTMLElement {
  const text = copy[language];
  const diagnostics = getStorageDiagnostics(board);
  const panel = document.createElement("section");
  panel.className = "storage-panel";

  const title = document.createElement("h2");
  title.textContent = text.storageIndicator;

  const percent = Math.min(100, Math.round((diagnostics.boardBytes / BOARD_STORAGE_WARNING_BYTES) * 100));
  const summary = document.createElement("p");
  summary.textContent = getStorageSummary(percent, diagnostics.imageBytes, diagnostics.audioBytes, diagnostics.boardBytes, text);

  const detailBlock = document.createElement("details");
  const detailSummary = document.createElement("summary");
  detailSummary.textContent = text.storageViewDetails;

  const details = document.createElement("ul");
  details.className = "storage-details";

  for (const item of [
    `${text.storageIndicator}: ${formatBytes(diagnostics.boardBytes)}`,
    `${text.storagePercent}: ${percent}%`,
    `${text.storageWarningThreshold}: ${formatBytes(BOARD_STORAGE_WARNING_BYTES)}`,
    `${text.storageImages}: ${diagnostics.imageCount} / ${formatBytes(diagnostics.imageBytes)}`,
    `${text.storageAudio}: ${diagnostics.audioCount} / ${formatBytes(diagnostics.audioBytes)}`,
    `${text.storageFiles}: ${diagnostics.fileCount} / ${formatBytes(diagnostics.fileBytes)}`,
    `${text.storageCards}: ${diagnostics.cardSizes.length}`,
  ]) {
    const row = document.createElement("li");
    row.textContent = item;
    details.append(row);
  }

  const cardSizes = document.createElement("details");
  const cardSizesSummary = document.createElement("summary");
  cardSizesSummary.textContent = text.storageCards;
  const cardSizeList = document.createElement("ul");

  for (const card of diagnostics.cardSizes.slice(0, 12)) {
    const item = document.createElement("li");
    item.textContent = `${card.title}: ${formatBytes(card.bytes)}`;
    cardSizeList.append(item);
  }

  cardSizes.append(cardSizesSummary, cardSizeList);
  detailBlock.append(detailSummary, details, cardSizes);

  const actions = document.createElement("div");
  actions.className = "storage-actions";

  const exportBeforeCleanup = document.createElement("button");
  exportBeforeCleanup.type = "button";
  exportBeforeCleanup.className = "quiet-button";
  exportBeforeCleanup.textContent = text.storageExportBeforeCleanup;
  exportBeforeCleanup.addEventListener("click", () => exportBoard(board));

  const cleanup = document.createElement("button");
  cleanup.type = "button";
  cleanup.className = "quiet-button";
  cleanup.textContent = text.storageCleanup;
  cleanup.addEventListener("click", () => {
    const hiddenCards = board.cards.filter((card) => card.hidden);
    const hiddenMediaCount = hiddenCards.reduce(
      (total, card) => total + card.imageRefs.length + card.audioRefs.length + card.fileRefs.length,
      0,
    );
    const hiddenMediaBytes = hiddenCards.reduce(
      (total, card) =>
        total +
        card.imageRefs.reduce((sum, item) => sum + item.length, 0) +
        card.audioRefs.reduce((sum, item) => sum + item.length, 0) +
        card.fileRefs.reduce((sum, item) => sum + JSON.stringify(item).length, 0),
      0,
    );

    if (hiddenMediaCount === 0) {
      storageMessage.textContent = text.storageCleanupEmpty;
      return;
    }

    showCleanupConfirmation({
      container: panel,
      text,
      hiddenCardCount: hiddenCards.length,
      hiddenMediaCount,
      hiddenMediaBytes,
      onConfirm: () => {
        if (onCleanup(cleanupHiddenCardMedia(board))) {
          storageMessage.textContent = text.storageCleanupDone;
        }
      },
    });
  });

  actions.append(exportBeforeCleanup, cleanup);
  panel.append(title, summary, detailBlock, actions, storageMessage);

  return panel;
}

function getStorageSummary(
  percent: number,
  imageBytes: number,
  audioBytes: number,
  boardBytes: number,
  text: (typeof copy)[Language],
): string {
  if (percent >= 95) {
    return text.storageNeedsCleanup;
  }

  if (percent >= 80) {
    return text.storageNearLimit;
  }

  if (imageBytes + audioBytes > boardBytes * 0.6 && boardBytes > 0) {
    return text.storageMediaHeavy;
  }

  return text.storageHealthy;
}

function showCleanupConfirmation({
  container,
  text,
  hiddenCardCount,
  hiddenMediaCount,
  hiddenMediaBytes,
  onConfirm,
}: {
  container: HTMLElement;
  text: (typeof copy)[Language];
  hiddenCardCount: number;
  hiddenMediaCount: number;
  hiddenMediaBytes: number;
  onConfirm: () => void;
}): void {
  const existing = container.querySelector(".cleanup-confirmation");
  existing?.remove();

  const confirmation = document.createElement("div");
  confirmation.className = "cleanup-confirmation";

  const message = document.createElement("p");
  message.textContent = text.storageCleanupConsequence;

  const summary = document.createElement("p");
  summary.textContent = `${hiddenCardCount} ${text.hiddenCardsAffected}. ${hiddenMediaCount} ${text.mediaItemsAffected}. ${text.estimatedRecover}: ${formatBytes(hiddenMediaBytes)}.`;

  const actions = document.createElement("div");
  actions.className = "storage-actions";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "quiet-button";
  cancel.textContent = text.cancelAction;
  cancel.addEventListener("click", () => confirmation.remove());

  const confirm = document.createElement("button");
  confirm.type = "button";
  confirm.textContent = text.confirmAction;
  confirm.addEventListener("click", onConfirm);

  actions.append(cancel, confirm);
  confirmation.append(message, summary, actions);
  container.append(confirmation);
}

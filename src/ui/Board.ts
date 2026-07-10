import {
  addCard,
  hideCard,
  moveCard,
  renameCard,
  updateCardNote,
  updateCardReentryNotes,
  updateCardRichContext,
  type Board as BoardModel,
} from "../domain/board";
import type { BoardState } from "../domain/state";
import { BOARD_STATES } from "../domain/state";
import { formatBytes } from "../media/localMedia";
import { cleanupHiddenCardMedia, getStorageDiagnostics } from "../storage/diagnostics";
import { exportBoard, readImportedBoard } from "../storage/exportBoard";
import { BOARD_STORAGE_WARNING_BYTES, trySaveBoard } from "../storage/localStore";
import { Column } from "./Column";
import type { Language } from "./i18n";
import { copy } from "./i18n";

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
  exportButton.addEventListener("click", () => exportBoard(board));

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

    const imported = await readImportedBoard(file);
    onImportFileSelected(file.name);
    commit(imported);
    importInput.value = "";
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

  const storagePanel = createStoragePanel(board, language, storageMessage, (nextBoard) => commit(nextBoard));

  const columns = document.createElement("div");
  columns.className = "columns";

  function commit(nextBoard: BoardModel): boolean {
    if (!trySaveBoard(nextBoard)) {
      storageMessage.textContent = `${text.storageNotEnough} ${text.cardNotSaved} ${text.storageAdvice}`;
      return false;
    }

    onChange(nextBoard);
    return true;
  }

  for (const state of BOARD_STATES) {
    columns.append(
      Column({
        board,
        state,
        language,
        onRename: (cardId: string, nextTitle: string) => commit(renameCard(board, cardId, nextTitle)),
        onMove: (cardId: string, nextState: BoardState) => commit(moveCard(board, cardId, nextState)),
        onNote: (cardId: string, note: string) => commit(updateCardNote(board, cardId, note)),
        onContextSnapshot: (cardId: string, contextSnapshot: string) =>
          commit(updateCardReentryNotes(board, cardId, { contextSnapshot })),
        onWhyStillOpen: (cardId: string, whyStillOpen: string) =>
          commit(updateCardReentryNotes(board, cardId, { whyStillOpen })),
        onIfYouReturn: (cardId: string, ifYouReturn: string) =>
          commit(updateCardReentryNotes(board, cardId, { ifYouReturn })),
        onRichLinks: (cardId: string, richLinks: string[]) =>
          commit(updateCardRichContext(board, cardId, { richLinks })),
        onImageRefs: (cardId: string, imageRefs: string[]) =>
          commit(updateCardRichContext(board, cardId, { imageRefs })),
        onAudioRefs: (cardId: string, audioRefs: string[]) =>
          commit(updateCardRichContext(board, cardId, { audioRefs })),
        onFileRefs: (cardId: string, fileRefs) => commit(updateCardRichContext(board, cardId, { fileRefs })),
        onBookmarkReason: (cardId: string, bookmarkReason: string) =>
          commit(updateCardRichContext(board, cardId, { bookmarkReason })),
        onHide: (cardId: string) => commit(hideCard(board, cardId)),
      }),
    );
  }

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

  shell.append(top, localNote, storagePanel, columns, testNotes);

  return shell;
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
  summary.textContent = `${text.storageIndicator}: ${formatBytes(diagnostics.boardBytes)}. ${text.storagePercent}: ${percent}%. ${text.storageWarningThreshold}: ${formatBytes(BOARD_STORAGE_WARNING_BYTES)}.`;

  const details = document.createElement("ul");
  details.className = "storage-details";

  for (const item of [
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
    const hiddenMediaCount = board.cards
      .filter((card) => card.hidden)
      .reduce((total, card) => total + card.imageRefs.length + card.audioRefs.length + card.fileRefs.length, 0);

    if (hiddenMediaCount === 0) {
      storageMessage.textContent = text.storageCleanupEmpty;
      return;
    }

    if (onCleanup(cleanupHiddenCardMedia(board))) {
      storageMessage.textContent = text.storageCleanupDone;
    }
  });

  actions.append(exportBeforeCleanup, cleanup);
  panel.append(title, summary, details, cardSizes, actions, storageMessage);

  return panel;
}

import {
  addCard,
  hideCard,
  moveCard,
  renameCard,
  updateCardNote,
  updateCardReentryNotes,
  type Board as BoardModel,
} from "../domain/board";
import type { BoardState } from "../domain/state";
import { BOARD_STATES } from "../domain/state";
import { exportBoard, readImportedBoard } from "../storage/exportBoard";
import { saveBoard } from "../storage/localStore";
import { Column } from "./Column";
import type { Language } from "./copy";
import { copy } from "./copy";

interface BoardProps {
  board: BoardModel;
  language: Language;
  selectedImportFileName: string;
  onChange: (board: BoardModel) => void;
  onImportFileSelected: (fileName: string) => void;
  onLanguageChange: (language: Language) => void;
}

export function Board({
  board,
  language,
  selectedImportFileName,
  onChange,
  onImportFileSelected,
  onLanguageChange,
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
    onChange(addCard(board, newCardInput.value));
    newCardInput.value = "";
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
    onChange(imported);
    importInput.value = "";
  });

  controls.append(languageToggle, newCardInput, addButton, exportButton, importButton, importInput, selectedFile);
  top.append(headingGroup, controls);

  const localNote = document.createElement("p");
  localNote.className = "local-note";
  localNote.textContent = text.savedNote;

  const columns = document.createElement("div");
  columns.className = "columns";

  const commit = (nextBoard: BoardModel) => {
    saveBoard(nextBoard);
    onChange(nextBoard);
  };

  for (const state of BOARD_STATES) {
    columns.append(
      Column({
        board,
        state,
        language,
        onRename: (cardId: string, nextTitle: string) => commit(renameCard(board, cardId, nextTitle)),
        onMove: (cardId: string, nextState: BoardState) => commit(moveCard(board, cardId, nextState)),
        onNote: (cardId: string, note: string) => commit(updateCardNote(board, cardId, note)),
        onWhyStillOpen: (cardId: string, whyStillOpen: string) =>
          commit(updateCardReentryNotes(board, cardId, { whyStillOpen })),
        onIfYouReturn: (cardId: string, ifYouReturn: string) =>
          commit(updateCardReentryNotes(board, cardId, { ifYouReturn })),
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

  shell.append(top, localNote, columns, testNotes);

  return shell;
}

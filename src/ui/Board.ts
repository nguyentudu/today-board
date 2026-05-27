import { addCard, hideCard, moveCard, renameCard, updateCardNote, type Board as BoardModel } from "../domain/board";
import type { BoardState } from "../domain/state";
import { BOARD_STATES } from "../domain/state";
import { exportBoard, readImportedBoard } from "../storage/exportBoard";
import { saveBoard } from "../storage/localStore";
import { Column } from "./Column";

interface BoardProps {
  board: BoardModel;
  selectedImportFileName: string;
  onChange: (board: BoardModel) => void;
  onImportFileSelected: (fileName: string) => void;
}

export function Board({ board, selectedImportFileName, onChange, onImportFileSelected }: BoardProps): HTMLElement {
  const shell = document.createElement("div");
  shell.className = "board-shell";

  const top = document.createElement("section");
  top.className = "top-panel";

  const headingGroup = document.createElement("div");
  headingGroup.className = "heading-group";

  const title = document.createElement("h1");
  title.textContent = "Moon Today Board";

  const promise = document.createElement("p");
  promise.textContent = "Help me return without rebuilding my world.";

  headingGroup.append(title, promise);

  const controls = document.createElement("div");
  controls.className = "board-controls";

  const newCardInput = document.createElement("input");
  newCardInput.type = "text";
  newCardInput.placeholder = "Name something to hold";
  newCardInput.ariaLabel = "New card name";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "Create card";
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
  exportButton.textContent = "Export JSON";
  exportButton.addEventListener("click", () => exportBoard(board));

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json,.json";
  importInput.className = "file-input";
  importInput.ariaLabel = "Import board";

  const importLabel = document.createElement("label");
  importLabel.className = "import-label";
  importLabel.textContent = "Import board";
  importLabel.append(importInput);

  const selectedFile = document.createElement("span");
  selectedFile.className = "selected-file";
  selectedFile.textContent = selectedImportFileName;
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

  controls.append(newCardInput, addButton, exportButton, importLabel, selectedFile);
  top.append(headingGroup, controls);

  const localNote = document.createElement("p");
  localNote.className = "local-note";
  localNote.textContent = "Saved locally for continuity. No tracking.";

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
        onRename: (cardId: string, nextTitle: string) => commit(renameCard(board, cardId, nextTitle)),
        onMove: (cardId: string, nextState: BoardState) => commit(moveCard(board, cardId, nextState)),
        onNote: (cardId: string, note: string) => commit(updateCardNote(board, cardId, note)),
        onHide: (cardId: string) => commit(hideCard(board, cardId)),
      }),
    );
  }

  const testNotes = document.createElement("section");
  testNotes.className = "test-notes";

  const testNotesTitle = document.createElement("h2");
  testNotesTitle.textContent = "Test Notes";

  const testNotesList = document.createElement("ul");

  for (const note of ["Use this quietly.", "You can ignore everything here.", "No correct way to use this."]) {
    const item = document.createElement("li");
    item.textContent = note;
    testNotesList.append(item);
  }

  testNotes.append(testNotesTitle, testNotesList);

  shell.append(top, localNote, columns, testNotes);

  return shell;
}

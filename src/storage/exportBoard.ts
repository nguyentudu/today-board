import type { Board } from "../domain/board";
import { sanitizeBoard } from "./localStore";

export function exportBoard(board: Board): void {
  const blob = new Blob([JSON.stringify(board, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `today-board-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function readImportedBoard(file: File): Promise<Board> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        resolve(sanitizeBoard(JSON.parse(String(reader.result))));
      } catch {
        reject(new Error("The selected file could not be read as a board."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("The selected file could not be opened.")));
    reader.readAsText(file);
  });
}

import type { Board as BoardModel } from "./domain/board";
import { loadBoard, saveBoard } from "./storage/localStore";
import { Board as BoardView } from "./ui/Board";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const root = app;
let board = loadBoard();
let selectedImportFileName = "";

function render(nextBoard: BoardModel = board): void {
  board = nextBoard;
  saveBoard(board);
  root.replaceChildren(
    BoardView({
      board,
      selectedImportFileName,
      onChange: render,
      onImportFileSelected: (fileName: string) => {
        selectedImportFileName = fileName;
      },
    }),
  );
}

render();

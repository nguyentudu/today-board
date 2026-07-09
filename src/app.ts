import type { Board as BoardModel } from "./domain/board";
import { addCard, updateCardReentryNotes, updateCardRichContext } from "./domain/board";
import { loadBoard, saveBoard } from "./storage/localStore";
import { Board as BoardView } from "./ui/Board";
import type { Language } from "./ui/i18n";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const root = app;
let board = loadBoard();
let selectedImportFileName = "";
let language: Language = "vi";

board = applySharedLink(board);
saveBoard(board);
registerServiceWorker();

function render(nextBoard: BoardModel = board): void {
  board = nextBoard;
  saveBoard(board);
  root.replaceChildren(
    BoardView({
      board,
      language,
      selectedImportFileName,
      onChange: render,
      onImportFileSelected: (fileName: string) => {
        selectedImportFileName = fileName;
      },
      onLanguageChange: (nextLanguage: Language) => {
        language = nextLanguage;
        render();
      },
    }),
  );
}

render();

function applySharedLink(currentBoard: BoardModel): BoardModel {
  const params = new URLSearchParams(window.location.search);
  const sharedTitle = params.get("title")?.trim() ?? "";
  const sharedText = params.get("text")?.trim() ?? "";
  const sharedUrl = params.get("url")?.trim() ?? "";

  if (!sharedTitle && !sharedText && !sharedUrl) {
    return currentBoard;
  }

  const shareKey = [sharedTitle, sharedText, sharedUrl].join("|");

  if (hasHandledShare(shareKey)) {
    return currentBoard;
  }

  rememberShare(shareKey);

  let nextBoard = addCard(currentBoard, sharedTitle || sharedUrl || sharedText);
  const sharedCardId = nextBoard.cards[0]?.id;

  if (!sharedCardId) {
    return nextBoard;
  }

  if (sharedText) {
    nextBoard = updateCardReentryNotes(nextBoard, sharedCardId, { contextSnapshot: sharedText });
  }

  if (sharedUrl) {
    nextBoard = updateCardRichContext(nextBoard, sharedCardId, { richLinks: [sharedUrl] });
  }

  window.history.replaceState(null, "", window.location.pathname);
  return nextBoard;
}

function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("./sw.js").catch(() => undefined);
}

function hasHandledShare(shareKey: string): boolean {
  try {
    return sessionStorage.getItem(shareKey) === "1";
  } catch {
    return false;
  }
}

function rememberShare(shareKey: string): void {
  try {
    sessionStorage.setItem(shareKey, "1");
  } catch {
    return;
  }
}

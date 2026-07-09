import type { Board as BoardModel } from "./domain/board";
import { addCard, updateCardNote, updateCardReentryNotes, updateCardRichContext } from "./domain/board";
import { loadBoard, saveBoard } from "./storage/localStore";
import { Board as BoardView } from "./ui/Board";
import type { Language } from "./ui/i18n";
import { QuickCapture, type QuickCapturePayload } from "./ui/QuickCapture";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const root = app;
let board = loadBoard();
let selectedImportFileName = "";
let language: Language = "vi";

if (!isQuickCaptureMode()) {
  board = applySharedLink(board);
}
saveBoard(board);
registerServiceWorker();

function render(nextBoard: BoardModel = board): void {
  board = nextBoard;
  saveBoard(board);

  if (isQuickCaptureMode()) {
    root.replaceChildren(
      QuickCapture({
        language,
        initialTitle: getShareParam("title") || getShareParam("url"),
        initialNote: getShareParam("text"),
        initialLink: getShareParam("url"),
        onLanguageChange: (nextLanguage: Language) => {
          language = nextLanguage;
          render();
        },
        onSave: saveQuickCapture,
        onOpenBoard: openBoard,
      }),
    );
    return;
  }

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
      onQuickCapture: openQuickCapture,
    }),
  );
}

render();

function saveQuickCapture(capture: QuickCapturePayload): boolean {
  if (!hasQuickCaptureContent(capture)) {
    return false;
  }

  let nextBoard = addCard(board, capture.title);
  const cardId = nextBoard.cards[0]?.id;

  if (!cardId) {
    return false;
  }

  if (capture.note.trim()) {
    nextBoard = updateCardNote(nextBoard, cardId, capture.note);
  }

  const richLinks = capture.link.trim() ? [capture.link.trim()] : [];
  const imageRefs = capture.imageRef ? [capture.imageRef] : [];
  const audioRefs = capture.audioRef ? [capture.audioRef] : [];

  if (richLinks.length > 0 || imageRefs.length > 0 || audioRefs.length > 0) {
    nextBoard = updateCardRichContext(nextBoard, cardId, { richLinks, imageRefs, audioRefs });
  }

  board = nextBoard;
  saveBoard(board);
  return true;
}

function openBoard(): void {
  const nextPath = window.location.pathname.endsWith("/quick-capture")
    ? window.location.pathname.replace(/quick-capture$/, "")
    : window.location.pathname;
  window.history.replaceState(null, "", nextPath || "./");
  render();
}

function openQuickCapture(): void {
  window.history.pushState(null, "", `${window.location.pathname}?mode=quick-capture`);
  render();
}

function hasQuickCaptureContent(capture: QuickCapturePayload): boolean {
  return Boolean(
    capture.title.trim() || capture.note.trim() || capture.link.trim() || capture.imageRef || capture.audioRef,
  );
}

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

function isQuickCaptureMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "quick-capture" || window.location.pathname.endsWith("/quick-capture");
}

function getShareParam(name: "title" | "text" | "url"): string {
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? "";
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

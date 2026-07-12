import type { Board as BoardModel } from "./domain/board";
import { addCard, updateCardNote, updateCardReentryNotes, updateCardRichContext } from "./domain/board";
import { formatBytes } from "./media/localMedia";
import { BOARD_STORAGE_WARNING_BYTES, estimateBoardSize, loadBoard, saveBoard, trySaveBoard } from "./storage/localStore";
import { Board as BoardView } from "./ui/Board";
import type { Language } from "./ui/i18n";
import { QuickCapture, type QuickCapturePayload, type QuickCaptureSaveResult } from "./ui/QuickCapture";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const root = app;
let board = loadBoard();
let selectedImportFileName = "";
let language: Language = "vi";
let waitingServiceWorker: ServiceWorker | undefined;
let updateMessage: HTMLElement | undefined;
let offlineMessage: HTMLElement | undefined;

if (!isQuickCaptureMode()) {
  board = applySharedLink(board);
}
saveBoard(board);
setupNetworkStatus();
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
        storageEstimate: `${copyStorage(language).storageIndicator}: ${formatBytes(estimateBoardSize(loadBoard()))}. ${copyStorage(language).storageWarningThreshold}: ${formatBytes(BOARD_STORAGE_WARNING_BYTES)}.`,
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

function copyStorage(nextLanguage: Language): { storageIndicator: string; storageWarningThreshold: string } {
  return nextLanguage === "vi"
    ? { storageIndicator: "Dung lượng board", storageWarningThreshold: "Ngưỡng cảnh báo" }
    : { storageIndicator: "Board size", storageWarningThreshold: "Warning threshold" };
}

render();

function saveQuickCapture(capture: QuickCapturePayload): QuickCaptureSaveResult {
  if (!hasQuickCaptureContent(capture)) {
    return "empty";
  }

  let nextBoard = addCard(loadBoard(), capture.title);
  const cardId = nextBoard.cards[0]?.id;

  if (!cardId) {
    return "empty";
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

  if (!trySaveBoard(nextBoard)) {
    return "storage-error";
  }

  board = nextBoard;
  return "saved";
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
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then((registration) => {
        if (registration.waiting) {
          showUpdateAvailable(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;

          if (!worker) {
            return;
          }

          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateAvailable(worker);
            }
          });
        });
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.warn("Today Board service worker registration failed.", error);
        }
      });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

function showUpdateAvailable(worker: ServiceWorker): void {
  waitingServiceWorker = worker;

  if (updateMessage) {
    updateMessage.hidden = false;
    return;
  }

  updateMessage = document.createElement("aside");
  updateMessage.className = "app-status app-update";
  updateMessage.setAttribute("role", "status");

  const message = document.createElement("span");
  message.textContent =
    language === "vi" ? "Có bản mới của Today Board." : "A new version of Today Board is available.";

  const reload = document.createElement("button");
  reload.type = "button";
  reload.className = "quiet-button";
  reload.textContent = language === "vi" ? "Tải lại khi sẵn sàng" : "Reload when ready";
  reload.addEventListener("click", () => {
    waitingServiceWorker?.postMessage({ type: "TODAY_BOARD_SKIP_WAITING" });
  });

  updateMessage.append(message, reload);
  document.body.append(updateMessage);
}

function setupNetworkStatus(): void {
  const updateStatus = () => {
    if (navigator.onLine) {
      offlineMessage?.remove();
      offlineMessage = undefined;
      return;
    }

    if (!offlineMessage) {
      offlineMessage = document.createElement("aside");
      offlineMessage.className = "app-status offline-status";
      offlineMessage.setAttribute("role", "status");
      document.body.append(offlineMessage);
    }

    offlineMessage.textContent =
      language === "vi"
        ? "Đang ngoại tuyến. Board trên thiết bị này vẫn dùng được."
        : "Offline. The board saved on this device is still available.";
  };

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);
  updateStatus();
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

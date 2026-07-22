import type { Board as BoardModel } from "./domain/board";
import { addCard, updateCardNote, updateCardReentryNotes, updateCardRichContext } from "./domain/board";
import { formatBytes } from "./media/localMedia";
import { BOARD_STORAGE_WARNING_BYTES, estimateBoardSize, loadBoard, saveBoard, trySaveBoard } from "./storage/localStore";
import { Board as BoardView } from "./ui/Board";
import type { Language } from "./ui/i18n";
import { QuickCapture, type QuickCapturePayload, type QuickCaptureSaveResult } from "./ui/QuickCapture";
import { VoiceCapabilityProbe } from "./ui/VoiceCapabilityProbe";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const root = app;
const BUILD_ID = "2026.07.23-c";
const statusRegion = document.createElement("div");
statusRegion.className = "app-status-region";
statusRegion.setAttribute("aria-label", "Application status");
const voiceProbeMode = isVoiceCapabilityProbeMode();
const voiceEngineProbeMode = isVoiceEngineProbeMode();
let board: BoardModel | undefined;
let selectedImportFileName = "";
let language: Language = "vi";
let waitingServiceWorker: ServiceWorker | undefined;
let updateMessage: HTMLElement | undefined;
let offlineMessage: HTMLElement | undefined;
let updateActivationRequested = false;
let hasReloadedForUpdate = false;
let networkStatusTimer: number | undefined;
let destroyActiveView: (() => void | Promise<void>) | undefined;
let viewLoadSequence = 0;

window.__TODAY_BOARD_BUILD_ID__ = BUILD_ID;
renderBuildMarker();

if (!voiceProbeMode && !voiceEngineProbeMode) {
  board = loadBoard();
  if (!isQuickCaptureMode()) {
    board = applySharedLink(board);
  }
  saveBoard(board);
}
setupNetworkStatus();
registerServiceWorker();

function render(nextBoard?: BoardModel): void {
  if (nextBoard) {
    board = nextBoard;
  }
  destroyActiveView?.();
  destroyActiveView = undefined;
  renderNetworkStatus();
  renderUpdateMessage();

  if (voiceEngineProbeMode) {
    const request = ++viewLoadSequence;
    const loading = document.createElement("p");
    loading.className = "voice-engine-loading";
    loading.setAttribute("role", "status");
    loading.textContent = language === "vi" ? "Đang mở thử nghiệm Voice cục bộ..." : "Opening the local Voice probe...";
    root.replaceChildren(statusRegion, loading);
    void import("./ui/VoiceEngineProbe")
      .then(({ VoiceEngineProbe }) => {
        if (request !== viewLoadSequence) {
          return;
        }
        const probe = VoiceEngineProbe({
          language,
          onLanguageChange: (nextLanguage: Language) => {
            language = nextLanguage;
            render();
          },
        });
        destroyActiveView = probe.destroy;
        root.replaceChildren(statusRegion, probe.element);
      })
      .catch(() => {
        if (request === viewLoadSequence) {
          loading.textContent =
            language === "vi"
              ? "Không thể mở bộ máy Voice cục bộ trên thiết bị này."
              : "The local Voice engine could not be opened on this device.";
        }
      });
    return;
  }

  if (voiceProbeMode) {
    const probe = VoiceCapabilityProbe({
      language,
      onLanguageChange: (nextLanguage: Language) => {
        language = nextLanguage;
        render();
      },
    });
    destroyActiveView = probe.destroy;
    root.replaceChildren(statusRegion, probe.element);
    return;
  }

  if (!board) {
    throw new Error("Board state unavailable outside Voice probe mode.");
  }

  if (isQuickCaptureMode()) {
    root.replaceChildren(
      statusRegion,
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
    statusRegion,
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

function isVoiceCapabilityProbeMode(): boolean {
  return new URLSearchParams(window.location.search).get("voice-probe") === "1";
}

function isVoiceEngineProbeMode(): boolean {
  return new URLSearchParams(window.location.search).get("voice-engine-probe") === "1";
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
        if (import.meta.env.DEV) {
          console.info("Today Board service worker registered.", registration.scope, BUILD_ID);
        }

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
    if (!updateActivationRequested || hasReloadedForUpdate) {
      return;
    }

    hasReloadedForUpdate = true;
    window.location.reload();
  });
}

function showUpdateAvailable(worker: ServiceWorker): void {
  waitingServiceWorker = worker;

  if (!updateMessage) {
    updateMessage = document.createElement("aside");
    updateMessage.className = "app-status app-update";
    updateMessage.setAttribute("role", "status");
    updateMessage.setAttribute("aria-live", "polite");
    statusRegion.append(updateMessage);
  }

  updateMessage.hidden = false;
  renderUpdateMessage();
}

function setupNetworkStatus(): void {
  const updateStatus = () => {
    window.clearTimeout(networkStatusTimer);
    networkStatusTimer = window.setTimeout(renderNetworkStatus, 150);
  };

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);
  renderNetworkStatus();
}

function renderNetworkStatus(): void {
    if (navigator.onLine) {
      offlineMessage?.remove();
      offlineMessage = undefined;
      return;
    }

    if (!offlineMessage) {
      offlineMessage = document.createElement("aside");
      offlineMessage.className = "app-status offline-status";
      offlineMessage.setAttribute("role", "status");
      offlineMessage.setAttribute("aria-live", "polite");
      statusRegion.prepend(offlineMessage);
    }

    offlineMessage.textContent =
      language === "vi"
        ? "Đang ngoại tuyến. Board trên thiết bị này vẫn dùng được."
        : "Offline. The board saved on this device is still available.";
}

function renderUpdateMessage(): void {
  if (!updateMessage) {
    return;
  }

  const message = document.createElement("span");
  message.textContent =
    language === "vi" ? "Có bản mới của Today Board." : "A new version of Today Board is available.";

  const warning = document.createElement("span");
  warning.className = "update-warning";
  warning.hidden = true;

  const reload = document.createElement("button");
  reload.type = "button";
  reload.className = "quiet-button";
  reload.textContent = language === "vi" ? "Tải lại khi sẵn sàng" : "Reload when ready";
  reload.addEventListener("click", () => {
    const blockedReason = getUpdateBlockReason();

    if (blockedReason) {
      warning.textContent = blockedReason;
      warning.hidden = false;
      return;
    }

    warning.hidden = true;
    updateActivationRequested = true;
    waitingServiceWorker?.postMessage({ type: "TODAY_BOARD_SKIP_WAITING" });
  });

  updateMessage.replaceChildren(message, reload, warning);
}

function getUpdateBlockReason(): string | null {
  if (document.documentElement.dataset.voiceEngineBusy === "true") {
    return language === "vi"
      ? "Bộ máy Voice cục bộ đang ghi âm hoặc xử lý. Hãy dừng hoặc đợi hoàn tất trước khi tải lại."
      : "The local Voice engine is recording or processing. Stop it or wait before reloading.";
  }

  if (document.documentElement.dataset.voiceRecognitionActive === "true") {
    return language === "vi"
      ? "Đang nhận dạng trên thiết bị. Hãy dừng trước khi tải lại."
      : "On-device recognition is active. Stop it before reloading.";
  }

  if (document.querySelector(".card-editor")) {
    return language === "vi"
      ? "Bạn đang chỉnh sửa. Hãy lưu hoặc thoát trước khi tải lại."
      : "You are editing. Save or exit before reloading.";
  }

  if (hasUnsavedQuickCapture()) {
    return language === "vi"
      ? "Bạn đang ghi nhanh. Hãy lưu hoặc mở board trước khi tải lại."
      : "Quick Capture has unsaved content. Save it or open the board before reloading.";
  }

  if (document.querySelector('[data-recording="true"]')) {
    return language === "vi"
      ? "Đang ghi âm. Hãy dừng trước khi tải lại."
      : "Voice recording is active. Stop it before reloading.";
  }

  if (document.documentElement.dataset.pwaBusy === "true") {
    return language === "vi"
      ? "Đang xử lý file. Hãy đợi trước khi tải lại."
      : "A file is being processed. Wait before reloading.";
  }

  return null;
}

function hasUnsavedQuickCapture(): boolean {
  const form = document.querySelector<HTMLFormElement>(".quick-capture-form");

  if (!form || form.dataset.saved === "true") {
    return false;
  }

  const hasText = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea'),
  ).some((field) => field.value.trim().length > 0);
  const hasMedia = Boolean(form.querySelector(".quick-media-preview img, .quick-media-preview audio"));
  return hasText || hasMedia;
}

function renderBuildMarker(): void {
  if (new URLSearchParams(window.location.search).get("debug-build") !== "1") {
    return;
  }

  const marker = document.createElement("small");
  marker.className = "build-marker";
  marker.textContent = `Build: ${BUILD_ID}`;
  statusRegion.append(marker);
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

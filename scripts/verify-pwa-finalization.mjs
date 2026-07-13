import { readFileSync } from "node:fs";

const app = readFileSync("src/app.ts", "utf8");
const board = readFileSync("src/ui/Board.ts", "utf8");
const cardEditor = readFileSync("src/ui/CardEditor.ts", "utf8");
const quickCapture = readFileSync("src/ui/QuickCapture.ts", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const css = readFileSync("styles/main.css", "utf8");
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

const buildId = app.match(/BUILD_ID = "([^"]+)"/)?.[1];
const cacheVersion = sw.match(/CACHE_VERSION = "([^"]+)"/)?.[1];
const controllerHandler = app.match(/navigator\.serviceWorker\.addEventListener\("controllerchange"[\s\S]*?\n  \}\);/)?.[0] ?? "";
const updateHandler = app.slice(app.indexOf("function showUpdateAvailable"), app.indexOf("function setupNetworkStatus"));
const networkHandler = app.slice(app.indexOf("function setupNetworkStatus"), app.indexOf("function renderUpdateMessage"));
const dismissalHandler = board.slice(board.indexOf("function setupSearchKeyboardDismissal"), board.indexOf("function createStateFilters"));

assert("build marker is exposed outside board data", Boolean(buildId) && app.includes("window.__TODAY_BOARD_BUILD_ID__ = BUILD_ID"));
assert("debug marker is opt-in", app.includes('get("debug-build") !== "1"') && app.includes("Build: ${BUILD_ID}"));
assert("service worker cache version matches deployed build", buildId?.replace(/\./g, "-") === cacheVersion);

assert("waiting worker is detected", app.includes("registration.waiting") && app.includes("updatefound"));
assert("update notice is inserted into stable status region", updateHandler.includes("statusRegion.append(updateMessage)"));
assert("update activation requires explicit click", app.includes('reload.addEventListener("click"') && app.includes("updateActivationRequested = true"));
assert("update is blocked during Edit", app.includes('document.querySelector(".card-editor")'));
assert("update is blocked for unsaved Quick Capture", app.includes("hasUnsavedQuickCapture()") && quickCapture.includes('form.dataset.saved = "true"'));
assert("update is blocked during recording", app.includes('[data-recording="true"]') && cardEditor.includes('button.dataset.recording = "true"') && quickCapture.includes('button.dataset.recording = "true"'));
assert("update is blocked during file work", app.includes('dataset.pwaBusy === "true"') && board.includes('dataset.pwaBusy = "true"'));
assert("controller change reloads only after request", controllerHandler.includes("!updateActivationRequested") && controllerHandler.includes("hasReloadedForUpdate"));
assert("controller change reload guard is set before reload", controllerHandler.indexOf("hasReloadedForUpdate = true") < controllerHandler.indexOf("window.location.reload()"));
assert("service worker does not skip waiting during install", !sw.match(/self\.addEventListener\("install"[\s\S]*?\n\}\);/)?.[0].includes("skipWaiting"));
assert("service worker activates only from explicit message", sw.includes("TODAY_BOARD_SKIP_WAITING") && sw.includes("self.skipWaiting()"));
assert("old Today Board caches are scoped for deletion", sw.includes("key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE"));
assert("unrelated caches are preserved", sw.includes("!key.startsWith(CACHE_PREFIX)") && !sw.includes("keys.map((key) => caches.delete(key))"));
assert("service worker never touches localStorage", !sw.includes("localStorage"));
assert("user media is absent from app-shell cache", !sw.includes("imageRefs") && !sw.includes("audioRefs") && !sw.includes("FileReader"));

assert("offline status is rendered in document flow", networkHandler.includes("statusRegion.prepend(offlineMessage)") && !css.match(/\.offline-status\s*\{[^}]*position:\s*fixed/s));
assert("offline status is safe-area protected by app root", css.includes("#app") && css.includes("env(safe-area-inset-bottom)"));
assert("offline status disappears online", networkHandler.includes("offlineMessage?.remove()"));
assert("network changes are lightly settled", networkHandler.includes("window.setTimeout(renderNetworkStatus, 150)"));
assert("network status does not write storage or remount board", !networkHandler.includes("localStorage") && !networkHandler.includes("replaceChildren"));
assert("status UI has no fixed content-obscuring overlay", !css.match(/\.app-status\s*\{[^}]*position:\s*fixed/s));

assert("tap outside blurs focused search", dismissalHandler.includes('shell.addEventListener("pointerdown"') && dismissalHandler.includes("search.blur()"));
assert("interactive targets are excluded from tap blur", dismissalHandler.includes("INTERACTIVE_DISMISS_SELECTOR") && board.includes('"button"') && board.includes('"audio"'));
assert("IME composition prevents forced blur", dismissalHandler.includes("isComposing()"));
assert("scroll gesture uses a threshold and blurs once", dismissalHandler.includes("Math.abs(event.clientY - touchStartY) >= 14") && dismissalHandler.includes("blurredForGesture"));
assert("scroll listener is passive", dismissalHandler.includes("{ passive: true }"));
assert("dismissal path does not mutate retrieval or board", !dismissalHandler.includes("retrievalQuery =") && !dismissalHandler.includes("onChange") && !dismissalHandler.includes("localStorage"));
assert("search input is returned as the same mounted node", board.includes("searchInput: search") && board.includes("setupSearchKeyboardDismissal(shell, retrievalView.searchInput"));
assert("search debounce remains 120ms", board.includes("window.setTimeout(updateResults, 120)"));

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

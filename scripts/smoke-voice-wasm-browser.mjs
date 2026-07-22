import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const APP_PORT = 4174;
const DEBUG_PORT = 9334;
const APP_URL = `http://127.0.0.1:${APP_PORT}/?voice-engine-probe=1`;
const TIMEOUT_MS = 180_000;
const browserCandidates = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

const browserPath = browserCandidates.find(existsSync);
if (!browserPath) {
  console.error("SKIP browser smoke: no supported local Chromium executable found");
  process.exit(2);
}

const profile = await mkdtemp(join(tmpdir(), "today-board-wasm-smoke-"));
const viteEntry = join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
const vite = spawn(process.execPath, [viteEntry, "--host", "127.0.0.1", "--port", String(APP_PORT), "--strictPort"], {
  cwd: process.cwd(),
  stdio: "ignore",
});
let browser;
let socket;

try {
  await waitForHttp(APP_URL, 30_000);
  browser = spawn(browserPath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-webgpu",
    "--disable-features=Vulkan,WebGPU,UnsafeWebGPU",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--window-size=360,800",
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });

  await waitForJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`, 30_000);
  const target = await waitForJson(
    `http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(APP_URL)}`,
    30_000,
    "PUT",
  );
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await once(socket, "open", 15_000);
  const cdp = createCdp(socket);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });

  await poll(async () => {
    const ready = await cdp.evaluate(`Boolean(document.querySelector('[data-testid="voice-engine-install"]'))`);
    return ready ? true : undefined;
  }, 30_000);

  const preflight = await cdp.evaluate(`(async () => {
    let webGpuAdapterAvailable = false;
    try {
      webGpuAdapterAvailable = Boolean(await navigator.gpu?.requestAdapter());
    } catch {}
    return {
      webGpuDisabled: !webGpuAdapterAvailable,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    };
  })()`);
  if (!preflight.webGpuDisabled) {
    throw new Error("WebGPU remained exposed despite the GPU-disabled browser launch");
  }
  if (preflight.scrollWidth > preflight.width) {
    throw new Error(`Horizontal overflow at 360px: ${preflight.scrollWidth} > ${preflight.width}`);
  }

  const started = await cdp.evaluate(`(() => {
    const backend = document.querySelector('[data-testid="voice-engine-backend"]');
    const install = document.querySelector('[data-testid="voice-engine-install"]');
    if (!(backend instanceof HTMLSelectElement) || !(install instanceof HTMLButtonElement)) return false;
    backend.value = 'wasm';
    backend.dispatchEvent(new Event('change', { bubbles: true }));
    install.click();
    return true;
  })()`);
  if (!started) {
    throw new Error("Could not start the explicit WASM installation action");
  }

  const result = await poll(async () => {
    const state = await cdp.evaluate(`(() => {
      const root = document.querySelector('[data-testid="voice-engine-probe"]');
      const status = document.querySelector('[data-testid="voice-engine-status"]')?.textContent ?? '';
      return { status, text: root?.textContent ?? '' };
    })()`);
    if (state.text.includes("Exact model cache verified for offline use") || state.text.includes("Đã xác minh chính xác bộ nhớ đệm để dùng ngoại tuyến")) {
      return state;
    }
    if (state.status.includes("failed") || state.status.includes("thất bại")) {
      throw new Error(state.status);
    }
    return undefined;
  }, TIMEOUT_MS);

  console.log(JSON.stringify({
    result: "PASS",
    browser: browserPath,
    webgpuDisabled: preflight.webGpuDisabled,
    viewport: `${preflight.width}x800`,
    horizontalOverflow: false,
    backend: "wasm",
    offlineSessionVerified: true,
    status: result.status,
  }, null, 2));
} finally {
  socket?.close();
  browser?.kill();
  vite.kill();
  if (browser) await waitForExit(browser, 5_000);
  await rm(profile, { recursive: true, force: true, maxRetries: 6, retryDelay: 500 }).catch(() => undefined);
}

function createCdp(ws) {
  let sequence = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });
  return {
    send(method, params = {}) {
      const id = ++sequence;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    async evaluate(expression) {
      const response = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result.value;
    },
  };
}

async function waitForHttp(url, timeout) {
  return poll(async () => {
    try {
      const response = await fetch(url);
      return response.ok ? true : undefined;
    } catch {
      return undefined;
    }
  }, timeout);
}

async function waitForJson(url, timeout, method = "GET") {
  return poll(async () => {
    try {
      const response = await fetch(url, { method });
      return response.ok ? response.json() : undefined;
    } catch {
      return undefined;
    }
  }, timeout);
}

async function waitForExit(child, timeout) {
  if (child.exitCode !== null) return;
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);
}

async function poll(check, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = await check();
    if (result !== undefined) return result;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out after ${timeout} ms`);
}

function once(target, eventName, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${eventName}`)), timeout);
    target.addEventListener(eventName, () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}

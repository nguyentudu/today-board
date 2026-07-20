const CACHE_PREFIX = "today-board-shell";
const CACHE_VERSION = "2026-07-20-c";
const SHELL_CACHE = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const APP_SCOPE = new URL(self.registration.scope).pathname;
const CRITICAL_ASSETS = ["./manifest.webmanifest", "./icon.svg"];
const OPTIONAL_ASSETS = [
  "./icons/icon-144.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-256.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      await cacheNavigationShell(cache);
      await cache.addAll(CRITICAL_ASSETS);
      await Promise.allSettled(OPTIONAL_ASSETS.map((asset) => cache.add(asset)));
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      const obsoleteTodayBoardCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE);
      const preservedCaches = keys.filter((key) => !key.startsWith(CACHE_PREFIX));

      await Promise.all(obsoleteTodayBoardCaches.map((key) => caches.delete(key)));

      if (isDevelopmentHost()) {
        console.info("Today Board service worker activated.", {
          version: CACHE_VERSION,
          cache: SHELL_CACHE,
          deleted: obsoleteTodayBoardCaches,
          preserved: preservedCaches,
        });
      }

      await self.clients.claim();
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "TODAY_BOARD_SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_SCOPE)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isShellAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put("./", response.clone());
      await cacheDiscoveredShellAssets(cache, response.clone());
    }

    return response;
  } catch {
    return (await cache.match("./")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.ok && isSafeShellResponse(request, response)) {
    await cache.put(request, response.clone());
  }

  return response;
}

function isShellAsset(url) {
  return (
    url.pathname === `${APP_SCOPE}manifest.webmanifest` ||
    url.pathname === `${APP_SCOPE}icon.svg` ||
    url.pathname.startsWith(`${APP_SCOPE}icons/`) ||
    url.pathname.startsWith(`${APP_SCOPE}assets/`)
  );
}

function isSafeShellResponse(request, response) {
  const url = new URL(request.url);
  const type = response.headers.get("content-type") || "";
  return (
    url.pathname.startsWith(`${APP_SCOPE}assets/`) ||
    url.pathname.startsWith(`${APP_SCOPE}icons/`) ||
    type.includes("manifest") ||
    type.includes("image/svg+xml")
  );
}

async function cacheNavigationShell(cache) {
  const response = await fetch("./", { cache: "reload" });

  if (!response.ok) {
    throw new Error("Today Board shell could not be cached.");
  }

  await cache.put("./", response.clone());
  await cacheDiscoveredShellAssets(cache, response);
}

async function cacheDiscoveredShellAssets(cache, response) {
  const html = await response.text();
  const assets = Array.from(html.matchAll(/(?:src|href)="(\.\/(?:assets|icons)\/[^"]+)"/g), (match) => match[1]);
  const uniqueAssets = [...new Set(assets)];

  await cache.addAll(uniqueAssets);
}

function isDevelopmentHost() {
  return self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";
}

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";

const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));
const html = readFileSync("index.html", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const app = readFileSync("src/app.ts", "utf8");
const css = readFileSync("styles/main.css", "utf8");
const failures = [];

function assert(name, condition) {
  if (!condition) {
    failures.push(name);
  } else {
    console.log(`PASS ${name}`);
  }
}

function pngSize(path) {
  const buffer = readFileSync(path);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function directorySize(path) {
  if (!existsSync(path)) {
    return 0;
  }

  return readdirSync(path, { withFileTypes: true }).reduce((total, entry) => {
    const entryPath = `${path}/${entry.name}`;
    return total + (entry.isDirectory() ? directorySize(entryPath) : statSync(entryPath).size);
  }, 0);
}

assert(
  "manifest has required identity fields",
  manifest.id === "/today-board/" && manifest.name === "Moon Today Board" && manifest.short_name === "Today Board",
);
assert(
  "manifest start_url and scope target GitHub Pages subpath",
  manifest.start_url === "/today-board/" && manifest.scope === "/today-board/",
);
assert("manifest standalone display configured", manifest.display === "standalone");
assert("manifest language and direction configured", manifest.lang === "vi" && manifest.dir === "ltr");
assert(
  "manifest theme and background colors configured",
  /^#[0-9a-f]{6}$/i.test(manifest.theme_color) && /^#[0-9a-f]{6}$/i.test(manifest.background_color),
);
assert("manifest includes share target only for existing quick capture", manifest.share_target?.action === "./?mode=quick-capture");

for (const size of [192, 512]) {
  const icon = manifest.icons.find((entry) => entry.sizes === `${size}x${size}` && entry.type === "image/png");
  assert(`${size} icon declared`, Boolean(icon));
  assert(`${size} icon file exists`, icon && existsSync(`public/${icon.src.replace("./", "")}`));
  const dimensions = icon ? pngSize(`public/${icon.src.replace("./", "")}`) : { width: 0, height: 0 };
  assert(`${size} icon dimensions match`, dimensions.width === size && dimensions.height === size);
}

assert("maskable icon declared", manifest.icons.some((entry) => String(entry.purpose).includes("maskable")));
assert("Apple touch icon exists", html.includes('rel="apple-touch-icon"') && existsSync("public/icons/icon-180.png"));
assert("HTML has viewport fit cover", html.includes("viewport-fit=cover"));
assert("HTML has manifest and theme color", html.includes('rel="manifest"') && html.includes('name="theme-color"'));
assert("HTML has standalone mobile metadata", html.includes("mobile-web-app-capable") && html.includes("apple-mobile-web-app-capable"));

assert("service worker uses scoped cache prefix and version", sw.includes('CACHE_PREFIX = "today-board-shell"') && sw.includes("CACHE_VERSION"));
assert("service worker caches app shell only", sw.includes("CRITICAL_ASSETS") && !sw.includes("localStorage"));
assert("service worker does not precache user media", !sw.includes("imageRefs") && !sw.includes("audioRefs") && !sw.includes("FileReader"));
assert("service worker cleans only Today Board caches", sw.includes("key.startsWith(CACHE_PREFIX)") && sw.includes("key !== SHELL_CACHE"));
assert("service worker preserves unrelated origins", sw.includes("url.origin !== self.location.origin"));
assert("service worker navigation fallback scoped", sw.includes('request.mode === "navigate"') && sw.includes("url.pathname.startsWith(APP_SCOPE)"));
const installHandler = sw.match(/self\.addEventListener\("install"[\s\S]*?\n\}\);/)?.[0] || "";
assert("service worker skips waiting only on message", sw.includes("TODAY_BOARD_SKIP_WAITING") && !installHandler.includes("skipWaiting"));

assert(
  "app registers service worker only in production",
  app.includes("import.meta.env.PROD") && app.includes('register("./sw.js", { scope: "./" })'),
);
assert("app detects waiting worker", app.includes("registration.waiting") && app.includes("updatefound"));
assert("app avoids forced reload until user action", app.includes("Reload when ready") && app.includes("TODAY_BOARD_SKIP_WAITING"));
assert("app has offline status", app.includes("offline-status") && app.includes("Offline. The board saved on this device is still available."));
assert("safe area variables are used", css.includes("env(safe-area-inset-top)") && css.includes("env(safe-area-inset-bottom)"));

const shellSize = ["dist/index.html", "dist/manifest.webmanifest", "dist/icon.svg"]
  .filter(existsSync)
  .reduce((total, path) => total + statSync(path).size, 0);
const assetSize = directorySize("dist/assets") + directorySize("dist/icons");
console.log(`INFO app-shell cache bytes ${shellSize + assetSize}`);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

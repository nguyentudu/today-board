import assert from "node:assert/strict";
import { createServer } from "vite";

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const sync = await vite.ssrLoadModule("/src/sync/syncClient.ts");
  const preview = sync.requestRemoteDeletion();
  assert.deepEqual(preview, {
    enabled: false,
    recoveryWindowDays: 7,
    localBoardDeleted: false,
    reason: "fixture_only_sync_not_configured",
  });
  const source = await Promise.all([
    "src/sync/syncClient.ts",
    "src/sync/contracts.ts",
    "src/storage/migrateV1.ts",
  ].map(async (path) => (await import("node:fs/promises")).readFile(path, "utf8")));
  assert.ok(!/localStorage\.removeItem|\.clear\s*\(/.test(source.join("\n")));
  console.log("Remote deletion boundary verification passed.");
} finally {
  await vite.close();
}

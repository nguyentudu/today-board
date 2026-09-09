import assert from "node:assert/strict";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const sessions = await vite.ssrLoadModule("/src/account/session.ts");
  const sync = await vite.ssrLoadModule("/src/sync/syncClient.ts");
  assert.deepEqual(sync.requestSync(), { enabled: false, reason: "fixture_only_sync_not_configured" });
  const local = { updatedAt: "before-offline-attempt" };
  const transport = { async push() { throw new Error("offline"); }, async pull() { throw new Error("offline"); } };
  const client = sync.createInjectedFixtureSyncClient(sessions.syntheticFixtureSession("acct_fixture_ada"), transport);
  await assert.rejects(() => client.pull("board"), /offline/);
  const badTransport = {
    async push(version) { return version; },
    async pull() {
      return { accountId: "acct_fixture_other", objectId: "board", versionId: "v1", baseVersionId: null, createdAt: "2026-01-01T00:00:00Z", envelope: { accountId: "acct_fixture_other", objectId: "board", versionId: "v1", schemaVersion: 1, algorithm: "AES-GCM", nonce: "nonce", ciphertext: "ciphertext" } };
    },
  };
  const validatingClient = sync.createInjectedFixtureSyncClient(sessions.syntheticFixtureSession("acct_fixture_ada"), badTransport);
  await assert.rejects(() => validatingClient.pull("board"), /ownership mismatch/);
  assert.deepEqual(local, { updatedAt: "before-offline-attempt" }, "network failure must not mutate local state");
  assert.throws(() => sync.createInjectedFixtureSyncClient(sessions.DISABLED_ACCOUNT_SESSION, transport));
  const sources = await Promise.all([
    "src/account/authClient.ts",
    "src/account/session.ts",
    "src/sync/syncClient.ts",
    "src/sync/contracts.ts",
  ].map((path) => readFile(path, "utf8")));
  assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(sources.join("\n")));
  console.log("Offline sync verification passed.");
} finally {
  await vite.close();
}

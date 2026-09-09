import assert from "node:assert/strict";
import { createServer } from "vite";

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const conflicts = await vite.ssrLoadModule("/src/sync/conflicts.ts");
  const envelope = { accountId: "acct_fixture_ada", objectId: "board", versionId: "cipher", schemaVersion: 1, algorithm: "AES-GCM", nonce: "nonce", ciphertext: "ciphertext" };
  const remote = { accountId: envelope.accountId, objectId: "board", versionId: "remote-v2", baseVersionId: "v1", createdAt: "2026-01-02T00:00:00Z", envelope };
  const local = { ...remote, versionId: "local-v2" };
  const conflict = conflicts.detectSyncConflict(local, remote);
  assert.equal(conflict.automaticResolution, null);
  assert.throws(() => conflicts.resolveSyncConflict(conflict, null));
  assert.equal(conflicts.resolveSyncConflict(conflict, "keep-local").selectedVersionId, "local-v2");
  assert.equal(conflicts.resolveSyncConflict(conflict, "keep-remote").selectedVersionId, "remote-v2");
  assert.equal(conflicts.resolveSyncConflict(conflict, "fork").selectedVersionId, null);
  const ancestor = { ...remote, versionId: "v1", baseVersionId: null, envelope: { ...envelope, versionId: "v1" } };
  const descendant = { ...remote, versionId: "v2", baseVersionId: "v1", envelope: { ...envelope, versionId: "v2" } };
  assert.equal(conflicts.detectSyncConflict(ancestor, descendant), null);
  assert.equal(conflicts.detectSyncConflict(descendant, ancestor), null);
  console.log("Sync conflict verification passed.");
} finally {
  await vite.close();
}

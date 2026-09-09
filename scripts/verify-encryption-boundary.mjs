import assert from "node:assert/strict";
import { createServer } from "vite";

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const envelopes = await vite.ssrLoadModule("/src/crypto/boardEnvelope.ts");
  const recovery = await vite.ssrLoadModule("/src/crypto/recoveryKit.ts");
  const identity = { accountId: "acct_fixture_ada", objectId: "board", versionId: "v1", schemaVersion: 1 };
  const board = { privateTitle: "never on the server", cards: [{ note: "plaintext sentinel" }] };
  const key = await envelopes.generateContentKey();
  const encrypted = await envelopes.encryptBoardEnvelope(board, key, identity);
  assert.equal(encrypted.algorithm, "AES-GCM");
  assert.ok(!JSON.stringify(encrypted).includes("plaintext sentinel"));
  assert.deepEqual(await envelopes.decryptBoardEnvelope(encrypted, key, identity), board);
  await assert.rejects(() => envelopes.decryptBoardEnvelope(encrypted, key, { ...identity, versionId: "v2" }));
  const code = recovery.generateRecoveryCode();
  const kit = await recovery.createRecoveryKit(key, code);
  assert.ok(!JSON.stringify(kit).includes(code));
  const restored = await recovery.importRecoveryKit(kit, code);
  assert.deepEqual(await envelopes.decryptBoardEnvelope(encrypted, restored, identity), board);
  await assert.rejects(() => recovery.importRecoveryKit(kit, "incorrect-recovery-code-long-enough"));
  await assert.rejects(() => recovery.importRecoveryKit({ ...kit, kdf: "unsupported" }, code), /Unsupported recovery kit/);
  const mutableIdentity = { ...identity, versionId: "snapshot-v1" };
  const pendingEnvelope = envelopes.encryptBoardEnvelope(board, key, mutableIdentity);
  mutableIdentity.versionId = "mutated-v2";
  const snapshotEnvelope = await pendingEnvelope;
  assert.equal(snapshotEnvelope.versionId, "snapshot-v1");
  assert.deepEqual(await envelopes.decryptBoardEnvelope(snapshotEnvelope, key, { ...identity, versionId: "snapshot-v1" }), board);
  console.log("Encryption boundary verification passed.");
} finally {
  await vite.close();
}

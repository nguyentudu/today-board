import assert from "node:assert/strict";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const migration = await vite.ssrLoadModule("/src/storage/migrateV1.ts");
  const raw = JSON.stringify({ version: 1, updatedAt: "2026-01-01T00:00:00.000Z", cards: [] });
  const legacy = { value: raw, removed: false, getItem(key) { return key === migration.LEGACY_BOARD_KEY ? this.value : null; } };
  const state = { board: null, digest: null, fail: false };
  const destination = {
    async readBoard() { return structuredClone(state.board); },
    async readMigrationDigest() { return state.digest; },
    async commitMigratedBoard(board, digest) {
      if (state.fail) throw new Error("fixture transaction failed");
      state.board = structuredClone(board);
      state.digest = digest;
    },
  };
  const first = await migration.migrateV1LocalStorage(legacy, destination);
  assert.equal(first.status, "migrated");
  assert.equal(legacy.value, raw, "legacy rollback source must remain untouched");
  assert.equal((await migration.migrateV1LocalStorage(legacy, destination)).status, "already-migrated");
  const prior = structuredClone(state.board);
  legacy.value = JSON.stringify({ version: 1, updatedAt: "2025-01-01T00:00:00.000Z", cards: [] });
  assert.equal((await migration.migrateV1LocalStorage(legacy, destination)).status, "recovery-conflict");
  assert.deepEqual(state.board, prior, "changed legacy rollback data must not replace the authoritative board");
  const failingState = { board: null, digest: null };
  const failingDestination = {
    async readBoard() { return failingState.board; },
    async readMigrationDigest() { return failingState.digest; },
    async commitMigratedBoard() { throw new Error("fixture transaction failed"); },
  };
  assert.equal((await migration.migrateV1LocalStorage({ ...legacy, value: raw }, failingDestination)).status, "failed");
  const source = await readFile("src/storage/migrateV1.ts", "utf8");
  assert.ok(!source.includes("removeItem"));
  assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(source));
  console.log("IndexedDB migration contract verification passed.");
} finally {
  await vite.close();
}

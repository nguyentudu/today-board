import { sanitizeBoard } from "./localStore";
import type { MigrationCommitStore } from "./indexedDbStore";

export const LEGACY_BOARD_KEY = "moon.today-board.v1";

export interface LegacyStorageReader {
  getItem(key: string): string | null;
}

export type MigrationResult =
  | { status: "nothing-to-migrate" }
  | { status: "already-migrated"; sourceDigest: string }
  | { status: "migrated"; sourceDigest: string }
  | { status: "failed"; reason: string };

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function migrateV1LocalStorage(
  legacy: LegacyStorageReader,
  destination: MigrationCommitStore,
): Promise<MigrationResult> {
  const raw = legacy.getItem(LEGACY_BOARD_KEY);
  if (raw === null) return { status: "nothing-to-migrate" };
  const sourceDigest = await sha256(raw);
  if (await destination.readMigrationDigest() === sourceDigest) {
    return { status: "already-migrated", sourceDigest };
  }

  try {
    const board = sanitizeBoard(JSON.parse(raw));
    await destination.commitMigratedBoard(board, sourceDigest);
    const persisted = await destination.readBoard();
    if (!persisted || JSON.stringify(persisted) !== JSON.stringify(board)) {
      throw new Error("Post-migration verification failed");
    }
    // The legacy value is intentionally preserved as a recovery-only source.
    return { status: "migrated", sourceDigest };
  } catch (error) {
    return { status: "failed", reason: error instanceof Error ? error.message : "Migration failed" };
  }
}

import type { SyncConflict, SyncVersion } from "./contracts";

export type ConflictChoice = "keep-local" | "keep-remote" | "fork";

export function detectSyncConflict(local: SyncVersion, remote: SyncVersion): SyncConflict | null {
  if (
    local.versionId === remote.versionId ||
    local.baseVersionId === remote.versionId ||
    remote.baseVersionId === local.versionId
  ) return null;
  return Object.freeze({
    kind: "divergent_versions" as const,
    localVersionId: local.versionId,
    remoteVersionId: remote.versionId,
    automaticResolution: null,
  });
}

export function resolveSyncConflict(
  conflict: SyncConflict,
  choice: ConflictChoice | null,
): { choice: ConflictChoice; selectedVersionId: string | null } {
  if (!choice) throw new Error("A sync conflict requires an explicit user choice");
  if (choice === "keep-local") return { choice, selectedVersionId: conflict.localVersionId };
  if (choice === "keep-remote") return { choice, selectedVersionId: conflict.remoteVersionId };
  return { choice, selectedVersionId: null };
}

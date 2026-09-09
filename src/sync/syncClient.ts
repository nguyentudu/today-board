import { requireFixtureSession, type AccountSession } from "../account/session";
import type { DisabledSyncAction, InjectedSyncTransport, RemoteDeletionPreview, SyncVersion } from "./contracts";

export const SYNC_CLIENT_BOUNDARY = Object.freeze({
  mode: "disabled_fixture_contract" as const,
  syncEnabled: false as const,
  remoteStorageConnected: false as const,
  accountRequired: true as const,
});

export function requestSync(): DisabledSyncAction {
  return { enabled: false, reason: "fixture_only_sync_not_configured" };
}

export function requestRemoteDeletion(): RemoteDeletionPreview {
  return {
    enabled: false,
    recoveryWindowDays: 7,
    localBoardDeleted: false,
    reason: "fixture_only_sync_not_configured",
  };
}

export function installSyncClientBoundary(root: HTMLElement): void {
  root.dataset.syncEnabled = "false";
  root.dataset.remoteStorageConnected = "false";
}

/** Test-only client. A transport must be injected explicitly; no network primitive is embedded here. */
export function createInjectedFixtureSyncClient(session: AccountSession, transport: InjectedSyncTransport) {
  const accountId = requireFixtureSession(session);
  return {
    async push(version: SyncVersion) {
      if (version.accountId !== accountId) throw new Error("Sync object ownership mismatch");
      if (
        version.envelope.accountId !== version.accountId ||
        version.envelope.objectId !== version.objectId ||
        version.envelope.versionId !== version.versionId
      ) throw new Error("Sync envelope identity mismatch");
      return transport.push(structuredClone(version));
    },
    async pull(objectId: string) {
      return transport.pull(accountId, objectId);
    },
  };
}

import type { EncryptedBoardEnvelope } from "../crypto/boardEnvelope";

export interface SyncVersion {
  accountId: string;
  objectId: string;
  versionId: string;
  baseVersionId: string | null;
  createdAt: string;
  envelope: EncryptedBoardEnvelope;
}

export interface SyncConflict {
  kind: "divergent_versions";
  localVersionId: string;
  remoteVersionId: string;
  automaticResolution: null;
}

export interface DisabledSyncAction {
  enabled: false;
  reason: "fixture_only_sync_not_configured";
}

export interface RemoteDeletionPreview {
  enabled: false;
  recoveryWindowDays: 7;
  localBoardDeleted: false;
  reason: "fixture_only_sync_not_configured";
}

export interface InjectedSyncTransport {
  push(version: SyncVersion): Promise<{ accepted: true; currentVersionId: string } | { accepted: false; conflict: SyncConflict }>;
  pull(accountId: string, objectId: string): Promise<SyncVersion | null>;
}

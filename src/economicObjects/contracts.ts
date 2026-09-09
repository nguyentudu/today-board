export const ECONOMIC_OBJECT_PROJECTION_VERSION = "economic-object-attention-v0.1" as const;

export type EconomicObjectDomain = "game_asset" | "digital_business" | "platform_account" | "unknown";
export type ProjectionSourceSystem = "fixture" | "game_seed" | "proof_commerce";
export type ProofState = "verified" | "partial" | "unverified" | "unknown";
export type RightsState = "clear" | "conditional" | "unresolved" | "unknown";
export type TransferabilityState =
  | "transferable"
  | "conditionally_transferable"
  | "license_only"
  | "non_transferable"
  | "unknown";
export type AttentionState = "blocked" | "actionable" | "opportunity" | "watch" | "no_action";
export type ActionTargetSystem = "today_board" | "proof_commerce" | "game_seed" | "founder_runtime";

export interface EconomicObjectAttentionProjection {
  projectionVersion: typeof ECONOMIC_OBJECT_PROJECTION_VERSION;
  object: {
    domain: EconomicObjectDomain;
    objectId: string;
    versionId: string;
    title: string;
  };
  source: {
    system: ProjectionSourceSystem;
    sourceVersion: string;
    observedAt: string;
  };
  proof: {
    state: ProofState;
    evidenceRefs: readonly string[];
  };
  rights: {
    state: RightsState;
  };
  transferability: {
    state: TransferabilityState;
  };
  attention: {
    state: AttentionState;
    whyNow: string;
    blockers: readonly string[];
  };
  nextAction: {
    kind: string;
    label: string;
    targetSystem: ActionTargetSystem;
    founderApprovalRequired: boolean;
  };
}

export function isFailClosedProjection(projection: EconomicObjectAttentionProjection): boolean {
  const unresolvedTruth =
    projection.proof.state !== "verified" ||
    projection.rights.state === "conditional" ||
    projection.rights.state === "unknown" ||
    projection.rights.state === "unresolved" ||
    projection.transferability.state === "conditionally_transferable" ||
    projection.transferability.state === "unknown" ||
    projection.transferability.state === "non_transferable";

  return !unresolvedTruth || (
    projection.attention.state === "blocked" &&
    projection.attention.blockers.length > 0 &&
    projection.nextAction.targetSystem === "proof_commerce" &&
    projection.nextAction.founderApprovalRequired
  );
}

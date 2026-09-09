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
export const ECONOMIC_OBJECT_ACTION_KINDS = Object.freeze([
  "approve_game_use",
  "resolve_dependency_rights",
  "verify_transfer_conditions",
  "stop_transfer_review",
  "classify_and_collect_evidence",
] as const);
export type EconomicObjectActionKind = (typeof ECONOMIC_OBJECT_ACTION_KINDS)[number];

export interface EconomicObjectAttentionProjection {
  readonly projectionVersion: typeof ECONOMIC_OBJECT_PROJECTION_VERSION;
  readonly object: {
    readonly domain: EconomicObjectDomain;
    readonly objectId: string;
    readonly versionId: string;
    readonly title: string;
  };
  readonly source: {
    readonly system: ProjectionSourceSystem;
    readonly sourceVersion: string;
    readonly observedAt: string;
  };
  readonly proof: {
    readonly state: ProofState;
    readonly evidenceRefs: readonly string[];
  };
  readonly rights: {
    readonly state: RightsState;
  };
  readonly transferability: {
    readonly state: TransferabilityState;
  };
  readonly attention: {
    readonly state: AttentionState;
    readonly whyNow: string;
    readonly blockers: readonly string[];
  };
  readonly nextAction: {
    readonly kind: EconomicObjectActionKind;
    readonly label: string;
    readonly targetSystem: ActionTargetSystem;
    readonly founderApprovalRequired: boolean;
  };
}

export function isFailClosedProjection(projection: EconomicObjectAttentionProjection): boolean {
  const hasRequiredEvidence =
    projection.proof.state !== "verified" ||
    projection.proof.evidenceRefs.some((reference) => reference.trim().length > 0);
  const unresolvedTruth =
    projection.proof.state !== "verified" ||
    projection.rights.state === "conditional" ||
    projection.rights.state === "unknown" ||
    projection.rights.state === "unresolved" ||
    projection.transferability.state === "conditionally_transferable" ||
    projection.transferability.state === "unknown" ||
    projection.transferability.state === "non_transferable";

  if (!hasRequiredEvidence || !isEconomicObjectActionKind(projection.nextAction.kind)) {
    return false;
  }

  const actionIsFounderAuthorizedProposal = projection.nextAction.founderApprovalRequired;
  if (unresolvedTruth) {
    return (
      projection.attention.state === "blocked" &&
      projection.attention.blockers.length > 0 &&
      projection.nextAction.targetSystem === "proof_commerce" &&
      projection.nextAction.kind !== "approve_game_use" &&
      actionIsFounderAuthorizedProposal
    );
  }

  return (
    projection.nextAction.kind === "approve_game_use" &&
    projection.nextAction.targetSystem === "game_seed" &&
    (projection.transferability.state === "license_only" || projection.transferability.state === "transferable") &&
    actionIsFounderAuthorizedProposal
  );
}

export function isEconomicObjectActionKind(value: unknown): value is EconomicObjectActionKind {
  return typeof value === "string" && ECONOMIC_OBJECT_ACTION_KINDS.some((kind) => kind === value);
}

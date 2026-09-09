import {
  ECONOMIC_OBJECT_PROJECTION_VERSION,
  type EconomicObjectAttentionProjection,
} from "./contracts";

const FIXTURE_SOURCE = {
  system: "fixture",
  sourceVersion: "mtb-eos-r0-fixtures-v0.1",
  observedAt: "2026-09-09T00:00:00.000Z",
} as const;

const fixtureDefinitions: EconomicObjectAttentionProjection[] = [
  {
    projectionVersion: ECONOMIC_OBJECT_PROJECTION_VERSION,
    object: {
      domain: "game_asset",
      objectId: "game-asset-moon-shrine-prop-001",
      versionId: "v3",
      title: "Moon Shrine Signature Prop",
    },
    source: FIXTURE_SOURCE,
    proof: { state: "verified", evidenceRefs: ["fixture-evidence:origin-001", "fixture-evidence:license-001"] },
    rights: { state: "clear" },
    transferability: { state: "license_only" },
    attention: {
      state: "actionable",
      whyNow: "Origin and license evidence are complete for use in the next Game Seed build.",
      blockers: [],
    },
    nextAction: {
      kind: "approve_game_use",
      label: "Approve this version for the Game Seed build.",
      targetSystem: "game_seed",
      founderApprovalRequired: true,
    },
  },
  {
    projectionVersion: ECONOMIC_OBJECT_PROJECTION_VERSION,
    object: {
      domain: "game_asset",
      objectId: "game-asset-forest-material-002",
      versionId: "v2",
      title: "Moon Atmospheric Forest Material",
    },
    source: FIXTURE_SOURCE,
    proof: { state: "partial", evidenceRefs: ["fixture-evidence:origin-002"] },
    rights: { state: "conditional" },
    transferability: { state: "unknown" },
    attention: {
      state: "blocked",
      whyNow: "A purchased texture dependency has no verified redistribution permission.",
      blockers: ["Redistribution rights for dependency texture-dependency-17 are unresolved."],
    },
    nextAction: {
      kind: "resolve_dependency_rights",
      label: "Resolve the dependency license before commercialization.",
      targetSystem: "proof_commerce",
      founderApprovalRequired: true,
    },
  },
  {
    projectionVersion: ECONOMIC_OBJECT_PROJECTION_VERSION,
    object: {
      domain: "digital_business",
      objectId: "digital-business-demo-003",
      versionId: "snapshot-1",
      title: "Synthetic Digital Business",
    },
    source: FIXTURE_SOURCE,
    proof: { state: "partial", evidenceRefs: ["fixture-evidence:control-003"] },
    rights: { state: "conditional" },
    transferability: { state: "conditionally_transferable" },
    attention: {
      state: "blocked",
      whyNow: "Control evidence exists, but contractual transfer conditions are incomplete.",
      blockers: ["Contractual assignment and third-party consent have not been verified."],
    },
    nextAction: {
      kind: "verify_transfer_conditions",
      label: "Verify assignment conditions and required consent.",
      targetSystem: "proof_commerce",
      founderApprovalRequired: true,
    },
  },
  {
    projectionVersion: ECONOMIC_OBJECT_PROJECTION_VERSION,
    object: {
      domain: "platform_account",
      objectId: "platform-account-demo-004",
      versionId: "observation-1",
      title: "Synthetic Platform Account",
    },
    source: FIXTURE_SOURCE,
    proof: { state: "partial", evidenceRefs: ["fixture-evidence:access-004"] },
    rights: { state: "unknown" },
    transferability: { state: "non_transferable" },
    attention: {
      state: "blocked",
      whyNow: "Account access does not establish transferable ownership or platform permission.",
      blockers: ["The platform object is marked non-transferable until authoritative terms prove otherwise."],
    },
    nextAction: {
      kind: "stop_transfer_review",
      label: "Do not offer transfer; preserve the platform restriction.",
      targetSystem: "proof_commerce",
      founderApprovalRequired: true,
    },
  },
  {
    projectionVersion: ECONOMIC_OBJECT_PROJECTION_VERSION,
    object: {
      domain: "unknown",
      objectId: "unknown-digital-object-005",
      versionId: "unclassified-1",
      title: "Unknown Digital Object",
    },
    source: FIXTURE_SOURCE,
    proof: { state: "unknown", evidenceRefs: [] },
    rights: { state: "unknown" },
    transferability: { state: "unknown" },
    attention: {
      state: "blocked",
      whyNow: "The object has not been classified and no authoritative evidence is available.",
      blockers: ["Identity, rights, and transferability are unknown."],
    },
    nextAction: {
      kind: "classify_and_collect_evidence",
      label: "Classify the object and collect evidence before proceeding.",
      targetSystem: "proof_commerce",
      founderApprovalRequired: true,
    },
  },
];

export const ECONOMIC_OBJECT_FIXTURES: readonly EconomicObjectAttentionProjection[] = deepFreeze(fixtureDefinitions);

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) {
      deepFreeze(nested);
    }
    Object.freeze(value);
  }

  return value;
}

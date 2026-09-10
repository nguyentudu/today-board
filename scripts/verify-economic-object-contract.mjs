import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const contractSource = readFileSync("src/economicObjects/contracts.ts", "utf8");
const fixtureSource = readFileSync("src/economicObjects/fixtures.ts", "utf8");
const protectedRuntimeSources = [
  "src/app.ts",
  "src/domain/card.ts",
  "src/domain/board.ts",
  "src/storage/localStore.ts",
].map((path) => readFileSync(path, "utf8")).join("\n");

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
let contracts;
let fixtures;
try {
  contracts = await vite.ssrLoadModule("/src/economicObjects/contracts.ts");
  fixtures = await vite.ssrLoadModule("/src/economicObjects/fixtures.ts");
} finally {
  await vite.close();
}

const objects = fixtures.ECONOMIC_OBJECT_FIXTURES;
const cloneProjection = (source, overrides = {}) => ({
  ...source,
  ...overrides,
  object: { ...source.object, ...overrides.object },
  source: { ...source.source, ...overrides.source },
  proof: { ...source.proof, ...overrides.proof },
  rights: { ...source.rights, ...overrides.rights },
  transferability: { ...source.transferability, ...overrides.transferability },
  attention: { ...source.attention, ...overrides.attention },
  nextAction: { ...source.nextAction, ...overrides.nextAction },
});
const isDeeplyFrozen = (value, seen = new Set()) => {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((nested) => isDeeplyFrozen(nested, seen));
};

assert.equal(objects.length, 5, "R0 must contain exactly five synthetic projections");
assert.equal(new Set(objects.map((item) => item.object.objectId)).size, 5, "object identities must be unique");
assert.ok(objects.every((item) => item.projectionVersion === contracts.ECONOMIC_OBJECT_PROJECTION_VERSION));
assert.ok(objects.every((item) => item.source.system === "fixture"), "R0 must remain fixture-only");
assert.ok(objects.every((item) => item.source.sourceVersion === "mtb-eos-r0-fixtures-v0.1"));
assert.ok(objects.every((item) => !Number.isNaN(Date.parse(item.source.observedAt))), "observations need valid timestamps");
assert.ok(objects.every((item) => item.attention.whyNow.trim().length > 0), "every projection needs why now");
assert.ok(objects.every((item) => item.nextAction.kind.trim() && item.nextAction.label.trim()), "every projection needs a next action");
assert.ok(objects.every((item) => contracts.isFailClosedProjection(item)), "unknown or restricted truth must fail closed");
assert.ok(isDeeplyFrozen(objects), "canonical fixtures must be deeply immutable");

const unknown = objects.find((item) => item.object.domain === "unknown");
assert.ok(unknown, "unknown fixture is required");
assert.equal(unknown.proof.state, "unknown");
assert.equal(unknown.rights.state, "unknown");
assert.equal(unknown.transferability.state, "unknown");
assert.equal(unknown.attention.state, "blocked");

const platform = objects.find((item) => item.object.domain === "platform_account");
assert.equal(platform?.transferability.state, "non_transferable");
assert.equal(platform?.attention.state, "blocked");

const licenseOnly = objects.find((item) => item.transferability.state === "license_only");
assert.equal(licenseOnly?.proof.state, "verified");
assert.equal(licenseOnly?.rights.state, "clear");
assert.notEqual(licenseOnly?.nextAction.kind, "transfer");

const unsafeAttention = { state: "actionable", whyNow: "Proceed now.", blockers: [] };
const unsafeTransferAction = {
  kind: "transfer",
  label: "Transfer now.",
  targetSystem: "today_board",
  founderApprovalRequired: false,
};
for (const [name, overrides] of [
  ["partial proof", { proof: { state: "partial" } }],
  ["unverified proof", { proof: { state: "unverified" } }],
  ["unknown proof", { proof: { state: "unknown" } }],
  ["conditional rights", { rights: { state: "conditional" } }],
  ["unresolved rights", { rights: { state: "unresolved" } }],
  ["unknown rights", { rights: { state: "unknown" } }],
  ["conditional transfer", { transferability: { state: "conditionally_transferable" } }],
  ["non-transferable", { transferability: { state: "non_transferable" } }],
  ["unknown transfer", { transferability: { state: "unknown" } }],
]) {
  const unsafe = cloneProjection(licenseOnly, {
    ...overrides,
    attention: unsafeAttention,
    nextAction: unsafeTransferAction,
  });
  assert.equal(contracts.isFailClosedProjection(unsafe), false, `${name} must reject unsafe action`);
}

const licenseTransfer = cloneProjection(licenseOnly, { nextAction: unsafeTransferAction });
assert.equal(contracts.isFailClosedProjection(licenseTransfer), false, "license_only must reject transfer action");

const unresolvedTransfer = cloneProjection(unknown, {
  nextAction: {
    ...unsafeTransferAction,
    targetSystem: "proof_commerce",
    founderApprovalRequired: true,
  },
});
assert.equal(contracts.isFailClosedProjection(unresolvedTransfer), false, "unresolved truth must reject transfer action");

const verifiedWithoutEvidence = cloneProjection(licenseOnly, { proof: { state: "verified", evidenceRefs: [] } });
assert.equal(contracts.isFailClosedProjection(verifiedWithoutEvidence), false, "verified proof requires evidence identity");

assert.deepEqual(
  contracts.ECONOMIC_OBJECT_ACTION_KINDS,
  [
    "approve_game_use",
    "resolve_dependency_rights",
    "verify_transfer_conditions",
    "stop_transfer_review",
    "classify_and_collect_evidence",
  ],
  "R0.2 action allowlist must remain exact",
);
assert.equal(Object.isFrozen(contracts.ECONOMIC_OBJECT_ACTION_KINDS), true, "action allowlist must be immutable");
for (const prohibited of ["transfer", "sell", "checkout", "issue_license", "publish"]) {
  assert.equal(contracts.isEconomicObjectActionKind(prohibited), false, `${prohibited} must remain outside the action contract`);
}

assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(`${contractSource}\n${fixtureSource}`));
assert.ok(!/(api[_-]?key|signing[_-]?secret|authorization:\s*bearer)/i.test(`${contractSource}\n${fixtureSource}`));
assert.ok(
  !protectedRuntimeSources.includes("economicObjects"),
  "Economic Objects must not enter app orchestration, Situation semantics, or persistence",
);
assert.ok(!contractSource.includes('from "../commercial/'), "economic object truth must not depend on commerce");
assert.ok(!contractSource.includes('from "../domain/'), "economic object truth must not rewrite Situation semantics");

console.log("Economic Object R0.2 contract passed (adversarial, immutable, fixture-only, runtime-isolated).");

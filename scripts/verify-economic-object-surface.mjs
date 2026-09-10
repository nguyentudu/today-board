import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const read = (path) => readFileSync(path, "utf8");
const surfaceSource = read("src/economicObjects/EconomicObjectAttentionSurface.ts");
const boardSource = read("src/ui/Board.ts");
const styles = read("styles/main.css");
const packageJson = JSON.parse(read("package.json"));
const protectedSources = [
  "src/app.ts",
  "src/domain/card.ts",
  "src/domain/board.ts",
  "src/domain/lifecycle.ts",
  "src/domain/state.ts",
  "src/storage/localStore.ts",
  "src/storage/exportBoard.ts",
  "src/commercial/checkoutClient.ts",
  "src/commercial/entitlementStore.ts",
].map(read).join("\n");

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
let contracts;
let fixtures;
try {
  contracts = await vite.ssrLoadModule("/src/economicObjects/contracts.ts");
  fixtures = await vite.ssrLoadModule("/src/economicObjects/fixtures.ts");
} finally {
  await vite.close();
}

const projections = fixtures.ECONOMIC_OBJECT_FIXTURES;
assert.equal(projections.length, 5, "R1 must render exactly the five R0 fixtures");
assert.ok(
  projections.every((projection) => projection.projectionVersion === contracts.ECONOMIC_OBJECT_PROJECTION_VERSION),
  "R1 must consume the exact R0 projection version",
);
assert.ok(projections.every((projection) => projection.source.system === "fixture"), "R1 must remain fixture-only");
assert.ok(projections.every(contracts.isFailClosedProjection), "R1 must surface only R0-valid fail-closed projections");

for (const requiredField of [
  "projection.proof.state",
  "projection.rights.state",
  "projection.transferability.state",
  "projection.attention.whyNow",
  "projection.attention.blockers",
  "projection.nextAction.label",
  "projection.nextAction.targetSystem",
  "projection.nextAction.founderApprovalRequired",
]) {
  assert.ok(surfaceSource.includes(requiredField), `R1 surface must render ${requiredField}`);
}

assert.ok(boardSource.includes("EconomicObjectAttentionSurface({"), "Board must mount the bounded R1 surface");
assert.ok(boardSource.includes("projections: ECONOMIC_OBJECT_FIXTURES"), "Board must pass only the canonical R0 fixtures");
assert.ok(surfaceSource.includes('surface.dataset.source = "fixture"'), "Surface must disclose fixture provenance");
assert.ok(surfaceSource.includes("No live rights claim") && surfaceSource.includes("Không có quyền thật"), "Surface must disclose its synthetic, non-live boundary in both languages");
assert.ok(surfaceSource.includes("Founder approval required") && surfaceSource.includes("Cần Founder phê duyệt"), "Surface must preserve Founder authority in both languages");

assert.ok(!surfaceSource.includes('document.createElement("button")'), "R1 must expose no execution button");
assert.ok(!surfaceSource.includes("addEventListener"), "R1 must have no action handler");
assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(surfaceSource), "R1 must have no network primitive");
assert.ok(!/(localStorage|sessionStorage|indexedDB|trySaveBoard|saveBoard)/.test(surfaceSource), "R1 must not persist fixture state");
assert.ok(!surfaceSource.includes("../commercial/"), "R1 must not depend on commerce or entitlements");
assert.ok(!surfaceSource.includes("../domain/"), "R1 must not reinterpret Situation or Board domain semantics");
assert.ok(!protectedSources.includes("EconomicObjectAttentionSurface"), "R1 must not mutate protected runtime/domain/storage/commercial modules");

for (const className of [
  ".economic-object-surface",
  ".economic-object-list",
  ".economic-object-states",
  ".economic-object-next",
]) {
  assert.ok(styles.includes(className), `R1 responsive styling must include ${className}`);
}
assert.ok(
  /@media \(max-width: 640px\)[\s\S]*\.economic-object-list/.test(styles),
  "R1 surface must have a mobile layout",
);
assert.equal(
  packageJson.scripts["test:economic-object-surface"],
  "node scripts/verify-economic-object-surface.mjs",
  "R1 verifier must be exposed as a stable package script",
);

console.log("Economic Object R1 attention surface passed (fixture-only, read-only, fail-closed, authority-preserving).");

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const contractSource = readFileSync("src/economicObjects/contracts.ts", "utf8");
const fixtureSource = readFileSync("src/economicObjects/fixtures.ts", "utf8");
const runtimeSources = [
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
assert.equal(objects.length, 5, "R0 must contain exactly five synthetic projections");
assert.equal(new Set(objects.map((item) => item.object.objectId)).size, 5, "object identities must be unique");
assert.ok(objects.every((item) => item.projectionVersion === contracts.ECONOMIC_OBJECT_PROJECTION_VERSION));
assert.ok(objects.every((item) => item.source.system === "fixture"), "R0 must remain fixture-only");
assert.ok(objects.every((item) => item.source.sourceVersion === "mtb-eos-r0-fixtures-v0.1"));
assert.ok(objects.every((item) => !Number.isNaN(Date.parse(item.source.observedAt))), "observations need valid timestamps");
assert.ok(objects.every((item) => item.attention.whyNow.trim().length > 0), "every projection needs why now");
assert.ok(objects.every((item) => item.nextAction.kind.trim() && item.nextAction.label.trim()), "every projection needs a next action");
assert.ok(objects.every((item) => contracts.isFailClosedProjection(item)), "unknown or restricted truth must fail closed");

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

assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(`${contractSource}\n${fixtureSource}`));
assert.ok(!/(api[_-]?key|signing[_-]?secret|authorization:\s*bearer)/i.test(`${contractSource}\n${fixtureSource}`));
assert.ok(!runtimeSources.includes("economicObjects"), "R0 contract must not be wired into the application runtime");
assert.ok(!contractSource.includes('from "../commercial/'), "economic object truth must not depend on commerce");
assert.ok(!contractSource.includes('from "../domain/'), "economic object truth must not rewrite Situation semantics");

console.log("Economic Object R0 contract passed (fixture-only, fail-closed, runtime-isolated).");

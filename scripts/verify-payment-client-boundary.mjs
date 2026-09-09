import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createServer } from "vite";

const read = (path) => readFileSync(path, "utf8");
const containsRemoteRequestPrimitive = (source) => /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(source);
const paths = [
  "src/app.ts",
  "src/commercial/contracts.ts",
  "src/commercial/catalog.ts",
  "src/commercial/checkoutClient.ts",
  "src/commercial/entitlementStore.ts",
  "src/commercial/CommercialEntry.ts",
  "src/commercial/CustomerPortal.ts",
];
const joined = paths.map(read).join("\n");
const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
let contracts;
let client;
try {
  contracts = await vite.ssrLoadModule("/src/commercial/contracts.ts");
  client = await vite.ssrLoadModule("/src/commercial/checkoutClient.ts");
} finally {
  await vite.close();
}

const boundary = client.getPaymentClientBoundary();
const checkout = client.requestCheckout();
const portal = client.requestCustomerPortal();
assert.strictEqual(boundary, contracts.PAYMENT_CLIENT_BOUNDARY, "client must expose the canonical payment boundary");
const checks = [
  ["fixture contract is explicit", boundary.mode === "disabled_fixture_contract"],
  ["provider remains disconnected", boundary.providerConnected === false],
  ["checkout remains disabled", boundary.checkoutEnabled === false],
  ["portal remains disabled", boundary.portalEnabled === false],
  ["paid entitlement remains disabled", boundary.paidEntitlementsEnabled === false],
  ["account remains disabled", boundary.accountEnabled === false],
  ["sync remains disabled", boundary.syncEnabled === false],
  ["checkout action fails closed", checkout.enabled === false && checkout.url === null && checkout.reason === "fixture_only_not_for_sale"],
  ["portal action fails closed", portal.enabled === false && portal.url === null && portal.reason === "fixture_only_not_for_sale"],
  ["beacon regression is detected", containsRemoteRequestPrimitive("navigator.sendBeacon('/checkout', 'fixture')")],
  ["no remote request primitive", !containsRemoteRequestPrimitive(joined)],
  ["no provider URL", !/https?:\/\//.test(joined)],
  ["no credential field", !/(api[_-]?key|signing[_-]?secret|authorization:\s*bearer)/i.test(joined)],
];
const failures = checks.filter(([, pass]) => !pass).map(([name]) => name);
if (failures.length) throw new Error(`Payment client boundary failed: ${failures.join(", ")}`);
console.log(`Payment client boundary passed (${checks.length}/${checks.length}).`);

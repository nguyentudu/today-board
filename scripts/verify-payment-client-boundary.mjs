import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
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
const checks = [
  ["fixture contract is explicit", joined.includes("disabled_fixture_contract")],
  ["provider remains disconnected", joined.includes("providerConnected: false")],
  ["checkout remains disabled", joined.includes("checkoutEnabled: false")],
  ["portal remains disabled", joined.includes("portalEnabled: false")],
  ["paid entitlement remains disabled", joined.includes("paidEntitlementsEnabled: false")],
  ["account remains disabled", joined.includes("accountEnabled: false")],
  ["sync remains disabled", joined.includes("syncEnabled: false")],
  ["no remote request primitive", !/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(joined)],
  ["no provider URL", !/https?:\/\//.test(joined)],
  ["no credential field", !/(api[_-]?key|signing[_-]?secret|authorization:\s*bearer)/i.test(joined)],
];
const failures = checks.filter(([, pass]) => !pass).map(([name]) => name);
if (failures.length) throw new Error(`Payment client boundary failed: ${failures.join(", ")}`);
console.log(`Payment client boundary passed (${checks.length}/${checks.length}).`);

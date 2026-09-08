import { readFileSync } from "node:fs";

const paths = [
  "src/commercial/contracts.ts",
  "src/commercial/catalog.ts",
  "src/commercial/entitlementStore.ts",
  "src/commercial/CommercialEntry.ts",
  "src/onboarding/firstReturn.ts",
  "src/onboarding/Onboarding.ts",
  "src/continuityReview/review.ts",
  "src/continuityReview/ContinuityReview.ts",
];
const source = paths.map((path) => readFileSync(path, "utf8")).join("\n");
const entitlement = readFileSync("src/commercial/entitlementStore.ts", "utf8");
const contracts = readFileSync("src/commercial/contracts.ts", "utf8");
const trust = readFileSync("docs/commercial/TRUST_AND_LOCAL_DATA_PROMISE_V0_1.md", "utf8");

for (const forbidden of ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "document.cookie", "Authorization:"]) {
  if (source.includes(forbidden)) {
    throw new Error(`Local/free boundary verification failed: found ${forbidden}`);
  }
}

if (
  !contracts.includes('accountRequired: false') ||
  !contracts.includes('checkoutEnabled: false') ||
  !contracts.includes('continuityReviewEnabled: false')
) {
  throw new Error("Local/free boundary verification failed: free contract is not fail-closed.");
}
if (!entitlement.includes("return LOCAL_FREE_ENTITLEMENT") || !entitlement.includes("return false")) {
  throw new Error("Local/free boundary verification failed: entitlement or checkout is not fixed locally.");
}
if (!trust.includes("does not send board titles") || !trust.includes("Continue using Moon Local without creating an account")) {
  throw new Error("Local/free boundary verification failed: trust promise is incomplete.");
}

console.log("Local/free commercial boundary verification passed.");

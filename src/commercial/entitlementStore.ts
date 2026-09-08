import { LOCAL_FREE_ENTITLEMENT, type EntitlementSnapshot } from "./contracts";
import { getPaymentClientBoundary } from "./checkoutClient";

export function getEntitlementSnapshot(): EntitlementSnapshot {
  const boundary = getPaymentClientBoundary();
  if (boundary.paidEntitlementsEnabled || boundary.accountEnabled || boundary.syncEnabled) {
    throw new Error("R2 fixture boundary must fail closed.");
  }
  return LOCAL_FREE_ENTITLEMENT;
}

export function canUseLocalBoard(entitlement: EntitlementSnapshot): boolean {
  return entitlement.plan === "local_free";
}

export function canStartCheckout(_entitlement: EntitlementSnapshot): false {
  return false;
}

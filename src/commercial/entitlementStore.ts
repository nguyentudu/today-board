import { LOCAL_FREE_ENTITLEMENT, type EntitlementSnapshot } from "./contracts";

export function getEntitlementSnapshot(): EntitlementSnapshot {
  return LOCAL_FREE_ENTITLEMENT;
}

export function canUseLocalBoard(entitlement: EntitlementSnapshot): boolean {
  return entitlement.plan === "local_free";
}

export function canStartCheckout(_entitlement: EntitlementSnapshot): false {
  return false;
}

export type CommercialPlanId = "local_free" | "continuity_pro" | "founding_license";

export type CommercialAvailability = "available" | "preview_only";

export interface CommercialPlan {
  id: CommercialPlanId;
  name: string;
  price: string;
  availability: CommercialAvailability;
  features: readonly string[];
}

export interface EntitlementSnapshot {
  plan: "local_free";
  source: "device";
  accountRequired: false;
  accountEnabled: false;
  syncEnabled: false;
  checkoutEnabled: false;
  continuityReviewEnabled: false;
}

export const LOCAL_FREE_ENTITLEMENT: EntitlementSnapshot = Object.freeze({
  plan: "local_free",
  source: "device",
  accountRequired: false,
  accountEnabled: false,
  syncEnabled: false,
  checkoutEnabled: false,
  continuityReviewEnabled: false,
});

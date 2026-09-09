export type CommercialPlanId = "local_free" | "continuity_pro" | "founding_license";

export type CommercialAvailability = "available" | "preview_only";

export type PaymentClientMode = "disabled_fixture_contract";

export interface PaymentClientBoundary {
  mode: PaymentClientMode;
  providerConnected: false;
  checkoutEnabled: false;
  portalEnabled: false;
  paidEntitlementsEnabled: false;
  accountEnabled: false;
  syncEnabled: false;
}

export interface DisabledCommercialAction {
  enabled: false;
  reason: "fixture_only_not_for_sale";
  url: null;
}

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

export const PAYMENT_CLIENT_BOUNDARY: PaymentClientBoundary = Object.freeze({
  mode: "disabled_fixture_contract",
  providerConnected: false,
  checkoutEnabled: false,
  portalEnabled: false,
  paidEntitlementsEnabled: false,
  accountEnabled: false,
  syncEnabled: false,
});

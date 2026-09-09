import { PAYMENT_CLIENT_BOUNDARY, type DisabledCommercialAction, type PaymentClientBoundary } from "./contracts";

export function getPaymentClientBoundary(): PaymentClientBoundary {
  return PAYMENT_CLIENT_BOUNDARY;
}

export function requestCheckout(): DisabledCommercialAction {
  return { enabled: false, reason: "fixture_only_not_for_sale", url: null };
}

export function requestCustomerPortal(): DisabledCommercialAction {
  return { enabled: false, reason: "fixture_only_not_for_sale", url: null };
}

export function installPaymentClientBoundary(root: HTMLElement): void {
  root.dataset.paymentMode = PAYMENT_CLIENT_BOUNDARY.mode;
  root.dataset.checkoutEnabled = String(PAYMENT_CLIENT_BOUNDARY.checkoutEnabled);
  root.dataset.portalEnabled = String(PAYMENT_CLIENT_BOUNDARY.portalEnabled);
}

import { type DisabledCommercialAction } from "./contracts";
import { requestCustomerPortal } from "./checkoutClient";

export function CustomerPortal(label: string): HTMLButtonElement {
  const contract: DisabledCommercialAction = requestCustomerPortal();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiet-button";
  button.textContent = label;
  button.disabled = !contract.enabled;
  button.setAttribute("aria-disabled", "true");
  button.dataset.commercialReason = contract.reason;
  return button;
}

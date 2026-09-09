import { DISABLED_ACCOUNT_SESSION, type AccountSession } from "./session";

export interface DisabledAuthAction {
  enabled: false;
  reason: "fixture_only_identity_not_configured";
}

export interface AuthClientBoundary {
  mode: "disabled_fixture_contract";
  accountEnabled: false;
  providerConnected: false;
  session: AccountSession;
}

export const AUTH_CLIENT_BOUNDARY: AuthClientBoundary = Object.freeze({
  mode: "disabled_fixture_contract",
  accountEnabled: false,
  providerConnected: false,
  session: DISABLED_ACCOUNT_SESSION,
});

export function requestSignIn(): DisabledAuthAction {
  return { enabled: false, reason: "fixture_only_identity_not_configured" };
}

export function installAuthClientBoundary(root: HTMLElement): void {
  root.dataset.accountEnabled = "false";
  root.dataset.authMode = AUTH_CLIENT_BOUNDARY.mode;
}

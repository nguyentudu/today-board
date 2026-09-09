export interface AccountSession {
  authenticated: boolean;
  accountId: string | null;
  source: "disabled" | "synthetic-fixture";
}

export const DISABLED_ACCOUNT_SESSION: AccountSession = Object.freeze({
  authenticated: false,
  accountId: null,
  source: "disabled",
});

export function syntheticFixtureSession(accountId: string): AccountSession {
  if (!/^acct_fixture_[a-z0-9_-]+$/.test(accountId)) {
    throw new Error("Only synthetic fixture accounts are accepted in R3");
  }
  return Object.freeze({ authenticated: true, accountId, source: "synthetic-fixture" });
}

export function requireFixtureSession(session: AccountSession): string {
  if (
    !session.authenticated ||
    session.source !== "synthetic-fixture" ||
    !session.accountId ||
    !/^acct_fixture_[a-z0-9_-]+$/.test(session.accountId)
  ) {
    throw new Error("An explicitly injected synthetic account session is required");
  }
  return session.accountId;
}

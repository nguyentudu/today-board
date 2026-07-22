export type InstallationMarkerState = "absent" | "valid" | "invalid";
export type PersistedModelVerification = "not-run" | "passed" | "failed";
export type ModelInstallationState = "not-installed" | "marker-verification-required" | "verified" | "incomplete";

export function classifyModelInstallation(
  marker: InstallationMarkerState,
  verification: PersistedModelVerification,
): ModelInstallationState {
  if (marker === "absent") {
    return "not-installed";
  }
  if (marker === "invalid" || verification === "failed") {
    return "incomplete";
  }
  return verification === "passed" ? "verified" : "marker-verification-required";
}

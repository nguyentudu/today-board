import { requestRemoteDeletion, requestSync, SYNC_CLIENT_BOUNDARY } from "./syncClient";

export function SyncSettings(): HTMLElement {
  const section = document.createElement("section");
  section.className = "sync-settings sync-settings--disabled";
  section.dataset.syncEnabled = String(SYNC_CLIENT_BOUNDARY.syncEnabled);

  const heading = document.createElement("h2");
  heading.textContent = "Encrypted sync preview";
  const description = document.createElement("p");
  description.textContent = "Account and encrypted sync are not available in this fixture-only build.";
  const syncButton = document.createElement("button");
  syncButton.type = "button";
  syncButton.disabled = true;
  syncButton.textContent = requestSync().reason;
  const deletion = document.createElement("p");
  deletion.textContent = `Remote deletion preview: ${requestRemoteDeletion().recoveryWindowDays}-day recovery window; local board is never remotely deleted.`;

  section.append(heading, description, syncButton, deletion);
  return section;
}

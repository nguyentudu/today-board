import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const TAG_OBJECT = "ce228e3cfd4cdc466ad0977b9c2d6f1073a2b141";
const TAGGED_COMMIT = "bdf2853eb7087898352f804a02d38f251eb5268a";
const ACCEPTED_COMMIT = "33e5750b9577277cb94dae2e736a7444e29e587a";
const RUNTIME_PATHS = ["src", "index.html", "styles", "public", "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json"];
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

if (git("cat-file", "-t", "v1.0.0") !== "tag") {
  throw new Error("Rollback verification failed: v1.0.0 is not an annotated tag.");
}
if (git("rev-parse", "v1.0.0") !== TAG_OBJECT || git("rev-parse", "v1.0.0^{}") !== TAGGED_COMMIT) {
  throw new Error("Rollback verification failed: v1.0.0 identity changed.");
}
if (git("diff", "--name-only", ACCEPTED_COMMIT, TAGGED_COMMIT, "--", ...RUNTIME_PATHS)) {
  throw new Error("Rollback verification failed: tagged runtime differs from accepted application commit.");
}

const workflow = readFileSync(".github/workflows/pages.yml", "utf8");
if (/\bpush\s*:/.test(workflow) || !workflow.includes("workflow_dispatch:") || !workflow.includes("ref: v1.0.0")) {
  throw new Error("Rollback verification failed: Pages workflow is not manual-only and pinned to v1.0.0.");
}

const evidence = readFileSync("docs/commercial/ACCEPTED_V1_ROLLBACK_ARTIFACT_V0_1.md", "utf8");
for (const identity of [TAG_OBJECT, TAGGED_COMMIT, ACCEPTED_COMMIT, "2026.07.22-b", "2026-07-22-b"]) {
  if (!evidence.includes(identity)) {
    throw new Error(`Rollback verification failed: evidence omits ${identity}.`);
  }
}

console.log("Accepted v1 rollback artifact verification passed.");

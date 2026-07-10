import { readFileSync } from "node:fs";

const checks = [
  {
    name: "raw image refs are not exposed as a default editor textarea",
    file: "src/ui/CardEditor.ts",
    reject: ["card.imageRefs.join", "imageRefsEmpty"],
  },
  {
    name: "cards start in collapsed summary mode",
    file: "src/ui/Card.ts",
    require: ['mode: "summary" | "open" | "edit" = "summary"', "renderSummary()"],
  },
  {
    name: "open mode is readable detail, not editor",
    file: "src/ui/Card.ts",
    require: ["renderReadableDetail(card, text)", 'mode === "edit"'],
  },
  {
    name: "media indicators are present in summary",
    file: "src/ui/Card.ts",
    require: ["renderMediaIndicators(card, text, language)", "imageRefs.length", "audioRefs.length", "fileRefs.length"],
  },
  {
    name: "cleanup requires explicit confirmation",
    file: "src/ui/Board.ts",
    require: ["showCleanupConfirmation", "onConfirm", "storageCleanupConsequence"],
  },
];

let failed = false;

for (const check of checks) {
  const source = readFileSync(check.file, "utf8");
  const missing = (check.require ?? []).filter((pattern) => !source.includes(pattern));
  const rejected = (check.reject ?? []).filter((pattern) => source.includes(pattern));

  if (missing.length > 0 || rejected.length > 0) {
    failed = true;
    console.error(`FAIL ${check.name}`);
    for (const pattern of missing) console.error(`  missing: ${pattern}`);
    for (const pattern of rejected) console.error(`  rejected: ${pattern}`);
  } else {
    console.log(`PASS ${check.name}`);
  }
}

if (failed) {
  process.exit(1);
}

import { readFileSync } from "node:fs";
import ts from "typescript";

const stateSource = readFileSync("src/domain/state.ts", "utf8");
const cardSource = readFileSync("src/domain/card.ts", "utf8");
const boardSource = readFileSync("src/domain/board.ts", "utf8");
const localStoreSource = readFileSync("src/storage/localStore.ts", "utf8");
const retrievalSource = readFileSync("src/domain/retrieval.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

function stripImports(source) {
  return source.replace(/import[\s\S]*?from\s+["'][^"']+["'];\s*/g, "");
}

const executableSource = [stateSource, cardSource, boardSource, localStoreSource]
  .map(stripImports)
  .join("\n");
const js = ts.transpileModule(executableSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const domain = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const created = domain.addCard(domain.createBoard(), "Logo delivery evidence");
const cardId = created.cards[0].id;
assert("new situations do not invent evidence meaning", created.cards[0].evidenceMeta.length === 0);

const file = { name: "logo-final-v3.zip", type: "application/zip", size: 42, dataUrl: "data:test;base64,QUJD" };
const withEvidence = domain.updateCardRichContext(created, cardId, {
  richLinks: ["https://example.com"],
  imageRefs: ["data:image/png;base64,AAAA"],
  audioRefs: [],
  fileRefs: [file],
});
const fileId = domain.evidenceIdentity("file", file);
const linkId = domain.evidenceIdentity("link", "https://example.com");
assert("evidence identity is deterministic", fileId === domain.evidenceIdentity("file", file));

const latest = domain.updateCardEvidenceRole(withEvidence, cardId, { id: fileId, kind: "file", role: "latest" });
const meaningful = domain.updateCardEvidenceRole(latest, cardId, { id: linkId, kind: "link", role: "return-first" });
assert(
  "existing attachments accept explicit roles",
  meaningful.cards[0].evidenceMeta.some((meta) => meta.id === fileId && meta.role === "latest")
    && meaningful.cards[0].evidenceMeta.some((meta) => meta.id === linkId && meta.role === "return-first"),
);

const rejected = domain.updateCardEvidenceRole(meaningful, cardId, { id: "file-unknown", kind: "file", role: "brief" });
assert("unknown attachments cannot acquire roles", rejected.cards[0].evidenceMeta.length === 2);

const reset = domain.updateCardEvidenceRole(meaningful, cardId, { id: fileId, kind: "file", role: "reference" });
assert(
  "reference removes special meaning without removing the attachment",
  reset.cards[0].fileRefs.length === 1 && !reset.cards[0].evidenceMeta.some((meta) => meta.id === fileId),
);

const removedLink = domain.updateCardRichContext(meaningful, cardId, { richLinks: [] });
assert(
  "removing an attachment prunes its role metadata",
  !removedLink.cards[0].evidenceMeta.some((meta) => meta.id === linkId),
);

const roundTripped = domain.sanitizeBoard(JSON.parse(JSON.stringify(meaningful)));
assert(
  "JSON export and import preserve valid evidence meaning",
  roundTripped.cards[0].evidenceMeta.length === 2,
);

const staleImport = domain.sanitizeBoard({
  version: 1,
  cards: [{
    id: "stale",
    title: "Stale evidence metadata",
    state: "continue",
    evidenceMeta: [{ id: "file-missing", kind: "file", role: "outcome-proof" }],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-02",
  }],
});
assert("import drops roles for missing attachments", staleImport.cards[0].evidenceMeta.length === 0);

assert("retrieval indexes evidence roles", retrievalSource.includes("card.evidenceMeta") && retrievalSource.includes("meta.role"));
assert(
  "open mode ranks return-first evidence",
  cardViewSource.includes("renderEvidenceMeaning") && cardViewSource.includes('"return-first", "latest"'),
);
assert(
  "edit mode exposes roles on existing evidence only",
  cardViewSource.includes("appendEvidenceRoleControl") && cardViewSource.includes("evidence-role-control"),
);
assert(
  "link roles bind to the stored source rather than a normalized display URL",
  cardViewSource.includes('appendEvidenceRoleControl(item, card, "link", link'),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

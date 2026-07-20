import { readFileSync } from "node:fs";
import ts from "typescript";

const stateSource = readFileSync("src/domain/state.ts", "utf8");
const cardDomainSource = readFileSync("src/domain/card.ts", "utf8");
const boardDomainSource = readFileSync("src/domain/board.ts", "utf8");
const cardViewSource = readFileSync("src/ui/Card.ts", "utf8");
const editSessionSource = readFileSync("scripts/verify-edit-session.mjs", "utf8");
const appSource = readFileSync("src/app.ts", "utf8");
const swSource = readFileSync("public/sw.js", "utf8");
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

const executableSource = [stateSource, cardDomainSource, boardDomainSource]
  .map(stripImports)
  .join("\n");
const js = ts.transpileModule(executableSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const domain = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const file = { name: "outcome.pdf", type: "application/pdf", size: 12, dataUrl: "data:application/pdf;base64,QUJD" };
let board = domain.addCard(domain.createBoard(), "Evidence access");
const cardId = board.cards[0].id;
board = domain.updateCardRichContext(board, cardId, {
  richLinks: ["https://example.com/brief", "plain text", "https://example.com/unassigned"],
  imageRefs: ["data:image/png;base64,AAAA"],
  audioRefs: ["data:audio/webm;base64,AAAA"],
  fileRefs: [file],
});
for (const [kind, source, role] of [
  ["link", "https://example.com/brief", "return-first"],
  ["link", "plain text", "feedback"],
  ["image", "data:image/png;base64,AAAA", "latest"],
  ["audio", "data:audio/webm;base64,AAAA", "brief"],
  ["file", file, "outcome-proof"],
]) {
  board = domain.updateCardEvidenceRole(board, cardId, {
    id: domain.evidenceIdentity(kind, source),
    kind,
    role,
  });
}

assert(
  "unassigned attachments do not become key evidence",
  board.cards[0].evidenceMeta.length === 5
    && !board.cards[0].evidenceMeta.some((meta) => meta.id === domain.evidenceIdentity("link", "https://example.com/unassigned")),
);
const pruned = domain.updateCardRichContext(board, cardId, { imageRefs: [] });
assert(
  "existing evidence identity and metadata pruning remain intact",
  !pruned.cards[0].evidenceMeta.some((meta) => meta.kind === "image")
    && domain.evidenceIdentity("file", file) === domain.evidenceIdentity("file", file),
);

assert(
  "return-first evidence ranks first",
  cardViewSource.includes('["return-first", "latest", "feedback", "brief", "outcome-proof"]'),
);
assert(
  "every available assigned evidence kind has a usable action",
  cardViewSource.includes('kind === "file"')
    && cardViewSource.includes("normalizeReadableHttpUrl(source)")
    && cardViewSource.includes('kind === "image" ? "data:image/" : "data:audio/"')
    && cardViewSource.includes("link.download = access.download")
    && cardViewSource.includes("focusEvidenceTarget(access.targetId!")
    && cardViewSource.includes("target.play()"),
);
assert(
  "invalid links are not actionable",
  cardViewSource.includes("const href = normalizeReadableHttpUrl(source)")
    && cardViewSource.includes("href ? { kind, label, href } : { kind, label }"),
);
assert(
  "unavailable evidence is handled safely",
  cardViewSource.includes("button.disabled = !access.targetId")
    && cardViewSource.includes("text.evidenceUnavailable"),
);
assert(
  "raw data URLs are never rendered as text",
  cardViewSource.includes('ref.startsWith("data:") ? text.evidenceUnavailable : ref')
    && cardViewSource.includes('link.startsWith("data:") ? text.evidenceUnavailable : link')
    && cardViewSource.includes('source.startsWith("data:") ? text.evidenceUnavailable : source')
    && !cardViewSource.includes("label: source, href: source")
    && cardViewSource.includes("label: source.name"),
);

const evidenceRenderer = cardViewSource.slice(
  cardViewSource.indexOf("function renderEvidenceMeaning"),
  cardViewSource.indexOf("function evidenceRoleRank"),
);
assert(
  "evidence access performs no board mutation or storage write",
  !evidenceRenderer.includes("onChange")
    && !evidenceRenderer.includes("trySaveBoard")
    && !evidenceRenderer.includes("localStorage")
    && !evidenceRenderer.includes("updatedAt")
    && !evidenceRenderer.includes("onMove")
    && !evidenceRenderer.includes("editSessions.delete"),
);
assert(
  "evidence access remains user initiated",
  evidenceRenderer.includes('button.addEventListener("click"')
    && !cardViewSource.slice(cardViewSource.indexOf("function renderReadableDetail"), cardViewSource.indexOf("function renderEvidenceMeaning")).includes("focusEvidenceTarget("),
);
assert(
  "edit-session behavior remains intact",
  editSessionSource.includes("failed storage save retains the draft")
    && cardViewSource.includes("const editSessions = new Map")
    && cardViewSource.includes("module-level draft survives their board rerender"),
);

const buildId = appSource.match(/BUILD_ID = "([^"]+)"/)?.[1];
const cacheVersion = swSource.match(/CACHE_VERSION = "([^"]+)"/)?.[1];
assert(
  "app and service-worker identities move together",
  buildId?.replace(/\./g, "-") === cacheVersion && buildId === "2026.07.20-f",
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

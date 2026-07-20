import { readFileSync } from "node:fs";
import ts from "typescript";

const linkSource = readFileSync("src/lib/links.ts", "utf8");
const cardSource = readFileSync("src/ui/Card.ts", "utf8");
const retrievalSource = readFileSync("src/domain/retrieval.ts", "utf8");
const localStoreSource = readFileSync("src/storage/localStore.ts", "utf8");

const linkJs = ts.transpileModule(linkSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { extractValidHttpUrls, isValidHttpUrl } = await import(`data:text/javascript;base64,${Buffer.from(linkJs).toString("base64")}`);

function assert(name, condition) {
  if (!condition) {
    throw new Error(`FAIL ${name}`);
  }
  console.log(`PASS ${name}`);
}

assert("canonical validator accepts only http/https", isValidHttpUrl("https://example.com") && isValidHttpUrl("http://example.com/path"));
assert("canonical validator rejects hashtags and plain text", !isValidHttpUrl("#research") && !isValidHttpUrl("plain text"));
assert("canonical validator rejects unsafe protocols", !isValidHttpUrl("data:image/jpeg;base64,AAAA") && !isValidHttpUrl("blob:https://example.com/x") && !isValidHttpUrl("javascript:alert(1)"));
assert("canonical validator rejects non strings", !isValidHttpUrl({}) && !isValidHttpUrl([]));
assert("mixed links count valid URLs only", extractValidHttpUrls(["https://example.com/a", "https://example.com/b", "#research"]).length === 2);
assert("hashtag-only link count is zero", extractValidHttpUrls(["#research"]).length === 0);
assert(
  "card rendering uses canonical validator",
  cardSource.includes("const normalized = normalizeReadableHttpUrl(link)")
    && cardSource.includes("anchor.href = normalized")
    && cardSource.includes("if (normalized)"),
);
assert("retrieval filter uses canonical validator", retrievalSource.includes("extractValidHttpUrls(card.richLinks).length > 0"));
assert("search index uses valid URLs from canonical validator", retrievalSource.includes("...extractValidHttpUrls(card.richLinks)"));
assert("safeHref auto-prefix was removed", !cardSource.includes("function safeHref") && !cardSource.includes("https://${value}"));
assert("tags are sanitized from explicit tags field", localStoreSource.includes("source.tags") && localStoreSource.includes("normalizeTags(source.tags)"));
assert("tag filter reads card tags only", retrievalSource.includes("card.tags.includes(tag)") && !retrievalSource.includes("contextSnapshot.includes(tag)"));

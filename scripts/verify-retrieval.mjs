import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("src/domain/retrieval.ts", "utf8").replace(/^import type .*$/gm, "");
const linkSource = readFileSync("src/lib/links.ts", "utf8");
const js = ts.transpileModule(source.replace('import { extractValidHttpUrls } from "../lib/links";', ""), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const linkJs = ts.transpileModule(linkSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(`${linkJs}\n${js}`).toString("base64")}`);

const {
  buildSearchText,
  collectTags,
  filterCards,
  normalizeSearchText,
  normalizeTagInput,
  extractValidHttpUrls,
  isValidHttpUrl,
} = mod;

const states = ["continue", "pause", "finished", "leave-alone"];
const now = new Date("2026-07-11T12:00:00+07:00");

function card(id, overrides = {}) {
  return {
    id,
    title: "Moon research",
    note: "quiet note",
    contextSnapshot: "nghiên cứu continuity",
    whyStillOpen: "needs one returned thought",
    ifYouReturn: "start from the saved link",
    richLinks: ["https://example.com/moon"],
    imageRefs: [],
    audioRefs: [],
    fileRefs: [],
    bookmarkReason: "worth keeping",
    tags: ["moon", "research"],
    state: "continue",
    hidden: false,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-11T04:00:00.000Z",
    ...overrides,
  };
}

const cards = [
  card("title"),
  card("note", { title: "Different", note: "only-note-token", tags: ["personal"], richLinks: [] }),
  card("snapshot", { title: "Different", contextSnapshot: "snapshot-only-token", tags: [], richLinks: [] }),
  card("why", { title: "Different", whyStillOpen: "why-only-token", tags: [], richLinks: [] }),
  card("return", { title: "Different", ifYouReturn: "return-only-token", tags: [], richLinks: [] }),
  card("bookmark", { title: "Different", bookmarkReason: "bookmark-only-token", tags: [], richLinks: [] }),
  card("link", { title: "Different", richLinks: ["https://example.com/link-only-token"], tags: [] }),
  card("tag", { title: "Different", tags: ["finance"], richLinks: [] }),
  card("file", { title: "Different", fileRefs: [{ name: "receipt-token.pdf", type: "application/pdf", size: 12 }], richLinks: [] }),
  card("pause", { state: "pause", tags: ["moon"], audioRefs: ["data:audio/webm;base64,AAAA"], richLinks: [] }),
  card("image-link", { imageRefs: ["data:image/png;base64,AAAA"], richLinks: ["https://example.com/asset"], tags: ["asset"] }),
  card("file-old", { state: "finished", fileRefs: [{ name: "old.pdf", type: "application/pdf", size: 12 }], updatedAt: "2026-05-01T00:00:00.000Z", tags: ["old"] }),
  card("snapshot-hashtag", { title: "Different", contextSnapshot: "#research", tags: [], richLinks: [] }),
  card("link-hashtag", { title: "Different", contextSnapshot: "", tags: [], richLinks: ["#research"] }),
  card("tag-proof", {
    title: "Different",
    note: "",
    contextSnapshot: "",
    whyStillOpen: "",
    ifYouReturn: "",
    bookmarkReason: "",
    richLinks: ["https://example.com/not-proof"],
    fileRefs: [{ name: "plain.pdf", type: "application/pdf", size: 1 }],
    tags: ["retrieval-proof-742"],
  }),
  card("waiting", { title: "Different", waitingOn: "client-feedback-token", richLinks: [], tags: [] }),
  card("next-step", { title: "Different", nextStep: "open-figma-token", richLinks: [], tags: [] }),
  card("promise", { title: "Different", promise: "deliver-logo-token", promiseTo: "client-lan-token", richLinks: [], tags: [] }),
  card("outcome", { title: "Different", outcome: "approved-version-three-token", richLinks: [], tags: [] }),
  card("hidden", { hidden: true, title: "hidden-token" }),
];

function ids(result) {
  return result.map((item) => item.id);
}

function assert(name, condition) {
  if (!condition) {
    throw new Error(`FAIL ${name}`);
  }
  console.log(`PASS ${name}`);
}

function query(overrides = {}) {
  return {
    search: "",
    states: [...states],
    media: [],
    lastTouched: "any",
    tags: [],
    ...overrides,
  };
}

assert("title match", ids(filterCards(cards, query({ search: "moon research" }), states, now)).includes("title"));
assert("note match", ids(filterCards(cards, query({ search: "only-note-token" }), states, now)).includes("note"));
assert("snapshot match", ids(filterCards(cards, query({ search: "snapshot-only-token" }), states, now)).includes("snapshot"));
assert("whyStillOpen match", ids(filterCards(cards, query({ search: "why-only-token" }), states, now)).includes("why"));
assert("ifYouReturn match", ids(filterCards(cards, query({ search: "return-only-token" }), states, now)).includes("return"));
assert("bookmarkReason match", ids(filterCards(cards, query({ search: "bookmark-only-token" }), states, now)).includes("bookmark"));
assert("link match", ids(filterCards(cards, query({ search: "link-only-token" }), states, now)).includes("link"));
assert("file name match", ids(filterCards(cards, query({ search: "receipt-token" }), states, now)).includes("file"));
assert("tag search match", ids(filterCards(cards, query({ search: "#finance" }), states, now)).includes("tag"));
assert("case-insensitive match", ids(filterCards(cards, query({ search: "MOON" }), states, now)).includes("title"));
assert("Vietnamese diacritic normalization", normalizeSearchText("nghiên cứu") === normalizeSearchText("nghien cuu"));
assert("multiple-term AND behavior", ids(filterCards(cards, query({ search: "moon continuity" }), states, now)).includes("title"));
assert("no match state", filterCards(cards, query({ search: "missing-token" }), states, now).length === 0);
assert("single state", ids(filterCards(cards, query({ states: ["pause"] }), states, now)).every((id) => id === "pause"));
assert("multiple states OR", ids(filterCards(cards, query({ states: ["pause", "finished"] }), states, now)).includes("pause"));
assert("image filter", ids(filterCards(cards, query({ media: ["image"] }), states, now)).includes("image-link"));
assert("voice filter", ids(filterCards(cards, query({ media: ["voice"] }), states, now)).includes("pause"));
assert("file filter", ids(filterCards(cards, query({ media: ["file"] }), states, now)).includes("file"));
assert("link filter", ids(filterCards(cards, query({ media: ["link"] }), states, now)).includes("title"));
assert("multiple media AND", ids(filterCards(cards, query({ media: ["image", "link"] }), states, now)).length === 1);
assert("today filter", ids(filterCards(cards, query({ lastTouched: "today" }), states, now)).includes("title"));
assert("7 day filter", ids(filterCards(cards, query({ lastTouched: "last7" }), states, now)).includes("pause"));
assert("30 day filter", !ids(filterCards(cards, query({ lastTouched: "last30" }), states, now)).includes("file-old"));
assert("older than 30 days filter", ids(filterCards(cards, query({ lastTouched: "older30" }), states, now)).includes("file-old"));
assert("combined search state media date", ids(filterCards(cards, query({ search: "moon", states: ["pause"], media: ["voice"], lastTouched: "last7" }), states, now))[0] === "pause");
assert("tag filter AND", ids(filterCards(cards, query({ tags: ["moon", "research"] }), states, now)).includes("title"));
assert("tag normalization", normalizeTagInput("#Moon, research research WAYTOOLONGWAYTOOLONGWAYTOOLONGWAYTOOLONG")[0] === "moon");
assert("tag collection", collectTags(cards).includes("finance"));
assert("raw media not searched", !buildSearchText(card("raw", { imageRefs: ["data:image/png;base64,SECRET"] })).includes("secret"));
assert("valid https URL", isValidHttpUrl("https://example.com"));
assert("valid http URL", isValidHttpUrl("http://example.com/path"));
assert("URL with query", isValidHttpUrl("https://example.com?q=test"));
assert("hashtag rejected as URL", !isValidHttpUrl("#research"));
assert("plain text rejected as URL", !isValidHttpUrl("research"));
assert("empty URL rejected", !isValidHttpUrl(""));
assert("whitespace URL rejected", !isValidHttpUrl("   "));
assert("data URL rejected", !isValidHttpUrl("data:image/jpeg;base64,AAAA"));
assert("blob URL rejected", !isValidHttpUrl("blob:https://example.com/id"));
assert("javascript URL rejected", !isValidHttpUrl("javascript:alert(1)"));
assert("malformed URL rejected", !isValidHttpUrl("malformed://value"));
assert("object URL rejected", !isValidHttpUrl({ href: "https://example.com" }));
assert("array URL rejected", !isValidHttpUrl(["https://example.com"]));
assert("two valid URLs plus hashtag count 2", extractValidHttpUrls(["https://example.com/a", "https://example.com/b", "#research"]).length === 2);
assert("one valid URL plus plain line count 1", extractValidHttpUrls(["plain text", "https://example.com"]).length === 1);
assert("hashtag only count 0", extractValidHttpUrls(["#research"]).length === 0);
assert("plain text only count 0", extractValidHttpUrls(["plain text"]).length === 0);
assert("data URL only count 0", extractValidHttpUrls(["data:image/jpeg;base64,AAAA"]).length === 0);
assert("has-link false for hashtag only", !ids(filterCards(cards, query({ media: ["link"], search: "#research" }), states, now)).includes("link-hashtag"));
assert("has-link true for mixed valid invalid", ids(filterCards([card("mixed", { richLinks: ["https://example.com", "#research"] })], query({ media: ["link"] }), states, now))[0] === "mixed");
assert("snapshot hashtag generic search match", ids(filterCards(cards, query({ search: "#research" }), states, now)).includes("snapshot-hashtag"));
assert("snapshot hashtag does not create tag filter match", !ids(filterCards(cards, query({ tags: ["research"] }), states, now)).includes("snapshot-hashtag"));
assert("link hashtag does not create tag filter match", !ids(filterCards(cards, query({ tags: ["research"] }), states, now)).includes("link-hashtag"));
assert("tag filter reads only tags array", ids(filterCards(cards, query({ tags: ["retrieval-proof-742"] }), states, now))[0] === "tag-proof");
assert("unique tag token search match", ids(filterCards(cards, query({ search: "retrieval-proof-742" }), states, now))[0] === "tag-proof");
assert("unique hashtag token search match", ids(filterCards(cards, query({ search: "#retrieval-proof-742" }), states, now))[0] === "tag-proof");
assert("waiting context search match", ids(filterCards(cards, query({ search: "client-feedback-token" }), states, now))[0] === "waiting");
assert("next step search match", ids(filterCards(cards, query({ search: "open-figma-token" }), states, now))[0] === "next-step");
assert("promise search match", ids(filterCards(cards, query({ search: "deliver-logo-token" }), states, now))[0] === "promise");
assert("promise counterparty search match", ids(filterCards(cards, query({ search: "client-lan-token" }), states, now))[0] === "promise");
assert("outcome search match", ids(filterCards(cards, query({ search: "approved-version-three-token" }), states, now))[0] === "outcome");

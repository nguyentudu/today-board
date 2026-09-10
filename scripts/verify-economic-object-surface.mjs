import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const read = (path) => readFileSync(path, "utf8");
const surfaceSource = read("src/economicObjects/EconomicObjectAttentionSurface.ts");
const boardSource = read("src/ui/Board.ts");
const appSource = read("src/app.ts");
const styles = read("styles/main.css");
const packageJson = JSON.parse(read("package.json"));
const protectedSources = [
  "src/app.ts",
  "src/domain/card.ts",
  "src/domain/board.ts",
  "src/domain/lifecycle.ts",
  "src/domain/state.ts",
  "src/storage/localStore.ts",
  "src/storage/exportBoard.ts",
  "src/commercial/checkoutClient.ts",
  "src/commercial/entitlementStore.ts",
].map(read).join("\n");

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
let contracts;
let fixtures;
let surfaceModule;
try {
  contracts = await vite.ssrLoadModule("/src/economicObjects/contracts.ts");
  fixtures = await vite.ssrLoadModule("/src/economicObjects/fixtures.ts");
  surfaceModule = await vite.ssrLoadModule("/src/economicObjects/EconomicObjectAttentionSurface.ts");
} finally {
  await vite.close();
}

const projections = fixtures.ECONOMIC_OBJECT_FIXTURES;
assert.equal(projections.length, 5, "R1 must render exactly the five R0 fixtures");
assert.ok(
  projections.every((projection) => projection.projectionVersion === contracts.ECONOMIC_OBJECT_PROJECTION_VERSION),
  "R1 must consume the exact R0 projection version",
);
assert.ok(projections.every((projection) => projection.source.system === "fixture"), "R1 must remain fixture-only");
assert.ok(projections.every(contracts.isFailClosedProjection), "R1 must surface only R0-valid fail-closed projections");

class TestElement {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.className = "";
    this.id = "";
    this.ownText = "";
  }

  append(...children) {
    this.children.push(...children);
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  set textContent(value) {
    this.ownText = String(value ?? "");
  }

  get textContent() {
    return [this.ownText, ...this.children.map((child) => child.textContent)].filter(Boolean).join(" ");
  }

  findAll(predicate) {
    return [
      ...(predicate(this) ? [this] : []),
      ...this.children.flatMap((child) => child.findAll(predicate)),
    ];
  }
}

const originalDocument = globalThis.document;
globalThis.document = { createElement: (tagName) => new TestElement(tagName) };
let vietnameseSurface;
let englishSurface;
try {
  vietnameseSurface = surfaceModule.EconomicObjectAttentionSurface({ projections, language: "vi" });
  englishSurface = surfaceModule.EconomicObjectAttentionSurface({ projections, language: "en" });
} finally {
  if (originalDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = originalDocument;
  }
}

for (const [language, rendered] of [["vi", vietnameseSurface], ["en", englishSurface]]) {
  assert.equal(rendered.tagName, "section", `${language} surface must render a semantic section`);
  assert.equal(rendered.getAttribute("lang"), language, `${language} surface must expose its document language`);
  assert.equal(rendered.getAttribute("aria-labelledby"), "economic-object-surface-title");
  assert.equal(rendered.findAll((element) => element.tagName === "article").length, 5, `${language} surface must render five objects`);
  assert.equal(rendered.findAll((element) => element.tagName === "button").length, 0, `${language} surface must render no action button`);
}

const vietnameseText = vietnameseSurface.textContent;
const englishText = englishSurface.textContent;
const expectedVietnameseById = {
  "game-asset-moon-shrine-prop-001": [
    "Đạo cụ biểu tượng Đền Trăng",
    "Bằng chứng nguồn gốc và giấy phép đã đầy đủ để dùng trong bản dựng Game Seed tiếp theo.",
    "Phê duyệt phiên bản này cho bản dựng Game Seed.",
  ],
  "game-asset-forest-material-002": [
    "Vật liệu Rừng Khí Quyển Moon",
    "Một texture mua ngoài chưa có quyền phân phối lại được xác minh.",
    "Quyền phân phối lại của phần phụ thuộc texture-dependency-17 chưa được giải quyết.",
    "Giải quyết giấy phép của phần phụ thuộc trước khi thương mại hóa.",
  ],
  "digital-business-demo-003": [
    "Doanh nghiệp số tổng hợp",
    "Đã có bằng chứng kiểm soát, nhưng các điều kiện chuyển giao theo hợp đồng chưa đầy đủ.",
    "Việc chuyển nhượng theo hợp đồng và sự đồng ý của bên thứ ba chưa được xác minh.",
    "Xác minh điều kiện chuyển nhượng và sự đồng ý bắt buộc.",
  ],
  "platform-account-demo-004": [
    "Tài khoản nền tảng tổng hợp",
    "Quyền truy cập tài khoản không chứng minh quyền sở hữu có thể chuyển giao hoặc sự cho phép của nền tảng.",
    "Đối tượng nền tảng được đánh dấu không thể chuyển giao cho đến khi điều khoản có thẩm quyền chứng minh ngược lại.",
    "Không đề nghị chuyển giao; giữ nguyên hạn chế của nền tảng.",
  ],
  "unknown-digital-object-005": [
    "Đối tượng số chưa xác định",
    "Đối tượng chưa được phân loại và chưa có bằng chứng có thẩm quyền.",
    "Danh tính, quyền và khả năng chuyển giao đều chưa rõ.",
    "Phân loại đối tượng và thu thập bằng chứng trước khi tiếp tục.",
  ],
};
for (const projection of projections) {
  const article = vietnameseSurface.findAll(
    (element) => element.tagName === "article" && element.dataset.economicObjectId === projection.object.objectId,
  )[0];
  assert.ok(article, `Vietnamese DOM must include ${projection.object.objectId}`);
  assert.ok(article.textContent.includes(projection.object.objectId), `Canonical ID must be visible for ${projection.object.objectId}`);
  for (const localizedValue of expectedVietnameseById[projection.object.objectId]) {
    assert.ok(article.textContent.includes(localizedValue), `Vietnamese DOM must render localized content for ${projection.object.objectId}: ${localizedValue}`);
  }
  assert.ok(englishText.includes(projection.object.objectId), `English DOM must expose ${projection.object.objectId}`);
  assert.ok(englishText.includes(projection.object.title), `English DOM must retain title for ${projection.object.objectId}`);
  assert.ok(englishText.includes(projection.attention.whyNow), `English DOM must retain Why now for ${projection.object.objectId}`);
  assert.ok(englishText.includes(projection.nextAction.label), `English DOM must retain proposal for ${projection.object.objectId}`);
  assert.ok(!vietnameseText.includes(projection.object.title), `Vietnamese DOM must localize title for ${projection.object.objectId}`);
  assert.ok(!vietnameseText.includes(projection.attention.whyNow), `Vietnamese DOM must localize Why now for ${projection.object.objectId}`);
  assert.ok(!vietnameseText.includes(projection.nextAction.label), `Vietnamese DOM must localize proposal for ${projection.object.objectId}`);
  for (const blocker of projection.attention.blockers) {
    assert.ok(englishText.includes(blocker), `English DOM must retain blocker for ${projection.object.objectId}`);
    assert.ok(!vietnameseText.includes(blocker), `Vietnamese DOM must localize blocker for ${projection.object.objectId}`);
  }
}

for (const expectedVietnameseText of [
  "Bằng chứng",
  "Quyền",
  "Khả năng chuyển giao",
  "ĐÃ XÁC MINH",
  "ĐANG BỊ CHẶN",
]) {
  assert.ok(vietnameseText.includes(expectedVietnameseText), `Vietnamese DOM must render: ${expectedVietnameseText}`);
}

const vietnameseArticles = vietnameseSurface.findAll((element) => element.tagName === "article");
assert.ok(vietnameseArticles.slice(0, 4).every((article) => article.className.includes("attention-blocked")), "Blocked fixtures must surface first");
assert.ok(vietnameseArticles[4].className.includes("attention-actionable"), "Actionable fixture must follow blockers");

for (const requiredField of [
  "projection.proof.state",
  "projection.rights.state",
  "projection.transferability.state",
  "projection.attention.whyNow",
  "projection.attention.blockers",
  "projection.nextAction.label",
  "projection.nextAction.targetSystem",
  "projection.nextAction.founderApprovalRequired",
]) {
  assert.ok(surfaceSource.includes(requiredField), `R1 surface must render ${requiredField}`);
}

assert.ok(boardSource.includes("EconomicObjectAttentionSurface({"), "Board must mount the bounded R1 surface");
assert.ok(boardSource.includes("projections: ECONOMIC_OBJECT_FIXTURES"), "Board must pass only the canonical R0 fixtures");
assert.ok(appSource.includes("document.documentElement.lang = language"), "Language changes must update document semantics");
assert.ok(surfaceSource.includes('surface.dataset.source = "fixture"'), "Surface must disclose fixture provenance");
assert.ok(surfaceSource.includes("No live rights claim") && surfaceSource.includes("Không có xác nhận quyền thực tế"), "Surface must disclose its synthetic, non-live boundary in both languages");
assert.ok(surfaceSource.includes("Founder approval required") && surfaceSource.includes("Cần Founder phê duyệt"), "Surface must preserve Founder authority in both languages");

assert.ok(!surfaceSource.includes('document.createElement("button")'), "R1 must expose no execution button");
assert.ok(!surfaceSource.includes("addEventListener"), "R1 must have no action handler");
assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(surfaceSource), "R1 must have no network primitive");
assert.ok(!/(localStorage|sessionStorage|indexedDB|trySaveBoard|saveBoard)/.test(surfaceSource), "R1 must not persist fixture state");
assert.ok(!surfaceSource.includes("../commercial/"), "R1 must not depend on commerce or entitlements");
assert.ok(!surfaceSource.includes("../domain/"), "R1 must not reinterpret Situation or Board domain semantics");
assert.ok(!protectedSources.includes("EconomicObjectAttentionSurface"), "R1 must not mutate protected runtime/domain/storage/commercial modules");

for (const className of [
  ".economic-object-surface",
  ".economic-object-list",
  ".economic-object-states",
  ".economic-object-next",
]) {
  assert.ok(styles.includes(className), `R1 responsive styling must include ${className}`);
}
assert.ok(
  /@media \(max-width: 640px\)[\s\S]*\.economic-object-list/.test(styles),
  "R1 surface must have a mobile layout",
);
assert.equal(
  packageJson.scripts["test:economic-object-surface"],
  "node scripts/verify-economic-object-surface.mjs",
  "R1 verifier must be exposed as a stable package script",
);

console.log("Economic Object R1 attention surface passed (fixture-only, read-only, fail-closed, authority-preserving).");

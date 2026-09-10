import type {
  AttentionState,
  EconomicObjectAttentionProjection,
  EconomicObjectDomain,
  ProofState,
  RightsState,
  TransferabilityState,
} from "./contracts";
import type { Language } from "../ui/i18n";

interface EconomicObjectAttentionSurfaceProps {
  projections: readonly EconomicObjectAttentionProjection[];
  language: Language;
}

const attentionPriority: Record<EconomicObjectAttentionProjection["attention"]["state"], number> = {
  blocked: 0,
  actionable: 1,
  opportunity: 2,
  watch: 3,
  no_action: 4,
};

const surfaceCopy = {
  en: {
    eyebrow: "Economic Object Surface · Fixture only",
    title: "What deserves attention now?",
    helper: "Five synthetic, read-only projections. No live rights claim, transaction, or transfer is available here.",
    objects: "objects",
    blocked: "blocked",
    actionable: "actionable",
    canonicalId: "Canonical ID",
    proof: "Proof",
    rights: "Rights",
    transferability: "Transferability",
    whyNow: "Why now?",
    blockers: "Blockers",
    noBlockers: "No unresolved blocker in this fixture.",
    next: "Next safe proposal",
    target: "Owning system",
    founderApproval: "Founder approval required",
    version: "Version",
  },
  vi: {
    eyebrow: "Bề mặt Đối tượng Kinh tế · Chỉ dữ liệu mẫu",
    title: "Điều gì đang đáng chú ý?",
    helper: "Năm bản chiếu dữ liệu tổng hợp, chỉ đọc. Không có xác nhận quyền thực tế, giao dịch hay chuyển nhượng nào được mở tại đây.",
    objects: "đối tượng",
    blocked: "đang bị chặn",
    actionable: "có thể xem xét",
    canonicalId: "ID chuẩn",
    proof: "Bằng chứng",
    rights: "Quyền",
    transferability: "Khả năng chuyển giao",
    whyNow: "Vì sao lúc này?",
    blockers: "Điểm chặn",
    noBlockers: "Fixture này không có điểm chặn chưa giải quyết.",
    next: "Đề xuất an toàn tiếp theo",
    target: "Hệ chịu trách nhiệm",
    founderApproval: "Cần Founder phê duyệt",
    version: "Phiên bản",
  },
} as const;

interface LocalizedProjectionText {
  title: string;
  whyNow: string;
  blockers: readonly string[];
  nextAction: string;
}

const vietnameseFixtureCopy: Readonly<Record<string, LocalizedProjectionText>> = Object.freeze({
  "game-asset-moon-shrine-prop-001": {
    title: "Đạo cụ biểu tượng Đền Trăng",
    whyNow: "Bằng chứng nguồn gốc và giấy phép đã đầy đủ để dùng trong bản dựng Game Seed tiếp theo.",
    blockers: [],
    nextAction: "Phê duyệt phiên bản này cho bản dựng Game Seed.",
  },
  "game-asset-forest-material-002": {
    title: "Vật liệu Rừng Khí Quyển Moon",
    whyNow: "Một texture mua ngoài chưa có quyền phân phối lại được xác minh.",
    blockers: ["Quyền phân phối lại của phần phụ thuộc texture-dependency-17 chưa được giải quyết."],
    nextAction: "Giải quyết giấy phép của phần phụ thuộc trước khi thương mại hóa.",
  },
  "digital-business-demo-003": {
    title: "Doanh nghiệp số tổng hợp",
    whyNow: "Đã có bằng chứng kiểm soát, nhưng các điều kiện chuyển giao theo hợp đồng chưa đầy đủ.",
    blockers: ["Việc chuyển nhượng theo hợp đồng và sự đồng ý của bên thứ ba chưa được xác minh."],
    nextAction: "Xác minh điều kiện chuyển nhượng và sự đồng ý bắt buộc.",
  },
  "platform-account-demo-004": {
    title: "Tài khoản nền tảng tổng hợp",
    whyNow: "Quyền truy cập tài khoản không chứng minh quyền sở hữu có thể chuyển giao hoặc sự cho phép của nền tảng.",
    blockers: ["Đối tượng nền tảng được đánh dấu không thể chuyển giao cho đến khi điều khoản có thẩm quyền chứng minh ngược lại."],
    nextAction: "Không đề nghị chuyển giao; giữ nguyên hạn chế của nền tảng.",
  },
  "unknown-digital-object-005": {
    title: "Đối tượng số chưa xác định",
    whyNow: "Đối tượng chưa được phân loại và chưa có bằng chứng có thẩm quyền.",
    blockers: ["Danh tính, quyền và khả năng chuyển giao đều chưa rõ."],
    nextAction: "Phân loại đối tượng và thu thập bằng chứng trước khi tiếp tục.",
  },
});

const stateLabels = {
  en: {
    domain: {
      game_asset: "GAME ASSET",
      digital_business: "DIGITAL BUSINESS",
      platform_account: "PLATFORM ACCOUNT",
      unknown: "UNKNOWN",
    },
    proof: { verified: "VERIFIED", partial: "PARTIAL", unverified: "UNVERIFIED", unknown: "UNKNOWN" },
    rights: { clear: "CLEAR", conditional: "CONDITIONAL", unresolved: "UNRESOLVED", unknown: "UNKNOWN" },
    transferability: {
      transferable: "TRANSFERABLE",
      conditionally_transferable: "CONDITIONALLY TRANSFERABLE",
      license_only: "LICENSE ONLY",
      non_transferable: "NON-TRANSFERABLE",
      unknown: "UNKNOWN",
    },
    attention: {
      blocked: "BLOCKED",
      actionable: "ACTIONABLE",
      opportunity: "OPPORTUNITY",
      watch: "WATCH",
      no_action: "NO ACTION",
    },
  },
  vi: {
    domain: {
      game_asset: "TÀI SẢN GAME",
      digital_business: "DOANH NGHIỆP SỐ",
      platform_account: "TÀI KHOẢN NỀN TẢNG",
      unknown: "CHƯA PHÂN LOẠI",
    },
    proof: { verified: "ĐÃ XÁC MINH", partial: "MỘT PHẦN", unverified: "CHƯA XÁC MINH", unknown: "CHƯA RÕ" },
    rights: { clear: "RÕ RÀNG", conditional: "CÓ ĐIỀU KIỆN", unresolved: "CHƯA GIẢI QUYẾT", unknown: "CHƯA RÕ" },
    transferability: {
      transferable: "CÓ THỂ CHUYỂN GIAO",
      conditionally_transferable: "CHUYỂN GIAO CÓ ĐIỀU KIỆN",
      license_only: "CHỈ CẤP PHÉP",
      non_transferable: "KHÔNG THỂ CHUYỂN GIAO",
      unknown: "CHƯA RÕ",
    },
    attention: {
      blocked: "ĐANG BỊ CHẶN",
      actionable: "CÓ THỂ XEM XÉT",
      opportunity: "CƠ HỘI",
      watch: "THEO DÕI",
      no_action: "KHÔNG CẦN HÀNH ĐỘNG",
    },
  },
} satisfies Record<Language, {
  domain: Record<EconomicObjectDomain, string>;
  proof: Record<ProofState, string>;
  rights: Record<RightsState, string>;
  transferability: Record<TransferabilityState, string>;
  attention: Record<AttentionState, string>;
}>;

export function EconomicObjectAttentionSurface({
  projections,
  language,
}: EconomicObjectAttentionSurfaceProps): HTMLElement {
  const text = surfaceCopy[language];
  const surface = document.createElement("section");
  surface.className = "economic-object-surface";
  surface.setAttribute("aria-labelledby", "economic-object-surface-title");
  surface.setAttribute("lang", language);
  surface.dataset.source = "fixture";
  surface.dataset.projectionVersion = projections[0]?.projectionVersion ?? "";

  const heading = document.createElement("div");
  heading.className = "economic-object-heading";

  const headingCopy = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "economic-object-eyebrow";
  eyebrow.textContent = text.eyebrow;

  const title = document.createElement("h2");
  title.id = "economic-object-surface-title";
  title.textContent = text.title;

  const helper = document.createElement("p");
  helper.className = "economic-object-helper";
  helper.textContent = text.helper;
  headingCopy.append(eyebrow, title, helper);

  const summary = document.createElement("dl");
  summary.className = "economic-object-summary";
  appendMetric(summary, String(projections.length), text.objects);
  appendMetric(summary, String(countAttention(projections, "blocked")), text.blocked);
  appendMetric(summary, String(countAttention(projections, "actionable")), text.actionable);
  heading.append(headingCopy, summary);

  const list = document.createElement("div");
  list.className = "economic-object-list";

  const orderedProjections = [...projections].sort(
    (left, right) => attentionPriority[left.attention.state] - attentionPriority[right.attention.state],
  );

  for (const projection of orderedProjections) {
    list.append(renderProjection(projection, language));
  }

  surface.append(heading, list);
  return surface;
}

function renderProjection(projection: EconomicObjectAttentionProjection, language: Language): HTMLElement {
  const text = surfaceCopy[language];
  const projectionText = localizeProjection(projection, language);
  const labels = stateLabels[language];
  const card = document.createElement("article");
  card.className = `economic-object-card attention-${projection.attention.state}`;
  card.dataset.economicObjectId = projection.object.objectId;
  card.dataset.proofState = projection.proof.state;
  card.dataset.rightsState = projection.rights.state;
  card.dataset.transferabilityState = projection.transferability.state;

  const header = document.createElement("div");
  header.className = "economic-object-card-header";

  const identity = document.createElement("div");
  const domain = document.createElement("p");
  domain.className = "economic-object-domain";
  domain.textContent = labels.domain[projection.object.domain];
  const title = document.createElement("h3");
  title.textContent = projectionText.title;
  const canonicalId = document.createElement("p");
  canonicalId.className = "economic-object-id";
  canonicalId.textContent = `${text.canonicalId}: ${projection.object.objectId}`;
  const version = document.createElement("p");
  version.className = "economic-object-version";
  version.textContent = `${text.version}: ${projection.object.versionId}`;
  identity.append(domain, title, canonicalId, version);

  const attention = document.createElement("span");
  attention.className = `economic-object-attention attention-${projection.attention.state}`;
  attention.textContent = labels.attention[projection.attention.state];
  header.append(identity, attention);

  const states = document.createElement("dl");
  states.className = "economic-object-states";
  appendState(states, text.proof, labels.proof[projection.proof.state]);
  appendState(states, text.rights, labels.rights[projection.rights.state]);
  appendState(states, text.transferability, labels.transferability[projection.transferability.state]);

  const whyNow = createTextBlock(text.whyNow, projectionText.whyNow, "economic-object-why");

  const blockers = document.createElement("div");
  blockers.className = "economic-object-blockers";
  const blockersTitle = document.createElement("h4");
  blockersTitle.textContent = text.blockers;
  const blockersList = document.createElement("ul");
  const blockerValues = projectionText.blockers.length > 0
    ? projectionText.blockers
    : [text.noBlockers];
  for (const blocker of blockerValues) {
    const item = document.createElement("li");
    item.textContent = blocker;
    blockersList.append(item);
  }
  blockers.append(blockersTitle, blockersList);

  const next = document.createElement("div");
  next.className = "economic-object-next";
  const nextTitle = document.createElement("h4");
  nextTitle.textContent = text.next;
  const nextLabel = document.createElement("p");
  nextLabel.textContent = projectionText.nextAction;
  const nextMeta = document.createElement("p");
  nextMeta.className = "economic-object-next-meta";
  nextMeta.textContent = `${text.target}: ${formatTargetSystem(projection.nextAction.targetSystem)}${
    projection.nextAction.founderApprovalRequired ? ` · ${text.founderApproval}` : ""
  }`;
  next.append(nextTitle, nextLabel, nextMeta);

  card.append(header, states, whyNow, blockers, next);
  return card;
}

function appendMetric(list: HTMLDListElement, value: string, label: string): void {
  const item = document.createElement("div");
  const amount = document.createElement("dd");
  amount.textContent = value;
  const name = document.createElement("dt");
  name.textContent = label;
  item.append(amount, name);
  list.append(item);
}

function appendState(list: HTMLDListElement, label: string, value: string): void {
  const item = document.createElement("div");
  const name = document.createElement("dt");
  name.textContent = label;
  const state = document.createElement("dd");
  state.textContent = value;
  item.append(name, state);
  list.append(item);
}

function createTextBlock(label: string, value: string, className: string): HTMLElement {
  const block = document.createElement("div");
  block.className = className;
  const title = document.createElement("h4");
  title.textContent = label;
  const content = document.createElement("p");
  content.textContent = value;
  block.append(title, content);
  return block;
}

function countAttention(
  projections: readonly EconomicObjectAttentionProjection[],
  state: EconomicObjectAttentionProjection["attention"]["state"],
): number {
  return projections.filter((projection) => projection.attention.state === state).length;
}

function localizeProjection(
  projection: EconomicObjectAttentionProjection,
  language: Language,
): LocalizedProjectionText {
  if (language === "vi") {
    const localized = vietnameseFixtureCopy[projection.object.objectId];
    if (localized) {
      return localized;
    }
  }

  return {
    title: projection.object.title,
    whyNow: projection.attention.whyNow,
    blockers: projection.attention.blockers,
    nextAction: projection.nextAction.label,
  };
}

function formatTargetSystem(value: EconomicObjectAttentionProjection["nextAction"]["targetSystem"]): string {
  const labels: Record<typeof value, string> = {
    today_board: "Today Board",
    proof_commerce: "Proof Commerce",
    game_seed: "Game Seed",
    founder_runtime: "Founder Runtime",
  };
  return labels[value];
}

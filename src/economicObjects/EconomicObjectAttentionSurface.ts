import type { EconomicObjectAttentionProjection } from "./contracts";
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
    eyebrow: "Economic Object Surface · Chỉ fixture",
    title: "Điều gì đang đáng chú ý?",
    helper: "Năm projection tổng hợp, chỉ đọc. Không có quyền thật, giao dịch hay chuyển nhượng nào được mở tại đây.",
    objects: "object",
    blocked: "đang bị chặn",
    actionable: "có thể xem xét",
    proof: "Proof",
    rights: "Rights",
    transferability: "Transferability",
    whyNow: "Vì sao lúc này?",
    blockers: "Điểm chặn",
    noBlockers: "Fixture này không có điểm chặn chưa giải quyết.",
    next: "Đề xuất an toàn tiếp theo",
    target: "Hệ chịu trách nhiệm",
    founderApproval: "Cần Founder phê duyệt",
    version: "Phiên bản",
  },
} as const;

export function EconomicObjectAttentionSurface({
  projections,
  language,
}: EconomicObjectAttentionSurfaceProps): HTMLElement {
  const text = surfaceCopy[language];
  const surface = document.createElement("section");
  surface.className = "economic-object-surface";
  surface.setAttribute("aria-labelledby", "economic-object-surface-title");
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
  domain.textContent = formatToken(projection.object.domain);
  const title = document.createElement("h3");
  title.textContent = projection.object.title;
  const version = document.createElement("p");
  version.className = "economic-object-version";
  version.textContent = `${text.version}: ${projection.object.versionId}`;
  identity.append(domain, title, version);

  const attention = document.createElement("span");
  attention.className = `economic-object-attention attention-${projection.attention.state}`;
  attention.textContent = formatToken(projection.attention.state);
  header.append(identity, attention);

  const states = document.createElement("dl");
  states.className = "economic-object-states";
  appendState(states, text.proof, projection.proof.state);
  appendState(states, text.rights, projection.rights.state);
  appendState(states, text.transferability, projection.transferability.state);

  const whyNow = createTextBlock(text.whyNow, projection.attention.whyNow, "economic-object-why");

  const blockers = document.createElement("div");
  blockers.className = "economic-object-blockers";
  const blockersTitle = document.createElement("h4");
  blockersTitle.textContent = text.blockers;
  const blockersList = document.createElement("ul");
  const blockerValues = projection.attention.blockers.length > 0
    ? projection.attention.blockers
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
  nextLabel.textContent = projection.nextAction.label;
  const nextMeta = document.createElement("p");
  nextMeta.className = "economic-object-next-meta";
  nextMeta.textContent = `${text.target}: ${formatToken(projection.nextAction.targetSystem)}${
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
  state.textContent = formatToken(value);
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

function formatToken(value: string): string {
  return value.replace(/_/g, " ").toUpperCase();
}

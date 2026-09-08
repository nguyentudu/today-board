import { COMMERCIAL_CATALOG } from "./catalog";
import type { EntitlementSnapshot } from "./contracts";
import type { Language } from "../ui/i18n";
import { requestCheckout } from "./checkoutClient";
import { CustomerPortal } from "./CustomerPortal";

interface CommercialEntryProps {
  language: Language;
  entitlement: EntitlementSnapshot;
}

const commercialCopy = {
  vi: {
    summary: "Moon Local và bản xem trước Continuity Pro",
    eyebrow: "Quyền truy cập hiện tại",
    localActive: "Moon Local đang hoạt động trên thiết bị này",
    localPromise: "Board cục bộ, offline và export/import luôn dùng được mà không cần tài khoản.",
    pricingTitle: "Gói dự kiến",
    available: "Đang dùng",
    preview: "Chưa mở bán",
    accountTitle: "Tài khoản và đồng bộ",
    accountCopy: "Đăng nhập và đồng bộ mã hóa chưa được kích hoạt. Moon không giả lập checkout hoặc quyền trả phí.",
    accountButton: "Tài khoản — chưa khả dụng",
    syncButton: "Đồng bộ — chưa khả dụng",
    checkoutButton: "Thanh toán — chưa khả dụng",
    portalButton: "Cổng khách hàng — chưa khả dụng",
    trustTitle: "Ranh giới tin cậy",
    trustItems: [
      "Nội dung board hiện chỉ nằm trong bộ nhớ trình duyệt trên thiết bị này.",
      "Không analytics, tracking hành vi hoặc tải nội dung board lên máy chủ.",
      "Export JSON trước khi xóa dữ liệu trình duyệt hoặc chuyển sang domain khác.",
    ],
    planFeatures: {
      local_free: ["Board local-first", "Sử dụng offline", "Export và import JSON", "Không cần tài khoản"],
      continuity_pro: ["Đồng bộ mã hóa giữa thiết bị", "Lịch sử phiên bản và khôi phục", "Dung lượng mở rộng", "Continuity review"],
      founding_license: ["Quyền truy cập Pro hosted trong vòng đời sản phẩm đã công bố", "100 đơn hoàn tất đầu tiên", "Yêu cầu điều khoản fair-use được công bố"],
    },
  },
  en: {
    summary: "Moon Local and Continuity Pro preview",
    eyebrow: "Current access",
    localActive: "Moon Local is active on this device",
    localPromise: "The local board, offline use, and JSON export/import remain available without an account.",
    pricingTitle: "Candidate offers",
    available: "In use",
    preview: "Not for sale",
    accountTitle: "Account and sync",
    accountCopy: "Sign-in and encrypted sync are not active. Moon does not simulate checkout or paid access.",
    accountButton: "Account — unavailable",
    syncButton: "Sync — unavailable",
    checkoutButton: "Checkout — unavailable",
    portalButton: "Customer portal — unavailable",
    trustTitle: "Trust boundary",
    trustItems: [
      "Board content currently stays in this browser's storage on this device.",
      "No analytics, behavioral tracking, or server upload of board content.",
      "Export JSON before clearing browser data or moving to another domain.",
    ],
    planFeatures: {
      local_free: ["Local-first board", "Offline use", "JSON export and import", "No account required"],
      continuity_pro: ["Encrypted cross-device sync", "Version history and recovery", "Extended storage", "Continuity review"],
      founding_license: ["Hosted Pro access for the published product lifetime", "First 100 completed orders", "Published fair-use terms required"],
    },
  },
} as const;

export function CommercialEntry({ language, entitlement }: CommercialEntryProps): HTMLElement {
  const text = commercialCopy[language];
  const panel = document.createElement("details");
  panel.className = "commercial-entry";
  panel.dataset.commercialStage = "preview-only";

  const summary = document.createElement("summary");
  summary.textContent = text.summary;

  const content = document.createElement("div");
  content.className = "commercial-entry-content";

  const access = document.createElement("section");
  access.className = "commercial-access";
  const eyebrow = document.createElement("p");
  eyebrow.className = "commercial-eyebrow";
  eyebrow.textContent = text.eyebrow;
  const accessTitle = document.createElement("h2");
  accessTitle.textContent = text.localActive;
  const accessCopy = document.createElement("p");
  accessCopy.textContent = text.localPromise;
  access.append(eyebrow, accessTitle, accessCopy);

  const pricing = document.createElement("section");
  pricing.className = "commercial-pricing";
  const pricingTitle = document.createElement("h2");
  pricingTitle.textContent = text.pricingTitle;
  const plans = document.createElement("div");
  plans.className = "commercial-plan-grid";

  for (const plan of COMMERCIAL_CATALOG) {
    const card = document.createElement("article");
    card.className = "commercial-plan";
    card.dataset.plan = plan.id;
    const name = document.createElement("h3");
    name.textContent = plan.name;
    const price = document.createElement("p");
    price.className = "commercial-price";
    price.textContent = plan.price;
    const state = document.createElement("p");
    state.className = plan.availability === "available" ? "commercial-state available" : "commercial-state preview";
    state.textContent = plan.availability === "available" ? text.available : text.preview;
    const features = document.createElement("ul");
    for (const feature of text.planFeatures[plan.id]) {
      const item = document.createElement("li");
      item.textContent = feature;
      features.append(item);
    }
    card.append(name, price, state, features);
    plans.append(card);
  }
  pricing.append(pricingTitle, plans);

  const account = document.createElement("section");
  account.className = "commercial-account";
  const accountTitle = document.createElement("h2");
  accountTitle.textContent = text.accountTitle;
  const accountCopy = document.createElement("p");
  accountCopy.textContent = text.accountCopy;
  const accountActions = document.createElement("div");
  accountActions.className = "commercial-disabled-actions";
  accountActions.append(
    createUnavailableButton(text.accountButton, entitlement.accountEnabled),
    createUnavailableButton(text.syncButton, entitlement.syncEnabled),
    createUnavailableButton(text.checkoutButton, requestCheckout().enabled),
    CustomerPortal(text.portalButton),
  );
  account.append(accountTitle, accountCopy, accountActions);

  const trust = document.createElement("section");
  trust.className = "commercial-trust";
  const trustTitle = document.createElement("h2");
  trustTitle.textContent = text.trustTitle;
  const trustList = document.createElement("ul");
  for (const promise of text.trustItems) {
    const item = document.createElement("li");
    item.textContent = promise;
    trustList.append(item);
  }
  trust.append(trustTitle, trustList);

  content.append(access, pricing, account, trust);
  panel.append(summary, content);
  return panel;
}

function createUnavailableButton(label: string, enabled: boolean): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiet-button";
  button.textContent = label;
  button.disabled = !enabled;
  button.setAttribute("aria-disabled", String(!enabled));
  return button;
}

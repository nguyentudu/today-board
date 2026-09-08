import type { Board } from "../domain/board";
import type { Language } from "../ui/i18n";
import { buildContinuityReview } from "./review";

interface ContinuityReviewProps {
  board: Board;
  language: Language;
  enabled: boolean;
}

const reviewCopy = {
  vi: {
    summary: "Xem lại continuity — tùy chọn",
    title: "Nhìn lại mà không tạo thêm áp lực",
    helper: "Ảnh chụp này chỉ được tính trên thiết bị. Không có điểm năng suất hay mục tiêu engagement.",
    active: "Đang tiếp tục",
    waiting: "Đang chờ hoặc tạm dừng",
    returnReady: "Có điểm quay lại",
    promises: "Lời hứa còn mở",
    finished: "Đã hoàn tất",
    prompt: "Chọn một tình huống đáng được làm rõ điểm quay lại; không cần xử lý tất cả hôm nay.",
    previewSummary: "Continuity review — bản xem trước Pro",
    previewTitle: "Có trong Moon Continuity Pro",
    previewCopy: "Tính năng này chưa hoạt động cho Moon Local. Không có dữ liệu nào được tính hoặc gửi đi từ bản xem trước này.",
  },
  en: {
    summary: "Continuity review — optional",
    title: "Look back without adding pressure",
    helper: "This snapshot is calculated only on your device. There is no productivity score or engagement goal.",
    active: "Continuing",
    waiting: "Waiting or paused",
    returnReady: "Return point present",
    promises: "Open promises",
    finished: "Finished",
    prompt: "Choose one situation whose return point deserves clarity; you do not need to process everything today.",
    previewSummary: "Continuity review — Pro preview",
    previewTitle: "Available with Moon Continuity Pro",
    previewCopy: "This feature is not active for Moon Local. This preview calculates or sends no board data.",
  },
} as const;

export function ContinuityReview({ board, language, enabled }: ContinuityReviewProps): HTMLElement {
  const text = reviewCopy[language];
  const panel = document.createElement("details");
  panel.className = "continuity-review";
  const summary = document.createElement("summary");

  if (!enabled) {
    panel.dataset.featureState = "preview-only";
    summary.textContent = text.previewSummary;
    const preview = document.createElement("div");
    preview.className = "continuity-review-content";
    const previewTitle = document.createElement("h2");
    previewTitle.textContent = text.previewTitle;
    const previewCopy = document.createElement("p");
    previewCopy.textContent = text.previewCopy;
    preview.append(previewTitle, previewCopy);
    panel.append(summary, preview);
    return panel;
  }

  panel.dataset.featureState = "enabled";
  summary.textContent = text.summary;
  const snapshot = buildContinuityReview(board);
  const content = document.createElement("div");
  content.className = "continuity-review-content";
  const title = document.createElement("h2");
  title.textContent = text.title;
  const helper = document.createElement("p");
  helper.textContent = text.helper;
  const metrics = document.createElement("dl");
  metrics.className = "continuity-metrics";
  for (const [label, value] of [
    [text.active, snapshot.active],
    [text.waiting, snapshot.waiting],
    [text.returnReady, snapshot.returnReady],
    [text.promises, snapshot.openPromises],
    [text.finished, snapshot.finished],
  ] as const) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const count = document.createElement("dd");
    count.textContent = String(value);
    item.append(term, count);
    metrics.append(item);
  }
  const prompt = document.createElement("p");
  prompt.className = "continuity-review-prompt";
  prompt.textContent = text.prompt;
  content.append(title, helper, metrics, prompt);
  panel.append(summary, content);
  return panel;
}

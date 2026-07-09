import type { BoardState } from "./state";

const REENTRY_PLACEHOLDER_VALUES = new Set([
  "Snapshot: what is happening?",
  "Snapshot: chuyện gì đang diễn ra?",
  "Why is this still open?",
  "Vì sao còn mở?",
  "If I return, start here",
  "If you return later, start here.",
  "Nếu quay lại, bắt đầu từ đâu?",
  "Nếu quay lại, hãy bắt đầu từ đây.",
]);

export interface Card {
  id: string;
  title: string;
  note: string;
  contextSnapshot: string;
  whyStillOpen: string;
  ifYouReturn: string;
  richLinks: string[];
  imageRefs: string[];
  bookmarkReason: string;
  state: BoardState;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export function createCard(title: string, state: BoardState = "continue"): Card {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled return",
    note: "",
    contextSnapshot: "",
    whyStillOpen: "",
    ifYouReturn: "",
    richLinks: [],
    imageRefs: [],
    bookmarkReason: "",
    state,
    hidden: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function touchCard(card: Card): Card {
  return {
    ...card,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeReentryField(value: string): string {
  const trimmed = value.trim();

  if (REENTRY_PLACEHOLDER_VALUES.has(trimmed)) {
    return "";
  }

  return value;
}

export function normalizeList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean).slice(0, 12);
}

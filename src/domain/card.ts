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
  waitingOn: string;
  ifYouReturn: string;
  nextStepKind: NextStepKind;
  nextStep: string;
  richLinks: string[];
  imageRefs: string[];
  audioRefs: string[];
  fileRefs: FileRef[];
  bookmarkReason: string;
  tags: string[];
  state: BoardState;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NextStepKind = "none" | "action" | "trigger";

export interface FileRef {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export function createCard(title: string, state: BoardState = "continue"): Card {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled return",
    note: "",
    contextSnapshot: "",
    whyStillOpen: "",
    waitingOn: "",
    ifYouReturn: "",
    nextStepKind: "none",
    nextStep: "",
    richLinks: [],
    imageRefs: [],
    audioRefs: [],
    fileRefs: [],
    bookmarkReason: "",
    tags: [],
    state,
    hidden: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeNextStepKind(value: unknown, nextStep = ""): NextStepKind {
  if (value === "action" || value === "trigger" || value === "none") {
    return value;
  }

  return nextStep.trim() ? "action" : "none";
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

export function normalizeTags(values: unknown[]): string[] {
  const tags: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }

    const tag = value
      .trim()
      .replace(/^#+/, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_-]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32);

    if (tag && !tags.includes(tag)) {
      tags.push(tag);
    }

    if (tags.length >= 8) {
      break;
    }
  }

  return tags;
}

export function normalizeFileRefs(values: unknown[]): FileRef[] {
  return values
    .flatMap((value) => {
      if (!value || typeof value !== "object") {
        return [];
      }

      const source = value as Record<string, unknown>;
      const name = typeof source.name === "string" ? source.name.trim() : "";

      if (!name) {
        return [];
      }

      const type = typeof source.type === "string" ? source.type.slice(0, 120) : "";
      const size = typeof source.size === "number" && Number.isFinite(source.size) ? Math.max(0, source.size) : 0;
      const dataUrl = typeof source.dataUrl === "string" && source.dataUrl.startsWith("data:") ? source.dataUrl : undefined;

      return [{ name: name.slice(0, 160), type, size, dataUrl }];
    })
    .slice(0, 8);
}

import { isBoardState, type BoardState } from "./state";

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
  promise: string;
  promiseTo: string;
  promiseDueOn: string;
  promiseStatus: PromiseStatus;
  outcome: string;
  closedAt: string;
  stateHistory: StateTransition[];
  evidenceMeta: EvidenceMeta[];
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
export type PromiseStatus = "none" | "open" | "kept" | "released";

export interface StateTransition {
  from: BoardState;
  to: BoardState;
  at: string;
}

export type EvidenceKind = "link" | "image" | "audio" | "file";
export type EvidenceRole = "reference" | "brief" | "feedback" | "latest" | "return-first" | "outcome-proof";

export interface EvidenceMeta {
  id: string;
  kind: EvidenceKind;
  role: Exclude<EvidenceRole, "reference">;
}

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
    promise: "",
    promiseTo: "",
    promiseDueOn: "",
    promiseStatus: "none",
    outcome: "",
    closedAt: "",
    stateHistory: [],
    evidenceMeta: [],
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

export function normalizePromiseStatus(value: unknown, promise = ""): PromiseStatus {
  if (!promise.trim()) {
    return "none";
  }

  if (value === "open" || value === "kept" || value === "released") {
    return value;
  }

  return "open";
}

export function normalizeDateOnly(value: unknown): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? value : "";
}

export function normalizeStateHistory(value: unknown): StateTransition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const transitions = value
    .flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const source = item as Record<string, unknown>;
      if (!isBoardState(source.from) || !isBoardState(source.to) || typeof source.at !== "string") {
        return [];
      }

      const at = new Date(source.at);
      if (Number.isNaN(at.getTime()) || source.from === source.to) {
        return [];
      }

      return [{ from: source.from, to: source.to, at: at.toISOString() }];
    })
    .slice(-40);

  const coherent = transitions.every((transition, index) => {
    const previous = transitions[index - 1];
    return !previous || (transition.from === previous.to && transition.at >= previous.at);
  });

  return coherent ? transitions : [];
}

export function evidenceIdentity(kind: EvidenceKind, source: string | FileRef): string {
  const signature = typeof source === "string"
    ? compactEvidenceSource(source)
    : [source.name, source.type, source.size, compactEvidenceSource(source.dataUrl ?? "")].join("|");
  let hash = 0x811c9dc5;
  const input = `${kind}|${signature}`;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${kind}-${(hash >>> 0).toString(36)}`;
}

export function normalizeEvidenceMeta(value: unknown): EvidenceMeta[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: EvidenceMeta[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const source = item as Record<string, unknown>;
    if (
      typeof source.id !== "string" ||
      !isEvidenceKind(source.kind) ||
      !isAssignedEvidenceRole(source.role) ||
      result.some((meta) => meta.id === source.id)
    ) {
      continue;
    }
    result.push({ id: source.id.slice(0, 80), kind: source.kind, role: source.role });
    if (result.length >= 32) {
      break;
    }
  }
  return result;
}

export function collectEvidenceIdentities(card: Pick<Card, "richLinks" | "imageRefs" | "audioRefs" | "fileRefs">): Set<string> {
  return new Set([
    ...card.richLinks.map((source) => evidenceIdentity("link", source)),
    ...card.imageRefs.map((source) => evidenceIdentity("image", source)),
    ...card.audioRefs.map((source) => evidenceIdentity("audio", source)),
    ...card.fileRefs.map((source) => evidenceIdentity("file", source)),
  ]);
}

export function isEvidenceRole(value: unknown): value is EvidenceRole {
  return value === "reference" || isAssignedEvidenceRole(value);
}

function isEvidenceKind(value: unknown): value is EvidenceKind {
  return value === "link" || value === "image" || value === "audio" || value === "file";
}

function isAssignedEvidenceRole(value: unknown): value is EvidenceMeta["role"] {
  return value === "brief" || value === "feedback" || value === "latest" || value === "return-first" || value === "outcome-proof";
}

function compactEvidenceSource(value: string): string {
  return `${value.length}:${value.slice(0, 96)}:${value.slice(-96)}`;
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

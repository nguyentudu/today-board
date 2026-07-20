import { createBoard, type Board } from "../domain/board";
import {
  normalizeFileRefs,
  normalizeDateOnly,
  normalizeList,
  normalizeNextStepKind,
  normalizePromiseStatus,
  normalizeReentryField,
  normalizeStateHistory,
  normalizeTags,
} from "../domain/card";
import { isBoardState } from "../domain/state";

export const BOARD_STORAGE_KEY = "moon.today-board.v1";
export const BOARD_STORAGE_WARNING_BYTES = 4_000_000;

export function loadBoard(): Board {
  const stored = localStorage.getItem(BOARD_STORAGE_KEY);

  if (!stored) {
    return createBoard();
  }

  try {
    return sanitizeBoard(JSON.parse(stored));
  } catch {
    return createBoard();
  }
}

export function saveBoard(board: Board): void {
  localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(board));
}

export function trySaveBoard(board: Board): boolean {
  try {
    saveBoard(board);
    return true;
  } catch {
    return false;
  }
}

export function estimateBoardSize(board: Board): number {
  return new Blob([JSON.stringify(board)]).size;
}

export function sanitizeBoard(value: unknown): Board {
  if (!value || typeof value !== "object") {
    return createBoard();
  }

  const candidate = value as Partial<Board>;
  const cards = Array.isArray(candidate.cards) ? candidate.cards : [];

  return {
    version: 1,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString(),
    cards: cards.flatMap((card) => {
      if (!card || typeof card !== "object") {
        return [];
      }

      const source = card as unknown as Record<string, unknown>;
      const state = isBoardState(source.state) ? source.state : "continue";
      const now = new Date().toISOString();
      const promise =
        typeof source.promise === "string" ? normalizeReentryField(source.promise).slice(0, 360) : "";
      const normalizedHistory = normalizeStateHistory(source.stateHistory);
      const stateHistory =
        normalizedHistory.length === 0 || normalizedHistory[normalizedHistory.length - 1]?.to === state
          ? normalizedHistory
          : [];
      const sourceClosedAt =
        typeof source.closedAt === "string" && !Number.isNaN(new Date(source.closedAt).getTime())
          ? new Date(source.closedAt).toISOString()
          : "";
      const closedAt =
        sourceClosedAt ||
        [...stateHistory].reverse().find((transition) => transition.to === "finished")?.at ||
        "";

      return [
        {
          id: typeof source.id === "string" ? source.id : crypto.randomUUID(),
          title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : "Untitled return",
          note: typeof source.note === "string" ? source.note.slice(0, 280) : "",
          contextSnapshot:
            typeof source.contextSnapshot === "string" ? normalizeReentryField(source.contextSnapshot).slice(0, 360) : "",
          whyStillOpen:
            typeof source.whyStillOpen === "string" ? normalizeReentryField(source.whyStillOpen).slice(0, 360) : "",
          waitingOn:
            typeof source.waitingOn === "string" ? normalizeReentryField(source.waitingOn).slice(0, 360) : "",
          ifYouReturn:
            typeof source.ifYouReturn === "string" ? normalizeReentryField(source.ifYouReturn).slice(0, 360) : "",
          nextStepKind: normalizeNextStepKind(
            source.nextStepKind,
            typeof source.nextStep === "string" ? source.nextStep : "",
          ),
          nextStep: typeof source.nextStep === "string" ? normalizeReentryField(source.nextStep).slice(0, 360) : "",
          promise,
          promiseTo:
            typeof source.promiseTo === "string" ? normalizeReentryField(source.promiseTo).slice(0, 160) : "",
          promiseDueOn: normalizeDateOnly(source.promiseDueOn),
          promiseStatus: normalizePromiseStatus(source.promiseStatus, promise),
          outcome: typeof source.outcome === "string" ? normalizeReentryField(source.outcome).slice(0, 480) : "",
          closedAt,
          stateHistory,
          richLinks: Array.isArray(source.richLinks)
            ? normalizeList(source.richLinks.filter((value): value is string => typeof value === "string"))
            : [],
          imageRefs: Array.isArray(source.imageRefs)
            ? normalizeList(source.imageRefs.filter((value): value is string => typeof value === "string"))
            : [],
          audioRefs: Array.isArray(source.audioRefs)
            ? normalizeList(source.audioRefs.filter((value): value is string => typeof value === "string"))
            : [],
          fileRefs: Array.isArray(source.fileRefs) ? normalizeFileRefs(source.fileRefs) : [],
          bookmarkReason: typeof source.bookmarkReason === "string" ? source.bookmarkReason.slice(0, 360) : "",
          tags: Array.isArray(source.tags) ? normalizeTags(source.tags) : typeof source.tags === "string" ? normalizeTags([source.tags]) : [],
          state,
          hidden: typeof source.hidden === "boolean" ? source.hidden : false,
          createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
          updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : now,
        },
      ];
    }),
  };
}

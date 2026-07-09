import { createBoard, type Board } from "../domain/board";
import { normalizeList, normalizeReentryField } from "../domain/card";
import { isBoardState } from "../domain/state";

const STORAGE_KEY = "moon.today-board.v1";

export function loadBoard(): Board {
  const stored = localStorage.getItem(STORAGE_KEY);

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
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

      return [
        {
          id: typeof source.id === "string" ? source.id : crypto.randomUUID(),
          title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : "Untitled return",
          note: typeof source.note === "string" ? source.note.slice(0, 280) : "",
          contextSnapshot:
            typeof source.contextSnapshot === "string" ? normalizeReentryField(source.contextSnapshot).slice(0, 360) : "",
          whyStillOpen:
            typeof source.whyStillOpen === "string" ? normalizeReentryField(source.whyStillOpen).slice(0, 360) : "",
          ifYouReturn:
            typeof source.ifYouReturn === "string" ? normalizeReentryField(source.ifYouReturn).slice(0, 360) : "",
          richLinks: Array.isArray(source.richLinks)
            ? normalizeList(source.richLinks.filter((value): value is string => typeof value === "string"))
            : [],
          imageRefs: Array.isArray(source.imageRefs)
            ? normalizeList(source.imageRefs.filter((value): value is string => typeof value === "string"))
            : [],
          bookmarkReason: typeof source.bookmarkReason === "string" ? source.bookmarkReason.slice(0, 360) : "",
          state,
          hidden: typeof source.hidden === "boolean" ? source.hidden : false,
          createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
          updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : now,
        },
      ];
    }),
  };
}

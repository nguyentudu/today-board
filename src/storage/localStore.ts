import { createBoard, type Board } from "../domain/board";
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
          whyStillOpen: typeof source.whyStillOpen === "string" ? source.whyStillOpen.slice(0, 360) : "",
          ifYouReturn: typeof source.ifYouReturn === "string" ? source.ifYouReturn.slice(0, 360) : "",
          state,
          hidden: typeof source.hidden === "boolean" ? source.hidden : false,
          createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
          updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : now,
        },
      ];
    }),
  };
}

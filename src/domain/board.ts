import type { Card } from "./card";
import { createCard, touchCard } from "./card";
import type { BoardState } from "./state";

export interface Board {
  version: 1;
  cards: Card[];
  updatedAt: string;
}

export function createBoard(): Board {
  return {
    version: 1,
    cards: [],
    updatedAt: new Date().toISOString(),
  };
}

export function addCard(board: Board, title: string, state: BoardState = "continue"): Board {
  return touchBoard({
    ...board,
    cards: [createCard(title, state), ...board.cards],
  });
}

export function renameCard(board: Board, cardId: string, title: string): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      title: title.trim() || "Untitled return",
    }),
  );
}

export function updateCardNote(board: Board, cardId: string, note: string): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      note: note.slice(0, 280),
    }),
  );
}

export function updateCardReentryNotes(
  board: Board,
  cardId: string,
  notes: { whyStillOpen?: string; ifYouReturn?: string },
): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      whyStillOpen: notes.whyStillOpen === undefined ? card.whyStillOpen : notes.whyStillOpen.slice(0, 360),
      ifYouReturn: notes.ifYouReturn === undefined ? card.ifYouReturn : notes.ifYouReturn.slice(0, 360),
    }),
  );
}

export function moveCard(board: Board, cardId: string, state: BoardState): Board {
  return updateCard(board, cardId, (card) => touchCard({ ...card, state }));
}

export function hideCard(board: Board, cardId: string): Board {
  return updateCard(board, cardId, (card) => touchCard({ ...card, hidden: true }));
}

function updateCard(board: Board, cardId: string, updater: (card: Card) => Card): Board {
  return touchBoard({
    ...board,
    cards: board.cards.map((card) => (card.id === cardId ? updater(card) : card)),
  });
}

function touchBoard(board: Board): Board {
  return {
    ...board,
    updatedAt: new Date().toISOString(),
  };
}

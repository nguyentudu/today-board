import { addCard, updateCardReentryNotes, type Board } from "../domain/board";

export const FIRST_RETURN_STORAGE_KEY = "moon.today-board.first-return.v1";

export interface FirstReturnInput {
  title: string;
  returnPoint: string;
}

export type FirstReturnStage = "new" | "created" | "dismissed";

export interface FirstReturnState {
  stage: FirstReturnStage;
  cardId?: string;
}

export function createFirstReturn(board: Board, input: FirstReturnInput): { board: Board; cardId: string } | null {
  const title = input.title.trim();
  const returnPoint = input.returnPoint.trim();

  if (!title || !returnPoint) {
    return null;
  }

  const withCard = addCard(board, title);
  const cardId = withCard.cards[0]?.id;

  if (!cardId) {
    return null;
  }

  return {
    board: updateCardReentryNotes(withCard, cardId, { ifYouReturn: returnPoint }),
    cardId,
  };
}

export function readFirstReturnState(): FirstReturnState {
  try {
    const value = JSON.parse(localStorage.getItem(FIRST_RETURN_STORAGE_KEY) ?? "null") as Partial<FirstReturnState> | null;
    if (value?.stage === "created" || value?.stage === "dismissed") {
      return { stage: value.stage, cardId: typeof value.cardId === "string" ? value.cardId : undefined };
    }
  } catch {
    // Onboarding state is optional; the board remains usable when storage is unavailable.
  }
  return { stage: "new" };
}

export function writeFirstReturnState(state: FirstReturnState): void {
  try {
    localStorage.setItem(FIRST_RETURN_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Do not block local board use for optional onboarding state.
  }
}

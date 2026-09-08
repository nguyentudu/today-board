import type { Board } from "../domain/board";

export interface ContinuityReviewSnapshot {
  active: number;
  waiting: number;
  returnReady: number;
  openPromises: number;
  finished: number;
}

export function buildContinuityReview(board: Board): ContinuityReviewSnapshot {
  const visible = board.cards.filter((card) => !card.hidden);
  return {
    active: visible.filter((card) => card.state === "continue").length,
    waiting: visible.filter((card) => card.state === "pause" || Boolean(card.waitingOn.trim())).length,
    returnReady: visible.filter((card) => Boolean(card.ifYouReturn.trim() || card.nextStep.trim())).length,
    openPromises: visible.filter((card) => card.promiseStatus === "open").length,
    finished: visible.filter((card) => card.state === "finished").length,
  };
}

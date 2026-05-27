export const BOARD_STATES = ["continue", "pause", "finished", "leave-alone"] as const;

export type BoardState = (typeof BOARD_STATES)[number];

export const stateLabels: Record<BoardState, string> = {
  continue: "Continue",
  pause: "Pause",
  finished: "Finished",
  "leave-alone": "Leave Alone",
};

export const stateCopy: Record<BoardState, string> = {
  continue: "Available when you want to return.",
  pause: "Paused is valid.",
  finished: "Remove from active load.",
  "leave-alone": "Do not reopen unless chosen.",
};

export function isBoardState(value: unknown): value is BoardState {
  return typeof value === "string" && BOARD_STATES.includes(value as BoardState);
}

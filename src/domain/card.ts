import type { BoardState } from "./state";

export interface Card {
  id: string;
  title: string;
  note: string;
  whyStillOpen: string;
  ifYouReturn: string;
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
    whyStillOpen: "",
    ifYouReturn: "",
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

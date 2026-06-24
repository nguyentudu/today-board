import type { Card as BoardCard } from "../domain/card";
import type { BoardState } from "../domain/state";
import { CardEditor } from "./CardEditor";
import type { Language } from "./i18n";
import { copy } from "./i18n";
import { BOARD_STATES } from "../domain/state";

interface CardProps {
  card: BoardCard;
  language: Language;
  onRename: (cardId: string, title: string) => void;
  onMove: (cardId: string, state: BoardState) => void;
  onNote: (cardId: string, note: string) => void;
  onContextSnapshot: (cardId: string, contextSnapshot: string) => void;
  onWhyStillOpen: (cardId: string, whyStillOpen: string) => void;
  onIfYouReturn: (cardId: string, ifYouReturn: string) => void;
  onHide: (cardId: string) => void;
}

export function Card({
  card,
  language,
  onRename,
  onMove,
  onNote,
  onContextSnapshot,
  onWhyStillOpen,
  onIfYouReturn,
  onHide,
}: CardProps): HTMLElement {
  const text = copy[language];
  const item = document.createElement("article");
  item.className = "card";

  const editor = CardEditor({
    card,
    language,
    onRename: (title) => onRename(card.id, title),
    onNote: (note) => onNote(card.id, note),
    onContextSnapshot: (contextSnapshot) => onContextSnapshot(card.id, contextSnapshot),
    onWhyStillOpen: (whyStillOpen) => onWhyStillOpen(card.id, whyStillOpen),
    onIfYouReturn: (ifYouReturn) => onIfYouReturn(card.id, ifYouReturn),
  });

  const snapshot = document.createElement("dl");
  snapshot.className = "context-snapshot";

  const lastTouch = document.createElement("div");
  lastTouch.className = "last-touch";
  lastTouch.textContent = `${text.lastTouched}: ${formatRelativeDate(card.updatedAt, language)}`;

  for (const row of [
    [text.created, formatDate(card.createdAt)],
    [text.lastTouched, formatDate(card.updatedAt)],
    [text.currentState, text.stateLabels[card.state]],
  ]) {
    const term = document.createElement("dt");
    term.textContent = row[0];

    const value = document.createElement("dd");
    value.textContent = row[1];

    snapshot.append(term, value);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const moveLabel = document.createElement("label");
  moveLabel.className = "action-label";
  moveLabel.textContent = text.changeZone;

  const moveSelect = document.createElement("select");
  moveSelect.ariaLabel = text.changeZone;
  moveLabel.append(moveSelect);

  for (const state of BOARD_STATES) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = text.stateLabels[state];
    option.selected = state === card.state;
    moveSelect.append(option);
  }

  moveSelect.addEventListener("change", () => onMove(card.id, moveSelect.value as BoardState));

  const hideButton = document.createElement("button");
  hideButton.type = "button";
  hideButton.className = "quiet-button";
  hideButton.textContent = text.hideCard;
  hideButton.addEventListener("click", () => onHide(card.id));

  actions.append(moveLabel, hideButton);
  item.append(editor, lastTouch, snapshot, actions);

  return item;
}

function formatRelativeDate(value: string, language: Language): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const elapsedMs = now.getTime() - date.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  if (elapsedMinutes < 10) {
    return language === "vi" ? "vừa xong" : "just now";
  }

  if (date.toDateString() === now.toDateString()) {
    return language === "vi" ? "hôm nay" : "today";
  }

  const elapsedDays = Math.max(1, Math.floor(elapsedMs / 86400000));
  return language === "vi" ? `${elapsedDays} ngày trước` : `${elapsedDays} days ago`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

import type { Card as BoardCard } from "../domain/card";
import type { BoardState } from "../domain/state";
import { CardEditor } from "./CardEditor";
import type { Language } from "./copy";
import { copy } from "./copy";
import { BOARD_STATES } from "../domain/state";

interface CardProps {
  card: BoardCard;
  language: Language;
  onRename: (cardId: string, title: string) => void;
  onMove: (cardId: string, state: BoardState) => void;
  onNote: (cardId: string, note: string) => void;
  onHide: (cardId: string) => void;
}

export function Card({ card, language, onRename, onMove, onNote, onHide }: CardProps): HTMLElement {
  const text = copy[language];
  const item = document.createElement("article");
  item.className = "card";

  const editor = CardEditor({
    card,
    language,
    onRename: (title) => onRename(card.id, title),
    onNote: (note) => onNote(card.id, note),
  });

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
  item.append(editor, actions);

  return item;
}

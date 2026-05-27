import type { Board } from "../domain/board";
import type { BoardState } from "../domain/state";
import { stateCopy, stateLabels } from "../domain/state";
import { Card } from "./Card";

const emptyCopy: Record<BoardState, string> = {
  continue: "Nothing needs to return right now.",
  pause: "Nothing is waiting here.",
  finished: "Nothing to release.",
  "leave-alone": "Nothing protected here.",
};

interface ColumnProps {
  board: Board;
  state: BoardState;
  onRename: (cardId: string, title: string) => void;
  onMove: (cardId: string, state: BoardState) => void;
  onNote: (cardId: string, note: string) => void;
  onHide: (cardId: string) => void;
}

export function Column(props: ColumnProps): HTMLElement {
  const section = document.createElement("section");
  section.className = "column";

  const header = document.createElement("header");
  header.className = "column-header";

  const title = document.createElement("h2");
  title.textContent = stateLabels[props.state];

  const copy = document.createElement("p");
  copy.textContent = stateCopy[props.state];

  header.append(title, copy);

  const list = document.createElement("div");
  list.className = "card-list";

  const cards = props.board.cards.filter((card) => card.state === props.state && !card.hidden);

  if (cards.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-column";
    empty.textContent = emptyCopy[props.state];
    list.append(empty);
  } else {
    for (const card of cards) {
      list.append(
        Card({
          card,
          onRename: props.onRename,
          onMove: props.onMove,
          onNote: props.onNote,
          onHide: props.onHide,
        }),
      );
    }
  }

  section.append(header, list);

  return section;
}

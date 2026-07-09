import type { Board } from "../domain/board";
import type { BoardState } from "../domain/state";
import { Card } from "./Card";
import type { Language } from "./i18n";
import { copy } from "./i18n";

interface ColumnProps {
  board: Board;
  state: BoardState;
  language: Language;
  onRename: (cardId: string, title: string) => void;
  onMove: (cardId: string, state: BoardState) => void;
  onNote: (cardId: string, note: string) => void;
  onContextSnapshot: (cardId: string, contextSnapshot: string) => void;
  onWhyStillOpen: (cardId: string, whyStillOpen: string) => void;
  onIfYouReturn: (cardId: string, ifYouReturn: string) => void;
  onRichLinks: (cardId: string, richLinks: string[]) => void;
  onImageRefs: (cardId: string, imageRefs: string[]) => void;
  onAudioRefs: (cardId: string, audioRefs: string[]) => void;
  onFileRefs: (cardId: string, fileRefs: Board["cards"][number]["fileRefs"]) => void;
  onBookmarkReason: (cardId: string, bookmarkReason: string) => void;
  onHide: (cardId: string) => void;
}

export function Column(props: ColumnProps): HTMLElement {
  const text = copy[props.language];
  const section = document.createElement("section");
  section.className = "column";

  const header = document.createElement("header");
  header.className = "column-header";

  const title = document.createElement("h2");
  title.textContent = text.stateLabels[props.state];

  const description = document.createElement("p");
  description.textContent = text.stateCopy[props.state];

  header.append(title, description);

  const list = document.createElement("div");
  list.className = "card-list";

  const cards = props.board.cards.filter((card) => card.state === props.state && !card.hidden);

  if (cards.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-column";
    empty.textContent = text.emptyCopy[props.state];
    list.append(empty);
  } else {
    for (const card of cards) {
      list.append(
        Card({
          card,
          language: props.language,
          onRename: props.onRename,
          onMove: props.onMove,
          onNote: props.onNote,
          onContextSnapshot: props.onContextSnapshot,
          onWhyStillOpen: props.onWhyStillOpen,
          onIfYouReturn: props.onIfYouReturn,
          onRichLinks: props.onRichLinks,
          onImageRefs: props.onImageRefs,
          onAudioRefs: props.onAudioRefs,
          onFileRefs: props.onFileRefs,
          onBookmarkReason: props.onBookmarkReason,
          onHide: props.onHide,
        }),
      );
    }
  }

  section.append(header, list);

  return section;
}

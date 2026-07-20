import type { Board, CardEditDraft } from "../domain/board";
import type { EvidenceKind, EvidenceRole } from "../domain/card";
import { compareReentryPriority } from "../domain/reentryPriority";
import type { BoardState } from "../domain/state";
import { Card } from "./Card";
import type { Language } from "./i18n";
import { copy } from "./i18n";

interface ColumnProps {
  board: Board;
  state: BoardState;
  language: Language;
  onMove: (cardId: string, state: BoardState) => void;
  onSaveDraft: (cardId: string, draft: CardEditDraft) => boolean;
  onEvidenceRole: (
    cardId: string,
    evidence: {
      id: string;
      kind: EvidenceKind;
      role: EvidenceRole;
    },
  ) => void;
  onImageRefs: (cardId: string, imageRefs: string[]) => void;
  onAudioRefs: (cardId: string, audioRefs: string[]) => void;
  onFileRefs: (cardId: string, fileRefs: Board["cards"][number]["fileRefs"]) => void;
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

  if (props.state === "continue") {
    const priorityNote = document.createElement("p");
    priorityNote.className = "reentry-priority-note";
    priorityNote.textContent = text.reentryPriorityNote;
    header.append(priorityNote);
  }

  const list = document.createElement("div");
  list.className = "card-list";

  const cards = props.board.cards.filter((card) => card.state === props.state && !card.hidden);
  if (props.state === "continue") {
    cards.sort(compareReentryPriority);
  }

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
          onMove: props.onMove,
          onSaveDraft: props.onSaveDraft,
          onEvidenceRole: props.onEvidenceRole,
          onImageRefs: props.onImageRefs,
          onAudioRefs: props.onAudioRefs,
          onFileRefs: props.onFileRefs,
          onHide: props.onHide,
        }),
      );
    }
  }

  section.append(header, list);

  return section;
}

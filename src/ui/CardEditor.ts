import type { Card } from "../domain/card";
import type { Language } from "./copy";
import { copy } from "./copy";

interface CardEditorProps {
  card: Card;
  language: Language;
  onRename: (title: string) => void;
  onNote: (note: string) => void;
  onWhyStillOpen: (whyStillOpen: string) => void;
  onIfYouReturn: (ifYouReturn: string) => void;
}

export function CardEditor({
  card,
  language,
  onRename,
  onNote,
  onWhyStillOpen,
  onIfYouReturn,
}: CardEditorProps): HTMLDivElement {
  const text = copy[language];
  const editor = document.createElement("div");
  editor.className = "card-editor";

  const title = document.createElement("input");
  title.className = "card-title-input";
  title.type = "text";
  title.value = card.title;
  title.ariaLabel = text.cardName;
  title.addEventListener("change", () => onRename(title.value));

  const note = document.createElement("textarea");
  note.className = "card-note-input";
  note.value = card.note;
  note.maxLength = 280;
  note.rows = 3;
  note.placeholder = text.tinyNote;
  note.ariaLabel = text.tinyNote;
  note.addEventListener("change", () => onNote(note.value));

  const whyStillOpen = document.createElement("textarea");
  whyStillOpen.className = "card-reentry-input";
  whyStillOpen.value = card.whyStillOpen;
  whyStillOpen.maxLength = 360;
  whyStillOpen.rows = 3;
  whyStillOpen.placeholder = text.whyStillOpen;
  whyStillOpen.ariaLabel = text.whyStillOpen;
  whyStillOpen.addEventListener("change", () => onWhyStillOpen(whyStillOpen.value));

  const ifYouReturn = document.createElement("textarea");
  ifYouReturn.className = "card-reentry-input";
  ifYouReturn.value = card.ifYouReturn;
  ifYouReturn.maxLength = 360;
  ifYouReturn.rows = 3;
  ifYouReturn.placeholder = text.ifYouReturn;
  ifYouReturn.ariaLabel = text.ifYouReturn;
  ifYouReturn.addEventListener("change", () => onIfYouReturn(ifYouReturn.value));

  editor.append(title, note, whyStillOpen, ifYouReturn);

  return editor;
}

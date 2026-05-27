import type { Card } from "../domain/card";

interface CardEditorProps {
  card: Card;
  onRename: (title: string) => void;
  onNote: (note: string) => void;
}

export function CardEditor({ card, onRename, onNote }: CardEditorProps): HTMLDivElement {
  const editor = document.createElement("div");
  editor.className = "card-editor";

  const title = document.createElement("input");
  title.className = "card-title-input";
  title.type = "text";
  title.value = card.title;
  title.ariaLabel = "Card name";
  title.addEventListener("change", () => onRename(title.value));

  const note = document.createElement("textarea");
  note.className = "card-note-input";
  note.value = card.note;
  note.maxLength = 280;
  note.rows = 3;
  note.placeholder = "Tiny note";
  note.ariaLabel = "Tiny note";
  note.addEventListener("change", () => onNote(note.value));

  editor.append(title, note);

  return editor;
}

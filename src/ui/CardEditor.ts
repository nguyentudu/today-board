import type { Card } from "../domain/card";
import type { Language } from "./i18n";
import { copy } from "./i18n";

interface CardEditorProps {
  card: Card;
  language: Language;
  onRename: (title: string) => void;
  onNote: (note: string) => void;
  onContextSnapshot: (contextSnapshot: string) => void;
  onWhyStillOpen: (whyStillOpen: string) => void;
  onIfYouReturn: (ifYouReturn: string) => void;
}

export function CardEditor({
  card,
  language,
  onRename,
  onNote,
  onContextSnapshot,
  onWhyStillOpen,
  onIfYouReturn,
}: CardEditorProps): HTMLDivElement {
  const text = copy[language];
  const editor = document.createElement("div");
  editor.className = "card-editor";

  const titleField = document.createElement("label");
  titleField.className = "card-field";

  const titleLabel = document.createElement("span");
  titleLabel.className = "field-label";
  titleLabel.textContent = text.cardName;

  const title = document.createElement("input");
  title.className = "card-title-input";
  title.type = "text";
  title.value = card.title;
  title.ariaLabel = text.cardName;
  title.addEventListener("change", () => onRename(title.value));

  titleField.append(titleLabel, title);

  const noteField = document.createElement("label");
  noteField.className = "card-field";

  const noteLabel = document.createElement("span");
  noteLabel.className = "field-label";
  noteLabel.textContent = text.tinyNote;

  const note = document.createElement("textarea");
  note.className = "card-note-input";
  note.value = card.note;
  note.maxLength = 280;
  note.rows = 3;
  note.placeholder = text.tinyNote;
  note.ariaLabel = text.tinyNote;
  note.addEventListener("change", () => onNote(note.value));

  noteField.append(noteLabel, note);

  const contextSnapshotField = document.createElement("label");
  contextSnapshotField.className = "card-field reentry-field";

  const contextSnapshotLabel = document.createElement("span");
  contextSnapshotLabel.className = "field-label";
  contextSnapshotLabel.textContent = text.contextSnapshot;

  const contextSnapshot = document.createElement("textarea");
  contextSnapshot.className = "card-reentry-input";
  contextSnapshot.value = card.contextSnapshot;
  contextSnapshot.maxLength = 360;
  contextSnapshot.rows = 3;
  contextSnapshot.placeholder = text.contextSnapshot;
  contextSnapshot.ariaLabel = text.contextSnapshot;
  contextSnapshot.addEventListener("change", () => onContextSnapshot(contextSnapshot.value));

  contextSnapshotField.append(contextSnapshotLabel, contextSnapshot);

  const whyStillOpenField = document.createElement("label");
  whyStillOpenField.className = "card-field reentry-field";

  const whyStillOpenLabel = document.createElement("span");
  whyStillOpenLabel.className = "field-label";
  whyStillOpenLabel.textContent = text.whyStillOpen;

  const whyStillOpen = document.createElement("textarea");
  whyStillOpen.className = "card-reentry-input";
  whyStillOpen.value = card.whyStillOpen;
  whyStillOpen.maxLength = 360;
  whyStillOpen.rows = 3;
  whyStillOpen.placeholder = text.whyStillOpen;
  whyStillOpen.ariaLabel = text.whyStillOpen;
  whyStillOpen.addEventListener("change", () => onWhyStillOpen(whyStillOpen.value));

  whyStillOpenField.append(whyStillOpenLabel, whyStillOpen);

  const ifYouReturnField = document.createElement("label");
  ifYouReturnField.className = "card-field reentry-field";

  const ifYouReturnLabel = document.createElement("span");
  ifYouReturnLabel.className = "field-label";
  ifYouReturnLabel.textContent = text.ifYouReturn;

  const ifYouReturn = document.createElement("textarea");
  ifYouReturn.className = "card-reentry-input";
  ifYouReturn.value = card.ifYouReturn;
  ifYouReturn.maxLength = 360;
  ifYouReturn.rows = 3;
  ifYouReturn.placeholder = text.ifYouReturn;
  ifYouReturn.ariaLabel = text.ifYouReturn;
  ifYouReturn.addEventListener("change", () => onIfYouReturn(ifYouReturn.value));

  ifYouReturnField.append(ifYouReturnLabel, ifYouReturn);

  editor.append(titleField, noteField, contextSnapshotField, whyStillOpenField, ifYouReturnField);

  return editor;
}

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
  onRichLinks: (richLinks: string[]) => void;
  onImageRefs: (imageRefs: string[]) => void;
  onBookmarkReason: (bookmarkReason: string) => void;
}

export function CardEditor({
  card,
  language,
  onRename,
  onNote,
  onContextSnapshot,
  onWhyStillOpen,
  onIfYouReturn,
  onRichLinks,
  onImageRefs,
  onBookmarkReason,
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
  contextSnapshot.placeholder = text.contextSnapshotEmpty;
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
  whyStillOpen.placeholder = text.whyStillOpenEmpty;
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
  ifYouReturn.placeholder = text.ifYouReturnEmpty;
  ifYouReturn.ariaLabel = text.ifYouReturn;
  ifYouReturn.addEventListener("change", () => onIfYouReturn(ifYouReturn.value));

  ifYouReturnField.append(ifYouReturnLabel, ifYouReturn);

  const linksField = createTextareaField(text.richLinks, text.richLinksEmpty, card.richLinks.join("\n"), (value) =>
    onRichLinks(splitLines(value)),
  );
  const imagesField = createTextareaField(text.imageRefs, text.imageRefsEmpty, card.imageRefs.join("\n"), (value) =>
    onImageRefs(splitLines(value)),
  );
  const bookmarkReasonField = createTextareaField(
    text.bookmarkReason,
    text.bookmarkReasonEmpty,
    card.bookmarkReason,
    onBookmarkReason,
  );

  editor.append(
    titleField,
    noteField,
    contextSnapshotField,
    whyStillOpenField,
    ifYouReturnField,
    linksField,
    imagesField,
    bookmarkReasonField,
  );

  return editor;
}

function createTextareaField(
  label: string,
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
): HTMLLabelElement {
  const field = document.createElement("label");
  field.className = "card-field rich-field";

  const fieldLabel = document.createElement("span");
  fieldLabel.className = "field-label";
  fieldLabel.textContent = label;

  const textarea = document.createElement("textarea");
  textarea.className = "card-rich-input";
  textarea.value = value;
  textarea.maxLength = 1200;
  textarea.rows = 3;
  textarea.placeholder = placeholder;
  textarea.ariaLabel = label;
  textarea.addEventListener("change", () => onChange(textarea.value));

  field.append(fieldLabel, textarea);

  return field;
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

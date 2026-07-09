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
  const captureControls = createCaptureControls(card, text, onImageRefs);
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
    captureControls,
    bookmarkReasonField,
  );

  return editor;
}

function createCaptureControls(
  card: Card,
  text: (typeof copy)[Language],
  onImageRefs: (imageRefs: string[]) => void,
): HTMLDivElement {
  const controls = document.createElement("div");
  controls.className = "capture-controls";

  const actions = document.createElement("div");
  actions.className = "capture-actions";

  const status = document.createElement("p");
  status.className = "capture-status";
  status.setAttribute("role", "status");

  const uploadInput = createImageInput((dataUrl) => onImageRefs([...card.imageRefs, dataUrl]));
  const uploadButton = createCaptureButton(text.uploadImage, () => uploadInput.click());

  const cameraInput = createImageInput((dataUrl) => onImageRefs([...card.imageRefs, dataUrl]));
  cameraInput.setAttribute("capture", "environment");
  const cameraButton = createCaptureButton(text.capturePhoto, () => cameraInput.click());

  const screenButton = createCaptureButton(text.captureScreen, async () => {
    status.textContent = "";

    try {
      const dataUrl = await captureScreen(text.screenCaptureUnsupported);
      onImageRefs([...card.imageRefs, dataUrl]);
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : text.screenCaptureUnsupported;
    }
  });

  const note = document.createElement("p");
  note.className = "capture-note";
  note.textContent = text.imageLocalNote;

  actions.append(uploadButton, cameraButton, screenButton);
  controls.append(uploadInput, cameraInput, actions, note, status);

  return controls;
}

function createCaptureButton(label: string, onClick: () => void | Promise<void>): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiet-button capture-button";
  button.textContent = label;
  button.addEventListener("click", () => {
    void onClick();
  });

  return button;
}

function createImageInput(onImage: (dataUrl: string) => void): HTMLInputElement {
  const input = document.createElement("input");
  input.className = "file-input";
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const dataUrl = await readImageFile(file);
    onImage(dataUrl);
    input.value = "";
  });

  return input;
}

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const result = String(reader.result ?? "");

      if (result.startsWith("data:image/")) {
        resolve(result);
      } else {
        reject(new Error("Selected file is not an image."));
      }
    });
    reader.addEventListener("error", () => reject(reader.error ?? new Error("Could not read image.")));
    reader.readAsDataURL(file);
  });
}

async function captureScreen(unsupportedMessage: string): Promise<string> {
  const mediaDevices = navigator.mediaDevices as
    | (MediaDevices & { getDisplayMedia?: (constraints?: DisplayMediaStreamOptions) => Promise<MediaStream> })
    | undefined;

  if (!mediaDevices?.getDisplayMedia) {
    throw new Error(unsupportedMessage);
  }

  const stream = await mediaDevices.getDisplayMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;

  try {
    await new Promise<void>((resolve) => {
      video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      void video.play();
    });

    const trackSettings = stream.getVideoTracks()[0]?.getSettings();
    const width = trackSettings?.width ?? video.videoWidth;
    const height = trackSettings?.height ?? video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width || 1280;
    canvas.height = height || 720;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not capture screen.");
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }
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

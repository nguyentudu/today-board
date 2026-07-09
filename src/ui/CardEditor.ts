import type { Card, FileRef } from "../domain/card";
import type { Language } from "./i18n";
import { copy } from "./i18n";

const SAFE_FILE_BYTES = 300_000;

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
  onAudioRefs: (audioRefs: string[]) => void;
  onFileRefs: (fileRefs: FileRef[]) => void;
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
  onAudioRefs,
  onFileRefs,
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
  const captureControls = createCaptureControls(card, text, onImageRefs, onAudioRefs, onFileRefs);
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
  onAudioRefs: (audioRefs: string[]) => void,
  onFileRefs: (fileRefs: FileRef[]) => void,
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

  const voiceButton = createVoiceButton(card, text, onAudioRefs, status);

  const fileInput = createFileInput(
    (fileRef) => onFileRefs([...card.fileRefs, fileRef]),
    (message) => {
      status.textContent = message;
    },
    text,
  );
  const fileButton = createCaptureButton(text.attachFile, () => fileInput.click());

  const note = document.createElement("p");
  note.className = "capture-note";
  note.textContent = text.imageLocalNote;

  const audioNote = document.createElement("p");
  audioNote.className = "capture-note";
  audioNote.textContent = text.audioLocalNote;

  const fileNote = document.createElement("p");
  fileNote.className = "capture-note";
  fileNote.textContent = text.fileLocalNote;

  actions.append(uploadButton, cameraButton, screenButton, voiceButton, fileButton);
  controls.append(uploadInput, cameraInput, fileInput, actions, note, audioNote, fileNote, status);

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

function createVoiceButton(
  card: Card,
  text: (typeof copy)[Language],
  onAudioRefs: (audioRefs: string[]) => void,
  status: HTMLParagraphElement,
): HTMLButtonElement {
  let recorder: MediaRecorder | undefined;
  let stream: MediaStream | undefined;
  let chunks: Blob[] = [];

  const button = createCaptureButton(text.recordVoice, async () => {
    status.textContent = "";

    if (recorder?.state === "recording") {
      recorder.stop();
      button.textContent = text.recordVoice;
      return;
    }

    const mediaDevices = navigator.mediaDevices as
      | (MediaDevices & { getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream> })
      | undefined;

    if (!mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      status.textContent = text.voiceUnsupported;
      return;
    }

    stream = await mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });
    recorder.addEventListener(
      "stop",
      async () => {
        const audioBlob = new Blob(chunks, { type: recorder?.mimeType || "audio/webm" });
        const dataUrl = await blobToDataUrl(audioBlob);
        onAudioRefs([...card.audioRefs, dataUrl]);

        for (const track of stream?.getTracks() ?? []) {
          track.stop();
        }
      },
      { once: true },
    );
    recorder.start();
    button.textContent = text.stopRecording;
  });

  return button;
}

function createFileInput(
  onFile: (fileRef: FileRef) => void,
  onStatus: (message: string) => void,
  text: (typeof copy)[Language],
): HTMLInputElement {
  const input = document.createElement("input");
  input.className = "file-input";
  input.type = "file";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const fileRef: FileRef = {
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
    };

    if (file.size <= SAFE_FILE_BYTES) {
      fileRef.dataUrl = await blobToDataUrl(file);
      onStatus("");
    } else {
      onStatus(text.fileTooLarge);
    }

    onFile(fileRef);
    input.value = "";
  });

  return input;
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error ?? new Error("Could not read file.")));
    reader.readAsDataURL(blob);
  });
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

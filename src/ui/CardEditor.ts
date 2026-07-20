import type { Card, FileRef } from "../domain/card";
import { normalizeTags } from "../domain/card";
import {
  MAX_AUDIO_BYTES,
  MAX_IMAGE_BYTES,
  VOICE_LIMIT_MS,
  blobToDataUrl,
  compressImageDataUrl,
  compressImageFile,
  estimateDataUrlBytes,
  formatBytes,
} from "../media/localMedia";
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
  onWaitingOn: (waitingOn: string) => void;
  onIfYouReturn: (ifYouReturn: string) => void;
  onNextStepKind: (nextStepKind: Card["nextStepKind"]) => void;
  onNextStep: (nextStep: string) => void;
  onPromise: (promise: { text?: string; to?: string; dueOn?: string; status?: Card["promiseStatus"] }) => void;
  onOutcome: (outcome: string) => void;
  onRichLinks: (richLinks: string[]) => void;
  onImageRefs: (imageRefs: string[]) => void;
  onAudioRefs: (audioRefs: string[]) => void;
  onFileRefs: (fileRefs: FileRef[]) => void;
  onBookmarkReason: (bookmarkReason: string) => void;
  onTags: (tags: string[]) => void;
}

export function CardEditor({
  card,
  language,
  onRename,
  onNote,
  onContextSnapshot,
  onWhyStillOpen,
  onWaitingOn,
  onIfYouReturn,
  onNextStepKind,
  onNextStep,
  onPromise,
  onOutcome,
  onRichLinks,
  onImageRefs,
  onAudioRefs,
  onFileRefs,
  onBookmarkReason,
  onTags,
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

  const titleHelper = document.createElement("span");
  titleHelper.className = "field-helper";
  titleHelper.textContent = text.situationTitleHelper;

  titleField.append(titleLabel, titleHelper, title);

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

  const waitingOnField = document.createElement("label");
  waitingOnField.className = "card-field reentry-field";

  const waitingOnLabel = document.createElement("span");
  waitingOnLabel.className = "field-label";
  waitingOnLabel.textContent = text.waitingOn;

  const waitingOn = document.createElement("textarea");
  waitingOn.className = "card-reentry-input";
  waitingOn.value = card.waitingOn;
  waitingOn.maxLength = 360;
  waitingOn.rows = 2;
  waitingOn.placeholder = text.waitingOnEmpty;
  waitingOn.ariaLabel = text.waitingOn;
  waitingOn.addEventListener("change", () => onWaitingOn(waitingOn.value));

  waitingOnField.append(waitingOnLabel, waitingOn);

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

  const nextStepKindField = document.createElement("label");
  nextStepKindField.className = "card-field reentry-field next-step-kind-field";

  const nextStepKindLabel = document.createElement("span");
  nextStepKindLabel.className = "field-label";
  nextStepKindLabel.textContent = text.nextStepKind;

  const nextStepKind = document.createElement("select");
  nextStepKind.ariaLabel = text.nextStepKind;
  for (const kind of ["none", "action", "trigger"] as const) {
    const option = document.createElement("option");
    option.value = kind;
    option.textContent = text.nextStepKindLabels[kind];
    option.selected = card.nextStepKind === kind;
    nextStepKind.append(option);
  }
  nextStepKind.addEventListener("change", () => onNextStepKind(nextStepKind.value as Card["nextStepKind"]));

  nextStepKindField.append(nextStepKindLabel, nextStepKind);

  const nextStepField = document.createElement("label");
  nextStepField.className = "card-field reentry-field";

  const nextStepLabel = document.createElement("span");
  nextStepLabel.className = "field-label";
  nextStepLabel.textContent = text.nextStep;

  const nextStep = document.createElement("textarea");
  nextStep.className = "card-reentry-input";
  nextStep.value = card.nextStep;
  nextStep.maxLength = 360;
  nextStep.rows = 2;
  nextStep.placeholder = text.nextStepEmpty;
  nextStep.ariaLabel = text.nextStep;
  nextStep.addEventListener("change", () => onNextStep(nextStep.value));

  nextStepField.append(nextStepLabel, nextStep);

  const promiseField = createTextareaField(
    text.promise,
    text.promiseEmpty,
    card.promise,
    (value) => onPromise({ text: value }),
    text.promiseHelper,
  );
  promiseField.classList.add("continuity-section-field");

  const promiseToField = createTextField(text.promiseTo, text.promiseToEmpty, card.promiseTo, 160, (value) =>
    onPromise({ to: value }),
  );

  const promiseDueField = document.createElement("label");
  promiseDueField.className = "card-field";
  const promiseDueLabel = document.createElement("span");
  promiseDueLabel.className = "field-label";
  promiseDueLabel.textContent = text.promiseDueOn;
  const promiseDue = document.createElement("input");
  promiseDue.type = "date";
  promiseDue.value = card.promiseDueOn;
  promiseDue.ariaLabel = text.promiseDueOn;
  promiseDue.addEventListener("change", () => onPromise({ dueOn: promiseDue.value }));
  promiseDueField.append(promiseDueLabel, promiseDue);

  const promiseStatusField = document.createElement("label");
  promiseStatusField.className = "card-field";
  const promiseStatusLabel = document.createElement("span");
  promiseStatusLabel.className = "field-label";
  promiseStatusLabel.textContent = text.promiseStatus;
  const promiseStatus = document.createElement("select");
  promiseStatus.ariaLabel = text.promiseStatus;
  const promiseStatuses: Card["promiseStatus"][] = card.promise.trim()
    ? ["open", "kept", "released"]
    : ["none"];
  for (const status of promiseStatuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = text.promiseStatusLabels[status];
    option.selected = card.promiseStatus === status;
    promiseStatus.append(option);
  }
  promiseStatus.addEventListener("change", () =>
    onPromise({ status: promiseStatus.value as Card["promiseStatus"] }),
  );
  promiseStatusField.append(promiseStatusLabel, promiseStatus);

  const outcomeField = createTextareaField(
    text.outcome,
    text.outcomeEmpty,
    card.outcome,
    onOutcome,
    text.outcomeHelper,
  );
  outcomeField.classList.add("continuity-section-field");

  const linksField = createTextareaField(text.richLinks, text.richLinksEmpty, card.richLinks.join("\n"), (value) =>
    onRichLinks(splitLines(value)),
    text.richLinksHelper,
  );
  const captureControls = createCaptureControls(card, text, onImageRefs, onAudioRefs, onFileRefs);
  const bookmarkReasonField = createTextareaField(
    text.bookmarkReason,
    text.bookmarkReasonEmpty,
    card.bookmarkReason,
    onBookmarkReason,
  );
  const tagsField = createTagField(card.tags, text, onTags);

  editor.append(
    titleField,
    noteField,
    contextSnapshotField,
    whyStillOpenField,
    waitingOnField,
    ifYouReturnField,
    nextStepKindField,
    nextStepField,
    promiseField,
    promiseToField,
    promiseDueField,
    promiseStatusField,
    outcomeField,
    linksField,
    captureControls,
    bookmarkReasonField,
    tagsField,
  );

  return editor;
}

function createTextField(
  label: string,
  placeholder: string,
  value: string,
  maxLength: number,
  onChange: (value: string) => void,
): HTMLLabelElement {
  const field = document.createElement("label");
  field.className = "card-field";
  const fieldLabel = document.createElement("span");
  fieldLabel.className = "field-label";
  fieldLabel.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.maxLength = maxLength;
  input.placeholder = placeholder;
  input.ariaLabel = label;
  input.addEventListener("change", () => onChange(input.value));
  field.append(fieldLabel, input);
  return field;
}

function createTagField(
  tags: string[],
  text: (typeof copy)[Language],
  onTags: (tags: string[]) => void,
): HTMLLabelElement {
  const field = document.createElement("label");
  field.className = "card-field tag-field";

  const label = document.createElement("span");
  label.className = "field-label";
  label.textContent = text.tags;

  const helper = document.createElement("span");
  helper.className = "field-helper";
  helper.textContent = text.tagsHelper;

  const input = document.createElement("input");
  input.type = "text";
  input.value = tags.map((tag) => `#${tag}`).join(" ");
  input.placeholder = text.tagsPlaceholder;
  input.ariaLabel = text.tags;
  input.maxLength = 280;
  const saveTags = () => onTags(normalizeTags(input.value.split(/[,\s]+/)));
  input.addEventListener("change", saveTags);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveTags();
    }
  });

  field.append(label, helper, input);
  return field;
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

  const reportMediaSize = (beforeBytes: number, afterBytes: number, width: number, height: number) => {
    status.textContent = `${text.imageReady} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}, ${width}x${height}`;
  };

  const uploadInput = createImageInput(
    (dataUrl) => onImageRefs([...card.imageRefs, dataUrl]),
    reportMediaSize,
    (message) => {
      status.textContent = message;
    },
    text,
  );
  const uploadButton = createCaptureButton(text.uploadImage, () => uploadInput.click());

  const cameraInput = createImageInput(
    (dataUrl) => onImageRefs([...card.imageRefs, dataUrl]),
    reportMediaSize,
    (message) => {
      status.textContent = message;
    },
    text,
  );
  cameraInput.setAttribute("capture", "environment");
  const cameraButton = createCaptureButton(text.capturePhoto, () => cameraInput.click());

  const screenButton = createCaptureButton(text.captureScreen, async () => {
    status.textContent = "";

    try {
      const { dataUrl, beforeBytes, afterBytes, width, height } = await captureScreen(text.screenCaptureUnsupported, text);
      reportMediaSize(beforeBytes, afterBytes, width, height);
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
  audioNote.textContent = `${text.audioLocalNote} ${text.voiceLimit}`;

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
  let stopTimer: number | undefined;

  const button = createCaptureButton(text.recordVoice, async () => {
    status.textContent = "";

    if (recorder?.state === "recording") {
      window.clearTimeout(stopTimer);
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
        const beforeBytes = audioBlob.size;
        const dataUrl = await blobToDataUrl(audioBlob);
        const afterBytes = estimateDataUrlBytes(dataUrl);

        if (afterBytes > MAX_AUDIO_BYTES) {
          status.textContent = `${text.mediaTooLarge} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}`;
        } else {
          status.textContent = `${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}`;
          onAudioRefs([...card.audioRefs, dataUrl]);
        }

        for (const track of stream?.getTracks() ?? []) {
          track.stop();
        }
        window.clearTimeout(stopTimer);
        button.textContent = text.recordVoice;
        delete button.dataset.recording;
      },
      { once: true },
    );
    recorder.start();
    button.dataset.recording = "true";
    button.textContent = text.stopRecording;
    stopTimer = window.setTimeout(() => {
      if (recorder?.state === "recording") {
        recorder.stop();
      }
    }, VOICE_LIMIT_MS);
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

function createImageInput(
  onImage: (dataUrl: string) => void,
  onCompressed: (beforeBytes: number, afterBytes: number, width: number, height: number) => void,
  onStatus: (message: string) => void,
  text: (typeof copy)[Language],
): HTMLInputElement {
  const input = document.createElement("input");
  input.className = "file-input";
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    onStatus(text.imageProcessing);

    try {
      const { dataUrl, beforeBytes, afterBytes, width, height } = await compressImageFile(file);

      if (afterBytes > MAX_IMAGE_BYTES) {
        onStatus(`${text.imageTooLargeDevice} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}, ${width}x${height}`);
      } else {
        onCompressed(beforeBytes, afterBytes, width, height);
        onImage(dataUrl);
      }
    } catch {
      onStatus(text.imageProcessingFailed);
    }

    input.value = "";
  });

  return input;
}

async function captureScreen(
  unsupportedMessage: string,
  text: (typeof copy)[Language],
): Promise<{ dataUrl: string; beforeBytes: number; afterBytes: number; width: number; height: number }> {
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

    const compressed = await compressImageDataUrl(canvas.toDataURL("image/png"));

    if (compressed.afterBytes > MAX_IMAGE_BYTES) {
      throw new Error(
        `${text.mediaTooLarge} ${text.mediaCompressed} ${formatBytes(compressed.beforeBytes)} -> ${formatBytes(
          compressed.afterBytes,
        )}`,
      );
    }

    return compressed;
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
  helper?: string,
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

  field.append(fieldLabel);

  if (helper) {
    const helperText = document.createElement("span");
    helperText.className = "field-helper";
    helperText.textContent = helper;
    field.append(helperText);
  }

  field.append(textarea);

  return field;
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

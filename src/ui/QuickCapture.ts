import {
  MAX_AUDIO_BYTES,
  MAX_IMAGE_BYTES,
  VOICE_LIMIT_MS,
  blobToDataUrl,
  compressImageFile,
  estimateDataUrlBytes,
  formatBytes,
} from "../media/localMedia";
import type { Language } from "./i18n";
import { copy } from "./i18n";

interface QuickCaptureProps {
  language: Language;
  initialTitle: string;
  initialNote: string;
  initialLink: string;
  storageEstimate: string;
  onLanguageChange: (language: Language) => void;
  onSave: (capture: QuickCapturePayload) => QuickCaptureSaveResult;
  onOpenBoard: () => void;
}

export interface QuickCapturePayload {
  title: string;
  note: string;
  link: string;
  imageRef: string;
  audioRef: string;
}

export type QuickCaptureSaveResult = "saved" | "empty" | "storage-error";

export function QuickCapture({
  language,
  initialTitle,
  initialNote,
  initialLink,
  storageEstimate,
  onLanguageChange,
  onSave,
  onOpenBoard,
}: QuickCaptureProps): HTMLElement {
  const text = copy[language];
  const shell = document.createElement("div");
  shell.className = "quick-capture-shell";

  const header = document.createElement("header");
  header.className = "quick-capture-header";

  const title = document.createElement("h1");
  title.textContent = text.quickCaptureTitle;

  const helper = document.createElement("p");
  helper.textContent = text.quickCaptureHelper;

  const languageToggle = document.createElement("div");
  languageToggle.className = "language-toggle";
  languageToggle.setAttribute("aria-label", "Language");

  for (const option of ["vi", "en"] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = option === language ? "language-button active" : "language-button";
    button.textContent = option.toUpperCase();
    button.addEventListener("click", () => onLanguageChange(option));
    languageToggle.append(button);
  }

  const heading = document.createElement("div");
  heading.className = "quick-capture-heading";
  heading.append(title, helper);

  header.append(heading, languageToggle);

  const form = document.createElement("form");
  form.className = "quick-capture-form";
  form.addEventListener("submit", (event) => event.preventDefault());

  const cardTitle = createInput(text.cardName, text.cardName, initialTitle);
  const note = createTextarea(text.tinyNote, text.tinyNote, initialNote);
  const link = createInput(text.quickCaptureLink, text.richLinksEmpty, initialLink);
  let imageRef = "";
  let audioRef = "";
  let mediaBlocked = false;
  let mediaProcessing = false;

  const photoInput = document.createElement("input");
  photoInput.className = "file-input";
  photoInput.type = "file";
  photoInput.accept = "image/*";
  photoInput.setAttribute("capture", "environment");
  photoInput.addEventListener("change", async () => {
    const file = photoInput.files?.[0];

    if (file) {
      mediaProcessing = true;
      saveButton.disabled = true;
      status.textContent = text.imageProcessing;

      try {
        const { dataUrl, beforeBytes, afterBytes, width, height } = await compressImageFile(file);

        if (afterBytes > MAX_IMAGE_BYTES) {
          mediaBlocked = true;
          imageRef = "";
          preview.replaceChildren();
          status.textContent = `${text.imageTooLargeDevice} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}, ${width}x${height}`;
        } else {
          mediaBlocked = false;
          imageRef = dataUrl;
          renderImagePreview(preview, dataUrl, text.imageRefs);
          status.textContent = `${text.imageReady} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}, ${width}x${height}`;
        }
      } catch {
        mediaBlocked = true;
        imageRef = "";
        status.textContent = text.imageProcessingFailed;
      } finally {
        mediaProcessing = false;
        saveButton.disabled = false;
      }
    }
  });

  const status = document.createElement("p");
  status.className = "capture-status";
  status.setAttribute("role", "status");

  const captureRow = document.createElement("div");
  captureRow.className = "quick-capture-actions";

  const preview = document.createElement("div");
  preview.className = "quick-media-preview";

  const photoButton = createButton(text.capturePhoto, () => photoInput.click());
  const voiceButton = createQuickVoiceButton(
    text,
    (dataUrl) => {
      audioRef = dataUrl;
      mediaBlocked = false;
      renderAudioPreview(preview, dataUrl);
    },
    () => {
      mediaBlocked = true;
      audioRef = "";
    },
    status,
  );

  captureRow.append(photoButton, voiceButton);

  const saveButton = createButton(text.quickCaptureSave, () => {
    const capture = {
      title: cardTitle.input.value,
      note: note.textarea.value,
      link: link.input.value,
      imageRef,
      audioRef,
    };

    if (!hasCaptureContent(capture)) {
      status.textContent = text.quickCaptureEmpty;
      return;
    }

    if (mediaBlocked) {
      status.textContent = `${text.mediaTooLarge} ${text.cardNotSaved}`;
      return;
    }

    if (mediaProcessing) {
      status.textContent = text.imageProcessing;
      return;
    }

    const saveResult = onSave(capture);
    status.textContent =
      saveResult === "saved"
        ? text.quickCaptureSaved
        : saveResult === "storage-error"
          ? `${text.storageNotEnough} ${text.cardNotSaved} ${text.storageAdvice}`
          : text.quickCaptureEmpty;
  });
  saveButton.className = "quick-save-button";

  const openBoard = createButton(text.quickCaptureBack, onOpenBoard);
  openBoard.className = "quiet-button";

  const localNote = document.createElement("p");
  localNote.className = "capture-note";
  localNote.textContent = `${text.imageLocalNote} ${text.audioLocalNote} ${text.voiceLimit}`;

  const storageNote = document.createElement("p");
  storageNote.className = "capture-note";
  storageNote.textContent = storageEstimate;

  form.append(cardTitle.field, note.field, link.field, photoInput, captureRow, preview, localNote, storageNote, saveButton, openBoard, status);
  shell.append(header, form);

  return shell;
}

function hasCaptureContent(capture: QuickCapturePayload): boolean {
  return Boolean(
    capture.title.trim() || capture.note.trim() || capture.link.trim() || capture.imageRef || capture.audioRef,
  );
}

function createInput(label: string, placeholder: string, value: string): { field: HTMLLabelElement; input: HTMLInputElement } {
  const field = document.createElement("label");
  field.className = "card-field";

  const fieldLabel = document.createElement("span");
  fieldLabel.className = "field-label";
  fieldLabel.textContent = label;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.value = value;

  field.append(fieldLabel, input);
  return { field, input };
}

function renderImagePreview(preview: HTMLElement, dataUrl: string, alt: string): void {
  const image = document.createElement("img");
  image.src = dataUrl;
  image.alt = alt;
  preview.append(image);
}

function renderAudioPreview(preview: HTMLElement, dataUrl: string): void {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = dataUrl;
  preview.append(audio);
}

function createTextarea(
  label: string,
  placeholder: string,
  value: string,
): { field: HTMLLabelElement; textarea: HTMLTextAreaElement } {
  const field = document.createElement("label");
  field.className = "card-field";

  const fieldLabel = document.createElement("span");
  fieldLabel.className = "field-label";
  fieldLabel.textContent = label;

  const textarea = document.createElement("textarea");
  textarea.placeholder = placeholder;
  textarea.value = value;
  textarea.rows = 3;

  field.append(fieldLabel, textarea);
  return { field, textarea };
}

function createButton(label: string, onClick: () => void | Promise<void>): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => {
    void onClick();
  });

  return button;
}

function createQuickVoiceButton(
  text: (typeof copy)[Language],
  onAudio: (dataUrl: string) => void,
  onTooLarge: () => void,
  status: HTMLParagraphElement,
): HTMLButtonElement {
  let recorder: MediaRecorder | undefined;
  let stream: MediaStream | undefined;
  let chunks: Blob[] = [];
  let stopTimer: number | undefined;

  const button = createButton(text.recordVoice, async () => {
    status.textContent = "";

    if (recorder?.state === "recording") {
      window.clearTimeout(stopTimer);
      recorder.stop();
      button.textContent = text.recordVoice;
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      status.textContent = text.voiceUnsupported;
      return;
    }

    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
          onTooLarge();
          status.textContent = `${text.mediaTooLarge} ${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}`;
        } else {
          onAudio(dataUrl);
          status.textContent = `${text.mediaCompressed} ${formatBytes(beforeBytes)} -> ${formatBytes(afterBytes)}`;
        }

        for (const track of stream?.getTracks() ?? []) {
          track.stop();
        }
        window.clearTimeout(stopTimer);
        button.textContent = text.recordVoice;
      },
      { once: true },
    );
    recorder.start();
    button.textContent = text.stopRecording;
    stopTimer = window.setTimeout(() => {
      if (recorder?.state === "recording") {
        recorder.stop();
      }
    }, VOICE_LIMIT_MS);
  });

  return button;
}

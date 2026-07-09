import type { Card as BoardCard } from "../domain/card";
import type { BoardState } from "../domain/state";
import { CardEditor } from "./CardEditor";
import type { Language } from "./i18n";
import { copy } from "./i18n";
import { BOARD_STATES } from "../domain/state";

interface CardProps {
  card: BoardCard;
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
  onFileRefs: (cardId: string, fileRefs: BoardCard["fileRefs"]) => void;
  onBookmarkReason: (cardId: string, bookmarkReason: string) => void;
  onHide: (cardId: string) => void;
}

export function Card({
  card,
  language,
  onRename,
  onMove,
  onNote,
  onContextSnapshot,
  onWhyStillOpen,
  onIfYouReturn,
  onRichLinks,
  onImageRefs,
  onAudioRefs,
  onFileRefs,
  onBookmarkReason,
  onHide,
}: CardProps): HTMLElement {
  const text = copy[language];
  const item = document.createElement("article");
  item.className = "card";

  const editor = CardEditor({
    card,
    language,
    onRename: (title) => onRename(card.id, title),
    onNote: (note) => onNote(card.id, note),
    onContextSnapshot: (contextSnapshot) => onContextSnapshot(card.id, contextSnapshot),
    onWhyStillOpen: (whyStillOpen) => onWhyStillOpen(card.id, whyStillOpen),
    onIfYouReturn: (ifYouReturn) => onIfYouReturn(card.id, ifYouReturn),
    onRichLinks: (richLinks) => onRichLinks(card.id, richLinks),
    onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
    onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
    onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
    onBookmarkReason: (bookmarkReason) => onBookmarkReason(card.id, bookmarkReason),
  });

  const snapshot = document.createElement("dl");
  snapshot.className = "context-snapshot";

  const lastTouch = document.createElement("div");
  lastTouch.className = "last-touch";
  lastTouch.textContent = `${text.lastTouched}: ${formatRelativeDate(card.updatedAt, language)}`;

  for (const row of [
    [text.created, formatDate(card.createdAt)],
    [text.lastTouched, formatDate(card.updatedAt)],
    [text.currentState, text.stateLabels[card.state]],
  ]) {
    const term = document.createElement("dt");
    term.textContent = row[0];

    const value = document.createElement("dd");
    value.textContent = row[1];

    snapshot.append(term, value);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const moveLabel = document.createElement("label");
  moveLabel.className = "action-label";
  moveLabel.textContent = text.changeZone;

  const moveSelect = document.createElement("select");
  moveSelect.ariaLabel = text.changeZone;
  moveLabel.append(moveSelect);

  for (const state of BOARD_STATES) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = text.stateLabels[state];
    option.selected = state === card.state;
    moveSelect.append(option);
  }

  moveSelect.addEventListener("change", () => onMove(card.id, moveSelect.value as BoardState));

  const hideButton = document.createElement("button");
  hideButton.type = "button";
  hideButton.className = "quiet-button";
  hideButton.textContent = text.hideCard;
  hideButton.addEventListener("click", () => onHide(card.id));

  actions.append(moveLabel, hideButton);
  item.append(editor, renderRichContext(card, text), lastTouch, snapshot, actions);

  return item;
}

function renderRichContext(card: BoardCard, text: (typeof copy)[Language]): HTMLElement {
  const section = document.createElement("section");
  section.className = "rich-context";

  const title = document.createElement("h3");
  title.textContent = text.savedContext;
  section.append(title);

  if (card.bookmarkReason.trim()) {
    const reason = document.createElement("p");
    reason.className = "bookmark-reason";
    reason.textContent = card.bookmarkReason;
    section.append(reason);
  }

  if (card.richLinks.length > 0) {
    const list = document.createElement("ul");
    list.className = "rich-link-list";

    for (const link of card.richLinks) {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = safeHref(link);
      anchor.textContent = link;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      item.append(anchor);
      list.append(item);
    }

    section.append(list);
  }

  if (card.imageRefs.length > 0) {
    const gallery = document.createElement("div");
    gallery.className = "image-ref-list";

    for (const ref of card.imageRefs) {
      if (ref.startsWith("data:image/")) {
        const image = document.createElement("img");
        image.src = ref;
        image.alt = text.imageRefs;
        gallery.append(image);
      } else {
        const reference = document.createElement("code");
        reference.textContent = ref;
        gallery.append(reference);
      }
    }

    section.append(gallery);
  }

  if (card.audioRefs.length > 0) {
    const audioList = document.createElement("div");
    audioList.className = "audio-ref-list";

    for (const ref of card.audioRefs) {
      if (ref.startsWith("data:audio/")) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = ref;
        audioList.append(audio);
      }
    }

    section.append(audioList);
  }

  if (card.fileRefs.length > 0) {
    const fileList = document.createElement("ul");
    fileList.className = "file-ref-list";

    for (const fileRef of card.fileRefs) {
      const item = document.createElement("li");
      const meta = `${fileRef.name} · ${formatFileSize(fileRef.size)}${fileRef.type ? ` · ${fileRef.type}` : ""}`;

      if (fileRef.dataUrl) {
        const link = document.createElement("a");
        link.href = fileRef.dataUrl;
        link.download = fileRef.name;
        link.textContent = meta;
        item.append(link);
      } else {
        item.textContent = meta;
      }

      fileList.append(item);
    }

    section.append(fileList);
  }

  if (section.children.length === 1) {
    const empty = document.createElement("p");
    empty.className = "rich-context-empty";
    empty.textContent = text.savedContextEmpty;
    section.append(empty);
  }

  return section;
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function safeHref(value: string): string {
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function formatRelativeDate(value: string, language: Language): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const elapsedMs = now.getTime() - date.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  if (elapsedMinutes < 10) {
    return language === "vi" ? "vừa xong" : "just now";
  }

  if (date.toDateString() === now.toDateString()) {
    return language === "vi" ? "hôm nay" : "today";
  }

  const elapsedDays = Math.max(1, Math.floor(elapsedMs / 86400000));
  return language === "vi" ? `${elapsedDays} ngày trước` : `${elapsedDays} days ago`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

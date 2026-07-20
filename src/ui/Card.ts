import { evidenceIdentity, type Card as BoardCard, type EvidenceKind, type EvidenceRole } from "../domain/card";
import type { BoardState } from "../domain/state";
import { getReentrySignal } from "../domain/reentryPriority";
import { CardEditor } from "./CardEditor";
import type { Language } from "./i18n";
import { copy } from "./i18n";
import { BOARD_STATES } from "../domain/state";
import { extractValidHttpUrls, normalizeReadableHttpUrl } from "../lib/links";

interface CardProps {
  card: BoardCard;
  language: Language;
  onRename: (cardId: string, title: string) => void;
  onMove: (cardId: string, state: BoardState) => void;
  onNote: (cardId: string, note: string) => void;
  onContextSnapshot: (cardId: string, contextSnapshot: string) => void;
  onWhyStillOpen: (cardId: string, whyStillOpen: string) => void;
  onWaitingOn: (cardId: string, waitingOn: string) => void;
  onIfYouReturn: (cardId: string, ifYouReturn: string) => void;
  onNextStepKind: (cardId: string, nextStepKind: BoardCard["nextStepKind"]) => void;
  onNextStep: (cardId: string, nextStep: string) => void;
  onPromise: (
    cardId: string,
    promise: { text?: string; to?: string; dueOn?: string; status?: BoardCard["promiseStatus"] },
  ) => void;
  onOutcome: (cardId: string, outcome: string) => void;
  onEvidenceRole: (
    cardId: string,
    evidence: { id: string; kind: EvidenceKind; role: EvidenceRole },
  ) => void;
  onRichLinks: (cardId: string, richLinks: string[]) => void;
  onImageRefs: (cardId: string, imageRefs: string[]) => void;
  onAudioRefs: (cardId: string, audioRefs: string[]) => void;
  onFileRefs: (cardId: string, fileRefs: BoardCard["fileRefs"]) => void;
  onBookmarkReason: (cardId: string, bookmarkReason: string) => void;
  onTags: (cardId: string, tags: string[]) => void;
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
  onWaitingOn,
  onIfYouReturn,
  onNextStepKind,
  onNextStep,
  onPromise,
  onOutcome,
  onEvidenceRole,
  onRichLinks,
  onImageRefs,
  onAudioRefs,
  onFileRefs,
  onBookmarkReason,
  onTags,
  onHide,
}: CardProps): HTMLElement {
  const text = copy[language];
  const item = document.createElement("article");
  item.className = "card";
  let mode: "summary" | "open" | "edit" = "summary";

  const render = () => {
    item.className = `card card-${mode}`;
    item.replaceChildren();

    if (mode === "summary") {
      item.append(renderSummary());
      return;
    }

    item.classList.add("card-expanded");
    item.append(renderHeaderActions());

    if (mode === "edit") {
      item.append(
        CardEditor({
          card,
          language,
          onRename: (title) => onRename(card.id, title),
          onNote: (note) => onNote(card.id, note),
          onContextSnapshot: (contextSnapshot) => onContextSnapshot(card.id, contextSnapshot),
          onWhyStillOpen: (whyStillOpen) => onWhyStillOpen(card.id, whyStillOpen),
          onWaitingOn: (waitingOn) => onWaitingOn(card.id, waitingOn),
          onIfYouReturn: (ifYouReturn) => onIfYouReturn(card.id, ifYouReturn),
          onNextStepKind: (nextStepKind) => onNextStepKind(card.id, nextStepKind),
          onNextStep: (nextStep) => onNextStep(card.id, nextStep),
          onPromise: (promise) => onPromise(card.id, promise),
          onOutcome: (outcome) => onOutcome(card.id, outcome),
          onRichLinks: (richLinks) => onRichLinks(card.id, richLinks),
          onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
          onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
          onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
          onBookmarkReason: (bookmarkReason) => onBookmarkReason(card.id, bookmarkReason),
          onTags: (tags) => onTags(card.id, tags),
        }),
      );
    } else {
      item.append(renderReadableDetail(card, text));
    }

    item.append(
      renderRichContext(card, text, {
        onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
        onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
        onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
        onEvidenceRole: (evidence) => onEvidenceRole(card.id, evidence),
        editable: mode === "edit",
      }),
      renderSnapshot(card, text, language),
    );

    if (mode === "edit") {
      item.append(renderEditActions());
    }
  };

  const setMode = (nextMode: typeof mode) => {
    mode = nextMode;
    render();
  };

  const renderSummary = (): HTMLElement => {
    const summary = document.createElement("div");
    summary.className = "card-summary";

    const title = document.createElement("h3");
    title.textContent = card.title;

    const snapshot = document.createElement("p");
    snapshot.className = "summary-snapshot";
    snapshot.textContent = card.contextSnapshot.trim() || text.noSnapshotSummary;

    const meta = document.createElement("div");
    meta.className = "summary-meta";
    meta.append(
      createPill(`${text.lastTouched}: ${formatRelativeDate(card.updatedAt, language)}`),
      createPill(text.stateLabels[card.state]),
      ...renderMediaIndicators(card, text, language),
    );

    if (card.waitingOn.trim()) {
      meta.append(createPill(text.waitingPill));
    }

    if (card.promise.trim() && card.promiseStatus === "open") {
      meta.append(createPill(text.promisePill));
    }

    if (card.state === "finished") {
      meta.append(createPill(card.outcome.trim() ? text.outcomeRecorded : text.outcomeMissing));
    }

    if (card.evidenceMeta.length > 0) {
      meta.append(createPill(`${card.evidenceMeta.length} ${text.keyEvidencePill}`));
    }

    const reentrySignal = getReentrySignal(card);
    if (reentrySignal.readiness !== "excluded") {
      const signalPill = createPill(text.reentryReadinessLabels[reentrySignal.readiness]);
      signalPill.classList.add(`reentry-signal-${reentrySignal.readiness}`);
      meta.append(signalPill);
    }

    const returnPoint = document.createElement("p");
    returnPoint.className = "summary-return-point";
    returnPoint.hidden = !card.ifYouReturn.trim();
    returnPoint.textContent = card.ifYouReturn.trim()
      ? `${text.returnPointShort}: ${card.ifYouReturn.trim()}`
      : "";

    const actions = document.createElement("div");
    actions.className = "summary-actions";
    actions.append(
      createModeButton(text.openCard, () => setMode("open")),
      createModeButton(text.editCard, () => setMode("edit")),
    );

    summary.append(title, snapshot, returnPoint, meta, actions);
    const tags = renderTags(card.tags, 3);
    if (tags) {
      summary.insertBefore(tags, actions);
    }
    return summary;
  };

  const renderHeaderActions = (): HTMLElement => {
    const header = document.createElement("div");
    header.className = "card-mode-header";
    const title = document.createElement("h3");
    title.textContent = card.title;
    header.append(title, createModeButton(text.collapseCard, () => setMode("summary")));
    return header;
  };

  const renderEditActions = (): HTMLElement => {
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
    return actions;
  };

  render();

  return item;
}

function renderRichContext(
  card: BoardCard,
  text: (typeof copy)[Language],
  actions: {
    onImageRefs: (imageRefs: string[]) => void;
    onAudioRefs: (audioRefs: string[]) => void;
    onFileRefs: (fileRefs: BoardCard["fileRefs"]) => void;
    onEvidenceRole: (evidence: { id: string; kind: EvidenceKind; role: EvidenceRole }) => void;
    editable: boolean;
  },
): HTMLElement {
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

  const visibleLinks = card.richLinks.filter((link) => link.trim());

  if (visibleLinks.length > 0) {
    const list = document.createElement("ul");
    list.className = "rich-link-list";

    for (const link of visibleLinks) {
      const item = document.createElement("li");
      const normalized = normalizeReadableHttpUrl(link);
      if (normalized) {
        const anchor = document.createElement("a");
        anchor.href = normalized;
        anchor.textContent = link;
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        item.append(anchor);
      } else {
        item.className = "plain-link-text";
        item.textContent = link;
      }
      appendEvidenceRoleControl(item, card, "link", link, text, actions);
      list.append(item);
    }

    section.append(list);
  }

  if (card.imageRefs.length > 0) {
    const gallery = document.createElement("div");
    gallery.className = "image-ref-list";

    card.imageRefs.forEach((ref, index) => {
      const mediaItem = document.createElement("div");
      mediaItem.className = "media-item";

      if (ref.startsWith("data:image/")) {
        const label = document.createElement("p");
        label.className = "media-label";
        label.textContent = `${text.imageLabel} ${index + 1} · ${formatFileSize(estimateDataUrlBytes(ref))}`;
        const image = document.createElement("img");
        image.src = ref;
        image.alt = text.imageRefs;
        mediaItem.append(label, image);
      } else {
        const reference = document.createElement("code");
        reference.textContent = ref;
        mediaItem.append(reference);
      }

      mediaItem.append(createRemoveButton(text.removeMedia, () => actions.onImageRefs(removeAt(card.imageRefs, index))));
      appendEvidenceRoleControl(mediaItem, card, "image", ref, text, actions);
      gallery.append(mediaItem);
    });

    section.append(gallery);
  }

  if (card.audioRefs.length > 0) {
    const audioList = document.createElement("div");
    audioList.className = "audio-ref-list";

    card.audioRefs.forEach((ref, index) => {
      const mediaItem = document.createElement("div");
      mediaItem.className = "media-item";

      if (ref.startsWith("data:audio/")) {
        const label = document.createElement("p");
        label.className = "media-label";
        label.textContent = `${index + 1} ${text.voiceLabel} · ${formatFileSize(estimateDataUrlBytes(ref))}`;
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = ref;
        mediaItem.append(label, audio);
      }

      mediaItem.append(createRemoveButton(text.removeMedia, () => actions.onAudioRefs(removeAt(card.audioRefs, index))));
      appendEvidenceRoleControl(mediaItem, card, "audio", ref, text, actions);
      audioList.append(mediaItem);
    });

    section.append(audioList);
  }

  if (card.fileRefs.length > 0) {
    const fileList = document.createElement("ul");
    fileList.className = "file-ref-list";

    card.fileRefs.forEach((fileRef, index) => {
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

      item.append(createRemoveButton(text.removeMedia, () => actions.onFileRefs(removeAt(card.fileRefs, index))));
      appendEvidenceRoleControl(item, card, "file", fileRef, text, actions);
      fileList.append(item);
    });

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

function appendEvidenceRoleControl(
  container: HTMLElement,
  card: BoardCard,
  kind: EvidenceKind,
  source: string | BoardCard["fileRefs"][number],
  text: (typeof copy)[Language],
  actions: {
    onEvidenceRole: (evidence: { id: string; kind: EvidenceKind; role: EvidenceRole }) => void;
    editable: boolean;
  },
): void {
  const id = evidenceIdentity(kind, source);
  const assignment = card.evidenceMeta.find((meta) => meta.id === id);
  if (!actions.editable) {
    if (assignment) {
      container.append(createPill(text.evidenceRoleLabels[assignment.role]));
    }
    return;
  }

  const label = document.createElement("label");
  label.className = "evidence-role-control";
  const caption = document.createElement("span");
  caption.textContent = text.evidenceRole;
  const select = document.createElement("select");
  select.ariaLabel = text.evidenceRole;
  for (const role of ["reference", "brief", "feedback", "latest", "return-first", "outcome-proof"] as const) {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = text.evidenceRoleLabels[role];
    option.selected = (assignment?.role ?? "reference") === role;
    select.append(option);
  }
  select.addEventListener("change", () => actions.onEvidenceRole({ id, kind, role: select.value as EvidenceRole }));
  label.append(caption, select);
  container.append(label);
}

function estimateDataUrlBytes(value: string): number {
  const base64 = value.split(",")[1] ?? "";
  return Math.floor((base64.length * 3) / 4);
}

function renderReadableDetail(card: BoardCard, text: (typeof copy)[Language]): HTMLElement {
  const detail = document.createElement("section");
  detail.className = "readable-detail";

  const heading = document.createElement("h3");
  heading.className = "reentry-heading";
  heading.textContent = text.reentryViewTitle;
  detail.append(heading);

  const tags = renderTags(card.tags);
  if (tags) {
    const block = document.createElement("div");
    const heading = document.createElement("h4");
    heading.textContent = text.tags;
    block.append(heading, tags);
    detail.append(block);
  }

  for (const [label, value, empty] of [
    [text.contextSnapshot, card.contextSnapshot, text.contextSnapshotEmpty],
    [text.whyStillOpen, card.whyStillOpen, text.whyStillOpenEmpty],
    [text.waitingOn, card.waitingOn, text.waitingOnEmpty],
    [text.ifYouReturn, card.ifYouReturn, text.ifYouReturnEmpty],
    [nextStepLabel(card, text), card.nextStep, text.nextStepEmpty],
    [text.promise, formatPromise(card, text), text.promiseEmpty],
    [text.outcome, card.outcome, text.outcomeEmpty],
    [text.tinyNote, card.note, ""],
  ]) {
    const block = document.createElement("div");
    const heading = document.createElement("h4");
    heading.textContent = label;
    const body = document.createElement("p");
    body.textContent = value.trim() || empty;
    block.append(heading, body);
    detail.append(block);
  }

  detail.append(renderEvidenceMeaning(card, text), renderStateHistory(card, text));

  return detail;
}

function renderEvidenceMeaning(card: BoardCard, text: (typeof copy)[Language]): HTMLElement {
  const block = document.createElement("div");
  block.className = "evidence-meaning";
  const heading = document.createElement("h4");
  heading.textContent = text.evidenceMeaning;
  block.append(heading);

  const ranked = [...card.evidenceMeta].sort(
    (left, right) => evidenceRoleRank(left.role) - evidenceRoleRank(right.role),
  );
  if (ranked.length === 0) {
    const empty = document.createElement("p");
    const attachmentCount = card.richLinks.length + card.imageRefs.length + card.audioRefs.length + card.fileRefs.length;
    empty.textContent = attachmentCount > 0 ? text.evidenceMeaningEmpty : text.evidenceNone;
    block.append(empty);
    return block;
  }

  const list = document.createElement("ul");
  for (const meta of ranked) {
    const item = document.createElement("li");
    item.textContent = `${text.evidenceRoleLabels[meta.role]} · ${resolveEvidenceLabel(card, meta.id, meta.kind, text)}`;
    list.append(item);
  }
  block.append(list);
  return block;
}

function resolveEvidenceLabel(
  card: BoardCard,
  id: string,
  kind: EvidenceKind,
  text: (typeof copy)[Language],
): string {
  if (kind === "file") {
    return card.fileRefs.find((source) => evidenceIdentity(kind, source) === id)?.name ?? text.evidenceUnavailable;
  }
  const sources = kind === "link" ? card.richLinks : kind === "image" ? card.imageRefs : card.audioRefs;
  const index = sources.findIndex((source) => evidenceIdentity(kind, source) === id);
  if (index < 0) {
    return text.evidenceUnavailable;
  }
  return kind === "link" ? sources[index] : `${text.evidenceKindLabels[kind]} ${index + 1}`;
}

function evidenceRoleRank(role: BoardCard["evidenceMeta"][number]["role"]): number {
  return ["return-first", "latest", "feedback", "brief", "outcome-proof"].indexOf(role);
}

function formatPromise(card: BoardCard, text: (typeof copy)[Language]): string {
  if (!card.promise.trim()) {
    return "";
  }

  const details = [
    card.promiseTo.trim() ? `${text.promiseTo}: ${card.promiseTo.trim()}` : "",
    card.promiseDueOn ? `${text.promiseDueOn}: ${card.promiseDueOn}` : "",
    `${text.promiseStatus}: ${text.promiseStatusLabels[card.promiseStatus]}`,
  ].filter(Boolean);
  return [card.promise.trim(), ...details].join("\n");
}

function renderStateHistory(card: BoardCard, text: (typeof copy)[Language]): HTMLElement {
  const block = document.createElement("div");
  block.className = "state-history";
  const heading = document.createElement("h4");
  heading.textContent = text.stateHistory;
  block.append(heading);

  const recent = card.stateHistory.slice(-3).reverse();
  if (recent.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = text.stateHistoryEmpty;
    block.append(empty);
    return block;
  }

  const list = document.createElement("ul");
  for (const transition of recent) {
    const item = document.createElement("li");
    item.textContent = `${text.stateLabels[transition.from]} → ${text.stateLabels[transition.to]} · ${formatDate(transition.at)}`;
    list.append(item);
  }
  block.append(list);
  return block;
}

function nextStepLabel(card: BoardCard, text: (typeof copy)[Language]): string {
  if (card.nextStepKind === "action") {
    return text.nextAction;
  }

  if (card.nextStepKind === "trigger") {
    return text.nextTrigger;
  }

  return text.nextStep;
}

function renderTags(tags: string[], limit = tags.length): HTMLElement | undefined {
  const visibleTags = tags.slice(0, limit);

  if (visibleTags.length === 0) {
    return undefined;
  }

  const list = document.createElement("div");
  list.className = "tag-list";

  for (const tag of visibleTags) {
    const chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.textContent = `#${tag}`;
    list.append(chip);
  }

  if (tags.length > limit) {
    const overflow = document.createElement("span");
    overflow.className = "tag-chip tag-overflow";
    overflow.textContent = `+${tags.length - limit}`;
    list.append(overflow);
  }

  return list;
}

function renderSnapshot(card: BoardCard, text: (typeof copy)[Language], language: Language): HTMLElement {
  const snapshot = document.createElement("dl");
  snapshot.className = "context-snapshot";

  const rows = [
    [text.created, formatDate(card.createdAt)],
    [text.lastTouched, formatDate(card.updatedAt)],
    [text.currentState, text.stateLabels[card.state]],
  ];
  if (card.closedAt) {
    rows.push([text.closedAt, formatDate(card.closedAt)]);
  }

  for (const row of rows) {
    const term = document.createElement("dt");
    term.textContent = row[0];

    const value = document.createElement("dd");
    value.textContent = row[1];

    snapshot.append(term, value);
  }

  const relative = document.createElement("dd");
  relative.className = "relative-touch";
  relative.textContent = `${text.lastTouched}: ${formatRelativeDate(card.updatedAt, language)}`;
  snapshot.append(document.createElement("dt"), relative);

  return snapshot;
}

function renderMediaIndicators(card: BoardCard, text: (typeof copy)[Language], language: Language): HTMLElement[] {
  const indicators: HTMLElement[] = [];

  if (card.imageRefs.length > 0) {
    indicators.push(createPill(countLabel(card.imageRefs.length, text.imageLabel.toLowerCase(), "images", language)));
  }

  if (card.audioRefs.length > 0) {
    indicators.push(createPill(countLabel(card.audioRefs.length, text.voiceLabel, "voice notes", language)));
  }

  if (card.fileRefs.length > 0) {
    indicators.push(createPill(countLabel(card.fileRefs.length, text.filesLabel, "files", language)));
  }

  const validLinks = extractValidHttpUrls(card.richLinks);
  if (validLinks.length > 0) {
    indicators.push(createPill(countLabel(validLinks.length, text.linksLabel, "links", language)));
  }

  return indicators;
}

function countLabel(count: number, label: string, englishPlural: string, language: Language): string {
  if (language === "en" && count !== 1) {
    return `${count} ${englishPlural}`;
  }

  return `${count} ${label}`;
}

function createPill(label: string): HTMLElement {
  const pill = document.createElement("span");
  pill.className = "summary-pill";
  pill.textContent = label;
  return pill;
}

function createModeButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiet-button mode-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
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

function createRemoveButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quiet-button media-remove-button";
  button.textContent = label;
  button.addEventListener("click", onClick);

  return button;
}

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
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

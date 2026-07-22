import { evidenceIdentity, type Card as BoardCard, type EvidenceKind, type EvidenceRole } from "../domain/card";
import {
  createCardEditDraft,
  isCardEditDraftDirty,
  type CardEditDraft,
} from "../domain/board";
import type { BoardState } from "../domain/state";
import {
  assessLifecycleTransition,
  type LifecycleTransitionConfirmation,
} from "../domain/lifecycle";
import { getReentrySignal } from "../domain/reentryPriority";
import { CardEditor } from "./CardEditor";
import type { Language } from "./i18n";
import { copy } from "./i18n";
import { BOARD_STATES } from "../domain/state";
import { extractValidHttpUrls, normalizeReadableHttpUrl } from "../lib/links";

interface CardProps {
  card: BoardCard;
  language: Language;
  onTransition: (
    cardId: string,
    draft: CardEditDraft,
    state: BoardState,
    confirmations: LifecycleTransitionConfirmation[],
  ) => boolean;
  onSaveDraft: (cardId: string, draft: CardEditDraft) => boolean;
  onEvidenceRole: (
    cardId: string,
    evidence: { id: string; kind: EvidenceKind; role: EvidenceRole },
  ) => void;
  onImageRefs: (cardId: string, imageRefs: string[]) => void;
  onAudioRefs: (cardId: string, audioRefs: string[]) => void;
  onFileRefs: (cardId: string, fileRefs: BoardCard["fileRefs"]) => void;
  onHide: (cardId: string) => void;
}

const editSessions = new Map<string, CardEditDraft>();

export function Card({
  card,
  language,
  onTransition,
  onSaveDraft,
  onEvidenceRole,
  onImageRefs,
  onAudioRefs,
  onFileRefs,
  onHide,
}: CardProps): HTMLElement {
  const text = copy[language];
  const item = document.createElement("article");
  item.className = "card";
  let mode: "summary" | "open" | "edit" = editSessions.has(card.id) ? "edit" : "summary";

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
      const draft = editSessions.get(card.id) ?? createCardEditDraft(card);
      editSessions.set(card.id, draft);
      // Attachments and evidence roles remain immediate-save operations; the staged text draft survives their rerender.
      const evidenceSupplement = renderRichContext(card, text, {
        onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
        onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
        onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
        onEvidenceRole: (evidence) => onEvidenceRole(card.id, evidence),
        editable: true,
      });
      const detailsSupplement = document.createElement("div");
      detailsSupplement.className = "editor-details-supplement";
      detailsSupplement.append(renderSnapshot(card, text, language), renderStateHistory(card, text));
      item.append(
        CardEditor({
          card,
          draft,
          language,
          onDraftChange: (change) =>
            editSessions.set(card.id, { ...(editSessions.get(card.id) ?? draft), ...change }),
          onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
          onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
          onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
          evidenceSupplement,
          detailsSupplement,
        }),
      );
    } else {
      item.append(
        renderReadableDetail(card, text),
        renderRichContext(card, text, {
          onImageRefs: (imageRefs) => onImageRefs(card.id, imageRefs),
          onAudioRefs: (audioRefs) => onAudioRefs(card.id, audioRefs),
          onFileRefs: (fileRefs) => onFileRefs(card.id, fileRefs),
          onEvidenceRole: (evidence) => onEvidenceRole(card.id, evidence),
          editable: false,
        }),
        renderSnapshot(card, text, language),
      );
    }

    if (mode === "edit") {
      item.append(renderEditActions());
    }
  };

  const setMode = (nextMode: typeof mode) => {
    mode = nextMode;
    render();
  };

  const startEditing = () => {
    editSessions.set(card.id, createCardEditDraft(card));
    setMode("edit");
  };

  const discardDraft = (): boolean => {
    const draft = editSessions.get(card.id);
    if (draft && isCardEditDraftDirty(card, draft) && !window.confirm(text.unsavedDraftConfirm)) {
      return false;
    }
    editSessions.delete(card.id);
    return true;
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
      createModeButton(text.editCard, startEditing),
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
    header.append(
      title,
      createModeButton(text.collapseCard, () => {
        if (mode !== "edit" || discardDraft()) {
          releaseObsoleteFocus(item);
          setMode("summary");
        }
      }),
    );
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

    const transitionPanel = document.createElement("div");
    transitionPanel.className = "transition-confirmation";
    transitionPanel.hidden = true;
    transitionPanel.setAttribute("role", "group");
    const transitionMessage = document.createElement("p");
    const transitionConfirm = document.createElement("button");
    transitionConfirm.type = "button";
    transitionConfirm.className = "transition-confirm-button";
    const transitionCancel = document.createElement("button");
    transitionCancel.type = "button";
    transitionCancel.className = "quiet-button";
    transitionCancel.textContent = text.cancelAction;
    transitionPanel.append(transitionMessage, transitionConfirm, transitionCancel);

    const clearPendingTransition = () => {
      moveSelect.value = card.state;
      transitionPanel.hidden = true;
      transitionConfirm.onclick = null;
    };

    const executeTransition = (targetState: BoardState, confirmations: LifecycleTransitionConfirmation[]) => {
      const draft = editSessions.get(card.id);
      if (!draft) {
        clearPendingTransition();
        return;
      }
      editSessions.delete(card.id);
      if (!onTransition(card.id, draft, targetState, confirmations)) {
        editSessions.set(card.id, draft);
        clearPendingTransition();
        status.textContent = text.transitionSaveFailed;
      } else {
        releaseObsoleteFocus(item);
      }
    };

    const prepareTransition = (targetState: BoardState) => {
      const draft = editSessions.get(card.id);
      if (!draft || targetState === card.state) {
        clearPendingTransition();
        return;
      }
      const assessment = assessLifecycleTransition(card, targetState, draft);
      if (!assessment.allowed) {
        openEditorSection(item, "promise-closure");
        clearPendingTransition();
        status.textContent = text.finishBlockedOpenPromise;
        return;
      }

      status.textContent = "";
      const required = assessment.requiredConfirmations[0];
      if (!required) {
        executeTransition(targetState, []);
        return;
      }

      openEditorSection(item, "promise-closure");

      transitionPanel.hidden = false;
      transitionMessage.textContent = required === "FINISH_WITHOUT_OUTCOME"
        ? text.finishWithoutOutcomeWarning
        : text.leaveAloneOpenPromiseWarning;
      transitionConfirm.textContent = required === "FINISH_WITHOUT_OUTCOME"
        ? text.finishWithoutOutcomeAction
        : text.leaveAloneConfirmAction;
      transitionConfirm.onclick = () => executeTransition(targetState, [required]);
      transitionConfirm.focus();
    };

    moveSelect.addEventListener("change", () => prepareTransition(moveSelect.value as BoardState));
    transitionCancel.addEventListener("click", clearPendingTransition);

    const hideButton = document.createElement("button");
    hideButton.type = "button";
    hideButton.className = "quiet-button";
    hideButton.textContent = text.hideCard;
    hideButton.addEventListener("click", () => {
      if (discardDraft()) {
        releaseObsoleteFocus(item);
        onHide(card.id);
      }
    });

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "primary-button edit-save";
    saveButton.textContent = text.saveAction;
    saveButton.addEventListener("click", () => {
      const draft = editSessions.get(card.id);
      if (!draft) {
        return;
      }
      editSessions.delete(card.id);
      if (!onSaveDraft(card.id, draft)) {
        editSessions.set(card.id, draft);
        status.textContent = text.editSaveFailed;
      } else {
        releaseObsoleteFocus(item);
      }
    });

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "quiet-button edit-cancel";
    cancelButton.textContent = text.cancelAction;
    cancelButton.addEventListener("click", () => {
      editSessions.delete(card.id);
      releaseObsoleteFocus(item);
      setMode("open");
    });

    const status = document.createElement("p");
    status.className = "edit-session-status";
    status.setAttribute("role", "status");

    const draftActions = document.createElement("div");
    draftActions.className = "draft-action-bar";
    draftActions.append(saveButton, cancelButton);

    const lifecycleActions = document.createElement("div");
    lifecycleActions.className = "lifecycle-actions";
    lifecycleActions.append(moveLabel, transitionPanel, hideButton, status);

    actions.append(draftActions, lifecycleActions);
    return actions;
  };

  render();

  return item;
}

function openEditorSection(container: HTMLElement, id: string): void {
  const section = container.querySelector<HTMLDetailsElement>(`[data-editor-section="${id}"]`);
  if (!section) {
    return;
  }
  section.open = true;
  section.querySelector("summary")?.setAttribute("aria-expanded", "true");
}

function releaseObsoleteFocus(container: HTMLElement): void {
  if (container.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
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
        item.textContent = link.startsWith("data:") ? text.evidenceUnavailable : link;
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
        image.id = evidenceTargetId("image", ref);
        image.tabIndex = -1;
        mediaItem.append(label, image);
      } else {
        const reference = document.createElement(ref.startsWith("data:") ? "p" : "code");
        reference.textContent = ref.startsWith("data:") ? text.evidenceUnavailable : ref;
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
        audio.id = evidenceTargetId("audio", ref);
        audio.tabIndex = -1;
        mediaItem.append(label, audio);
      } else {
        const unavailable = document.createElement("p");
        unavailable.textContent = text.evidenceUnavailable;
        mediaItem.append(unavailable);
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
    [outcomeDisplayLabel(card, text), card.outcome, text.outcomeEmpty],
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
    item.className = "evidence-access-item";
    const access = resolveEvidenceAccess(card, meta.id, meta.kind, text);
    const description = document.createElement("span");
    description.className = "evidence-access-description";
    description.textContent = `${text.evidenceRoleLabels[meta.role]} · ${access.label}`;
    item.append(description, createEvidenceAction(access, text));
    list.append(item);
  }
  block.append(list);
  return block;
}

interface EvidenceAccess {
  kind: EvidenceKind;
  label: string;
  href?: string;
  download?: string;
  targetId?: string;
}

function resolveEvidenceAccess(
  card: BoardCard,
  id: string,
  kind: EvidenceKind,
  text: (typeof copy)[Language],
): EvidenceAccess {
  if (kind === "file") {
    const source = card.fileRefs.find((candidate) => evidenceIdentity(kind, candidate) === id);
    return source?.dataUrl
      ? { kind, label: source.name, href: source.dataUrl, download: source.name }
      : { kind, label: source?.name ?? text.evidenceUnavailable };
  }

  const sources = kind === "link" ? card.richLinks : kind === "image" ? card.imageRefs : card.audioRefs;
  const index = sources.findIndex((source) => evidenceIdentity(kind, source) === id);
  if (index < 0) {
    return { kind, label: text.evidenceUnavailable };
  }

  const source = sources[index];
  if (kind === "link") {
    const href = normalizeReadableHttpUrl(source);
    const label = source.startsWith("data:") ? text.evidenceUnavailable : source;
    return href ? { kind, label, href } : { kind, label };
  }

  const expectedPrefix = kind === "image" ? "data:image/" : "data:audio/";
  return source.startsWith(expectedPrefix)
    ? { kind, label: `${text.evidenceKindLabels[kind]} ${index + 1}`, targetId: evidenceTargetId(kind, source) }
    : { kind, label: text.evidenceUnavailable };
}

function createEvidenceAction(access: EvidenceAccess, text: (typeof copy)[Language]): HTMLElement {
  const actionLabel = evidenceActionLabel(access.kind, text);
  if (access.href) {
    const link = document.createElement("a");
    link.className = "evidence-access-action";
    link.href = access.href;
    link.textContent = actionLabel;
    link.setAttribute("aria-label", `${actionLabel}: ${access.label}`);
    if (access.download) {
      link.download = access.download;
    } else {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "evidence-access-action quiet-button";
  button.textContent = access.targetId ? actionLabel : text.evidenceUnavailable;
  button.disabled = !access.targetId;
  button.setAttribute("aria-label", `${button.textContent}: ${access.label}`);
  if (access.targetId) {
    button.addEventListener("click", () => focusEvidenceTarget(access.targetId!, access.kind === "audio"));
  }
  return button;
}

function evidenceActionLabel(kind: EvidenceKind, text: (typeof copy)[Language]): string {
  if (kind === "file") {
    return text.evidenceDownload;
  }
  if (kind === "image") {
    return text.evidenceShow;
  }
  if (kind === "audio") {
    return text.evidencePlay;
  }
  return text.evidenceOpen;
}

function focusEvidenceTarget(targetId: string, playAudio: boolean): void {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.focus({ preventScroll: true });
  if (playAudio && target instanceof HTMLAudioElement) {
    void target.play().catch(() => undefined);
  }
}

function evidenceTargetId(kind: "image" | "audio", source: string): string {
  return `evidence-target-${evidenceIdentity(kind, source)}`;
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

function outcomeDisplayLabel(card: BoardCard, text: (typeof copy)[Language]): string {
  return card.state !== "finished" && Boolean(card.closedAt) && Boolean(card.outcome.trim())
    ? text.previousOutcome
    : text.outcome;
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

import type { Card } from "./card";
import {
  createCard,
  collectEvidenceIdentities,
  normalizeFileRefs,
  normalizeDateOnly,
  normalizeList,
  normalizeNextStepKind,
  normalizePromiseStatus,
  normalizeReentryField,
  normalizeTags,
  isEvidenceRole,
  touchCard,
  type FileRef,
  type EvidenceKind,
  type EvidenceRole,
} from "./card";
import type { BoardState } from "./state";
import {
  assessLifecycleTransition,
  type LifecycleTransitionAssessment,
  type LifecycleTransitionConfirmation,
} from "./lifecycle";

export interface Board {
  version: 1;
  cards: Card[];
  updatedAt: string;
}

export interface CardEditDraft {
  title: string;
  note: string;
  contextSnapshot: string;
  whyStillOpen: string;
  waitingOn: string;
  ifYouReturn: string;
  nextStepKind: Card["nextStepKind"];
  nextStep: string;
  promise: string;
  promiseTo: string;
  promiseDueOn: string;
  promiseStatus: Card["promiseStatus"];
  outcome: string;
  richLinks: string[];
  bookmarkReason: string;
  tags: string[];
}

export interface LifecycleTransitionResult {
  board: Board;
  assessment: LifecycleTransitionAssessment | null;
  applied: boolean;
}

export function createBoard(): Board {
  return {
    version: 1,
    cards: [],
    updatedAt: new Date().toISOString(),
  };
}

export function addCard(board: Board, title: string, state: BoardState = "continue"): Board {
  return touchBoard({
    ...board,
    cards: [createCard(title, state), ...board.cards],
  });
}

export function createCardEditDraft(card: Card): CardEditDraft {
  return {
    title: card.title,
    note: card.note,
    contextSnapshot: card.contextSnapshot,
    whyStillOpen: card.whyStillOpen,
    waitingOn: card.waitingOn,
    ifYouReturn: card.ifYouReturn,
    nextStepKind: card.nextStepKind,
    nextStep: card.nextStep,
    promise: card.promise,
    promiseTo: card.promiseTo,
    promiseDueOn: card.promiseDueOn,
    promiseStatus: card.promiseStatus,
    outcome: card.outcome,
    richLinks: [...card.richLinks],
    bookmarkReason: card.bookmarkReason,
    tags: [...card.tags],
  };
}

export function isCardEditDraftDirty(card: Card, draft: CardEditDraft): boolean {
  return JSON.stringify(createCardEditDraft(card)) !== JSON.stringify(draft);
}

export function applyCardEditDraft(board: Board, cardId: string, draft: CardEditDraft): Board {
  return updateCard(board, cardId, (card) => touchCard(normalizeCardEditDraft(card, draft)));
}

export function applyCardEditDraftAndTransition(
  board: Board,
  cardId: string,
  draft: CardEditDraft,
  targetState: BoardState,
  confirmations: LifecycleTransitionConfirmation[] = [],
): LifecycleTransitionResult {
  const card = board.cards.find((candidate) => candidate.id === cardId);
  if (!card) {
    return { board, assessment: null, applied: false };
  }

  const assessment = assessLifecycleTransition(card, targetState, draft);
  const confirmationsSatisfied = assessment.requiredConfirmations.every((required) => confirmations.includes(required));
  if (!assessment.transitionNeeded || !assessment.allowed || !confirmationsSatisfied) {
    return { board, assessment, applied: false };
  }

  const now = new Date().toISOString();
  const normalized = normalizeCardEditDraft(card, draft);
  const transitioned: Card = {
    ...normalized,
    state: targetState,
    closedAt: targetState === "finished" ? now : card.closedAt,
    stateHistory: [...card.stateHistory, { from: card.state, to: targetState, at: now }].slice(-40),
    updatedAt: now,
  };

  return {
    board: {
      ...board,
      cards: board.cards.map((candidate) => (candidate.id === cardId ? transitioned : candidate)),
      updatedAt: now,
    },
    assessment,
    applied: true,
  };
}

export function renameCard(board: Board, cardId: string, title: string): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      title: title.trim() || "Untitled return",
    }),
  );
}

export function updateCardNote(board: Board, cardId: string, note: string): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      note: note.slice(0, 280),
    }),
  );
}

export function updateCardReentryNotes(
  board: Board,
  cardId: string,
  notes: {
    contextSnapshot?: string;
    whyStillOpen?: string;
    waitingOn?: string;
    ifYouReturn?: string;
    nextStepKind?: Card["nextStepKind"];
    nextStep?: string;
  },
): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      contextSnapshot:
        notes.contextSnapshot === undefined
          ? card.contextSnapshot
          : normalizeReentryField(notes.contextSnapshot).slice(0, 360),
      whyStillOpen:
        notes.whyStillOpen === undefined
          ? card.whyStillOpen
          : normalizeReentryField(notes.whyStillOpen).slice(0, 360),
      waitingOn:
        notes.waitingOn === undefined ? card.waitingOn : normalizeReentryField(notes.waitingOn).slice(0, 360),
      ifYouReturn:
        notes.ifYouReturn === undefined
          ? card.ifYouReturn
          : normalizeReentryField(notes.ifYouReturn).slice(0, 360),
      nextStepKind:
        notes.nextStepKind === undefined
          ? card.nextStepKind
          : normalizeNextStepKind(notes.nextStepKind, notes.nextStep ?? card.nextStep),
      nextStep:
        notes.nextStep === undefined ? card.nextStep : normalizeReentryField(notes.nextStep).slice(0, 360),
    }),
  );
}

export function updateCardPromise(
  board: Board,
  cardId: string,
  promise: {
    text?: string;
    to?: string;
    dueOn?: string;
    status?: Card["promiseStatus"];
  },
): Board {
  return updateCard(board, cardId, (card) => {
    const text = promise.text === undefined ? card.promise : normalizeReentryField(promise.text).slice(0, 360);
    return touchCard({
      ...card,
      promise: text,
      promiseTo: promise.to === undefined ? card.promiseTo : normalizeReentryField(promise.to).slice(0, 160),
      promiseDueOn: promise.dueOn === undefined ? card.promiseDueOn : normalizeDateOnly(promise.dueOn),
      promiseStatus: normalizePromiseStatus(promise.status ?? card.promiseStatus, text),
    });
  });
}

export function updateCardOutcome(board: Board, cardId: string, outcome: string): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      outcome: normalizeReentryField(outcome).slice(0, 480),
    }),
  );
}

export function updateCardRichContext(
  board: Board,
  cardId: string,
  richContext: { richLinks?: string[]; imageRefs?: string[]; audioRefs?: string[]; fileRefs?: FileRef[]; bookmarkReason?: string },
): Board {
  return updateCard(board, cardId, (card) => {
    const updated = {
      ...card,
      richLinks: richContext.richLinks === undefined ? card.richLinks : normalizeList(richContext.richLinks),
      imageRefs: richContext.imageRefs === undefined ? card.imageRefs : normalizeList(richContext.imageRefs),
      audioRefs: richContext.audioRefs === undefined ? card.audioRefs : normalizeList(richContext.audioRefs),
      fileRefs: richContext.fileRefs === undefined ? card.fileRefs : normalizeFileRefs(richContext.fileRefs),
      bookmarkReason:
        richContext.bookmarkReason === undefined ? card.bookmarkReason : richContext.bookmarkReason.slice(0, 360),
    };
    const identities = collectEvidenceIdentities(updated);
    return touchCard({
      ...updated,
      evidenceMeta: card.evidenceMeta.filter((meta) => identities.has(meta.id)),
    });
  });
}

export function updateCardEvidenceRole(
  board: Board,
  cardId: string,
  evidence: { id: string; kind: EvidenceKind; role: EvidenceRole },
): Board {
  return updateCard(board, cardId, (card) => {
    const identities = collectEvidenceIdentities(card);
    if (!identities.has(evidence.id) || !evidence.id.startsWith(`${evidence.kind}-`) || !isEvidenceRole(evidence.role)) {
      return card;
    }

    const retained = card.evidenceMeta.filter((meta) => meta.id !== evidence.id);
    const evidenceMeta = evidence.role === "reference"
      ? retained
      : [...retained, { id: evidence.id, kind: evidence.kind, role: evidence.role }].slice(-32);
    return touchCard({ ...card, evidenceMeta });
  });
}

export function updateCardTags(board: Board, cardId: string, tags: string[]): Board {
  return updateCard(board, cardId, (card) =>
    touchCard({
      ...card,
      tags: normalizeTags(tags),
    }),
  );
}

export function moveCard(
  board: Board,
  cardId: string,
  state: BoardState,
  confirmations: LifecycleTransitionConfirmation[] = [],
): Board {
  const card = board.cards.find((candidate) => candidate.id === cardId);
  if (!card) {
    return board;
  }
  return applyCardEditDraftAndTransition(board, cardId, createCardEditDraft(card), state, confirmations).board;
}

export function hideCard(board: Board, cardId: string): Board {
  return updateCard(board, cardId, (card) => touchCard({ ...card, hidden: true }));
}

function updateCard(board: Board, cardId: string, updater: (card: Card) => Card): Board {
  return touchBoard({
    ...board,
    cards: board.cards.map((card) => (card.id === cardId ? updater(card) : card)),
  });
}

function touchBoard(board: Board): Board {
  return {
    ...board,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCardEditDraft(card: Card, draft: CardEditDraft): Card {
  const promise = normalizeReentryField(draft.promise).slice(0, 360);
  const updated = {
    ...card,
    title: draft.title.trim() || "Untitled return",
    note: draft.note.slice(0, 280),
    contextSnapshot: normalizeReentryField(draft.contextSnapshot).slice(0, 360),
    whyStillOpen: normalizeReentryField(draft.whyStillOpen).slice(0, 360),
    waitingOn: normalizeReentryField(draft.waitingOn).slice(0, 360),
    ifYouReturn: normalizeReentryField(draft.ifYouReturn).slice(0, 360),
    nextStepKind: normalizeNextStepKind(draft.nextStepKind, draft.nextStep),
    nextStep: normalizeReentryField(draft.nextStep).slice(0, 360),
    promise,
    promiseTo: normalizeReentryField(draft.promiseTo).slice(0, 160),
    promiseDueOn: normalizeDateOnly(draft.promiseDueOn),
    promiseStatus: normalizePromiseStatus(draft.promiseStatus, promise),
    outcome: normalizeReentryField(draft.outcome).slice(0, 480),
    richLinks: normalizeList(draft.richLinks),
    bookmarkReason: draft.bookmarkReason.slice(0, 360),
    tags: normalizeTags(draft.tags),
  };
  const identities = collectEvidenceIdentities(updated);
  return {
    ...updated,
    evidenceMeta: card.evidenceMeta.filter((meta) => identities.has(meta.id)),
  };
}

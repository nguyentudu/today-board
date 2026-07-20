import type { Card } from "./card";
import type { CardEditDraft } from "./board";
import type { BoardState } from "./state";

export type LifecycleTransitionConfirmation = "FINISH_WITHOUT_OUTCOME" | "LEAVE_ALONE_WITH_OPEN_PROMISE";
export type LifecycleTransitionBlock = "OPEN_PROMISE_BLOCKS_FINISHED";

export interface LifecycleTransitionAssessment {
  currentState: BoardState;
  targetState: BoardState;
  transitionNeeded: boolean;
  allowed: boolean;
  block?: LifecycleTransitionBlock;
  requiredConfirmations: LifecycleTransitionConfirmation[];
  hasOpenPromise: boolean;
  hasOutcome: boolean;
}

export function assessLifecycleTransition(
  card: Card,
  targetState: BoardState,
  draft?: CardEditDraft,
): LifecycleTransitionAssessment {
  const promise = (draft?.promise ?? card.promise).trim();
  const promiseStatus = draft?.promiseStatus ?? card.promiseStatus;
  const hasOpenPromise = Boolean(promise) && promiseStatus !== "kept" && promiseStatus !== "released";
  const hasOutcome = Boolean((draft?.outcome ?? card.outcome).trim());
  const requiredConfirmations: LifecycleTransitionConfirmation[] = [];
  let block: LifecycleTransitionBlock | undefined;

  if (targetState === "finished" && hasOpenPromise) {
    block = "OPEN_PROMISE_BLOCKS_FINISHED";
  } else if (targetState === "finished" && !hasOutcome) {
    requiredConfirmations.push("FINISH_WITHOUT_OUTCOME");
  }

  if (targetState === "leave-alone" && hasOpenPromise) {
    requiredConfirmations.push("LEAVE_ALONE_WITH_OPEN_PROMISE");
  }

  return {
    currentState: card.state,
    targetState,
    transitionNeeded: card.state !== targetState,
    allowed: block === undefined,
    block,
    requiredConfirmations,
    hasOpenPromise,
    hasOutcome,
  };
}

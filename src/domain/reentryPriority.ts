import type { Card } from "./card";

export type ReentryReadiness = "actionable" | "prepared" | "waiting" | "context-only" | "unprepared" | "excluded";

export interface ReentrySignal {
  readiness: ReentryReadiness;
  score: number;
}

export function getReentrySignal(card: Card): ReentrySignal {
  if (card.hidden || card.state !== "continue") {
    return { readiness: "excluded", score: -1 };
  }

  const hasAction = card.nextStepKind === "action" && Boolean(card.nextStep.trim());
  const hasTrigger = card.nextStepKind === "trigger" && Boolean(card.nextStep.trim());
  const hasReturnPoint = Boolean(card.ifYouReturn.trim());
  const hasReturnEvidence = card.evidenceMeta.some((meta) => meta.role === "return-first");
  const isWaiting = Boolean(card.waitingOn.trim()) || hasTrigger;
  const contextStrength = Number(Boolean(card.contextSnapshot.trim())) + Number(Boolean(card.whyStillOpen.trim()));

  if (hasAction) {
    return {
      readiness: "actionable",
      score: 400 + Number(hasReturnPoint) * 20 + Number(hasReturnEvidence) * 20 + contextStrength,
    };
  }

  if (isWaiting) {
    return {
      readiness: "waiting",
      score: 200 + Number(hasReturnPoint) * 20 + Number(hasReturnEvidence) * 20 + Number(hasTrigger) * 10 + contextStrength,
    };
  }

  if (hasReturnPoint || hasReturnEvidence) {
    return {
      readiness: "prepared",
      score: 300 + Number(hasReturnPoint) * 20 + Number(hasReturnEvidence) * 20 + contextStrength,
    };
  }

  if (contextStrength > 0) {
    return { readiness: "context-only", score: 100 + contextStrength };
  }

  return { readiness: "unprepared", score: 0 };
}

export function compareReentryPriority(left: Card, right: Card): number {
  const scoreDifference = getReentrySignal(right).score - getReentrySignal(left).score;
  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const touchedDifference = safeTimestamp(right.updatedAt) - safeTimestamp(left.updatedAt);
  if (touchedDifference !== 0) {
    return touchedDifference;
  }

  return left.id.localeCompare(right.id);
}

function safeTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

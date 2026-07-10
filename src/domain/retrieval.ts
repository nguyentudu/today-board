import type { Card } from "./card";
import type { BoardState } from "./state";

export type MediaFilter = "image" | "voice" | "file" | "link";
export type LastTouchedFilter = "any" | "today" | "last7" | "last30" | "older30";

export interface RetrievalQuery {
  search: string;
  states: BoardState[];
  media: MediaFilter[];
  lastTouched: LastTouchedFilter;
  tags: string[];
}

export function createDefaultRetrievalQuery(states: BoardState[]): RetrievalQuery {
  return {
    search: "",
    states,
    media: [],
    lastTouched: "any",
    tags: [],
  };
}

export function isRetrievalActive(query: RetrievalQuery, allStates: BoardState[]): boolean {
  return (
    query.search.trim().length > 0 ||
    query.media.length > 0 ||
    query.lastTouched !== "any" ||
    query.tags.length > 0 ||
    query.states.length !== allStates.length
  );
}

export function filterCards(cards: Card[], query: RetrievalQuery, allStates: BoardState[], now = new Date()): Card[] {
  const terms = normalizeSearchText(query.search).split(/\s+/).filter(Boolean);
  const stateSet = new Set(query.states.length === 0 ? [] : query.states);
  const tagSet = new Set(query.tags);
  const active = isRetrievalActive(query, allStates);

  if (!active) {
    return cards;
  }

  return cards.filter((card) => {
    if (card.hidden) {
      return false;
    }

    if (!stateSet.has(card.state)) {
      return false;
    }

    if (terms.length > 0) {
      const haystack = buildSearchText(card);
      if (!terms.every((term) => haystack.includes(term))) {
        return false;
      }
    }

    if (!query.media.every((media) => hasMedia(card, media))) {
      return false;
    }

    if (!matchesLastTouched(card, query.lastTouched, now)) {
      return false;
    }

    if (![...tagSet].every((tag) => card.tags.includes(tag))) {
      return false;
    }

    return true;
  });
}

export function buildSearchText(card: Card): string {
  return normalizeSearchText(
    [
      card.title,
      card.note,
      card.contextSnapshot,
      card.whyStillOpen,
      card.ifYouReturn,
      card.bookmarkReason,
      ...card.richLinks.filter(isReadableLink),
      ...card.fileRefs.map((file) => file.name),
      ...card.tags,
      ...card.tags.map((tag) => `#${tag}`),
    ].join(" "),
  );
}

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .normalize("NFC");
}

export function normalizeTagInput(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map((tag) =>
      tag
        .trim()
        .replace(/^#+/, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_-]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 32),
    )
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .slice(0, 8);
}

export function collectTags(cards: Card[]): string[] {
  return [...new Set(cards.flatMap((card) => card.tags))].sort((left, right) => left.localeCompare(right));
}

export function hasMedia(card: Card, media: MediaFilter): boolean {
  switch (media) {
    case "image":
      return card.imageRefs.some((ref) => ref.trim().length > 0);
    case "voice":
      return card.audioRefs.some((ref) => ref.trim().length > 0);
    case "file":
      return card.fileRefs.some((file) => file.name.trim().length > 0);
    case "link":
      return card.richLinks.some(isReadableLink);
  }
}

export function matchesLastTouched(card: Card, filter: LastTouchedFilter, now = new Date()): boolean {
  if (filter === "any") {
    return true;
  }

  let touched = new Date(card.updatedAt || card.createdAt);

  if (Number.isNaN(touched.getTime())) {
    touched = new Date(card.createdAt);
  }

  if (Number.isNaN(touched.getTime())) {
    return false;
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ageMs = now.getTime() - touched.getTime();
  const dayMs = 86_400_000;

  if (filter === "today") {
    return touched.getTime() >= startOfToday;
  }

  if (filter === "last7") {
    return ageMs <= 7 * dayMs;
  }

  if (filter === "last30") {
    return ageMs <= 30 * dayMs;
  }

  return ageMs > 30 * dayMs;
}

function isReadableLink(value: string): boolean {
  const trimmed = value.trim();
  return Boolean(trimmed) && !trimmed.startsWith("data:") && !trimmed.startsWith("blob:");
}

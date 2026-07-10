import type { Board } from "../domain/board";
import type { Card, FileRef } from "../domain/card";

export interface StorageDiagnostics {
  boardBytes: number;
  imageBytes: number;
  audioBytes: number;
  fileBytes: number;
  imageCount: number;
  audioCount: number;
  fileCount: number;
  cardSizes: Array<{ id: string; title: string; bytes: number }>;
}

export function getStorageDiagnostics(board: Board): StorageDiagnostics {
  return {
    boardBytes: estimateJsonBytes(board),
    imageBytes: sumStringBytes(board.cards.flatMap((card) => card.imageRefs)),
    audioBytes: sumStringBytes(board.cards.flatMap((card) => card.audioRefs)),
    fileBytes: sumFileBytes(board.cards.flatMap((card) => card.fileRefs)),
    imageCount: board.cards.reduce((total, card) => total + card.imageRefs.length, 0),
    audioCount: board.cards.reduce((total, card) => total + card.audioRefs.length, 0),
    fileCount: board.cards.reduce((total, card) => total + card.fileRefs.length, 0),
    cardSizes: board.cards.map((card) => ({
      id: card.id,
      title: card.title,
      bytes: estimateJsonBytes(card),
    })),
  };
}

export function cleanupHiddenCardMedia(board: Board): Board {
  return {
    ...board,
    cards: board.cards.map((card) =>
      card.hidden
        ? {
            ...card,
            imageRefs: [],
            audioRefs: [],
            fileRefs: [],
          }
        : card,
    ),
    updatedAt: new Date().toISOString(),
  };
}

function estimateJsonBytes(value: unknown): number {
  return new Blob([JSON.stringify(value)]).size;
}

function sumStringBytes(values: string[]): number {
  return values.reduce((total, value) => total + new Blob([value]).size, 0);
}

function sumFileBytes(values: FileRef[]): number {
  return values.reduce((total, value) => total + new Blob([JSON.stringify(value)]).size, 0);
}

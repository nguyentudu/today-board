import type { Board } from "../domain/board";

const DATABASE_NAME = "moon-today-board";
const DATABASE_VERSION = 1;
const BOARD_STORE = "boards";
const META_STORE = "metadata";
const MEDIA_STORE = "media";

export interface MigrationCommitStore {
  readBoard(): Promise<Board | null>;
  readMigrationDigest(): Promise<string | null>;
  commitMigratedBoard(board: Board, sourceDigest: string): Promise<void>;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result), { once: true });
    request.addEventListener("error", () => reject(request.error ?? new Error("IndexedDB request failed")), { once: true });
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve(), { once: true });
    transaction.addEventListener("abort", () => reject(transaction.error ?? new Error("IndexedDB transaction aborted")), { once: true });
    transaction.addEventListener("error", () => reject(transaction.error ?? new Error("IndexedDB transaction failed")), { once: true });
  });
}

export class IndexedDbBoardStore implements MigrationCommitStore {
  readonly #database: Promise<IDBDatabase>;

  constructor(factory: IDBFactory = indexedDB) {
    this.#database = new Promise((resolve, reject) => {
      const request = factory.open(DATABASE_NAME, DATABASE_VERSION);
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(BOARD_STORE)) request.result.createObjectStore(BOARD_STORE);
        if (!request.result.objectStoreNames.contains(META_STORE)) request.result.createObjectStore(META_STORE);
        if (!request.result.objectStoreNames.contains(MEDIA_STORE)) request.result.createObjectStore(MEDIA_STORE);
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error ?? new Error("Unable to open IndexedDB")), { once: true });
    });
  }

  async readBoard(): Promise<Board | null> {
    const database = await this.#database;
    const result = await requestResult(database.transaction(BOARD_STORE).objectStore(BOARD_STORE).get("current"));
    return (result as Board | undefined) ?? null;
  }

  async readMigrationDigest(): Promise<string | null> {
    const database = await this.#database;
    const result = await requestResult(database.transaction(META_STORE).objectStore(META_STORE).get("v1-source-digest"));
    return typeof result === "string" ? result : null;
  }

  async commitMigratedBoard(board: Board, sourceDigest: string): Promise<void> {
    const database = await this.#database;
    const transaction = database.transaction([BOARD_STORE, META_STORE], "readwrite");
    transaction.objectStore(BOARD_STORE).put(structuredClone(board), "current");
    transaction.objectStore(META_STORE).put(sourceDigest, "v1-source-digest");
    await transactionDone(transaction);
  }

  async saveBoard(board: Board): Promise<void> {
    const database = await this.#database;
    const transaction = database.transaction(BOARD_STORE, "readwrite");
    transaction.objectStore(BOARD_STORE).put(structuredClone(board), "current");
    await transactionDone(transaction);
  }
}

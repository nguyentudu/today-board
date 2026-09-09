const MEDIA_DATABASE = "moon-today-board";
const MEDIA_DATABASE_VERSION = 1;
const MEDIA_STORE = "media";
const BOARD_STORE = "boards";
const META_STORE = "metadata";

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve(), { once: true });
    transaction.addEventListener("abort", () => reject(transaction.error ?? new Error("Media transaction aborted")), { once: true });
    transaction.addEventListener("error", () => reject(transaction.error ?? new Error("Media transaction failed")), { once: true });
  });
}

export class IndexedDbMediaStore {
  readonly #database: Promise<IDBDatabase>;

  constructor(factory: IDBFactory = indexedDB) {
    this.#database = new Promise((resolve, reject) => {
      const request = factory.open(MEDIA_DATABASE, MEDIA_DATABASE_VERSION);
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(MEDIA_STORE)) request.result.createObjectStore(MEDIA_STORE);
        if (!request.result.objectStoreNames.contains(BOARD_STORE)) request.result.createObjectStore(BOARD_STORE);
        if (!request.result.objectStoreNames.contains(META_STORE)) request.result.createObjectStore(META_STORE);
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error ?? new Error("Unable to open media store")), { once: true });
    });
  }

  async put(id: string, value: Blob): Promise<void> {
    const database = await this.#database;
    const transaction = database.transaction(MEDIA_STORE, "readwrite");
    transaction.objectStore(MEDIA_STORE).put(value, id);
    await transactionDone(transaction);
  }

  async get(id: string): Promise<Blob | null> {
    const database = await this.#database;
    const request = database.transaction(MEDIA_STORE).objectStore(MEDIA_STORE).get(id);
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve((request.result as Blob | undefined) ?? null), { once: true });
      request.addEventListener("error", () => reject(request.error ?? new Error("Unable to read media")), { once: true });
    });
  }

  async delete(id: string): Promise<void> {
    const database = await this.#database;
    const transaction = database.transaction(MEDIA_STORE, "readwrite");
    transaction.objectStore(MEDIA_STORE).delete(id);
    await transactionDone(transaction);
  }
}

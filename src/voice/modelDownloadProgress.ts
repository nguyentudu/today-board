export interface ModelProgressEvent {
  status?: string;
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
}

export interface ModelProgressTotals {
  loaded: number;
  total: number;
  files: number;
}

interface FileProgress {
  loaded: number;
  total: number;
}

export class ModelDownloadProgress {
  private readonly files = new Map<string, FileProgress>();

  update(event: ModelProgressEvent): ModelProgressTotals {
    const file = event.file?.trim();
    if (file) {
      const previous = this.files.get(file) ?? { loaded: 0, total: 0 };
      const loaded = finiteNonNegative(event.loaded, previous.loaded);
      const total = finiteNonNegative(event.total, previous.total);
      this.files.set(file, {
        loaded: Math.max(previous.loaded, loaded),
        total: Math.max(previous.total, total, loaded),
      });
    }
    return this.totals();
  }

  totals(): ModelProgressTotals {
    let loaded = 0;
    let total = 0;
    for (const item of this.files.values()) {
      loaded += item.loaded;
      total += item.total;
    }
    return { loaded, total, files: this.files.size };
  }
}

function finiteNonNegative(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && Number(value) >= 0 ? Number(value) : fallback;
}

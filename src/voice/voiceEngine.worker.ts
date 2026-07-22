/// <reference lib="webworker" />

import { env, ModelRegistry, pipeline } from "@huggingface/transformers";
import { ModelDownloadProgress } from "./modelDownloadProgress";
import {
  VOICE_ENGINE_CACHE_KEY,
  VOICE_ENGINE_MAX_NEW_TOKENS,
  VOICE_ENGINE_MODEL,
  type VoiceEngineBackend,
  type VoiceEngineMetrics,
  type VoiceEngineRequest,
  type VoiceEngineResponse,
} from "./voiceEngineProtocol";

declare const self: DedicatedWorkerGlobalScope;

type Transcriber = Awaited<ReturnType<typeof pipeline<"automatic-speech-recognition">>>;

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.useWasmCache = true;
env.cacheKey = VOICE_ENGINE_CACHE_KEY;

let transcriber: Transcriber | undefined;
let loadedBackend: VoiceEngineBackend | undefined;

self.addEventListener("message", (event: MessageEvent<VoiceEngineRequest>) => {
  void handleRequest(event.data);
});

async function handleRequest(request: VoiceEngineRequest): Promise<void> {
  try {
    switch (request.type) {
      case "install":
        await install(request.id, request.preferWebGpu);
        return;
      case "prepare":
        await prepare(request.id, request.backend);
        return;
      case "verify":
        await verify(request.id, request.backend);
        return;
      case "transcribe":
        await transcribe(request.id, request.audio, request.audioDurationMs);
        return;
      case "remove":
        await remove(request.id);
        return;
      case "dispose":
        await disposePipeline();
        post({ id: request.id, type: "disposed" });
    }
  } catch (error) {
    post({
      id: request.id,
      type: "error",
      phase: request.type,
      message: errorMessage(error),
      recoverable: true,
    });
  }
}

async function install(id: number, preferWebGpu: boolean): Promise<void> {
  const startedAt = performance.now();
  const progressStart = performance.now();
  const progressLedger = new ModelDownloadProgress();
  const progress = (event: unknown) => {
    const info = event as { status?: string; loaded?: number; total?: number; file?: string };
    if (info.status !== "progress_total" && info.status !== "progress") {
      return;
    }
    const totals = progressLedger.update(info);
    post({
      id,
      type: "progress",
      loaded: totals.loaded,
      total: totals.total || expectedBytes(preferWebGpu ? "webgpu" : "wasm"),
      files: totals.files,
      file: info.file,
    });
  };

  let backend: VoiceEngineBackend = preferWebGpu ? "webgpu" : "wasm";
  try {
    await loadPipeline(backend, false, progress);
  } catch (error) {
    if (backend !== "webgpu") {
      throw error;
    }
    await disposePipeline();
    post({ id, type: "fallback", from: "webgpu", to: "wasm", reason: errorMessage(error) });
    backend = "wasm";
    await loadPipeline(backend, false, progress);
  }

  const completedAt = performance.now();
  post({
    id,
    type: "installed",
    backend,
    metrics: {
      backend,
      modelDownloadBytes: progressLedger.totals().loaded,
      modelDownloadDurationMs: completedAt - progressStart,
      coldLoadDurationMs: completedAt - startedAt,
    },
  });
}

async function verify(id: number, backend: VoiceEngineBackend): Promise<void> {
  await disposePipeline();
  const cacheStatus = await ModelRegistry.is_pipeline_cached_files(
    VOICE_ENGINE_MODEL.task,
    VOICE_ENGINE_MODEL.id,
    modelConfig(backend, true),
  );
  if (!cacheStatus.allCached || cacheStatus.files.length === 0) {
    throw new Error("MODEL_CACHE_INCOMPLETE");
  }
  await loadPipeline(backend, true);
  await disposePipeline();
  post({ id, type: "verified", backend, cachedFiles: cacheStatus.files.length });
}

async function prepare(id: number, backend: VoiceEngineBackend): Promise<void> {
  const startedAt = performance.now();
  const wasLoaded = Boolean(transcriber && loadedBackend === backend);
  await loadPipeline(backend, true);
  const duration = performance.now() - startedAt;
  const metrics: VoiceEngineMetrics = { backend };
  if (wasLoaded) {
    metrics.warmLoadDurationMs = duration;
  } else {
    metrics.coldLoadDurationMs = duration;
  }
  post({ id, type: "prepared", backend, metrics });
}

async function transcribe(id: number, audio: Float32Array, audioDurationMs: number): Promise<void> {
  if (!transcriber || !loadedBackend) {
    throw new Error("MODEL_NOT_PREPARED");
  }
  if (audio.length === 0 || audioDurationMs <= 0 || audioDurationMs > 15_100) {
    throw new Error("AUDIO_DURATION_INVALID");
  }

  const startedAt = performance.now();
  const result = await transcriber(audio, {
    language: VOICE_ENGINE_MODEL.language,
    task: "transcribe",
    max_new_tokens: VOICE_ENGINE_MAX_NEW_TOKENS,
    return_timestamps: false,
  });
  const transcriptionDurationMs = performance.now() - startedAt;
  const transcript = extractTranscript(result);
  if (!transcript) {
    throw new Error("EMPTY_TRANSCRIPT");
  }
  post({
    id,
    type: "transcribed",
    transcript,
    metrics: {
      backend: loadedBackend,
      audioDurationMs,
      transcriptionDurationMs,
      realTimeFactor: transcriptionDurationMs / audioDurationMs,
    },
  });
}

async function remove(id: number): Promise<void> {
  await disposePipeline();
  const result = await clearExactBrowserCacheEntries();
  post({
    id,
    type: "removed",
    deletedFiles: result.deletedFiles,
    removedBytes: result.byteCountAvailable ? result.removedBytes : undefined,
  });
}

async function clearExactBrowserCacheEntries(): Promise<{
  deletedFiles: number;
  removedBytes: number;
  byteCountAvailable: boolean;
}> {
  if (typeof caches === "undefined") {
    return { deletedFiles: 0, removedBytes: 0, byteCountAvailable: false };
  }
  let deletedFiles = 0;
  let removedBytes = 0;
  let byteCountAvailable = true;
  for (const cacheName of [VOICE_ENGINE_CACHE_KEY, "transformers-cache"]) {
    if (!(await caches.has(cacheName))) {
      continue;
    }
    const cache = await caches.open(cacheName);
    for (const request of await cache.keys()) {
      if (!isExactPinnedModelRequest(request.url)) {
        continue;
      }
      const response = await cache.match(request);
      const contentLength = Number(response?.headers.get("content-length"));
      if (Number.isFinite(contentLength) && contentLength >= 0) {
        removedBytes += contentLength;
      } else {
        byteCountAvailable = false;
      }
      if (await cache.delete(request)) {
        deletedFiles += 1;
      }
    }
    if ((await cache.keys()).length === 0 && cacheName === VOICE_ENGINE_CACHE_KEY) {
      await caches.delete(cacheName);
    }
  }
  return { deletedFiles, removedBytes, byteCountAvailable };
}

function isExactPinnedModelRequest(url: string): boolean {
  const modelPath = VOICE_ENGINE_MODEL.id.split("/").map(encodeURIComponent).join("/");
  const revision = encodeURIComponent(VOICE_ENGINE_MODEL.revision);
  const pathname = new URL(url).pathname;
  return pathname.includes(`/${modelPath}/resolve/${revision}/`);
}

async function loadPipeline(
  backend: VoiceEngineBackend,
  localFilesOnly: boolean,
  progressCallback?: (event: unknown) => void,
): Promise<void> {
  if (transcriber && loadedBackend === backend) {
    return;
  }
  await disposePipeline();
  transcriber = await pipeline(
    VOICE_ENGINE_MODEL.task,
    VOICE_ENGINE_MODEL.id,
    {
      ...modelConfig(backend, localFilesOnly),
      progress_callback: progressCallback,
    },
  );
  loadedBackend = backend;
}

function modelConfig(backend: VoiceEngineBackend, localFilesOnly: boolean) {
  const variant = VOICE_ENGINE_MODEL[backend];
  return {
    revision: VOICE_ENGINE_MODEL.revision,
    device: variant.device,
    dtype: variant.dtype,
    local_files_only: localFilesOnly,
  } as const;
}

async function disposePipeline(): Promise<void> {
  if (transcriber && "dispose" in transcriber && typeof transcriber.dispose === "function") {
    await transcriber.dispose();
  }
  transcriber = undefined;
  loadedBackend = undefined;
}

function extractTranscript(result: unknown): string {
  if (!result || typeof result !== "object") {
    return "";
  }
  if ("text" in result && typeof result.text === "string") {
    return result.text.trim();
  }
  if (Array.isArray(result)) {
    return result
      .map((item) => (item && typeof item === "object" && "text" in item && typeof item.text === "string" ? item.text : ""))
      .join(" ")
      .trim();
  }
  return "";
}

function expectedBytes(backend: VoiceEngineBackend): number {
  return VOICE_ENGINE_MODEL[backend].expectedBytes;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function post(response: VoiceEngineResponse): void {
  self.postMessage(response);
}

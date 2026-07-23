/// <reference lib="webworker" />

import { env, ModelRegistry, pipeline } from "@huggingface/transformers";
import { ModelDownloadProgress } from "./modelDownloadProgress";
import { prepareVoiceQualityAudio } from "./voiceQualityAudio";
import {
  VOICE_QUALITY_CANDIDATES,
  type VoiceQualityCandidate,
  type VoiceQualityCandidateId,
  type VoiceQualityMetrics,
  type VoiceQualityRequest,
  type VoiceQualityResponse,
} from "./voiceQualityProtocol";

declare const self: DedicatedWorkerGlobalScope;

type Transcriber = Awaited<ReturnType<typeof pipeline<"automatic-speech-recognition">>>;

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.useWasmCache = true;

let transcriber: Transcriber | undefined;
let loadedCandidateId: VoiceQualityCandidateId | undefined;

self.addEventListener("message", (event: MessageEvent<VoiceQualityRequest>) => {
  void handleRequest(event.data);
});

async function handleRequest(request: VoiceQualityRequest): Promise<void> {
  try {
    switch (request.type) {
      case "install":
        await install(request.id, candidate(request.candidateId));
        return;
      case "verify":
        await verify(request.id, candidate(request.candidateId));
        return;
      case "prepare":
        await prepare(request.id, candidate(request.candidateId));
        return;
      case "transcribe":
        await transcribe(
          request.id,
          candidate(request.candidateId),
          request.audio,
          request.audioDurationMs,
        );
        return;
      case "remove":
        await remove(request.id, candidate(request.candidateId));
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
      message: error instanceof Error ? error.message : String(error),
      recoverable: true,
    });
  }
}

async function install(id: number, selected: VoiceQualityCandidate): Promise<void> {
  const startedAt = performance.now();
  const ledger = new ModelDownloadProgress();
  await loadPipeline(selected, false, (event: unknown) => {
    const info = event as { status?: string; loaded?: number; total?: number; file?: string };
    if (info.status !== "progress_total" && info.status !== "progress") {
      return;
    }
    const totals = ledger.update(info);
    post({
      id,
      type: "progress",
      loaded: totals.loaded,
      total: totals.total || selected.expectedBytes,
      files: totals.files,
      file: info.file,
    });
  });
  const duration = performance.now() - startedAt;
  post({
    id,
    type: "installed",
    candidateId: selected.id,
    metrics: {
      backend: "wasm",
      modelBytes: ledger.totals().loaded,
      downloadDurationMs: duration,
      loadDurationMs: duration,
      coldLoadDurationMs: duration,
      runKind: "cold",
    },
  });
}

async function verify(id: number, selected: VoiceQualityCandidate): Promise<void> {
  await disposePipeline();
  configureCache(selected);
  const cacheStatus = await ModelRegistry.is_pipeline_cached_files(
    "automatic-speech-recognition",
    selected.modelId,
    modelConfig(selected, true),
  );
  if (!cacheStatus.allCached || cacheStatus.files.length === 0) {
    throw new Error("MODEL_CACHE_INCOMPLETE");
  }
  await loadPipeline(selected, true);
  await disposePipeline();
  post({ id, type: "verified", candidateId: selected.id, cachedFiles: cacheStatus.files.length });
}

async function prepare(id: number, selected: VoiceQualityCandidate): Promise<void> {
  const wasLoaded = loadedCandidateId === selected.id && Boolean(transcriber);
  const startedAt = performance.now();
  await loadPipeline(selected, true);
  const metrics: VoiceQualityMetrics = {
    backend: "wasm",
    loadDurationMs: performance.now() - startedAt,
    runKind: wasLoaded ? "warm" : "cold",
  };
  if (wasLoaded) {
    metrics.warmLoadDurationMs = metrics.loadDurationMs;
  } else {
    metrics.coldLoadDurationMs = metrics.loadDurationMs;
  }
  post({ id, type: "prepared", candidateId: selected.id, metrics });
}

async function transcribe(
  id: number,
  selected: VoiceQualityCandidate,
  audio: Float32Array,
  audioDurationMs: number,
): Promise<void> {
  if (!transcriber || loadedCandidateId !== selected.id) {
    throw new Error("MODEL_NOT_PREPARED");
  }
  if (audio.length === 0 || audioDurationMs <= 0 || audioDurationMs > 15_100) {
    throw new Error("AUDIO_DURATION_INVALID");
  }
  const preparedAudio = prepareVoiceQualityAudio(audio, selected.audioMode);
  if (preparedAudio.length === 0) {
    throw new Error("AUDIO_EMPTY_AFTER_PREPARATION");
  }
  const startedAt = performance.now();
  const result = await transcriber(preparedAudio, decodingOptions(selected));
  const transcriptionDurationMs = performance.now() - startedAt;
  const transcript = extractTranscript(result);
  if (!transcript) {
    throw new Error("EMPTY_TRANSCRIPT");
  }
  post({
    id,
    type: "transcribed",
    candidateId: selected.id,
    transcript,
    metrics: {
      backend: "wasm",
      audioDurationMs,
      transcriptionDurationMs,
      realTimeFactor: transcriptionDurationMs / audioDurationMs,
    },
  });
}

async function remove(id: number, selected: VoiceQualityCandidate): Promise<void> {
  await disposePipeline();
  let deletedFiles = 0;
  let removedBytes = 0;
  let byteCountAvailable = true;
  if (typeof caches !== "undefined" && await caches.has(selected.cacheKey)) {
    const cache = await caches.open(selected.cacheKey);
    for (const request of await cache.keys()) {
      if (!isExactPinnedModelRequest(request.url, selected)) {
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
    if ((await cache.keys()).length === 0) {
      await caches.delete(selected.cacheKey);
    }
  }
  post({
    id,
    type: "removed",
    candidateId: selected.id,
    deletedFiles,
    removedBytes: byteCountAvailable ? removedBytes : undefined,
  });
}

async function loadPipeline(
  selected: VoiceQualityCandidate,
  cacheOnly: boolean,
  progressCallback?: (event: unknown) => void,
): Promise<void> {
  if (transcriber && loadedCandidateId === selected.id) {
    return;
  }
  await disposePipeline();
  configureCache(selected);
  const create = () => pipeline(
    "automatic-speech-recognition",
    selected.modelId,
    {
      ...modelConfig(selected, cacheOnly),
      progress_callback: progressCallback,
    },
  );
  transcriber = cacheOnly ? await withRemoteNetworkBlocked(create) : await create();
  loadedCandidateId = selected.id;
}

function configureCache(selected: VoiceQualityCandidate): void {
  env.cacheKey = selected.cacheKey;
}

function modelConfig(selected: VoiceQualityCandidate, localFilesOnly: boolean) {
  return {
    revision: selected.revision,
    device: "wasm" as const,
    dtype: selected.dtype,
    local_files_only: localFilesOnly,
    session_options: { graphOptimizationLevel: selected.graphOptimizationLevel },
  };
}

function decodingOptions(selected: VoiceQualityCandidate) {
  const shared = {
    language: "vi",
    task: "transcribe" as const,
    max_new_tokens: 96,
    return_timestamps: false,
  };
  return selected.deterministicDecoding
    ? { ...shared, do_sample: false, num_beams: 1, temperature: 0 }
    : shared;
}

async function withRemoteNetworkBlocked<T>(action: () => Promise<T>): Promise<T> {
  const originalFetch = self.fetch.bind(self);
  self.fetch = async (input, init) => {
    const raw = input instanceof Request ? input.url : input instanceof URL ? input.href : String(input);
    const url = new URL(raw, self.location.href);
    if (url.origin !== self.location.origin) {
      throw new Error(`OFFLINE_VERIFICATION_BLOCKED_REMOTE_REQUEST:${url.origin}${url.pathname}`);
    }
    return originalFetch(input, init);
  };
  try {
    return await action();
  } finally {
    self.fetch = originalFetch;
  }
}

function isExactPinnedModelRequest(url: string, selected: VoiceQualityCandidate): boolean {
  const modelPath = selected.modelId.split("/").map(encodeURIComponent).join("/");
  return new URL(url).pathname.includes(`/${modelPath}/resolve/${encodeURIComponent(selected.revision)}/`);
}

async function disposePipeline(): Promise<void> {
  if (transcriber && "dispose" in transcriber && typeof transcriber.dispose === "function") {
    await transcriber.dispose();
  }
  transcriber = undefined;
  loadedCandidateId = undefined;
}

function candidate(id: VoiceQualityCandidateId): VoiceQualityCandidate {
  return VOICE_QUALITY_CANDIDATES[id];
}

function extractTranscript(result: unknown): string {
  if (result && typeof result === "object" && "text" in result && typeof result.text === "string") {
    return result.text.trim();
  }
  if (Array.isArray(result)) {
    return result
      .map((item) => item && typeof item === "object" && "text" in item && typeof item.text === "string" ? item.text : "")
      .join(" ")
      .trim();
  }
  return "";
}

function post(response: VoiceQualityResponse): void {
  self.postMessage(response);
}

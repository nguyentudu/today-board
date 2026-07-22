/// <reference lib="webworker" />

import { env, ModelRegistry, pipeline } from "@huggingface/transformers";
import {
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
  let downloadedBytes = 0;
  const progress = (event: unknown) => {
    const info = event as { status?: string; loaded?: number; total?: number; file?: string };
    if (info.status !== "progress_total" && info.status !== "progress") {
      return;
    }
    downloadedBytes = Math.max(downloadedBytes, Number(info.loaded) || 0);
    post({
      id,
      type: "progress",
      loaded: Number(info.loaded) || 0,
      total: Number(info.total) || expectedBytes(preferWebGpu ? "webgpu" : "wasm"),
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
      modelDownloadBytes: downloadedBytes,
      modelDownloadDurationMs: completedAt - progressStart,
      coldLoadDurationMs: completedAt - startedAt,
    },
  });
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
  let deletedFiles = 0;
  for (const backend of ["webgpu", "wasm"] as const) {
    const config = modelConfig(backend, false);
    const result = await ModelRegistry.clear_pipeline_cache(
      VOICE_ENGINE_MODEL.task,
      VOICE_ENGINE_MODEL.id,
      config,
    );
    deletedFiles += result.filesDeleted;
  }
  post({ id, type: "removed", deletedFiles });
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

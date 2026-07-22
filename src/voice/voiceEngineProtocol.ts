export const VOICE_ENGINE_MODEL = {
  id: "onnx-community/whisper-tiny",
  revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
  license: "Apache-2.0",
  language: "vi",
  languageLabel: "Vietnamese",
  task: "automatic-speech-recognition",
  transformersVersion: "4.2.0",
  webgpu: {
    device: "webgpu",
    dtype: "fp16",
    expectedBytes: 78_882_591,
  },
  wasm: {
    device: "wasm",
    dtype: "q8",
    expectedBytes: 43_613_734,
  },
} as const;

export const VOICE_ENGINE_MAX_AUDIO_SECONDS = 15;
export const VOICE_ENGINE_SAMPLE_RATE = 16_000;
export const VOICE_ENGINE_MAX_NEW_TOKENS = 96;

export type VoiceEngineBackend = "webgpu" | "wasm";

export interface VoiceEngineMetrics {
  backend?: VoiceEngineBackend;
  modelDownloadBytes?: number;
  modelDownloadDurationMs?: number;
  coldLoadDurationMs?: number;
  warmLoadDurationMs?: number;
  audioDurationMs?: number;
  transcriptionDurationMs?: number;
  realTimeFactor?: number;
}

export type VoiceEngineRequest =
  | { id: number; type: "install"; preferWebGpu: boolean }
  | { id: number; type: "prepare"; backend: VoiceEngineBackend }
  | { id: number; type: "transcribe"; audio: Float32Array; audioDurationMs: number }
  | { id: number; type: "remove" }
  | { id: number; type: "dispose" };

export type VoiceEngineResponse =
  | { id: number; type: "progress"; loaded: number; total: number; file?: string }
  | { id: number; type: "fallback"; from: "webgpu"; to: "wasm"; reason: string }
  | { id: number; type: "installed"; backend: VoiceEngineBackend; metrics: VoiceEngineMetrics }
  | { id: number; type: "prepared"; backend: VoiceEngineBackend; metrics: VoiceEngineMetrics }
  | { id: number; type: "transcribed"; transcript: string; metrics: VoiceEngineMetrics }
  | { id: number; type: "removed"; deletedFiles: number }
  | { id: number; type: "disposed" }
  | {
      id: number;
      type: "error";
      phase: "install" | "prepare" | "transcribe" | "remove" | "dispose";
      message: string;
      recoverable: boolean;
    };

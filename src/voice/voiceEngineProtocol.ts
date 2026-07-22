export const VOICE_ENGINE_MODEL = {
  id: "onnx-community/whisper-tiny",
  revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
  license: "Apache-2.0",
  language: "vi",
  languageLabel: "Vietnamese",
  task: "automatic-speech-recognition",
  transformersVersion: "4.2.0",
  onnxRuntimeWebVersion: "1.26.0-dev.20260416-b7804b056c",
  configurationIdentity: "whisper-tiny-ff417702-webgpu-fp16-wasm-uint8-no-qdq-v5",
  webgpu: {
    device: "webgpu",
    dtype: "fp16",
    expectedBytes: 78_882_591,
    artifacts: [
      { file: "onnx/encoder_model_fp16.onnx", bytes: 16_519_192 },
      { file: "onnx/decoder_model_merged_fp16.onnx", bytes: 59_593_896 },
    ],
  },
  wasm: {
    device: "wasm",
    dtype: "uint8",
    graphOptimizationLevel: "disabled",
    expectedBytes: 43_613_764,
    artifacts: [
      { file: "onnx/encoder_model_uint8.onnx", bytes: 10_124_990 },
      { file: "onnx/decoder_model_merged_uint8.onnx", bytes: 30_719_271 },
    ],
  },
} as const;

export const VOICE_ENGINE_REJECTED_WASM_CONFIGURATIONS = [
  {
    dtype: "q8",
    graphOptimizationLevel: "all",
    encoder: "onnx/encoder_model_quantized.onnx",
    encoderBytes: 10_124_990,
    decoder: "onnx/decoder_model_merged_quantized.onnx",
    decoderBytes: 30_719_241,
    failure: "TransposedDQWeightsForMatMulNBits missing required scale",
  },
  {
    dtype: "uint8",
    graphOptimizationLevel: "all",
    encoder: "onnx/encoder_model_uint8.onnx",
    encoderBytes: 10_124_990,
    decoder: "onnx/decoder_model_merged_uint8.onnx",
    decoderBytes: 30_719_271,
    failure: "TransposeDQWeightsForMatMulNBits missing required scale",
  },
] as const;

export const VOICE_ENGINE_MAX_AUDIO_SECONDS = 15;
export const VOICE_ENGINE_SAMPLE_RATE = 16_000;
export const VOICE_ENGINE_MAX_NEW_TOKENS = 96;
export const VOICE_ENGINE_CACHE_KEY = "today-board-voice-model-ff4177021cc4-uint8-no-qdq-v5";
export const VOICE_ENGINE_LEGACY_CACHE_KEYS = [
  "today-board-voice-model-ff4177021cc4-uint8-no-qdq-v4",
  "today-board-voice-model-ff4177021cc4-uint8-no-qdq-v3",
  "today-board-voice-model-ff4177021cc4-uint8-v2",
  "today-board-voice-model-ff4177021cc4",
  "transformers-cache",
] as const;

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
  | { id: number; type: "install"; backend: VoiceEngineBackend }
  | { id: number; type: "prepare"; backend: VoiceEngineBackend }
  | { id: number; type: "verify"; backend: VoiceEngineBackend }
  | { id: number; type: "transcribe"; audio: Float32Array; audioDurationMs: number }
  | { id: number; type: "remove" }
  | { id: number; type: "dispose" };

export type VoiceEngineResponse =
  | { id: number; type: "progress"; loaded: number; total: number; files: number; file?: string }
  | { id: number; type: "installed"; backend: VoiceEngineBackend; metrics: VoiceEngineMetrics }
  | { id: number; type: "prepared"; backend: VoiceEngineBackend; metrics: VoiceEngineMetrics }
  | { id: number; type: "verified"; backend: VoiceEngineBackend; cachedFiles: number }
  | { id: number; type: "transcribed"; transcript: string; metrics: VoiceEngineMetrics }
  | { id: number; type: "removed"; deletedFiles: number; removedBytes?: number }
  | { id: number; type: "disposed" }
  | {
      id: number;
      type: "error";
      phase: "install" | "prepare" | "verify" | "transcribe" | "remove" | "dispose";
      message: string;
      recoverable: boolean;
    };

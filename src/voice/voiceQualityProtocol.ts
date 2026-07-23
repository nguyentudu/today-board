export type VoiceQualityCandidateId = "tiny-baseline" | "tiny-improved" | "base-improved";
export type VoiceQualityAudioMode = "baseline" | "normalized-trimmed";
export type VoiceQualityRunKind = "cold" | "warm";

export interface VoiceQualityCandidate {
  id: VoiceQualityCandidateId;
  label: string;
  modelId: string;
  revision: string;
  license: string;
  backend: "wasm";
  dtype: "uint8";
  graphOptimizationLevel: "disabled";
  expectedBytes: number;
  cacheKey: string;
  markerCache: string;
  configurationIdentity: string;
  audioMode: VoiceQualityAudioMode;
  deterministicDecoding: boolean;
  artifacts: ReadonlyArray<{ file: string; bytes: number }>;
}

const TINY_ARTIFACTS = [
  { file: "onnx/encoder_model_uint8.onnx", bytes: 10_124_990 },
  { file: "onnx/decoder_model_merged_uint8.onnx", bytes: 30_719_271 },
] as const;

export const VOICE_QUALITY_CANDIDATES: Readonly<Record<VoiceQualityCandidateId, VoiceQualityCandidate>> = {
  "tiny-baseline": {
    id: "tiny-baseline",
    label: "Whisper Tiny Android baseline",
    modelId: "onnx-community/whisper-tiny",
    revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
    license: "Apache-2.0",
    backend: "wasm",
    dtype: "uint8",
    graphOptimizationLevel: "disabled",
    expectedBytes: 43_613_764,
    cacheKey: "today-board-voice-quality-tiny-baseline-ff417702-uint8-v1",
    markerCache: "today-board-voice-quality-marker-tiny-baseline-v1",
    configurationIdentity: "tiny-ff417702-uint8-no-qdq-baseline-v1",
    audioMode: "baseline",
    deterministicDecoding: false,
    artifacts: TINY_ARTIFACTS,
  },
  "tiny-improved": {
    id: "tiny-improved",
    label: "Whisper Tiny deterministic audio-prepared",
    modelId: "onnx-community/whisper-tiny",
    revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
    license: "Apache-2.0",
    backend: "wasm",
    dtype: "uint8",
    graphOptimizationLevel: "disabled",
    expectedBytes: 43_613_764,
    cacheKey: "today-board-voice-quality-tiny-improved-ff417702-uint8-v1",
    markerCache: "today-board-voice-quality-marker-tiny-improved-v1",
    configurationIdentity: "tiny-ff417702-uint8-no-qdq-deterministic-audio-v1",
    audioMode: "normalized-trimmed",
    deterministicDecoding: true,
    artifacts: TINY_ARTIFACTS,
  },
  "base-improved": {
    id: "base-improved",
    label: "Whisper Base deterministic audio-prepared",
    modelId: "onnx-community/whisper-base",
    revision: "1846881b6b3a3024392c1eea3ad983695bc23925",
    license: "Apache-2.0",
    backend: "wasm",
    dtype: "uint8",
    graphOptimizationLevel: "disabled",
    expectedBytes: 81_294_262,
    cacheKey: "today-board-voice-quality-base-1846881-uint8-v1",
    markerCache: "today-board-voice-quality-marker-base-v1",
    configurationIdentity: "base-1846881-uint8-no-qdq-deterministic-audio-v1",
    audioMode: "normalized-trimmed",
    deterministicDecoding: true,
    artifacts: [
      { file: "onnx/encoder_model_uint8.onnx", bytes: 23_201_314 },
      { file: "onnx/decoder_model_merged_uint8.onnx", bytes: 53_693_343 },
    ],
  },
} as const;

export const VOICE_QUALITY_CANDIDATE_ORDER: readonly VoiceQualityCandidateId[] = [
  "tiny-baseline",
  "tiny-improved",
  "base-improved",
];

export interface VoiceQualityMetrics {
  backend: "wasm";
  modelBytes?: number;
  downloadDurationMs?: number;
  loadDurationMs?: number;
  coldLoadDurationMs?: number;
  warmLoadDurationMs?: number;
  audioDurationMs?: number;
  transcriptionDurationMs?: number;
  realTimeFactor?: number;
  runKind?: VoiceQualityRunKind;
}

export type VoiceQualityRequest =
  | { id: number; type: "install"; candidateId: VoiceQualityCandidateId }
  | { id: number; type: "verify"; candidateId: VoiceQualityCandidateId }
  | { id: number; type: "prepare"; candidateId: VoiceQualityCandidateId }
  | {
      id: number;
      type: "transcribe";
      candidateId: VoiceQualityCandidateId;
      audio: Float32Array;
      audioDurationMs: number;
    }
  | { id: number; type: "remove"; candidateId: VoiceQualityCandidateId }
  | { id: number; type: "dispose" };

export type VoiceQualityResponse =
  | { id: number; type: "progress"; loaded: number; total: number; files: number; file?: string }
  | { id: number; type: "installed"; candidateId: VoiceQualityCandidateId; metrics: VoiceQualityMetrics }
  | { id: number; type: "verified"; candidateId: VoiceQualityCandidateId; cachedFiles: number }
  | { id: number; type: "prepared"; candidateId: VoiceQualityCandidateId; metrics: VoiceQualityMetrics }
  | { id: number; type: "transcribed"; candidateId: VoiceQualityCandidateId; transcript: string; metrics: VoiceQualityMetrics }
  | { id: number; type: "removed"; candidateId: VoiceQualityCandidateId; deletedFiles: number; removedBytes?: number }
  | { id: number; type: "disposed" }
  | {
      id: number;
      type: "error";
      phase: VoiceQualityRequest["type"];
      message: string;
      recoverable: boolean;
    };

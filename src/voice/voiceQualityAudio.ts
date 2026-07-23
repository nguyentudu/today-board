import type { VoiceQualityAudioMode } from "./voiceQualityProtocol";

const SILENCE_THRESHOLD = 0.008;
const TARGET_PEAK = 0.92;
const PADDING_SAMPLES = 1_600;

export function prepareVoiceQualityAudio(input: Float32Array, mode: VoiceQualityAudioMode): Float32Array {
  if (mode === "baseline" || input.length === 0) {
    return input.slice();
  }
  const trimmed = trimSilence(input);
  return normalizeWithoutClipping(trimmed);
}

export function trimSilence(input: Float32Array): Float32Array {
  let first = 0;
  while (first < input.length && Math.abs(input[first]) < SILENCE_THRESHOLD) {
    first += 1;
  }
  if (first === input.length) {
    return new Float32Array();
  }
  let last = input.length - 1;
  while (last > first && Math.abs(input[last]) < SILENCE_THRESHOLD) {
    last -= 1;
  }
  const start = Math.max(0, first - PADDING_SAMPLES);
  const end = Math.min(input.length, last + PADDING_SAMPLES + 1);
  return input.slice(start, end);
}

export function normalizeWithoutClipping(input: Float32Array): Float32Array {
  let peak = 0;
  for (const sample of input) {
    peak = Math.max(peak, Math.abs(sample));
  }
  if (peak === 0) {
    return input.slice();
  }
  const scale = Math.min(TARGET_PEAK / peak, 8);
  const output = new Float32Array(input.length);
  for (let index = 0; index < input.length; index += 1) {
    output[index] = Math.max(-1, Math.min(1, input[index] * scale));
  }
  return output;
}

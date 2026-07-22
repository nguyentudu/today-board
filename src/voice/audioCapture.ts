import { VOICE_ENGINE_MAX_AUDIO_SECONDS, VOICE_ENGINE_SAMPLE_RATE } from "./voiceEngineProtocol";

export interface MemoryAudioCapture {
  stop: () => Promise<Float32Array>;
  cancel: () => Promise<void>;
  durationMs: () => number;
}

export async function startMemoryAudioCapture(onLimitReached: () => void): Promise<MemoryAudioCapture> {
  if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === "undefined") {
    throw new Error("MICROPHONE_UNSUPPORTED");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  const maximumSamples = Math.ceil(context.sampleRate * VOICE_ENGINE_MAX_AUDIO_SECONDS);
  let capturedSamples = 0;
  let stopped = false;
  let limitSignalled = false;

  processor.onaudioprocess = (event) => {
    if (stopped || capturedSamples >= maximumSamples) {
      return;
    }
    const input = event.inputBuffer.getChannelData(0);
    const remaining = maximumSamples - capturedSamples;
    const copy = input.slice(0, Math.min(input.length, remaining));
    chunks.push(copy);
    capturedSamples += copy.length;
    if (capturedSamples >= maximumSamples && !limitSignalled) {
      limitSignalled = true;
      window.setTimeout(onLimitReached, 0);
    }
  };

  source.connect(processor);
  processor.connect(context.destination);

  return {
    stop: async () => {
      const merged = mergeChunks(chunks, capturedSamples);
      await release();
      return resampleLinear(merged, context.sampleRate, VOICE_ENGINE_SAMPLE_RATE);
    },
    cancel: async () => {
      chunks.length = 0;
      capturedSamples = 0;
      await release();
    },
    durationMs: () => Math.min(VOICE_ENGINE_MAX_AUDIO_SECONDS * 1000, (capturedSamples / context.sampleRate) * 1000),
  };

  async function release(): Promise<void> {
    if (stopped) {
      return;
    }
    stopped = true;
    processor.onaudioprocess = null;
    processor.disconnect();
    source.disconnect();
    for (const track of stream.getTracks()) {
      track.stop();
    }
    if (context.state !== "closed") {
      await context.close();
    }
  }
}

function mergeChunks(chunks: Float32Array[], totalLength: number): Float32Array {
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  chunks.length = 0;
  return result;
}

function resampleLinear(input: Float32Array, inputRate: number, outputRate: number): Float32Array {
  if (inputRate === outputRate || input.length === 0) {
    return input;
  }
  const outputLength = Math.max(1, Math.round((input.length * outputRate) / inputRate));
  const output = new Float32Array(outputLength);
  const ratio = inputRate / outputRate;
  for (let index = 0; index < outputLength; index += 1) {
    const position = index * ratio;
    const left = Math.floor(position);
    const right = Math.min(input.length - 1, left + 1);
    const mix = position - left;
    output[index] = input[left] * (1 - mix) + input[right] * mix;
  }
  return output;
}

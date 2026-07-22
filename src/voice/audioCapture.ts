import { VOICE_ENGINE_MAX_AUDIO_SECONDS, VOICE_ENGINE_SAMPLE_RATE } from "./voiceEngineProtocol";

export interface MemoryAudioCapture {
  stop: () => Promise<Float32Array>;
  cancel: () => Promise<void>;
  durationMs: () => number;
}

interface AudioContextLifecycle {
  state: string;
  resume: () => Promise<void>;
  close: () => Promise<void>;
}

interface AudioTrackSource {
  getTracks: () => Array<{ stop: () => void }>;
}

export async function ensureAudioContextRunning(context: AudioContextLifecycle): Promise<void> {
  if (context.state === "suspended") {
    await context.resume();
  }
  if (context.state !== "running") {
    throw new Error("AUDIO_CONTEXT_NOT_RUNNING");
  }
}

export async function releaseAudioResources(stream: AudioTrackSource, context?: AudioContextLifecycle): Promise<void> {
  for (const track of stream.getTracks()) {
    track.stop();
  }
  if (context && context.state !== "closed") {
    await context.close();
  }
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
  let context: AudioContext | undefined;
  let source: MediaStreamAudioSourceNode;
  let processor: ScriptProcessorNode;
  try {
    context = new AudioContext();
    await ensureAudioContextRunning(context);
    source = context.createMediaStreamSource(stream);
    processor = context.createScriptProcessor(4096, 1, 1);
  } catch (error) {
    await releaseAudioResources(stream, context).catch(() => undefined);
    throw error;
  }
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
    await releaseAudioResources(stream, context);
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

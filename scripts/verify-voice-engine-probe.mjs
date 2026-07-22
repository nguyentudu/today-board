import { readFileSync } from "node:fs";

const app = readFileSync("src/app.ts", "utf8");
const probe = readFileSync("src/ui/VoiceEngineProbe.ts", "utf8");
const worker = readFileSync("src/voice/voiceEngine.worker.ts", "utf8");
const capture = readFileSync("src/voice/audioCapture.ts", "utf8");
const protocol = readFileSync("src/voice/voiceEngineProtocol.ts", "utf8");
const originalProbe = readFileSync("src/ui/VoiceCapabilityProbe.ts", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const styles = readFileSync("styles/main.css", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

assert(
  "engine probe is hidden and unloaded by default",
  app.includes('get("voice-engine-probe") === "1"')
    && app.includes('import("./ui/VoiceEngineProbe")')
    && !app.includes('import { VoiceEngineProbe }')
    && app.includes("if (!voiceProbeMode && !voiceEngineProbeMode)"),
);
assert(
  "existing platform capability probe remains available",
  app.includes('get("voice-probe") === "1"')
    && app.includes("VoiceCapabilityProbe")
    && originalProbe.includes("On-device Voice Capability Probe"),
);
assert(
  "model installation is explicit user action only",
  probe.includes('installButton.addEventListener("click"')
    && probe.includes("await request({ type: \"install\"")
    && !app.includes('type: "install"'),
);
assert(
  "model and browser engine identities are pinned",
  protocol.includes('id: "onnx-community/whisper-tiny"')
    && protocol.includes('revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7"')
    && protocol.includes('license: "Apache-2.0"')
    && protocol.includes('transformersVersion: "4.2.0"')
    && pkg.devDependencies["@huggingface/transformers"] === "4.2.0",
);
assert(
  "Vietnamese transcription is fixed and decoding is bounded",
  protocol.includes('language: "vi"')
    && protocol.includes("VOICE_ENGINE_MAX_NEW_TOKENS = 96")
    && worker.includes('language: VOICE_ENGINE_MODEL.language')
    && worker.includes('task: "transcribe"')
    && worker.includes("max_new_tokens: VOICE_ENGINE_MAX_NEW_TOKENS"),
);
assert(
  "no transcription endpoint API key backend analytics or cloud fallback exists",
  !probe.includes("fetch(")
    && !worker.includes("fetch(")
    && !probe.includes("XMLHttpRequest")
    && !worker.includes("XMLHttpRequest")
    && !probe.includes("apiKey")
    && !worker.includes("apiKey")
    && !probe.includes("analytics")
    && !worker.includes("analytics")
    && worker.includes("local_files_only: localFilesOnly"),
);
assert(
  "probe performs no board or Today Board storage mutation",
  !probe.includes("loadBoard")
    && !probe.includes("saveBoard")
    && !probe.includes("trySaveBoard")
    && !probe.includes("localStorage")
    && !worker.includes("loadBoard")
    && !worker.includes("saveBoard"),
);
assert(
  "audio remains memory-only and capped at fifteen seconds",
  capture.includes("Float32Array[]")
    && capture.includes("VOICE_ENGINE_MAX_AUDIO_SECONDS")
    && protocol.includes("VOICE_ENGINE_MAX_AUDIO_SECONDS = 15")
    && !capture.includes("MediaRecorder")
    && !capture.includes("Blob")
    && !capture.includes("dataUrl")
    && probe.includes("[audio.buffer]"),
);
assert(
  "raw audio and fabricated transcripts are discarded on failure",
  probe.includes('transcript = ""')
    && worker.includes('throw new Error("EMPTY_TRANSCRIPT")')
    && worker.includes("extractTranscript(result)")
    && !probe.includes("audioRefs"),
);
assert(
  "worker lifecycle and inference stay off the UI thread",
  probe.includes('new Worker(new URL("../voice/voiceEngine.worker.ts", import.meta.url)')
    && probe.includes("worker.terminate()")
    && worker.includes('self.addEventListener("message"')
    && worker.includes("await transcriber(audio"),
);
assert(
  "microphone resources and PWA busy state are always releasable",
  capture.includes("track.stop()")
    && capture.includes("await context.close()")
    && probe.includes("activeCapture.cancel()")
    && probe.includes('window.addEventListener("pagehide"')
    && probe.includes('window.addEventListener("popstate"')
    && probe.includes('dataset.voiceEngineBusy = "true"')
    && app.includes('dataset.voiceEngineBusy === "true"'),
);
assert(
  "offline use requires the exact installed revision and cache-only preparation",
  probe.includes("MARKER_CACHE")
    && probe.includes("marker.revision === VOICE_ENGINE_MODEL.revision")
    && worker.includes("await loadPipeline(backend, true)")
    && worker.includes("local_files_only: localFilesOnly")
    && probe.includes("modelMissing"),
);
assert(
  "download progress retry and explicit model removal are present",
  worker.includes('type: "progress"')
    && probe.includes("installButton.textContent = text.retry")
    && worker.includes("ModelRegistry.clear_pipeline_cache")
    && probe.includes("await deleteMarker()")
    && probe.includes('removeButton.addEventListener("click"'),
);
assert(
  "WebGPU preference has a bounded WASM fallback",
  protocol.includes('device: "webgpu"')
    && protocol.includes('dtype: "fp16"')
    && protocol.includes('device: "wasm"')
    && protocol.includes('dtype: "q8"')
    && worker.includes('from: "webgpu", to: "wasm"')
    && probe.includes("!supportsWasm && !supportsWebGpu"),
);
assert(
  "download sizes and runtime metrics are exposed",
  protocol.includes("expectedBytes: 78_882_591")
    && protocol.includes("expectedBytes: 43_613_734")
    && [
      "modelDownloadBytes",
      "modelDownloadDurationMs",
      "coldLoadDurationMs",
      "warmLoadDurationMs",
      "audioDurationMs",
      "transcriptionDurationMs",
      "realTimeFactor",
    ].every((field) => protocol.includes(field) && probe.includes(field)),
);
assert(
  "probe has Vietnamese and English accessible mobile UI",
  probe.includes("Vietnamese Local Voice Engine Probe")
    && probe.includes("Thử nghiệm bộ máy Voice tiếng Việt cục bộ")
    && probe.includes('status.setAttribute("aria-live", "polite")')
    && styles.includes(".voice-engine-actions button")
    && styles.includes("min-height: 44px")
    && styles.includes(".voice-engine-probe"),
);
assert(
  "structured continuity parsing is absent",
  !probe.includes("waitingOn")
    && !probe.includes("ifYouReturn")
    && !probe.includes("nextStep")
    && !probe.includes("promiseStatus")
    && !worker.includes("waitingOn")
    && !worker.includes("nextStep"),
);
assert(
  "voice engine probe test is registered",
  pkg.scripts["test:voice-engine-probe"] === "node scripts/verify-voice-engine-probe.mjs",
);
assert(
  "app and service-worker identities move together",
  app.includes('BUILD_ID = "2026.07.23-a"') && sw.includes('CACHE_VERSION = "2026-07-23-a"'),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

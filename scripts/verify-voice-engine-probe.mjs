import { readFileSync } from "node:fs";
import ts from "typescript";

const app = readFileSync("src/app.ts", "utf8");
const probe = readFileSync("src/ui/VoiceEngineProbe.ts", "utf8");
const worker = readFileSync("src/voice/voiceEngine.worker.ts", "utf8");
const capture = readFileSync("src/voice/audioCapture.ts", "utf8");
const protocol = readFileSync("src/voice/voiceEngineProtocol.ts", "utf8");
const progressSource = readFileSync("src/voice/modelDownloadProgress.ts", "utf8");
const installationSource = readFileSync("src/voice/modelInstallationState.ts", "utf8");
const originalProbe = readFileSync("src/ui/VoiceCapabilityProbe.ts", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const styles = readFileSync("styles/main.css", "utf8");
const browserSmoke = readFileSync("scripts/smoke-voice-wasm-browser.mjs", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

async function loadTypeScriptModule(source) {
  const executable = source.replace(/import[\s\S]*?from\s+["'][^"']+["'];\s*/g, "");
  const js = ts.transpileModule(executable, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}

const progressDomain = await loadTypeScriptModule(progressSource);
const installationDomain = await loadTypeScriptModule(installationSource);
const audioDomain = await loadTypeScriptModule(capture);

const progressLedger = new progressDomain.ModelDownloadProgress();
progressLedger.update({ status: "progress", file: "encoder.onnx", loaded: 10, total: 100 });
progressLedger.update({ status: "progress", file: "decoder.onnx", loaded: 20, total: 200 });
const aggregate = progressLedger.update({ status: "progress", file: "encoder.onnx", loaded: 50, total: 100 });
assert("download bytes aggregate latest progress across unique files", aggregate.loaded === 70 && aggregate.total === 300 && aggregate.files === 2);

assert(
  "a marker requires persistence verification before offline readiness",
  installationDomain.classifyModelInstallation("valid", "not-run") === "marker-verification-required"
    && installationDomain.classifyModelInstallation("valid", "passed") === "verified"
    && installationDomain.classifyModelInstallation("valid", "failed") === "incomplete"
    && installationDomain.classifyModelInstallation("invalid", "not-run") === "incomplete",
);

let resumed = false;
const suspendedContext = {
  state: "suspended",
  async resume() { resumed = true; this.state = "running"; },
  async close() { this.state = "closed"; },
};
await audioDomain.ensureAudioContextRunning(suspendedContext);
assert("suspended Android AudioContext resumes before capture", resumed && suspendedContext.state === "running");

let stoppedTracks = 0;
let closedContext = false;
const failedContext = {
  state: "suspended",
  async resume() { throw new Error("resume denied"); },
  async close() { closedContext = true; this.state = "closed"; },
};
let resumeRejected = false;
try {
  await audioDomain.ensureAudioContextRunning(failedContext);
} catch {
  resumeRejected = true;
}
await audioDomain.releaseAudioResources({ getTracks: () => [{ stop: () => { stoppedTracks += 1; } }] }, failedContext);
assert("AudioContext resume failure permits complete microphone cleanup", resumeRejected && stoppedTracks === 1 && closedContext);

assert(
  "engine probe is hidden and unloaded by default",
  app.includes('get("voice-engine-probe") === "1"')
    && app.includes('import("./ui/VoiceEngineProbe")')
    && !app.includes('import { VoiceEngineProbe }')
    && app.includes("if (!voiceProbeMode && !voiceEngineProbeMode)")
    && !app.includes("voiceEngine.worker"),
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
    && worker.includes("local_files_only: localFilesOnly")
    && !worker.includes('from: "webgpu", to: "wasm"')
    && !protocol.includes('type: "fallback"'),
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
    && probe.includes("marker.configuration === VOICE_ENGINE_MODEL.configurationIdentity")
    && worker.includes("await loadPipeline(backend, true)")
    && worker.includes("local_files_only: localFilesOnly")
    && worker.includes("ModelRegistry.is_pipeline_cached_files")
    && worker.includes("modelConfig(backend, true)")
    && worker.includes("withRemoteNetworkBlocked")
    && worker.includes("OFFLINE_VERIFICATION_BLOCKED_REMOTE_REQUEST")
    && worker.includes("url.origin !== self.location.origin")
    && probe.includes("modelMissing")
    && probe.indexOf("await verifyPersistedModel(response.backend)") < probe.indexOf("await writeMarker(candidateMarker)")
    && probe.includes('type: "verify"')
    && probe.includes("const verifier = new Worker"),
);
assert(
  "failed or markerless installs retain exact cleanup",
  worker.includes('type: "progress"')
    && probe.includes("installButton.textContent = text.retry")
    && probe.includes("await deleteMarker()")
    && probe.includes('removeButton.addEventListener("click"')
    && probe.includes("removeButton.hidden = false")
    && !probe.includes("isBusy() || !marker")
    && worker.includes("clearExactBrowserCacheEntries")
    && worker.includes("isExactPinnedModelRequest"),
);
assert(
  "session creation failures remain exact and recoverable without a marker",
  worker.includes("message: errorMessage(error)")
    && probe.includes("statusMessage = `${text.failed}: ${errorMessage(error)}`")
    && probe.indexOf("await verifyPersistedModel(response.backend)") < probe.indexOf("await writeMarker(candidateMarker)")
    && probe.includes("setBusy(false)")
    && probe.includes("replaceWorker()"),
);
assert(
  "cleanup never removes board shell or unrelated browser caches",
  worker.includes("[VOICE_ENGINE_CACHE_KEY, ...VOICE_ENGINE_LEGACY_CACHE_KEYS]")
    && worker.includes("cache.delete(request)")
    && !worker.includes('caches.delete("today-board-shell')
    && !worker.includes("caches.keys()")
    && probe.includes("caches.delete(MARKER_CACHE)"),
);
assert(
  "WebGPU and repaired WASM installation choices are explicit and non-cascading",
  protocol.includes('device: "webgpu"')
    && protocol.includes('dtype: "fp16"')
    && protocol.includes('device: "wasm"')
    && protocol.includes('dtype: "uint8"')
    && probe.includes('const backendSelect = document.createElement("select")')
    && probe.includes('request({ type: "install", backend: selectedBackend })')
    && worker.includes("await loadPipeline(backend, false, progress)")
    && !worker.includes("preferWebGpu"),
);
assert(
  "the incompatible optimized Android q8 and uint8 paths are recorded but never selected",
  protocol.includes("VOICE_ENGINE_REJECTED_WASM_CONFIGURATIONS")
    && protocol.includes('encoder: "onnx/encoder_model_quantized.onnx"')
    && protocol.includes('decoder: "onnx/decoder_model_merged_quantized.onnx"')
    && protocol.includes("TransposedDQWeightsForMatMulNBits missing required scale")
    && protocol.includes('file: "onnx/encoder_model_uint8.onnx"')
    && protocol.includes('file: "onnx/decoder_model_merged_uint8.onnx"')
    && protocol.includes('graphOptimizationLevel: "disabled"')
    && worker.includes('graphOptimizationLevel: "disabled" as const'),
);
assert(
  "artifact configuration changes invalidate old cache and markers",
  protocol.includes('VOICE_ENGINE_CACHE_KEY = "today-board-voice-model-ff4177021cc4-uint8-no-qdq-v5"')
    && protocol.includes('"today-board-voice-model-ff4177021cc4-uint8-no-qdq-v4"')
    && protocol.includes('"today-board-voice-model-ff4177021cc4-uint8-no-qdq-v3"')
    && protocol.includes('"today-board-voice-model-ff4177021cc4-uint8-v2"')
    && protocol.includes('"today-board-voice-model-ff4177021cc4"')
    && probe.includes('MARKER_CACHE = "today-board-voice-engine-probe-v5"')
    && probe.includes('"today-board-voice-engine-probe-v4"')
    && probe.includes('"today-board-voice-engine-probe-v3"')
    && probe.includes('"today-board-voice-engine-probe-v2"')
    && probe.includes('"today-board-voice-engine-probe-v1"')
    && probe.includes("VOICE_ENGINE_MODEL.configurationIdentity"),
);
assert(
  "download sizes and runtime metrics are exposed",
  protocol.includes("expectedBytes: 78_882_591")
    && protocol.includes("expectedBytes: 43_613_764")
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
  "bounded browser smoke disables WebGPU and verifies the real WASM offline session at 360x800",
  pkg.scripts["smoke:voice-wasm-browser"] === "node scripts/smoke-voice-wasm-browser.mjs"
    && browserSmoke.includes('"--disable-webgpu"')
    && browserSmoke.includes('width: 360')
    && browserSmoke.includes("backend.value = 'wasm'")
    && browserSmoke.includes("offlineSessionVerified: true"),
);
assert(
  "app and service-worker identities move together",
  app.includes('BUILD_ID = "2026.07.23-c"') && sw.includes('CACHE_VERSION = "2026-07-23-c"'),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

import type { Language } from "./i18n";
import { startMemoryAudioCapture, type MemoryAudioCapture } from "../voice/audioCapture";
import { classifyModelInstallation, type ModelInstallationState } from "../voice/modelInstallationState";
import {
  VOICE_ENGINE_MAX_AUDIO_SECONDS,
  VOICE_ENGINE_MODEL,
  type VoiceEngineBackend,
  type VoiceEngineMetrics,
  type VoiceEngineRequest,
  type VoiceEngineResponse,
} from "../voice/voiceEngineProtocol";

interface VoiceEngineProbeProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export interface VoiceEngineProbeHandle {
  element: HTMLElement;
  destroy: () => void;
}

interface InstallationMarker {
  model: string;
  revision: string;
  configuration: string;
  backend: VoiceEngineBackend;
  installedAt: string;
}

type ProbePhase =
  | "checking"
  | "not-installed"
  | "installing"
  | "installed"
  | "preparing"
  | "recording"
  | "transcribing"
  | "removing"
  | "failure";

interface MarkerReadResult {
  present: boolean;
  marker?: InstallationMarker;
}

const MARKER_CACHE = "today-board-voice-engine-probe-v5";
const LEGACY_MARKER_CACHES = [
  "today-board-voice-engine-probe-v4",
  "today-board-voice-engine-probe-v3",
  "today-board-voice-engine-probe-v2",
  "today-board-voice-engine-probe-v1",
] as const;
const MARKER_PATH = `./__voice-engine-probe/${VOICE_ENGINE_MODEL.configurationIdentity}`;

const copy = {
  en: {
    internal: "Internal probe",
    title: "Vietnamese Local Voice Engine Probe",
    description: "Tests a small multilingual model entirely inside this installed PWA. It does not add anything to Today Board.",
    uiLanguage: "Interface language",
    privacy: "Audio stays in memory on this device, is discarded after inference, and is never sent to a transcription service.",
    model: "Model",
    revision: "Pinned revision",
    license: "License",
    language: "Recognition language",
    size: "Expected model download",
    sizeValue: "75.2 MiB on WebGPU fp16 or 41.6 MiB on WASM uint8, including tokenizer/config files.",
    webgpuArtifacts: "WebGPU artifacts",
    wasmArtifacts: "WASM artifacts",
    wasmRuntime: "WASM session configuration",
    backendChoice: "Installation backend",
    state: "Model state",
    backend: "Backend",
    notInstalled: "Model not installed",
    markerFound: "Installation marker found; exact cache verification required",
    installed: "Exact model cache verified for offline use",
    incomplete: "Model cache is incomplete, stale, or evicted",
    installing: "Installing model",
    checking: "Checking local installation...",
    install: "Install model",
    retry: "Retry installation",
    remove: "Clean downloaded model data",
    installConsent: "Installation starts only after this button. The exact pinned files are cached for offline use.",
    start: "Start 15-second sample",
    stop: "Stop and transcribe",
    clear: "Clear transcript",
    preparing: "Loading the installed model from this device...",
    recording: "Recording locally. Stop when finished; the limit is 15 seconds.",
    transcribing: "Transcribing locally in the worker...",
    removing: "Removing cached model files...",
    removed: "Downloaded model data removed.",
    removedFiles: "files removed",
    removedBytes: "bytes removed",
    transcript: "Final transcript",
    noTranscript: "No successful transcript yet.",
    unsupported: "This device exposes neither WebGPU nor the required WebAssembly runtime.",
    cacheUnsupported: "Persistent browser Cache Storage is unavailable, so offline model installation cannot be guaranteed.",
    microphoneUnsupported: "Microphone capture is unavailable on this device.",
    modelMissing: "The exact installed model is unavailable locally. Reinstall it while online.",
    failed: "The local voice engine failed",
    status: "Probe status",
    progress: "Download progress",
    metrics: "Runtime metrics",
    downloadBytes: "Model bytes downloaded",
    downloadDuration: "Download/load duration",
    coldLoad: "Cold-load duration",
    warmLoad: "Warm-load duration",
    audioDuration: "Audio duration",
    transcriptionDuration: "Transcription duration",
    realTimeFactor: "Real-time factor",
    unavailable: "Not measured",
    webgpu: "WebGPU fp16",
    wasm: "WASM uint8",
  },
  vi: {
    internal: "Thử nghiệm nội bộ",
    title: "Thử nghiệm bộ máy Voice tiếng Việt cục bộ",
    description: "Kiểm tra một mô hình đa ngôn ngữ nhỏ hoàn toàn trong PWA đã cài. Không có nội dung nào được thêm vào Today Board.",
    uiLanguage: "Ngôn ngữ giao diện",
    privacy: "Âm thanh chỉ ở trong bộ nhớ trên thiết bị, bị xóa sau suy luận và không bao giờ được gửi tới dịch vụ chép lời.",
    model: "Mô hình",
    revision: "Bản sửa đổi đã ghim",
    license: "Giấy phép",
    language: "Ngôn ngữ nhận dạng",
    size: "Dung lượng tải mô hình dự kiến",
    sizeValue: "75,2 MiB với WebGPU fp16 hoặc 41,6 MiB với WASM uint8, gồm tệp tokenizer/config.",
    webgpuArtifacts: "Tệp WebGPU",
    wasmArtifacts: "Tệp WASM",
    wasmRuntime: "Cấu hình phiên WASM",
    backendChoice: "Bộ xử lý để cài",
    state: "Trạng thái mô hình",
    backend: "Bộ xử lý",
    notInstalled: "Chưa cài mô hình",
    markerFound: "Đã thấy dấu cài đặt; cần xác minh chính xác bộ nhớ đệm",
    installed: "Đã xác minh chính xác bộ nhớ đệm để dùng ngoại tuyến",
    incomplete: "Bộ nhớ đệm mô hình thiếu, cũ hoặc đã bị xóa",
    installing: "Đang cài mô hình",
    checking: "Đang kiểm tra bản cài cục bộ...",
    install: "Cài mô hình",
    retry: "Thử cài lại",
    remove: "Dọn dữ liệu mô hình đã tải",
    installConsent: "Chỉ bắt đầu cài sau khi bạn bấm nút này. Các tệp đã ghim sẽ được lưu để dùng ngoại tuyến.",
    start: "Bắt đầu mẫu 15 giây",
    stop: "Dừng và chép lời",
    clear: "Xóa bản chép",
    preparing: "Đang tải mô hình đã cài từ thiết bị này...",
    recording: "Đang ghi cục bộ. Hãy dừng khi xong; giới hạn là 15 giây.",
    transcribing: "Đang chép lời cục bộ trong worker...",
    removing: "Đang xóa tệp mô hình đã lưu...",
    removed: "Đã xóa dữ liệu mô hình tải xuống.",
    removedFiles: "tệp đã xóa",
    removedBytes: "byte đã xóa",
    transcript: "Bản chép cuối cùng",
    noTranscript: "Chưa có bản chép thành công.",
    unsupported: "Thiết bị này không có WebGPU và cũng không có WebAssembly cần thiết.",
    cacheUnsupported: "Không có Cache Storage bền vững nên không thể bảo đảm cài mô hình để dùng ngoại tuyến.",
    microphoneUnsupported: "Không thể thu âm bằng micrô trên thiết bị này.",
    modelMissing: "Mô hình chính xác đã cài không còn khả dụng cục bộ. Hãy cài lại khi trực tuyến.",
    failed: "Bộ máy Voice cục bộ thất bại",
    status: "Trạng thái thử nghiệm",
    progress: "Tiến độ tải",
    metrics: "Chỉ số thời gian chạy",
    downloadBytes: "Số byte mô hình đã tải",
    downloadDuration: "Thời gian tải/nạp",
    coldLoad: "Thời gian nạp nguội",
    warmLoad: "Thời gian nạp ấm",
    audioDuration: "Thời lượng âm thanh",
    transcriptionDuration: "Thời gian chép lời",
    realTimeFactor: "Hệ số thời gian thực",
    unavailable: "Chưa đo",
    webgpu: "WebGPU fp16",
    wasm: "WASM uint8",
  },
} as const;

export function VoiceEngineProbe({ language, onLanguageChange }: VoiceEngineProbeProps): VoiceEngineProbeHandle {
  const text = copy[language];
  const supportsWasm = typeof WebAssembly !== "undefined";
  const supportsWebGpu = "gpu" in navigator;
  const supportsCache = "caches" in window;
  let phase: ProbePhase = "checking";
  let selectedBackend: VoiceEngineBackend = supportsWasm ? "wasm" : "webgpu";
  let installationState: ModelInstallationState = "not-installed";
  let marker: InstallationMarker | undefined;
  let capture: MemoryAudioCapture | undefined;
  let transcript = "";
  let statusMessage: string = text.checking;
  let metrics: VoiceEngineMetrics = {};
  let requestSequence = 0;
  let destroyed = false;
  const pending = new Map<number, { resolve: (response: VoiceEngineResponse) => void; reject: (error: Error) => void }>();
  let worker = createWorker();

  const shell = document.createElement("section");
  shell.className = "voice-engine-probe";
  shell.dataset.testid = "voice-engine-probe";
  shell.setAttribute("aria-labelledby", "voice-engine-probe-title");

  const header = document.createElement("header");
  header.className = "voice-engine-header";
  const headingGroup = document.createElement("div");
  const badge = document.createElement("p");
  badge.className = "voice-probe-badge";
  badge.textContent = text.internal;
  const title = document.createElement("h1");
  title.id = "voice-engine-probe-title";
  title.textContent = text.title;
  const description = document.createElement("p");
  description.textContent = text.description;
  headingGroup.append(badge, title, description);
  const languageToggle = createLanguageToggle();
  header.append(headingGroup, languageToggle);

  const privacy = document.createElement("p");
  privacy.className = "voice-probe-privacy";
  privacy.textContent = text.privacy;

  const identity = document.createElement("dl");
  identity.className = "voice-engine-identity";
  appendDefinition(identity, text.model, VOICE_ENGINE_MODEL.id);
  appendDefinition(identity, text.revision, VOICE_ENGINE_MODEL.revision);
  appendDefinition(identity, text.license, VOICE_ENGINE_MODEL.license);
  appendDefinition(identity, text.language, "vi / Vietnamese");
  appendDefinition(identity, text.size, text.sizeValue);
  appendDefinition(identity, text.webgpuArtifacts, artifactSummary("webgpu"));
  appendDefinition(identity, text.wasmArtifacts, artifactSummary("wasm"));
  appendDefinition(
    identity,
    text.wasmRuntime,
    `${VOICE_ENGINE_MODEL.onnxRuntimeWebVersion}; graphOptimizationLevel=disabled; local_files_only inventory + remote fetch denied`,
  );

  const backendControl = document.createElement("label");
  backendControl.className = "voice-engine-backend-control";
  const backendLabel = document.createElement("span");
  backendLabel.textContent = text.backendChoice;
  const backendSelect = document.createElement("select");
  backendSelect.dataset.testid = "voice-engine-backend";
  backendSelect.ariaLabel = text.backendChoice;
  for (const backend of ["wasm", "webgpu"] as const) {
    const option = document.createElement("option");
    option.value = backend;
    option.textContent = `${text[backend]} · ${formatBytes(VOICE_ENGINE_MODEL[backend].expectedBytes)}`;
    option.disabled = backend === "wasm" ? !supportsWasm : !supportsWebGpu;
    backendSelect.append(option);
  }
  backendSelect.value = selectedBackend;
  backendSelect.addEventListener("change", () => {
    selectedBackend = backendSelect.value as VoiceEngineBackend;
    render();
  });
  backendControl.append(backendLabel, backendSelect);

  const state = document.createElement("div");
  state.className = "voice-engine-state";
  const stateLabel = document.createElement("span");
  stateLabel.textContent = text.state;
  const stateValue = document.createElement("strong");
  stateValue.setAttribute("aria-live", "polite");
  state.append(stateLabel, stateValue);

  const progressLabel = document.createElement("label");
  progressLabel.className = "voice-engine-progress";
  const progressText = document.createElement("span");
  progressText.textContent = text.progress;
  const progress = document.createElement("progress");
  progress.max = 1;
  progress.value = 0;
  const progressValue = document.createElement("span");
  progressValue.textContent = "0%";
  progressLabel.append(progressText, progress, progressValue);

  const installHelp = document.createElement("p");
  installHelp.className = "voice-probe-help";
  installHelp.textContent = text.installConsent;

  const modelActions = document.createElement("div");
  modelActions.className = "voice-engine-actions";
  const installButton = createButton(text.install);
  installButton.dataset.testid = "voice-engine-install";
  const removeButton = createButton(text.remove, "quiet-button");
  modelActions.append(installButton, removeButton);

  const captureActions = document.createElement("div");
  captureActions.className = "voice-engine-actions";
  const startButton = createButton(text.start);
  const stopButton = createButton(text.stop, "quiet-button");
  const clearButton = createButton(text.clear, "quiet-button");
  captureActions.append(startButton, stopButton, clearButton);

  const transcriptBlock = document.createElement("section");
  transcriptBlock.className = "voice-engine-transcript";
  const transcriptHeading = document.createElement("h2");
  transcriptHeading.textContent = text.transcript;
  const transcriptOutput = document.createElement("p");
  transcriptOutput.className = "voice-probe-output";
  transcriptOutput.setAttribute("aria-live", "polite");
  transcriptBlock.append(transcriptHeading, transcriptOutput);

  const metricsBlock = document.createElement("section");
  metricsBlock.className = "voice-engine-metrics";
  const metricsHeading = document.createElement("h2");
  metricsHeading.textContent = text.metrics;
  const metricsList = document.createElement("dl");
  metricsBlock.append(metricsHeading, metricsList);

  const status = document.createElement("p");
  status.dataset.testid = "voice-engine-status";
  status.className = "voice-probe-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.ariaLabel = text.status;

  shell.append(
    header,
    privacy,
    identity,
    backendControl,
    state,
    progressLabel,
    installHelp,
    modelActions,
    captureActions,
    transcriptBlock,
    metricsBlock,
    status,
  );

  installButton.addEventListener("click", () => void installModel());
  removeButton.addEventListener("click", () => void removeModel());
  startButton.addEventListener("click", () => void startCapture());
  stopButton.addEventListener("click", () => void stopAndTranscribe());
  clearButton.addEventListener("click", () => {
    transcript = "";
    render();
  });

  const cleanupForNavigation = () => void destroy();
  window.addEventListener("pagehide", cleanupForNavigation);
  window.addEventListener("popstate", cleanupForNavigation);
  render();
  void inspectInstallation();

  return { element: shell, destroy };

  function createLanguageToggle(): HTMLElement {
    const toggle = document.createElement("div");
    toggle.className = "language-toggle";
    toggle.setAttribute("aria-label", text.uiLanguage);
    for (const option of ["vi", "en"] as const) {
      const button = createButton(option.toUpperCase(), option === language ? "language-button active" : "language-button");
      button.addEventListener("click", () => onLanguageChange(option));
      toggle.append(button);
    }
    return toggle;
  }

  async function inspectInstallation(): Promise<void> {
    if (!supportsWasm && !supportsWebGpu) {
      phase = "failure";
      statusMessage = text.unsupported;
      render();
      return;
    }
    if (!supportsCache) {
      phase = "failure";
      statusMessage = text.cacheUnsupported;
      render();
      return;
    }
    const markerResult = await readMarker();
    if (!markerResult.present) {
      installationState = classifyModelInstallation("absent", "not-run");
      phase = "not-installed";
      statusMessage = text.notInstalled;
      render();
      return;
    }
    if (!markerResult.marker) {
      installationState = classifyModelInstallation("invalid", "not-run");
      phase = "not-installed";
      statusMessage = text.incomplete;
      installButton.textContent = text.retry;
      render();
      return;
    }
    marker = markerResult.marker;
    selectedBackend = marker.backend;
    backendSelect.value = selectedBackend;
    installationState = classifyModelInstallation("valid", "not-run");
    phase = "checking";
    statusMessage = text.markerFound;
    setBusy(true);
    render();
    try {
      await verifyPersistedModel(marker.backend);
      installationState = classifyModelInstallation("valid", "passed");
      phase = "installed";
      statusMessage = text.installed;
    } catch {
      installationState = classifyModelInstallation("valid", "failed");
      phase = "not-installed";
      statusMessage = text.incomplete;
      installButton.textContent = text.retry;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function installModel(): Promise<void> {
    const backendAvailable = selectedBackend === "wasm" ? supportsWasm : supportsWebGpu;
    if (isBusy() || !supportsCache || !backendAvailable) {
      return;
    }
    phase = "installing";
    statusMessage = text.installing;
    progress.value = 0;
    progressValue.textContent = "0%";
    setBusy(true);
    render();
    try {
      const response = await request({ type: "install", backend: selectedBackend });
      if (response.type !== "installed") {
        throw new Error("INSTALL_RESULT_INVALID");
      }
      const candidateMarker: InstallationMarker = {
        model: VOICE_ENGINE_MODEL.id,
        revision: VOICE_ENGINE_MODEL.revision,
        configuration: VOICE_ENGINE_MODEL.configurationIdentity,
        backend: response.backend,
        installedAt: new Date().toISOString(),
      };
      await verifyPersistedModel(response.backend);
      await writeMarker(candidateMarker);
      marker = candidateMarker;
      installationState = "verified";
      metrics = { ...metrics, ...response.metrics };
      phase = "installed";
      statusMessage = text.installed;
      progress.value = 1;
      progressValue.textContent = "100%";
    } catch (error) {
      installationState = "incomplete";
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
      installButton.textContent = text.retry;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function removeModel(): Promise<void> {
    if (isBusy() || !supportsCache) {
      return;
    }
    phase = "removing";
    statusMessage = text.removing;
    setBusy(true);
    render();
    try {
      const response = await request({ type: "remove" });
      if (response.type !== "removed") {
        throw new Error("REMOVE_RESULT_INVALID");
      }
      await deleteMarker();
      marker = undefined;
      installationState = "not-installed";
      metrics = {};
      transcript = "";
      phase = "not-installed";
      statusMessage = `${text.removed} ${response.deletedFiles} ${text.removedFiles}${
        response.removedBytes === undefined ? "" : `; ${response.removedBytes.toLocaleString()} ${text.removedBytes}`
      }.`;
      installButton.textContent = text.install;
      progress.value = 0;
      progressValue.textContent = "0%";
    } catch (error) {
      installationState = "incomplete";
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function startCapture(): Promise<void> {
    if (isBusy() || installationState !== "verified" || !marker) {
      statusMessage = text.modelMissing;
      render();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === "undefined") {
      phase = "failure";
      statusMessage = text.microphoneUnsupported;
      render();
      return;
    }
    phase = "preparing";
    statusMessage = text.preparing;
    transcript = "";
    setBusy(true);
    render();
    let modelPrepared = false;
    try {
      const response = await request({ type: "prepare", backend: marker.backend });
      if (response.type !== "prepared") {
        throw new Error("PREPARE_RESULT_INVALID");
      }
      modelPrepared = true;
      metrics = { ...metrics, ...response.metrics };
      capture = await startMemoryAudioCapture(() => void stopAndTranscribe());
      phase = "recording";
      statusMessage = text.recording;
      shell.dataset.recording = "true";
      render();
    } catch (error) {
      if (!modelPrepared) {
        installationState = "incomplete";
        phase = "failure";
        statusMessage = `${text.modelMissing} ${errorMessage(error)}`;
      } else {
        phase = "installed";
        statusMessage = `${text.failed}: ${errorMessage(error)}`;
      }
      setBusy(false);
      render();
    }
  }

  async function stopAndTranscribe(): Promise<void> {
    const activeCapture = capture;
    if (!activeCapture || phase !== "recording") {
      return;
    }
    capture = undefined;
    const audioDurationMs = activeCapture.durationMs();
    phase = "transcribing";
    statusMessage = text.transcribing;
    delete shell.dataset.recording;
    render();
    try {
      const audio = await activeCapture.stop();
      const response = await request(
        { type: "transcribe", audio, audioDurationMs },
        [audio.buffer],
      );
      if (response.type !== "transcribed") {
        throw new Error("TRANSCRIPTION_RESULT_INVALID");
      }
      transcript = response.transcript;
      metrics = { ...metrics, ...response.metrics };
      phase = "installed";
      statusMessage = text.installed;
    } catch (error) {
      transcript = "";
      phase = "installed";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    } finally {
      setBusy(false);
      render();
    }
  }

  function request(
    payload: Omit<Extract<VoiceEngineRequest, { type: "install" }>, "id">
      | Omit<Extract<VoiceEngineRequest, { type: "prepare" }>, "id">
      | Omit<Extract<VoiceEngineRequest, { type: "verify" }>, "id">
      | Omit<Extract<VoiceEngineRequest, { type: "transcribe" }>, "id">
      | Omit<Extract<VoiceEngineRequest, { type: "remove" }>, "id">
      | Omit<Extract<VoiceEngineRequest, { type: "dispose" }>, "id">,
    transfer: Transferable[] = [],
  ): Promise<VoiceEngineResponse> {
    const id = ++requestSequence;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      worker.postMessage({ id, ...payload } as VoiceEngineRequest, transfer);
    });
  }

  function handleWorkerMessage(event: MessageEvent<VoiceEngineResponse>): void {
    const response = event.data;
    if (response.type === "progress") {
      const total = response.total || expectedBytes(marker?.backend ?? (supportsWebGpu ? "webgpu" : "wasm"));
      progress.value = Math.min(1, response.loaded / total);
      progressValue.textContent = `${Math.round(progress.value * 100)}%`;
      metrics.modelDownloadBytes = response.loaded;
      renderMetrics();
      return;
    }
    const operation = pending.get(response.id);
    if (!operation) {
      return;
    }
    pending.delete(response.id);
    if (response.type === "error") {
      operation.reject(new Error(response.message));
      return;
    }
    operation.resolve(response);
  }

  function handleWorkerFailure(event: ErrorEvent): void {
    const error = new Error(event.message || "WORKER_FAILED");
    for (const operation of pending.values()) {
      operation.reject(error);
    }
    pending.clear();
    const activeCapture = capture;
    capture = undefined;
    delete shell.dataset.recording;
    phase = "failure";
    statusMessage = `${text.failed}: ${error.message}`;
    setBusy(false);
    if (activeCapture) {
      void activeCapture.cancel().catch(() => undefined);
    }
    replaceWorker();
    render();
  }

  function createWorker(): Worker {
    const nextWorker = new Worker(new URL("../voice/voiceEngine.worker.ts", import.meta.url), { type: "module" });
    nextWorker.addEventListener("message", handleWorkerMessage);
    nextWorker.addEventListener("error", handleWorkerFailure);
    return nextWorker;
  }

  function replaceWorker(): void {
    worker.terminate();
    if (!destroyed) {
      worker = createWorker();
    }
  }

  async function verifyPersistedModel(backend: VoiceEngineBackend): Promise<void> {
    const verifier = new Worker(new URL("../voice/voiceEngine.worker.ts", import.meta.url), { type: "module" });
    const id = ++requestSequence;
    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error("MODEL_CACHE_VERIFICATION_TIMEOUT")), 180_000);
        verifier.addEventListener("message", (event: MessageEvent<VoiceEngineResponse>) => {
          const response = event.data;
          if (response.id !== id) {
            return;
          }
          window.clearTimeout(timeout);
          if (response.type === "verified") {
            resolve();
          } else if (response.type === "error") {
            reject(new Error(response.message));
          } else {
            reject(new Error("MODEL_CACHE_VERIFICATION_INVALID"));
          }
        });
        verifier.addEventListener("error", (event) => {
          window.clearTimeout(timeout);
          reject(new Error(event.message || "MODEL_CACHE_VERIFICATION_WORKER_FAILED"));
        });
        verifier.postMessage({ id, type: "verify", backend } satisfies VoiceEngineRequest);
      });
    } finally {
      verifier.terminate();
    }
  }

  async function destroy(): Promise<void> {
    if (destroyed) {
      return;
    }
    destroyed = true;
    window.removeEventListener("pagehide", cleanupForNavigation);
    window.removeEventListener("popstate", cleanupForNavigation);
    const activeCapture = capture;
    capture = undefined;
    delete shell.dataset.recording;
    setBusy(false);
    if (activeCapture) {
      await activeCapture.cancel();
    }
    for (const operation of pending.values()) {
      operation.reject(new Error("PROBE_DESTROYED"));
    }
    pending.clear();
    worker.terminate();
  }

  function render(): void {
    stateValue.textContent = phaseLabel();
    stateValue.dataset.phase = phase;
    installButton.hidden = installationState === "verified";
    const selectedBackendAvailable = selectedBackend === "wasm" ? supportsWasm : supportsWebGpu;
    installButton.disabled = isBusy() || !supportsCache || !selectedBackendAvailable;
    backendSelect.disabled = isBusy() || installationState === "verified";
    removeButton.hidden = false;
    removeButton.disabled = isBusy() || !supportsCache;
    startButton.disabled = installationState !== "verified" || !marker || isBusy();
    stopButton.disabled = phase !== "recording";
    clearButton.disabled = !transcript || phase === "recording" || phase === "transcribing";
    progressLabel.hidden = phase !== "installing";
    transcriptOutput.textContent = transcript || text.noTranscript;
    status.textContent = statusMessage;
    renderMetrics();
  }

  function renderMetrics(): void {
    metricsList.replaceChildren();
    appendDefinition(metricsList, text.backend, metrics.backend ? text[metrics.backend] : text.unavailable);
    appendDefinition(metricsList, text.downloadBytes, formatBytes(metrics.modelDownloadBytes));
    appendDefinition(metricsList, text.downloadDuration, formatDuration(metrics.modelDownloadDurationMs));
    appendDefinition(metricsList, text.coldLoad, formatDuration(metrics.coldLoadDurationMs));
    appendDefinition(metricsList, text.warmLoad, formatDuration(metrics.warmLoadDurationMs));
    appendDefinition(metricsList, text.audioDuration, formatDuration(metrics.audioDurationMs));
    appendDefinition(metricsList, text.transcriptionDuration, formatDuration(metrics.transcriptionDurationMs));
    appendDefinition(
      metricsList,
      text.realTimeFactor,
      metrics.realTimeFactor === undefined ? text.unavailable : `${metrics.realTimeFactor.toFixed(2)}x`,
    );
  }

  function phaseLabel(): string {
    if (installationState === "verified" && (phase === "installed" || phase === "recording" || phase === "preparing" || phase === "transcribing")) {
      return marker ? `${text.installed} · ${text[marker.backend]}` : text.installed;
    }
    if (installationState === "marker-verification-required") {
      return text.markerFound;
    }
    if (installationState === "incomplete") {
      return text.incomplete;
    }
    if (phase === "installing") {
      return text.installing;
    }
    if (phase === "checking") {
      return text.checking;
    }
    return text.notInstalled;
  }
}

function createButton(label: string, className = ""): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

function appendDefinition(list: HTMLDListElement, term: string, value: string): void {
  const label = document.createElement("dt");
  label.textContent = term;
  const detail = document.createElement("dd");
  detail.textContent = value;
  list.append(label, detail);
}

async function readMarker(): Promise<MarkerReadResult> {
  const cache = await caches.open(MARKER_CACHE);
  const response = await cache.match(MARKER_PATH);
  if (!response) {
    return { present: false };
  }
  try {
    const marker = (await response.json()) as InstallationMarker;
    const validBackend = marker.backend === "webgpu" || marker.backend === "wasm";
    return marker.model === VOICE_ENGINE_MODEL.id
      && marker.revision === VOICE_ENGINE_MODEL.revision
      && marker.configuration === VOICE_ENGINE_MODEL.configurationIdentity
      && validBackend
      ? { present: true, marker }
      : { present: true };
  } catch {
    return { present: true };
  }
}

async function writeMarker(marker: InstallationMarker): Promise<void> {
  const cache = await caches.open(MARKER_CACHE);
  await cache.put(
    MARKER_PATH,
    new Response(JSON.stringify(marker), { headers: { "content-type": "application/json" } }),
  );
}

async function deleteMarker(): Promise<void> {
  const cache = await caches.open(MARKER_CACHE);
  await cache.delete(MARKER_PATH);
  const remaining = await cache.keys();
  if (remaining.length === 0) {
    await caches.delete(MARKER_CACHE);
  }
  for (const cacheName of LEGACY_MARKER_CACHES) {
    await caches.delete(cacheName);
  }
}

function setBusy(active: boolean): void {
  if (active) {
    document.documentElement.dataset.voiceEngineBusy = "true";
    document.documentElement.dataset.pwaBusy = "true";
    return;
  }
  if (document.documentElement.dataset.voiceEngineBusy === "true") {
    delete document.documentElement.dataset.voiceEngineBusy;
    delete document.documentElement.dataset.pwaBusy;
  }
}

function isBusy(): boolean {
  return document.documentElement.dataset.voiceEngineBusy === "true";
}

function expectedBytes(backend: VoiceEngineBackend): number {
  return VOICE_ENGINE_MODEL[backend].expectedBytes;
}

function artifactSummary(backend: VoiceEngineBackend): string {
  return VOICE_ENGINE_MODEL[backend].artifacts
    .map((artifact) => `${artifact.file} (${formatBytes(artifact.bytes)})`)
    .join("; ");
}

function formatBytes(value: number | undefined): string {
  return value === undefined ? "—" : `${value.toLocaleString()} B (${(value / 1024 / 1024).toFixed(1)} MiB)`;
}

function formatDuration(value: number | undefined): string {
  return value === undefined ? "—" : `${Math.round(value).toLocaleString()} ms`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

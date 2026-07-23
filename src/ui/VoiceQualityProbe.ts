import type { Language } from "./i18n";
import { startMemoryAudioCapture, type MemoryAudioCapture } from "../voice/audioCapture";
import {
  aggregateVoiceQuality,
  analyzeVoiceQualityResult,
  VOICE_QUALITY_UTTERANCES,
  type VoiceQualityManualRating,
  type VoiceQualityResult,
} from "../voice/voiceQualityMetrics";
import {
  VOICE_QUALITY_CANDIDATE_ORDER,
  VOICE_QUALITY_CANDIDATES,
  type VoiceQualityCandidate,
  type VoiceQualityCandidateId,
  type VoiceQualityMetrics,
  type VoiceQualityRequest,
  type VoiceQualityResponse,
} from "../voice/voiceQualityProtocol";

interface VoiceQualityProbeProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export interface VoiceQualityProbeHandle {
  element: HTMLElement;
  destroy: () => Promise<void>;
}

interface InstallationMarker {
  candidateId: VoiceQualityCandidateId;
  configurationIdentity: string;
  verifiedAt: string;
}

type VoiceQualityRequestPayload =
  VoiceQualityRequest extends infer Request
    ? Request extends { id: number }
      ? Omit<Request, "id">
      : never
    : never;

const copy = {
  en: {
    internal: "Internal probe",
    title: "Vietnamese Local Voice Quality Matrix",
    description: "Compare three exact on-device configurations against ten fixed Vietnamese continuity utterances.",
    privacy: "Audio remains memory-only. Transcripts and ratings stay in this page unless you explicitly download the JSON report.",
    language: "Interface language",
    candidate: "Candidate",
    install: "Install selected model",
    remove: "Clean selected model data",
    installed: "Exact cache verified offline",
    marker: "Marker found; fresh verification required",
    missing: "Not installed",
    incomplete: "Incomplete or evicted",
    installing: "Downloading and creating the inference session...",
    verifying: "Verifying in a fresh cache-only worker...",
    ready: "Ready",
    utterance: "Benchmark utterance",
    previous: "Previous",
    next: "Next",
    start: "Start sample",
    stop: "Stop and transcribe",
    clear: "Clear this result",
    export: "Download JSON report",
    expected: "Speak exactly",
    results: "Results",
    aggregate: "Candidate aggregates",
    progress: "Install progress",
    status: "Probe status",
    unavailable: "Unavailable",
    rating: "Manual meaning rating",
    correct: "Correct",
    meaning: "Meaning preserved",
    unsafe: "Unsafe/wrong",
    unrated: "Unrated",
    failed: "Failed",
    recording: "Recording locally; maximum 15 seconds.",
    transcribing: "Transcribing locally in the worker...",
    modelIdentity: "Pinned model identity",
    modelSize: "Expected download",
    cleanup: "Cleanup complete",
  },
  vi: {
    internal: "Thử nghiệm nội bộ",
    title: "Ma trận chất lượng Voice tiếng Việt cục bộ",
    description: "So sánh ba cấu hình chính xác trên thiết bị bằng mười câu liên tục tiếng Việt cố định.",
    privacy: "Âm thanh chỉ ở trong bộ nhớ. Bản chép và đánh giá chỉ ở trang này trừ khi bạn chủ động tải báo cáo JSON.",
    language: "Ngôn ngữ giao diện",
    candidate: "Ứng viên",
    install: "Cài mô hình đã chọn",
    remove: "Dọn dữ liệu mô hình đã chọn",
    installed: "Đã xác minh bộ nhớ đệm chính xác để dùng ngoại tuyến",
    marker: "Đã thấy dấu cài đặt; cần xác minh mới",
    missing: "Chưa cài",
    incomplete: "Thiếu hoặc đã bị xóa",
    installing: "Đang tải và tạo phiên suy luận...",
    verifying: "Đang xác minh trong worker mới chỉ dùng bộ nhớ đệm...",
    ready: "Sẵn sàng",
    utterance: "Câu kiểm chuẩn",
    previous: "Trước",
    next: "Sau",
    start: "Bắt đầu mẫu",
    stop: "Dừng và chép lời",
    clear: "Xóa kết quả này",
    export: "Tải báo cáo JSON",
    expected: "Đọc chính xác",
    results: "Kết quả",
    aggregate: "Tổng hợp theo ứng viên",
    progress: "Tiến độ cài",
    status: "Trạng thái thử nghiệm",
    unavailable: "Không khả dụng",
    rating: "Đánh giá ý nghĩa thủ công",
    correct: "Chính xác",
    meaning: "Giữ nguyên ý nghĩa",
    unsafe: "Sai/không an toàn",
    unrated: "Chưa đánh giá",
    failed: "Thất bại",
    recording: "Đang ghi cục bộ; tối đa 15 giây.",
    transcribing: "Đang chép lời cục bộ trong worker...",
    modelIdentity: "Danh tính mô hình đã ghim",
    modelSize: "Dung lượng tải dự kiến",
    cleanup: "Đã dọn xong",
  },
} as const;

export function VoiceQualityProbe({ language, onLanguageChange }: VoiceQualityProbeProps): VoiceQualityProbeHandle {
  const text = copy[language];
  let selectedId: VoiceQualityCandidateId = "tiny-baseline";
  let utteranceIndex = 0;
  let installed = false;
  let phase: "checking" | "idle" | "installing" | "ready" | "recording" | "transcribing" | "removing" | "failure" = "checking";
  let statusMessage: string = text.missing;
  let capture: MemoryAudioCapture | undefined;
  let worker = createWorker();
  let requestSequence = 0;
  let destroyed = false;
  let loadMetrics: VoiceQualityMetrics = { backend: "wasm" };
  const pending = new Map<number, { resolve: (value: VoiceQualityResponse) => void; reject: (error: Error) => void }>();
  const results = new Map<string, VoiceQualityResult>();

  const shell = document.createElement("main");
  shell.className = "voice-quality-probe";
  shell.dataset.testid = "voice-quality-probe";
  const header = document.createElement("header");
  header.className = "voice-quality-header";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = text.internal;
  const title = document.createElement("h1");
  title.textContent = text.title;
  const description = document.createElement("p");
  description.textContent = text.description;
  heading.append(eyebrow, title, description);
  header.append(heading, languageToggle());

  const privacy = document.createElement("p");
  privacy.className = "voice-quality-privacy";
  privacy.textContent = text.privacy;

  const candidateSection = document.createElement("section");
  candidateSection.className = "voice-quality-panel";
  const candidateLabel = document.createElement("label");
  candidateLabel.textContent = text.candidate;
  const candidateSelect = document.createElement("select");
  candidateSelect.ariaLabel = text.candidate;
  for (const id of VOICE_QUALITY_CANDIDATE_ORDER) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = VOICE_QUALITY_CANDIDATES[id].label;
    candidateSelect.append(option);
  }
  candidateLabel.append(candidateSelect);
  const identity = document.createElement("p");
  const progress = document.createElement("progress");
  progress.max = 1;
  progress.value = 0;
  progress.ariaLabel = text.progress;
  const progressValue = document.createElement("span");
  const modelActions = document.createElement("div");
  modelActions.className = "voice-quality-actions";
  const installButton = button(text.install);
  const removeButton = button(text.remove, "quiet-button");
  modelActions.append(installButton, removeButton);
  candidateSection.append(candidateLabel, identity, progress, progressValue, modelActions);

  const benchmark = document.createElement("section");
  benchmark.className = "voice-quality-panel";
  const benchmarkHeading = document.createElement("h2");
  benchmarkHeading.textContent = text.utterance;
  const utteranceCounter = document.createElement("strong");
  const expected = document.createElement("blockquote");
  const navigation = document.createElement("div");
  navigation.className = "voice-quality-actions";
  const previousButton = button(text.previous, "quiet-button");
  const nextButton = button(text.next, "quiet-button");
  navigation.append(previousButton, nextButton);
  const captureActions = document.createElement("div");
  captureActions.className = "voice-quality-actions";
  const startButton = button(text.start);
  const stopButton = button(text.stop, "quiet-button");
  const clearButton = button(text.clear, "quiet-button");
  captureActions.append(startButton, stopButton, clearButton);
  benchmark.append(benchmarkHeading, utteranceCounter, expected, navigation, captureActions);

  const resultsSection = document.createElement("section");
  resultsSection.className = "voice-quality-panel";
  const resultsHeading = document.createElement("h2");
  resultsHeading.textContent = text.results;
  const resultTableWrap = document.createElement("div");
  resultTableWrap.className = "voice-quality-table-wrap";
  const resultTable = document.createElement("table");
  resultTable.className = "voice-quality-table";
  resultTableWrap.append(resultTable);
  resultsSection.append(resultsHeading, resultTableWrap);

  const aggregateSection = document.createElement("section");
  aggregateSection.className = "voice-quality-panel";
  const aggregateHeading = document.createElement("h2");
  aggregateHeading.textContent = text.aggregate;
  const aggregates = document.createElement("div");
  aggregates.className = "voice-quality-aggregates";
  const exportButton = button(text.export, "quiet-button");
  aggregateSection.append(aggregateHeading, aggregates, exportButton);

  const status = document.createElement("p");
  status.className = "voice-quality-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.ariaLabel = text.status;
  shell.append(header, privacy, candidateSection, benchmark, resultsSection, aggregateSection, status);

  candidateSelect.addEventListener("change", () => void selectCandidate(candidateSelect.value as VoiceQualityCandidateId));
  installButton.addEventListener("click", () => void installSelected());
  removeButton.addEventListener("click", () => void removeSelected());
  previousButton.addEventListener("click", () => {
    utteranceIndex = (utteranceIndex + VOICE_QUALITY_UTTERANCES.length - 1) % VOICE_QUALITY_UTTERANCES.length;
    render();
  });
  nextButton.addEventListener("click", () => {
    utteranceIndex = (utteranceIndex + 1) % VOICE_QUALITY_UTTERANCES.length;
    render();
  });
  startButton.addEventListener("click", () => void startCapture());
  stopButton.addEventListener("click", () => void stopAndTranscribe());
  clearButton.addEventListener("click", () => {
    results.delete(resultKey(selectedId, VOICE_QUALITY_UTTERANCES[utteranceIndex].id));
    render();
  });
  exportButton.addEventListener("click", downloadReport);
  const navigationCleanup = () => void destroy();
  window.addEventListener("pagehide", navigationCleanup);
  window.addEventListener("popstate", navigationCleanup);
  render();
  void inspectSelected();
  return { element: shell, destroy };

  function languageToggle(): HTMLElement {
    const toggle = document.createElement("div");
    toggle.className = "language-toggle";
    toggle.ariaLabel = text.language;
    for (const item of ["vi", "en"] as const) {
      const control = button(item.toUpperCase(), item === language ? "language-button active" : "language-button");
      control.addEventListener("click", () => onLanguageChange(item));
      toggle.append(control);
    }
    return toggle;
  }

  async function selectCandidate(id: VoiceQualityCandidateId): Promise<void> {
    if (isBusy() || id === selectedId) {
      candidateSelect.value = selectedId;
      return;
    }
    await cancelCapture();
    await replaceWorker();
    setBusy(false);
    selectedId = id;
    installed = false;
    loadMetrics = { backend: "wasm" };
    phase = "checking";
    render();
    await inspectSelected();
  }

  async function inspectSelected(): Promise<void> {
    const marker = await readMarker(selected());
    if (!marker) {
      installed = false;
      phase = "idle";
      statusMessage = await hasCandidateData(selected()) ? text.incomplete : text.missing;
      render();
      return;
    }
    phase = "checking";
    statusMessage = text.marker;
    setBusy(true);
    render();
    try {
      await freshVerify(selectedId);
      installed = true;
      phase = "ready";
      statusMessage = text.installed;
    } catch {
      installed = false;
      phase = "idle";
      statusMessage = text.incomplete;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function installSelected(): Promise<void> {
    if (isBusy() || !("caches" in window) || typeof WebAssembly === "undefined") {
      return;
    }
    phase = "installing";
    statusMessage = text.installing;
    progress.value = 0;
    setBusy(true);
    render();
    try {
      const installedResponse = await request({ type: "install", candidateId: selectedId });
      if (installedResponse.type !== "installed") {
        throw new Error("INSTALL_RESPONSE_INVALID");
      }
      loadMetrics = installedResponse.metrics;
      statusMessage = text.verifying;
      render();
      await freshVerify(selectedId);
      await writeMarker(selected());
      installed = true;
      phase = "ready";
      statusMessage = text.installed;
    } catch (error) {
      installed = false;
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function freshVerify(candidateId: VoiceQualityCandidateId): Promise<void> {
    const verifier = new Worker(new URL("../voice/voiceQuality.worker.ts", import.meta.url), { type: "module" });
    try {
      await standaloneRequest(verifier, { type: "verify", candidateId });
    } finally {
      verifier.terminate();
    }
  }

  async function removeSelected(): Promise<void> {
    if (isBusy()) {
      return;
    }
    phase = "removing";
    setBusy(true);
    render();
    try {
      await cancelCapture();
      const response = await request({ type: "remove", candidateId: selectedId });
      await deleteMarker(selected());
      installed = false;
      phase = "idle";
      statusMessage = response.type === "removed"
        ? `${text.cleanup}: ${response.deletedFiles} files${response.removedBytes === undefined ? "" : `, ${formatBytes(response.removedBytes)}`}.`
        : text.cleanup;
    } catch (error) {
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    } finally {
      setBusy(false);
      render();
    }
  }

  async function startCapture(): Promise<void> {
    if (!installed || isBusy() || !navigator.mediaDevices?.getUserMedia) {
      return;
    }
    setBusy(true);
    phase = "checking";
    statusMessage = text.ready;
    render();
    try {
      const prepared = await request({ type: "prepare", candidateId: selectedId });
      if (prepared.type !== "prepared") {
        throw new Error("PREPARE_RESPONSE_INVALID");
      }
      loadMetrics = { ...loadMetrics, ...prepared.metrics };
      capture = await startMemoryAudioCapture(() => void stopAndTranscribe());
      phase = "recording";
      statusMessage = text.recording;
    } catch (error) {
      await cancelCapture();
      setBusy(false);
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    }
    render();
  }

  async function stopAndTranscribe(): Promise<void> {
    if (!capture || phase !== "recording") {
      return;
    }
    const activeCapture = capture;
    capture = undefined;
    phase = "transcribing";
    statusMessage = text.transcribing;
    render();
    const utterance = VOICE_QUALITY_UTTERANCES[utteranceIndex];
    try {
      const audioDurationMs = activeCapture.durationMs();
      const audio = await activeCapture.stop();
      const response = await request({ type: "transcribe", candidateId: selectedId, audio, audioDurationMs }, [audio.buffer]);
      if (response.type !== "transcribed") {
        throw new Error("TRANSCRIBE_RESPONSE_INVALID");
      }
      results.set(
        resultKey(selectedId, utterance.id),
        analyzeVoiceQualityResult(selectedId, utterance, response.transcript, { ...loadMetrics, ...response.metrics }),
      );
      phase = "ready";
      statusMessage = text.ready;
    } catch (error) {
      results.set(resultKey(selectedId, utterance.id), {
        ...analyzeVoiceQualityResult(selectedId, utterance, "", loadMetrics),
        error: errorMessage(error),
      });
      phase = "failure";
      statusMessage = `${text.failed}: ${errorMessage(error)}`;
    } finally {
      setBusy(false);
      render();
    }
  }

  function render(): void {
    const candidate = selected();
    const utterance = VOICE_QUALITY_UTTERANCES[utteranceIndex];
    const busy = isBusy();
    candidateSelect.value = selectedId;
    candidateSelect.disabled = busy || phase === "recording";
    identity.textContent =
      `${text.modelIdentity}: ${candidate.modelId}@${candidate.revision} · ${candidate.license} · `
      + `${candidate.dtype}/${candidate.graphOptimizationLevel} · ${text.modelSize}: ${formatBytes(candidate.expectedBytes)} · `
      + candidate.artifacts.map((artifact) => `${artifact.file} (${formatBytes(artifact.bytes)})`).join(", ");
    utteranceCounter.textContent = `${utteranceIndex + 1}/${VOICE_QUALITY_UTTERANCES.length}`;
    expected.textContent = `${text.expected}: ${utterance.expected}`;
    progress.hidden = phase !== "installing";
    progressValue.hidden = phase !== "installing";
    installButton.disabled = busy || installed;
    removeButton.disabled = busy;
    startButton.disabled = busy || !installed;
    stopButton.disabled = phase !== "recording";
    clearButton.disabled = !results.has(resultKey(selectedId, utterance.id));
    previousButton.disabled = phase === "recording" || phase === "transcribing";
    nextButton.disabled = previousButton.disabled;
    exportButton.disabled = results.size === 0;
    status.textContent = statusMessage;
    renderResults();
    renderAggregates();
  }

  function renderResults(): void {
    resultTable.replaceChildren();
    const headerRow = document.createElement("tr");
    for (const label of [
      "#",
      text.candidate,
      "Expected",
      "Transcript",
      "Normalized difference",
      "WER",
      "Critical tokens",
      "Person / number / deadline",
      "Audio / transcription",
      "Run / backend / bytes",
      text.rating,
    ]) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = label;
      headerRow.append(cell);
    }
    const head = document.createElement("thead");
    head.append(headerRow);
    const body = document.createElement("tbody");
    VOICE_QUALITY_UTTERANCES.forEach((utterance, index) => {
      const result = results.get(resultKey(selectedId, utterance.id));
      const row = document.createElement("tr");
      appendCell(row, String(index + 1));
      appendCell(row, selected().label);
      appendCell(row, utterance.expected);
      appendCell(row, result?.error ? `${text.failed}: ${result.error}` : result?.transcript ?? "—");
      appendCell(row, result?.normalizedDifference ?? "—");
      appendCell(row, result ? result.wordErrorRate.toFixed(2) : "—");
      appendCell(row, result ? result.criticalTokenFailures.join(", ") || "PASS" : "—");
      appendCell(
        row,
        result
          ? `person ${formatPreservation(result.personPreserved)} · number ${formatPreservation(result.numberPreserved)} · deadline ${formatPreservation(result.deadlinePreserved)}`
          : "—",
      );
      appendCell(
        row,
        result
          ? `${formatMs(result.metrics.audioDurationMs)} / ${formatMs(result.metrics.transcriptionDurationMs)} · RTF ${formatNumber(result.metrics.realTimeFactor ?? null)}`
          : "—",
      );
      appendCell(
        row,
        result
          ? `${result.metrics.runKind ?? "—"} / ${result.metrics.backend} / ${result.metrics.modelBytes === undefined ? "—" : formatBytes(result.metrics.modelBytes)}`
          : "—",
      );
      const ratingCell = document.createElement("td");
      const rating = document.createElement("select");
      rating.ariaLabel = `${text.rating} ${index + 1}`;
      rating.disabled = !result || Boolean(result.error);
      for (const [value, label] of [
        ["unrated", text.unrated],
        ["correct", text.correct],
        ["meaning-preserved", text.meaning],
        ["unsafe-wrong", text.unsafe],
      ] as const) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        rating.append(option);
      }
      rating.value = result?.manualRating ?? "unrated";
      rating.addEventListener("change", () => {
        if (result) {
          result.manualRating = rating.value as VoiceQualityManualRating;
          renderAggregates();
        }
      });
      ratingCell.append(rating);
      row.append(ratingCell);
      body.append(row);
    });
    resultTable.append(head, body);
  }

  function renderAggregates(): void {
    aggregates.replaceChildren();
    for (const id of VOICE_QUALITY_CANDIDATE_ORDER) {
      const candidateResults = [...results.values()].filter((result) => result.candidateId === id);
      const aggregate = aggregateVoiceQuality(candidateResults);
      const block = document.createElement("article");
      const heading = document.createElement("h3");
      heading.textContent = VOICE_QUALITY_CANDIDATES[id].label;
      const summary = document.createElement("p");
      summary.textContent =
        `${aggregate.completed}/10 · WER≤0.10 ${aggregate.exactOrNearExact}/10 · `
        + `meaning ${aggregate.meaningPreserved}/10 · critical failures ${aggregate.criticalTokenFailures} · `
        + `median RTF ${formatNumber(aggregate.medianRtf)} · worst RTF ${formatNumber(aggregate.worstRtf)} · `
        + `cold ${formatMs(aggregate.coldLoadMs ?? undefined)} · warm ${formatMs(aggregate.warmLoadMs ?? undefined)} · `
        + `failures ${aggregate.failures} · `
        + aggregate.verdict;
      block.append(heading, summary);
      aggregates.append(block);
    }
  }

  function downloadReport(): void {
    const payload = {
      schema: "today-board-voice-quality-matrix-v1",
      generatedAt: new Date().toISOString(),
      memoryOnlyAudio: true,
      candidates: VOICE_QUALITY_CANDIDATE_ORDER.map((id) => ({
        ...VOICE_QUALITY_CANDIDATES[id],
        results: [...results.values()].filter((result) => result.candidateId === id),
        aggregate: aggregateVoiceQuality([...results.values()].filter((result) => result.candidateId === id)),
      })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "today-board-voice-quality-matrix.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function createWorker(): Worker {
    const instance = new Worker(new URL("../voice/voiceQuality.worker.ts", import.meta.url), { type: "module" });
    instance.addEventListener("message", onWorkerMessage);
    instance.addEventListener("error", onWorkerCrash);
    return instance;
  }

  function onWorkerMessage(event: MessageEvent<VoiceQualityResponse>): void {
    const response = event.data;
    if (response.type === "progress") {
      progress.value = response.total > 0 ? Math.min(1, response.loaded / response.total) : 0;
      progressValue.textContent = `${formatBytes(response.loaded)} / ${formatBytes(response.total)} · ${response.files} files`;
      return;
    }
    const waiter = pending.get(response.id);
    if (!waiter) {
      return;
    }
    pending.delete(response.id);
    response.type === "error" ? waiter.reject(new Error(response.message)) : waiter.resolve(response);
  }

  function onWorkerCrash(event: ErrorEvent): void {
    const crashedDuringSample = phase === "recording" || phase === "transcribing";
    for (const waiter of pending.values()) {
      waiter.reject(new Error(event.message || "VOICE_QUALITY_WORKER_CRASH"));
    }
    pending.clear();
    void cancelCapture();
    setBusy(false);
    phase = "failure";
    statusMessage = `${text.failed}: ${event.message || "worker crash"}`;
    if (crashedDuringSample) {
      const utterance = VOICE_QUALITY_UTTERANCES[utteranceIndex];
      results.set(resultKey(selectedId, utterance.id), {
        ...analyzeVoiceQualityResult(selectedId, utterance, "", loadMetrics),
        error: event.message || "VOICE_QUALITY_WORKER_CRASH",
      });
    }
    render();
  }

  function request(
    payload: VoiceQualityRequestPayload,
    transfer: Transferable[] = [],
  ): Promise<VoiceQualityResponse> {
    const id = ++requestSequence;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      worker.postMessage({ ...payload, id } as VoiceQualityRequest, transfer);
    });
  }

  async function standaloneRequest(
    instance: Worker,
    payload: VoiceQualityRequestPayload,
  ): Promise<VoiceQualityResponse> {
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("VERIFY_TIMEOUT")), 120_000);
      instance.addEventListener("message", (event: MessageEvent<VoiceQualityResponse>) => {
        if (event.data.id !== 1) {
          return;
        }
        window.clearTimeout(timeout);
        event.data.type === "error" ? reject(new Error(event.data.message)) : resolve(event.data);
      });
      instance.addEventListener("error", (event) => reject(new Error(event.message)));
      instance.postMessage({ ...payload, id: 1 } as VoiceQualityRequest);
    });
  }

  async function replaceWorker(): Promise<void> {
    worker.terminate();
    pending.clear();
    worker = createWorker();
  }

  async function cancelCapture(): Promise<void> {
    const active = capture;
    capture = undefined;
    if (active) {
      await active.cancel().catch(() => undefined);
    }
  }

  async function destroy(): Promise<void> {
    if (destroyed) {
      return;
    }
    destroyed = true;
    window.removeEventListener("pagehide", navigationCleanup);
    window.removeEventListener("popstate", navigationCleanup);
    await cancelCapture();
    worker.terminate();
    pending.clear();
    setBusy(false);
  }

  function selected(): VoiceQualityCandidate {
    return VOICE_QUALITY_CANDIDATES[selectedId];
  }

  function isBusy(): boolean {
    return phase === "checking"
      || phase === "installing"
      || phase === "recording"
      || phase === "transcribing"
      || phase === "removing";
  }

  function setBusy(value: boolean): void {
    document.documentElement.dataset.voiceQualityBusy = String(value);
  }
}

async function readMarker(candidate: VoiceQualityCandidate): Promise<InstallationMarker | undefined> {
  if (!("caches" in window) || !await caches.has(candidate.markerCache)) {
    return undefined;
  }
  const response = await (await caches.open(candidate.markerCache)).match(markerPath(candidate));
  if (!response) {
    return undefined;
  }
  try {
    const marker = await response.json() as InstallationMarker;
    return marker.candidateId === candidate.id && marker.configurationIdentity === candidate.configurationIdentity
      ? marker
      : undefined;
  } catch {
    return undefined;
  }
}

async function hasCandidateData(candidate: VoiceQualityCandidate): Promise<boolean> {
  return "caches" in window
    && (await caches.has(candidate.cacheKey) || await caches.has(candidate.markerCache));
}

async function writeMarker(candidate: VoiceQualityCandidate): Promise<void> {
  const marker: InstallationMarker = {
    candidateId: candidate.id,
    configurationIdentity: candidate.configurationIdentity,
    verifiedAt: new Date().toISOString(),
  };
  await (await caches.open(candidate.markerCache)).put(
    markerPath(candidate),
    new Response(JSON.stringify(marker), { headers: { "content-type": "application/json" } }),
  );
}

async function deleteMarker(candidate: VoiceQualityCandidate): Promise<void> {
  if ("caches" in window && await caches.has(candidate.markerCache)) {
    await caches.delete(candidate.markerCache);
  }
}

function markerPath(candidate: VoiceQualityCandidate): string {
  return `./__voice-quality/${candidate.configurationIdentity}`;
}

function resultKey(candidateId: VoiceQualityCandidateId, utteranceId: string): string {
  return `${candidateId}:${utteranceId}`;
}

function button(label: string, className = ""): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  return element;
}

function appendCell(row: HTMLTableRowElement, value: string): void {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.append(cell);
}

function formatBytes(value: number): string {
  return `${(value / 1024 / 1024).toFixed(1)} MiB`;
}

function formatNumber(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

function formatMs(value: number | undefined): string {
  return value === undefined ? "—" : `${Math.round(value)} ms`;
}

function formatPreservation(value: boolean | null): string {
  return value === null ? "n/a" : value ? "PASS" : "FAIL";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

import type { Language } from "./i18n";
import {
  LOCAL_SPEECH_LANGUAGES,
  createOnDeviceRecognition,
  getLocalSpeechRecognitionConstructor,
  inspectLocalSpeechFeatures,
  installLocalLanguage,
  queryLocalLanguageAvailability,
  type LocalSpeechAvailability,
  type LocalSpeechLanguage,
  type LocalSpeechRecognition,
  type SpeechRecognitionErrorEventLike,
  type SpeechRecognitionResultEventLike,
  type SpeechRecognitionScope,
} from "../voice/onDeviceSpeech";

interface VoiceCapabilityProbeProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export interface VoiceCapabilityProbeHandle {
  element: HTMLElement;
  destroy: () => void;
}

const voiceProbeCopy = {
  en: {
    title: "On-device Voice Capability Probe",
    internal: "Internal probe",
    description: "Checks whether this installed PWA can recognize speech privately on this device. Nothing is added to Today Board.",
    language: "Probe language",
    uiLanguage: "Interface language",
    availability: "Language pack",
    install: "Download language pack",
    installHelp: "Downloading starts only when you choose this action.",
    start: "Start",
    stop: "Stop",
    clear: "Clear",
    interim: "Interim transcript",
    final: "Final transcript",
    emptyTranscript: "Nothing recognized yet.",
    status: "Probe status",
    privacy: "On-device only. No audio or transcript is saved, uploaded, or added to a Situation.",
    unsupported: "Private on-device speech recognition is not supported by this browser or device.",
    localUnavailable: "Local processing is unavailable. Voice is not available privately on this device.",
    checking: "Checking on-device availability...",
    installing: "Downloading the selected language pack...",
    ready: "The selected language pack is available on this device.",
    listening: "Listening on this device...",
    stopping: "Stopping recognition...",
    stopped: "Recognition stopped.",
    installFailed: "The language pack could not be installed.",
    recognitionFailed: "On-device recognition failed",
    updateBlocked: "On-device recognition is active. Stop it before reloading.",
    featureLabels: {
      recognition: "SpeechRecognition",
      availability: "SpeechRecognition.available",
      install: "SpeechRecognition.install",
      processLocally: "processLocally",
    },
    yes: "Available",
    no: "Unavailable",
    availabilityStates: {
      unavailable: "Unavailable",
      downloadable: "Downloadable",
      downloading: "Downloading",
      available: "Available",
      failure: "Failure",
    },
  },
  vi: {
    title: "Thử nghiệm khả năng Voice trên thiết bị",
    internal: "Thử nghiệm nội bộ",
    description: "Kiểm tra PWA đã cài có thể nhận dạng giọng nói riêng tư trên thiết bị này hay không. Không có nội dung nào được thêm vào Today Board.",
    language: "Ngôn ngữ thử nghiệm",
    uiLanguage: "Ngôn ngữ giao diện",
    availability: "Gói ngôn ngữ",
    install: "Tải gói ngôn ngữ",
    installHelp: "Chỉ bắt đầu tải khi bạn chủ động chọn thao tác này.",
    start: "Bắt đầu",
    stop: "Dừng",
    clear: "Xóa",
    interim: "Bản chép tạm thời",
    final: "Bản chép cuối cùng",
    emptyTranscript: "Chưa nhận dạng nội dung nào.",
    status: "Trạng thái thử nghiệm",
    privacy: "Chỉ xử lý trên thiết bị. Không lưu hoặc tải lên âm thanh hay bản chép, và không thêm vào Tình huống.",
    unsupported: "Trình duyệt hoặc thiết bị này chưa hỗ trợ nhận dạng giọng nói riêng tư trên thiết bị.",
    localUnavailable: "Không thể xử lý cục bộ. Voice không khả dụng riêng tư trên thiết bị này.",
    checking: "Đang kiểm tra khả năng trên thiết bị...",
    installing: "Đang tải gói ngôn ngữ đã chọn...",
    ready: "Gói ngôn ngữ đã chọn có sẵn trên thiết bị này.",
    listening: "Đang nghe trên thiết bị này...",
    stopping: "Đang dừng nhận dạng...",
    stopped: "Đã dừng nhận dạng.",
    installFailed: "Không thể cài gói ngôn ngữ.",
    recognitionFailed: "Nhận dạng trên thiết bị thất bại",
    updateBlocked: "Đang nhận dạng trên thiết bị. Hãy dừng trước khi tải lại.",
    featureLabels: {
      recognition: "SpeechRecognition",
      availability: "SpeechRecognition.available",
      install: "SpeechRecognition.install",
      processLocally: "processLocally",
    },
    yes: "Có",
    no: "Không có",
    availabilityStates: {
      unavailable: "Không khả dụng",
      downloadable: "Có thể tải",
      downloading: "Đang tải",
      available: "Có sẵn",
      failure: "Thất bại",
    },
  },
} as const;

export function VoiceCapabilityProbe({
  language,
  onLanguageChange,
}: VoiceCapabilityProbeProps): VoiceCapabilityProbeHandle {
  const text = voiceProbeCopy[language];
  const constructor = getLocalSpeechRecognitionConstructor(window as Window & SpeechRecognitionScope);
  const features = inspectLocalSpeechFeatures(constructor);
  let selectedLanguage: LocalSpeechLanguage = "vi-VN";
  let availability: LocalSpeechAvailability = "unavailable";
  let recognition: LocalSpeechRecognition | undefined;
  let recognitionActive = false;
  let finalTranscript = "";
  let interimTranscript = "";
  let availabilityRequest = 0;
  let stopReleaseTimer: number | undefined;
  let destroyed = false;

  const shell = document.createElement("section");
  shell.className = "voice-probe-shell";
  shell.setAttribute("aria-labelledby", "voice-probe-title");

  const header = document.createElement("header");
  header.className = "voice-probe-header";
  const titleGroup = document.createElement("div");
  const badge = document.createElement("p");
  badge.className = "voice-probe-badge";
  badge.textContent = text.internal;
  const title = document.createElement("h1");
  title.id = "voice-probe-title";
  title.textContent = text.title;
  const description = document.createElement("p");
  description.textContent = text.description;
  titleGroup.append(badge, title, description);

  const languageToggle = document.createElement("div");
  languageToggle.className = "language-toggle";
  languageToggle.setAttribute("aria-label", text.uiLanguage);
  for (const option of ["vi", "en"] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = option === language ? "language-button active" : "language-button";
    button.textContent = option.toUpperCase();
    button.addEventListener("click", () => onLanguageChange(option));
    languageToggle.append(button);
  }
  header.append(titleGroup, languageToggle);

  const privacy = document.createElement("p");
  privacy.className = "voice-probe-privacy";
  privacy.textContent = text.privacy;

  const featureList = document.createElement("dl");
  featureList.className = "voice-probe-features";
  for (const key of ["recognition", "availability", "install", "processLocally"] as const) {
    const term = document.createElement("dt");
    term.textContent = text.featureLabels[key];
    const detail = document.createElement("dd");
    detail.textContent = features[key] ? text.yes : text.no;
    detail.dataset.available = String(features[key]);
    featureList.append(term, detail);
  }

  const languageField = document.createElement("label");
  languageField.className = "voice-probe-field";
  const languageLabel = document.createElement("span");
  languageLabel.textContent = text.language;
  const languageSelect = document.createElement("select");
  languageSelect.ariaLabel = text.language;
  for (const option of LOCAL_SPEECH_LANGUAGES) {
    const item = document.createElement("option");
    item.value = option;
    item.textContent = option;
    languageSelect.append(item);
  }
  languageField.append(languageLabel, languageSelect);

  const availabilityRow = document.createElement("div");
  availabilityRow.className = "voice-probe-availability";
  const availabilityLabel = document.createElement("span");
  availabilityLabel.textContent = text.availability;
  const availabilityValue = document.createElement("strong");
  availabilityValue.setAttribute("aria-live", "polite");
  availabilityRow.append(availabilityLabel, availabilityValue);

  const installButton = document.createElement("button");
  installButton.type = "button";
  installButton.className = "quiet-button";
  installButton.textContent = text.install;
  const installHelp = document.createElement("p");
  installHelp.className = "voice-probe-help";
  installHelp.textContent = text.installHelp;

  const controls = document.createElement("div");
  controls.className = "voice-probe-controls";
  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.textContent = text.start;
  const stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.className = "quiet-button";
  stopButton.textContent = text.stop;
  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "quiet-button";
  clearButton.textContent = text.clear;
  controls.append(startButton, stopButton, clearButton);

  const transcript = document.createElement("div");
  transcript.className = "voice-probe-transcript";
  const interimHeading = document.createElement("h2");
  interimHeading.textContent = text.interim;
  const interimOutput = document.createElement("p");
  interimOutput.className = "voice-probe-output interim";
  interimOutput.setAttribute("aria-live", "polite");
  const finalHeading = document.createElement("h2");
  finalHeading.textContent = text.final;
  const finalOutput = document.createElement("p");
  finalOutput.className = "voice-probe-output final";
  finalOutput.setAttribute("aria-live", "polite");
  transcript.append(interimHeading, interimOutput, finalHeading, finalOutput);

  const status = document.createElement("p");
  status.className = "voice-probe-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.ariaLabel = text.status;

  shell.append(
    header,
    privacy,
    featureList,
    languageField,
    availabilityRow,
    installButton,
    installHelp,
    controls,
    transcript,
    status,
  );

  languageSelect.addEventListener("change", () => {
    stopRecognition(true);
    selectedLanguage = languageSelect.value as LocalSpeechLanguage;
    void checkAvailability();
  });

  installButton.addEventListener("click", async () => {
    if (!constructor || availability !== "downloadable" || !features.install) {
      return;
    }

    availability = "downloading";
    status.textContent = text.installing;
    renderState();
    const installed = await installLocalLanguage(constructor, selectedLanguage);
    if (!installed) {
      availability = "failure";
      status.textContent = text.installFailed;
      renderState();
      return;
    }
    await checkAvailability();
  });

  startButton.addEventListener("click", () => {
    if (!constructor || availability !== "available" || !features.processLocally || recognitionActive) {
      status.textContent = text.localUnavailable;
      return;
    }

    recognition = createOnDeviceRecognition(constructor, selectedLanguage);
    recognition.onstart = () => {
      setRecognitionActive(true);
      status.textContent = text.listening;
      renderState();
    };
    recognition.onresult = (event: SpeechRecognitionResultEventLike) => handleResult(event);
    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      status.textContent = `${text.recognitionFailed}${event.error ? `: ${event.error}` : "."}`;
      stopRecognition(true);
    };
    recognition.onend = () => {
      if (recognitionActive) {
        status.textContent = text.stopped;
      }
      releaseRecognition();
    };

    try {
      setRecognitionActive(true);
      status.textContent = text.listening;
      recognition.start();
      renderState();
    } catch {
      status.textContent = text.recognitionFailed;
      releaseRecognition();
    }
  });

  stopButton.addEventListener("click", () => {
    const activeRecognition = recognition;
    if (!activeRecognition) {
      releaseRecognition();
      return;
    }
    status.textContent = text.stopping;
    try {
      activeRecognition.stop();
      window.clearTimeout(stopReleaseTimer);
      stopReleaseTimer = window.setTimeout(() => {
        if (recognition === activeRecognition) {
          stopRecognition(true);
        }
      }, 1000);
    } catch {
      stopRecognition(true);
    }
    renderState();
  });

  clearButton.addEventListener("click", () => {
    finalTranscript = "";
    interimTranscript = "";
    renderTranscript();
  });

  const cleanupForNavigation = () => stopRecognition(true);
  window.addEventListener("pagehide", cleanupForNavigation);
  window.addEventListener("popstate", cleanupForNavigation);

  renderTranscript();
  renderState();
  void checkAvailability();

  return {
    element: shell,
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      availabilityRequest += 1;
      window.removeEventListener("pagehide", cleanupForNavigation);
      window.removeEventListener("popstate", cleanupForNavigation);
      stopRecognition(true);
    },
  };

  async function checkAvailability(): Promise<void> {
    const request = ++availabilityRequest;
    status.textContent = text.checking;
    if (!constructor || !features.recognition) {
      availability = "unavailable";
      status.textContent = text.unsupported;
      renderState();
      return;
    }
    if (!features.availability || !features.processLocally) {
      availability = "unavailable";
      status.textContent = text.localUnavailable;
      renderState();
      return;
    }

    const nextAvailability = await queryLocalLanguageAvailability(constructor, selectedLanguage);
    if (destroyed || request !== availabilityRequest) {
      return;
    }
    availability = nextAvailability;
    status.textContent = availability === "available" ? text.ready : availability === "failure" ? text.localUnavailable : "";
    renderState();
  }

  function handleResult(event: SpeechRecognitionResultEventLike): void {
    const interim: string[] = [];
    const completed: string[] = [];
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const value = result?.[0]?.transcript?.trim();
      if (!value) {
        continue;
      }
      if (result.isFinal) {
        completed.push(value);
      } else {
        interim.push(value);
      }
    }
    if (completed.length > 0) {
      finalTranscript = [finalTranscript, ...completed].filter(Boolean).join(" ");
    }
    interimTranscript = interim.join(" ");
    renderTranscript();
  }

  function stopRecognition(abort: boolean): void {
    const activeRecognition = recognition;
    recognition = undefined;
    if (activeRecognition) {
      activeRecognition.onstart = null;
      activeRecognition.onresult = null;
      activeRecognition.onerror = null;
      activeRecognition.onend = null;
      try {
        if (abort) {
          activeRecognition.abort();
        } else {
          activeRecognition.stop();
        }
      } catch {
        // The browser may already have ended the recognition session.
      }
    }
    releaseRecognition();
  }

  function releaseRecognition(): void {
    window.clearTimeout(stopReleaseTimer);
    stopReleaseTimer = undefined;
    recognition = undefined;
    setRecognitionActive(false);
    renderState();
  }

  function setRecognitionActive(active: boolean): void {
    recognitionActive = active;
    shell.dataset.recognitionActive = String(active);
    if (active) {
      document.documentElement.dataset.voiceRecognitionActive = "true";
      document.documentElement.dataset.pwaBusy = "true";
      return;
    }
    if (document.documentElement.dataset.voiceRecognitionActive === "true") {
      delete document.documentElement.dataset.voiceRecognitionActive;
      delete document.documentElement.dataset.pwaBusy;
    }
  }

  function renderState(): void {
    availabilityValue.textContent = text.availabilityStates[availability];
    availabilityValue.dataset.state = availability;
    installButton.hidden = availability !== "downloadable";
    installButton.disabled = recognitionActive;
    languageSelect.disabled = recognitionActive;
    startButton.disabled = availability !== "available" || recognitionActive || !features.processLocally;
    stopButton.disabled = !recognitionActive;
  }

  function renderTranscript(): void {
    interimOutput.textContent = interimTranscript || text.emptyTranscript;
    finalOutput.textContent = finalTranscript || text.emptyTranscript;
  }
}

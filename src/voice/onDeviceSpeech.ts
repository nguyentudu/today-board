export const LOCAL_SPEECH_LANGUAGES = ["vi-VN", "en-US"] as const;

export type LocalSpeechLanguage = (typeof LOCAL_SPEECH_LANGUAGES)[number];
export type LocalSpeechAvailability = "unavailable" | "downloadable" | "downloading" | "available" | "failure";

export interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

export interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

export interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

export interface SpeechRecognitionResultEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

export interface SpeechRecognitionErrorEventLike extends Event {
  error?: string;
  message?: string;
}

export interface LocalSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  processLocally: boolean;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface LocalSpeechOptions {
  langs: string[];
  processLocally: true;
}

export interface LocalSpeechRecognitionConstructor {
  new (): LocalSpeechRecognition;
  prototype: LocalSpeechRecognition;
  available?(options: LocalSpeechOptions): Promise<unknown>;
  install?(options: LocalSpeechOptions): Promise<boolean>;
}

export interface SpeechRecognitionScope {
  SpeechRecognition?: LocalSpeechRecognitionConstructor;
  webkitSpeechRecognition?: LocalSpeechRecognitionConstructor;
}

export interface LocalSpeechFeatures {
  recognition: boolean;
  availability: boolean;
  install: boolean;
  processLocally: boolean;
}

export function getLocalSpeechRecognitionConstructor(
  scope: SpeechRecognitionScope,
): LocalSpeechRecognitionConstructor | undefined {
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

export function inspectLocalSpeechFeatures(
  constructor: LocalSpeechRecognitionConstructor | undefined,
): LocalSpeechFeatures {
  let processLocally = false;
  if (constructor) {
    try {
      processLocally = "processLocally" in new constructor();
    } catch {
      processLocally = false;
    }
  }

  return {
    recognition: Boolean(constructor),
    availability: typeof constructor?.available === "function",
    install: typeof constructor?.install === "function",
    processLocally,
  };
}

export async function queryLocalLanguageAvailability(
  constructor: LocalSpeechRecognitionConstructor,
  language: LocalSpeechLanguage,
): Promise<LocalSpeechAvailability> {
  if (typeof constructor.available !== "function") {
    return "unavailable";
  }

  try {
    const result = await constructor.available({ langs: [language], processLocally: true });
    return isLocalSpeechAvailability(result) ? result : "failure";
  } catch {
    return "failure";
  }
}

export async function installLocalLanguage(
  constructor: LocalSpeechRecognitionConstructor,
  language: LocalSpeechLanguage,
): Promise<boolean> {
  if (typeof constructor.install !== "function") {
    return false;
  }

  try {
    return await constructor.install({ langs: [language], processLocally: true });
  } catch {
    return false;
  }
}

export function createOnDeviceRecognition(
  constructor: LocalSpeechRecognitionConstructor,
  language: LocalSpeechLanguage,
): LocalSpeechRecognition {
  const recognition = new constructor();
  recognition.processLocally = true;
  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  return recognition;
}

function isLocalSpeechAvailability(value: unknown): value is Exclude<LocalSpeechAvailability, "failure"> {
  return value === "unavailable" || value === "downloadable" || value === "downloading" || value === "available";
}

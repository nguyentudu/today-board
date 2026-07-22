import { readFileSync } from "node:fs";
import ts from "typescript";

const appSource = readFileSync("src/app.ts", "utf8");
const probeSource = readFileSync("src/ui/VoiceCapabilityProbe.ts", "utf8");
const speechSource = readFileSync("src/voice/onDeviceSpeech.ts", "utf8");
const boardSource = readFileSync("src/ui/Board.ts", "utf8");
const swSource = readFileSync("public/sw.js", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

const executableSpeech = ts.transpileModule(speechSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const speech = await import(`data:text/javascript;base64,${Buffer.from(executableSpeech).toString("base64")}`);

let availabilityResult = "available";
let availableOptions;
let installOptions;

class FakeRecognition {
  static async available(options) {
    availableOptions = options;
    return availabilityResult;
  }

  static async install(options) {
    installOptions = options;
    return true;
  }

  processLocally = false;
  lang = "";
  continuous = true;
  interimResults = false;
  maxAlternatives = 99;
  onstart = null;
  onend = null;
  onresult = null;
  onerror = null;
  start() {}
  stop() {}
  abort() {}
}

const features = speech.inspectLocalSpeechFeatures(FakeRecognition);
assert(
  "feature detection covers recognition availability install and processLocally",
  features.recognition && features.availability && features.install && features.processLocally,
);

for (const state of ["unavailable", "downloadable", "downloading", "available"]) {
  availabilityResult = state;
  const observed = await speech.queryLocalLanguageAvailability(FakeRecognition, "vi-VN");
  assert(`language availability preserves ${state}`, observed === state);
}
availabilityResult = "unexpected";
assert(
  "unknown availability is fail closed",
  await speech.queryLocalLanguageAvailability(FakeRecognition, "vi-VN") === "failure",
);

availabilityResult = "available";
await speech.queryLocalLanguageAvailability(FakeRecognition, "vi-VN");
assert(
  "availability query is on-device only",
  availableOptions?.processLocally === true
    && availableOptions?.langs?.length === 1
    && availableOptions.langs[0] === "vi-VN",
);
assert(
  "language-pack installation is on-device only",
  await speech.installLocalLanguage(FakeRecognition, "en-US")
    && installOptions?.processLocally === true
    && installOptions?.langs?.[0] === "en-US",
);

const recognition = speech.createOnDeviceRecognition(FakeRecognition, "vi-VN");
assert(
  "recognition is bounded and local only",
  recognition.processLocally === true
    && recognition.lang === "vi-VN"
    && recognition.continuous === false
    && recognition.interimResults === true
    && recognition.maxAlternatives === 1,
);

assert(
  "probe is hidden unless the exact query flag is present",
  appSource.includes('get("voice-probe") === "1"')
    && appSource.includes("if (voiceProbeMode)")
    && !boardSource.includes("VoiceCapabilityProbe"),
);
const probeGuard = "if (!voiceProbeMode && !voiceEngineProbeMode)";
const probeModeSetup = appSource.slice(appSource.indexOf(probeGuard), appSource.indexOf("setupNetworkStatus()"));
assert(
  "probe mode performs no board load mutation or storage write",
  appSource.includes(probeGuard)
    && probeModeSetup.includes("loadBoard()")
    && probeModeSetup.includes("saveBoard(board)")
    && appSource.indexOf(probeGuard) < appSource.indexOf("loadBoard()")
    && !probeSource.includes("localStorage")
    && !probeSource.includes("saveBoard")
    && !probeSource.includes("trySaveBoard")
    && !probeSource.includes("onChange"),
);
assert(
  "no cloud speech fallback or transcription request exists",
  !probeSource.includes("fetch(")
    && !probeSource.includes("XMLHttpRequest")
    && !speechSource.includes("fetch(")
    && speechSource.includes("processLocally: true"),
);
assert(
  "raw audio is not captured or retained by the probe",
  !probeSource.includes("MediaRecorder")
    && !probeSource.includes("getUserMedia")
    && !probeSource.includes("Blob")
    && !probeSource.includes("dataUrl"),
);
const installHandler = probeSource.slice(
  probeSource.indexOf('installButton.addEventListener("click"'),
  probeSource.indexOf('startButton.addEventListener("click"'),
);
assert(
  "language-pack installation requires explicit user action",
  installHandler.includes("installLocalLanguage") && !probeSource.slice(0, probeSource.indexOf(installHandler)).includes("installLocalLanguage("),
);
assert(
  "Vietnamese is first and English remains compatible",
  speechSource.includes('["vi-VN", "en-US"]') && probeSource.includes('selectedLanguage: LocalSpeechLanguage = "vi-VN"'),
);
assert(
  "all language-pack states and unsupported fallback are visible",
  ["unavailable", "downloadable", "downloading", "available", "failure"].every((state) => probeSource.includes(`${state}:`))
    && probeSource.includes("text.unsupported")
    && probeSource.includes("text.localUnavailable"),
);
assert(
  "recognition lifecycle releases active resources",
  probeSource.includes('window.addEventListener("pagehide"')
    && probeSource.includes('window.addEventListener("popstate"')
    && probeSource.includes("activeRecognition.abort()")
    && probeSource.includes("recognition.onerror")
    && probeSource.includes("recognition.onend")
    && probeSource.includes("stopRecognition(true)")
    && probeSource.includes("stopReleaseTimer = window.setTimeout")
    && probeSource.includes("recognition === activeRecognition"),
);
assert(
  "active recognition blocks PWA update activation",
  probeSource.includes('dataset.voiceRecognitionActive = "true"')
    && probeSource.includes('dataset.pwaBusy = "true"')
    && appSource.includes('dataset.voiceRecognitionActive === "true"')
    && appSource.includes("On-device recognition is active"),
);
assert(
  "probe copy is available in Vietnamese and English",
  probeSource.includes("On-device Voice Capability Probe")
    && probeSource.includes("Thử nghiệm khả năng Voice trên thiết bị")
    && probeSource.includes('ariaLabel = text.status'),
);
assert(
  "probe exposes transcript status and explicit controls",
  probeSource.includes("interimTranscript")
    && probeSource.includes("finalTranscript")
    && probeSource.includes("startButton")
    && probeSource.includes("stopButton")
    && probeSource.includes("clearButton"),
);
assert(
  "voice capability test is registered",
  packageJson.scripts["test:voice-capability"] === "node scripts/verify-voice-capability.mjs",
);
assert(
  "app and service-worker identities move together",
  appSource.includes('BUILD_ID = "2026.07.23-c"') && swSource.includes('CACHE_VERSION = "2026-07-23-c"'),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

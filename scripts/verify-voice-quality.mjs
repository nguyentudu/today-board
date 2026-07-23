import { readFileSync } from "node:fs";
import ts from "typescript";

const app = readFileSync("src/app.ts", "utf8");
const protocol = readFileSync("src/voice/voiceQualityProtocol.ts", "utf8");
const worker = readFileSync("src/voice/voiceQuality.worker.ts", "utf8");
const probe = readFileSync("src/ui/VoiceQualityProbe.ts", "utf8");
const metrics = readFileSync("src/voice/voiceQualityMetrics.ts", "utf8");
const audio = readFileSync("src/voice/voiceQualityAudio.ts", "utf8");
const sw = readFileSync("public/sw.js", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const failures = [];

function assert(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(name);
  }
}

function executable(source) {
  const stripped = source
    .replace(/import\s+type[\s\S]*?from\s+["'][^"']+["'];\s*/g, "")
    .replace(/import[\s\S]*?from\s+["'][^"']+["'];\s*/g, "");
  return ts.transpileModule(stripped, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

const pure = await import(
  `data:text/javascript;base64,${Buffer.from(`${executable(audio)}\n${executable(metrics)}`).toString("base64")}`
);

assert(
  "quality probe is hidden and unloaded by default",
  app.includes('get("voice-quality-probe") === "1"')
    && app.includes('import("./ui/VoiceQualityProbe")')
    && !app.includes('from "./ui/VoiceQualityProbe"'),
);
assert(
  "normal board skips board loading for all probes",
  app.includes("!voiceProbeMode && !voiceEngineProbeMode && !voiceQualityProbeMode"),
);
assert(
  "three exact candidates are bounded",
  protocol.includes('"tiny-baseline"')
    && protocol.includes('"tiny-improved"')
    && protocol.includes('"base-improved"')
    && protocol.includes("VOICE_QUALITY_CANDIDATE_ORDER")
    && protocol.includes("81_294_262"),
);
assert(
  "base model is exact multilingual Apache candidate under size cap",
  protocol.includes('"onnx-community/whisper-base"')
    && protocol.includes('"1846881b6b3a3024392c1eea3ad983695bc23925"')
    && protocol.includes('"Apache-2.0"')
    && protocol.includes("81_294_262")
    && 81_294_262 <= 160 * 1024 * 1024,
);
assert(
  "baseline preserves exact Android artifact configuration",
  protocol.includes('"ff4177021cc41f7db950912b73ea4fdf7d01d8e7"')
    && protocol.includes('"uint8"')
    && protocol.includes('"disabled"')
    && protocol.includes('"baseline"'),
);
assert(
  "improved variants are explicit deterministic audio-prepared configurations",
  protocol.includes('"normalized-trimmed"')
    && protocol.match(/deterministicDecoding: true/g)?.length === 2
    && worker.includes("do_sample: false")
    && worker.includes("num_beams: 1")
    && worker.includes("temperature: 0"),
);
assert(
  "install is explicit and candidate switching does not cascade downloads",
  probe.includes('installButton.addEventListener("click"')
    && worker.includes("candidate(request.candidateId)")
    && !worker.includes("for (const candidate"),
);
assert(
  "fresh worker cache-only session precedes marker write",
  probe.indexOf("await freshVerify(selectedId)") < probe.indexOf("await writeMarker(selected())")
    && worker.includes("local_files_only: localFilesOnly")
    && worker.includes("withRemoteNetworkBlocked"),
);
const installSection = worker.slice(worker.indexOf("async function install"), worker.indexOf("async function verify"));
assert(
  "install timing cannot populate cache-cold timing",
  installSection.includes("downloadDurationMs")
    && installSection.includes("installationSessionDurationMs")
    && !installSection.includes("cacheColdLoadDurationMs"),
);
assert(
  "first post-install benchmark uses a fresh cache-only pipeline",
  probe.includes("await freshVerify(selectedId)")
    && probe.includes("await replaceWorker()")
    && worker.includes("await loadPipeline(selected, true)")
    && worker.includes('runKind: wasLoaded ? "warm" : "cache-cold"'),
);
assert(
  "subsequent prepared pipeline is classified warm",
  worker.includes("loadedCandidateId === selected.id")
    && worker.includes("metrics.warmLoadDurationMs")
    && worker.includes("metrics.cacheColdLoadDurationMs"),
);
assert(
  "candidate caches and cleanup are exact",
  new Set([...protocol.matchAll(/cacheKey: "([^"]+)"/g)].map((match) => match[1])).size === 3
    && worker.includes("isExactPinnedModelRequest")
    && worker.includes("caches.delete(selected.cacheKey)"),
);
assert(
  "ten fixed Vietnamese benchmarks cover continuity truth",
  (metrics.match(/id: "/g) ?? []).length === 10
    && metrics.includes('"person"')
    && metrics.includes('"promise"')
    && metrics.includes('"number"')
    && metrics.includes('"deadline"')
    && metrics.includes('"approval"'),
);
assert(
  "reporting includes WER critical failures runtime and explicit verdicts",
  metrics.includes("wordErrorRate")
    && metrics.includes("criticalTokenFailures")
    && metrics.includes("medianRtf")
    && metrics.includes('"TECHNICAL FAIL"')
    && metrics.includes('"PRODUCT VIABILITY PASS"')
    && probe.includes("Download JSON report"),
);
assert(
  "offline evidence and lifecycle ledgers are exported",
  probe.includes("offlineEvidence:")
    && probe.includes("lifecycleFailureLedger:")
    && protocol.includes("freshCacheVerificationPassed")
    && protocol.includes("offlineInferenceUtteranceId")
    && protocol.includes("workerCrashes"),
);
assert(
  "candidate benchmark reset is explicit",
  probe.includes('resetButton.addEventListener("click"')
    && probe.includes("resetCandidateBenchmark")
    && probe.includes("emptyFailureLedger()"),
);
assert(
  "audio remains memory-only and board storage is untouched",
  probe.includes("startMemoryAudioCapture")
    && !probe.includes("localStorage")
    && !probe.includes("saveBoard")
    && !worker.includes("fetch(")
    && !worker.includes("XMLHttpRequest"),
);
assert(
  "busy and lifecycle cleanup protect PWA updates",
  probe.includes("dataset.voiceQualityBusy")
    && probe.includes('window.addEventListener("pagehide"')
    && probe.includes("worker.terminate()")
    && app.includes('dataset.voiceQualityBusy === "true"'),
);

const source = new Float32Array([0, 0, 0.01, 0.2, -0.4, 0.01, 0, 0]);
const baseline = pure.prepareVoiceQualityAudio(source, "baseline");
const improved = pure.prepareVoiceQualityAudio(source, "normalized-trimmed");
assert("baseline audio remains numerically unchanged", [...baseline].every((value, index) => value === source[index]));
assert(
  "improved audio preparation is bounded and normalized without clipping",
  improved.length > 0 && improved.length <= source.length && Math.max(...improved.map(Math.abs)) <= 0.920001,
);
assert("WER is transparent and exact matches score zero", pure.wordErrorRate("Xin chào", "Xin chào") === 0);
assert(
  "critical-token failures are surfaced",
  pure.analyzeVoiceQualityResult(
    "tiny-baseline",
    pure.VOICE_QUALITY_UTTERANCES[0],
    "Khách đang chờ.",
    { backend: "wasm" },
  ).criticalTokenFailures.length > 0,
);
const idealResults = pure.VOICE_QUALITY_UTTERANCES.map((utterance, index) => {
  const result = pure.analyzeVoiceQualityResult(
    "tiny-improved",
    utterance,
    utterance.expected,
    {
      backend: "wasm",
      cacheColdLoadDurationMs: 1000,
      warmLoadDurationMs: 100,
      audioDurationMs: 1000,
      transcriptionDurationMs: 500,
      realTimeFactor: 0.5,
      runKind: index === 0 ? "cache-cold" : "warm",
    },
  );
  result.manualRating = "correct";
  return result;
});
const fullOfflineEvidence = {
  freshCacheVerificationPassed: true,
  browserReportedOfflineAtColdLoad: true,
  remoteFetchBlockedDuringCacheLoad: true,
  offlineColdLoadPassed: true,
  offlineInferencePassed: true,
  offlineInferenceUtteranceId: pure.VOICE_QUALITY_UTTERANCES[0].id,
};
const zeroFailures = pure.emptyFailureLedger();
const onlineOnlyAggregate = pure.aggregateVoiceQuality(
  idealResults,
  { ...fullOfflineEvidence, browserReportedOfflineAtColdLoad: false, offlineColdLoadPassed: false, offlineInferencePassed: false, offlineInferenceUtteranceId: null },
  zeroFailures,
);
assert(
  "online-only benchmark cannot produce Product Viability PASS",
  onlineOnlyAggregate.verdict !== "PRODUCT VIABILITY PASS"
    && onlineOnlyAggregate.missingAcceptanceGates.includes("BROWSER_REPORTED_OFFLINE_CACHE_COLD_LOAD_REQUIRED")
    && onlineOnlyAggregate.missingAcceptanceGates.includes("BROWSER_REPORTED_OFFLINE_INFERENCE_REQUIRED"),
);
const offlineAggregate = pure.aggregateVoiceQuality(idealResults, fullOfflineEvidence, zeroFailures);
assert(
  "offline verification load and inference satisfy the additional gates",
  offlineAggregate.verdict === "PRODUCT VIABILITY PASS"
    && offlineAggregate.missingAcceptanceGates.length === 0,
);
const failedLifecycleAggregate = pure.aggregateVoiceQuality(
  idealResults,
  fullOfflineEvidence,
  { ...zeroFailures, workerCrashes: 1 },
);
assert(
  "lifecycle failure prevents Product Viability PASS",
  failedLifecycleAggregate.verdict !== "PRODUCT VIABILITY PASS"
    && failedLifecycleAggregate.lifecycleFailures === 1
    && failedLifecycleAggregate.missingAcceptanceGates.includes("ZERO_LIFECYCLE_FAILURES_REQUIRED"),
);
assert(
  "app and cache identities move together",
  app.includes('BUILD_ID = "2026.07.23-e"') && sw.includes('CACHE_VERSION = "2026-07-23-e"'),
);
assert("bounded quality test is registered", packageJson.scripts["test:voice-quality"] === "node scripts/verify-voice-quality.mjs");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

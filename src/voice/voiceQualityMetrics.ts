import type { VoiceQualityCandidateId, VoiceQualityMetrics } from "./voiceQualityProtocol";

export type VoiceQualityManualRating = "unrated" | "correct" | "meaning-preserved" | "unsafe-wrong";
export type VoiceQualityVerdict =
  | "TECHNICAL FAIL"
  | "TECHNICAL PASS — PRODUCT FAIL"
  | "PRODUCT BORDERLINE"
  | "PRODUCT VIABILITY PASS";

export interface CriticalTokenGroup {
  category: "person" | "promise" | "number" | "deadline" | "approval" | "continuity";
  tokens: readonly string[];
}

export interface VoiceQualityUtterance {
  id: string;
  expected: string;
  critical: readonly CriticalTokenGroup[];
}

export interface VoiceQualityResult {
  candidateId: VoiceQualityCandidateId;
  utteranceId: string;
  expected: string;
  transcript: string;
  normalizedExpected: string;
  normalizedTranscript: string;
  normalizedDifference: string;
  wordErrorRate: number;
  exactOrNearExact: boolean;
  criticalTokenFailures: string[];
  personPreserved: boolean | null;
  numberPreserved: boolean | null;
  deadlinePreserved: boolean | null;
  manualRating: VoiceQualityManualRating;
  metrics: VoiceQualityMetrics;
  error?: string;
}

export interface VoiceQualityAggregate {
  completed: number;
  exactOrNearExact: number;
  meaningPreserved: number;
  criticalTokenFailures: number;
  medianRtf: number | null;
  worstRtf: number | null;
  coldLoadMs: number | null;
  warmLoadMs: number | null;
  failures: number;
  verdict: VoiceQualityVerdict;
}

export const VOICE_QUALITY_UTTERANCES: readonly VoiceQualityUtterance[] = [
  {
    id: "waiting-lan-logo",
    expected: "Khách Lan đang chờ logo vòng hai.",
    critical: [
      { category: "person", tokens: ["lan"] },
      { category: "continuity", tokens: ["đang chờ", "logo", "vòng hai"] },
    ],
  },
  {
    id: "promise-friday",
    expected: "Tôi hứa gửi bản mới trước thứ Sáu.",
    critical: [
      { category: "promise", tokens: ["hứa", "gửi"] },
      { category: "deadline", tokens: ["trước thứ sáu"] },
    ],
  },
  {
    id: "return-feedback",
    expected: "Khi quay lại, mở ảnh feedback đầu tiên.",
    critical: [{ category: "continuity", tokens: ["quay lại", "mở", "ảnh feedback", "đầu tiên"] }],
  },
  {
    id: "next-logo-percentage",
    expected: "Bước tiếp theo là giảm logo bên trái mười lăm phần trăm.",
    critical: [
      { category: "number", tokens: ["mười lăm phần trăm"] },
      { category: "continuity", tokens: ["bước tiếp theo", "giảm", "logo bên trái"] },
    ],
  },
  {
    id: "approval-pending",
    expected: "Đã nhận phản hồi nhưng khách chưa duyệt.",
    critical: [{ category: "approval", tokens: ["chưa duyệt"] }],
  },
  {
    id: "waiting-minh-huong",
    expected: "Minh đang chờ chị Hương xác nhận ngân sách.",
    critical: [
      { category: "person", tokens: ["minh", "hương"] },
      { category: "continuity", tokens: ["đang chờ", "xác nhận ngân sách"] },
    ],
  },
  {
    id: "promise-nam-date",
    expected: "Promise với anh Nam là gửi bản trình bày ngày hai mươi lăm tháng Bảy.",
    critical: [
      { category: "person", tokens: ["nam"] },
      { category: "promise", tokens: ["promise", "gửi"] },
      { category: "deadline", tokens: ["ngày hai mươi lăm tháng bảy"] },
    ],
  },
  {
    id: "return-brief",
    expected: "Return Point là mở file brief mới nhất và đọc ghi chú màu đỏ.",
    critical: [{ category: "continuity", tokens: ["return point", "mở file brief mới nhất", "ghi chú màu đỏ"] }],
  },
  {
    id: "next-call-monday",
    expected: "Next Action là gọi khách vào sáng thứ Hai.",
    critical: [
      { category: "continuity", tokens: ["next action", "gọi khách"] },
      { category: "deadline", tokens: ["sáng thứ hai"] },
    ],
  },
  {
    id: "outcome-approved",
    expected: "Outcome là khách đã duyệt logo và không cần sửa thêm.",
    critical: [
      { category: "approval", tokens: ["đã duyệt"] },
      { category: "continuity", tokens: ["outcome", "không cần sửa thêm"] },
    ],
  },
] as const;

export function normalizeVoiceText(value: string): string {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .replace(/[.,!?;:"'()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordErrorRate(expected: string, observed: string): number {
  const reference = normalizeVoiceText(expected).split(" ").filter(Boolean);
  const hypothesis = normalizeVoiceText(observed).split(" ").filter(Boolean);
  if (reference.length === 0) {
    return hypothesis.length === 0 ? 0 : 1;
  }
  return levenshtein(reference, hypothesis) / reference.length;
}

export function analyzeVoiceQualityResult(
  candidateId: VoiceQualityCandidateId,
  utterance: VoiceQualityUtterance,
  transcript: string,
  metrics: VoiceQualityMetrics,
): VoiceQualityResult {
  const normalizedExpected = normalizeVoiceText(utterance.expected);
  const normalizedTranscript = normalizeVoiceText(transcript);
  const criticalTokenFailures = utterance.critical.flatMap((group) =>
    group.tokens
      .filter((token) => !normalizedTranscript.includes(normalizeVoiceText(token)))
      .map((token) => `${group.category}:${token}`),
  );
  const rate = wordErrorRate(utterance.expected, transcript);
  return {
    candidateId,
    utteranceId: utterance.id,
    expected: utterance.expected,
    transcript,
    normalizedExpected,
    normalizedTranscript,
    normalizedDifference:
      normalizedExpected === normalizedTranscript
        ? "IDENTICAL"
        : `${normalizedExpected} → ${normalizedTranscript || "∅"}`,
    wordErrorRate: rate,
    exactOrNearExact: rate <= 0.1,
    criticalTokenFailures,
    personPreserved: categoryPreserved(utterance, criticalTokenFailures, "person"),
    numberPreserved: categoryPreserved(utterance, criticalTokenFailures, "number"),
    deadlinePreserved: categoryPreserved(utterance, criticalTokenFailures, "deadline"),
    manualRating: "unrated",
    metrics,
  };
}

export function aggregateVoiceQuality(results: readonly VoiceQualityResult[]): VoiceQualityAggregate {
  const completed = results.filter((result) => !result.error);
  const rtfs = completed
    .map((result) => result.metrics.realTimeFactor)
    .filter((value): value is number => typeof value === "number")
    .sort((left, right) => left - right);
  const meaningPreserved = completed.filter(
    (result) => result.manualRating === "correct" || result.manualRating === "meaning-preserved",
  ).length;
  const criticalTokenFailures = completed.reduce((sum, result) => sum + result.criticalTokenFailures.length, 0);
  const failures = results.filter((result) => Boolean(result.error)).length;
  const medianRtf = median(rtfs);
  const worstRtf = rtfs.length > 0 ? rtfs[rtfs.length - 1] : null;
  const coldLoadMs = firstDuration(results, "coldLoadDurationMs");
  const warmLoadMs = firstDuration(results, "warmLoadDurationMs");
  const technicalPass =
    failures === 0
    && completed.length === 10
    && medianRtf !== null
    && worstRtf !== null
    && coldLoadMs !== null
    && warmLoadMs !== null;
  const productPass =
    technicalPass
    && meaningPreserved >= 8
    && criticalTokenFailures === 0
    && medianRtf <= 2
    && worstRtf <= 3;
  let verdict: VoiceQualityVerdict;
  if (failures > 0 || completed.length < 10 || coldLoadMs === null || warmLoadMs === null) {
    verdict = "TECHNICAL FAIL";
  } else if (productPass) {
    verdict = "PRODUCT VIABILITY PASS";
  } else if (technicalPass && (meaningPreserved < 7 || criticalTokenFailures > 1 || medianRtf > 3 || worstRtf > 4)) {
    verdict = "TECHNICAL PASS — PRODUCT FAIL";
  } else {
    verdict = "PRODUCT BORDERLINE";
  }
  return {
    completed: completed.length,
    exactOrNearExact: completed.filter((result) => result.exactOrNearExact).length,
    meaningPreserved,
    criticalTokenFailures,
    medianRtf,
    worstRtf,
    coldLoadMs,
    warmLoadMs,
    failures,
    verdict,
  };
}

function categoryPreserved(
  utterance: VoiceQualityUtterance,
  failures: readonly string[],
  category: CriticalTokenGroup["category"],
): boolean | null {
  if (!utterance.critical.some((group) => group.category === category)) {
    return null;
  }
  return !failures.some((failure) => failure.startsWith(`${category}:`));
}

function firstDuration(
  results: readonly VoiceQualityResult[],
  field: "coldLoadDurationMs" | "warmLoadDurationMs",
): number | null {
  return results.find((result) => typeof result.metrics[field] === "number")?.metrics[field] ?? null;
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const middle = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
}

function levenshtein(left: readonly string[], right: readonly string[]): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

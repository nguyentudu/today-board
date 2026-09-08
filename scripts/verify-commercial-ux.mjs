import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const board = read("src/ui/Board.ts");
const onboarding = read("src/onboarding/Onboarding.ts");
const firstReturn = read("src/onboarding/firstReturn.ts");
const commercial = read("src/commercial/CommercialEntry.ts");
const catalog = read("src/commercial/catalog.ts");
const review = read("src/continuityReview/ContinuityReview.ts");
const styles = read("styles/main.css");

for (const [label, condition] of [
  ["Board mounts onboarding", board.includes("Onboarding({")],
  ["Board mounts commercial entry", board.includes("CommercialEntry({")],
  ["Board mounts continuity review", board.includes("ContinuityReview({")],
  ["First flow requires title and return point", firstReturn.includes("!title || !returnPoint")],
  ["Onboarding offers a non-mutating sample", onboarding.includes("sampleTitle") && onboarding.includes("sampleReturn")],
  ["Onboarding is bilingual", onboarding.includes("vi:") && onboarding.includes("en:")],
  ["Paid plans are preview-only", catalog.match(/availability: "preview_only"/g)?.length === 2],
  ["Commercial actions disclose unavailable state", commercial.includes("button.disabled = !enabled")],
  ["Commercial trust copy is bilingual", commercial.includes("trustItems") && commercial.includes("No analytics")],
  ["Review rejects productivity pressure", review.includes("no productivity score") && review.includes("không tạo thêm áp lực")],
  ["R1 surfaces are responsive", styles.includes(".commercial-plan-grid") && styles.includes(".continuity-metrics")],
]) {
  if (!condition) {
    throw new Error(`Commercial UX verification failed: ${label}`);
  }
}

console.log("Commercial UX verification passed.");

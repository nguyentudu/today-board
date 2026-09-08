import type { CommercialPlan } from "./contracts";

export const COMMERCIAL_CATALOG_MODE = "candidate_fixture_only" as const;

export const COMMERCIAL_CATALOG: readonly CommercialPlan[] = Object.freeze([
  {
    id: "local_free",
    name: "Moon Local",
    price: "Free",
    availability: "available",
    features: ["Local-first board", "Offline use", "JSON export and import", "No account required"],
  },
  {
    id: "continuity_pro",
    name: "Moon Continuity Pro",
    price: "$8/month or $72/year — candidate",
    availability: "preview_only",
    features: ["Encrypted cross-device sync", "Version history and recovery", "Extended storage", "Continuity review"],
  },
  {
    id: "founding_license",
    name: "Founding License",
    price: "$49 once — candidate",
    availability: "preview_only",
    features: ["Hosted Pro access for the published product lifetime", "First 100 completed orders", "Published fair-use terms required"],
  },
]);

export function getPlan(id: CommercialPlan["id"]): CommercialPlan {
  const plan = COMMERCIAL_CATALOG.find((candidate) => candidate.id === id);

  if (!plan) {
    throw new Error(`Unknown commercial plan: ${id}`);
  }

  return plan;
}

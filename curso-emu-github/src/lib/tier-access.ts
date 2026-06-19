import type { CourseTier, UserRole } from "./types";

const TIER_RANK: Record<CourseTier, number> = { tier1: 1, tier2: 2, tier3: 3 };

export function hasTierAccess(
  userTier: CourseTier | null,
  required: CourseTier,
  role?: UserRole
) {
  if (role === "owner" || role === "admin") return true;
  if (!userTier) return false;
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

export function tierLabel(tier: CourseTier | null) {
  switch (tier) {
    case "tier1":
      return "Tier I · Básico";
    case "tier2":
      return "Tier II · Avançado";
    case "tier3":
      return "Tier III · Privado";
    default:
      return "Sem acesso";
  }
}

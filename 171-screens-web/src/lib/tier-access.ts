import type { CourseTier, UserRole, CourseAccessSource } from "./types";
import { isBoosterLesson } from "./booster-lessons";

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

/** Booster = tier1 no Discord, mas só algumas aulas liberadas. */
export function isBoosterLimited(
  courseTier: CourseTier | null,
  accessSource?: CourseAccessSource | null,
  role?: UserRole
) {
  if (role === "owner" || role === "admin") return false;
  return accessSource === "booster" && courseTier === "tier1";
}

export function hasLessonAccess(
  user: {
    courseTier: CourseTier | null;
    accessSource?: CourseAccessSource | null;
    role?: UserRole;
  },
  lesson: { id: string; tier: CourseTier }
) {
  if (!hasTierAccess(user.courseTier, lesson.tier, user.role)) return false;
  if (isBoosterLimited(user.courseTier, user.accessSource, user.role)) {
    return isBoosterLesson(lesson.id);
  }
  return true;
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

import { categories } from "./types";
import { tier1Lessons } from "./tier1";
import { tier1Extra } from "./tier1-extra";
import { tier2Lessons } from "./tier2";
import { tier2Extra } from "./tier2-extra";
import { tier3Lessons } from "./tier3";
import { tier3Extra } from "./tier3-extra";

export type { Lesson, LessonSection, LessonCategory } from "./types";
export { categories };
export { CATEGORY_META, groupLessonsByCategory } from "./meta";

function withDefaultOrder<T extends { order?: number }>(arr: T[], tierOffset: number): T[] {
  return arr.map((item, i) => ({
    ...item,
    order: item.order ?? tierOffset + i + 1,
  }));
}

const t1 = withDefaultOrder([...tier1Lessons, ...tier1Extra], 0);
const t2 = withDefaultOrder([...tier2Lessons, ...tier2Extra], 100);
const t3 = withDefaultOrder([...tier3Lessons, ...tier3Extra], 200);

export const lessons = [...t1, ...t2, ...t3].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999)
);

export function getLesson(id: string) {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByCategory(categoryId: string) {
  return lessons.filter((l) => l.categoryId === categoryId);
}

export function getLessonsByTier(tier: "tier1" | "tier2" | "tier3") {
  return lessons.filter((l) => l.tier === tier);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getLessonCounts() {
  return {
    tier1: lessons.filter((l) => l.tier === "tier1").length,
    tier2: lessons.filter((l) => l.tier === "tier2").length,
    tier3: lessons.filter((l) => l.tier === "tier3").length,
    total: lessons.length,
  };
}

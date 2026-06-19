/** Aulas liberadas só com cargo de booster (degustação). */
export const BOOSTER_LESSON_IDS = [
  "prefetch",
  "temp-recent",
  "die",
  "fluxo-completo",
  "det-veredito-basico",
] as const;

export type BoosterLessonId = (typeof BOOSTER_LESSON_IDS)[number];

export const BOOSTER_LESSON_COUNT = BOOSTER_LESSON_IDS.length;

export function isBoosterLesson(id: string): id is BoosterLessonId {
  return (BOOSTER_LESSON_IDS as readonly string[]).includes(id);
}

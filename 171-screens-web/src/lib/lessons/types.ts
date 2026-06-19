import type { CourseTier } from "../types";

export type LessonSectionKind = "intro" | "modulo" | "tecnica" | "zuera" | "veredito" | "normal";

export type LessonSection = {
  heading: string;
  body: string;
  kind?: LessonSectionKind;
  example?: string;
  image?: string;
  video?: string;
};

export type Lesson = {
  id: string;
  title: string;
  categoryId: string;
  tier: CourseTier;
  order?: number;
  intro: string;
  coverImage?: string;
  introVideo?: string;
  sections: LessonSection[];
  checklist: string[];
};

export type LessonCategory = {
  id: string;
  label: string;
  description: string;
};

export const categories: LessonCategory[] = [
  { id: "windows", label: "WINDOWS", description: "Artefatos nativos — Prefetch, Temp, Dados, AV" },
  { id: "bypass", label: "BYPASS", description: "Anti-forense, limpeza e lentidão" },
  { id: "ferramentas", label: "FERRAMENTAS", description: "DIE, System Informer, Event Viewer" },
  { id: "sysmon", label: "SYSMON", description: "Eventos de monitoramento em tempo real" },
  { id: "deteccoes", label: "DETECÇÕES", description: "Sinais práticos de possível cheat" },
  { id: "analise", label: "ANÁLISE", description: "Fluxo completo e veredito" },
  { id: "avancado", label: "AVANÇADO", description: "UEFI, serviços, dump, crashdumps" },
  { id: "privado", label: "PRIVADO", description: "DMA, remote deep, hollowing, fileless" },
];

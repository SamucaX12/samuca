import type { CourseTier } from "../types";

export const CATEGORY_META: Record<
  string,
  { label: string; short: string; description: string }
> = {
  windows: { label: "Windows", short: "WIN", description: "Artefatos nativos do sistema" },
  bypass: { label: "Bypass", short: "BYP", description: "Anti-forense e limpeza" },
  ferramentas: { label: "Ferramentas", short: "TOOL", description: "Apps do telador" },
  sysmon: { label: "Sysmon", short: "SYS", description: "Eventos de monitoramento" },
  deteccoes: { label: "Detecções", short: "DET", description: "Sinais de cheat" },
  analise: { label: "Análise", short: "ANA", description: "Fluxo e veredito" },
  avancado: { label: "Avançado", short: "ADV", description: "UEFI, dump, serviços" },
  privado: { label: "Privado", short: "PVT", description: "Conteúdo exclusivo" },
};

export function groupLessonsByCategory<T extends { categoryId: string; order?: number }>(
  items: T[]
) {
  const sorted = [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const groups = new Map<string, T[]>();
  for (const item of sorted) {
    const list = groups.get(item.categoryId) ?? [];
    list.push(item);
    groups.set(item.categoryId, list);
  }
  return groups;
}

export function tierStats(tier: CourseTier, all: { tier: CourseTier }[]) {
  const total = all.filter((l) => l.tier === tier).length;
  return { total };
}

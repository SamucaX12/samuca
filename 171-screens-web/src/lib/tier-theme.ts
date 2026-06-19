import type { CourseTier, CourseAccessSource } from "./types";
import { BOOSTER_LESSON_COUNT } from "./booster-lessons";

export type TierTheme = {
  id: CourseTier;
  short: string;
  name: string;
  badge: string;
  price: string;
  description: string;
  color: string;
  colorMuted: string;
  bg: string;
  bgStrong: string;
  border: string;
  borderStrong: string;
  ring: string;
  dot: string;
  btn: string;
  icon: string;
};

export const TIER_ORDER: CourseTier[] = ["tier1", "tier2", "tier3"];

export const TIER_THEME: Record<CourseTier, TierTheme> = {
  tier1: {
    id: "tier1",
    short: "Tier I",
    name: "Básico",
    badge: "Iniciante",
    price: "R$ 60",
    description: "Do zero — Prefetch, Temp, Journal, AV e +20 detecções de cheat.",
    color: "text-emerald-400",
    colorMuted: "text-emerald-400/70",
    bg: "bg-emerald-500/10",
    bgStrong: "bg-emerald-500/15",
    border: "border-emerald-500/25",
    borderStrong: "border-emerald-500/50",
    ring: "ring-emerald-500/30",
    dot: "bg-emerald-400",
    btn: "bg-emerald-500 hover:bg-emerald-400 text-black",
    icon: "text-emerald-400",
  },
  tier2: {
    id: "tier2",
    short: "Tier II",
    name: "Avançado",
    badge: "Intermediário",
    price: "R$ 100",
    description: "UEFI, Sysmon completo, serviços, dump, crashdumps e +30 aulas avançadas.",
    color: "text-sky-400",
    colorMuted: "text-sky-400/70",
    bg: "bg-sky-500/10",
    bgStrong: "bg-sky-500/15",
    border: "border-sky-500/25",
    borderStrong: "border-sky-500/50",
    ring: "ring-sky-500/30",
    dot: "bg-sky-400",
    btn: "bg-sky-400 hover:bg-sky-300 text-black",
    icon: "text-sky-400",
  },
  tier3: {
    id: "tier3",
    short: "Tier III",
    name: "Privado",
    badge: "Exclusivo",
    price: "R$ 140",
    description: "DMA, UEFI profundo, remote bypass, hollowing, fileless e grupo fechado.",
    color: "text-violet-400",
    colorMuted: "text-violet-400/70",
    bg: "bg-violet-500/10",
    bgStrong: "bg-violet-500/15",
    border: "border-violet-500/25",
    borderStrong: "border-violet-500/50",
    ring: "ring-violet-500/30",
    dot: "bg-violet-400",
    btn: "bg-violet-500 hover:bg-violet-400 text-white",
    icon: "text-violet-400",
  },
};

export function getTierTheme(tier: CourseTier) {
  return TIER_THEME[tier];
}

export function tierDisplay(tier: CourseTier | null, accessSource?: CourseAccessSource | null) {
  if (!tier) return { label: "Sem acesso", theme: null };
  const t = TIER_THEME[tier];
  const label =
    accessSource === "booster" && tier === "tier1"
      ? `Booster · ${BOOSTER_LESSON_COUNT} aulas grátis`
      : `${t.short} · ${t.name}`;
  return { label, theme: t };
}

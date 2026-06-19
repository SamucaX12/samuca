export const DISCORD_URL = "https://discord.gg/35Aw934hNh";

export type ProductItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  accent: string;
  border: string;
  badge?: string;
};

export const courseProducts: ProductItem[] = [
  {
    id: "tier1",
    name: "Curso Básico",
    price: 60,
    badge: "Tier I",
    description: "Do zero ao telador. Prefetch, Temp, Journal, AV e +20 detecções de cheat.",
    features: ["Acesso vitalício", "Cargo Curso Básico no Discord", "Grupo de dúvidas", "Dashboard exclusivo"],
    accent: "text-emerald-400",
    border: "border-emerald-500/40",
  },
  {
    id: "tier2",
    name: "Curso Advanced",
    price: 100,
    badge: "Tier II",
    description: "UEFI, Sysmon completo, serviços, dump, crashdumps e +30 aulas avançadas.",
    features: ["Tudo do Básico incluso", "Cargo Curso Advanced", "Casos reais anonimizados", "Labs práticos"],
    accent: "text-sky-400",
    border: "border-sky-500/40",
  },
  {
    id: "tier3",
    name: "Curso Private",
    price: 140,
    badge: "Tier III",
    description: "DMA, UEFI profundo, remote bypass, hollowing, fileless e grupo fechado.",
    features: ["Tudo do Advanced incluso", "Cargo Curso Private", "Grupo privado Samuca", "Conteúdo exclusivo"],
    accent: "text-violet-400",
    border: "border-violet-500/40",
  },
];

export const scannerProducts: ProductItem[] = [
  {
    id: "scanner-privado",
    name: "Scanner Privado",
    price: 150,
    description: "Scanner exclusivo 171 ScreenS — máxima cobertura de detecção.",
    features: ["Pins ilimitados", "Strings custom", "Suporte prioritário", "Updates constantes"],
    accent: "text-amber-400",
    border: "border-amber-500/40",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 120,
    description: "Painel enterprise com patterns custom e gestão de equipe.",
    features: ["Multi-operador", "Patterns próprios", "API de resultados", "Relatórios export"],
    accent: "text-cyan-400",
    border: "border-cyan-500/40",
  },
  {
    id: "enterprise-duo",
    name: "Enterprise Duo",
    price: 80,
    description: "Enterprise para 2 operadores — ideal pra dupla de telagem.",
    features: ["2 slots", "Patterns compartilhados", "Dashboard conjunto", "Suporte Discord"],
    accent: "text-teal-400",
    border: "border-teal-500/40",
  },
  {
    id: "scanner-pro",
    name: "Scanner Pro",
    price: 60,
    description: "Scanner Pro — telagem rápida com detecções essenciais.",
    features: ["Scan completo", "Result web", "Histórico pins", "Atualizações"],
    accent: "text-blue-400",
    border: "border-blue-500/40",
  },
];

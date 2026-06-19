export const DISCORD_URL = "https://discord.gg/35Aw934hNh";

export const upcomingBots = [
  { name: "Bot de Filas SS", desc: "Fila automática de screen share no Discord" },
  { name: "Chamar SS", desc: "Chama telador e jogador na hora certa" },
  { name: "Rank SS", desc: "Ranking de teladores e estatísticas" },
  { name: "Ticker Profissional", desc: "Overlay ao vivo pra stream de telagem" },
];

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
    id: "scanner-pro",
    name: "Scanner Pro",
    price: 60,
    badge: "Key Pro",
    description: "Gera pin e vê results — ideal pra telador solo.",
    features: ["Pins + Results", "Key com validade", "Sem customização", "Suporte Discord"],
    accent: "text-sky-400",
    border: "border-sky-500/40",
  },
  {
    id: "scanner-privado",
    name: "Scanner Privado",
    price: 150,
    badge: "Key Privado",
    description: "GUI custom, strings, custom detect — controle total do scanner.",
    features: ["Pins + Results", "Muda GUI / cores", "Strings + Custom Detect", "Updates constantes"],
    accent: "text-amber-400",
    border: "border-amber-500/40",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 120,
    badge: "Key Enterprise",
    description: "Equipe até 5 · ImGui · cores · strings compartilhadas.",
    features: ["Até 5 membros", "ImGui + cores", "Strings da equipe", "Convite por email"],
    accent: "text-cyan-400",
    border: "border-cyan-500/40",
  },
  {
    id: "enterprise-duo",
    name: "Enterprise Duo",
    price: 80,
    badge: "Key Duo",
    description: "Dupla de telagem — 2 operadores, ImGui e strings.",
    features: ["2 slots", "ImGui + cores", "Strings compartilhadas", "Ideal dupla SS"],
    accent: "text-teal-400",
    border: "border-teal-500/40",
  },
];

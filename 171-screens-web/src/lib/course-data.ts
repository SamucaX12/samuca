export const DISCORD_URL = "https://discord.gg/35Aw934hNh";
export const SCANNER_URL = "http://localhost:3001";

export type TierId = "tier1" | "tier2" | "tier3";

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  topics: string[];
  tool?: string;
};

export type CourseTool = {
  name: string;
  tag: string;
  description: string;
  useCase: string;
};

export type TierPlan = {
  id: TierId;
  label: string;
  badge: string;
  price: number;
  promoPrice?: number;
  promoUntil?: string;
  color: string;
  border: string;
  description: string;
  includes: string[];
  modules: CourseModule[];
};

export const tools: CourseTool[] = [
  {
    name: "Prefetch",
    tag: "Windows",
    description: "Registra execuções recentes de programas (.pf). Mostra nome, hash, última execução e caminho.",
    useCase: "Ver se cheat, loader ou bypass rodou — mesmo após apagar o .exe.",
  },
  {
    name: "Journal / USN",
    tag: "Forense",
    description: "Journal Trace (Update Sequence Number) registra criação, renomeação e delete de arquivos no NTFS.",
    useCase: "Achar limpeza de logs, arquivos deletados e movimentação suspeita pós-ban.",
  },
  {
    name: "System Informer",
    tag: "Processos",
    description: "Monitor avançado de processos, handles, threads, DLLs carregadas e assinaturas.",
    useCase: "Ver injeção, processos hollow, drivers e conexões em tempo real.",
  },
  {
    name: "DIE (Detect It Easy)",
    tag: "Análise",
    description: "Identifica packer, compilador, protector (VMProtect, Themida) e entropia do binário.",
    useCase: "Saber se .exe foi ofuscado, packed ou rebuildado para bypass.",
  },
  {
    name: "Event Viewer",
    tag: "Logs",
    description: "Visualizador nativo de logs do Windows — Security, System, Application.",
    useCase: "Detectar limpeza de log (1102), falhas de serviço e eventos de boot.",
  },
  {
    name: "Sysmon",
    tag: "Monitor",
    description: "Sysinternals que gera logs detalhados de processo, rede, registry e thread.",
    useCase: "Rastrear execução, injeção e persistência com IDs específicos.",
  },
  {
    name: "Antivírus / Defender",
    tag: "Proteção",
    description: "Histórico de detecções, exclusões e amostras quarentenadas.",
    useCase: "Ver se cheat foi detectado, excluído da proteção ou desativado.",
  },
];

export const sysmonEvents = [
  {
    id: "Event 5",
    title: "Process Terminated",
    desc: "Processo encerrado. Útil para ver o que fechou antes do scan ou pós-inject.",
  },
  {
    id: "Event 8",
    title: "CreateRemoteThread",
    desc: "Thread remota criada — clássico sinal de injeção DLL / manual map.",
  },
  {
    id: "Event 10",
    title: "Process Access",
    desc: "Um processo acessou outro (OpenProcess). Detecta leitura de memória e injectors.",
  },
];

export const tiers: TierPlan[] = [
  {
    id: "tier1",
    label: "Tier 1",
    badge: "Básico",
    price: 60,
    color: "text-tier-basic",
    border: "border-tier-basic/40",
    description: "Do zero ao telador. Aprende a analisar bypass genérico, prefetch, journal, temp e .exe suspeito.",
    includes: [
      "Acesso vitalício ao Tier 1",
      "Módulos em vídeo + material escrito",
      "Grupo de dúvidas no Discord",
      "Certificado 171 ScreenS (Básico)",
    ],
    modules: [
      {
        id: "prefetch",
        title: "Prefetch Completo",
        summary: "Como ler, interpretar e cruzar prefetch com bypass.",
        tool: "Prefetch",
        topics: [
          "O que é Prefetch e onde fica (C:\\Windows\\Prefetch)",
          "Como identificar execução de cheat/loader pelo .pf",
          "Prefetch limpo vs normal — sinal de anti-forense",
          "Cruzar prefetch com BAM e timeline do scan",
          "Analisar bypass pelo histórico de execução",
        ],
      },
      {
        id: "journal",
        title: "Journal Trace (USN)",
        summary: "Rastrear arquivos deletados, renomeados e movidos.",
        tool: "Journal / USN",
        topics: [
          "Como funciona o USN Journal no NTFS",
          "Detectar delete em massa (logs, prefetch, temp)",
          "Renomeação de cheat para nome legítimo",
          "Ferramentas para ler journal sem quebrar evidência",
        ],
      },
      {
        id: "temp-recent",
        title: "Temp · Recent · AppData",
        summary: "Pastas que 99% dos cheaters esquecem de limpar.",
        topics: [
          "%TEMP% e arquivos soltos (.exe, .dll, .bat)",
          "Recent (.lnk) — atalhos abertos recentemente",
          "AppData Local/Roaming — configs de cheat",
          "Downloads e Desktop — loaders comuns",
        ],
      },
      {
        id: "dados",
        title: "Uso de Dados",
        summary: "Entender consumo anormal e apps em segundo plano.",
        topics: [
          "Settings > Uso de dados por app",
          "Processos com tráfego suspeito",
          "Cheat phone-home e auth servers",
        ],
      },
      {
        id: "av",
        title: "Antivírus & Defender",
        summary: "Histórico, exclusões e tampering.",
        tool: "Antivírus / Defender",
        topics: [
          "Windows Defender — histórico de proteção",
          "Exclusões de pasta (sinal clássico de cheat)",
          "Defender desativado / serviço parado",
          "Outros AV e logs de quarentena",
        ],
      },
      {
        id: "sysinformer-basic",
        title: "System Informer (Intro)",
        summary: "Primeiros passos no monitor de processos.",
        tool: "System Informer",
        topics: [
          "Instalação e layout",
          "Árvore de processos e serviços",
          "Ver DLLs carregadas e handles",
          "Filtrar por assinatura e caminho",
        ],
      },
      {
        id: "die",
        title: "DIE — Detect It Easy",
        summary: "Analisar .exe antes de abrir — packer, compiler, entropy.",
        tool: "DIE",
        topics: [
          "Interface e scan rápido",
          "VMProtect, Themida, .NET vs native",
          "Entropia alta = possível pack",
          "Comparar SHA256 com VirusTotal",
        ],
      },
      {
        id: "bypass-lento",
        title: "Lentidão de Bypass Genérico",
        summary: "Sinais comportamentais de bypass mal feito.",
        topics: [
          "Boot lento pós-driver",
          "Serviços parados (SysMain, PcaSvc, EventLog)",
          "Lag ao abrir emulador",
          "Correlacionar com resultado do 171 ScreenS",
        ],
      },
      {
        id: "eventviewer",
        title: "Event Viewer",
        summary: "Logs nativos do Windows para telagem manual.",
        tool: "Event Viewer",
        topics: [
          "Security / System / Application",
          "Event ID 1102 — log limpo",
          "PowerShell e Script Block logs",
          "Filtrar por tempo do ban",
        ],
      },
      {
        id: "sysmon",
        title: "Sysmon — Logs 5, 8 e 10",
        summary: "O que cada evento faz e quando acusa cheat.",
        tool: "Sysmon",
        topics: [
          "Event 5 — Process Terminated",
          "Event 8 — CreateRemoteThread (injeção)",
          "Event 10 — Process Access (leitura/inject)",
          "Onde encontrar os logs (Operational)",
          "Cruzar Sysmon com resultado do scanner",
        ],
      },
      {
        id: "exe-suspeito",
        title: ".exe Suspeito — KB, SHA, Assinatura",
        summary: "Validar binário antes de condenar ou liberar.",
        topics: [
          "Tamanho em KB — comparar com builds conhecidos",
          "SHA256 — hash único do arquivo",
          "Assinatura digital (Authenticode)",
          "Unsigned + temp = red flag",
          "Subir hash no VirusTotal com critério",
        ],
      },
      {
        id: "analise-completa-t1",
        title: "Como Analisar Completo (Fluxo)",
        summary: "Passo a passo do iniciante — do scan ao veredito.",
        topics: [
          "1. Rodar 171 ScreenS e ler o painel",
          "2. Prefetch + Journal + Temp",
          "3. Sysmon / Event Viewer se disponível",
          "4. DIE + SHA no .exe suspeito",
          "5. Montar veredito: Clean / Suspeito / Ban",
        ],
      },
    ],
  },
  {
    id: "tier2",
    label: "Tier 2",
    badge: "Avançado",
    price: 100,
    promoPrice: undefined,
    promoUntil: undefined,
    color: "text-tier-advanced",
    border: "border-tier-advanced/40",
    description: "Telador intermediário/avançado. Dump, UEFI, Remote, cheat genérico e tudo do Tier 1 aprofundado.",
    includes: [
      "Tudo do Tier 1 incluso",
      "Módulos avançados + labs práticos",
      "Casos reais de telagem (anonimizados)",
      "Certificado 171 ScreenS (Avançado)",
    ],
    modules: [
      {
        id: "dump",
        title: "Leitura de Dump",
        summary: "Analisar memory dump e crash dumps por strings e imports.",
        topics: [
          "O que é dump de memória e quando pedir",
          "Strings no dump — cheat, auth, URLs",
          "Imports e DLLs mapeadas manualmente",
          "Correlacionar dump com process list do scan",
        ],
      },
      {
        id: "sysinformer-adv",
        title: "System Informer Avançado",
        summary: "Handles, threads, drivers e hollow process.",
        tool: "System Informer",
        topics: [
          "Process hollowing e parent PID spoof",
          "Drivers kernel não assinados",
          "Threads suspeitas em lsass/csrss",
          "Network tab — conexões ocultas",
        ],
      },
      {
        id: "uefi",
        title: "Detectar UEFI / Bootkit",
        summary: "Secure Boot, ESP e anomalias de firmware.",
        topics: [
          "Secure Boot ON vs OFF",
          "Partição EFI e bootloaders extras",
          "Sinais de bootkit no scan 171 ScreenS",
          "Quando escalar para análise de hardware",
        ],
      },
      {
        id: "remote",
        title: "Detectar Remote / RDMA",
        summary: "AnyDesk, TeamViewer, Parsec e conexões suspeitas.",
        topics: [
          "Software de acesso remoto instalado",
          "Conexões TCP suspeitas (1337, 5555)",
          "Remote + emulador = red flag em competitive",
          "Área REMOTE no painel 171 ScreenS",
        ],
      },
      {
        id: "cheat-generico",
        title: "Cheat Genérico — Padrões",
        summary: "Identificar auth, strings e comportamento comum.",
        topics: [
          "KeyAuth, LicenseAuth, custom auth",
          "Strings: aimbot, esp, inject, manual map",
          "Loader + delete self",
          "Cheat internal vs external no emulador",
        ],
      },
      {
        id: "tier1-completo",
        title: "Tier 1 Completo (Revisão Profunda)",
        summary: "Todo conteúdo básico com casos avançados.",
        topics: [
          "Prefetch avançado — timeline completa",
          "Journal forense em cenário real",
          "Sysmon hunting — regras SwiftonSecurity",
          "Montagem de relatório profissional",
        ],
      },
      {
        id: "dma-usb-intro",
        title: "Intro DMA & USB",
        summary: "Hardware cheat — quando suspeitar e o que olhar.",
        topics: [
          "Placas FPGA / DMA no PCIe",
          "Arduino/Teensy — colorbot hardware",
          "USB history e dispositivos programáveis",
          "Áreas DMA/USB no painel 171 ScreenS",
        ],
      },
      {
        id: "relatorio",
        title: "Relatório de Telagem Pro",
        summary: "Como entregar veredito claro para admin/servidor.",
        topics: [
          "Estrutura: Resumo → Evidências → Veredito",
          "Prints organizados por categoria",
          "O que NÃO afirmar sem prova",
          "Template 171 ScreenS para staff",
        ],
      },
    ],
  },
  {
    id: "tier3",
    label: "Tier 3",
    badge: "Privado",
    price: 140,
    color: "text-tier-private",
    border: "border-tier-private/40",
    description: "Grupo fechado. Métodos privados, casos exclusivos e conteúdo que não vai pro público.",
    includes: [
      "Tudo do Tier 1 + Tier 2",
      "Grupo privado com Samuca",
      "Métodos exclusivos de bypass hunting",
      "Atualizações contínuas — conteúdo expande sempre",
      "Prioridade em dúvidas e revisão de telagem",
    ],
    modules: [
      {
        id: "privado-metodos",
        title: "Métodos Privados",
        summary: "Técnicas avançadas compartilhadas só no Tier 3.",
        topics: [
          "Hidden bypass & auth ofuscada (XOR, custom)",
          "FarmServices / loaders disfarçados",
          "Caça a cheat privado por comportamento",
          "Conteúdo novo conforme o meta muda",
        ],
      },
      {
        id: "privado-labs",
        title: "Labs ao Vivo",
        summary: "Telagens reais com mentoria em call.",
        topics: [
          "Review de pins ao vivo",
          "Segundo par de olhos no veredito",
          "Debates de edge cases",
          "Acesso a gravações exclusivas",
        ],
      },
      {
        id: "privado-scanner",
        title: "171 ScreenS Pro Internals",
        summary: "Como extrair o máximo do scanner na telagem.",
        topics: [
          "Ler result com áreas REMOTE/DMA/USB",
          "Custom strings no enterprise",
          "Quando pedir rescan vs manual deep dive",
          "Integração curso + scanner no dia a dia",
        ],
      },
      {
        id: "privado-futuro",
        title: "Em Breve — Muito Mais",
        summary: "O Tier 3 cresce constantemente.",
        topics: [
          "Novos módulos conforme bypass evolui",
          "Convidados e teladores convidados",
          "Material exclusivo de operações reais",
          "Vagas limitadas — grupo fechado",
        ],
      },
    ],
  },
];

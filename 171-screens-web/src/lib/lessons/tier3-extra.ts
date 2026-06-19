import type { Lesson } from "./types";

const L = (
  order: number,
  id: string,
  title: string,
  categoryId: string,
  intro: string,
  sections: Lesson["sections"],
  checklist: string[]
): Lesson => ({ order, id, title, categoryId, tier: "tier3", intro, sections, checklist });

export const tier3Extra: Lesson[] = [
  L(16, "dma-fuser", "DMA — Fuser & HDMI Splitter", "privado",
    "O fuser é o cabo HDMI gordo entre GPU e monitor que combina sinal do cheat com o do jogo. Segundo PC lê RAM, primeiro PC joga limpo no scan. Setup de R$ 15 mil — e o xiter acha que ninguém pergunta da mesa.",
    [
      {
        kind: "intro",
        heading: "Fuser = cheat invisível na mesa",
        body: "Hardware cheat full stack:\n\n• Placa FPGA PCIe lendo RAM\n• Segundo PC processando aim/esp\n• Fuser HDMI combinando output\n• Input relay via USB serial\n\nZero processo no PC alvo. Scan 100% clean. Gameplay 100% suspeito.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — O que procurar",
        body: "Sinais físicos (perguntar na SS/call):\n\n• Cabo HDMI mais grosso que normal entre GPU e monitor\n• Segunda torre/PC ligado ao lado\n• Placa PCIe desconhecida\n• Dois monitores com setup estranho\n\nScan alvo: clean. Mesa: crime.",
        example: "Scan alvo: 100% clean\nMesa: segunda torre + cabo HDMI suspeito + placa PCIe\n→ Investigar hardware. 'Setup normal'? Normal não tem fuser.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Área DMA + contexto mesa",
        body: "171 ScreenS área DMA acusa anomalia + scan clean + gameplay perfeito = combo fuser.\n\nPede descrição do setup. Pede foto/vídeo da mesa se regra servidor permitir.\n\nCâmera na mesa mata mentira.",
      },
      {
        kind: "zuera",
        heading: "🤣 'É cabo de stream'",
        body: "Cabo de stream Elgato/Capture card tem marca, modelo, conecta na placa captura — não no meio da GPU.\n\nFuser fica ENTRE GPU e monitor. Setup completamente diferente.",
        example: "Cabo de stream que passa entre placa de vídeo e monitor e alimenta segundo PC. Novo modelo Elgato, nunca vi no mercado.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Fuser",
        body: "Scan clean + área DMA + setup hardware suspeito = SUSPEITO DMA mínimo.\n\nConfirmação visual = BAN conforme regra.\n\nDocumenta tudo no relatório. Tier III escala se necessário.",
      },
    ],
    ["Perguntar setup mesa", "Área DMA scan", "Correlacionar gameplay", "Foto/vídeo se permitido", "Print hardware PCIe", "Regra servidor"]),
  L(17, "reflective-dll", "Reflective DLL Injection", "privado",
    "DLL carregada da memória sem arquivo no disco. Event 8 sem Event 11 prévio — o xiter acha que inject sem arquivo é inject sem prova. Sysmon discorda.",
    [
      {
        kind: "intro",
        heading: "Reflective inject",
        body: "Técnica: loader aloca memória, copia DLL pra RAM, resolve imports manualmente, chama DllMain — tudo sem LoadLibrary.\n\nResultado: DLL em memória, zero arquivo no disco, zero Event 7 ImageLoaded clássico.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais",
        body: "Red flags:\n\n• Event 8 (CreateRemoteThread) no emulador\n• SEM Event 11 (FileCreate) prévio da DLL\n• SEM Event 7 (ImageLoaded) da DLL\n• DLL visível em SI Modules mas path vazio ou Temp deletado\n• Journal: sem inject.dll",
        example: "Event 8: HD-Player.exe — start address anômalo\nJournal: sem inject.dll\nSI Modules: unknown.dll — path vazio\n→ Reflective inject. 'Não tem DLL'? Tem — na memória.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Dump memória confirma",
        body: "Dump HD-Player (ou processo alvo).\n\nProcure PE header em região não mapeada a arquivo.\n\nStrings: auth, config, nomes de cheat.\n\nReflective deixa DLL inteira em RAM — dump pega.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Reflective",
        body: "Event 8 + DLL memória sem arquivo + strings cheat = BAN.\n\nEvent 8 sozinho = investigar (alguns emuladores fazem inject legítimo — raro).\n\nDump confirma ou elimina.",
      },
    ],
    ["Event 8 sem Event 11", "SI modules path vazio", "Dump memória PE", "Journal sem DLL", "Strings auth", "Veredito BAN se confirmado"]),
  L(18, "manual-map-deep", "Manual Map — Detecção Profunda", "privado",
    "Manual mapping vai além do reflective — mapeia PE manualmente sem LoadLibrary, sem rastro clássico. Tier III caça o que Tier II só suspeita.",
    [
      {
        kind: "intro",
        heading: "Manual map vs LoadLibrary",
        body: "LoadLibrary = Event 7 ImageLoaded.\n\nManual map = mapper custom escreve seções na memória, resolve relocations/imports manualmente.\n\nSem Event 7. Sem arquivo. Event 8 pode ou não aparecer dependendo do mapper.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Hunt manual map",
        body: "Onde caçar:\n\n• Event 10 (ProcessAccess) — ALL_ACCESS no emulador\n• Event 8 — thread start fora de módulo conhecido\n• Memória: PE header em região privada\n• Strings no dump\n• SI: módulo sem path ou path fake",
        example: "Manual map detectado:\nSem Event 7 ImageLoaded\nMas Event 8 presente\nDump: PE header 0xMZ em região 0x000001A0000000\n→ Mapper privado. Tier III confirmou.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Dump análise PE em memória",
        body: "Volatility ou análise manual:\n\n• Procurar MZ/PE headers em regiões não file-backed\n• malfind, dlllist no dump\n• Comparar módulos SI vs módulos no dump\n\nMódulo em SI sem file = manual map quase certo.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Event 8/10 combo",
        body: "Event 10: cheat.exe → HD-Player GrantedAccess 0x1F0FFF\nEvent 8: thread no HD-Player start 0x...\nSem Event 7 da DLL = manual map chain.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Manual Map",
        body: "PE em memória sem arquivo + Event 8/10 + strings = BAN.\n\nSuspeita sem dump = pedir segunda opinião Tier III.\n\nDocumenta endereços e prints SI.",
      },
    ],
    ["Dump análise PE", "Event 8/10 correlacionar", "SI modules vs dump", "Strings memória", "Relatório endereços", "Veredito composto"]),
  L(19, "ipv6-tunnel", "Túnel IPv6 & Localhost Relay", "privado",
    "Remote bypass evoluiu — agora esconde em localhost, ::1 e fe80::. Quem só filtra IPv4 IPv4 externo perde o relay na cara.",
    [
      {
        kind: "intro",
        heading: "Localhost relay moderno",
        body: "Processo A (AnyDesk/Parsec/custom) conecta 127.0.0.1:porta.\nProcesso B escuta mesma porta.\nTráfego 'local' — na verdade relay pro segundo PC ou cheat local.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Event 3 expandido",
        body: "Filtrar Event 3 por:\n\n• 127.0.0.1 (IPv4 loopback)\n• ::1 (IPv6 loopback)\n• fe80:: (link-local IPv6)\n• 192.168.x.x (LAN)\n\nQualquer um com processo suspeito = investigar.",
        example: "anydesk.exe → 127.0.0.1:5959\nProcesso B escuta TCP 5959\n→ Relay local. IPv4 loopback não é 'tráfego interno inofensivo'.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ netstat + processos listening",
        body: "netstat -ano | findstr LISTENING\n\nCruza porta com Event 3.\n\nDois processos na mesma porta (entrada/saída) = relay ativo.",
      },
      {
        kind: "veredito",
        heading: "Veredito — IPv6/Localhost",
        body: "Relay localhost + remote tool + ranked = SUSPEITO/BAN conforme regra.\n\nDocumenta Event 3 completo + netstat.\n\nNão ignore ::1 — xiter usa IPv6 pra confundir telador Tier II.",
      },
    ],
    ["Event 3 localhost", "Event 3 ::1 fe80::", "netstat LISTENING", "Correlacionar processos", "Área REMOTE scanner", "Regra servidor"]),
  L(20, "atom-bombing", "Atom Bombing & Técnicas Exóticas", "privado",
    "Atom bombing, process doppelgänging, thread hijacking — técnicas exóticas de cheat privado caro. Raro, mas quando aparece você precisa saber que não é 'falso positivo do Sysmon'.",
    [
      {
        kind: "intro",
        heading: "Técnicas exóticas",
        body: "Atom Bombing: GlobalAddAtom + QueueUserAPC — inject via atom table global.\n\nSem arquivo. Sem LoadLibrary clássico. Memória e Event 8 anômalo.\n\nCheat privado de R$ 800+/mês usa isso.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais atom bombing",
        body: "Red flags:\n\n• Sem .exe cheat no disco\n• Event 8 start address fora de módulo conhecido\n• SI threads com start address suspeito\n• Scan clean + gameplay suspeito + dump strings\n• Técnica confirmada só com dump + análise profunda",
        example: "Sem .exe no disco\nEvent 8 start address 0x00007FF6B0000000 — fora de ntdll/kernel32\nDump: strings auth presentes\n→ Técnica exótica. Escala especialista.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Dump + SI threads",
        body: "System Informer → processo alvo → Threads tab.\n\nStart address fora de módulos carregados = inject exótico.\n\nDump memória + análise offline confirma.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Exótico",
        body: "Técnica exótica confirmada = BAN + escalar documentação.\n\nSuspeita sem confirmação = SUSPEITO + pedir dump/review grupo.\n\nNão banir só por Event 8 anômalo — confirmar com dump.",
      },
    ],
    ["Dump memória completo", "Event 8 start address", "SI threads tab", "Strings auth dump", "Escalar especialista", "Documentar técnica"]),
  L(21, "kernel-callbacks", "Kernel Callbacks & Rootkit", "privado",
    "Rootkit altera callbacks do kernel — Sysmon fica cego, drivers somem, logs têm gap total. Gameplay cheat com scan 100% clean e zero Event 1? Kernel level. Tier III ou especialista.",
    [
      {
        kind: "intro",
        heading: "Kernel rootkit",
        body: "Driver kernel não assinado hooka:\n\n• PsSetCreateProcessNotifyRoutine\n• ObRegisterCallbacks\n• Minifilter file system\n• Sysmon driver blindado\n\nResultado: cheat roda, logs não registram, scan limpo.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais",
        body: "Combo clássico:\n\n• Sysmon OFF ou parado sem motivo\n• Driver unsigned carregado (SI → Drivers)\n• Scan 100% clean\n• Gameplay obviamente cheat\n• Gap total em Event 1/3/8 no período\n• bcdedit testsigning ON",
        example: "Sysmon: STOPPED\nDriver: x7k2.sys unsigned loaded 14:00\nScan: clean\nGameplay: aimbot evidente\n→ Kernel level. Não opine CLEAN. Escala.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Offline image + drivers",
        body: "Se possível: offline analysis da imagem de disco.\n\nDrivers em System32\\drivers\\ — unsigned, timestamp recente.\n\nMinifilter list no SI.\n\nKernel = fora do escopo telador básico.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Rootkit",
        body: "Suspeita kernel = SUSPEITO KERNEL + escalar especialista.\n\nNunca CLEAN confiante.\n\nDocumenta drivers, Sysmon status, gap logs.\n\nBan só com confirmação ou regra servidor específica.",
      },
    ],
    ["Sysmon status", "Drivers unsigned SI", "Gap logs timeline", "bcdedit testsigning", "Offline image se possível", "Escalar especialista"]),
  L(22, "pin-review-samuca", "Review de Pin — Método Samuca", "privado",
    "Como Samuca revisa pins no grupo privado — ordem exata, o que pede antes de opinar, e por que telador apressado é telador fudido.",
    [
      {
        kind: "intro",
        heading: "Método Samuca",
        body: "Ordem sagrada de review:\n\n1. Scan completo (todas áreas)\n2. Timeline unificada\n3. Memória se scan suspeito + disco limpo\n4. Hardware se DMA suspeito\n5. Veredito com evidências numeradas\n\nPula passo = veredito inválido.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Scan primeiro",
        body: "Nunca opina sem scan completo anexado.\n\nPin sem prefetch = 'pede prefetch antes de opinar'.\nPin sem Sysmon = 'pergunta se servidor exige'.\nPin incompleto = não review.",
        example: "Pin enviado: só print do scan summary\nSamuca: 'Cadê prefetch? Cadê timeline? Não review incompleto.'\n→ Aprende a postar certo ou não posta.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Não apressar BAN",
        body: "BAN exige 2+ evidências independentes ou 1 evidência forte (Event 8/10 + emulador).\n\nCLEAN exige ausência de evidência + contexto legítimo.\n\nSUSPEITO = pedir mais evidência.\n\n'Acho que' não existe.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Método",
        body: "Formato padrão de post:\n\nPIN # | Scan anexo | Timeline | Hipótese | Dúvida específica\n\nSamuca corrige hipótese, não adivinha pin.",
      },
    ],
    ["Scan completo primeiro", "Timeline antes veredito", "Não apressar BAN", "Pedir evidência faltante", "Formato post padrão", "2+ evidências BAN"]),
  L(23, "ban-appeal-analise", "Análise de Appeal — Defender Ban", "privado",
    "User apelou? Re-analisa sem viés. 'Prefetch era do jogo' — verifica hash e path. Appeal não é segunda chance automática pro xiter — é auditoria do seu veredito.",
    [
      {
        kind: "intro",
        heading: "Appeal = re-auditoria",
        body: "User apela ban. Staff pede re-análise.\n\nVocê relê TUDO sem assumir que acertou ou errou.\n\nNovos artefatos podem aparecer. Mentira do user também.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Processo",
        body: "Workflow appeal:\n\n1. Reler relatório original + evidências\n2. Pedir novos artefatos se necessário\n3. Comparar SHA/paths com alegação user\n4. Re-scan se patterns atualizados\n5. Veredito final documentado",
        example: "Appeal: 'prefetch era do jogo'\n→ Verificar: path do .pf, hash, horário vs sessão jogo\n→ Prefetch loader.exe em Temp = mentira\n→ Ban mantido.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Comparar SHA e timeline",
        body: "User mente com argumento plausível.\n\nSHA não mente. Timeline não mente.\n\n'Era Discord' — Discord prefetch tem hash específico, path AppData\\Discord.\n\nLoader em Temp tem hash diferente.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Appeal",
        body: "Manteve ban: documenta por que alegação falhou.\n\nReverteu ban: documenta erro original (aprendizado).\n\nAppeal bem feito fortalece operação. Appeal mal feito destrói credibilidade.",
      },
    ],
    ["Relatório original completo", "Novos artefatos user", "Comparar SHA/paths", "Re-scan se necessário", "Documentar veredito final", "Aprendizado se errou"]),
  L(24, "enterprise-strings", "Enterprise Strings — Caça Custom", "privado",
    "Patterns enterprise do 171 ScreenS pegam cheat privado que VT dá clean. XOR, auth custom, nomes de operação — atualiza semanal ou perde pro dev privado.",
    [
      {
        kind: "intro",
        heading: "Enterprise strings",
        body: "Scanner enterprise aceita patterns custom:\n\n• XOR keys conhecidas\n• Auth URLs privadas\n• Nomes de cheat da operação\n• Stubs de loader não públicos\n\nPattern certo pega cheat que lista pública não tem.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Setup patterns",
        body: "Coordena com operação:\n\n• Quais cheats circulam na meta\n• Quais auth panels privados\n• XOR/strings de loaders capturados\n\nAtualiza patterns → re-scan pins pendentes.",
        example: "Pattern 'solvynx' adicionado segunda\nRe-scan pin de sexta: HIT\nLoader não listado publicamente — VT 0/72\n→ Enterprise string salvou telagem.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Validar FP",
        body: "Pattern novo pode dar falso positivo.\n\nHit em pattern = validar manualmente:\n\n• DIE no arquivo/memória\n• Contexto execução\n• Correlaciona Event 3/8\n\nNão ban só por string hit — confirma.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Enterprise",
        body: "String hit confirmada + contexto = evidência forte.\n\nDocumenta pattern que pegou.\n\nFeedback pro grupo — pattern entra na base permanente.",
      },
    ],
    ["Patterns atualizados semanal", "Re-scan após update", "Validar FP manual", "DIE confirma hit", "Documentar pattern", "Feedback grupo"]),
  L(25, "operacao-telagem", "Operação de Telagem em Escala", "privado",
    "Montar time de teladores com padrão único — checklist, template, escalação I→II→III. Operação desorganizada perde pin, perde appeal, perde credibilidade.",
    [
      {
        kind: "intro",
        heading: "Telagem em escala",
        body: "Um telador bom não escala. Operação boa escala:\n\n• Checklist único Tier I/II/III\n• Template relatório padrão\n• Escalação clara: I → II → III → Samuca\n• QA semanal de vereditos",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Padrão operação",
        body: "Tier I: Prefetch, Temp, scan básico, relatório simples.\n\nTier II: Sysmon, timeline, memória intro, UEFI básico.\n\nTier III: DMA, fileless, hollowing, enterprise strings, hardware.\n\nDúvida → sobe tier. DMA → III + Samuca.",
        example: "Telador I: scan clean, manda CLEAN\nReview QA: gameplay suspeito + área DMA\nReclassifica: SUSPEITO DMA → escala III\n→ QA salvou ban perdido.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Template e checklist",
        body: "Template único:\n\nPIN | Data | Tier telador | Evidências # | Veredito | Anexos SHA\n\nChecklist por tier — não pula item.\n\nQA semanal: 5 pins random auditados.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Operação",
        body: "Operação madura = veredito consistente = appeal defensável = staff confia.\n\nOperação amadora = CLEAN errado + BAN errado + appeal caos.\n\nTier III inclui montar operação, não só telar pin.",
      },
    ],
    ["Checklist único time", "Template relatório padrão", "Escalonamento I→II→III", "QA semanal pins", "Audit 5 random", "Feedback loop grupo"]),
];

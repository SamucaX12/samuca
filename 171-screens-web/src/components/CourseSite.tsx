"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Crosshair,
  GraduationCap,
  Lock,
  MessageCircle,
  Monitor,
  Scan,
  Shield,
  Sparkles,
  Zap,
  Bot,
  Clock,
  Check,
} from "lucide-react";
import {
  DISCORD_URL,
  sysmonEvents,
  tiers,
  tools,
  type TierId,
} from "@/lib/course-data";
import { courseProducts, scannerProducts, upcomingBots } from "@/lib/products";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";
import { getLessonCounts } from "@/lib/lessons";
import { BOOSTER_LESSON_COUNT } from "@/lib/booster-lessons";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const counts = getLessonCounts();

export default function CourseSite({ loggedIn = false }: { loggedIn?: boolean }) {
  const [activeTier, setActiveTier] = useState<TierId>("tier1");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [priceTab, setPriceTab] = useState<"curso" | "scanner">("curso");

  const tier = tiers.find((t) => t.id === activeTier)!;
  const theme = TIER_THEME[activeTier];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-screens-border/80 bg-screens-bg/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-screens-accent/10 ring-1 ring-screens-accent/40">
              <Crosshair className="h-5 w-5 text-screens-accent" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">171 ScreenS</p>
              <p className="text-[11px] text-screens-muted">Curso Emu · Scanner · by Samuca</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-screens-muted md:flex">
            <a href="#conteudo" className="hover:text-white transition-colors">Curso</a>
            <a href="#scanner" className="hover:text-white transition-colors">Scanner</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#em-breve" className="hover:text-amber-300 transition-colors">Em breve</a>
          </nav>
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-screens-accent px-4 py-2 text-sm font-bold text-black hover:opacity-90"
              >
                <GraduationCap className="h-4 w-4" />
                Dashboard
              </a>
            ) : (
              <a
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-screens-border px-4 py-2 text-sm font-medium hover:bg-white/5"
              >
                Entrar
              </a>
            )}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium hover:bg-[#4752C4]"
            >
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero — screen share / scanner vibe */}
      <section className="relative overflow-hidden border-b border-screens-border scan-grid">
        <div className="scan-crosshair pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(125,211,252,0.14)_0%,_transparent_65%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 bg-amber-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-screens-accent/30 bg-screens-accent/5 px-4 py-1.5 text-xs text-screens-accent mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                Telagem forense + Scanner profissional
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
                Aprende telagem.
                <br />
                <span className="text-screens-accent">Roda scan.</span>
                <br />
                <span className="text-amber-400/90">Domina o game.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-screens-muted leading-relaxed">
                Curso completo do zero ao telador pro — Prefetch, Journal, Sysmon, UEFI, bypass.
                Scanner 171 ScreenS com pins, results, strings custom e painel enterprise.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Booster do servidor</strong> — {BOOSTER_LESSON_COUNT} aulas grátis (degustação Tier I)
                </span>
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-screens-accent px-7 py-3.5 text-sm font-bold text-screens-bg hover:bg-screens-accent-dim"
                >
                  <Zap className="h-4 w-4" />
                  Entrar no curso
                </a>
                <a
                  href="#precos"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-7 py-3.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/15"
                >
                  <Scan className="h-4 w-4" />
                  Ver planos scanner
                </a>
              </div>
            </div>

            {/* Mock scanner panel */}
            <div className="glass-card relative overflow-hidden p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-screens-border pb-4">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-screens-accent" />
                  <span className="font-mono text-sm font-bold">171 ScreenS Scanner</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                  Online
                </span>
              </div>
              <div className="mt-6 space-y-4 font-mono text-xs">
                <div className="flex justify-between text-screens-muted">
                  <span>PIN</span>
                  <span className="text-screens-accent tracking-widest">K7H2M9XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-screens-bg">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-screens-accent to-cyan-400 animate-pulse" />
                </div>
                <p className="text-screens-muted">Verificando Prefetch · Sysmon Event 10...</p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { l: "Detections", v: "3", c: "text-red-400" },
                    { l: "Warnings", v: "7", c: "text-amber-400" },
                    { l: "Clean", v: "89%", c: "text-emerald-400" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border border-screens-border bg-screens-bg/60 p-3 text-center">
                      <p className={`text-lg font-bold ${x.c}`}>{x.v}</p>
                      <p className="text-[10px] text-screens-muted">{x.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Aulas", value: `${counts.total}+` },
              { label: "Tiers curso", value: "3" },
              { label: "Planos scanner", value: "4" },
              { label: "Ferramentas", value: "7+" },
              { label: "Do zero", value: "100%" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-5 text-center md:text-left">
                <p className="text-2xl md:text-3xl font-black text-screens-accent">{s.value}</p>
                <p className="text-xs text-screens-muted mt-1 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course content */}
      <section id="conteudo" className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-screens-muted mb-3">Curso Emu</p>
          <h2 className="text-3xl md:text-4xl font-bold">Conteúdo do curso</h2>
          <p className="mt-4 text-screens-muted max-w-2xl mx-auto leading-relaxed">
            {counts.total} aulas em vídeo e texto — com suporte a imagens e vídeos em cada módulo.
            Três tiers do básico ao privado.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TIER_ORDER.map((id) => {
            const th = TIER_THEME[id];
            return (
              <div key={id} className={`flex items-center gap-2 rounded-full border ${th.border} ${th.bg} px-4 py-2`}>
                <span className={`h-2 w-2 rounded-full ${th.dot}`} />
                <span className={`text-xs font-bold ${th.color}`}>{th.short} · {th.name}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tiers.map((t) => {
            const th = TIER_THEME[t.id];
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTier(t.id);
                  setExpandedModule(null);
                }}
                className={`rounded-xl px-6 py-3.5 text-sm font-medium transition border-2 ${
                  activeTier === t.id
                    ? `${th.borderStrong} ${th.bgStrong} ${th.color}`
                    : "border-screens-border bg-screens-card/30 text-screens-muted hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2 font-bold">
                  <span className={`h-2 w-2 rounded-full ${th.dot}`} />
                  {t.label}
                </span>
                <span className="text-xs opacity-80 block mt-0.5">{t.badge}</span>
              </button>
            );
          })}
        </div>

        <div className={`rounded-2xl border-2 ${theme.borderStrong} ${theme.bg} glass-card p-8 mb-10`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className={`h-5 w-5 ${theme.icon}`} />
                <span className={`text-sm font-bold uppercase tracking-wider ${theme.color}`}>
                  {tier.label} — {tier.badge}
                </span>
              </div>
              <p className="text-screens-muted max-w-2xl leading-relaxed">{tier.description}</p>
            </div>
            <p className={`text-4xl font-black shrink-0 ${theme.color}`}>{formatPrice(tier.price)}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-screens-muted">
                <Shield className={`h-4 w-4 shrink-0 mt-0.5 ${theme.icon}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          {tier.modules.map((mod, i) => {
            const open = expandedModule === mod.id;
            return (
              <div
                key={mod.id}
                className={`glass-card overflow-hidden transition hover:border-screens-accent/20`}
              >
                <button
                  onClick={() => setExpandedModule(open ? null : mod.id)}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-screens-bg font-mono text-sm font-bold text-screens-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-base">{mod.title}</h3>
                      {mod.tool && (
                        <span className="rounded-md bg-screens-accent/10 px-2 py-0.5 text-[10px] font-bold text-screens-accent uppercase">
                          {mod.tool}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-screens-muted mt-1">{mod.summary}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-screens-muted transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-screens-border px-6 py-5 bg-screens-bg/40">
                    <ul className="space-y-2.5">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-3 text-sm text-screens-muted">
                          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Scanner highlight */}
      <section id="scanner" className="border-y border-screens-border bg-screens-card/20 py-20 md:py-24 scan-grid">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-3">171 ScreenS Scanner</p>
            <h2 className="text-3xl md:text-4xl font-bold">Painel do scanner</h2>
            <p className="mt-4 text-screens-muted max-w-2xl mx-auto">
              Quem tem plano acessa direto no dashboard: Pins, Results, Strings, GUI e Enterprise.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { t: "Pins", d: "Gera pin pro jogador digitar no .exe" },
              { t: "Results", d: "Relatório completo com detecções" },
              { t: "Strings", d: "SHA1, SHA256, DNS, .exe, .dll" },
              { t: "GUI", d: "Cor, nome, frases e logo do ImGui" },
              { t: "Enterprise", d: "Equipe até 5 membros por email" },
            ].map((f) => (
              <div key={f.t} className="glass-card p-6 text-center hover:border-amber-500/30 transition">
                <Scan className="h-6 w-6 text-amber-400 mx-auto mb-3" />
                <p className="font-bold">{f.t}</p>
                <p className="mt-2 text-xs text-screens-muted leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="ferramentas" className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">Ferramentas que você domina</h2>
          <p className="mt-3 text-screens-muted max-w-xl mx-auto">
            Cada app explicado com exemplos, imagens e vídeos nas aulas.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.name} className="glass-card p-6 hover:border-screens-accent/25 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">{tool.name}</h3>
                <span className="rounded-md bg-screens-bg px-2 py-0.5 text-[10px] text-screens-muted uppercase">
                  {tool.tag}
                </span>
              </div>
              <p className="text-sm text-screens-muted leading-relaxed">{tool.description}</p>
              <p className="mt-4 text-xs border-t border-screens-border pt-4 text-screens-accent/90">
                <span className="font-semibold text-screens-accent">Na telagem: </span>
                {tool.useCase}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 glass-card p-8">
          <h3 className="text-xl font-bold mb-2">Sysmon — Eventos essenciais</h3>
          <p className="text-sm text-screens-muted mb-8">O que cada log significa e quando acusa bypass.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {sysmonEvents.map((ev) => (
              <div key={ev.id} className="rounded-xl border border-screens-border bg-screens-bg p-5">
                <p className="text-screens-accent font-mono text-sm font-bold">{ev.id}</p>
                <p className="font-semibold mt-2">{ev.title}</p>
                <p className="text-sm text-screens-muted mt-2 leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Curso + Scanner tabs */}
      <section id="precos" className="border-t border-screens-border bg-screens-card/10 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Preços</h2>
            <p className="mt-3 text-screens-muted">Curso e scanner são produtos separados — compra no Discord.</p>
          </div>

          <div className="flex justify-center gap-3 mb-12">
            <button
              onClick={() => setPriceTab("curso")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                priceTab === "curso"
                  ? "bg-screens-accent text-screens-bg"
                  : "border border-screens-border text-screens-muted hover:text-white"
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Curso Emu
            </button>
            <button
              onClick={() => setPriceTab("scanner")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                priceTab === "scanner"
                  ? "bg-amber-400 text-black"
                  : "border border-screens-border text-screens-muted hover:text-white"
              }`}
            >
              <Scan className="h-4 w-4" /> Scanner 171 ScreenS
            </button>
          </div>

          {priceTab === "curso" ? (
            <div className="grid gap-6 md:grid-cols-3">
              {courseProducts.map((t) => {
                const th = TIER_THEME[t.id as TierId];
                return (
                  <div
                    key={t.id}
                    className={`flex flex-col rounded-2xl border-2 ${th.borderStrong} glass-card overflow-hidden ${
                      t.id === "tier2" ? `ring-2 ${th.ring}` : ""
                    }`}
                  >
                    <div className={`px-6 py-6 ${th.bgStrong} border-b ${th.border}`}>
                      <p className={`text-xs font-bold uppercase ${th.color}`}>{t.badge}</p>
                      <p className="mt-2 text-xl font-bold">{t.name}</p>
                      <p className={`mt-3 text-4xl font-black ${th.color}`}>{formatPrice(t.price)}</p>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <p className="text-sm text-screens-muted mb-5 leading-relaxed">{t.description}</p>
                      <ul className="space-y-2 mb-8 flex-1">
                        {t.features.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-screens-muted">
                            <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${th.icon}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-center rounded-xl py-3.5 text-sm font-bold ${th.btn}`}
                      >
                        Comprar curso
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {scannerProducts.map((p) => (
                <div key={p.id} className={`glass-card p-7 flex flex-col border ${p.border}`}>
                  <p className={`text-3xl font-black ${p.accent}`}>{formatPrice(p.price)}</p>
                  <p className="mt-2 text-lg font-bold">{p.name}</p>
                  <p className="mt-3 text-sm text-screens-muted flex-1 leading-relaxed">{p.description}</p>
                  <ul className="mt-5 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs text-screens-muted flex items-center gap-2">
                        <Check className={`h-3 w-3 ${p.accent}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-500/15"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comprar scanner
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Coming soon bots */}
      <section id="em-breve" className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 mb-4">
            <Clock className="h-3.5 w-3.5" />
            Em breve — futuro do ecossistema
          </div>
          <h2 className="text-3xl font-bold">Bots de Screen Share</h2>
          <p className="mt-3 text-screens-muted max-w-xl mx-auto">
            Estamos desenvolvendo automação pro Discord. Vai vender separado — fica de olho.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingBots.map((bot) => (
            <div
              key={bot.name}
              className="relative glass-card p-6 opacity-90 hover:opacity-100 transition"
            >
              <span className="absolute right-4 top-4 rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-violet-300">
                Em breve
              </span>
              <Bot className="h-8 w-8 text-violet-400 mb-4" />
              <p className="font-bold pr-16">{bot.name}</p>
              <p className="mt-2 text-sm text-screens-muted leading-relaxed">{bot.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-screens-border py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold">Pronto pra virar telador?</h2>
          <p className="mt-3 text-screens-muted leading-relaxed">
            Entra no Discord, escolhe curso ou scanner e começa hoje. 171 ScreenS by Samuca.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-4 text-sm font-semibold hover:bg-[#4752C4]"
          >
            <MessageCircle className="h-5 w-5" />
            discord.gg/35Aw934hNh
          </a>
        </div>
      </section>

      <footer className="border-t border-screens-border py-8 text-center text-xs text-screens-muted">
        <p>© 2026 171 ScreenS · Curso Emu by Samuca</p>
        <p className="mt-2 flex justify-center gap-4">
          <a href="/login" className="text-screens-accent hover:underline">Login</a>
          <a href={DISCORD_URL} className="text-screens-accent hover:underline" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </p>
      </footer>
    </div>
  );
}

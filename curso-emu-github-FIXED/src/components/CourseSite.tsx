"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Lock,
  MessageCircle,
  Monitor,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  DISCORD_URL,
  SCANNER_URL,
  sysmonEvents,
  tiers,
  tools,
  type TierId,
} from "@/lib/course-data";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CourseSite() {
  const [activeTier, setActiveTier] = useState<TierId>("tier1");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const tier = tiers.find((t) => t.id === activeTier)!;
  const theme = TIER_THEME[activeTier];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-screens-border bg-screens-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-screens-accent/10 ring-1 ring-screens-accent/30">
              <GraduationCap className="h-5 w-5 text-screens-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Curso Emu</p>
              <p className="text-xs text-screens-muted">171 ScreenS · by Samuca</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-screens-muted md:flex">
            <a href="#conteudo" className="hover:text-white transition-colors">Conteúdo</a>
            <a href="#ferramentas" className="hover:text-white transition-colors">Ferramentas</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-screens-border px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Entrar
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4752C4]"
            >
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-screens-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(125,211,252,0.12)_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-screens-accent/30 bg-screens-accent/5 px-3 py-1 text-xs text-screens-accent mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Curso completo de telagem forense
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Aprende telagem de{" "}
            <span className="text-screens-accent">verdade</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-screens-muted leading-relaxed">
            Do zero ao telador pro. Prefetch, Journal, Sysmon, dump, UEFI, remote e tudo que
            precisa pra analisar bypass no emulador — no estilo 171 ScreenS, ensinado pelo Samuca.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-screens-accent px-6 py-3 text-sm font-semibold text-screens-bg transition hover:bg-screens-accent-dim"
          >
            <Zap className="h-4 w-4" />
            Entrar no curso
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-screens-border bg-screens-card px-6 py-3 text-sm font-medium transition hover:border-screens-accent/40"
          >
            Dashboard
          </a>
            <a
              href={SCANNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-screens-border bg-screens-card px-6 py-3 text-sm font-medium transition hover:border-screens-accent/40"
            >
              <Monitor className="h-4 w-4 text-screens-accent" />
              171 ScreenS Scanner
              <ExternalLink className="h-3.5 w-3.5 text-screens-muted" />
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Módulos", value: "24+" },
              { label: "Tiers", value: "3" },
              { label: "Ferramentas", value: "7+" },
              { label: "Do zero", value: "100%" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-screens-border bg-screens-card/50 p-4">
                <p className="text-2xl font-bold text-screens-accent">{s.value}</p>
                <p className="text-xs text-screens-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier tabs + content */}
      <section id="conteudo" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Conteúdo do curso</h2>
          <p className="mt-3 text-screens-muted max-w-xl mx-auto">
            Três níveis. Cada um com módulos explicando o que é, como usar e o que procurar na telagem.
          </p>
        </div>

        {/* Legenda de cores */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {TIER_ORDER.map((id) => {
            const th = TIER_THEME[id];
            return (
              <div key={id} className={`flex items-center gap-2 rounded-full border ${th.border} ${th.bg} px-3 py-1.5`}>
                <span className={`h-2 w-2 rounded-full ${th.dot}`} />
                <span className={`text-xs font-semibold ${th.color}`}>{th.short} · {th.name}</span>
              </div>
            );
          })}
        </div>

        {/* Tier selector */}
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
              className={`rounded-xl px-5 py-3 text-sm font-medium transition border-2 ${
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
          );})}
        </div>

        {/* Active tier header */}
        <div className={`rounded-2xl border-2 ${theme.borderStrong} ${theme.bg} bg-screens-card p-6 md:p-8 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className={`h-5 w-5 ${theme.icon}`} />
                <span className={`text-sm font-semibold uppercase tracking-wider ${theme.color}`}>
                  {tier.label} — {tier.badge}
                </span>
              </div>
              <p className="text-screens-muted max-w-2xl">{tier.description}</p>
            </div>
            <div className="shrink-0 text-right">
              {tier.promoPrice ? (
                <>
                  <p className="text-sm text-screens-muted line-through">{formatPrice(tier.price)}</p>
                  <p className={`text-3xl font-bold ${theme.color}`}>{formatPrice(tier.promoPrice)}</p>
                  <p className="text-xs text-amber-400 mt-1">Promo até dia {tier.promoUntil}</p>
                </>
              ) : (
                <p className={`text-3xl font-bold ${theme.color}`}>{formatPrice(tier.price)}</p>
              )}
            </div>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-screens-muted">
                <Shield className={`h-4 w-4 shrink-0 mt-0.5 ${theme.icon}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Modules accordion */}
        <div className="space-y-3">
          {tier.modules.map((mod, i) => {
            const open = expandedModule === mod.id;
            return (
              <div
                key={mod.id}
                className={`rounded-xl border ${theme.border} bg-screens-card overflow-hidden transition hover:bg-white/[0.02]`}
              >
                <button
                  onClick={() => setExpandedModule(open ? null : mod.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-screens-bg text-xs font-bold text-screens-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{mod.title}</h3>
                      {mod.tool && (
                        <span className="rounded-md bg-screens-accent/10 px-2 py-0.5 text-[10px] font-medium text-screens-accent uppercase tracking-wide">
                          {mod.tool}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-screens-muted mt-0.5">{mod.summary}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-screens-muted transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-screens-border px-5 py-4 bg-screens-bg/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-screens-muted mb-3">
                      O que você aprende
                    </p>
                    <ul className="space-y-2">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-screens-muted">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
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

      {/* Tools */}
      <section id="ferramentas" className="border-t border-screens-border bg-screens-card/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Ferramentas que você domina</h2>
            <p className="mt-3 text-screens-muted max-w-xl mx-auto">
              Cada app explicado: o que é, pra que serve e como usar na telagem real.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-screens-border bg-screens-card p-5 transition hover:border-screens-accent/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <span className="rounded-md bg-screens-bg px-2 py-0.5 text-[10px] text-screens-muted uppercase">
                    {tool.tag}
                  </span>
                </div>
                <p className="text-sm text-screens-muted leading-relaxed">{tool.description}</p>
                <p className="mt-3 text-xs text-screens-accent/90 border-t border-screens-border pt-3">
                  <span className="font-semibold text-screens-accent">Na telagem: </span>
                  {tool.useCase}
                </p>
              </div>
            ))}
          </div>

          {/* Sysmon events */}
          <div className="mt-12 rounded-2xl border border-screens-border bg-screens-card p-6 md:p-8">
            <h3 className="text-xl font-bold mb-2">Sysmon — Eventos essenciais</h3>
            <p className="text-sm text-screens-muted mb-6">
              No Tier 1 você aprende o que cada log significa e quando acusa bypass.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {sysmonEvents.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-screens-border bg-screens-bg p-4">
                  <p className="text-screens-accent font-mono text-sm font-bold">{ev.id}</p>
                  <p className="font-semibold mt-1">{ev.title}</p>
                  <p className="text-sm text-screens-muted mt-2">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Escolhe teu tier</h2>
          <p className="mt-3 text-screens-muted">
            Compra pelo Discord. Acesso liberado após confirmação.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-2xl border ${t.border} bg-screens-card p-6 ${
                t.id === "tier2" ? "ring-2 ring-tier-advanced/30 scale-[1.02]" : ""
              }`}
            >
              {t.id === "tier2" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tier-advanced px-3 py-0.5 text-[10px] font-bold uppercase text-screens-bg">
                  Promo ativa
                </span>
              )}
              {t.id === "tier3" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tier-private px-3 py-0.5 text-[10px] font-bold uppercase text-white flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Privado
                </span>
              )}
              <p className={`text-sm font-semibold uppercase tracking-wider ${t.color}`}>
                {t.label} · {t.badge}
              </p>
              <div className="mt-4 mb-6">
                {t.promoPrice ? (
                  <>
                    <p className="text-screens-muted line-through text-lg">{formatPrice(t.price)}</p>
                    <p className="text-4xl font-bold">{formatPrice(t.promoPrice)}</p>
                    <p className="text-xs text-amber-400 mt-1">Promo até {t.promoUntil}</p>
                  </>
                ) : (
                  <p className="text-4xl font-bold">{formatPrice(t.price)}</p>
                )}
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {t.includes.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-screens-muted">
                    <Shield className={`h-4 w-4 shrink-0 ${t.color}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                  t.id === "tier2"
                    ? "bg-screens-accent text-screens-bg hover:bg-screens-accent-dim"
                    : "border border-screens-border hover:border-screens-accent/50 hover:bg-screens-accent/5"
                }`}
              >
                Comprar no Discord
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-screens-border bg-gradient-to-b from-screens-card/50 to-screens-bg py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold">Pronto pra virar telador?</h2>
          <p className="mt-3 text-screens-muted">
            Entra no Discord, escolhe o tier e começa hoje. Curso 171 ScreenS by Samuca.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4752C4]"
          >
            <MessageCircle className="h-5 w-5" />
            discord.gg/35Aw934hNh
          </a>
        </div>
      </section>

      <footer className="border-t border-screens-border py-8 text-center text-xs text-screens-muted">
        <p>© 2026 171 ScreenS · Curso Emu by Samuca</p>
        <p className="mt-1">
          <a href={SCANNER_URL} className="text-screens-accent hover:underline" target="_blank" rel="noopener noreferrer">
            Scanner
          </a>
          {" · "}
          <a href={DISCORD_URL} className="text-screens-accent hover:underline" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </p>
      </footer>
    </div>
  );
}

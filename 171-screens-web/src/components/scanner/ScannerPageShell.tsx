"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function ScannerPageShell({
  badge,
  title,
  subtitle,
  icon: Icon,
  accent = "cyan",
  actions,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent?: "cyan" | "violet" | "amber" | "fuchsia";
  actions?: ReactNode;
  children: ReactNode;
}) {
  const accentMap = {
    cyan: {
      border: "border-cyan-500/25",
      glow: "from-cyan-500/15 via-screens-card/90 to-screens-bg",
      blob: "bg-cyan-400/15",
      badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      icon: "text-cyan-400",
      grid: "rgba(34,211,238,0.05)",
    },
    violet: {
      border: "border-violet-500/25",
      glow: "from-violet-500/15 via-screens-card/90 to-screens-bg",
      blob: "bg-violet-400/15",
      badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
      icon: "text-violet-400",
      grid: "rgba(167,139,250,0.05)",
    },
    amber: {
      border: "border-amber-500/25",
      glow: "from-amber-500/15 via-screens-card/90 to-screens-bg",
      blob: "bg-amber-400/15",
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      icon: "text-amber-400",
      grid: "rgba(251,191,36,0.05)",
    },
    fuchsia: {
      border: "border-fuchsia-500/25",
      glow: "from-fuchsia-500/15 via-screens-card/90 to-screens-bg",
      blob: "bg-fuchsia-400/15",
      badge: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
      icon: "text-fuchsia-400",
      grid: "rgba(232,121,249,0.05)",
    },
  }[accent];

  return (
    <div className="page-scanner min-h-full p-5 md:p-8 lg:p-10 max-w-6xl mx-auto">
      <section
        className={`relative overflow-hidden rounded-3xl border ${accentMap.border} bg-gradient-to-br ${accentMap.glow} p-6 md:p-8 mb-8`}
        style={{
          backgroundImage: `linear-gradient(${accentMap.grid} 1px, transparent 1px), linear-gradient(90deg, ${accentMap.grid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        <div className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full ${accentMap.blob} blur-3xl`} />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${accentMap.badge}`}>
              <Icon className={`h-3 w-3 ${accentMap.icon}`} />
              {badge}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-screens-muted">{subtitle}</p>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </section>
      {children}
    </div>
  );
}

export function ScannerPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-screens-border/80 bg-screens-card/50 backdrop-blur-sm ${className}`}>
      {title && (
        <div className="border-b border-screens-border/60 px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-screens-muted">{title}</h2>
        </div>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

export function FuturisticSaveBtn({
  onClick,
  saving,
  label = "Salvar",
}: {
  onClick: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 transition hover:opacity-90 disabled:opacity-50"
    >
      <span className="relative z-10">{saving ? "Salvando..." : label}</span>
    </button>
  );
}

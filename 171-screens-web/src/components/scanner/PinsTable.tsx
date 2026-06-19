"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  KeyRound,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Copy,
  ExternalLink,
  Link2,
  Package,
} from "lucide-react";
import Link from "next/link";
import { PinDoc } from "@/lib/scanner-types";
import { PinBadge, StatusPill } from "@/components/scanner/PinBadge";

const STAT_CONFIG = [
  { key: "total" as const, label: "Total", icon: KeyRound, color: "text-white" },
  { key: "pending" as const, label: "Aguardando", icon: Clock, color: "text-amber-400" },
  { key: "scanning" as const, label: "Ao vivo", icon: Loader2, color: "text-screens-accent" },
  { key: "finished" as const, label: "Prontos", icon: CheckCircle2, color: "text-emerald-400" },
  { key: "expired" as const, label: "Expirados", icon: AlertCircle, color: "text-red-400" },
];

function pinGlow(status: string) {
  if (status === "pending") return "pin-glow-pending border-amber-500/30";
  if (status === "scanning") return "pin-glow-scanning border-screens-accent/40";
  if (status === "finished") return "pin-glow-finished border-emerald-500/30";
  if (status === "expired") return "pin-glow-expired border-red-500/25";
  return "border-screens-border";
}

export function PinsTable({ initialPins }: { initialPins: PinDoc[] }) {
  const [pins, setPins] = useState(initialPins);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [pinName, setPinName] = useState("");
  const [createdPin, setCreatedPin] = useState<string | null>(null);
  const [createdInstallUrl, setCreatedInstallUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "scanning" | "finished">("all");

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch("/api/scanner/pins");
      if (res.ok) {
        const data = await res.json();
        setPins(data.pins);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const stats = {
    total: pins.length,
    pending: pins.filter((p) => p.status === "pending").length,
    scanning: pins.filter((p) => p.status === "scanning").length,
    finished: pins.filter((p) => p.status === "finished").length,
    expired: pins.filter((p) => p.status === "expired").length,
  };

  const filtered = pins.filter((p) => {
    const matchSearch =
      p.pin.includes(search.toUpperCase()) ||
      (p.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  async function createPin() {
    setCreating(true);
    setCreatedPin(null);
    setCreatedInstallUrl(null);
    const res = await fetch("/api/scanner/pins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: pinName, game: "FREE FIRE" }),
    });
    const data = await res.json();
    if (data.pin) {
      setPins([data.pin, ...pins]);
      setCreatedPin(data.pin.pin);
      setCreatedInstallUrl(`/install/${data.pin.pin}`);
      setPinName("");
    }
    setCreating(false);
  }

  return (
    <div className="page-scanner min-h-full p-5 md:p-8 lg:p-10 max-w-6xl mx-auto">
      {/* Hero + quick create */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 via-screens-card/80 to-screens-bg scan-grid p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              <Zap className="h-3 w-3" /> 171 ScreenS Scanner
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight">Pins</h1>
            <p className="mt-2 text-sm text-screens-muted max-w-md">
              Gera o pin, manda pro jogador digitar no .exe e acompanha o scan ao vivo daqui.
            </p>
          </div>

          <div className="w-full lg:max-w-md rounded-2xl border border-screens-border bg-screens-bg/90 p-5 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-screens-muted mb-3">Criar pin rápido</p>
            <div className="flex gap-2">
              <input
                value={pinName}
                onChange={(e) => setPinName(e.target.value)}
                placeholder="Nome da telagem (opcional)"
                className="flex-1 rounded-xl border border-screens-border bg-screens-card px-4 py-2.5 text-sm outline-none focus:border-amber-400/50"
                onKeyDown={(e) => e.key === "Enter" && !creating && createPin()}
              />
              <button
                onClick={createPin}
                disabled={creating}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-300 disabled:opacity-50 shrink-0"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Gerar
              </button>
            </div>
            {createdPin && (
              <div className="mt-4 space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4">
                <p className="text-xs text-emerald-300 font-semibold text-center">Pin criado — manda pro jogador</p>
                <PinBadge pin={createdPin} copyable />
                {createdInstallUrl && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                      <Package className="h-3 w-3" /> Link de install (exe + pin)
                    </p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={createdInstallUrl}
                        className="flex-1 rounded-lg border border-screens-border bg-screens-bg px-3 py-2 text-[11px] font-mono text-screens-muted"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(createdInstallUrl)}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-amber-300 hover:bg-amber-500/20"
                        title="Copiar link"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>
                      <a
                        href={createdInstallUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-amber-400/40 bg-amber-400 px-3 text-black hover:bg-amber-300"
                        title="Abrir página de install"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STAT_CONFIG.map((s) => {
          const Icon = s.icon;
          const val = stats[s.key];
          return (
            <div
              key={s.key}
              className="flex items-center gap-3 rounded-xl border border-screens-border/80 bg-screens-card/50 px-4 py-3 min-w-[120px]"
            >
              <Icon className={`h-4 w-4 ${s.color} ${s.key === "scanning" && val > 0 ? "animate-spin" : ""}`} />
              <div>
                <p className="text-lg font-black tabular-nums leading-none">{val}</p>
                <p className="text-[10px] text-screens-muted uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters + search */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-screens-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pin ou nome..."
            className="w-full rounded-xl border border-screens-border bg-screens-card/60 py-3 pl-11 pr-4 text-sm outline-none focus:border-screens-accent/40"
          />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl border border-screens-border bg-screens-card/40">
          {(["all", "pending", "scanning", "finished"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-screens-accent text-screens-bg"
                  : "text-screens-muted hover:text-white"
              }`}
            >
              {f === "all" ? "Todos" : f === "pending" ? "Aguard." : f === "scanning" ? "Live" : "Prontos"}
            </button>
          ))}
        </div>
      </div>

      {/* Pin cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <article
            key={p.pin}
            className={`rounded-2xl border bg-screens-card/60 p-5 transition hover:bg-screens-card/80 ${pinGlow(p.status)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <PinBadge pin={p.pin} copyable />
                <p className="mt-2 font-medium text-sm">{p.name || "Sem nome"}</p>
                <p className="text-[11px] text-screens-muted mt-0.5">{p.game}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusPill value={p.status} />
                <StatusPill value={p.result} />
              </div>
            </div>

            {p.status === "scanning" && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-screens-muted mb-1.5">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-screens-accent pulse-dot" />
                    Escaneando
                  </span>
                  <span>{Math.round(p.progress ?? 0)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-screens-bg">
                  <div
                    className="h-full rounded-full progress-scan"
                    style={{ width: `${Math.max(p.progress ?? 5, 5)}%` }}
                  />
                </div>
                {p.scanMessage && (
                  <p className="mt-2 text-[11px] text-screens-accent/80 truncate">{p.scanMessage}</p>
                )}
              </div>
            )}

            {p.status === "pending" && (
              <p className="mt-4 text-xs text-amber-400/80 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Aguardando jogador digitar no scanner
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-screens-border/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {(p.status === "finished" || p.result !== "none") ? (
                  <Link
                    href={`/dashboard/scanner/results/${p.pin}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-screens-accent hover:underline"
                  >
                    Ver relatório <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : p.status === "pending" ? (
                  <a
                    href={`/install/${p.pin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    Link install <Package className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-screens-muted">
                    {p.status === "expired" ? "Pin expirado" : "—"}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(p.pin)}
                className="rounded-lg border border-screens-border p-1.5 text-screens-muted hover:text-white hover:bg-white/5"
                title="Copiar pin"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-8 glass-card p-16 text-center">
          <KeyRound className="h-12 w-12 text-screens-muted/30 mx-auto mb-4" />
          <p className="font-semibold text-screens-muted">Nenhum pin ainda</p>
          <p className="text-sm text-screens-muted/70 mt-1">Gera um pin acima e manda pro jogador</p>
        </div>
      )}
    </div>
  );
}

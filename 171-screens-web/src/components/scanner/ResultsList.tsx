"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileBarChart, ExternalLink, Filter } from "lucide-react";
import { PinDoc, PinResult } from "@/lib/scanner-types";
import { PinBadge, StatusPill } from "@/components/scanner/PinBadge";

const RESULT_FILTERS: { key: "all" | PinResult; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "clean", label: "Clean" },
  { key: "warning", label: "Warning" },
  { key: "suspicious", label: "Suspeito" },
  { key: "cheating", label: "Cheat" },
];

function resultGlow(result: PinResult) {
  if (result === "cheating") return "border-red-500/35 pin-glow-expired";
  if (result === "suspicious") return "border-orange-500/30";
  if (result === "warning") return "border-amber-500/30 pin-glow-pending";
  if (result === "clean") return "border-emerald-500/30 pin-glow-finished";
  return "border-screens-border";
}

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function ResultsList({ initialPins }: { initialPins: PinDoc[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PinResult>("all");

  const stats = useMemo(() => ({
    total: initialPins.length,
    clean: initialPins.filter((p) => p.result === "clean").length,
    warning: initialPins.filter((p) => p.result === "warning").length,
    suspicious: initialPins.filter((p) => p.result === "suspicious").length,
    cheating: initialPins.filter((p) => p.result === "cheating").length,
  }), [initialPins]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialPins.filter((p) => {
      const matchSearch =
        !q ||
        p.pin.toLowerCase().includes(q) ||
        (p.name ?? "").toLowerCase().includes(q) ||
        p.game.toLowerCase().includes(q);
      const matchFilter = filter === "all" || p.result === filter;
      return matchSearch && matchFilter;
    });
  }, [initialPins, search, filter]);

  return (
    <div className="page-scanner min-h-full p-5 md:p-8 lg:p-10 max-w-6xl mx-auto">
      <section className="relative overflow-hidden rounded-3xl border border-screens-accent/20 bg-gradient-to-br from-screens-accent/10 via-screens-card/80 to-screens-bg scan-grid p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-screens-accent/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-screens-accent/30 bg-screens-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-screens-accent">
            <FileBarChart className="h-3 w-3" /> Relatórios
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Results</h1>
          <p className="mt-2 max-w-lg text-sm text-screens-muted">
            Scans finalizados e relatórios prontos. Clique no card para abrir o resultado completo.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { label: "Total", val: stats.total, color: "text-white" },
          { label: "Clean", val: stats.clean, color: "text-emerald-400" },
          { label: "Warning", val: stats.warning, color: "text-amber-400" },
          { label: "Suspeito", val: stats.suspicious, color: "text-orange-400" },
          { label: "Cheat", val: stats.cheating, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-screens-border/80 bg-screens-card/50 px-4 py-3 min-w-[100px]">
            <div>
              <p className={`text-lg font-black tabular-nums leading-none ${s.color}`}>{s.val}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-screens-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-screens-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pin, nome ou jogo..."
            className="w-full rounded-xl border border-screens-border bg-screens-card/60 py-3 pl-11 pr-4 text-sm outline-none focus:border-screens-accent/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-screens-border bg-screens-card/40 p-1">
          {RESULT_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key ? "bg-screens-accent text-screens-bg" : "text-screens-muted hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <Link
            key={p.pin}
            href={`/dashboard/scanner/results/${p.pin}`}
            className={`group rounded-2xl border bg-screens-card/60 p-5 transition hover:bg-screens-card/90 ${resultGlow(p.result)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <PinBadge pin={p.pin} />
                <p className="mt-2 text-sm font-medium">{p.name || "Sem nome"}</p>
                <p className="mt-0.5 text-[11px] text-screens-muted">{p.game}</p>
              </div>
              <StatusPill value={p.result !== "none" ? p.result : p.status} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-screens-border/50 pt-4 text-xs">
              <span className="text-screens-muted">
                {p.finishedAt ? formatDate(p.finishedAt) : formatDate(p.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-screens-accent group-hover:underline">
                Abrir relatório <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-8 glass-card p-16 text-center">
          <Filter className="mx-auto mb-4 h-12 w-12 text-screens-muted/30" />
          <p className="font-semibold text-screens-muted">
            {initialPins.length ? "Nenhum resultado com esse filtro" : "Nenhum resultado ainda"}
          </p>
          <p className="mt-1 text-sm text-screens-muted/70">
            {initialPins.length
              ? "Tenta outro filtro ou busca"
              : "Cria um pin em Pins, roda o scanner e volta aqui"}
          </p>
          {!initialPins.length && (
            <Link
              href="/dashboard/scanner/pins"
              className="mt-4 inline-block rounded-xl bg-screens-accent px-5 py-2.5 text-sm font-bold text-black"
            >
              Ir para Pins
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

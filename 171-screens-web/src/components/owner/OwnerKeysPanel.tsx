"use client";

import { useEffect, useState } from "react";
import { Ban, Copy, KeyRound, Plus, RefreshCw } from "lucide-react";
import { KEY_PLAN_LABELS } from "@/lib/scanner-key-meta";
import type { ScannerKeyDoc, ScannerPlan } from "@/lib/scanner-types";

const PLANS: Exclude<ScannerPlan, null>[] = ["pro", "private", "enterprise", "team"];

export function OwnerKeysPanel() {
  const [keys, setKeys] = useState<ScannerKeyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<Exclude<ScannerPlan, null>>("pro");
  const [durationDays, setDurationDays] = useState(30);
  const [note, setNote] = useState("");
  const [lastKey, setLastKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/owner/keys");
    const data = await res.json();
    setKeys(data.keys ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function generate() {
    setGenerating(true);
    setLastKey(null);
    const res = await fetch("/api/owner/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, durationDays, note: note || undefined }),
    });
    const data = await res.json();
    if (data.key?.key) {
      setLastKey(data.key.key);
      await load();
    }
    setGenerating(false);
  }

  async function banKey(key: string) {
    await fetch("/api/owner/keys", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ban_key", key }),
    });
    await load();
  }

  function statusColor(s: string) {
    if (s === "active") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (s === "redeemed") return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    if (s === "banned") return "text-red-400 border-red-500/30 bg-red-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 via-screens-card/80 to-screens-bg p-6 md:p-8 scan-grid">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10">
            <KeyRound className="h-5 w-5 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-lg font-black">Gerar Keys</h2>
            <p className="text-xs text-screens-muted">Pro · Privado · Enterprise · Duo</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-xl border p-4 text-left transition ${
                plan === p
                  ? "border-fuchsia-400 bg-fuchsia-500/15 ring-1 ring-fuchsia-400/40"
                  : "border-screens-border hover:border-fuchsia-500/30"
              }`}
            >
              <p className="text-xs font-bold uppercase text-fuchsia-300">{p}</p>
              <p className="mt-1 text-[10px] text-screens-muted leading-relaxed">{KEY_PLAN_LABELS[p]}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            Validade (dias)
            <input
              type="number"
              min={1}
              max={3650}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-fuchsia-400/40"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Nota (opcional)
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Cliente X, promo Y..."
              className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-fuchsia-400/40"
            />
          </label>
        </div>

        <button
          onClick={generate}
          disabled={generating}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {generating ? "Gerando..." : "Gerar Key"}
        </button>

        {lastKey && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <code className="flex-1 font-mono text-lg tracking-wider text-emerald-300">{lastKey}</code>
            <button
              onClick={() => navigator.clipboard.writeText(lastKey)}
              className="rounded-lg border border-emerald-500/30 p-2 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-screens-border overflow-hidden">
        <div className="flex items-center justify-between border-b border-screens-border px-5 py-4 bg-screens-card/50">
          <h3 className="font-bold">Keys ({keys.length})</h3>
          <button onClick={load} className="text-screens-muted hover:text-white">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="max-h-[480px] overflow-y-auto divide-y divide-screens-border/50">
          {keys.map((k) => (
            <div key={k.key} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-white/[0.02]">
              <code className="font-mono text-sm text-cyan-300">{k.key}</code>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(k.status)}`}>
                {k.status}
              </span>
              <span className="text-[10px] uppercase text-screens-muted">{k.plan}</span>
              <span className="text-[10px] text-screens-muted">
                {k.durationDays}d · exp {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString("pt-BR") : "—"}
              </span>
              {k.redeemedBy && (
                <span className="text-[10px] font-mono text-screens-muted truncate max-w-[120px]">
                  → {k.redeemedBy.slice(0, 12)}…
                </span>
              )}
              {k.note && <span className="text-[10px] text-screens-muted italic">{k.note}</span>}
              {k.status !== "banned" && (
                <button
                  onClick={() => banKey(k.key)}
                  className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10"
                >
                  <Ban className="h-3 w-3" /> Banir
                </button>
              )}
            </div>
          ))}
          {!keys.length && !loading && (
            <p className="p-8 text-center text-sm text-screens-muted">Nenhuma key gerada ainda</p>
          )}
        </div>
      </div>
    </div>
  );
}

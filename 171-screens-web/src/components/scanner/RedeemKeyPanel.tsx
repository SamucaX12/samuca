"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Sparkles, Zap } from "lucide-react";

const ERRORS: Record<string, string> = {
  invalid_key: "Key inválida — confere se digitou certo",
  key_banned: "Esta key foi banida",
  key_expired: "Key expirada — pede uma nova",
  key_already_used: "Key já usada por outro usuário",
  key_required: "Digita a key",
};

export function RedeemKeyPanel({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function redeem() {
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/scanner/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: key.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(ERRORS[data.error] ?? "Erro ao ativar key");
      setLoading(false);
      return;
    }
    setSuccess(
      data.plan === "enterprise" || data.plan === "team"
        ? `Key ${data.plan} ativada! Vai em Enterprise pra escolher o nome e liberar tudo.`
        : `Key ativada! Plano: ${data.plan}`
    );
    setLoading(false);
    setTimeout(() => {
      if (data.plan === "enterprise" || data.plan === "team") {
        router.push("/dashboard/scanner/enterprise");
      } else {
        router.refresh();
      }
    }, 1200);
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          placeholder="171-XXXX-XXXX-XXXX"
          className="flex-1 rounded-xl border border-cyan-500/30 bg-screens-bg px-4 py-2.5 font-mono text-sm outline-none focus:border-cyan-400/60"
          onKeyDown={(e) => e.key === "Enter" && redeem()}
        />
        <button
          onClick={redeem}
          disabled={loading || !key.trim()}
          className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-50"
        >
          {loading ? "..." : "Ativar"}
        </button>
      </div>
    );
  }

  return (
    <div className="page-scanner flex min-h-[70vh] items-center justify-center p-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-screens-card to-screens-bg p-8 md:p-10 scan-grid">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
            <KeyRound className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="mt-6 text-2xl font-black">Ativar Scanner</h1>
          <p className="mt-2 text-sm text-screens-muted">
            Cola tua key de licença pra liberar o 171 ScreenS
          </p>
        </div>

        <div className="relative mt-8 space-y-4">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="171-XXXX-XXXX-XXXX"
            className="w-full rounded-xl border border-screens-border bg-screens-bg/90 px-5 py-4 text-center font-mono text-lg tracking-widest outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            onKeyDown={(e) => e.key === "Enter" && redeem()}
          />
          <button
            onClick={redeem}
            disabled={loading || !key.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 py-4 text-sm font-black text-black disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            {loading ? "Ativando..." : "Ativar Key"}
          </button>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          {success && (
            <p className="flex items-center justify-center gap-2 text-center text-sm text-emerald-400">
              <Sparkles className="h-4 w-4" /> {success}
            </p>
          )}
        </div>

        <div className="relative mt-8 rounded-xl border border-screens-border/60 bg-screens-bg/50 p-4 text-xs text-screens-muted">
          <p className="font-bold text-cyan-300 mb-2">Tipos de key</p>
          <ul className="space-y-1 text-left">
            <li><strong className="text-white">Pro</strong> — Gera pin + vê results</li>
            <li><strong className="text-white">Privado</strong> — GUI + strings + custom detect</li>
            <li><strong className="text-white">Enterprise</strong> — Equipe 5 + ImGui + strings</li>
            <li><strong className="text-white">Duo</strong> — Equipe 2 + ImGui + strings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

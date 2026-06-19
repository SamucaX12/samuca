"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { BOOSTER_LESSON_COUNT } from "@/lib/booster-lessons";

export function SyncCargoButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const router = useRouter();

  async function sync() {
    setLoading(true);
    setMsg(null);
    setOk(null);

    try {
      const res = await fetch("/api/auth/sync", { method: "POST" });
      const data = await res.json();
      setOk(res.ok && !!data.tier);
      setMsg(data.message ?? data.error ?? "Erro ao sincronizar");
      if (res.ok) router.refresh();
    } catch {
      setOk(false);
      setMsg("Falha na conexão. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-screens-border bg-screens-card/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Deu boost ou comprou o curso?</p>
          <p className="text-xs text-screens-muted mt-0.5">
            Boost = {BOOSTER_LESSON_COUNT} aulas grátis. Compra = tier completo. Entra com Discord e sincroniza.
          </p>
        </div>
        <button
          type="button"
          onClick={sync}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-screens-accent/20 px-4 py-2 text-sm font-semibold text-screens-accent hover:bg-screens-accent/30 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Sincronizando..." : "Sincronizar cargo"}
        </button>
      </div>
      {msg && (
        <p
          className={`mt-3 flex items-center gap-2 text-xs ${ok ? "text-emerald-400" : "text-amber-400"}`}
        >
          {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {msg}
        </p>
      )}
    </div>
  );
}

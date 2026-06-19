"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export function InstallDownloadButton({ pin, className = "" }: { pin: string; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/scanner/pins/${pin}/download`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "pin_not_found"
            ? "Pin não encontrado"
            : data.error === "pin_expired"
              ? "Pin expirado — pede outro pro telador"
              : "Erro ao gerar download — tenta de novo"
        );
        return;
      }
      const blob = await res.blob();
      if (!blob.size) {
        setError("Pacote vazio — avisa o telador");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `171-screens-${pin}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Falha na conexão — recarrega a página");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={download}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-black text-black disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Gerando pacote..." : "Baixar Scanner (pin incluso)"}
      </button>
      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
    </div>
  );
}

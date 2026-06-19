"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function PinBadge({ pin, copyable = false }: { pin: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <code className="rounded-md border border-screens-border/80 bg-screens-bg px-2.5 py-1 font-mono text-xs tracking-[0.2em] text-screens-accent">
        {pin}
      </code>
      {copyable && (
        <button
          onClick={copy}
          className="rounded-md p-1 text-screens-muted hover:bg-white/5 hover:text-white"
          title="Copiar pin"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </span>
  );
}

export function StatusPill({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    scanning: "bg-screens-accent/10 text-screens-accent border-screens-accent/30",
    finished: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    expired: "bg-red-500/10 text-red-400 border-red-500/20",
    none: "bg-white/5 text-screens-muted border-screens-border",
    clean: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    suspicious: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    cheating: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const cls = styles[value] ?? styles.none;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {value}
    </span>
  );
}

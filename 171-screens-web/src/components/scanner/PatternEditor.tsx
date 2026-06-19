"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CustomPattern } from "@/lib/scanner-types";

const emptyPattern = (): CustomPattern => ({
  process: "",
  name: "",
  value: "",
  severity: "High",
});

export function PatternEditor({
  title,
  description,
  patterns,
  onChange,
  categories,
}: {
  title: string;
  description: string;
  patterns: CustomPattern[];
  onChange: (patterns: CustomPattern[]) => void;
  categories?: string[];
}) {
  const [filter, setFilter] = useState("");

  const filtered = patterns.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.value.toLowerCase().includes(filter.toLowerCase()) ||
      p.process.toLowerCase().includes(filter.toLowerCase())
  );

  function update(idx: number, field: keyof CustomPattern, value: string) {
    const next = [...patterns];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  }

  function remove(idx: number) {
    onChange(patterns.filter((_, i) => i !== idx));
  }

  return (
    <div className="rounded-2xl border border-screens-border bg-screens-card/50 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-screens-muted">{description}</p>
        </div>
        <button
          onClick={() => onChange([...patterns, emptyPattern()])}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-screens-accent px-4 py-2.5 text-xs font-semibold text-black"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar por nome, valor ou processo..."
        className="mt-6 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-screens-accent/40"
      />

      <div className="mt-6 space-y-4">
        {filtered.map((p) => {
          const idx = patterns.indexOf(p);
          return (
            <div key={idx} className="grid gap-3 rounded-xl border border-screens-border/60 bg-screens-bg/40 p-5 md:grid-cols-5">
              <input
                value={p.process}
                onChange={(e) => update(idx, "process", e.target.value)}
                placeholder="Processo (.exe)"
                className="rounded-lg border border-screens-border bg-screens-card px-3 py-2.5 text-xs outline-none"
              />
              <input
                value={p.name}
                onChange={(e) => update(idx, "name", e.target.value)}
                placeholder="Nome detect"
                className="rounded-lg border border-screens-border bg-screens-card px-3 py-2.5 text-xs outline-none"
              />
              <input
                value={p.value}
                onChange={(e) => update(idx, "value", e.target.value)}
                placeholder="SHA1 / SHA256 / DNS / string"
                className="rounded-lg border border-screens-border bg-screens-card px-3 py-2.5 text-xs outline-none md:col-span-2"
              />
              <div className="flex gap-2">
                <select
                  value={p.severity}
                  onChange={(e) => update(idx, "severity", e.target.value)}
                  className="flex-1 rounded-lg border border-screens-border bg-screens-card px-2 py-2.5 text-xs outline-none"
                >
                  {["Info", "Warning", "High", "Critical"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(idx)}
                  className="rounded-lg border border-red-500/30 px-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {!filtered.length && (
          <p className="py-12 text-center text-sm text-screens-muted">Nenhum padrão cadastrado</p>
        )}
      </div>

      {categories && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c} className="rounded-full border border-screens-border px-3 py-1 text-[10px] uppercase tracking-wide text-screens-muted">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

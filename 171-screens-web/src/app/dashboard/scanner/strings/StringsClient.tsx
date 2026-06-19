"use client";

import { useEffect, useState } from "react";
import { Binary, Cpu, Hash, Zap } from "lucide-react";
import { PatternEditor } from "@/components/scanner/PatternEditor";
import { ScannerPageShell, ScannerPanel, FuturisticSaveBtn } from "@/components/scanner/ScannerPageShell";
import { CustomPattern } from "@/lib/scanner-types";

const detectCategories = [
  "STRINGS", "SHA1", "SHA256", "DNS", "DIAGTRACK", "BAM", "SYSMON",
  ".EXE", ".DLL", ".SYS", ".TEMP", ".NODE",
];

export default function StringsClient({ canCustomDetect = true }: { canCustomDetect?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [strings, setStrings] = useState<CustomPattern[]>([]);
  const [customDetect, setCustomDetect] = useState<CustomPattern[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/scanner/enterprise?area=scanner")
      .then((r) => r.json())
      .then((data) => {
        setStrings(data.strings ?? []);
        setCustomDetect(data.customDetect ?? []);
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "scanner", strings, customDetect }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="page-scanner flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <ScannerPageShell
      badge="Pattern Engine"
      title="Strings"
      subtitle="Hashes, DNS, binários e detecções custom — alimenta o motor do scanner em tempo real."
      icon={Binary}
      accent="violet"
      actions={
        <div className="flex flex-col items-end gap-2">
          <FuturisticSaveBtn onClick={save} saving={saving} label="Salvar patterns" />
          {saved && <span className="text-xs text-emerald-400">✓ Sincronizado</span>}
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { icon: Hash, label: "Global strings", val: strings.length, c: "text-violet-300" },
          { icon: Cpu, label: "Custom detect", val: customDetect.length, c: "text-fuchsia-300" },
          { icon: Zap, label: "Categorias", val: detectCategories.length, c: "text-cyan-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-screens-border/60 bg-screens-card/40 p-4 flex items-center gap-4">
            <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-2.5">
              <s.icon className={`h-5 w-5 ${s.c}`} />
            </div>
            <div>
              <p className={`text-2xl font-black ${s.c}`}>{s.val}</p>
              <p className="text-[10px] uppercase tracking-wide text-screens-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <ScannerPanel title="Strings globais">
          <PatternEditor
            title=""
            description="Hashes, DNS, nomes de binário — sem processo específico"
            patterns={strings}
            onChange={setStrings}
            categories={detectCategories}
          />
        </ScannerPanel>

        {canCustomDetect && (
          <ScannerPanel title="Custom Detect · Privado">
            <PatternEditor
              title=""
              description="DLL hijack, RAM dump, unsigned — ligado a processo alvo"
              patterns={customDetect}
              onChange={setCustomDetect}
              categories={["DLL HIJACK", "RAM DUMP", "UNSIGNED", "BAM CLEANUP", "HOLLOWS HUNTER"]}
            />
          </ScannerPanel>
        )}
      </div>
    </ScannerPageShell>
  );
}

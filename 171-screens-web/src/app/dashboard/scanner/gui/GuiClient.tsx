"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Monitor, Palette, Sparkles } from "lucide-react";
import { ScannerPageShell, ScannerPanel, FuturisticSaveBtn } from "@/components/scanner/ScannerPageShell";

export default function GuiClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gui, setGui] = useState({
    scannerName: "171 ScreenS",
    primaryColor: "#7dd3fc",
    spinnerColor1: "#bae6fd",
    spinnerColor2: "#7dd3fc",
    spinnerColor3: "#38bdf8",
    logoUrl: "",
    loadingPhrases: ["Analisando artefatos...", "Verificando bypass...", "Cruzando evidências..."],
  });

  useEffect(() => {
    fetch("/api/scanner/enterprise?area=scanner")
      .then((r) => r.json())
      .then((data) => {
        if (data.gui) setGui((g) => ({ ...g, ...data.gui }));
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "gui", ...gui }),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="page-scanner flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <ScannerPageShell
      badge="ImGui Studio"
      title="GUI / ImGui"
      subtitle="Personaliza cores, logo e frases do scanner .exe — visual futurista pro teu brand."
      icon={Monitor}
      accent="cyan"
      actions={<FuturisticSaveBtn onClick={save} saving={saving} label="Salvar GUI" />}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <ScannerPanel title="Controles">
          <div className="space-y-5">
            <label className="block text-sm">
              <span className="flex items-center gap-2 text-screens-muted mb-2">
                <Sparkles className="h-4 w-4 text-cyan-400" /> Nome do scanner
              </span>
              <input
                value={gui.scannerName}
                onChange={(e) => setGui({ ...gui, scannerName: e.target.value })}
                className="w-full rounded-xl border border-cyan-500/20 bg-screens-bg/90 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>

            {(["primaryColor", "spinnerColor1", "spinnerColor2", "spinnerColor3"] as const).map((key) => (
              <label key={key} className="block text-sm">
                <span className="flex items-center gap-2 text-screens-muted mb-2 capitalize">
                  <Palette className="h-3.5 w-3.5" /> {key.replace(/([A-Z])/g, " $1")}
                </span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={gui[key]}
                    onChange={(e) => setGui({ ...gui, [key]: e.target.value })}
                    className="h-12 w-16 cursor-pointer rounded-xl border border-screens-border bg-transparent"
                  />
                  <input
                    value={gui[key]}
                    onChange={(e) => setGui({ ...gui, [key]: e.target.value })}
                    className="flex-1 rounded-xl border border-screens-border bg-screens-bg px-3 py-2 font-mono text-xs outline-none focus:border-cyan-400/40"
                  />
                </div>
              </label>
            ))}

            <label className="block text-sm">
              <span className="flex items-center gap-2 text-screens-muted mb-2">
                <ImageIcon className="h-4 w-4" /> Logo URL
              </span>
              <input
                value={gui.logoUrl}
                onChange={(e) => setGui({ ...gui, logoUrl: e.target.value })}
                placeholder="https://i.imgur.com/..."
                className="w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-cyan-400/40"
              />
            </label>

            <label className="block text-sm">
              Frases de loading (uma por linha)
              <textarea
                value={gui.loadingPhrases.join("\n")}
                onChange={(e) => setGui({ ...gui, loadingPhrases: e.target.value.split("\n").filter(Boolean) })}
                rows={5}
                className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-cyan-400/40 font-mono"
              />
            </label>
          </div>
        </ScannerPanel>

        <ScannerPanel title="Live Preview">
          <div
            className="relative overflow-hidden rounded-2xl border border-cyan-500/25 p-10 text-center scan-grid"
            style={{ background: `linear-gradient(135deg, ${gui.spinnerColor1}18, ${gui.primaryColor}08)` }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-screens-bg/80 to-transparent" />
            {gui.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gui.logoUrl} alt="Logo" className="relative mx-auto h-20 w-20 rounded-2xl object-cover mb-5 ring-2 ring-cyan-400/30" />
            ) : (
              <div
                className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black shadow-lg shadow-cyan-500/20"
                style={{ backgroundColor: gui.primaryColor, color: "#000" }}
              >
                {gui.scannerName.charAt(0)}
              </div>
            )}
            <p className="relative text-2xl font-black tracking-wide" style={{ color: gui.primaryColor }}>
              {gui.scannerName}
            </p>
            <div className="relative mt-8 flex justify-center gap-3">
              {[gui.spinnerColor1, gui.spinnerColor2, gui.spinnerColor3].map((c, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: c, animationDelay: `${i * 200}ms`, boxShadow: `0 0 12px ${c}` }}
                />
              ))}
            </div>
            <p className="relative mt-8 text-sm text-screens-muted font-mono">{gui.loadingPhrases[0]}</p>
          </div>
        </ScannerPanel>
      </div>
    </ScannerPageShell>
  );
}

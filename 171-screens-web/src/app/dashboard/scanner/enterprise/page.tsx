"use client";

import { useEffect, useState } from "react";
import { Building2, Mail, Palette, Rocket, Sparkles, Users, UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatternEditor } from "@/components/scanner/PatternEditor";
import { ScannerPageShell, ScannerPanel, FuturisticSaveBtn } from "@/components/scanner/ScannerPageShell";
import { CustomPattern, EnterpriseDoc } from "@/lib/scanner-types";

const detectCategories = [
  "STRINGS", "SHA1", "SHA256", "DNS", "DIAGTRACK", "BAM", "SYSMON",
  ".EXE", ".DLL", ".SYS", ".TEMP", ".NODE",
];

const SETUP_ERRORS: Record<string, string> = {
  name_too_short: "Nome muito curto — mínimo 2 caracteres",
  name_too_long: "Nome muito longo — máximo 48 caracteres",
  already_setup: "Enterprise já foi ativada",
};

export default function ScannerEnterprisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [tab, setTab] = useState<"team" | "strings" | "imgui">("team");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [planLabel, setPlanLabel] = useState("Enterprise");
  const [scannerPlan, setScannerPlan] = useState<string>("enterprise");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [setupError, setSetupError] = useState("");
  const [enterprise, setEnterprise] = useState<EnterpriseDoc | null>(null);
  const [strings, setStrings] = useState<CustomPattern[]>([]);
  const [imgui, setImgui] = useState({
    scannerName: "171 ScreenS",
    primaryColor: "#7dd3fc",
    spinnerColor1: "#bae6fd",
    spinnerColor2: "#7dd3fc",
    spinnerColor3: "#38bdf8",
    logoUrl: "",
    loadingPhrases: ["Analisando...", "Verificando bypass..."],
  });

  async function loadEnterprise() {
    const res = await fetch("/api/scanner/enterprise?area=enterprise");
    const data = await res.json();
    setNeedsSetup(!!data.needsSetup && !!data.isOwner);
    setIsOwner(data.isOwner !== false);
    setScannerPlan(data.plan ?? "enterprise");
    setPlanLabel(data.plan === "team" ? "Enterprise Duo" : "Enterprise");
    if (data.enterprise) {
      setEnterprise(data.enterprise);
      setRenameValue(data.enterprise.name ?? "");
      const cfg = data.enterprise.config ?? {};
      const patterns = cfg.customPatterns ?? [];
      setStrings(patterns.filter((p: CustomPattern) => !p.process));
      setImgui({
        scannerName: cfg.scannerName ?? data.enterprise.name ?? "171 ScreenS",
        primaryColor: cfg.primaryColor ?? "#7dd3fc",
        spinnerColor1: cfg.spinnerColor1 ?? "#bae6fd",
        spinnerColor2: cfg.spinnerColor2 ?? "#7dd3fc",
        spinnerColor3: cfg.spinnerColor3 ?? "#38bdf8",
        logoUrl: cfg.logoUrl ?? "",
        loadingPhrases: cfg.loadingPhrases ?? ["Analisando...", "Verificando bypass..."],
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEnterprise();
  }, []);

  async function activateEnterprise() {
    setActivating(true);
    setSetupError("");
    const res = await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "setup_enterprise", name: enterpriseName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSetupError(SETUP_ERRORS[data.error] ?? "Erro ao ativar enterprise");
      setActivating(false);
      return;
    }
    setEnterprise(data.enterprise);
    setNeedsSetup(false);
    setImgui((prev) => ({ ...prev, scannerName: data.enterprise.name }));
    setActivating(false);
    router.refresh();
  }

  async function save() {
    setSaving(true);
    await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area: "enterprise",
        ...imgui,
        customPatterns: strings,
      }),
    });
    setSaving(false);
  }

  async function addMember() {
    setAdding(true);
    setMemberError("");
    const res = await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "add_member", email: memberEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msgs: Record<string, string> = {
        user_not_found: "Conta não encontrada — usuário precisa ter logado com Discord antes",
        member_limit: enterprise?.plan === "team" ? "Limite Duo: 2 membros" : "Limite: 5 membros",
        already_member: "Já é membro",
      };
      setMemberError(msgs[data.error] ?? "Erro ao adicionar");
    } else {
      setMemberEmail("");
      await loadEnterprise();
    }
    setAdding(false);
  }

  async function renameEnterprise() {
    setRenaming(true);
    const res = await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "rename_enterprise", name: renameValue.trim() }),
    });
    if (res.ok) {
      await loadEnterprise();
      router.refresh();
    }
    setRenaming(false);
  }

  async function removeMember(memberId: string) {
    setRemoving(memberId);
    await fetch("/api/scanner/enterprise", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: "remove_member", memberId }),
    });
    await loadEnterprise();
    setRemoving(null);
  }

  const maxMembers = enterprise?.plan === "team" ? 2 : 5;

  if (loading) {
    return (
      <div className="page-scanner flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="page-scanner flex min-h-[70vh] items-center justify-center p-6">
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-screens-card to-screens-bg p-8 md:p-10 scan-grid">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <Building2 className="h-8 w-8 text-amber-400" />
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">{planLabel}</p>
            <h1 className="mt-2 text-2xl font-black">Ativar Enterprise</h1>
            <p className="mt-3 text-sm text-screens-muted">
              Escolhe o nome da tua operação. Esse nome aparece no ImGui e na config da equipe.
            </p>
          </div>

          <div className="relative mt-8 space-y-4">
            <label className="block text-sm">
              <span className="text-screens-muted">Nome da Enterprise</span>
              <input
                value={enterpriseName}
                onChange={(e) => setEnterpriseName(e.target.value)}
                placeholder="Ex: 171 Ops, Telagem BR, Minha Org..."
                maxLength={48}
                className="mt-2 w-full rounded-xl border border-amber-500/25 bg-screens-bg/90 px-5 py-4 text-center text-lg font-bold outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                onKeyDown={(e) => e.key === "Enter" && enterpriseName.trim().length >= 2 && activateEnterprise()}
              />
            </label>

            <button
              onClick={activateEnterprise}
              disabled={activating || enterpriseName.trim().length < 2}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-black text-black disabled:opacity-50"
            >
              <Rocket className="h-4 w-4" />
              {activating ? "Ativando..." : "Criar e Ativar Enterprise"}
            </button>

            {setupError && <p className="text-center text-sm text-red-400">{setupError}</p>}

            <div className="rounded-xl border border-screens-border/60 bg-screens-bg/50 p-4 text-xs text-screens-muted text-left">
              <p className="flex items-center gap-2 font-bold text-amber-300 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Depois de ativar libera:
              </p>
              <ul className="space-y-1">
                <li>• Equipe ({scannerPlan === "team" ? "até 2" : "até 5"} membros)</li>
                <li>• Strings compartilhadas</li>
                <li>• ImGui custom (cores, logo, nome)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "team" as const, label: "Equipe", icon: Users },
    { id: "strings" as const, label: "Strings", icon: Mail },
    { id: "imgui" as const, label: "ImGui", icon: Palette },
  ];

  const memberRows = (enterprise?.memberEmails ?? []).map((email, i) => ({
    email,
    memberId: enterprise?.memberIds?.[i + 1],
  }));

  return (
    <ScannerPageShell
      badge={enterprise?.plan === "team" ? "Enterprise Duo" : "Enterprise"}
      title={enterprise?.name ?? "Enterprise"}
      subtitle="Equipe, strings compartilhadas e ImGui — configuração centralizada da operação."
      icon={Building2}
      accent="amber"
      actions={isOwner ? <FuturisticSaveBtn onClick={save} saving={saving} label="Salvar tudo" /> : undefined}
    >
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "border-amber-400 bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30"
                : "border-screens-border text-screens-muted hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "team" && (
        <ScannerPanel title={`Membros · ${enterprise?.memberIds?.length ?? 1}/${maxMembers}`}>
          {isOwner && (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">Nome da Enterprise</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Nome da operação"
                  maxLength={48}
                  className="flex-1 rounded-xl border border-amber-500/20 bg-screens-bg px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400/50"
                />
                <button
                  onClick={renameEnterprise}
                  disabled={renaming || renameValue.trim().length < 2 || renameValue.trim() === enterprise?.name}
                  className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-5 py-3 text-sm font-bold text-amber-200 disabled:opacity-50"
                >
                  {renaming ? "..." : "Renomear"}
                </button>
              </div>
            </div>
          )}
          {isOwner ? (
            <>
              <p className="text-sm text-screens-muted mb-6">
                Convide pelo email. Cada membro usa a mesma config ImGui + strings da equipe.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="flex-1 rounded-xl border border-amber-500/20 bg-screens-bg px-4 py-3 text-sm outline-none focus:border-amber-400/50"
                />
                <button
                  onClick={addMember}
                  disabled={adding || !memberEmail.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-black disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {adding ? "..." : "Adicionar"}
                </button>
              </div>
              {memberError && <p className="mt-3 text-sm text-red-400">{memberError}</p>}
            </>
          ) : (
            <p className="text-sm text-screens-muted mb-6">
              Você faz parte desta equipe — config compartilhada pelo owner.
            </p>
          )}

          <ul className="mt-6 space-y-2">
            {isOwner && (
              <li className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm">
                <Users className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="flex-1 font-medium">Owner (você)</span>
                <span className="text-[10px] uppercase text-amber-300/80">Admin</span>
              </li>
            )}
            {memberRows.map(({ email, memberId }) => (
              <li
                key={email}
                className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3 text-sm"
              >
                <Users className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="flex-1 truncate">{email}</span>
                {isOwner && memberId && (
                  <button
                    onClick={() => removeMember(memberId)}
                    disabled={removing === memberId}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <UserMinus className="h-3 w-3" />
                    {removing === memberId ? "..." : "Remover"}
                  </button>
                )}
              </li>
            ))}
            {isOwner && memberRows.length === 0 && (
              <p className="text-sm text-screens-muted px-1">Só o owner por enquanto — adiciona membros acima.</p>
            )}
          </ul>
        </ScannerPanel>
      )}

      {tab === "strings" && (
        <ScannerPanel title="Strings Enterprise">
          <PatternEditor
            title=""
            description={isOwner ? "SHA, DNS, .exe — compartilhado com toda equipe" : "Strings compartilhadas da equipe (somente leitura)"}
            patterns={strings}
            onChange={isOwner ? setStrings : () => {}}
            categories={detectCategories}
          />
        </ScannerPanel>
      )}

      {tab === "imgui" && (
        <ScannerPanel title="ImGui Enterprise">
          {!isOwner && (
            <p className="text-sm text-screens-muted mb-6">Visualização da config ImGui da equipe.</p>
          )}
          <div className={`grid gap-5 md:grid-cols-2 ${!isOwner ? "pointer-events-none opacity-80" : ""}`}>
            <label className="text-sm md:col-span-2">
              Nome do Scanner
              <input
                value={imgui.scannerName}
                onChange={(e) => setImgui({ ...imgui, scannerName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm outline-none focus:border-amber-400/40"
              />
            </label>
            {(["primaryColor", "spinnerColor1", "spinnerColor2", "spinnerColor3"] as const).map((key) => (
              <label key={key} className="text-sm">
                {key}
                <div className="mt-2 flex gap-2">
                  <input type="color" value={imgui[key]} onChange={(e) => setImgui({ ...imgui, [key]: e.target.value })} className="h-11 w-14 rounded-lg border border-screens-border" />
                  <input value={imgui[key]} onChange={(e) => setImgui({ ...imgui, [key]: e.target.value })} className="flex-1 rounded-xl border border-screens-border bg-screens-bg px-3 py-2 font-mono text-xs" />
                </div>
              </label>
            ))}
            <label className="text-sm md:col-span-2">
              Logo URL
              <input value={imgui.logoUrl} onChange={(e) => setImgui({ ...imgui, logoUrl: e.target.value })} className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm" />
            </label>
            <label className="text-sm md:col-span-2">
              Frases loading
              <textarea value={imgui.loadingPhrases.join("\n")} onChange={(e) => setImgui({ ...imgui, loadingPhrases: e.target.value.split("\n").filter(Boolean) })} rows={4} className="mt-2 w-full rounded-xl border border-screens-border bg-screens-bg px-4 py-3 text-sm font-mono" />
            </label>
          </div>
        </ScannerPanel>
      )}
    </ScannerPageShell>
  );
}

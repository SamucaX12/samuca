"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, Shield } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";

type UserRow = {
  discordId: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
  email?: string | null;
  role: string;
  courseTier: string | null;
  banned: boolean;
};

function TierBadge({ tier }: { tier: string | null }) {
  const map: Record<string, string> = {
    tier1: "bg-tier-basic/20 text-tier-basic",
    tier2: "bg-tier-advanced/20 text-tier-advanced",
    tier3: "bg-tier-private/20 text-tier-private",
  };
  const label =
    tier === "tier1" ? "Tier I" : tier === "tier2" ? "Tier II" : tier === "tier3" ? "Tier III" : "Sem tier";
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${map[tier ?? ""] ?? "bg-screens-border text-screens-muted"}`}>
      {label}
    </span>
  );
}

function Btn({ onClick, children, variant = "default" }: { onClick: () => void; children: React.ReactNode; variant?: "default" | "accent" | "tier1" | "tier2" | "tier3" | "danger" }) {
  const cls =
    variant === "accent"
      ? "border-screens-accent/30 bg-screens-accent/10 text-screens-accent"
      : variant === "tier1"
        ? "border-tier-basic/30 bg-tier-basic/10 text-tier-basic"
        : variant === "tier2"
          ? "border-tier-advanced/30 bg-tier-advanced/10 text-tier-advanced"
          : variant === "tier3"
            ? "border-tier-private/30 bg-tier-private/10 text-tier-private"
            : variant === "danger"
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-screens-border bg-screens-bg text-screens-muted";
  return (
    <button onClick={onClick} className={`rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase hover:opacity-80 ${cls}`}>
      {children}
    </button>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<{ users: UserRow[]; stats: Record<string, number> } | null>(null);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then(setData);
  }, []);

  async function patch(discordId: string, body: Record<string, unknown>) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId, ...body }),
    });
    const fresh = await fetch("/api/admin").then((r) => r.json());
    setData(fresh);
  }

  return (
    <div className="p-8 md:p-10">
      <p className="text-xs uppercase tracking-widest text-screens-muted">Administration</p>
      <h1 className="mt-1 text-2xl font-bold">Setar cargos do curso</h1>
      <p className="text-sm text-screens-muted">Tier I Básico · Tier II Avançado · Tier III Privado</p>

      {!data ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-screens-accent border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { icon: Users, label: "Membros", value: data.stats.total },
              { icon: GraduationCap, label: "Tier I", value: data.stats.tier1 },
              { icon: GraduationCap, label: "Tier II", value: data.stats.tier2 },
              { icon: Shield, label: "Tier III", value: data.stats.tier3 },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-screens-border bg-screens-card/50 p-5 flex items-center gap-4">
                <div className="rounded-xl bg-screens-accent/10 p-3">
                  <s.icon className="h-5 w-5 text-screens-accent" />
                </div>
                <div>
                  <p className="text-xs text-screens-muted">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-8 rounded-2xl border border-screens-border overflow-hidden">
            <div className="border-b border-screens-border px-6 py-4 bg-screens-card/50">
              <h2 className="font-semibold">Membros</h2>
              <p className="text-xs text-screens-muted">Clica no tier pra setar cargo após compra</p>
            </div>
            <div className="divide-y divide-screens-border/50">
              {data.users.map((u) => (
                <div key={u.discordId} className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-white/[0.02]">
                  <UserAvatar userId={u.discordId} avatar={u.avatar} name={u.username} size={40} />
                  <div className="min-w-[160px] flex-1">
                    <p className="font-medium">{u.globalName || u.username}</p>
                    <p className="text-[11px] text-screens-muted">{u.email ?? "sem email"}</p>
                    <p className="font-mono text-[10px] text-screens-muted/60">{u.discordId}</p>
                  </div>
                  <TierBadge tier={u.courseTier} />
                  <span className="text-[10px] uppercase text-screens-muted">{u.role}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Btn onClick={() => patch(u.discordId, { courseTier: "tier1" })} variant="tier1">Tier I</Btn>
                    <Btn onClick={() => patch(u.discordId, { courseTier: "tier2" })} variant="tier2">Tier II</Btn>
                    <Btn onClick={() => patch(u.discordId, { courseTier: "tier3" })} variant="tier3">Tier III</Btn>
                    <Btn onClick={() => patch(u.discordId, { courseTier: null })}>Remover</Btn>
                    <Btn onClick={() => patch(u.discordId, { role: "admin" })} variant="accent">Admin</Btn>
                    {u.banned ? (
                      <Btn onClick={() => patch(u.discordId, { banned: false })}>Desban</Btn>
                    ) : (
                      <Btn onClick={() => patch(u.discordId, { banned: true })} variant="danger">Ban</Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

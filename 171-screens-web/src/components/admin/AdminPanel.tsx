"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  Circle,
  Crown,
  GraduationCap,
  Search,
  Shield,
  UserCog,
  Users,
  Wifi,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { formatLastSeen } from "@/lib/presence";
import type { CourseTier } from "@/lib/types";

type UserRow = {
  discordId: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
  email?: string | null;
  role: string;
  courseTier: CourseTier | null;
  banned: boolean;
  online: boolean;
  lastSeenAt?: string | null;
  lastIp?: string | null;
};

type AdminData = {
  users: UserRow[];
  stats: {
    total: number;
    online: number;
    tier1: number;
    tier2: number;
    tier3: number;
    banned: number;
  };
};

const TIERS: { id: CourseTier; label: string; color: string; ring: string }[] = [
  { id: "tier1", label: "Tier I", color: "text-tier-basic", ring: "ring-tier-basic/40 bg-tier-basic/15 border-tier-basic/30" },
  { id: "tier2", label: "Tier II", color: "text-tier-advanced", ring: "ring-tier-advanced/40 bg-tier-advanced/15 border-tier-advanced/30" },
  { id: "tier3", label: "Tier III", color: "text-tier-private", ring: "ring-tier-private/40 bg-tier-private/15 border-tier-private/30" },
];

export function AdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "tier1" | "tier2" | "tier3" | "banned">("all");
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin");
    setData(await res.json());
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, []);

  async function patch(discordId: string, body: Record<string, unknown>) {
    setBusy(discordId);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId, ...body }),
    });
    await refresh();
    setBusy(null);
  }

  function toggleTier(user: UserRow, tier: CourseTier) {
    patch(user.discordId, { courseTier: user.courseTier === tier ? null : tier });
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.users.filter((u) => {
      if (filter === "online" && !u.online) return false;
      if (filter === "banned" && !u.banned) return false;
      if (filter === "tier1" && u.courseTier !== "tier1") return false;
      if (filter === "tier2" && u.courseTier !== "tier2") return false;
      if (filter === "tier3" && u.courseTier !== "tier3") return false;
      if (!q) return true;
      return (
        u.username.toLowerCase().includes(q) ||
        (u.globalName?.toLowerCase().includes(q) ?? false) ||
        (u.email?.toLowerCase().includes(q) ?? false) ||
        u.discordId.includes(q)
      );
    });
  }, [data, search, filter]);

  return (
    <div className="min-h-full p-6 md:p-10 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-screens-card to-screens-bg p-8 md:p-10 scan-grid">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-300">Administration</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Painel Admin</h1>
            <p className="mt-2 text-sm text-screens-muted max-w-xl">
              Gerencia cargos do curso, vê quem tá online e ajusta tier com um clique.
            </p>
          </div>
          {data && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-semibold text-emerald-300">{data.stats.online} online</span>
            </div>
          )}
        </div>
      </div>

      {!data ? (
        <div className="mt-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { icon: Users, label: "Membros", value: data.stats.total, accent: "text-white" },
              { icon: Wifi, label: "Online", value: data.stats.online, accent: "text-emerald-400" },
              { icon: GraduationCap, label: "Tier I", value: data.stats.tier1, accent: "text-tier-basic" },
              { icon: GraduationCap, label: "Tier II", value: data.stats.tier2, accent: "text-tier-advanced" },
              { icon: Shield, label: "Tier III", value: data.stats.tier3, accent: "text-tier-private" },
              { icon: Ban, label: "Banidos", value: data.stats.banned, accent: "text-red-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-screens-border/70 bg-screens-card/50 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-screens-border bg-screens-bg/80 p-2.5">
                    <s.icon className={`h-4 w-4 ${s.accent}`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-screens-muted">{s.label}</p>
                    <p className={`text-xl font-black ${s.accent}`}>{s.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-screens-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar nome, email ou Discord ID..."
                className="w-full rounded-xl border border-screens-border bg-screens-bg/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/15"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Todos"],
                  ["online", "Online"],
                  ["tier1", "Tier I"],
                  ["tier2", "Tier II"],
                  ["tier3", "Tier III"],
                  ["banned", "Banidos"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    filter === id
                      ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                      : "border-screens-border text-screens-muted hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <section className="mt-6 space-y-3">
            {filtered.map((u) => (
              <div
                key={u.discordId}
                className={`rounded-2xl border p-4 md:p-5 transition ${
                  u.banned
                    ? "border-red-500/25 bg-red-500/5"
                    : "border-screens-border/70 bg-screens-card/40 hover:border-violet-500/20"
                } ${busy === u.discordId ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="relative shrink-0">
                      <UserAvatar userId={u.discordId} avatar={u.avatar} name={u.username} size={48} />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-screens-card ${
                          u.online ? "bg-emerald-400" : "bg-screens-muted/40"
                        }`}
                        title={u.online ? "Online agora" : formatLastSeen(u.lastSeenAt)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold truncate">{u.globalName || u.username}</p>
                        {u.role === "owner" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                            <Crown className="h-3 w-3" /> Owner
                          </span>
                        )}
                        {u.role === "admin" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300">
                            <UserCog className="h-3 w-3" /> Admin
                          </span>
                        )}
                        {u.banned && (
                          <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
                            Banido
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-screens-muted truncate">{u.email ?? "sem email"}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-screens-muted/80">
                        <span className="font-mono">{u.discordId}</span>
                        <span className="inline-flex items-center gap-1">
                          <Circle className={`h-2 w-2 fill-current ${u.online ? "text-emerald-400" : "text-screens-muted/50"}`} />
                          {u.online ? "Online" : formatLastSeen(u.lastSeenAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="flex flex-wrap gap-2">
                      {TIERS.map((t) => {
                        const active = u.courseTier === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => toggleTier(u, t.id)}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                              active
                                ? `${t.ring} ring-1 ${t.color}`
                                : "border-screens-border text-screens-muted hover:border-screens-muted/50 hover:text-white"
                            }`}
                          >
                            {t.label}
                            {active && " ✓"}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {u.role !== "owner" && (
                        <button
                          onClick={() => patch(u.discordId, { role: u.role === "admin" ? "customer" : "admin" })}
                          className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20"
                        >
                          {u.role === "admin" ? "Remover Admin" : "Tornar Admin"}
                        </button>
                      )}
                      <button
                        onClick={() => patch(u.discordId, { banned: !u.banned })}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                          u.banned
                            ? "border-screens-border text-screens-muted hover:text-white"
                            : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {u.banned ? "Desbanir" : "Banir"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-screens-border py-16 text-center text-screens-muted">
                Nenhum membro encontrado com esse filtro.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

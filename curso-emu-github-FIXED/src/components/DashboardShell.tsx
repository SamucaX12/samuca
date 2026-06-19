"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  MessageCircle,
  Lock,
  Search,
} from "lucide-react";
import { SessionUser } from "@/lib/types";
import { UserAvatar } from "@/components/UserAvatar";
import { hasTierAccess } from "@/lib/tier-access";
import { categories, lessons, groupLessonsByCategory, CATEGORY_META } from "@/lib/lessons";
import { TIER_ORDER, TIER_THEME, tierDisplay } from "@/lib/tier-theme";
import type { CourseTier } from "@/lib/types";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/comprar", label: "Comprar", icon: ShoppingBag },
];

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const userTierInfo = tierDisplay(user.courseTier);

  const [sidebarQuery, setSidebarQuery] = useState("");

  const [openTiers, setOpenTiers] = useState<Record<CourseTier, boolean>>({
    tier1: true,
    tier2: user.courseTier === "tier2" || user.courseTier === "tier3" || user.role !== "customer",
    tier3: user.courseTier === "tier3" || user.role === "owner" || user.role === "admin",
  });

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function toggleTier(tier: CourseTier) {
    setOpenTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  }

  function lessonLink(lessonId: string, title: string, tier: CourseTier, num: number) {
    const theme = TIER_THEME[tier];
    const locked = !hasTierAccess(user.courseTier, tier, user.role);
    const href = locked ? "/comprar" : `/dashboard/curso/${lessonId}`;
    const active = pathname === `/dashboard/curso/${lessonId}`;

    return (
      <Link
        key={lessonId}
        href={href}
        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] transition ${
          active
            ? `${theme.bgStrong} ${theme.color} font-medium`
            : locked
              ? "text-screens-muted/40 hover:text-screens-muted/60"
              : "text-screens-muted hover:bg-white/5 hover:text-white"
        }`}
      >
        <span className="truncate flex-1">{title}</span>
        <span className="text-[10px] font-mono opacity-40 shrink-0">{String(num).padStart(2, "0")}</span>
        {locked ? <Lock className="h-3 w-3 shrink-0 opacity-50" /> : null}
      </Link>
    );
  }

  return (
    <div className="flex min-h-screen bg-screens-bg">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-screens-border bg-[#0c0c0e]">
        <div className="border-b border-screens-border px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-screens-accent/15 ring-1 ring-screens-accent/25">
              <GraduationCap className="h-4 w-4 text-screens-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Curso Emu</p>
              <p className="text-[11px] text-screens-muted">171 ScreenS · Samuca</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-screens-muted/60">
            Menu
          </p>
          <nav className="space-y-0.5 mb-5">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                    active
                      ? "bg-white/8 text-white"
                      : "text-screens-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-screens-muted/60">
            Conteúdo por Tier
          </p>

          <div className="px-2 mb-3 relative">
            <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-screens-muted" />
            <input
              type="search"
              placeholder="Buscar aula..."
              value={sidebarQuery}
              onChange={(e) => setSidebarQuery(e.target.value)}
              className="w-full rounded-lg border border-screens-border bg-screens-bg/80 py-2 pl-9 pr-3 text-[12px] text-white placeholder:text-screens-muted/50 focus:outline-none focus:border-screens-accent/40"
            />
          </div>

          <div className="space-y-3">
            {TIER_ORDER.map((tierId) => {
              const theme = TIER_THEME[tierId];
              const q = sidebarQuery.trim().toLowerCase();
              const tierLessons = lessons
                .filter((l) => l.tier === tierId)
                .filter(
                  (l) =>
                    !q ||
                    l.title.toLowerCase().includes(q) ||
                    l.intro.toLowerCase().includes(q)
                );
              if (!tierLessons.length && q) return null;
              const unlocked = hasTierAccess(user.courseTier, tierId, user.role);
              const isOpen = openTiers[tierId];

              const catsInTier = categories
                .map((cat) => ({
                  cat,
                  items: groupLessonsByCategory(tierLessons).get(cat.id) ?? [],
                }))
                .filter((g) => g.items.length > 0);

              return (
                <div
                  key={tierId}
                  className={`rounded-xl border ${theme.border} overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTier(tierId)}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left ${theme.bg}`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${theme.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-bold uppercase tracking-wide ${theme.color}`}>
                        {theme.short} · {theme.name}
                      </p>
                      <p className="text-[10px] text-screens-muted">
                        {tierLessons.length} aulas · {theme.price}
                        {!unlocked && " · 🔒"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-screens-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-screens-border/50 px-2 py-2 space-y-2">
                      {catsInTier.map(({ cat, items }) => (
                        <div key={cat.id}>
                          <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-screens-muted/80">
                            {CATEGORY_META[cat.id]?.label ?? cat.label}
                          </p>
                          <div className="space-y-0.5">
                            {items.map((l, i) => lessonLink(l.id, l.title, l.tier, i + 1))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 px-2">
            <a
              href="https://discord.gg/35Aw934hNh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-screens-muted hover:bg-white/5 hover:text-white"
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4" />
                Suporte Discord
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            </a>
          </div>

          {(user.role === "admin" || user.role === "owner") && (
            <div className="mt-2 space-y-0.5 px-0">
              <Link
                href="/admin"
                className={`mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                  pathname.startsWith("/admin")
                    ? "bg-white/8 text-white"
                    : "text-screens-muted hover:bg-white/5"
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
              {user.role === "owner" && (
                <Link
                  href="/owner"
                  className={`mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                    pathname.startsWith("/owner")
                      ? "bg-white/8 text-white"
                      : "text-screens-muted hover:bg-white/5"
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  Owner
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-screens-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-screens-card/80 p-2.5">
            <UserAvatar
              userId={user.id}
              avatar={user.avatar}
              name={user.globalName || user.username}
              size={36}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.globalName || user.username}</p>
              <p className="truncate text-[10px] text-screens-muted">{user.email ?? "sem email"}</p>
            </div>
          </div>
          {userTierInfo.theme ? (
            <div
              className={`mt-2 rounded-lg border ${userTierInfo.theme.border} ${userTierInfo.theme.bg} px-3 py-2 text-center`}
            >
              <p className={`text-[11px] font-bold ${userTierInfo.theme.color}`}>
                {userTierInfo.label}
              </p>
            </div>
          ) : (
            <Link
              href="/comprar"
              className="mt-2 block rounded-lg border border-amber-500/30 bg-amber-500/10 py-2 text-center text-[11px] font-medium text-amber-400"
            >
              Comprar acesso
            </Link>
          )}
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] text-screens-muted hover:bg-white/5"
          >
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

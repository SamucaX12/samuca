"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Crown,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  KeyRound,
  FileBarChart,
  Building2,
  Type,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import { SessionUser } from "@/lib/types";
import { UserProfileCard } from "@/components/UserProfileCard";
import {
  hasScannerAccess,
  hasEnterpriseAccess,
  hasProAccess,
  canAccessStrings,
  canAccessGui,
} from "@/lib/scanner-access";

const mainNav = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/dashboard/curso", label: "Meu Curso", icon: GraduationCap },
  { href: "/dashboard/curso/booster", label: "Curso Booster", icon: Sparkles, booster: true },
  { href: "/comprar", label: "Comprar", icon: ShoppingBag },
];

const scannerNav = [
  { href: "/dashboard/scanner/pins", label: "Pins", icon: KeyRound },
  { href: "/dashboard/scanner/results", label: "Results", icon: FileBarChart },
  { href: "/dashboard/scanner/strings", label: "Strings", icon: Type },
  { href: "/dashboard/scanner/gui", label: "GUI", icon: Palette },
  { href: "/dashboard/scanner/enterprise", label: "Enterprise", icon: Building2 },
];

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scannerAccess = hasScannerAccess(user.scannerPlan, user.role);
  const showEnterprise = hasEnterpriseAccess(user.scannerPlan, user.role);
  const showStrings = canAccessStrings(user.scannerPlan, user.role);
  const showGui = canAccessGui(user.scannerPlan, user.role);
  const showPins = hasProAccess(user.scannerPlan, user.role);

  const visibleScannerNav = scannerNav.filter((item) => {
    if (item.href.includes("/pins") || item.href.includes("/results")) return showPins;
    if (item.href.includes("/strings")) return showStrings;
    if (item.href.includes("/gui")) return showGui;
    if (item.href.includes("/enterprise")) return showEnterprise;
    return true;
  });

  function navActive(href: string) {
    if (href === "/dashboard/curso/booster") {
      return pathname === href || pathname.startsWith(href + "/");
    }
    if (href === "/dashboard/curso") {
      return pathname === href || (pathname.startsWith("/dashboard/curso/") && !pathname.startsWith("/dashboard/curso/booster"));
    }
    return pathname === href;
  }

  return (
    <div className="flex min-h-screen bg-screens-bg">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-screens-border bg-[#0a0a0c]">
        <div className="border-b border-screens-border px-4 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-screens-accent/15 ring-1 ring-screens-accent/30">
              <GraduationCap className="h-5 w-5 text-screens-accent" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">171 ScreenS</p>
              <p className="text-[10px] text-screens-muted">Curso Emu</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const active = navActive(item.href);
              const isBoosterLink = "booster" in item && item.booster;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                    active
                      ? isBoosterLink
                        ? "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30"
                        : "bg-screens-accent/12 text-screens-accent border border-screens-accent/25"
                      : isBoosterLink
                        ? "text-fuchsia-400/90 hover:bg-fuchsia-500/10 hover:text-fuchsia-300"
                        : "text-screens-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-400/70">
              Scanner
            </p>
            <nav className="space-y-1">
              <Link
                href="/dashboard/ativar"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                  pathname === "/dashboard/ativar"
                    ? "bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-cyan-300 border border-cyan-500/30"
                    : "text-cyan-400/90 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
                }`}
              >
                <Zap className="h-4 w-4 shrink-0" />
                Ativar Key
              </Link>

              {scannerAccess ? (
                visibleScannerNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] ${
                        active
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          : "text-screens-muted hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })
              ) : (
                <p className="px-3 py-2 text-[10px] text-screens-muted leading-relaxed">
                  Ativa a key acima pra liberar Pins, Results e o resto.
                </p>
              )}
            </nav>
          </div>

          <div className="mt-6 px-1">
            <a
              href="https://discord.gg/35Aw934hNh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-screens-muted hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Discord
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-40" />
            </a>
          </div>

          {(user.role === "admin" || user.role === "owner") && (
            <div className="mt-2 space-y-1">
              <Link
                href="/admin"
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] ${
                  pathname.startsWith("/admin") ? "bg-white/[0.08] text-white" : "text-screens-muted hover:bg-white/5"
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
              {user.role === "owner" && (
                <Link
                  href="/owner"
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] ${
                    pathname.startsWith("/owner") ? "bg-white/[0.08] text-white" : "text-screens-muted hover:bg-white/5"
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
          <UserProfileCard user={user} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-screens-bg">{children}</main>
    </div>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { scannerPlanLabel, hasScannerAccess } from "@/lib/scanner-access";
import { tierDisplay } from "@/lib/tier-theme";
import type { SessionUser } from "@/lib/types";

export function UserProfileCard({ user }: { user: SessionUser }) {
  const router = useRouter();
  const course = tierDisplay(user.courseTier, user.accessSource);
  const scannerLabel = scannerPlanLabel(user.scannerPlan);
  const hasScanner = hasScannerAccess(user.scannerPlan, user.role);
  const displayName = user.globalName || user.username;
  const showUsername = user.username && user.username !== displayName && !user.id.startsWith("google:");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="rounded-2xl border border-screens-border/80 bg-screens-card/50 p-3">
      <div className="flex items-center gap-3">
        <UserAvatar
          userId={user.id}
          avatar={user.avatar}
          name={displayName}
          size={44}
          className="rounded-xl ring-2 ring-screens-border/60"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{displayName}</p>
          {showUsername && (
            <p className="truncate text-[11px] text-screens-muted">@{user.username}</p>
          )}
          <p className="truncate text-[11px] text-screens-muted/90 mt-0.5">
            {user.email ?? "Sem email"}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-screens-border/60 bg-screens-bg/60 px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-screens-muted">Curso</span>
          {course.theme ? (
            <span className={`text-[11px] font-bold ${course.theme.color}`}>{course.label}</span>
          ) : (
            <span className="text-[11px] font-medium text-amber-400">Sem acesso</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-screens-border/60 bg-screens-bg/60 px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-screens-muted">Scanner</span>
          <span className={`text-[11px] font-bold ${hasScanner ? "text-cyan-300" : "text-fuchsia-400/90"}`}>
            {hasScanner ? scannerLabel : "Sem key"}
          </span>
        </div>
        {(user.role === "owner" || user.role === "admin") && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/70">Cargo</span>
            <span className="text-[11px] font-bold text-violet-300 capitalize">{user.role}</span>
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/40"
      >
        <LogOut className="h-3.5 w-3.5" />
        Deslogar
      </button>
    </div>
  );
}

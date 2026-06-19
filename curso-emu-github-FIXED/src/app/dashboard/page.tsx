import Link from "next/link";
import { getSession } from "@/lib/auth";
import { tierDisplay } from "@/lib/tier-theme";
import { lessons, getLessonCounts } from "@/lib/lessons";
import { hasTierAccess } from "@/lib/tier-access";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";
import { SyncCargoButton } from "@/components/SyncCargoButton";
import { DashboardLessonBrowser } from "@/components/DashboardLessonBrowser";

export default async function DashboardPage() {
  const user = (await getSession())!;
  const userTierInfo = tierDisplay(user.courseTier);
  const counts = getLessonCounts();
  const accessible = lessons.filter((l) =>
    hasTierAccess(user.courseTier, l.tier, user.role)
  ).length;

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="rounded-2xl border border-screens-border/60 bg-gradient-to-br from-screens-card/80 to-transparent p-6 md:p-8 mb-6">
        <p className="text-xs uppercase tracking-widest text-screens-muted">Dashboard</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold">
          Olá, {user.globalName || user.username}
        </h1>
        <p className="text-sm text-screens-muted mt-2">
          {counts.total} aulas organizadas por tier e categoria
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {userTierInfo.theme ? (
            <span
              className={`inline-flex items-center gap-2 rounded-full border ${userTierInfo.theme.border} ${userTierInfo.theme.bg} px-3 py-1 text-xs font-semibold ${userTierInfo.theme.color}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${userTierInfo.theme.dot}`} />
              {userTierInfo.label}
            </span>
          ) : (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
              Sem cargo ativo
            </span>
          )}
          <span className="text-sm text-screens-muted">
            {accessible} aulas liberadas pra ti
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {TIER_ORDER.map((tierId) => {
          const theme = TIER_THEME[tierId];
          const n = counts[tierId];
          const ok = hasTierAccess(user.courseTier, tierId, user.role);
          return (
            <div
              key={tierId}
              className={`rounded-xl border ${theme.border} ${theme.bg} p-4`}
            >
              <p className={`text-xs font-bold uppercase ${theme.color}`}>
                {theme.short}
              </p>
              <p className="text-2xl font-black mt-1">{n}</p>
              <p className="text-xs text-screens-muted mt-1">aulas · {theme.price}</p>
              {!ok && (
                <Link
                  href="/comprar"
                  className={`mt-3 inline-block text-[11px] font-semibold ${theme.color} hover:underline`}
                >
                  Desbloquear →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <SyncCargoButton />

      {!user.courseTier && user.role === "customer" && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-400">Começa pelo Básico</p>
            <p className="text-sm text-screens-muted mt-1">
              Compra no Discord, recebe cargo e sincroniza.
            </p>
          </div>
          <Link
            href="/comprar"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Ver planos
          </Link>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Conteúdo do curso</h2>
        <DashboardLessonBrowser user={user} lessons={lessons} />
      </div>
    </div>
  );
}

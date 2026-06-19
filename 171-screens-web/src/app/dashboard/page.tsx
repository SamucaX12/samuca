import Link from "next/link";
import { getSession } from "@/lib/auth";
import { tierDisplay } from "@/lib/tier-theme";
import { getLessonCounts } from "@/lib/lessons";
import { lessons } from "@/lib/lessons";
import { hasLessonAccess } from "@/lib/tier-access";
import { BOOSTER_LESSON_COUNT } from "@/lib/booster-lessons";
import { SyncCargoButton } from "@/components/SyncCargoButton";
import { BookOpen, GraduationCap, Play, Sparkles, Zap } from "lucide-react";

export default async function DashboardPage() {
  const user = (await getSession())!;
  const userTierInfo = tierDisplay(user.courseTier, user.accessSource);
  const counts = getLessonCounts();
  const accessible = lessons.filter((l) => hasLessonAccess(user, l));
  const first = accessible[0];

  return (
    <div className="max-w-5xl p-6 md:p-10 space-y-8">
      <section className="rounded-3xl border border-screens-border glass-card p-8">
        <p className="text-xs uppercase tracking-widest text-screens-muted">Bem-vindo</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-black">{user.globalName || user.username}</h1>
        <p className="mt-2 text-screens-muted">
          {accessible.length} aulas liberadas · {counts.total} no curso completo
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {userTierInfo.theme ? (
            <span className={`inline-flex items-center gap-2 rounded-full border ${userTierInfo.theme.border} ${userTierInfo.theme.bg} px-3 py-1 text-xs font-bold ${userTierInfo.theme.color}`}>
              {userTierInfo.label}
            </span>
          ) : (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              Sem acesso — compra ou dá boost
            </span>
          )}
          {user.accessSource === "booster" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
              <Sparkles className="h-3 w-3" /> Booster
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={first ? `/dashboard/curso/${first.id}` : "/dashboard/curso"}
            className="inline-flex items-center gap-2 rounded-xl bg-screens-accent px-6 py-3 text-sm font-bold text-screens-bg"
          >
            <Play className="h-4 w-4" />
            {first ? "Continuar curso" : "Ver curso"}
          </Link>
          <Link
            href="/dashboard/curso/booster"
            className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-6 py-3 text-sm font-medium text-fuchsia-300 hover:bg-fuchsia-500/15"
          >
            <Sparkles className="h-4 w-4" />
            Curso Booster
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Tier I", n: counts.tier1, c: "text-emerald-400" },
          { label: "Tier II", n: counts.tier2, c: "text-sky-400" },
          { label: "Tier III", n: counts.tier3, c: "text-violet-400" },
        ].map((t) => (
          <div key={t.label} className="glass-card p-5 text-center">
            <p className={`text-3xl font-black ${t.c}`}>{t.n}</p>
            <p className="text-xs text-screens-muted mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      <SyncCargoButton />

      {!user.courseTier && user.role === "customer" && (
        <div className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/5 p-6">
          <p className="font-bold text-fuchsia-200 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Deu boost no servidor?
          </p>
          <p className="text-sm text-screens-muted mt-2">
            Ganha <strong className="text-emerald-400">{BOOSTER_LESSON_COUNT} aulas grátis</strong> no Tier I (degustação).
            Entra com Discord e clica em Sincronizar cargo.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-screens-border p-6">
        <h2 className="font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-screens-accent" />
          Como funciona (lê isso uma vez)
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-screens-muted list-decimal list-inside">
          <li>Clica em <strong className="text-white">Meu Curso</strong> no menu lateral</li>
          <li>Escolhe a aula do teu tier — cada uma explica passo a passo na SS</li>
          <li>Segue o checklist no final da aula antes de dar veredito</li>
        </ol>
        <Link href="/dashboard/curso" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-screens-accent hover:underline">
          <BookOpen className="h-4 w-4" />
          Abrir Meu Curso →
        </Link>
      </section>
    </div>
  );
}

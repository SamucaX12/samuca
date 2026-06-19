import Link from "next/link";
import { getSession } from "@/lib/auth";
import { lessons } from "@/lib/lessons";
import { hasLessonAccess, isBoosterLimited } from "@/lib/tier-access";
import { BOOSTER_LESSON_COUNT, BOOSTER_LESSON_IDS } from "@/lib/booster-lessons";
import { SyncCargoButton } from "@/components/SyncCargoButton";
import { TIER_THEME } from "@/lib/tier-theme";
import { BookOpen, ChevronRight, Lock, Play, Sparkles, Zap } from "lucide-react";

export default async function BoosterCursoPage() {
  const user = (await getSession())!;
  const theme = TIER_THEME.tier1;
  const boosterLessons = lessons.filter((l) => BOOSTER_LESSON_IDS.includes(l.id as (typeof BOOSTER_LESSON_IDS)[number]));
  const hasBooster = isBoosterLimited(user.courseTier, user.accessSource, user.role);
  const accessible = boosterLessons.filter((l) => hasLessonAccess(user, l));
  const first = accessible[0];

  return (
    <div className="page-course min-h-full p-6 md:p-10 max-w-4xl mx-auto">
      <section className="relative overflow-hidden rounded-3xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 via-screens-card to-screens-bg p-8 md:p-10 scan-grid">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-bold text-fuchsia-300">
            <Sparkles className="h-3.5 w-3.5" />
            Curso Booster
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Degustação Tier I</h1>
          <p className="mt-3 text-screens-muted max-w-xl">
            Deu <strong className="text-fuchsia-300">boost</strong> no servidor 171 ScreenS? Ganha{" "}
            <strong className="text-emerald-400">{BOOSTER_LESSON_COUNT} aulas grátis</strong> — prefetch, temp, DIE,
            fluxo e veredito básico.
          </p>

          {hasBooster ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border ${theme.border} ${theme.bg} px-4 py-2 text-sm font-bold ${theme.color}`}>
                {accessible.length}/{BOOSTER_LESSON_COUNT} aulas liberadas
              </span>
              {first && (
                <Link
                  href={`/dashboard/curso/${first.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-fuchsia-400"
                >
                  <Play className="h-4 w-4" />
                  Começar agora
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
              <p className="text-sm text-amber-200 font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Ainda não detectamos teu boost
              </p>
              <p className="mt-2 text-sm text-screens-muted">
                Entra com <strong className="text-white">Discord</strong> (não Google), dá boost no servidor e clica em
                sincronizar abaixo.
              </p>
            </div>
          )}
        </div>
      </section>

      {!hasBooster && (
        <div className="mt-6">
          <SyncCargoButton />
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-fuchsia-400" />
          Aulas booster ({BOOSTER_LESSON_COUNT})
        </h2>
        <ul className="mt-4 space-y-3">
          {boosterLessons.map((l, i) => {
            const ok = hasLessonAccess(user, l);
            return (
              <li key={l.id}>
                {ok ? (
                  <Link
                    href={`/dashboard/curso/${l.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-screens-border/70 bg-screens-card/40 p-4 hover:border-fuchsia-500/30 transition"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-sm font-black text-fuchsia-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold group-hover:text-fuchsia-200 transition">{l.title}</p>
                      <p className="text-xs text-screens-muted mt-0.5 line-clamp-1">{l.intro}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-screens-muted group-hover:text-fuchsia-400" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-screens-border/60 bg-screens-bg/40 p-4 opacity-70">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-screens-border/30 text-sm font-black text-screens-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" />
                        {l.title}
                      </p>
                      <p className="text-xs text-screens-muted mt-0.5">Dá boost + sincroniza cargo</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-10 rounded-2xl border border-screens-border p-6 text-center">
        <p className="text-sm text-screens-muted">
          Quer o Tier I completo ({lessons.filter((l) => l.tier === "tier1").length} aulas)?
        </p>
        <Link href="/comprar" className="mt-3 inline-flex text-sm font-bold text-screens-accent hover:underline">
          Comprar Tier I — R$ 60 →
        </Link>
      </div>
    </div>
  );
}

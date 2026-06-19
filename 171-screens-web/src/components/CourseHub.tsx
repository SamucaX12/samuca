"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Lock,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { categories, lessons, CATEGORY_META, groupLessonsByCategory } from "@/lib/lessons";
import { hasTierAccess, hasLessonAccess, isBoosterLimited } from "@/lib/tier-access";
import { BOOSTER_LESSON_COUNT } from "@/lib/booster-lessons";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";
import type { CourseTier, SessionUser } from "@/lib/types";

export function CourseHub({
  user,
  counts,
}: {
  user: SessionUser;
  counts: { tier1: number; tier2: number; tier3: number; total: number };
}) {
  const [query, setQuery] = useState("");
  const [activeTier, setActiveTier] = useState<CourseTier>(user.courseTier ?? "tier1");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

  const boosterMode = isBoosterLimited(user.courseTier, user.accessSource, user.role);

  const accessible = useMemo(
    () => lessons.filter((l) => hasLessonAccess(user, l)),
    [user]
  );

  const tierLessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons
      .filter((l) => l.tier === activeTier)
      .filter((l) => {
        if (!q) return true;
        return (
          l.title.toLowerCase().includes(q) ||
          l.intro.toLowerCase().includes(q) ||
          CATEGORY_META[l.categoryId]?.label.toLowerCase().includes(q)
        );
      });
  }, [activeTier, query]);

  const grouped = useMemo(() => groupLessonsByCategory(tierLessons), [tierLessons]);
  const theme = TIER_THEME[activeTier];
  const tierUnlocked = hasTierAccess(user.courseTier, activeTier, user.role);
  const boosterTierActive = boosterMode && activeTier === "tier1";
  const progressDenominator = boosterTierActive ? BOOSTER_LESSON_COUNT : tierLessons.length;
  const progressNumerator = boosterTierActive
    ? accessible.filter((l) => l.tier === "tier1").length
    : accessible.filter((l) => l.tier === activeTier).length;
  const progress =
    progressDenominator > 0 ? Math.round((progressNumerator / progressDenominator) * 100) : 0;

  const firstAccessible = tierLessons.find((l) => hasLessonAccess(user, l));

  function toggleCat(id: string) {
    setOpenCats((p) => ({ ...p, [id]: !(p[id] ?? true) }));
  }

  return (
    <div className="page-course min-h-full">
      <div className="flex flex-col lg:flex-row min-h-full">
        {/* Sidebar tiers */}
        <aside className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-screens-border bg-[#08080a]/80 p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.bgStrong} border ${theme.border}`}>
              <GraduationCap className={`h-5 w-5 ${theme.color}`} />
            </div>
            <div>
              <p className="font-bold text-sm">Meu Curso</p>
              <p className="text-[11px] text-screens-muted">{counts.total} aulas</p>
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-screens-muted mb-3">Seu tier</p>
          <div className="space-y-2">
            {TIER_ORDER.map((tierId) => {
              const th = TIER_THEME[tierId];
              const ok = hasTierAccess(user.courseTier, tierId, user.role);
              const active = activeTier === tierId;
              const n = counts[tierId];
              return (
                <button
                  key={tierId}
                  onClick={() => setActiveTier(tierId)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? `${th.borderStrong} ${th.bgStrong}`
                      : "border-screens-border/50 hover:border-screens-border"
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-black text-sm ${th.bg} ${th.color}`}>
                    {tierId === "tier1" ? "I" : tierId === "tier2" ? "II" : "III"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${active ? th.color : "text-white"}`}>{th.name}</p>
                    <p className="text-[10px] text-screens-muted">{n} aulas · {th.price}</p>
                  </div>
                  {ok ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-screens-muted/40 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {user.accessSource === "booster" && (
            <div className="mt-4 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/8 p-3">
              <p className="text-[11px] font-semibold text-fuchsia-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Booster ativo
              </p>
              <p className="text-[10px] text-screens-muted mt-1">
                {BOOSTER_LESSON_COUNT} aulas grátis no Tier I
              </p>
              <Link
                href="/comprar"
                className="mt-2 block text-center text-[10px] font-bold text-fuchsia-300 hover:underline"
              >
                Comprar Tier I completo →
              </Link>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-screens-border/60 bg-screens-bg/50 p-4">
            <p className="text-[10px] uppercase tracking-wider text-screens-muted">Como estudar</p>
            <ol className="mt-3 space-y-2 text-[11px] text-screens-muted">
              <li><span className="text-screens-accent font-bold">1.</span> Escolhe o tier na esquerda</li>
              <li><span className="text-screens-accent font-bold">2.</span> Abre a categoria</li>
              <li><span className="text-screens-accent font-bold">3.</span> Segue módulo + checklist</li>
            </ol>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 md:p-8 lg:p-10">
          {/* Tier header */}
          <div className={`rounded-2xl border-2 ${theme.borderStrong} ${theme.bg} p-6 md:p-8 mb-8`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${theme.color}`}>
                  {theme.short} · {theme.name}
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-black">{theme.description.split(".")[0]}</h1>
                <p className="mt-2 text-sm text-screens-muted">
                  {boosterTierActive
                    ? `${BOOSTER_LESSON_COUNT} aulas liberadas · degustação booster`
                    : `${tierLessons.length} aulas neste tier`}
                  {!tierUnlocked && " · Compra ou dá boost pra liberar"}
                </p>
              </div>
              {tierUnlocked && firstAccessible && (
                <Link
                  href={`/dashboard/curso/${firstAccessible.id}`}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold ${theme.btn}`}
                >
                  <Play className="h-4 w-4" />
                  Começar tier
                </Link>
              )}
            </div>
            {tierUnlocked && (
              <div className="mt-6">
                <div className="flex justify-between text-[11px] text-screens-muted mb-2">
                  <span>Acesso liberado</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-screens-bg">
                  <div className={`h-full rounded-full ${theme.dot}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-screens-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar em ${theme.name}...`}
              className="w-full rounded-xl border border-screens-border bg-screens-card/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-screens-accent/40"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {categories
              .filter((c) => grouped.has(c.id))
              .map((cat) => {
                const items = grouped.get(cat.id)!;
                const meta = CATEGORY_META[cat.id];
                const isOpen = openCats[cat.id] ?? true;

                return (
                  <section key={cat.id} className="glass-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} border ${theme.border}`}>
                        <FolderOpen className={`h-4 w-4 ${theme.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{meta?.label ?? cat.label}</p>
                        <p className="text-xs text-screens-muted">{meta?.description} · {items.length} aulas</p>
                      </div>
                      <span className={`rounded-md border ${theme.border} px-2 py-0.5 text-[10px] font-bold ${theme.color}`}>
                        {meta?.short}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-screens-muted transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="border-t border-screens-border/50 divide-y divide-screens-border/30">
                        {items.map((l, i) => {
                          const ok = hasLessonAccess(user, l);
                          const lockedReason = !ok && boosterMode && l.tier === "tier1" ? "booster" : "tier";
                          return (
                            <Link
                              key={l.id}
                              href={ok ? `/dashboard/curso/${l.id}` : "/comprar"}
                              className={`group flex items-center gap-4 px-5 py-4 transition ${
                                ok ? "hover:bg-white/[0.03]" : "opacity-50"
                              }`}
                            >
                              <span className={`w-8 text-center font-mono text-xs font-bold ${theme.colorMuted}`}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className={`rounded-lg p-2 border ${theme.border} ${theme.bg}`}>
                                {ok ? (
                                  <BookOpen className={`h-3.5 w-3.5 ${theme.icon}`} />
                                ) : (
                                  <Lock className="h-3.5 w-3.5 text-screens-muted/50" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${ok ? "text-white" : "text-screens-muted"}`}>
                                  {l.title}
                                </p>
                                <p className="text-xs text-screens-muted truncate mt-0.5">
                                  {lockedReason === "booster" ? "Comprar Tier I para desbloquear" : l.intro}
                                </p>
                              </div>
                              {ok && (
                                <ChevronRight className="h-4 w-4 text-screens-muted opacity-0 group-hover:opacity-100 group-hover:text-screens-accent transition shrink-0" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}

            {!tierLessons.length && (
              <div className="glass-card p-12 text-center text-screens-muted">
                Nenhuma aula encontrada.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ArrowRight,
  Lock,
  Search,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import type { Lesson } from "@/lib/lessons";
import { categories, groupLessonsByCategory, CATEGORY_META } from "@/lib/lessons";
import { hasTierAccess } from "@/lib/tier-access";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";
import type { CourseTier, SessionUser } from "@/lib/types";

export function DashboardLessonBrowser({
  user,
  lessons,
}: {
  user: SessionUser;
  lessons: Lesson[];
}) {
  const [query, setQuery] = useState("");
  const [openTiers, setOpenTiers] = useState<Record<CourseTier, boolean>>({
    tier1: true,
    tier2: true,
    tier3: true,
  });
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.intro.toLowerCase().includes(q) ||
        CATEGORY_META[l.categoryId]?.label.toLowerCase().includes(q)
    );
  }, [lessons, query]);

  function toggleCat(key: string) {
    setOpenCats((p) => ({ ...p, [key]: !(p[key] ?? true) }));
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-screens-muted" />
        <input
          type="search"
          placeholder="Buscar aula, tema ou categoria..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-screens-border bg-screens-card/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-screens-muted/60 focus:border-screens-accent/50 focus:outline-none"
        />
      </div>

      {TIER_ORDER.map((tierId) => {
        const theme = TIER_THEME[tierId];
        const tierLessons = filtered.filter((l) => l.tier === tierId);
        if (!tierLessons.length) return null;

        const unlocked = hasTierAccess(user.courseTier, tierId, user.role);
        const groups = groupLessonsByCategory(tierLessons);
        const isTierOpen = openTiers[tierId];

        return (
          <section
            key={tierId}
            className={`rounded-2xl border ${theme.border} overflow-hidden`}
          >
            <button
              type="button"
              onClick={() => setOpenTiers((p) => ({ ...p, [tierId]: !p[tierId] }))}
              className={`flex w-full items-center justify-between gap-4 px-6 py-5 ${theme.bg} text-left`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.bgStrong} border ${theme.border} text-lg font-black ${theme.color}`}
                >
                  {tierId === "tier1" ? "I" : tierId === "tier2" ? "II" : "III"}
                </span>
                <div>
                  <h2 className={`text-lg font-bold ${theme.color}`}>
                    {theme.short} · {theme.name}
                  </h2>
                  <p className="text-sm text-screens-muted">
                    {tierLessons.length} aulas · {theme.price}
                    {!unlocked && " · bloqueado"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-screens-muted transition ${isTierOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isTierOpen && (
              <div className="bg-screens-card/20 divide-y divide-screens-border/40">
                {categories
                  .filter((c) => groups.has(c.id))
                  .map((cat) => {
                    const items = groups.get(cat.id)!;
                    const catKey = `${tierId}-${cat.id}`;
                    const catOpen = openCats[catKey] ?? true;
                    const meta = CATEGORY_META[cat.id];

                    return (
                      <div key={catKey}>
                        <button
                          type="button"
                          onClick={() => toggleCat(catKey)}
                          className="flex w-full items-center gap-3 px-6 py-3.5 hover:bg-white/[0.02] text-left"
                        >
                          <FolderOpen className={`h-4 w-4 shrink-0 ${theme.icon}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {meta?.label ?? cat.label}
                            </p>
                            <p className="text-xs text-screens-muted truncate">
                              {meta?.description ?? cat.description} · {items.length} aulas
                            </p>
                          </div>
                          <span
                            className={`rounded-md border ${theme.border} px-2 py-0.5 text-[10px] font-bold ${theme.color}`}
                          >
                            {meta?.short}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-screens-muted transition ${catOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {catOpen && (
                          <div className="pb-2">
                            {items.map((l, i) => {
                              const ok = hasTierAccess(user.courseTier, l.tier, user.role);
                              return (
                                <Link
                                  key={l.id}
                                  href={ok ? `/dashboard/curso/${l.id}` : "/comprar"}
                                  className="flex items-center gap-4 px-6 py-3 pl-14 hover:bg-white/[0.02] transition group"
                                >
                                  <span className={`w-6 text-[11px] font-mono ${theme.colorMuted}`}>
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <div
                                    className={`rounded-lg p-2 border ${theme.border} ${theme.bg}`}
                                  >
                                    {ok ? (
                                      <BookOpen className={`h-3.5 w-3.5 ${theme.icon}`} />
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 text-screens-muted/50" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm font-medium truncate ${ok ? "text-white" : "text-screens-muted/60"}`}
                                    >
                                      {l.title}
                                    </p>
                                    <p className="text-xs text-screens-muted truncate mt-0.5">
                                      {l.intro}
                                    </p>
                                  </div>
                                  <ArrowRight
                                    className={`h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition ${theme.color}`}
                                  />
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

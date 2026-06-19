import Link from "next/link";
import { Lock, CheckCircle2, BookOpen, Lightbulb, AlertTriangle } from "lucide-react";
import { getLesson, getCategory, lessons } from "@/lib/lessons";
import { hasTierAccess } from "@/lib/tier-access";
import { TIER_THEME } from "@/lib/tier-theme";
import type { SessionUser } from "@/lib/types";

export function LessonView({ lessonId, user }: { lessonId: string; user: SessionUser }) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return (
      <div className="p-8">
        <p className="text-screens-muted">Aula não encontrada.</p>
      </div>
    );
  }

  const category = getCategory(lesson.categoryId);
  const theme = TIER_THEME[lesson.tier];
  const allowed = hasTierAccess(user.courseTier, lesson.tier, user.role);
  const tierLessons = lessons.filter((l) => l.tier === lesson.tier);
  const idx = tierLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? tierLessons[idx - 1] : null;
  const next = idx < tierLessons.length - 1 ? tierLessons[idx + 1] : null;

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className={`rounded-2xl border ${theme.border} bg-screens-card p-10 max-w-md ${
          lesson.tier === "tier1" ? "tier-glow-emerald" : lesson.tier === "tier2" ? "tier-glow-sky" : "tier-glow-violet"
        }`}>
          <Lock className={`mx-auto h-10 w-10 mb-4 ${theme.color}`} />
          <h2 className="text-xl font-bold">Conteúdo bloqueado</h2>
          <p className="mt-2 text-sm text-screens-muted">
            Esta aula faz parte do{" "}
            <span className={`font-semibold ${theme.color}`}>
              {theme.short} · {theme.name}
            </span>
          </p>
          <Link
            href="/comprar"
            className={`mt-6 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold ${theme.btn}`}
          >
            Desbloquear — {theme.price}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-8 md:p-10">
      <div className={`mb-6 inline-flex items-center gap-2 rounded-full border ${theme.border} ${theme.bg} px-3 py-1.5`}>
        <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
        <span className={`text-xs font-bold uppercase ${theme.color}`}>
          {theme.short} · {theme.name}
        </span>
        <span className="text-screens-border">|</span>
        <span className="text-xs text-screens-muted uppercase">{category?.label}</span>
        <span className="text-screens-border">|</span>
        <span className="text-xs text-screens-muted">
          {idx + 1}/{tierLessons.length}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight leading-tight">{lesson.title}</h1>
      <p className="mt-4 text-base text-screens-muted leading-relaxed border-l-2 border-screens-accent/40 pl-4">
        {lesson.intro}
      </p>

      <div className="mt-10 space-y-6">
        {lesson.sections.map((sec, i) => (
          <section
            key={sec.heading}
            className={`glass-card p-6 ${i === 0 ? `border-l-4 ${theme.borderStrong}` : ""}`}
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className={`h-4 w-4 ${theme.icon}`} />
              {sec.heading}
            </h2>
            <p className="mt-3 text-sm text-screens-muted leading-relaxed whitespace-pre-line">{sec.body}</p>
            {sec.example && (
              <div className={`mt-4 rounded-xl border ${theme.border} bg-[#08080a] p-4`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${theme.color}`}>
                  <Lightbulb className="h-3 w-3" />
                  Exemplo prático — caso real
                </p>
                <pre className="text-xs text-emerald-200/80 whitespace-pre-wrap font-mono leading-relaxed">
                  {sec.example}
                </pre>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className={`mt-10 rounded-2xl border ${theme.borderStrong} ${theme.bg} p-6`}>
        <h3 className="font-semibold flex items-center gap-2">
          <CheckCircle2 className={`h-4 w-4 ${theme.icon}`} />
          Checklist do telador
        </h3>
        <ul className="mt-4 space-y-2.5">
          {lesson.checklist.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-screens-muted">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/70 leading-relaxed">
          Nunca banir só por um indicador isolado. Cruza evidências, documenta com print datado e segue a regra do teu servidor.
        </p>
      </div>

      <div className="mt-8 flex justify-between gap-4 border-t border-screens-border pt-6">
        {prev && hasTierAccess(user.courseTier, prev.tier, user.role) ? (
          <Link href={`/dashboard/curso/${prev.id}`} className="text-sm text-screens-muted hover:text-white">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && hasTierAccess(user.courseTier, next.tier, user.role) ? (
          <Link href={`/dashboard/curso/${next.id}`} className={`text-sm font-medium ${theme.color} hover:underline`}>
            {next.title} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

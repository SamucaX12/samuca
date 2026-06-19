import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Play,
  MessageSquareQuote,
  Target,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { getLesson, getCategory, lessons } from "@/lib/lessons";
import { hasLessonAccess, isBoosterLimited } from "@/lib/tier-access";
import { BOOSTER_LESSON_COUNT } from "@/lib/booster-lessons";
import { TIER_THEME } from "@/lib/tier-theme";
import type { LessonSectionKind } from "@/lib/lessons/types";
import type { SessionUser } from "@/lib/types";

function embedVideo(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1];
    if (id) {
      return (
        <iframe
          className="aspect-video w-full rounded-xl border border-screens-border"
          src={`https://www.youtube.com/embed/${id}`}
          title="Vídeo da aula"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }
  return (
    <video controls className="w-full rounded-xl border border-screens-border" src={url}>
      Seu navegador não suporta vídeo.
    </video>
  );
}

const SECTION_STYLE: Record<
  LessonSectionKind,
  { icon: typeof BookOpen; border: string; bg: string; label?: string; accent: string }
> = {
  intro: { icon: BookOpen, border: "border-screens-accent/30", bg: "bg-screens-accent/5", label: "Intro", accent: "text-screens-accent" },
  modulo: { icon: BookOpen, border: "border-sky-500/30", bg: "bg-sky-500/5", label: "Módulo", accent: "text-sky-400" },
  tecnica: { icon: Target, border: "border-amber-500/30", bg: "bg-amber-500/5", label: "Técnica", accent: "text-amber-400" },
  zuera: { icon: MessageSquareQuote, border: "border-fuchsia-500/35", bg: "bg-fuchsia-500/8", label: "Zuera", accent: "text-fuchsia-400" },
  veredito: { icon: CheckCircle2, border: "border-emerald-500/30", bg: "bg-emerald-500/5", label: "Veredito", accent: "text-emerald-400" },
  normal: { icon: BookOpen, border: "border-screens-border/60", bg: "bg-screens-card/30", accent: "text-screens-muted" },
};

function detectKind(heading: string, explicit?: LessonSectionKind): LessonSectionKind {
  if (explicit) return explicit;
  const h = heading.toLowerCase();
  if (h.includes("zuera") || h.includes("🤣")) return "zuera";
  if (h.includes("módulo") || h.includes("modulo") || h.includes("📚")) return "modulo";
  if (h.includes("veredito") || h.includes("gran finale")) return "veredito";
  if (h.includes("técnica") || h.includes("tecnica") || h.includes("🕵") || h.includes("🛠")) return "tecnica";
  if (h.includes("bem-vindo") || h.includes("o que é")) return "intro";
  return "normal";
}

export function LessonView({ lessonId, user }: { lessonId: string; user: SessionUser }) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return (
      <div className="p-10">
        <p className="text-screens-muted">Aula não encontrada.</p>
      </div>
    );
  }

  const category = getCategory(lesson.categoryId);
  const theme = TIER_THEME[lesson.tier];
  const boosterMode = isBoosterLimited(user.courseTier, user.accessSource, user.role);
  const allowed = hasLessonAccess(user, lesson);
  const tierLessons = lessons.filter((l) => {
    if (l.tier !== lesson.tier) return false;
    if (boosterMode) return hasLessonAccess(user, l);
    return true;
  });
  const idx = tierLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? tierLessons[idx - 1] : null;
  const next = idx < tierLessons.length - 1 ? tierLessons[idx + 1] : null;

  if (!allowed) {
    const boosterLocked = boosterMode && lesson.tier === "tier1";
    return (
      <div className="page-course flex min-h-[60vh] flex-col items-center justify-center p-10 text-center">
        <div className="glass-card p-12 max-w-md">
          <Lock className={`mx-auto h-10 w-10 mb-4 ${theme.color}`} />
          <h2 className="text-xl font-bold">
            {boosterLocked ? "Aula exclusiva do Tier I pago" : "Conteúdo bloqueado"}
          </h2>
          <p className="mt-3 text-sm text-screens-muted">
            {boosterLocked
              ? `Booster libera só ${BOOSTER_LESSON_COUNT} aulas de degustação. Compra o Tier I completo pra ver tudo.`
              : `${theme.short} · ${theme.name}`}
          </p>
          <Link href="/comprar" className={`mt-8 inline-block rounded-xl px-8 py-3 text-sm font-semibold ${theme.btn}`}>
            {boosterLocked ? "Comprar Tier I — R$ 60" : `Desbloquear — ${theme.price}`}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-course min-h-full flex flex-col lg:flex-row">
      {/* Sidebar outline */}
      <aside className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-screens-border bg-[#08080a]/60 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Link
          href="/dashboard/curso"
          className="inline-flex items-center gap-1 text-xs text-screens-muted hover:text-screens-accent mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Curso
        </Link>

        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.color}`}>{theme.short}</p>
        <p className="mt-1 text-sm font-semibold leading-snug line-clamp-3">{lesson.title}</p>
        <p className="mt-2 text-[10px] text-screens-muted">
          Aula {idx + 1}/{tierLessons.length} · {category?.label}
        </p>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-screens-bg">
          <div className={`h-full ${theme.dot} rounded-full`} style={{ width: `${((idx + 1) / tierLessons.length) * 100}%` }} />
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-screens-muted">
          <List className="h-3 w-3" /> Módulos
        </p>
        <nav className="mt-2 space-y-1">
          {lesson.sections.map((sec, i) => {
            const kind = detectKind(sec.heading, sec.kind);
            const st = SECTION_STYLE[kind];
            return (
              <a
                key={i}
                href={`#sec-${i}`}
                className="flex items-start gap-2 rounded-lg px-2 py-2 text-[11px] text-screens-muted hover:bg-white/5 hover:text-white transition"
              >
                <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
                <span className="line-clamp-2">{sec.heading.replace(/📚|🕵️|🕒|❌|🛠️/g, "").trim()}</span>
              </a>
            );
          })}
          <a
            href="#checklist"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-emerald-400/80 hover:bg-white/5"
          >
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            Checklist SS
          </a>
        </nav>

        <div className="mt-6 pt-4 border-t border-screens-border/50 space-y-2">
          {prev && hasLessonAccess(user, prev) && (
            <Link href={`/dashboard/curso/${prev.id}`} className="block text-[11px] text-screens-muted hover:text-white truncate">
              ← {prev.title}
            </Link>
          )}
          {next && hasLessonAccess(user, next) && (
            <Link href={`/dashboard/curso/${next.id}`} className={`block text-[11px] font-medium ${theme.color} hover:underline truncate`}>
              {next.title} →
            </Link>
          )}
        </div>
      </aside>

      {/* Content */}
      <article className="flex-1 p-5 md:p-10 lg:p-12 max-w-3xl">
        <header className="mb-10">
          <div className={`inline-flex items-center gap-2 rounded-full border ${theme.border} ${theme.bg} px-3 py-1.5 mb-4`}>
            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
            <span className={`text-[10px] font-bold uppercase ${theme.color}`}>{category?.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">{lesson.title}</h1>
          <p className="mt-5 text-base text-screens-muted leading-relaxed border-l-2 border-screens-accent/40 pl-4">
            {lesson.intro}
          </p>
          {lesson.introVideo && (
            <div className="mt-8">
              {embedVideo(lesson.introVideo)}
            </div>
          )}
        </header>

        <div className="space-y-6">
          {lesson.sections.map((sec, i) => {
            const kind = detectKind(sec.heading, sec.kind);
            const style = SECTION_STYLE[kind];
            const Icon = style.icon;

            return (
              <section
                id={`sec-${i}`}
                key={`${sec.heading}-${i}`}
                className={`scroll-mt-6 rounded-2xl border p-6 md:p-7 ${style.border} ${style.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}>
                    <Icon className={`h-4 w-4 ${style.accent}`} />
                  </div>
                  <div>
                    {style.label && kind !== "normal" && (
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${style.accent}`}>
                        {style.label}
                      </p>
                    )}
                    <h2 className="text-lg font-bold leading-snug">{sec.heading}</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm md:text-[15px] text-screens-muted leading-relaxed whitespace-pre-line">
                  {sec.body}
                </p>

                {sec.image && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-screens-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sec.image} alt={sec.heading} className="w-full" />
                  </div>
                )}
                {sec.video && <div className="mt-5">{embedVideo(sec.video)}</div>}

                {sec.example && (
                  <div className={`mt-5 rounded-xl border p-4 ${kind === "zuera" ? "border-fuchsia-500/25 bg-fuchsia-500/5" : "border-screens-border bg-[#08080a]"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${style.accent}`}>
                      <Lightbulb className="h-3 w-3" />
                      {kind === "zuera" ? "Fala isso na call" : "Exemplo"}
                    </p>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${kind === "zuera" ? "text-fuchsia-100/90 italic" : "text-emerald-200/75"}`}>
                      {sec.example}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section id="checklist" className={`scroll-mt-6 mt-10 rounded-2xl border-2 ${theme.borderStrong} ${theme.bg} p-6 md:p-7`}>
          <h3 className="font-bold flex items-center gap-2">
            <CheckCircle2 className={`h-5 w-5 ${theme.icon}`} />
            Checklist na SS
          </h3>
          <ul className="mt-4 space-y-2.5">
            {lesson.checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-screens-muted">
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${theme.dot}`} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3 flex gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Cruza evidências antes do veredito. Print com data/hora.
          </p>
        </div>

        <div className="mt-8 flex justify-between gap-4 lg:hidden">
          {prev && (
            <Link href={`/dashboard/curso/${prev.id}`} className="text-sm text-screens-muted hover:text-white truncate max-w-[45%]">
              ← Anterior
            </Link>
          )}
          {next && (
            <Link href={`/dashboard/curso/${next.id}`} className={`text-sm font-medium ${theme.color} ml-auto truncate max-w-[45%]`}>
              Próxima →
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

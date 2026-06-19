import Link from "next/link";
import { getDiscordAuthUrl } from "@/lib/auth";
import { Clock, GraduationCap, MessageCircle, Scan, Sparkles } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const discordUrl = getDiscordAuthUrl();
  const error = params.error;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-screens-bg px-4">
      <div className="pointer-events-none absolute inset-0 scan-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-screens-border/80 bg-screens-card/80 p-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
            <GraduationCap className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">171 ScreenS</h1>
            <p className="text-[11px] text-screens-muted">Curso Emu · Scanner · by Samuca</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-screens-muted leading-relaxed">
          Entra com Discord. Curso pelo cargo no servidor. Scanner precisa de{" "}
          <strong className="text-cyan-300">key de licença</strong>.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Erro: {decodeURIComponent(error)}
          </div>
        )}

        <div className="mt-8 space-y-3">
          {discordUrl ? (
            <a
              href={discordUrl}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] py-3.5 text-sm font-bold text-white transition hover:bg-[#4752C4]"
            >
              <MessageCircle className="h-5 w-5" />
              Entrar com Discord
            </a>
          ) : (
            <p className="text-xs text-amber-400 text-center">DISCORD_CLIENT_ID não configurado</p>
          )}

          <button
            type="button"
            disabled
            className="relative flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-screens-border/60 bg-screens-bg/40 py-3.5 text-sm font-bold text-screens-muted opacity-70"
          >
            <svg className="h-5 w-5 opacity-50" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
            <span className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
              <Clock className="h-3 w-3" /> Em breve
            </span>
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Scan className="h-3.5 w-3.5" /> Scanner
          </p>
          <p className="mt-1 text-[11px] text-screens-muted">
            Após login, ativa tua key em <Sparkles className="inline h-3 w-3 text-fuchsia-400" /> Ativar Key
          </p>
        </div>

        <Link href="/" className="mt-6 block text-center text-xs text-screens-muted hover:text-cyan-300 transition">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}

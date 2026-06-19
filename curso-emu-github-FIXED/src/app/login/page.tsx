import Link from "next/link";
import { getDiscordAuthUrl } from "@/lib/auth";
import { GraduationCap, MessageCircle } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authUrl = getDiscordAuthUrl();
  const error = params.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-screens-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-screens-border bg-screens-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-screens-accent/10">
            <GraduationCap className="h-6 w-6 text-screens-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Curso Emu</h1>
            <p className="text-xs text-screens-muted">171 ScreenS · by Samuca</p>
          </div>
        </div>

        <p className="text-sm text-screens-muted mb-6">
          Entra com Discord pra acessar o curso, foto, email e teu tier.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Erro: {decodeURIComponent(error)}
          </div>
        )}

        {authUrl ? (
          <a
            href={authUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] py-3 text-sm font-semibold text-white hover:bg-[#4752C4]"
          >
            <MessageCircle className="h-5 w-5" />
            Entrar com Discord
          </a>
        ) : (
          <p className="text-sm text-amber-400">Configure DISCORD_CLIENT_ID no .env.local</p>
        )}

        <Link href="/" className="mt-4 block text-center text-xs text-screens-muted hover:text-white">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}

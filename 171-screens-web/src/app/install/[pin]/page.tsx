import { notFound } from "next/navigation";
import { Download, KeyRound, Monitor, Shield, Zap } from "lucide-react";
import { getScannerDb } from "@/lib/scanner-db";
import type { PinDoc } from "@/lib/scanner-types";
import { getScannerExePath } from "@/lib/scanner-installer";
import { InstallDownloadButton } from "@/components/scanner/InstallDownloadButton";

export default async function InstallPage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin: pinRaw } = await params;
  const pin = pinRaw.toUpperCase();

  const db = await getScannerDb();
  const doc = await db.collection<PinDoc>("pins").findOne({ pin });
  if (!doc) notFound();

  const expired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
  const hasExe = !!getScannerExePath();

  return (
    <div className="min-h-screen bg-[#050508] text-white scan-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.12)_0%,_transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <Monitor className="h-8 w-8 text-amber-400" />
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-amber-300/80">
            171 ScreenS
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Instalar Scanner</h1>
          <p className="mt-3 text-sm text-zinc-400">
            {doc.name ? `Telagem: ${doc.name}` : "Scan forense — pin já configurado no pacote"}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-amber-500/25 bg-zinc-950/80 p-8 backdrop-blur-sm">
          {expired ? (
            <p className="text-center text-red-400 font-semibold">Este pin expirou. Pede um novo pro telador.</p>
          ) : (
            <>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">Seu pin</p>
                <p className="font-mono text-3xl font-black tracking-[0.2em] text-white">{doc.pin}</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <Download className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  Baixa o pacote abaixo e extrai a pasta
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  Roda <strong className="text-white">Iniciar-171.bat</strong> — pin já vem no zip
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  Aguarda o scan terminar — telador vê o result ao vivo
                </li>
              </ul>

              <InstallDownloadButton pin={doc.pin} className="mt-8" />

              {!hasExe && (
                <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-200/80">
                  O .exe ainda não está no servidor — o zip vem com config + launcher. Coloque{" "}
                  <code className="text-amber-300">171-screens.exe</code> em{" "}
                  <code className="text-amber-300">public/scanner/</code> ou peça o exe ao telador.
                </p>
              )}
            </>
          )}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
          <KeyRound className="h-3 w-3" />
          Pin válido por 24h · {doc.game}
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { courseProducts, scannerProducts, DISCORD_URL } from "@/lib/products";
import { Shield, MessageCircle, Zap, Check, Scan } from "lucide-react";
import { TIER_ORDER, TIER_THEME } from "@/lib/tier-theme";
import { getLessonCounts } from "@/lib/lessons";
import type { CourseTier } from "@/lib/types";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const tierCompare = [
  { label: "Prefetch, Temp, Uso de Dados, AV", t1: true, t2: true, t3: true },
  { label: "Journal Trace + 20 detecções básicas", t1: true, t2: true, t3: true },
  { label: "Sysmon, UEFI, Serviços, Dump", t1: false, t2: true, t3: true },
  { label: "+30 aulas avançadas de bypass", t1: false, t2: true, t3: true },
  { label: "DMA, Remote deep, Hollowing, Fileless", t1: false, t2: false, t3: true },
  { label: "Grupo privado + labs ao vivo", t1: false, t2: false, t3: true },
];

const counts = getLessonCounts();

export default function ComprarPage() {
  return (
    <div className="p-8 md:p-10 max-w-6xl">
      <p className="text-xs uppercase tracking-widest text-screens-muted">Compras</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Planos & Scanner</h1>
      <p className="text-sm text-screens-muted mt-2 max-w-2xl">
        Cada curso libera com cargo no Discord. Scanner é produto separado — compra no Discord e recebe acesso.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-xs">
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
          {counts.tier1} aulas Básico
        </span>
        <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-400">
          {counts.tier2} aulas Advanced
        </span>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-violet-400">
          {counts.tier3} aulas Private
        </span>
        <span className="rounded-full border border-screens-border px-3 py-1 text-screens-muted">
          {counts.total} aulas no total
        </span>
      </div>

      <h2 className="mt-12 text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5 text-screens-accent" />
        Cursos de Telagem
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {courseProducts.map((t) => {
          const theme = TIER_THEME[t.id as CourseTier];
          return (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-2xl border-2 ${theme.borderStrong} bg-screens-card overflow-hidden ${
                t.id === "tier2" ? `ring-2 ${theme.ring}` : ""
              }`}
            >
              <div className={`px-6 py-5 ${theme.bgStrong} border-b ${theme.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${theme.dot}`} />
                  <p className={`text-sm font-bold uppercase ${theme.color}`}>
                    {t.badge}
                  </p>
                </div>
                <p className="mt-2 text-xl font-bold">{t.name}</p>
                <p className={`mt-2 text-4xl font-black ${theme.color}`}>{formatPrice(t.price)}</p>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <p className="text-sm text-screens-muted mb-4 leading-relaxed">{t.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {t.features.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-screens-muted">
                      <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${theme.icon}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${theme.btn}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Comprar no Discord
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-16 text-lg font-semibold flex items-center gap-2">
        <Scan className="h-5 w-5 text-amber-400" />
        171 ScreenS — Scanner
      </h2>
      <p className="text-sm text-screens-muted mt-1">Produtos do scanner — separados do curso.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {scannerProducts.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border ${p.border} bg-screens-card p-6 flex flex-col`}
          >
            <p className={`text-2xl font-black ${p.accent}`}>{formatPrice(p.price)}</p>
            <p className="mt-1 font-semibold text-white">{p.name}</p>
            <p className="mt-2 text-sm text-screens-muted flex-1">{p.description}</p>
            <ul className="mt-4 space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-screens-muted flex items-center gap-2">
                  <Check className={`h-3 w-3 ${p.accent}`} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-screens-border py-2.5 text-sm font-medium hover:bg-white/5"
            >
              <MessageCircle className="h-4 w-4" />
              Comprar scanner
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-screens-border overflow-hidden">
        <div className="px-6 py-4 border-b border-screens-border bg-screens-card/50">
          <h2 className="font-semibold">Comparativo dos cursos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-screens-border">
                <th className="text-left px-6 py-3 text-screens-muted font-normal">Conteúdo</th>
                {TIER_ORDER.map((id) => {
                  const th = TIER_THEME[id];
                  return (
                    <th key={id} className={`px-4 py-3 text-center font-bold ${th.color}`}>
                      {th.short}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tierCompare.map((row) => (
                <tr key={row.label} className="border-b border-screens-border/40">
                  <td className="px-6 py-3 text-screens-muted">{row.label}</td>
                  {[row.t1, row.t2, row.t3].map((ok, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {ok ? (
                        <Check className="h-4 w-4 mx-auto text-emerald-400" />
                      ) : (
                        <span className="text-screens-muted/30">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-screens-border bg-screens-card/40 p-6">
        <h2 className="font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-screens-accent" />
          Como funciona
        </h2>
        <ol className="mt-4 space-y-2 text-sm text-screens-muted list-decimal list-inside">
          <li>Abre ticket no Discord e escolhe curso ou scanner</li>
          <li>Paga via PIX — cargo setado pela equipe</li>
          <li>Entra em <Link href="/login" className="text-screens-accent hover:underline">/login</Link> com Discord</li>
          <li>Dashboard libera só teu tier · ou usa <strong className="text-white">Sincronizar cargo</strong></li>
        </ol>
        <p className="mt-4 text-xs text-screens-muted">
          Database só guarda tua conta e tier — as aulas ficam no site, não precisa DB pra conteúdo.
        </p>
      </div>
    </div>
  );
}

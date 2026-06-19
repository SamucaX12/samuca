import { redirect } from "next/navigation";
import { getSession, isOwner } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { OwnerKeysPanel } from "@/components/owner/OwnerKeysPanel";
import { Crown, Shield } from "lucide-react";

export default async function OwnerPage() {
  const session = await getSession();
  if (!session || !isOwner(session.role)) redirect("/dashboard");

  const db = await getDb();
  const logs = await db.collection("audit_logs").find({}).sort({ createdAt: -1 }).limit(20).toArray();

  return (
    <div className="min-h-full p-6 md:p-10 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 via-screens-card to-screens-bg p-8 mb-10 scan-grid">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10">
            <Crown className="h-7 w-7 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-fuchsia-400">Owner Control</p>
            <h1 className="text-3xl font-black">Painel Owner</h1>
            <p className="text-sm text-screens-muted mt-1">Gera keys · banir · validade · audit</p>
          </div>
        </div>
      </div>

      <OwnerKeysPanel />

      <section className="mt-10 rounded-2xl border border-screens-border overflow-hidden">
        <div className="flex items-center gap-2 border-b border-screens-border px-6 py-4 bg-screens-card/50">
          <Shield className="h-4 w-4 text-screens-muted" />
          <h2 className="font-bold">Audit logs recentes</h2>
        </div>
        <div className="max-h-[320px] overflow-y-auto divide-y divide-screens-border/50">
          {logs.map((log) => (
            <div key={String(log._id)} className="px-6 py-3 text-sm hover:bg-white/[0.02]">
              <p className="font-mono text-xs text-fuchsia-300">{String(log.action)}</p>
              <p className="text-screens-muted text-xs mt-1">{String(log.actorName ?? "")}</p>
              <p className="text-[10px] text-screens-muted/60 mt-1">
                {log.createdAt ? new Date(log.createdAt as Date).toLocaleString("pt-BR") : ""}
              </p>
            </div>
          ))}
          {!logs.length && <p className="p-6 text-screens-muted text-sm">Nenhum log.</p>}
        </div>
      </section>
    </div>
  );
}

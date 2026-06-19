import { redirect } from "next/navigation";
import { getSession, isOwner } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export default async function OwnerPage() {
  const session = await getSession();
  if (!session || !isOwner(session.role)) redirect("/dashboard");

  const db = await getDb();
  const logs = await db
    .collection("audit_logs")
    .find({})
    .sort({ createdAt: -1 })
    .limit(30)
    .toArray();

  return (
    <div className="p-8 md:p-10">
      <p className="text-xs uppercase tracking-widest text-screens-muted">Owner</p>
      <h1 className="mt-1 text-2xl font-bold">Painel Owner</h1>
      <p className="text-sm text-screens-muted">Audit logs e controle total</p>

      <section className="mt-8 rounded-2xl border border-screens-border overflow-hidden">
        <div className="border-b border-screens-border px-6 py-4">
          <h2 className="font-semibold">Audit logs</h2>
        </div>
        <div className="divide-y divide-screens-border/50 max-h-[60vh] overflow-y-auto">
          {logs.map((log) => (
            <div key={String(log._id)} className="px-6 py-3 text-sm">
              <p className="font-mono text-xs text-screens-accent">{String(log.action)}</p>
              <p className="text-screens-muted text-xs mt-1">
                {String(log.actorName)} → {String(log.targetId ?? "")}
              </p>
              <p className="text-[10px] text-screens-muted/60 mt-1">
                {log.createdAt ? new Date(log.createdAt as Date).toLocaleString("pt-BR") : ""}
              </p>
            </div>
          ))}
          {!logs.length && <p className="p-6 text-screens-muted text-sm">Nenhum log ainda.</p>}
        </div>
      </section>
    </div>
  );
}

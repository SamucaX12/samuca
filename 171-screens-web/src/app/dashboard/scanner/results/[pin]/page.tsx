import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getScannerDb } from "@/lib/scanner-db";
import { trimScanForDisplay } from "@/lib/scanner-helpers";
import { ScanDoc } from "@/lib/scanner-types";
import { ScanResultView } from "@/components/ScanResultView";
import { ArrowLeft } from "lucide-react";

export default async function ScannerResultDetailPage({
  params,
}: {
  params: Promise<{ pin: string }>;
}) {
  const { pin } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const pinCode = pin.toUpperCase();
  const db = await getScannerDb();

  const pinDoc = await db.collection("pins").findOne({ pin: pinCode });
  if (!pinDoc) notFound();

  const canView =
    pinDoc.ownerId === session.id ||
    session.role === "owner" ||
    session.role === "admin";
  if (!canView) notFound();

  const scanRaw = await db
    .collection<ScanDoc>("scans")
    .find({ pin: pinCode })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

  const { scan, totals } = scanRaw ? trimScanForDisplay(scanRaw) : { scan: null, totals: null };

  return (
    <div className="min-h-full">
      <div className="border-b border-screens-border bg-screens-card/40 px-5 py-5 md:px-8">
        <Link
          href="/dashboard/scanner/results"
          className="inline-flex items-center gap-2 text-sm text-screens-muted hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos results
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <h1 className="font-mono text-2xl font-black tracking-wider">{pinCode}</h1>
          {pinDoc.result && pinDoc.result !== "none" && (
            <span className="rounded-full border border-screens-border px-3 py-1 text-xs font-bold uppercase">
              {pinDoc.result}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-screens-muted">
          {pinDoc.name ?? "Sem nome"} · {pinDoc.game}
        </p>
      </div>
      {scan ? (
        <ScanResultView scan={scan} totals={totals!} pinResult={pinDoc.result} />
      ) : (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-10 text-center">
          <p className="text-lg font-semibold text-screens-muted">Scan ainda não recebido</p>
          <p className="mt-2 max-w-md text-sm text-screens-muted/80">
            O jogador precisa digitar o pin no scanner .exe e aguardar finalizar. Pins em andamento aparecem em{" "}
            <Link href="/dashboard/scanner/pins" className="text-screens-accent hover:underline">
              Pins
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

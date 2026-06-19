import { getSession } from "@/lib/auth";
import { getScannerDb } from "@/lib/scanner-db";
import { PinDoc } from "@/lib/scanner-types";
import { ResultsList } from "@/components/scanner/ResultsList";

export default async function ScannerResultsPage() {
  const session = await getSession();
  const db = await getScannerDb();
  const pins = await db
    .collection<PinDoc>("pins")
    .find({
      ownerId: session!.id,
      $or: [
        { status: "finished" },
        { status: "scanning" },
        { used: true },
        { result: { $in: ["clean", "warning", "suspicious", "cheating"] } },
      ],
    })
    .sort({ finishedAt: -1, createdAt: -1 })
    .limit(100)
    .toArray();

  return (
    <ResultsList
      initialPins={pins.map((p) => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt,
        finishedAt: p.finishedAt ?? null,
        expiresAt: p.expiresAt ?? null,
        scanningStartedAt: p.scanningStartedAt ?? null,
      }))}
    />
  );
}

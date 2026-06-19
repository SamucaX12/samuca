import { getSession } from "@/lib/auth";
import { getScannerDb } from "@/lib/scanner-db";
import { PinDoc } from "@/lib/scanner-types";
import { PinsTable } from "@/components/scanner/PinsTable";

export default async function ScannerPinsPage() {
  const session = await getSession();
  const db = await getScannerDb();
  const pins = await db
    .collection<PinDoc>("pins")
    .find({ ownerId: session!.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return (
    <PinsTable
      initialPins={pins.map((p) => ({ ...p, _id: p._id?.toString() }))}
    />
  );
}

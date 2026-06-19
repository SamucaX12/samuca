import { NextRequest, NextResponse } from "next/server";
import { buildInstallerZip } from "@/lib/scanner-installer";
import { getScannerDb } from "@/lib/scanner-db";
import type { PinDoc } from "@/lib/scanner-types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin: pinRaw } = await params;
  const pin = pinRaw.toUpperCase();

  const db = await getScannerDb();
  const doc = await db.collection<PinDoc>("pins").findOne({ pin });
  if (!doc) return NextResponse.json({ error: "pin_not_found" }, { status: 404 });

  if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) {
    return NextResponse.json({ error: "pin_expired" }, { status: 410 });
  }

  const zip = await buildInstallerZip({
    pin: doc.pin,
    name: doc.name,
    game: doc.game,
  });

  const filename = `171-screens-${doc.pin}.zip`;
  return new NextResponse(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

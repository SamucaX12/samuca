import { getSession } from "@/lib/auth";
import { hasScannerAccess } from "@/lib/scanner-access";
import { trimScanForDisplay } from "@/lib/scanner-helpers";
import { getScannerDb } from "@/lib/scanner-db";
import { ScanDoc } from "@/lib/scanner-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ pin: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasScannerAccess(session.scannerPlan, session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { pin } = await params;
  const db = await getScannerDb();
  const pinDoc = await db.collection("pins").findOne({ pin: pin.toUpperCase() });
  if (!pinDoc) return NextResponse.json({ error: "not found" }, { status: 404 });

  const canView =
    pinDoc.ownerId === session.id ||
    session.role === "owner" ||
    session.role === "admin";

  if (!canView) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const scanRaw = await db
    .collection<ScanDoc>("scans")
    .find({ pin: pin.toUpperCase() })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

  const scan = scanRaw ? trimScanForDisplay(scanRaw).scan : null;
  return NextResponse.json({ pin: pinDoc, scan });
}

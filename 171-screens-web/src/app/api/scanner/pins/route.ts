import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasScannerAccess } from "@/lib/scanner-access";
import { generatePin } from "@/lib/scanner-helpers";
import { buildInstallUrl } from "@/lib/scanner-installer";
import { getScannerDb } from "@/lib/scanner-db";
import { PinDoc } from "@/lib/scanner-types";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasScannerAccess(session.scannerPlan, session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const db = await getScannerDb();
  const pins = await db
    .collection<PinDoc>("pins")
    .find({ ownerId: session.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json({
    pins: pins.map((p) => ({ ...p, _id: p._id?.toString() })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasScannerAccess(session.scannerPlan, session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const name = body.name as string | undefined;
  const game = (body.game as string) || "FREE FIRE";

  const db = await getScannerDb();
  let pin = generatePin();
  for (let i = 0; i < 5; i++) {
    const exists = await db.collection("pins").findOne({ pin });
    if (!exists) break;
    pin = generatePin();
  }

  const doc = {
    pin,
    name: name || undefined,
    game,
    ownerId: session.id,
    ownerName: session.globalName || session.username,
    status: "pending" as const,
    used: false,
    result: "none" as const,
    visibility: "private" as const,
    enterpriseId: session.enterpriseId ?? null,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  await db.collection("pins").insertOne(doc);
  return NextResponse.json({
    pin: doc,
    installUrl: buildInstallUrl(doc.pin),
    downloadUrl: `/api/scanner/pins/${doc.pin}/download`,
  });
}

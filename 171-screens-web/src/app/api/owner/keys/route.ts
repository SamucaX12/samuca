import { NextRequest, NextResponse } from "next/server";
import { getSession, isOwner } from "@/lib/auth";
import {
  banScannerKey,
  createScannerKey,
  listScannerKeys,
  revokeUserScannerPlan,
} from "@/lib/scanner-keys";
import type { ScannerPlan } from "@/lib/scanner-types";

export async function GET() {
  const session = await getSession();
  if (!session || !isOwner(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const keys = await listScannerKeys(150);
  return NextResponse.json({
    keys: keys.map((k) => ({
      ...k,
      _id: k._id?.toString(),
      createdAt: k.createdAt,
      expiresAt: k.expiresAt,
      redeemedAt: k.redeemedAt,
      bannedAt: k.bannedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isOwner(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const plan = body.plan as Exclude<ScannerPlan, null>;
  const durationDays = Number(body.durationDays) || 30;
  const note = body.note as string | undefined;

  const valid: Exclude<ScannerPlan, null>[] = ["pro", "private", "enterprise", "team"];
  if (!valid.includes(plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  const key = await createScannerKey({
    plan,
    createdBy: session.id,
    durationDays,
    note,
  });

  return NextResponse.json({ ok: true, key });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !isOwner(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const action = body.action as string;

  if (action === "ban_key") {
    const key = body.key as string;
    if (!key) return NextResponse.json({ error: "key_required" }, { status: 400 });
    const ok = await banScannerKey(key, session.id);
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  if (action === "revoke_user") {
    const discordId = body.discordId as string;
    if (!discordId) return NextResponse.json({ error: "discordId_required" }, { status: 400 });
    await revokeUserScannerPlan(discordId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { redeemScannerKey } from "@/lib/scanner-keys";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const key = body.key as string | undefined;
  if (!key?.trim()) return NextResponse.json({ error: "key_required" }, { status: 400 });

  const result = await redeemScannerKey(key, {
    discordId: session.id,
    username: session.username,
    globalName: session.globalName,
    email: session.email,
  });

  if (!result.ok) {
    const status =
      result.error === "invalid_key" ? 404 : result.error === "key_banned" ? 403 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, plan: result.plan });
}

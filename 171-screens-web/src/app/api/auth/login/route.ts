import { getDiscordAuthUrl } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const url = getDiscordAuthUrl();
  if (!url) {
    return NextResponse.json({ error: "Discord OAuth not configured" }, { status: 500 });
  }
  return NextResponse.redirect(url);
}

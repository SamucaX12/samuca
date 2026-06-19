import { createSession, exchangeDiscordCodeFull, getAppUrl, syncUserTierFromOAuth, upsertUserFromDiscord } from "@/lib/auth";
import { ensureIndexes } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${getAppUrl()}/login?error=discord_denied`);
  }

  try {
    await ensureIndexes();
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const { user: discordUser, accessToken } = await exchangeDiscordCodeFull(code);
    let userDoc = await upsertUserFromDiscord(discordUser, ip);

    const syncedTier = await syncUserTierFromOAuth(discordUser.id, accessToken);
    if (syncedTier !== null) {
      userDoc = { ...userDoc, courseTier: syncedTier };
    }

    await createSession(userDoc);
    return NextResponse.redirect(`${getAppUrl()}/dashboard`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "auth_failed";
    return NextResponse.redirect(`${getAppUrl()}/login?error=${encodeURIComponent(msg)}`);
  }
}

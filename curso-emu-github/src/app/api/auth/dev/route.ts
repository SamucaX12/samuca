import { createSession, getAppUrl, upsertUserFromDiscord } from "@/lib/auth";
import { ensureIndexes } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import type { CourseTier } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && process.env.DEV_LOGIN !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const ownerId = process.env.OWNER_DISCORD_IDS?.split(",")[0]?.trim();
  if (!ownerId) {
    return NextResponse.json({ error: "OWNER_DISCORD_IDS not set" }, { status: 500 });
  }

  const tierParam = request.nextUrl.searchParams.get("tier");
  const previewTier: CourseTier | null =
    tierParam === "tier1" || tierParam === "tier2" || tierParam === "tier3" ? tierParam : "tier3";

  try {
    await ensureIndexes();
    let userDoc = await upsertUserFromDiscord({
      id: ownerId,
      username: "samuca_preview",
      global_name: "Samuca · Preview",
      avatar: null,
      email: "preview@local.dev",
    });

    userDoc = {
      ...userDoc,
      role: "owner",
      courseTier: previewTier,
    };

    await createSession(userDoc);
    return NextResponse.redirect(`${getAppUrl()}/dashboard`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "dev_login_failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

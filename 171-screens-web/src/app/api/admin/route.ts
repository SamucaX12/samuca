import { getSession, isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { isUserOnline } from "@/lib/presence";
import { CourseTier, UserDoc, UserRole } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const users = await db
    .collection<UserDoc>("users")
    .find({}, {
      projection: {
        discordId: 1,
        username: 1,
        globalName: 1,
        avatar: 1,
        email: 1,
        role: 1,
        courseTier: 1,
        banned: 1,
        lastSeenAt: 1,
        lastIp: 1,
        createdAt: 1,
      },
    })
    .sort({ lastSeenAt: -1, updatedAt: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({
    users: users.map((u) => ({
      discordId: u.discordId,
      username: u.username,
      globalName: u.globalName,
      avatar: u.avatar,
      email: u.email,
      role: u.role,
      courseTier: u.courseTier,
      banned: u.banned ?? false,
      lastSeenAt: u.lastSeenAt ?? null,
      lastIp: u.lastIp ?? null,
      online: isUserOnline(u.lastSeenAt),
      createdAt: u.createdAt ?? null,
    })),
    stats: {
      total: users.length,
      online: users.filter((u) => isUserOnline(u.lastSeenAt)).length,
      tier1: users.filter((u) => u.courseTier === "tier1").length,
      tier2: users.filter((u) => u.courseTier === "tier2").length,
      tier3: users.filter((u) => u.courseTier === "tier3").length,
      banned: users.filter((u) => u.banned).length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { discordId, courseTier, role, banned } = body as {
    discordId: string;
    courseTier?: CourseTier | null;
    role?: UserRole;
    banned?: boolean;
  };

  if (!discordId) {
    return NextResponse.json({ error: "discordId required" }, { status: 400 });
  }

  if (role === "owner" && session.role !== "owner") {
    return NextResponse.json({ error: "only owner can set owner" }, { status: 403 });
  }

  const $set: Partial<UserDoc> = { updatedAt: new Date() };
  if (courseTier !== undefined) $set.courseTier = courseTier;
  if (role !== undefined) $set.role = role;
  if (banned !== undefined) $set.banned = banned;

  const db = await getDb();
  await db.collection<UserDoc>("users").updateOne({ discordId }, { $set });

  await db.collection("audit_logs").insertOne({
    action: "admin_patch_user",
    actorId: session.id,
    actorName: session.globalName || session.username,
    targetId: discordId,
    changes: $set,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}

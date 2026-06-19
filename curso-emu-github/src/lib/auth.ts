import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getDb } from "./mongodb";
import { CourseTier, SessionUser, UserDoc, UserRole } from "./types";
import { fetchMemberRolesOAuth } from "./discord-roles";
import { applyTierToUser } from "./sync-tier";
export { hasTierAccess, tierLabel } from "./tier-access";

const COOKIE = "cursoemu_session";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET min 32 chars");
  return new TextEncoder().encode(s);
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";
}

function resolveOwner(id: string): UserRole {
  const owners = (process.env.OWNER_DISCORD_IDS ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (owners.includes(id)) return "owner";
  return "customer";
}

export async function upsertUserFromDiscord(
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    email?: string | null;
  },
  ip?: string
): Promise<UserDoc> {
  const db = await getDb();
  const existing = await db.collection<UserDoc>("users").findOne({ discordId: user.id });
  const baseRole = resolveOwner(user.id);

  if (existing) {
    await db.collection<UserDoc>("users").updateOne(
      { discordId: user.id },
      {
        $set: {
          username: user.username,
          globalName: user.global_name,
          avatar: user.avatar,
          email: user.email ?? existing.email,
          lastIp: ip ?? existing.lastIp,
          updatedAt: new Date(),
          ...(baseRole === "owner" ? { role: "owner" as UserRole } : {}),
        },
      }
    );
    return (await db.collection<UserDoc>("users").findOne({ discordId: user.id }))!;
  }

  const doc: UserDoc = {
    discordId: user.id,
    username: user.username,
    globalName: user.global_name,
    avatar: user.avatar,
    email: user.email ?? null,
    role: baseRole,
    courseTier: baseRole === "owner" ? "tier3" : null,
    banned: false,
    lastIp: ip,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.collection<UserDoc>("users").insertOne(doc);
  return doc;
}

export async function createSession(userDoc: UserDoc) {
  const payload: SessionUser = {
    id: userDoc.discordId,
    username: userDoc.username,
    globalName: userDoc.globalName ?? null,
    avatar: userDoc.avatar ?? null,
    email: userDoc.email ?? null,
    role: userDoc.role,
    courseTier: userDoc.courseTier ?? null,
    banned: userDoc.banned ?? false,
  };

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return payload;
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const user = payload as unknown as SessionUser;
    const db = await getDb();
    const dbUser = await db.collection<UserDoc>("users").findOne({ discordId: user.id });
    if (!dbUser || dbUser.banned) return null;

    const role = resolveOwner(user.id) === "owner" ? "owner" : dbUser.role;
    if (role === "owner" && dbUser.role !== "owner") {
      await db.collection<UserDoc>("users").updateOne(
        { discordId: user.id },
        { $set: { role: "owner", updatedAt: new Date() } }
      );
    }

    const courseTier =
      role === "owner" || role === "admin"
        ? (dbUser.courseTier ?? "tier3")
        : dbUser.courseTier;

    return {
      ...user,
      username: dbUser.username,
      globalName: dbUser.globalName ?? null,
      avatar: dbUser.avatar ?? null,
      email: dbUser.email ?? null,
      role,
      courseTier: courseTier ?? null,
      banned: dbUser.banned,
    };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export function getDiscordAuthUrl() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) return null;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${getAppUrl()}/api/auth/callback/discord`,
    response_type: "code",
    scope: "identify email guilds guilds.members.read",
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export async function exchangeDiscordCode(code: string) {
  const { user } = await exchangeDiscordCodeFull(code);
  return user;
}

export async function exchangeDiscordCodeFull(code: string) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("discord_not_configured");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: `${getAppUrl()}/api/auth/callback/discord`,
    client_secret: clientSecret,
  });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!tokenRes.ok) throw new Error("token_failed");

  const tokens = (await tokenRes.json()) as { access_token: string };
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) throw new Error("user_failed");

  const user = (await userRes.json()) as {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    email?: string;
  };

  return { user, accessToken: tokens.access_token };
}

/** Sincroniza tier do cargo Discord → MongoDB */
export async function syncUserTierFromOAuth(
  discordId: string,
  accessToken: string
): Promise<CourseTier | null> {
  const roleIds = await fetchMemberRolesOAuth(accessToken);
  if (!roleIds) return null;
  const { tier } = await applyTierToUser(discordId, roleIds, "oauth");
  return tier;
}

export function isAdmin(role: UserRole) {
  return role === "admin" || role === "owner";
}

export function isOwner(role: UserRole) {
  return role === "owner";
}

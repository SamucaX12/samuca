import type { CourseTier } from "./types";

export const DISCORD_ROLE_IDS = {
  tier1: process.env.DISCORD_ROLE_TIER1_ID ?? "1502645836117573724",
  tier2: process.env.DISCORD_ROLE_TIER2_ID ?? "1517319725988708403",
  tier3: process.env.DISCORD_ROLE_TIER3_ID ?? "1517319860835713198",
} as const;

export const DISCORD_ROLE_LABELS: Record<CourseTier, string> = {
  tier1: "Curso Básico",
  tier2: "Curso Advanced",
  tier3: "Curso Private",
};

/** Maior tier vence se o membro tiver mais de um cargo */
export function tierFromRoleIds(roleIds: string[]): CourseTier | null {
  if (roleIds.includes(DISCORD_ROLE_IDS.tier3)) return "tier3";
  if (roleIds.includes(DISCORD_ROLE_IDS.tier2)) return "tier2";
  if (roleIds.includes(DISCORD_ROLE_IDS.tier1)) return "tier1";
  return null;
}

export async function fetchMemberRolesOAuth(accessToken: string): Promise<string[] | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) return null;

  try {
    const res = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildId}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[discord-roles] oauth member:", res.status);
      return null;
    }

    const member = (await res.json()) as { roles: string[] };
    return member.roles ?? [];
  } catch (e) {
    console.error("[discord-roles] oauth error:", e);
    return null;
  }
}

export async function fetchMemberRolesBot(discordUserId: string): Promise<string[] | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!guildId || !botToken) return null;

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[discord-roles] bot member:", res.status);
      return null;
    }

    const member = (await res.json()) as { roles: string[] };
    return member.roles ?? [];
  } catch (e) {
    console.error("[discord-roles] bot error:", e);
    return null;
  }
}

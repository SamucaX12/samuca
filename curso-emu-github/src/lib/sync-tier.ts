import { getDb } from "./mongodb";
import { tierFromRoleIds, DISCORD_ROLE_LABELS } from "./discord-roles";
import type { CourseTier, UserDoc } from "./types";

export async function applyTierToUser(
  discordId: string,
  roleIds: string[],
  source: "oauth" | "bot" | "admin" = "oauth"
): Promise<{ tier: CourseTier | null; changed: boolean }> {
  const tier = tierFromRoleIds(roleIds);
  const db = await getDb();
  const user = await db.collection<UserDoc>("users").findOne({ discordId });

  if (!user) {
    return { tier, changed: false };
  }

  if (user.role === "owner") {
    return { tier: user.courseTier ?? "tier3", changed: false };
  }

  const changed = user.courseTier !== tier;

  if (changed) {
    await db.collection<UserDoc>("users").updateOne(
      { discordId },
      { $set: { courseTier: tier, updatedAt: new Date() } }
    );

    await db.collection("audit_logs").insertOne({
      action: "tier_sync",
      source,
      targetId: discordId,
      tier,
      label: tier ? DISCORD_ROLE_LABELS[tier] : null,
      roleIds,
      createdAt: new Date(),
    });
  }

  return { tier, changed };
}

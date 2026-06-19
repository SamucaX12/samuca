import { getDb } from "./mongodb";
import { tierFromRoleIds, DISCORD_ROLE_LABELS, isBoosterOnlyAccess, BOOSTER_ACCESS_LABEL } from "./discord-roles";
import type { CourseTier, UserDoc, CourseAccessSource } from "./types";

export async function applyTierToUser(
  discordId: string,
  roleIds: string[],
  source: "oauth" | "bot" | "admin" = "oauth"
): Promise<{ tier: CourseTier | null; changed: boolean }> {
  const tier = tierFromRoleIds(roleIds);
  const accessSource: CourseAccessSource = tier
    ? isBoosterOnlyAccess(roleIds)
      ? "booster"
      : "paid"
    : null;
  const db = await getDb();
  const user = await db.collection<UserDoc>("users").findOne({ discordId });

  if (!user) {
    return { tier, changed: false };
  }

  if (user.role === "owner") {
    return { tier: user.courseTier ?? "tier3", changed: false };
  }

  const changed = user.courseTier !== tier || user.accessSource !== accessSource;

  if (changed) {
    await db.collection<UserDoc>("users").updateOne(
      { discordId },
      { $set: { courseTier: tier, accessSource, updatedAt: new Date() } }
    );

    const label =
      accessSource === "booster" && tier === "tier1"
        ? BOOSTER_ACCESS_LABEL
        : tier
          ? DISCORD_ROLE_LABELS[tier]
          : null;

    await db.collection("audit_logs").insertOne({
      action: "tier_sync",
      source,
      targetId: discordId,
      tier,
      accessSource,
      label,
      roleIds,
      createdAt: new Date(),
    });
  }

  return { tier, changed };
}

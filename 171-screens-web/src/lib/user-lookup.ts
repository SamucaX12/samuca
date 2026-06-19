import { getDb } from "./mongodb";
import { getScannerDb } from "./scanner-db";
import type { UserDoc } from "./types";

function emailRegex(email: string) {
  const normalized = email.trim().toLowerCase();
  return new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

export type AccountLookup = {
  discordId: string;
  email: string;
  username: string;
  globalName: string | null;
};

export async function findAccountByEmail(email: string): Promise<AccountLookup | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const regex = emailRegex(normalized);
  const scannerDb = await getScannerDb();
  const scannerUser = await scannerDb
    .collection<{ discordId: string; username?: string; globalName?: string | null; email?: string | null }>("users")
    .findOne({ email: { $regex: regex } });

  if (scannerUser?.discordId) {
    return {
      discordId: scannerUser.discordId,
      email: normalized,
      username: scannerUser.username ?? normalized.split("@")[0],
      globalName: scannerUser.globalName ?? null,
    };
  }

  const courseDb = await getDb();
  const courseUser = await courseDb.collection<UserDoc>("users").findOne({ email: { $regex: regex } });
  if (!courseUser) return null;

  return {
    discordId: courseUser.discordId,
    email: normalized,
    username: courseUser.username,
    globalName: courseUser.globalName,
  };
}

export async function ensureScannerUserProfile(user: AccountLookup) {
  const db = await getScannerDb();
  await db.collection("users").updateOne(
    { discordId: user.discordId },
    {
      $set: {
        discordId: user.discordId,
        username: user.username,
        globalName: user.globalName,
        email: user.email,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

import crypto from "crypto";
import { getScannerDb } from "./scanner-db";
import type { ScannerKeyDoc, ScannerPlan } from "./scanner-types";

export function generateScannerKey(): string {
  const seg = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `171-${seg()}-${seg()}-${seg()}`;
}

export async function createScannerKey(opts: {
  plan: Exclude<ScannerPlan, null>;
  createdBy: string;
  durationDays?: number;
  note?: string;
}): Promise<ScannerKeyDoc> {
  const db = await getScannerDb();
  const durationDays = opts.durationDays ?? 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  let key = generateScannerKey();
  for (let i = 0; i < 8; i++) {
    const exists = await db.collection<ScannerKeyDoc>("keys").findOne({ key });
    if (!exists) break;
    key = generateScannerKey();
  }

  const doc: ScannerKeyDoc = {
    key,
    plan: opts.plan,
    status: "active",
    durationDays,
    expiresAt,
    createdAt: new Date(),
    createdBy: opts.createdBy,
    note: opts.note,
    redeemedBy: null,
    redeemedAt: null,
  };

  await db.collection<ScannerKeyDoc>("keys").insertOne(doc);
  return doc;
}

export async function listScannerKeys(limit = 100): Promise<ScannerKeyDoc[]> {
  const db = await getScannerDb();
  return db
    .collection<ScannerKeyDoc>("keys")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function banScannerKey(key: string, actorId: string): Promise<boolean> {
  const db = await getScannerDb();
  const res = await db.collection<ScannerKeyDoc>("keys").updateOne(
    { key: key.toUpperCase() },
    { $set: { status: "banned", bannedAt: new Date(), bannedBy: actorId } }
  );
  return res.matchedCount > 0;
}

export async function revokeUserScannerPlan(discordId: string): Promise<void> {
  const db = await getScannerDb();
  await db.collection("users").updateOne(
    { discordId },
    { $set: { plan: null, enterpriseId: null, updatedAt: new Date() } }
  );
}

export async function redeemScannerKey(
  keyRaw: string,
  user: { discordId: string; username: string; globalName?: string | null; email?: string | null }
): Promise<{ ok: true; plan: ScannerPlan } | { ok: false; error: string }> {
  const key = keyRaw.trim().toUpperCase();
  if (!key) return { ok: false, error: "key_required" };

  const db = await getScannerDb();
  const doc = await db.collection<ScannerKeyDoc>("keys").findOne({ key });

  if (!doc) return { ok: false, error: "invalid_key" };
  if (doc.status === "banned") return { ok: false, error: "key_banned" };
  if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) {
    await db.collection<ScannerKeyDoc>("keys").updateOne({ key }, { $set: { status: "expired" } });
    return { ok: false, error: "key_expired" };
  }
  if (doc.redeemedBy && doc.redeemedBy !== user.discordId) {
    return { ok: false, error: "key_already_used" };
  }

  const plan = doc.plan;

  await db.collection("users").updateOne(
    { discordId: user.discordId },
    {
      $set: {
        discordId: user.discordId,
        username: user.username,
        globalName: user.globalName ?? null,
        email: user.email ?? null,
        plan,
        enterpriseId: null,
        keyId: key,
        planExpiresAt: doc.expiresAt ?? null,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  if (!doc.redeemedBy) {
    await db.collection<ScannerKeyDoc>("keys").updateOne(
      { key },
      { $set: { status: "redeemed", redeemedBy: user.discordId, redeemedAt: new Date() } }
    );
  }

  return { ok: true, plan };
}

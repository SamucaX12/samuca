import { getScannerDb } from "./scanner-db";
import { findAccountByEmail, ensureScannerUserProfile } from "./user-lookup";
import {
  CustomPattern,
  EnterpriseDoc,
  GlobalConfigDoc,
  PinDoc,
  ProScannerConfigDoc,
  ScanDoc,
  ScanDisplayTotals,
  ScannerPlan,
} from "./scanner-types";

const DEFAULT_CONFIG: GlobalConfigDoc = {
  scannerName: "171 ScreenS",
  primaryColor: "#7dd3fc",
  spinnerColor1: "#bae6fd",
  spinnerColor2: "#7dd3fc",
  spinnerColor3: "#38bdf8",
  loadingPhrases: ["Analisando artefatos...", "Verificando bypass...", "Cruzando evidências..."],
  customPatterns: [],
  publicStrings: [],
  publicCustomDetect: [],
};

export function planFeatures(plan: ScannerPlan) {
  const base = {
    customImgui: false,
    customColors: false,
    customLogo: false,
    customStrings: false,
    customDetect: false,
    dmaDetect: false,
    uefiDetect: false,
    yaraMethod: false,
    customLoading: false,
  };
  if (plan === "pro") {
    return base;
  }
  if (plan === "private") {
    return {
      ...base,
      customImgui: true,
      customColors: true,
      customLogo: true,
      customStrings: true,
      customDetect: true,
      customLoading: true,
    };
  }
  if (plan === "enterprise" || plan === "team") {
    return {
      customImgui: true,
      customColors: true,
      customLogo: true,
      customStrings: true,
      customDetect: false,
      dmaDetect: true,
      uefiDetect: true,
      yaraMethod: true,
      customLoading: true,
    };
  }
  return base;
}

export async function getGlobalConfig(enterpriseId?: string | null): Promise<GlobalConfigDoc> {
  const db = await getScannerDb();

  if (enterpriseId) {
    const ent = await db.collection<EnterpriseDoc>("enterprises").findOne({
      $or: [{ enterpriseId }, { ownerId: enterpriseId }],
    });
    if (ent?.config) {
      return {
        ...DEFAULT_CONFIG,
        ...ent.config,
        scannerName: ent.config.scannerName || ent.name || "171 ScreenS",
        customPatterns: ent.config.customPatterns ?? [],
      };
    }
  }

  const doc = await db.collection<GlobalConfigDoc & { key: string }>("config").findOne({ key: "global" });
  return doc ? { ...DEFAULT_CONFIG, ...doc } : DEFAULT_CONFIG;
}

export async function saveGlobalConfig(config: Partial<GlobalConfigDoc>) {
  const db = await getScannerDb();
  await db.collection("config").updateOne(
    { key: "global" },
    { $set: { ...config, key: "global", updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function getProConfig(ownerId: string): Promise<ProScannerConfigDoc> {
  const db = await getScannerDb();
  const doc = await db.collection<ProScannerConfigDoc>("pro_scanner_configs").findOne({ ownerId });
  return doc ?? { ownerId, strings: [], customDetect: [], updatedAt: new Date() };
}

export async function saveProConfig(ownerId: string, data: Partial<ProScannerConfigDoc>) {
  const db = await getScannerDb();
  await db.collection("pro_scanner_configs").updateOne(
    { ownerId },
    { $set: { ownerId, ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function getEnterpriseByOwnerId(ownerId: string): Promise<EnterpriseDoc | null> {
  const db = await getScannerDb();
  return db.collection<EnterpriseDoc>("enterprises").findOne({ ownerId });
}

export async function getEnterpriseForUser(userId: string): Promise<EnterpriseDoc | null> {
  const db = await getScannerDb();
  const owned = await db.collection<EnterpriseDoc>("enterprises").findOne({ ownerId: userId });
  if (owned) return owned;
  return db.collection<EnterpriseDoc>("enterprises").findOne({ memberIds: userId });
}

export async function setupEnterprise(
  ownerId: string,
  name: string,
  plan: "enterprise" | "team"
): Promise<{ ok: true; enterprise: EnterpriseDoc } | { ok: false; error: string }> {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) return { ok: false, error: "name_too_short" };
  if (trimmed.length > 48) return { ok: false, error: "name_too_long" };

  const db = await getScannerDb();
  const existing = await db.collection<EnterpriseDoc>("enterprises").findOne({ ownerId });
  if (existing) return { ok: false, error: "already_setup" };

  const features = planFeatures(plan);
  const newEnt: EnterpriseDoc = {
    enterpriseId: ownerId,
    name: trimmed,
    ownerId,
    plan,
    memberIds: [ownerId],
    memberEmails: [],
    config: { ...DEFAULT_CONFIG, scannerName: trimmed },
    features: {
      customImgui: features.customImgui,
      customColors: features.customColors,
      customLogo: features.customLogo,
      customStrings: features.customStrings,
      customDetect: features.customDetect,
      dmaDetect: features.dmaDetect,
      uefiDetect: features.uefiDetect,
      yaraMethod: features.yaraMethod,
      customLoading: true,
    },
    createdAt: new Date(),
  };
  await db.collection<EnterpriseDoc>("enterprises").insertOne(newEnt);
  await db.collection("users").updateOne(
    { discordId: ownerId },
    { $set: { enterpriseId: ownerId, updatedAt: new Date() } }
  );
  return { ok: true, enterprise: newEnt };
}

export async function removeEnterpriseMember(
  ownerId: string,
  memberDiscordId: string
): Promise<{ ok: boolean; error?: string }> {
  const db = await getScannerDb();
  const ent = await db.collection<EnterpriseDoc>("enterprises").findOne({ ownerId });
  if (!ent) return { ok: false, error: "enterprise_not_found" };
  if (memberDiscordId === ownerId) return { ok: false, error: "cannot_remove_owner" };
  if (!ent.memberIds.includes(memberDiscordId)) return { ok: false, error: "not_member" };

  const user = await db.collection("users").findOne({ discordId: memberDiscordId });
  const email = user?.email?.trim().toLowerCase();

  const pull: Record<string, unknown> = { memberIds: memberDiscordId };
  if (email) pull.memberEmails = email;

  await db.collection<EnterpriseDoc>("enterprises").updateOne(
    { ownerId },
    { $pull: pull, $set: { updatedAt: new Date() } }
  );

  await db.collection("users").updateOne(
    { discordId: memberDiscordId },
    { $set: { enterpriseId: null, plan: null, updatedAt: new Date() } }
  );

  return { ok: true };
}

export async function updateEnterpriseName(
  ownerId: string,
  name: string
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) return { ok: false, error: "name_too_short" };
  if (trimmed.length > 48) return { ok: false, error: "name_too_long" };

  const db = await getScannerDb();
  const res = await db.collection<EnterpriseDoc>("enterprises").updateOne(
    { ownerId },
    { $set: { name: trimmed, updatedAt: new Date(), "config.scannerName": trimmed } }
  );
  return res.matchedCount > 0 ? { ok: true } : { ok: false, error: "enterprise_not_found" };
}

export async function saveEnterpriseConfig(ownerId: string, config: Partial<GlobalConfigDoc>) {
  const db = await getScannerDb();
  await db.collection("enterprises").updateOne(
    { ownerId },
    { $set: { config: { ...config, updatedAt: new Date() }, updatedAt: new Date() } }
  );
}

export async function addEnterpriseMemberByEmail(
  ownerId: string,
  email: string
): Promise<{ ok: boolean; error?: string; member?: { discordId: string; email: string } }> {
  const db = await getScannerDb();
  const ent = await db.collection<EnterpriseDoc>("enterprises").findOne({ ownerId });
  if (!ent) return { ok: false, error: "enterprise_not_found" };

  const maxMembers = ent.plan === "team" ? 2 : 5;
  if ((ent.memberIds?.length ?? 0) >= maxMembers) {
    return { ok: false, error: "member_limit" };
  }

  const normalized = email.trim().toLowerCase();
  const account = await findAccountByEmail(normalized);
  if (!account) return { ok: false, error: "user_not_found" };

  await ensureScannerUserProfile(account);

  if (ent.memberIds.includes(account.discordId)) {
    return { ok: false, error: "already_member" };
  }

  await db.collection<EnterpriseDoc>("enterprises").updateOne(
    { ownerId },
    {
      $addToSet: {
        memberIds: account.discordId,
        memberEmails: normalized,
      },
      $set: { updatedAt: new Date() },
    }
  );

  await db.collection("users").updateOne(
    { discordId: account.discordId },
    { $set: { enterpriseId: ent.enterpriseId, plan: ent.plan, updatedAt: new Date() } },
    { upsert: true }
  );

  return { ok: true, member: { discordId: account.discordId, email: normalized } };
}

export function generatePin(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pin = "";
  for (let i = 0; i < 8; i++) pin += chars[Math.floor(Math.random() * chars.length)];
  return pin;
}

export async function logScannerAudit(
  action: string,
  actorId: string,
  actorName: string,
  extra?: { targetId?: string; targetName?: string; details?: string }
) {
  const db = await getScannerDb();
  await db.collection("audit_logs").insertOne({
    action,
    actorId,
    actorName,
    ...extra,
    createdAt: new Date(),
  });
}

const DETECTION_LIMIT = 60;
const LIST_LIMIT = 80;

function sliceList<T>(arr: T[] | undefined, limit: number) {
  const total = arr?.length ?? 0;
  return { items: total > limit ? arr!.slice(0, limit) : (arr ?? []), total };
}

export function serializeScanForClient(scan: ScanDoc): ScanDoc {
  const { createdAt, ...rest } = scan;
  return JSON.parse(
    JSON.stringify({
      ...rest,
      createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    })
  ) as ScanDoc;
}

export function trimScanForDisplay(scan: ScanDoc): { scan: ScanDoc; totals: ScanDisplayTotals } {
  const detections = sliceList(scan.detections ?? [], DETECTION_LIMIT);
  const warnings = sliceList(scan.warnings ?? [], DETECTION_LIMIT);
  const suspicious = sliceList(scan.suspicious ?? [], DETECTION_LIMIT);
  const integrity = sliceList(scan.integrity ?? [], DETECTION_LIMIT);
  const bamList = sliceList(scan.bamList, LIST_LIMIT);
  const bypassList = sliceList(scan.bypassList ?? scan.unsignedList, LIST_LIMIT);
  const powershellHistory = sliceList(scan.powershellHistory, LIST_LIMIT);
  const recordingSoftware = sliceList(scan.recordingSoftware, LIST_LIMIT);
  const prefetchList = sliceList(scan.prefetchList, LIST_LIMIT);
  const processList = sliceList(scan.processList, LIST_LIMIT);
  const adminLogs = sliceList(scan.adminLogs, LIST_LIMIT);
  const browserList = sliceList(scan.browserList, LIST_LIMIT);
  const usbList = sliceList(scan.usbList, LIST_LIMIT);

  return {
    scan: serializeScanForClient({
      ...scan,
      detections: detections.items,
      warnings: warnings.items,
      suspicious: suspicious.items,
      integrity: integrity.items,
      bamList: bamList.items,
      bypassList: bypassList.items,
      powershellHistory: powershellHistory.items,
      recordingSoftware: recordingSoftware.items,
      prefetchList: prefetchList.items,
      processList: processList.items,
      adminLogs: adminLogs.items,
      browserList: browserList.items,
      usbList: usbList.items,
    }),
    totals: {
      detections: detections.total,
      warnings: warnings.total,
      suspicious: suspicious.total,
      integrity: integrity.total,
      bamList: bamList.total,
      bypassList: bypassList.total,
      powershellHistory: powershellHistory.total,
      recordingSoftware: recordingSoftware.total,
      prefetchList: prefetchList.total,
      processList: processList.total,
      adminLogs: adminLogs.total,
      browserList: browserList.total,
      usbList: usbList.total,
    },
  };
}
